-- ============================================================================
-- HFTS Hub — 002: operator triage, claiming, and operator write paths
-- Run AFTER 001_hub_schema.sql.
--   psql "$SUPABASE_DB_URL" -f 002_operator_triage.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Helper functions (SECURITY DEFINER so policies don't recurse through RLS)
-- ----------------------------------------------------------------------------

-- Operator is available and covers the ticket's county.
create or replace function public.operator_can_serve(p_location_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.operators o
    join public.locations l on l.id = p_location_id
    where o.profile_id = auth.uid()
      and o.is_available
      and l.county = any (o.service_counties)
  )
$$;

-- Caller is the host contact for this location.
create or replace function public.is_location_contact(p_location_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.locations l
    where l.id = p_location_id and l.contact_profile_id = auth.uid()
  )
$$;

-- A ticket is in the open pool: unclaimed, still in intake, and serviceable by caller.
create or replace function public.ticket_in_operator_pool(p_ticket_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.service_tickets t
    where t.id = p_ticket_id
      and t.assigned_operator_id is null
      and t.status in ('submitted', 'triaged')
      and public.operator_can_serve(t.location_id)
  )
$$;

-- Caller can see this location: assigned to them, or in their open pool.
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
      and (
        t.assigned_operator_id = auth.uid()
        or (t.assigned_operator_id is null and t.status in ('submitted', 'triaged')
            and public.operator_can_serve(t.location_id))
      )
  )
$$;

-- Caller can see this node: a ticket on it is assigned to them, or is in their pool.
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
      and (
        t.assigned_operator_id = auth.uid()
        or (t.assigned_operator_id is null and t.status in ('submitted', 'triaged')
            and public.operator_can_serve(t.location_id))
      )
  )
$$;

-- ----------------------------------------------------------------------------
-- 2. Guards
-- ----------------------------------------------------------------------------

-- Replaces the 001 version. Operators can triage, claim, and progress tickets.
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
    -- Assignment: only an unclaimed ticket can be taken, and only for yourself.
    if new.assigned_operator_id is distinct from old.assigned_operator_id then
      if not (old.assigned_operator_id is null and new.assigned_operator_id = auth.uid()) then
        raise exception 'operators can only claim unassigned tickets for themselves';
      end if;
    end if;

    -- Status: operators drive the workflow up to completed, never verify or pay.
    if new.status is distinct from old.status
       and new.status not in ('triaged', 'assigned', 'accepted', 'in_progress', 'completed') then
      raise exception 'operators may only set status to triaged, assigned, accepted, in_progress, or completed';
    end if;

    if new.status = 'assigned' and new.assigned_operator_id is distinct from auth.uid() then
      raise exception 'only the assigned operator can move a ticket to assigned';
    end if;

    if new.payout_cents is distinct from old.payout_cents
       or new.verified_at is distinct from old.verified_at then
      raise exception 'operators cannot change payout or verification';
    end if;

    -- Kind can be corrected during triage only.
    if new.kind is distinct from old.kind and old.status not in ('submitted', 'triaged') then
      raise exception 'ticket kind can only be changed during triage';
    end if;
  end if;

  return new;
end $$;

-- Operators edit only availability, counties, and skills on their own row.
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
       or new.created_at is distinct from old.created_at then
      raise exception 'operators cannot change identity or payout settings';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_guard_operator_update on public.operators;
create trigger trg_guard_operator_update
  before update on public.operators
  for each row execute function public.guard_operator_update();

-- Operators update only status on machines they are working on.
create or replace function public.guard_node_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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

drop trigger if exists trg_guard_node_update on public.nodes;
create trigger trg_guard_node_update
  before update on public.nodes
  for each row execute function public.guard_node_update();

-- ----------------------------------------------------------------------------
-- 3. Replace policies that need operator pool access
-- ----------------------------------------------------------------------------
drop policy if exists locations_select on public.locations;
drop policy if exists nodes_select on public.nodes;
drop policy if exists node_events_select on public.node_events;
drop policy if exists tickets_select on public.service_tickets;
drop policy if exists tickets_insert on public.service_tickets;
drop policy if exists tickets_update on public.service_tickets;
drop policy if exists ticket_events_select on public.service_ticket_events;

-- locations
create policy locations_select on public.locations for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or public.is_location_contact(id)
  or public.operator_can_see_location(id)
);

-- nodes
create policy nodes_select on public.nodes for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or public.is_location_contact(location_id)
  or public.operator_can_see_node(id)
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

-- service_tickets: staff; submitter; host contact; assigned operator; open pool for serviceable operators
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

-- Update: staff any; assigned operator their own; operators can also act on the pool
-- (triage or claim). WITH CHECK keeps a pool row in the pool or hands it to the caller.
-- If two operators claim at once, the UPDATE re-evaluates the row, so only one succeeds.
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

-- ticket events
create policy ticket_events_select on public.service_ticket_events for select using (
  public.current_hfts_role() in ('admin', 'dispatcher')
  or exists (
    select 1 from public.service_tickets t
    where t.id = service_ticket_events.ticket_id
      and (t.assigned_operator_id = auth.uid() or public.ticket_in_operator_pool(t.id))
  )
);

-- ----------------------------------------------------------------------------
-- 4. Operator write paths for work they own
-- ----------------------------------------------------------------------------

-- Operators edit their own availability, counties, and skills.
create policy operators_self_update on public.operators for update using (
  profile_id = auth.uid()
) with check (
  profile_id = auth.uid()
);

-- Operators update node status on machines assigned to them.
create policy nodes_operator_update on public.nodes for update using (
  exists (
    select 1 from public.service_tickets t
    where t.node_id = nodes.id and t.assigned_operator_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.service_tickets t
    where t.node_id = nodes.id and t.assigned_operator_id = auth.uid()
  )
);

-- Operators record restock counts on machines assigned to them.
create policy node_slots_operator_update on public.node_slots for update using (
  exists (
    select 1 from public.service_tickets t
    where t.node_id = node_slots.node_id and t.assigned_operator_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.service_tickets t
    where t.node_id = node_slots.node_id and t.assigned_operator_id = auth.uid()
  )
);

-- ----------------------------------------------------------------------------
-- Notes
-- * Claim is first-come. The UPDATE on an unassigned row only succeeds for the
--   first operator; the second sees zero rows and should show "already taken".
--   Your app should check rows-affected on the claim and report it.
-- * Dispatchers can reassign any ticket, so a wrong claim is recoverable.
-- * Operators can't see tickets outside their counties or while is_available = false.
-- ----------------------------------------------------------------------------
