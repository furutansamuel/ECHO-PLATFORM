-- Three RPC functions the client calls (supabase.rpc('get_dashboard_analytics'),
-- 'get_ai_environmental_analysis', 'get_environmental_intelligence_summary')
-- that were never defined anywhere in any migration. Every call to them
-- returns "function does not exist", and use-intelligence-data.ts
-- re-throws two of those errors — which means the ENTIRE hook's fetch
-- fails before hazardReports/articles/campaigns/alerts ever get set,
-- even though those queries succeed. This is the root cause behind
-- "many dashboard statistics are empty," since 12 different
-- components/pages depend on this one hook.
--
-- These compute real aggregates from hazard_reports — no fabricated
-- numbers. get_ai_environmental_analysis uses a transparent, rule-based
-- formula (category mix + severity + resolution rate), same honest
-- approach as the existing generate_ai_assessment() function — it is
-- not a machine-learning prediction and isn't presented as one.
-- Migration: 20260723080000_missing_dashboard_rpcs.sql

create or replace function public.get_dashboard_analytics()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'hazard_trends', (
      select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select
          to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date,
          count(*) as count
        from public.hazard_reports
        where created_at > now() - interval '30 days'
        group by 1
        order by 1
      ) t
    ),
    'category_distribution', (
      select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select category, count(*) as count
        from public.hazard_reports
        group by category
        order by count desc
      ) t
    ),
    'severity_breakdown', (
      select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select severity, count(*) as count
        from public.hazard_reports
        group by severity
      ) t
    ),
    'resolution_stats', (
      select jsonb_build_object(
        'total', count(*),
        'resolved', count(*) filter (where status = 'Resolved'),
        'in_progress', count(*) filter (where status in ('In Progress', 'Assigned')),
        'pending', count(*) filter (where status in ('Pending', 'Submitted', 'Under Review', 'Pending Verification')),
        'rate', case when count(*) = 0 then 0
                 else round(count(*) filter (where status = 'Resolved')::numeric / count(*) * 100, 1)
                 end
      )
      from public.hazard_reports
    )
  ) into result;

  return result;
end;
$$;

create or replace function public.get_environmental_intelligence_summary()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
  unresolved_high integer;
  health_score integer;
  status_label text;
  recent_30d integer;
  prior_30d integer;
  trend_label text;
begin
  select count(*) into total from public.hazard_reports;
  select count(*) into unresolved_high
    from public.hazard_reports
    where severity in ('High', 'Critical') and status not in ('Resolved', 'Closed', 'Rejected');
  select count(*) into recent_30d
    from public.hazard_reports
    where created_at > now() - interval '30 days';
  select count(*) into prior_30d
    from public.hazard_reports
    where created_at > now() - interval '60 days' and created_at <= now() - interval '30 days';

  health_score := greatest(0, 100 - (unresolved_high * 8));

  status_label := case
    when health_score >= 80 then 'Good'
    when health_score >= 60 then 'Moderate'
    when health_score >= 40 then 'Concerning'
    else 'Critical'
  end;

  trend_label := case
    when recent_30d > prior_30d then 'increasing'
    when recent_30d < prior_30d then 'decreasing'
    else 'stable'
  end;

  return jsonb_build_object(
    'health_score', health_score,
    'community_status', status_label,
    'total_reports', total,
    'unresolved_high_severity', unresolved_high,
    'recent_reports_30d', recent_30d,
    'trend', trend_label
  );
end;
$$;

create or replace function public.get_ai_environmental_analysis()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
  flood_score integer;
  waste_score integer;
  pollution_score integer;
  water_score integer;
  resolution_rate numeric;
begin
  select count(*) into total from public.hazard_reports;

  select coalesce(round(
    count(*) filter (where category = 'Flood' and severity in ('High','Critical') and status not in ('Resolved','Closed','Rejected'))::numeric
    / nullif(count(*) filter (where category = 'Flood'), 0) * 100
  ), 0) into flood_score from public.hazard_reports;

  select coalesce(round(
    count(*) filter (where category in ('Plastic Waste','Illegal Dumpsite') and severity in ('High','Critical') and status not in ('Resolved','Closed','Rejected'))::numeric
    / nullif(count(*) filter (where category in ('Plastic Waste','Illegal Dumpsite')), 0) * 100
  ), 0) into waste_score from public.hazard_reports;

  select coalesce(round(
    count(*) filter (where category in ('Air Pollution','Illegal Burning') and severity in ('High','Critical') and status not in ('Resolved','Closed','Rejected'))::numeric
    / nullif(count(*) filter (where category in ('Air Pollution','Illegal Burning')), 0) * 100
  ), 0) into pollution_score from public.hazard_reports;

  select coalesce(round(
    count(*) filter (where category = 'Water Pollution' and severity in ('High','Critical') and status not in ('Resolved','Closed','Rejected'))::numeric
    / nullif(count(*) filter (where category = 'Water Pollution'), 0) * 100
  ), 0) into water_score from public.hazard_reports;

  select case when count(*) = 0 then 0
    else round(count(*) filter (where status = 'Resolved')::numeric / count(*) * 100, 1)
    end into resolution_rate
  from public.hazard_reports;

  return jsonb_build_object(
    'flood_risk', flood_score,
    'waste_accumulation', waste_score,
    'pollution_level', pollution_score,
    'water_quality', 100 - water_score,
    'confidence_score', case when total >= 10 then 70 else greatest(20, total * 5) end,
    'climate_impact', case
      when flood_score > 60 then 'High flood exposure based on recent reports'
      else 'Low-to-moderate climate risk based on current reports'
    end,
    'recommendations', jsonb_build_array(
      jsonb_build_object(
        'type', 'resolution',
        'message', case
          when resolution_rate < 30 then 'Resolution rate is low — prioritize triaging pending high-severity reports.'
          else 'Resolution rate is healthy. Focus on routine sanitation monitoring.'
        end
      )
    )
  );
end;
$$;

grant execute on function public.get_dashboard_analytics() to authenticated, anon;
grant execute on function public.get_environmental_intelligence_summary() to authenticated, anon;
grant execute on function public.get_ai_environmental_analysis() to authenticated, anon;
