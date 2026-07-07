-- =============================================================================
-- ECHO — Backend Sync Migration (ADDITIVE, NON-DESTRUCTIVE)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run. Does NOT drop tables, columns, or data.
-- =============================================================================

-- 0. EXTENSIONS -------------------------------------------------------------
create extension if not exists pgcrypto;

-- 1. ENUMS (idempotent) -----------------------------------------------------
do $$ begin
  create type public.app_role as enum ('citizen','volunteer','administrator');
exception when duplicate_object then null; end $$;

-- 2. PROFILES ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role text default 'citizen',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- add columns if the table pre-existed with a different shape
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists role text default 'citizen';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;
drop policy if exists "Profiles are viewable" on public.profiles;
create policy "Profiles are viewable" on public.profiles
  for select using (true);
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Auto-create profile on new signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. USER_ROLES (privilege-safe) -------------------------------------------
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
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

drop policy if exists "Users view own roles" on public.user_roles;
create policy "Users view own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Admins manage roles" on public.user_roles;
create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'administrator'))
  with check (public.has_role(auth.uid(), 'administrator'));

-- 4. EXTEND EXISTING hazard_reports (preserve if present) -------------------
-- If it doesn't exist yet, create a minimal shape that matches the frontend.
create table if not exists public.hazard_reports (
  id uuid primary key default gen_random_uuid(),
  reference_number text unique,
  title text,
  description text,
  category text,
  severity text default 'Medium',
  status text default 'Pending',
  latitude double precision,
  longitude double precision,
  address text,
  ward text,
  lga text,
  state text,
  landmark text,
  images text[] default '{}',
  video text,
  is_anonymous boolean default false,
  reporter_id uuid references auth.users(id) on delete set null,
  reporter_name text,
  verification_status text,
  verification_notes text,
  verification_confidence numeric,
  ai_risk_score numeric,
  ai_priority text,
  ai_risk_level text,
  ai_impact_summary text,
  estimated_impact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Additive column safety for existing installs:
alter table public.hazard_reports add column if not exists reference_number text;
alter table public.hazard_reports add column if not exists title text;
alter table public.hazard_reports add column if not exists description text;
alter table public.hazard_reports add column if not exists category text;
alter table public.hazard_reports add column if not exists severity text default 'Medium';
alter table public.hazard_reports add column if not exists status text default 'Pending';
alter table public.hazard_reports add column if not exists latitude double precision;
alter table public.hazard_reports add column if not exists longitude double precision;
alter table public.hazard_reports add column if not exists address text;
alter table public.hazard_reports add column if not exists ward text;
alter table public.hazard_reports add column if not exists lga text;
alter table public.hazard_reports add column if not exists state text;
alter table public.hazard_reports add column if not exists landmark text;
alter table public.hazard_reports add column if not exists images text[] default '{}';
alter table public.hazard_reports add column if not exists video text;
alter table public.hazard_reports add column if not exists is_anonymous boolean default false;
alter table public.hazard_reports add column if not exists reporter_id uuid references auth.users(id) on delete set null;
alter table public.hazard_reports add column if not exists reporter_name text;
alter table public.hazard_reports add column if not exists verification_status text;
alter table public.hazard_reports add column if not exists verification_notes text;
alter table public.hazard_reports add column if not exists verification_confidence numeric;
alter table public.hazard_reports add column if not exists ai_risk_score numeric;
alter table public.hazard_reports add column if not exists ai_priority text;
alter table public.hazard_reports add column if not exists ai_risk_level text;
alter table public.hazard_reports add column if not exists ai_impact_summary text;
alter table public.hazard_reports add column if not exists estimated_impact text;
alter table public.hazard_reports add column if not exists created_at timestamptz not null default now();
alter table public.hazard_reports add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_hazard_reports_status on public.hazard_reports(status);
create index if not exists idx_hazard_reports_severity on public.hazard_reports(severity);
create index if not exists idx_hazard_reports_created_at on public.hazard_reports(created_at desc);
create index if not exists idx_hazard_reports_reporter on public.hazard_reports(reporter_id);

grant select on public.hazard_reports to anon, authenticated;
grant insert, update, delete on public.hazard_reports to authenticated;
grant all on public.hazard_reports to service_role;

alter table public.hazard_reports enable row level security;
drop policy if exists "Hazard reports readable" on public.hazard_reports;
create policy "Hazard reports readable" on public.hazard_reports for select using (true);
drop policy if exists "Auth users create reports" on public.hazard_reports;
create policy "Auth users create reports" on public.hazard_reports
  for insert to authenticated with check (auth.uid() = reporter_id or reporter_id is null);
drop policy if exists "Owners update reports" on public.hazard_reports;
create policy "Owners update reports" on public.hazard_reports
  for update to authenticated using (auth.uid() = reporter_id or public.has_role(auth.uid(),'administrator'));

-- 5. EXTEND EXISTING user_stats --------------------------------------------
create table if not exists public.user_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  total_reports integer not null default 0,
  verified_reports integer not null default 0,
  pending_reports integer not null default 0,
  resolved_reports integer not null default 0,
  eco_points integer not null default 0,
  level integer not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.user_stats add column if not exists total_reports integer not null default 0;
alter table public.user_stats add column if not exists verified_reports integer not null default 0;
alter table public.user_stats add column if not exists pending_reports integer not null default 0;
alter table public.user_stats add column if not exists resolved_reports integer not null default 0;
alter table public.user_stats add column if not exists eco_points integer not null default 0;
alter table public.user_stats add column if not exists level integer not null default 1;
alter table public.user_stats add column if not exists updated_at timestamptz not null default now();

grant select, insert, update on public.user_stats to authenticated;
grant all on public.user_stats to service_role;
alter table public.user_stats enable row level security;
drop policy if exists "Users read own stats" on public.user_stats;
create policy "Users read own stats" on public.user_stats
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users upsert own stats" on public.user_stats;
create policy "Users upsert own stats" on public.user_stats
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users update own stats" on public.user_stats;
create policy "Users update own stats" on public.user_stats
  for update to authenticated using (auth.uid() = user_id);

-- 6. EXTEND EXISTING notifications -----------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  message text,
  type text default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.notifications add column if not exists title text;
alter table public.notifications add column if not exists message text;
alter table public.notifications add column if not exists type text default 'info';
alter table public.notifications add column if not exists read boolean not null default false;
alter table public.notifications add column if not exists created_at timestamptz not null default now();
create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);

grant select, insert, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications" on public.notifications
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications" on public.notifications
  for update to authenticated using (auth.uid() = user_id);

-- 7. EXTEND EXISTING reports_activities ------------------------------------
create table if not exists public.reports_activities (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.hazard_reports(id) on delete cascade,
  status text,
  description text,
  created_at timestamptz not null default now()
);
alter table public.reports_activities add column if not exists report_id uuid references public.hazard_reports(id) on delete cascade;
alter table public.reports_activities add column if not exists status text;
alter table public.reports_activities add column if not exists description text;
alter table public.reports_activities add column if not exists created_at timestamptz not null default now();
create index if not exists idx_reports_activities_report on public.reports_activities(report_id, created_at desc);

grant select on public.reports_activities to anon, authenticated;
grant insert on public.reports_activities to authenticated;
grant all on public.reports_activities to service_role;
alter table public.reports_activities enable row level security;
drop policy if exists "Activities readable" on public.reports_activities;
create policy "Activities readable" on public.reports_activities for select using (true);
drop policy if exists "Auth insert activities" on public.reports_activities;
create policy "Auth insert activities" on public.reports_activities
  for insert to authenticated with check (true);

-- 8. EXTEND EXISTING report_drafts -----------------------------------------
create table if not exists public.report_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.report_drafts to authenticated;
grant all on public.report_drafts to service_role;
alter table public.report_drafts enable row level security;
drop policy if exists "Drafts owner only" on public.report_drafts;
create policy "Drafts owner only" on public.report_drafts
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 9. NEW: knowledge_articles -----------------------------------------------
create table if not exists public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  category text,
  tags text[] default '{}',
  status text not null default 'published',
  is_featured boolean not null default false,
  read_time_minutes integer default 5,
  view_count integer not null default 0,
  published_at timestamptz default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_articles_status on public.knowledge_articles(status);
grant select on public.knowledge_articles to anon, authenticated;
grant all on public.knowledge_articles to service_role;
alter table public.knowledge_articles enable row level security;
drop policy if exists "Published articles readable" on public.knowledge_articles;
create policy "Published articles readable" on public.knowledge_articles
  for select using (status = 'published');

-- 10. NEW: community_campaigns ---------------------------------------------
create table if not exists public.community_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  cover_image text,
  category text,
  location jsonb,
  start_date timestamptz,
  end_date timestamptz,
  max_participants integer,
  current_participants integer not null default 0,
  status text not null default 'upcoming',
  is_featured boolean not null default false,
  organizer_name text,
  eco_points_reward integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_campaigns_status on public.community_campaigns(status);
grant select on public.community_campaigns to anon, authenticated;
grant all on public.community_campaigns to service_role;
alter table public.community_campaigns enable row level security;
drop policy if exists "Campaigns readable" on public.community_campaigns;
create policy "Campaigns readable" on public.community_campaigns for select using (true);

-- 11. NEW: environmental_alerts --------------------------------------------
create table if not exists public.environmental_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null,
  title text not null,
  message text,
  severity text default 'medium',
  location jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index if not exists idx_alerts_status on public.environmental_alerts(status, created_at desc);
grant select on public.environmental_alerts to anon, authenticated;
grant all on public.environmental_alerts to service_role;
alter table public.environmental_alerts enable row level security;
drop policy if exists "Alerts readable" on public.environmental_alerts;
create policy "Alerts readable" on public.environmental_alerts for select using (true);

-- 12. STORAGE BUCKETS ------------------------------------------------------
insert into storage.buckets (id, name, public) values ('report-evidence','report-evidence', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars','avatars', true)
  on conflict (id) do nothing;

drop policy if exists "Public read evidence" on storage.objects;
create policy "Public read evidence" on storage.objects
  for select using (bucket_id in ('report-evidence','avatars'));
drop policy if exists "Auth upload evidence" on storage.objects;
create policy "Auth upload evidence" on storage.objects
  for insert to authenticated with check (bucket_id in ('report-evidence','avatars'));
drop policy if exists "Owner delete evidence" on storage.objects;
create policy "Owner delete evidence" on storage.objects
  for delete to authenticated using (bucket_id in ('report-evidence','avatars') and owner = auth.uid());

-- 13. RPC FUNCTIONS (match frontend contract) ------------------------------

-- 13a. get_environmental_intelligence_summary
create or replace function public.get_environmental_intelligence_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  total_r integer;
  resolved_r integer;
  recent_r integer;
  avg_risk numeric;
begin
  select count(*)::int, coalesce(sum(case when status = 'Resolved' then 1 else 0 end),0)::int,
         coalesce(avg(ai_risk_score),0)::numeric
    into total_r, resolved_r, avg_risk
  from public.hazard_reports;
  select count(*)::int into recent_r from public.hazard_reports where created_at > now() - interval '30 days';
  return jsonb_build_object(
    'health_score', greatest(0, least(100, 100 - (avg_risk * 10)))::int,
    'total_reports', total_r,
    'resolved_reports', resolved_r,
    'resolution_rate', case when total_r > 0 then round((resolved_r::numeric / total_r) * 100, 1) else 0 end,
    'avg_risk_score', round(coalesce(avg_risk,0), 2),
    'recent_reports_30d', recent_r,
    'trend', 'stable',
    'community_status', case
      when total_r = 0 then 'Good'
      when (resolved_r::numeric / greatest(total_r,1)) > 0.7 then 'Excellent'
      when (resolved_r::numeric / greatest(total_r,1)) > 0.4 then 'Good'
      else 'Moderate' end,
    'generated_at', now()
  );
end $$;
grant execute on function public.get_environmental_intelligence_summary() to anon, authenticated;

-- 13b. get_ai_environmental_analysis
create or replace function public.get_ai_environmental_analysis()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  flood_pct numeric; waste_pct numeric; pollution_pct numeric; total_r int;
begin
  select count(*)::int into total_r from public.hazard_reports;
  if total_r = 0 then total_r := 1; end if;
  select (count(*) filter (where category ilike '%flood%'))::numeric * 100.0 / total_r into flood_pct from public.hazard_reports;
  select (count(*) filter (where category ilike '%waste%' or category ilike '%dump%'))::numeric * 100.0 / total_r into waste_pct from public.hazard_reports;
  select (count(*) filter (where category ilike '%pollut%' or category ilike '%burn%'))::numeric * 100.0 / total_r into pollution_pct from public.hazard_reports;
  return jsonb_build_object(
    'flood_risk', round(coalesce(flood_pct,0),1),
    'waste_accumulation', round(coalesce(waste_pct,0),1),
    'pollution_level', round(coalesce(pollution_pct,0),1),
    'water_quality', 70,
    'climate_impact', 55,
    'confidence_score', 0.82,
    'recommendations', jsonb_build_array(
      jsonb_build_object('type','Waste Accumulation','message','Deploy cleanup team to high-density zones','priority','high'),
      jsonb_build_object('type','Flood Prevention','message','Clear drainage channels before rainy season','priority','medium')
    ),
    'analysis_period', '30 days',
    'generated_at', now()
  );
end $$;
grant execute on function public.get_ai_environmental_analysis() to anon, authenticated;

-- 13c. get_dashboard_analytics
create or replace function public.get_dashboard_analytics()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  by_category jsonb; by_status jsonb; by_severity jsonb;
begin
  select coalesce(jsonb_object_agg(category, cnt), '{}'::jsonb) into by_category
    from (select category, count(*)::int as cnt from public.hazard_reports where category is not null group by category) s;
  select coalesce(jsonb_object_agg(status, cnt), '{}'::jsonb) into by_status
    from (select status, count(*)::int as cnt from public.hazard_reports where status is not null group by status) s;
  select coalesce(jsonb_object_agg(severity, cnt), '{}'::jsonb) into by_severity
    from (select severity, count(*)::int as cnt from public.hazard_reports where severity is not null group by severity) s;
  return jsonb_build_object(
    'by_category', by_category,
    'by_status', by_status,
    'by_severity', by_severity,
    'generated_at', now()
  );
end $$;
grant execute on function public.get_dashboard_analytics() to anon, authenticated;

-- 13d. global_search
create or replace function public.global_search(search_term text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare rpts jsonb; arts jsonb; camps jsonb;
begin
  select coalesce(jsonb_agg(row_to_json(r)), '[]'::jsonb) into rpts
    from (select id, title, category, status from public.hazard_reports
          where title ilike '%'||search_term||'%' or description ilike '%'||search_term||'%'
          limit 10) r;
  select coalesce(jsonb_agg(row_to_json(a)), '[]'::jsonb) into arts
    from (select id, title, slug, excerpt from public.knowledge_articles
          where status = 'published' and (title ilike '%'||search_term||'%' or excerpt ilike '%'||search_term||'%')
          limit 10) a;
  select coalesce(jsonb_agg(row_to_json(c)), '[]'::jsonb) into camps
    from (select id, title, slug, description from public.community_campaigns
          where title ilike '%'||search_term||'%' or description ilike '%'||search_term||'%'
          limit 10) c;
  return jsonb_build_object('reports', rpts, 'articles', arts, 'campaigns', camps);
end $$;
grant execute on function public.global_search(text) to anon, authenticated;

-- 14. REALTIME PUBLICATION -------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table public.hazard_reports;
exception when duplicate_object then null; when others then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null; when others then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.environmental_alerts;
exception when duplicate_object then null; when others then null; end $$;

-- =============================================================================
-- DONE. Verify in Table Editor + Database → Functions.
-- =============================================================================
