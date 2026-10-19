-- ============================================================================
-- HFTS Hub — 003: apply-and-approve dispatch, ratings, and rating-tiered access
-- Run AFTER 001 and 002.
--   psql "$SUPABASE_DB_URL" -f 003_applications_ratings.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Schema additions
-- ----------------------------------------------------------------------------
alter table public.service_tickets
  add column if not exists premium boolean not null default false;   -- set by dispatcher

alter table public.operators
  add column if not exists rating_avg numeric(3,2),                  -- maintained by trigger
  add column if not exists rating_count integer not null default 0;  -- visible ratings only

-- Tiers decide visibility window and premium access. Highest tier the operator qualifies for wins.
create table if not exists public.operator_tiers (
  tier                      integer primary key,
  name                      text not null,
  min_rating                numeric(3,2) not null,
  min_ratings               integer not null,
  visibility_delay_minutes  integer not null check (visibility_delay_minutes >= 0),
  premium_access            boolean not null
);

insert into public.operator_tiers (tier, name, min_rating, min_ratings, visibility_delay_minutes, premium_access)
values
  (1, 'Preferred', 4.70, 10,  0,   true),
  (2, 'Standard',  4.00,  3,  60,  false),
  (3, 'New',       0.00,  0, 120,  false)
on conflict (tier) do nothing;

create table if not exists public.ticket_applications (
  id            uuid primary key default gen_random_uuid(),
  ticket_id     uuid not null references public.service_tickets(id) on delete cascade,
  operator_id   uuid not null references public.operators(profile_id) on delete cascade,
  quoted_cents  integer check (quoted_cents is null or quoted_cents > 0),  -- optional operator price
  note          text,
  status        text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected', 'withdrawn')),
  decided_by    uuid references public.users(id) on delete set null,
  decided_at    timestamptz,
  created_at    timestamptz not null default now(),
  unique (ticket_id, operator_id)
);
create index if not exists ticket_applications_ticket_idx on public.ticket_applications (ticket_id);

create table if not exists public.operator_ratings (
  id            uuid primary key default gen_random_uuid(),
  ticket_id     uuid not null unique references public.service_tickets(id) on delete cascade,
  operator_id   uuid not null references public.operators(profile_id) on delete cascade,
  rated_by      uuid references public.users(id) on delete set null,
  stars         integer not null check (stars between 1 and 5),
  comment       text,
  is_visible    boolean not null default true,   -- staff can hide a rating during moderation
  created_at    timestamptz not null default now()
);
create index if not exists operator_ratings_operator_idx on public.operator_ratings (operator_id);

alter table public.operator_tiers       enable row level security;
alter table public.ticket_applications  enable row level security;
alter table public.operator_ratings     enable row level security;

-- ----------------------------------------------------------------------------
-- 2. Helpers
-- ----------------------------------------------------------------------------

-- Tier for the calling operator: highest tier whose rating and count thresholds they meet.
create or replace function public.current_operator_tier()
returns public.operator_tiers
language sql
stable
security definer
set search_path = public
as $$
  select ot.*
  from public.operators o
  join public.operator_tiers ot
    on coalesce(o.rating_avg, 0) >= ot.min_rating
   and o.rating_count >= ot.min_ratings
  where o.profile_id = auth.uid()
  order by ot.tier asc
  limit 1
$$;

-- Pool: unclaimed, in intake, serviceable by county and availability, past the tier's
-- visibility window, and premium only for tiers with premium access.
create or replace function public.ticket_in_operator_pool(p_ticket_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.service_tickets t
    cross join public.current_operator_tier() ot
    where t.id = p_ticket_id
      and t.assigned_operator_id is null
      and t.status in ('submitted', 'triaged')
      and public.operator_can_serve(t.location_id)
      and ot.tier is not null
      and t.created_at + make_interval(mins => ot.visibility_delay_minutes) <= now()
      and (not t.premium or ot.premium_access)
  )
$$;

-- Redefine 002 helpers so they follow the pool rules above.
create or replace function public.operator_can_see_location(p_location_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.service_tickets t
    where t.location_id = p_location_id
      and (t.assigned_operator_id = auth.uid() or public.ticket_in_operator_pool(t.id))
  )
$$;

create or replace function public.operator_can_see_node(p_node_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.service_tickets t
    where t.node_id = p_node_id
      and (t.assigned_operator_id = auth.uid() or public.ticket_in_operator_pool(t.id))
  )
$$;

-- ----------------------------------------------------------------------------
-- 3. Guards
-- ----------------------------------------------------------------------------

-- Operators no longer claim. Assignment comes only from approve_application().
create or replace function public.guard_ticket_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r text := public.current_hfts_role();
begin
  new.updated_at := now();

  if r = 'operator' then
    if new.assigned_operator_id is distinct from old.assigned_operator_id then
      raise exception 'assignment is handled through dispatch approval';
    end if;

    if new.status is distinct from old.status
       and new.status not in ('triaged', 'accepted', 'in_progress', 'completed') then
      raise exception 'operators may only set status to triaged, accepted, in_progress, or completed';
    end if;

    if new.payout_cents is distinct from old.payout_cents
       or new.verified_at is distinct from old.verified_at
       or new.premium is distinct from old.premium then
      raise exception 'operators cannot change payout, verification, or premium flag';
    end if;

    if new.kind is distinct from old.kind and old.status not in ('submitted', 'triaged') then
      raise exception 'ticket kind can only be changed during triage';
    end if;
  end if;

  return new;
end $$;

create or replace function public.guard_operator_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_hfts_role() = 'operator' then
    if new.profile_id is distinct from old.profile_id
       or new.stripe_account_id is distinct from old.stripe_account_id
       or new.stripe_payouts_enabled is distinct from old.stripe_payouts_enabled
       or new.created_at is distinct from old.created_at
       or new.rating_avg is distinct from old.rating_avg
       or new.rating_count is distinct from old.rating_count then
      raise exception 'operators cannot change identity, payout, or rating fields';
    end if;
  end if;
  return new;
end $$;

-- ----------------------------------------------------------------------------
-- 4. Approval: atomic, one winner, others rejected
-- ----------------------------------------------------------------------------
create or replace function public.approve_application(p_application_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.ticket_applications;
begin
  if public.current_hfts_role() not in ('admin', 'dispatcher') then
    raise exception 'only dispatch can approve applications';
  end if;

  select * into a from public.ticket_applications where id = p_application_id for update;
  if not found or a.status <> 'pending' then
    raise exception 'application is not pending';
  end if;

  -- Lock the ticket and make sure it's still open.
  perform 1 from public.service_tickets t
    where t.id = a.ticket_id
      and t.assigned_operator_id is null
      and t.status in ('submitted', 'triaged')
    for update;
  if not found then
    raise exception 'ticket is no longer open';
  end if;

  update public.service_tickets
     set assigned_operator_id = a.operator_id,
         status = 'assigned',
         payout_cents = coalesce(a.quoted_cents, payout_cents)
   where id = a.ticket_id;

  update public.ticket_applications
     set status = 'approved', decided_by = auth.uid(), decided_at = now()
   where id = a.id;

  update public.ticket_applications
     set status = 'rejected', decided_by = auth.uid(), decided_at = now()
   where ticket_id = a.ticket_id and id <> a.id and status = 'pending';
end $$;

-- ----------------------------------------------------------------------------
-- 5. Ratings roll-up
-- ----------------------------------------------------------------------------
create or replace function public.recompute_operator_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.operator_id, old.operator_id);
begin
  update public.operators o
     set rating_avg = (
           select round(avg(r.stars)::numeric, 2)
           from public.operator_ratings r
           where r.operator_id = o.profile_id and r.is_visible),
         rating_count = (
           select count(*)::integer
           from public.operator_ratings r
           where r.operator_id = o.profile_id and r.is_visible)
   where o.profile_id = target;
  return null;
end $$;

drop trigger if exists trg_recompute_rating on public.operator_ratings;
create trigger trg_recompute_rating
  after insert or update or delete on public.operator_ratings
  for each row execute function public.recompute_operator_rating();

-- ----------------------------------------------------------------------------
-- 6. Policies
-- ----------------------------------------------------------------------------

-- operator_tiers: any staff reads, admin writes
create policy operator_tiers_select on public.operator_tiers for select using (
  public.current_hfts_role() is not null
);
create policy operator_tiers_admin_write on public.operator_tiers for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);

-- ticket_applications
create policy applications_select on public.ticket_applications for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or operator_id = auth.uid()
);
-- Apply only to tickets in the caller's pool (county, availability, tier window, premium gate).
create policy applications_insert on public.ticket_applications for insert with check (
  operator_id = auth.uid()
  and status = 'pending'
  and public.ticket_in_operator_pool(ticket_id)
);
-- Operators may withdraw their own pending application. Staff decide via approve_application or reject.
create policy applications_update on public.ticket_applications for update using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or (operator_id = auth.uid() and status = 'pending')
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or (operator_id = auth.uid() and status = 'withdrawn')
);

-- operator_ratings: staff and the rated operator read; the host or dispatch rates after verification
create policy ratings_select on public.operator_ratings for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or operator_id = auth.uid()
);
create policy ratings_insert on public.operator_ratings for insert with check (
  rated_by = auth.uid()
  and exists (
    select 1 from public.service_tickets t
    where t.id = operator_ratings.ticket_id
      and t.assigned_operator_id = operator_ratings.operator_id
      and t.status in ('verified', 'paid')
      and (
        public.current_hfts_role() in ('admin', 'dispatcher')
        or t.submitted_by = auth.uid()
        or public.is_location_contact(t.location_id)
      )
  )
);
-- Only staff can moderate (hide or correct) a rating.
create policy ratings_staff_update on public.operator_ratings for update using (
  public.current_hfts_role() in ('admin', 'dispatcher')
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
);

-- ----------------------------------------------------------------------------
-- Notes
-- * Claim is gone. Operators apply; dispatch approves via approve_application().
-- * Tier windows are measured from ticket created_at. Premium tickets are visible
--   only to tiers with premium_access.
-- * To change tier thresholds, update operator_tiers. No migration needed.
-- * A host can rate only after the ticket reaches verified. Hidden ratings drop
--   out of rating_avg and rating_count automatically.
-- ============================================================================
