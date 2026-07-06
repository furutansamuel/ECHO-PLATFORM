-- ECHO — Initial schema for the new Supabase project
-- Run this once in Supabase Dashboard → SQL Editor.
-- Safe to re-run.

-- 1. ENUMS
do $$ begin create type public.app_role as enum ('citizen','volunteer','administrator');
exception when duplicate_object then null; end $$;
do $$ begin create type public.report_status as enum ('pending','verified','in_progress','resolved','rejected');
exception when duplicate_object then null; end $$;
do $$ begin create type public.hazard_severity as enum ('low','medium','high','critical');
exception when duplicate_object then null; end $$;

-- 2. PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, avatar_url text, phone text,
  points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
drop policy if exists "Profiles viewable" on public.profiles;
create policy "Profiles viewable" on public.profiles for select using (true);
drop policy if exists "Insert own profile" on public.profiles;
create policy "Insert own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile" on public.profiles for update using (auth.uid() = id);

-- 3. USER ROLES
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

drop policy if exists "View own roles" on public.user_roles;
create policy "View own roles" on public.user_roles for select to authenticated using (auth.uid()=user_id);
drop policy if exists "Admins manage roles" on public.user_roles;
create policy "Admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'administrator'))
  with check (public.has_role(auth.uid(),'administrator'));

-- 4. REPORTS
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, description text,
  category text not null,
  severity public.hazard_severity not null default 'medium',
  status public.report_status not null default 'pending',
  latitude double precision, longitude double precision, address text,
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists reports_user_idx on public.reports(user_id);
create index if not exists reports_status_idx on public.reports(status);
create index if not exists reports_created_idx on public.reports(created_at desc);
grant select on public.reports to anon;
grant select, insert, update, delete on public.reports to authenticated;
grant all on public.reports to service_role;
alter table public.reports enable row level security;
drop policy if exists "Reports public" on public.reports;
create policy "Reports public" on public.reports for select using (true);
drop policy if exists "Create own reports" on public.reports;
create policy "Create own reports" on public.reports for insert to authenticated with check (auth.uid()=user_id);
drop policy if exists "Update own reports" on public.reports;
create policy "Update own reports" on public.reports for update to authenticated
  using (auth.uid()=user_id or public.has_role(auth.uid(),'administrator'));
drop policy if exists "Delete own reports" on public.reports;
create policy "Delete own reports" on public.reports for delete to authenticated
  using (auth.uid()=user_id or public.has_role(auth.uid(),'administrator'));

-- 5. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, body text, read boolean not null default false,
  link text, created_at timestamptz not null default now()
);
create index if not exists notif_user_idx on public.notifications(user_id, created_at desc);
grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
drop policy if exists "View own notif" on public.notifications;
create policy "View own notif" on public.notifications for select to authenticated using (auth.uid()=user_id);
drop policy if exists "Update own notif" on public.notifications;
create policy "Update own notif" on public.notifications for update to authenticated using (auth.uid()=user_id);

-- 6. CLEANUP EVENTS
create table if not exists public.cleanup_events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references auth.users(id) on delete set null,
  title text not null, description text, location text,
  latitude double precision, longitude double precision,
  starts_at timestamptz not null, capacity integer,
  created_at timestamptz not null default now()
);
grant select on public.cleanup_events to anon, authenticated;
grant insert, update, delete on public.cleanup_events to authenticated;
grant all on public.cleanup_events to service_role;
alter table public.cleanup_events enable row level security;
drop policy if exists "Events public" on public.cleanup_events;
create policy "Events public" on public.cleanup_events for select using (true);
drop policy if exists "Create events" on public.cleanup_events;
create policy "Create events" on public.cleanup_events for insert to authenticated with check (auth.uid()=organizer_id);
drop policy if exists "Update events" on public.cleanup_events;
create policy "Update events" on public.cleanup_events for update to authenticated
  using (auth.uid()=organizer_id or public.has_role(auth.uid(),'administrator'));

-- 7. EVENT REGISTRATIONS
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.cleanup_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);
grant select, insert, delete on public.event_registrations to authenticated;
grant all on public.event_registrations to service_role;
alter table public.event_registrations enable row level security;
drop policy if exists "View own reg" on public.event_registrations;
create policy "View own reg" on public.event_registrations for select to authenticated using (auth.uid()=user_id);
drop policy if exists "Register self" on public.event_registrations;
create policy "Register self" on public.event_registrations for insert to authenticated with check (auth.uid()=user_id);
drop policy if exists "Unregister self" on public.event_registrations;
create policy "Unregister self" on public.event_registrations for delete to authenticated using (auth.uid()=user_id);

-- 8. AUTO-CREATE PROFILE + DEFAULT ROLE
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  ) on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id,'citizen') on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 9. STORAGE
insert into storage.buckets (id,name,public) values ('report-images','report-images',true) on conflict (id) do nothing;
insert into storage.buckets (id,name,public) values ('avatars','avatars',true) on conflict (id) do nothing;
drop policy if exists "Public read reports" on storage.objects;
create policy "Public read reports" on storage.objects for select using (bucket_id='report-images');
drop policy if exists "Auth upload reports" on storage.objects;
create policy "Auth upload reports" on storage.objects for insert to authenticated with check (bucket_id='report-images');
drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars" on storage.objects for select using (bucket_id='avatars');
drop policy if exists "Users upload avatar" on storage.objects;
create policy "Users upload avatar" on storage.objects for insert to authenticated
  with check (bucket_id='avatars' and auth.uid()::text = (storage.foldername(name))[1]);
