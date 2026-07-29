-- Fixes the AI Environmental Insight pipeline end-to-end.
-- Migration: 20260726000000_fix_ai_assessment_pipeline.sql
--
-- WHY THIS MIGRATION EXISTS
-- -------------------------
-- The logic to make severity/AI fields work with the simplified report
-- form (no user-supplied severity) was written to
--   docs/migrations/2026-07-25-fix-reference-number-and-simplify-report.sql
-- instead of supabase/migrations/. Files under docs/migrations are NOT
-- picked up by `supabase db push` or CLI migration history — they only
-- take effect if someone manually pastes them into the SQL Editor. If
-- that manual step was missed (or only partially run), the live
-- database can be running an older function that reads NEW.severity
-- but never sets it, while the frontend has already stopped sending
-- severity on insert. That mismatch alone explains NULL severity /
-- ai_priority / ai_summary / ai_risk_score on saved reports even though
-- the insert itself succeeds.
--
-- SECOND BUG this migration fixes even if the docs file WAS run: that
-- file re-adds a `PERFORM log_report_activity(NEW.id, ...)` call inside
-- auto_generate_ai_assessment(), which runs as a BEFORE INSERT trigger.
-- At that point NEW.id does not exist yet in hazard_reports, so the
-- foreign key check on report_activities.report_id fails and aborts
-- the whole insert. A prior migration
-- (20260720080000_fix_ai_assessment_fk_violation.sql) already fixed
-- this exact issue by moving that log call to the AFTER INSERT trigger
-- — the docs file silently reintroduced it. This migration keeps the
-- BEFORE trigger logging-free.
--
-- This migration is idempotent and safe to re-run.

-- 1. Make sure severity can be computed by the trigger instead of
--    required from the client. (No-op if already dropped.)
ALTER TABLE public.hazard_reports
  ALTER COLUMN severity DROP NOT NULL;

ALTER TABLE public.hazard_reports
  ALTER COLUMN estimated_size DROP NOT NULL,
  ALTER COLUMN affected_area DROP NOT NULL,
  ALTER COLUMN immediate_risk DROP NOT NULL,
  ALTER COLUMN environmental_impact DROP NOT NULL,
  ALTER COLUMN required_action DROP NOT NULL;

-- 2. Track which assessment produced the current AI fields (heuristic
--    vs a real model), so the UI can honestly label it.
ALTER TABLE public.hazard_reports
  ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'heuristic';

-- 3. Rewrite generate_ai_assessment() to derive severity itself from
--    category + a keyword scan of the description — no user-supplied
--    severity/affected_area required. This is a deterministic,
--    rule-based heuristic, not a call to a real model.
DROP FUNCTION IF EXISTS generate_ai_assessment(text, text, text, text);
DROP FUNCTION IF EXISTS generate_ai_assessment(text, text);

CREATE OR REPLACE FUNCTION generate_ai_assessment(
  p_category text,
  p_description text
)
RETURNS jsonb AS $$
DECLARE
  risk_score numeric;
  severity text;
  priority text;
  impact text;
  summary text;
  desc_lower text := lower(coalesce(p_description, ''));
  keyword_bump numeric := 0;
BEGIN
  CASE p_category
    WHEN 'Water Pollution', 'Open Sewage', 'Flood' THEN risk_score := 0.60;
    WHEN 'Air Pollution', 'Illegal Burning' THEN risk_score := 0.55;
    WHEN 'Blocked Drainage', 'Stagnant Water' THEN risk_score := 0.45;
    WHEN 'Deforestation', 'Erosion' THEN risk_score := 0.40;
    WHEN 'Plastic Waste', 'Illegal Dumpsite' THEN risk_score := 0.35;
    ELSE risk_score := 0.40;
  END CASE;

  IF desc_lower ~ '(dead fish|contaminat|overflow|collapse|children|hospital|school)' THEN
    keyword_bump := keyword_bump + 0.15;
  END IF;
  IF desc_lower ~ '(fire|burning|smoke|explosion)' THEN
    keyword_bump := keyword_bump + 0.15;
  END IF;
  IF desc_lower ~ '(large|massive|widespread|entire|everyone|whole)' THEN
    keyword_bump := keyword_bump + 0.10;
  END IF;
  IF desc_lower ~ '(small|minor|little|slight)' THEN
    keyword_bump := keyword_bump - 0.10;
  END IF;

  risk_score := LEAST(GREATEST(risk_score + keyword_bump, 0.10), 1.00);

  IF risk_score >= 0.80 THEN
    severity := 'Critical'; priority := 'Critical';
  ELSIF risk_score >= 0.60 THEN
    severity := 'High'; priority := 'High';
  ELSIF risk_score >= 0.35 THEN
    severity := 'Medium'; priority := 'Medium';
  ELSE
    severity := 'Low'; priority := 'Low';
  END IF;

  CASE p_category
    WHEN 'Plastic Waste', 'Illegal Dumpsite' THEN
      impact := 'Moderate environmental impact — affects local wildlife and drainage systems.';
    WHEN 'Flood' THEN
      impact := 'High risk to community safety and infrastructure, with potential water contamination.';
    WHEN 'Water Pollution', 'Open Sewage' THEN
      impact := 'Severe impact on water sources and public health — recommend prompt follow-up.';
    WHEN 'Air Pollution', 'Illegal Burning' THEN
      impact := 'Health hazard for nearby residents, with elevated respiratory risk.';
    ELSE
      impact := 'Environmental hazard requiring attention and follow-up assessment.';
  END CASE;

  summary := 'Automated assessment: this ' || p_category || ' report scores ' ||
             round(risk_score::numeric, 2) || ' (' || severity || ' severity, ' || priority ||
             ' priority) based on category and description keywords. ' || impact ||
             ' Recommended action: field verification and community notification.';

  RETURN jsonb_build_object(
    'severity', severity,
    'risk_score', risk_score,
    'priority', priority,
    'impact', impact,
    'summary', summary
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. BEFORE INSERT trigger: sets severity + AI columns, does NOT touch
--    report_activities (that stays in the AFTER trigger below).
CREATE OR REPLACE FUNCTION auto_generate_ai_assessment()
RETURNS trigger AS $$
DECLARE
  ai_data jsonb;
BEGIN
  ai_data := generate_ai_assessment(NEW.category, NEW.description);

  NEW.severity := ai_data->>'severity';
  NEW.ai_risk_score := (ai_data->>'risk_score')::numeric;
  NEW.ai_priority := ai_data->>'priority';
  NEW.ai_impact := ai_data->>'impact';
  NEW.ai_summary := ai_data->>'summary';
  NEW.ai_generated_at := now();
  NEW.ai_model := 'heuristic';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_generate_ai ON public.hazard_reports;
CREATE TRIGGER trigger_auto_generate_ai
  BEFORE INSERT ON public.hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_ai_assessment();

-- 5. AFTER INSERT trigger: this is the only place that logs to
--    report_activities for creation/AI-generation, since NEW.id is
--    real by this point.
CREATE OR REPLACE FUNCTION log_report_creation()
RETURNS trigger AS $$
BEGIN
  PERFORM log_report_activity(
    NEW.id,
    NEW.user_id,
    'created',
    'Report created: ' || NEW.category,
    jsonb_build_object(
      'category', NEW.category,
      'severity', NEW.severity,
      'reference_number', NEW.reference_number
    )
  );

  PERFORM log_report_activity(
    NEW.id,
    NEW.user_id,
    'eco_points_awarded',
    '50 Eco Points awarded for submitting report',
    jsonb_build_object('points', 50)
  );

  PERFORM log_report_activity(
    NEW.id,
    NEW.user_id,
    'ai_analysis_generated',
    'Automated environmental assessment generated',
    jsonb_build_object('risk_score', NEW.ai_risk_score, 'priority', NEW.ai_priority)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_report_creation ON public.hazard_reports;
CREATE TRIGGER trigger_log_report_creation
  AFTER INSERT ON public.hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION log_report_creation();

-- 6. One-time backfill: any existing rows saved while the pipeline was
--    broken still have NULL severity/AI fields. Compute it for them
--    now so historical reports aren't stuck showing "0/100".
UPDATE public.hazard_reports r
SET
  severity = COALESCE(r.severity, (ai_data->>'severity')),
  ai_risk_score = COALESCE(r.ai_risk_score, (ai_data->>'risk_score')::numeric),
  ai_priority = COALESCE(r.ai_priority, ai_data->>'priority'),
  ai_impact = COALESCE(r.ai_impact, ai_data->>'impact'),
  ai_summary = COALESCE(r.ai_summary, ai_data->>'summary'),
  ai_generated_at = COALESCE(r.ai_generated_at, now()),
  ai_model = COALESCE(r.ai_model, 'heuristic')
FROM (
  SELECT id, generate_ai_assessment(category, description) AS ai_data
  FROM public.hazard_reports
  WHERE severity IS NULL OR ai_summary IS NULL
) backfill
WHERE r.id = backfill.id;
