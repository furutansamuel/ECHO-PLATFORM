-- event_registrations RLS only lets a user see their own registration
-- rows (or an admin see everyone's) — correct for privacy, but it means
-- a public "48 volunteers signed up" count on the landing page has
-- nothing to read from. This view exposes only the aggregate count per
-- event, never individual user_ids, and is safe for public/anon access.
-- Migration: 20260718094500_event_registration_counts_view.sql

create or replace view public.event_registration_counts as
  select event_id, count(*)::integer as registered_count
  from public.event_registrations
  group by event_id;

grant select on public.event_registration_counts to anon, authenticated;
