-- Run this in the Supabase SQL editor to fix global_search.
-- Fixes: signature mismatch (search_term -> p_query/p_content_type/p_limit)
-- and missing total_results/query/severity/reference_number/created_at fields
-- that GlobalSearchPage.tsx already expects.

drop function if exists public.global_search(text);

create or replace function public.global_search(
  p_query text,
  p_content_type text default 'all',
  p_limit int default 20
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare rpts jsonb; arts jsonb; camps jsonb; total int;
begin
  select coalesce(jsonb_agg(row_to_json(r)), '[]'::jsonb) into rpts
    from (select id, title, category, status, severity, reference_number, created_at
          from public.hazard_reports
          where (p_content_type in ('all','reports'))
            and (title ilike '%'||p_query||'%' or description ilike '%'||p_query||'%')
          order by created_at desc
          limit p_limit) r;
  select coalesce(jsonb_agg(row_to_json(a)), '[]'::jsonb) into arts
    from (select id, title, slug, excerpt, category from public.knowledge_articles
          where (p_content_type in ('all','articles'))
            and status = 'published' and (title ilike '%'||p_query||'%' or excerpt ilike '%'||p_query||'%')
          limit p_limit) a;
  select coalesce(jsonb_agg(row_to_json(c)), '[]'::jsonb) into camps
    from (select id, title, slug, description, status, start_date from public.community_campaigns
          where (p_content_type in ('all','campaigns'))
            and (title ilike '%'||p_query||'%' or description ilike '%'||p_query||'%')
          limit p_limit) c;

  total := jsonb_array_length(rpts) + jsonb_array_length(arts) + jsonb_array_length(camps);

  return jsonb_build_object(
    'query', p_query,
    'total_results', total,
    'reports', rpts,
    'articles', arts,
    'campaigns', camps
  );
end $$;
grant execute on function public.global_search(text, text, int) to anon, authenticated;
