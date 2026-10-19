-- ============================================================================
-- HFTS Hub — consolidated schema (replaces 001, 002, 003)
-- Single fresh migration. Creates only; no removals.
-- Uses existing public.users as the role table (id -> auth.users).
-- Adds restrictive write rules on blog_posts; existing policies are untouched.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Roles on the existing users table
-- ----------------------------------------------------------------------------
alter table public.users add constraint users_role_check
  check (role in ('admin', 'dispatcher', 'operator', 'location_contact', 'blogger'));

-- ----------------------------------------------------------------------------
-- 2. Tables
-- ----------------------------------------------------------------------------
create table public.operators (
  profile_id             uuid primary key references public.users(id) on delete cascade,
  service_counties       text[] not null default '{}',
  skills                 text[] not null default '{}',
  is_available           boolean not null default false,
  stripe_account_id      text unique,
  stripe_payouts_enabled boolean not null default false,
  rating_avg             numeric(3,2),
  rating_count           integer not null default 0,
  created_at             timestamptz not null default now()
);

create table public.locations (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  address             text not null,
  county              text not null,
  contact_profile_id  uuid references public.users(id) on delete set null,
  contact_name        text,
  contact_email       text,
  contact_phone       text,
  status              text not null default 'prospect'
                      check (status in ('prospect', 'secured', 'active', 'inactive')),
  created_at          timestamptz not null default now()
);

create table public.nodes (
  id                  uuid primary key default gen_random_uuid(),
  location_id         uuid references public.locations(id) on delete set null,
  serial_number       text not null unique,
  model               text,
  device_fingerprint  text unique,
  status              text not null default 'provisioning'
                      check (status in ('provisioning', 'online', 'offline', 'fault', 'maintenance', 'retired')),
  last_seen_at        timestamptz,
  last_telemetry      jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now()
);

create table public.node_events (
  id          bigint generated always as identity primary key,
  node_id     uuid not null references public.nodes(id) on delete cascade,
  event_type  text not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index node_events_node_time_idx on public.node_events (node_id, created_at desc);

create table public.inventory_items (
  id                  uuid primary key default gen_random_uuid(),
  sku                 text not null unique,
  name                text not null,
  category            text,
  unit_cost_cents     integer not null default 0 check (unit_cost_cents >= 0),
  sale_price_cents    integer not null default 0 check (sale_price_cents >= 0),
  reorder_threshold   integer not null default 0 check (reorder_threshold >= 0),
  created_at          timestamptz not null default now()
);

create table public.node_slots (
  id                  uuid primary key default gen_random_uuid(),
  node_id             uuid not null references public.nodes(id) on delete cascade,
  slot_code           text not null,
  inventory_item_id   uuid references public.inventory_items(id) on delete set null,
  capacity            integer not null default 0 check (capacity >= 0),
  quantity_on_hand    integer not null default 0 check (quantity_on_hand >= 0),
  unique (node_id, slot_code)
);

create table public.service_tickets (
  id                    uuid primary key default gen_random_uuid(),
  node_id               uuid references public.nodes(id) on delete set null,
  location_id           uuid not null references public.locations(id) on delete restrict,
  kind                  text not null check (kind in ('repair', 'restock', 'cleaning', 'inspection', 'other')),
  priority              text not null default 'normal' check (priority in ('low', 'normal', 'urgent')),
  description           text not null,
  submitted_by          uuid references public.users(id) on delete set null,
  status                text not null default 'submitted'
                        check (status in ('submitted', 'triaged', 'assigned', 'accepted',
                                          'in_progress', 'completed', 'verified', 'paid', 'cancelled')),
  assigned_operator_id  uuid references public.operators(profile_id) on delete set null,
  premium               boolean not null default false,
  scheduled_for         timestamptz,
  payout_cents          integer check (payout_cents is null or payout_cents >= 0),
  completed_at          timestamptz,
  verified_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index service_tickets_status_idx on public.service_tickets (status);
create index service_tickets_operator_idx on public.service_tickets (assigned_operator_id);

create table public.ticket_restock_lines (
  id                  uuid primary key default gen_random_uuid(),
  ticket_id           uuid not null references public.service_tickets(id) on delete cascade,
  inventory_item_id   uuid not null references public.inventory_items(id),
  quantity            integer not null check (quantity > 0)
);

create table public.service_ticket_events (
  id           bigint generated always as identity primary key,
  ticket_id    uuid not null references public.service_tickets(id) on delete cascade,
  actor_id     uuid references public.users(id) on delete set null,
  from_status  text,
  to_status    text not null,
  note         text,
  created_at   timestamptz not null default now()
);

create table public.payouts (
  id                  uuid primary key default gen_random_uuid(),
  ticket_id           uuid not null unique references public.service_tickets(id) on delete restrict,
  operator_id         uuid not null references public.operators(profile_id) on delete restrict,
  amount_cents        integer not null check (amount_cents > 0),
  stripe_transfer_id  text unique,
  status              text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  created_at          timestamptz not null default now()
);

create table public.operator_tiers (
  tier                      integer primary key,
  name                      text not null,
  min_rating                numeric(3,2) not null,
  min_ratings               integer not null,
  visibility_delay_minutes  integer not null check (visibility_delay_minutes >= 0),
  premium_access            boolean not null
);

insert into public.operator_tiers (tier, name, min_rating, min_ratings, visibility_delay_minutes, premium_access)
values
  (1, 'Preferred', 4.70, 10,   0, true),
  (2, 'Standard',  4.00,  3,  60, false),
  (3, 'New',       0.00,  0, 120, false);

create table public.ticket_applications (
  id            uuid primary key default gen_random_uuid(),
  ticket_id     uuid not null references public.service_tickets(id) on delete cascade,
  operator_id   uuid not null references public.operators(profile_id) on delete cascade,
  quoted_cents  integer check (quoted_cents is null or quoted_cents > 0),
  note          text,
  status        text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected', 'withdrawn')),
  decided_by    uuid references public.users(id) on delete set null,
  decided_at    timestamptz,
  created_at    timestamptz not null default now(),
  unique (ticket_id, operator_id)
);
create index ticket_applications_ticket_idx on public.ticket_applications (ticket_id);

create table public.operator_ratings (
  id            uuid primary key default gen_random_uuid(),
  ticket_id     uuid not null unique references public.service_tickets(id) on delete cascade,
  operator_id   uuid not null references public.operators(profile_id) on delete cascade,
  rated_by      uuid references public.users(id) on delete set null,
  stars         integer not null check (stars between 1 and 5),
  comment       text,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now()
);
create index operator_ratings_operator_idx on public.operator_ratings (operator_id);

-- ----------------------------------------------------------------------------
-- 3. Functions (created after the tables they reference)
-- ----------------------------------------------------------------------------
create or replace function public.current_hfts_role()
returns text language sql stable security definer set search_path = public as $$
  select u.role from public.users u where u.id = auth.uid()
$$;

create or replace function public.operator_can_serve(p_location_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.operators o
    join public.locations l on l.id = p_location_id
    where o.profile_id = auth.uid()
      and o.is_available
      and l.county = any (o.service_counties)
  )
$$;

create or replace function public.is_location_contact(p_location_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.locations l
    where l.id = p_location_id and l.contact_profile_id = auth.uid()
  )
$$;

create or replace function public.current_operator_tier()
returns public.operator_tiers language sql stable security definer set search_path = public as $$
  select ot.*
  from public.operators o
  join public.operator_tiers ot
    on coalesce(o.rating_avg, 0) >= ot.min_rating
   and o.rating_count >= ot.min_ratings
  where o.profile_id = auth.uid()
  order by ot.tier asc
  limit 1
$$;

create or replace function public.ticket_in_operator_pool(p_ticket_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
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

create or replace function public.operator_can_see_location(p_location_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.service_tickets t
    where t.location_id = p_location_id
      and (t.assigned_operator_id = auth.uid() or public.ticket_in_operator_pool(t.id))
  )
$$;

create or replace function public.operator_can_see_node(p_node_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.service_tickets t
    where t.node_id = p_node_id
      and (t.assigned_operator_id = auth.uid() or public.ticket_in_operator_pool(t.id))
  )
$$;

create or replace function public.guard_ticket_update()
returns trigger language plpgsql security definer set search_path = public as $$
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
returns trigger language plpgsql security definer set search_path = public as $$
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

create or replace function public.guard_node_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.current_hfts_role() = 'operator' then
    if new.location_id is distinct from old.location_id
       or new.serial_number is distinct from old.serial_number
       or new.model is distinct from old.model
       or new.device_fingerprint is distinct from old.device_fingerprint
       or new.last_telemetry is distinct from old.last_telemetry
       or new.last_seen_at is distinct from old.last_seen_at then
      raise exception 'operators may only change node status';
    end if;
    if new.status not in ('online', 'maintenance', 'fault') then
      raise exception 'operators may only set node status to online, maintenance, or fault';
    end if;
  end if;
  return new;
end $$;

create or replace function public.log_ticket_event()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.service_ticket_events (ticket_id, actor_id, from_status, to_status)
    values (new.id, auth.uid(), null, new.status);
  elsif new.status is distinct from old.status then
    insert into public.service_ticket_events (ticket_id, actor_id, from_status, to_status)
    values (new.id, auth.uid(), old.status, new.status);
  end if;
  return null;
end $$;

create or replace function public.approve_application(p_application_id uuid)
returns void language plpgsql security definer set search_path = public as $$
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

create or replace function public.recompute_operator_rating()
returns trigger language plpgsql security definer set search_path = public as $$
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

-- ----------------------------------------------------------------------------
-- 4. Triggers
-- ----------------------------------------------------------------------------
create trigger trg_guard_ticket_update
  before update on public.service_tickets
  for each row execute function public.guard_ticket_update();

create trigger trg_log_ticket_event
  after insert or update on public.service_tickets
  for each row execute function public.log_ticket_event();

create trigger trg_guard_operator_update
  before update on public.operators
  for each row execute function public.guard_operator_update();

create trigger trg_guard_node_update
  before update on public.nodes
  for each row execute function public.guard_node_update();

create trigger trg_recompute_rating
  after insert or update or delete on public.operator_ratings
  for each row execute function public.recompute_operator_rating();

-- ----------------------------------------------------------------------------
-- 5. Row-level security: enable on new tables
-- ----------------------------------------------------------------------------
alter table public.operators             enable row level security;
alter table public.locations             enable row level security;
alter table public.nodes                 enable row level security;
alter table public.node_events           enable row level security;
alter table public.inventory_items       enable row level security;
alter table public.node_slots            enable row level security;
alter table public.service_tickets       enable row level security;
alter table public.ticket_restock_lines  enable row level security;
alter table public.service_ticket_events enable row level security;
alter table public.payouts               enable row level security;
alter table public.operator_tiers        enable row level security;
alter table public.ticket_applications   enable row level security;
alter table public.operator_ratings      enable row level security;

-- ----------------------------------------------------------------------------
-- 6. Policies
-- ----------------------------------------------------------------------------

-- operators
create policy operators_select on public.operators for select using (
  profile_id = auth.uid() or public.current_hfts_role() in ('admin', 'dispatcher')
);
create policy operators_admin_write on public.operators for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);
create policy operators_self_update on public.operators for update using (
  profile_id = auth.uid()
) with check (
  profile_id = auth.uid()
);

-- locations
create policy locations_select on public.locations for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or public.is_location_contact(id)
  or public.operator_can_see_location(id)
);
create policy locations_admin_write on public.locations for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);

-- nodes
create policy nodes_select on public.nodes for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or public.is_location_contact(location_id)
  or public.operator_can_see_node(id)
);
create policy nodes_admin_write on public.nodes for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);
create policy nodes_operator_update on public.nodes for update using (
  exists (select 1 from public.service_tickets t
          where t.node_id = nodes.id and t.assigned_operator_id = auth.uid())
) with check (
  exists (select 1 from public.service_tickets t
          where t.node_id = nodes.id and t.assigned_operator_id = auth.uid())
);

-- node_events
create policy node_events_select on public.node_events for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or exists (
    select 1 from public.nodes n
    where n.id = node_events.node_id
      and (public.is_location_contact(n.location_id) or public.operator_can_see_node(n.id))
  )
);

-- inventory
create policy inventory_select on public.inventory_items for select using (
  public.current_hfts_role() is not null
);
create policy inventory_admin_write on public.inventory_items for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);

-- node_slots
create policy node_slots_select on public.node_slots for select using (
  public.current_hfts_role() is not null
);
create policy node_slots_write on public.node_slots for all using (
  public.current_hfts_role() in ('admin', 'dispatcher')
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
);
create policy node_slots_operator_update on public.node_slots for update using (
  exists (select 1 from public.service_tickets t
          where t.node_id = node_slots.node_id and t.assigned_operator_id = auth.uid())
) with check (
  exists (select 1 from public.service_tickets t
          where t.node_id = node_slots.node_id and t.assigned_operator_id = auth.uid())
);

-- service_tickets
create policy tickets_select on public.service_tickets for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or submitted_by = auth.uid()
  or public.is_location_contact(location_id)
  or assigned_operator_id = auth.uid()
  or public.ticket_in_operator_pool(id)
);
create policy tickets_insert on public.service_tickets for insert with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or (submitted_by = auth.uid() and public.is_location_contact(location_id))
);
create policy tickets_update on public.service_tickets for update using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or assigned_operator_id = auth.uid()
  or public.ticket_in_operator_pool(id)
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or assigned_operator_id = auth.uid()
  or (assigned_operator_id is null and status in ('submitted', 'triaged')
      and public.operator_can_serve(location_id))
);

-- ticket restock lines
create policy restock_lines_select on public.ticket_restock_lines for select using (
  exists (select 1 from public.service_tickets t where t.id = ticket_restock_lines.ticket_id)
);
create policy restock_lines_write on public.ticket_restock_lines for all using (
  public.current_hfts_role() in ('admin', 'dispatcher')
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
);

-- ticket events
create policy ticket_events_select on public.service_ticket_events for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or exists (
    select 1 from public.service_tickets t
    where t.id = service_ticket_events.ticket_id
      and (t.assigned_operator_id = auth.uid() or public.ticket_in_operator_pool(t.id))
  )
);

-- payouts
create policy payouts_select on public.payouts for select using (
  public.current_hfts_role() = 'admin' or operator_id = auth.uid()
);

-- operator_tiers
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
create policy applications_insert on public.ticket_applications for insert with check (
  operator_id = auth.uid()
  and status = 'pending'
  and public.ticket_in_operator_pool(ticket_id)
);
create policy applications_update on public.ticket_applications for update using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or (operator_id = auth.uid() and status = 'pending')
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or (operator_id = auth.uid() and status = 'withdrawn')
);

-- operator_ratings
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
create policy ratings_staff_update on public.operator_ratings for update using (
  public.current_hfts_role() in ('admin', 'dispatcher')
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
);

-- ----------------------------------------------------------------------------
-- 7. blog_posts: restrictive write rules (existing policies untouched)
--    Existing "Enable all access for authenticated users" lets any logged-in
--    account write. These AND with it: only admin and blogger may write.
-- ----------------------------------------------------------------------------
create policy blog_posts_restrict_insert on public.blog_posts
  as restrictive for insert to authenticated
  with check (public.current_hfts_role() in ('admin', 'blogger'));

create policy blog_posts_restrict_update on public.blog_posts
  as restrictive for update to authenticated
  using (public.current_hfts_role() in ('admin', 'blogger'))
  with check (public.current_hfts_role() in ('admin', 'blogger'));

create policy blog_posts_restrict_delete on public.blog_posts
  as restrictive for delete to authenticated
  using (public.current_hfts_role() in ('admin', 'blogger'));
