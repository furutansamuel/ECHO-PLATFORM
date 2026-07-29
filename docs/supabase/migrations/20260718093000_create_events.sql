-- Events table — did not exist before. UpcomingEvents.tsx and
-- CleanupEventsWidget.tsx currently render hardcoded static arrays with
-- no database backing at all. This creates the real table so the admin
-- Events Manager (and, in a follow-up, the public event displays) have
-- something real to read from and write to.
-- Migration: 20260718093000_create_events.sql

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 150),
  description text not null check (char_length(description) <= 2000),
  image_url text,
  category text not null default 'Cleanup'
    check (category in ('Cleanup', 'Tree Planting', 'Workshop', 'Awareness Campaign', 'Other')),
  event_date date not null,
  start_time time not null,
  end_time time,
  location_name text not null,
  location_address text,
  max_volunteers integer check (max_volunteers is null or max_volunteers > 0),
  status text not null default 'upcoming'
    check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_event_date_idx on public.events(event_date);
create index if not exists events_status_idx on public.events(status);

alter table public.events enable row level security;

-- Anyone (including logged-out visitors on the public landing page) can
-- see events — this is public community information, not per-user data.
drop policy if exists "Anyone can view events" on public.events;
create policy "Anyone can view events"
  on public.events for select
  using (true);

drop policy if exists "Admins can create events" on public.events;
create policy "Admins can create events"
  on public.events for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events"
  on public.events for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );

drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events"
  on public.events for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
    before update on public.events
  for each row execute function public.handle_updated_at();

-- ─── Volunteer registrations ────────────────────────────────────────
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  registered_at timestamptz not null default now(),
  attended boolean not null default false,
  unique (event_id, user_id)
);

alter table public.event_registrations enable row level security;

drop policy if exists "Users can register for events" on public.event_registrations;
create policy "Users can register for events"
  on public.event_registrations for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own registrations" on public.event_registrations;
create policy "Users can view own registrations"
  on public.event_registrations for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all registrations" on public.event_registrations;
create policy "Admins can view all registrations"
  on public.event_registrations for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );

drop policy if exists "Users can cancel own registration" on public.event_registrations;
create policy "Users can cancel own registration"
  on public.event_registrations for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can manage all registrations" on public.event_registrations;
create policy "Admins can manage all registrations"
  on public.event_registrations for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );
