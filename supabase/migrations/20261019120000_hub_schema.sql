-- ============================================================================
-- HFTS Hub — Phase 1: ACL, locations, nodes, inventory, service tickets, payouts
-- Uses the existing public.users table as the profile/role table (id -> auth.users).
-- Does not drop or modify any existing RLS policy. Adds restrictive write rules
-- on blog_posts (see section 10); those AND with the existing permissive policies.
-- Run once:  psql "$SUPABASE_DB_URL" -f 001_hub_schema.sql
--        or: paste into the Supabase SQL editor.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. ACL: roles live on the existing public.users table
--    users: id (FK -> auth.users), username, role, last_password_change, created_at
--    Current role values in use: 'blogger'. Constraint below covers all planned roles.
-- ----------------------------------------------------------------------------
alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check
  check (role in ('admin', 'dispatcher', 'operator', 'location_contact', 'blogger'));

-- SECURITY DEFINER so policies that call it don't recurse through RLS.
create or replace function public.current_hfts_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.role from public.users u where u.id = auth.uid()
$$;

-- ----------------------------------------------------------------------------
-- 2. Operators (paid technicians / restockers)
-- ----------------------------------------------------------------------------
create table if not exists public.operators (
  profile_id            uuid primary key references public.users(id) on delete cascade,
  service_counties      text[] not null default '{}',
  skills                text[] not null default '{}',
  is_available          boolean not null default false,
  stripe_account_id     text unique,                 -- Stripe Connect (Express) account id
  stripe_payouts_enabled boolean not null default false,
  created_at            timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. Locations (host sites)
-- ----------------------------------------------------------------------------
create table if not exists public.locations (
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

-- ----------------------------------------------------------------------------
-- 4. Nodes (machines on the network)
-- ----------------------------------------------------------------------------
create table if not exists public.nodes (
  id                  uuid primary key default gen_random_uuid(),
  location_id         uuid references public.locations(id) on delete set null,
  serial_number       text not null unique,
  model               text,
  device_fingerprint  text unique,                   -- fingerprint of the on-machine agent's public key
  status              text not null default 'provisioning'
                      check (status in ('provisioning', 'online', 'offline', 'fault', 'maintenance', 'retired')),
  last_seen_at        timestamptz,
  last_telemetry      jsonb not null default '{}'::jsonb,   -- latest snapshot, written by the device gateway
  created_at          timestamptz not null default now()
);

create table if not exists public.node_events (
  id          bigint generated always as identity primary key,
  node_id     uuid not null references public.nodes(id) on delete cascade,
  event_type  text not null,                         -- heartbeat | fault | door_open | low_stock | command_sent | command_result
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists node_events_node_time_idx on public.node_events (node_id, created_at desc);

-- ----------------------------------------------------------------------------
-- 5. Inventory and slots
-- ----------------------------------------------------------------------------
create table if not exists public.inventory_items (
  id                  uuid primary key default gen_random_uuid(),
  sku                 text not null unique,
  name                text not null,
  category            text,
  unit_cost_cents     integer not null default 0 check (unit_cost_cents >= 0),
  sale_price_cents    integer not null default 0 check (sale_price_cents >= 0),
  reorder_threshold   integer not null default 0 check (reorder_threshold >= 0),
  created_at          timestamptz not null default now()
);

create table if not exists public.node_slots (
  id                  uuid primary key default gen_random_uuid(),
  node_id             uuid not null references public.nodes(id) on delete cascade,
  slot_code           text not null,
  inventory_item_id   uuid references public.inventory_items(id) on delete set null,
  capacity            integer not null default 0 check (capacity >= 0),
  quantity_on_hand    integer not null default 0 check (quantity_on_hand >= 0),
  unique (node_id, slot_code)
);

-- ----------------------------------------------------------------------------
-- 6. Service tickets (repair, restock, cleaning, inspection, other)
-- ----------------------------------------------------------------------------
create table if not exists public.service_tickets (
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
  scheduled_for         timestamptz,
  payout_cents          integer check (payout_cents is null or payout_cents >= 0),
  completed_at          timestamptz,
  verified_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists service_tickets_status_idx on public.service_tickets (status);
create index if not exists service_tickets_operator_idx on public.service_tickets (assigned_operator_id);

create table if not exists public.ticket_restock_lines (
  id                  uuid primary key default gen_random_uuid(),
  ticket_id           uuid not null references public.service_tickets(id) on delete cascade,
  inventory_item_id   uuid not null references public.inventory_items(id),
  quantity            integer not null check (quantity > 0)
);

create table if not exists public.service_ticket_events (
  id           bigint generated always as identity primary key,
  ticket_id    uuid not null references public.service_tickets(id) on delete cascade,
  actor_id     uuid references public.users(id) on delete set null,
  from_status  text,
  to_status    text not null,
  note         text,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. Payouts to operators (Stripe Connect transfers)
--    ticket_id is UNIQUE: a ticket can be paid once. Idempotency lives here.
-- ----------------------------------------------------------------------------
create table if not exists public.payouts (
  id                  uuid primary key default gen_random_uuid(),
  ticket_id           uuid not null unique references public.service_tickets(id) on delete restrict,
  operator_id         uuid not null references public.operators(profile_id) on delete restrict,
  amount_cents        integer not null check (amount_cents > 0),
  stripe_transfer_id  text unique,
  status              text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  created_at          timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. Triggers
-- ----------------------------------------------------------------------------

-- Operators may only move a ticket through their own workflow and may not touch
-- assignment, payout, or verification. Server-side writes (service role) have
-- auth.uid() = null, so the role check does not apply to them.
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
    if new.status is distinct from old.status
       and new.status not in ('accepted', 'in_progress', 'completed') then
      raise exception 'operators may only set status to accepted, in_progress, or completed';
    end if;
    if new.assigned_operator_id is distinct from old.assigned_operator_id
       or new.payout_cents      is distinct from old.payout_cents
       or new.verified_at       is distinct from old.verified_at
       or new.kind              is distinct from old.kind then
      raise exception 'operators cannot change assignment, payout, verification, or kind';
    end if;
  end if;

  return new;
end $$;

drop trigger if exists trg_guard_ticket_update on public.service_tickets;
create trigger trg_guard_ticket_update
  before update on public.service_tickets
  for each row execute function public.guard_ticket_update();

-- Audit trail for every status change.
create or replace function public.log_ticket_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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

drop trigger if exists trg_log_ticket_event on public.service_tickets;
create trigger trg_log_ticket_event
  after insert or update on public.service_tickets
  for each row execute function public.log_ticket_event();

-- ----------------------------------------------------------------------------
-- 9. Row-level security (new tables only)
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

-- operators: self + staff read; admin writes (Stripe account id must not be self-editable)
create policy operators_select on public.operators for select using (
  profile_id = auth.uid() or public.current_hfts_role() in ('admin', 'dispatcher')
);
create policy operators_admin_write on public.operators for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);

-- locations: staff read; contact reads own; admin writes
create policy locations_select on public.locations for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or contact_profile_id = auth.uid()
  or exists (
    select 1 from public.service_tickets t
    where t.location_id = locations.id and t.assigned_operator_id = auth.uid()
  )
);
create policy locations_admin_write on public.locations for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);

-- nodes: staff all; contact sees own location's machines; operator sees machines on their tickets
-- Writes come from the device gateway (service role) and admin only.
create policy nodes_select on public.nodes for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or exists (
    select 1 from public.locations l
    where l.id = nodes.location_id and l.contact_profile_id = auth.uid()
  )
  or exists (
    select 1 from public.service_tickets t
    where t.node_id = nodes.id and t.assigned_operator_id = auth.uid()
  )
);
create policy nodes_admin_write on public.nodes for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);

-- node_events: same visibility as the node; inserts come from the gateway only
create policy node_events_select on public.node_events for select using (
  exists (
    select 1 from public.nodes n
    where n.id = node_events.node_id
      and (
        public.current_hfts_role() in ('admin', 'dispatcher')
        or exists (select 1 from public.locations l
                   where l.id = n.location_id and l.contact_profile_id = auth.uid())
      )
  )
);

-- inventory: any staff role reads; admin writes
create policy inventory_select on public.inventory_items for select using (
  public.current_hfts_role() is not null
);
create policy inventory_admin_write on public.inventory_items for all using (
  public.current_hfts_role() = 'admin'
) with check (
  public.current_hfts_role() = 'admin'
);

-- node_slots: staff read; admin and dispatcher write (dispatcher updates counts)
create policy node_slots_select on public.node_slots for select using (
  public.current_hfts_role() is not null
);
create policy node_slots_write on public.node_slots for all using (
  public.current_hfts_role() in ('admin', 'dispatcher')
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
);

-- service_tickets
create policy tickets_select on public.service_tickets for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or submitted_by = auth.uid()
  or assigned_operator_id = auth.uid()
  or exists (
    select 1 from public.locations l
    where l.id = service_tickets.location_id and l.contact_profile_id = auth.uid()
  )
);
create policy tickets_insert on public.service_tickets for insert with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or (
    submitted_by = auth.uid()
    and exists (
      select 1 from public.locations l
      where l.id = service_tickets.location_id and l.contact_profile_id = auth.uid()
    )
  )
);
create policy tickets_update on public.service_tickets for update using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or assigned_operator_id = auth.uid()
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or assigned_operator_id = auth.uid()
);
-- Note: guard_ticket_update() restricts what operators can change.
-- Only admin/dispatcher may verify tickets; payouts are created server-side.

-- ticket restock lines follow the parent ticket
create policy restock_lines_select on public.ticket_restock_lines for select using (
  exists (select 1 from public.service_tickets t
          where t.id = ticket_restock_lines.ticket_id)   -- inherits tickets_select visibility
);
create policy restock_lines_write on public.ticket_restock_lines for all using (
  public.current_hfts_role() in ('admin', 'dispatcher')
) with check (
  public.current_hfts_role() in ('admin', 'dispatcher')
);

-- ticket events: staff read; operators read events on their assigned tickets
create policy ticket_events_select on public.service_ticket_events for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or exists (
    select 1 from public.service_tickets t
    where t.id = service_ticket_events.ticket_id and t.assigned_operator_id = auth.uid()
  )
);

-- payouts: admin reads all; operators read their own; writes are server-side only
create policy payouts_select on public.payouts for select using (
  public.current_hfts_role() = 'admin' or operator_id = auth.uid()
);

-- ----------------------------------------------------------------------------
-- 10. blog_posts: restrictive write rules (added; existing policies untouched)
--     Existing: "Enable all access for authenticated users" (ALL) lets any logged-in
--     account write. These RESTRICTIVE policies AND with it, so only admin and
--     blogger can insert, update, or delete. SELECT is unaffected.
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

-- ----------------------------------------------------------------------------
-- Notes
-- * Service role (Netlify functions, device gateway) bypasses RLS. Keep the
--   service key server-side only; never prefix it with VITE_.
-- * No policies are granted for node_events inserts or payouts writes from
--   clients, so those can only come from the service role.
-- * A new account has no role until a row in public.users sets one. Admin
--   creates operator accounts by adding the users row with role = 'operator'.
-- * Blog writes now require role admin or blogger. The admin dashboard itself
--   still only checks "logged in"; that's a frontend change for later.
-- ----------------------------------------------------------------------------
