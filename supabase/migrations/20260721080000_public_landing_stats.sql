-- Real landing-page statistics. Stats.tsx currently shows hardcoded
-- fake numbers (1250 reports, 890 resolved, etc.) — this provides real
-- aggregate counts. hazard_reports RLS correctly restricts individual
-- report rows to their owner/admin/shared-only, so a public landing
-- page can't just SELECT COUNT(*) directly — this function returns
-- only aggregate counts (never row content), safe for anonymous access,
-- same pattern as the event_registration_counts view.
-- Migration: 20260721080000_public_landing_stats.sql

create or replace function public.get_public_landing_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'total_reports', (select count(*) from public.hazard_reports),
    'resolved_reports', (select count(*) from public.hazard_reports where status = 'Resolved'),
    'active_volunteers', (select count(*) from public.profiles where role = 'volunteer'),
    'communities_reached', (
      select count(distinct (location->>'lga'))
      from public.hazard_reports
      where location->>'lga' is not null
    )
  ) into result;

  return result;
end;
$$;

grant execute on function public.get_public_landing_stats() to anon, authenticated;
