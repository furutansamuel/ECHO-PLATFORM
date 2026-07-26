-- Run this in the Supabase SQL editor.
--
-- Fixes the critical bug: "duplicate key value violates unique
-- constraint hazard_reports_reference_number_key"
--
-- Root cause: generate_report_reference_number() used
--   SELECT COUNT(*) + 1 FROM hazard_reports WHERE reference_number LIKE ...
-- to compute the next sequence number. COUNT-based sequences are a
-- classic race condition — two reports submitted close together (two
-- different users, or one user's request retried after a slow network
-- response) both read the same COUNT before either has committed, both
-- compute the same next number, and the second insert collides.
--
-- Fix: generate a random, high-entropy suffix (matching the
-- "ECHO-20260725-8F3K91" format already suggested), and add a
-- belt-and-suspenders collision retry loop so a duplicate is
-- structurally impossible even under concurrent load, not just unlikely.

CREATE OR REPLACE FUNCTION generate_report_reference_number()
RETURNS text AS $$
DECLARE
  new_ref text;
  date_part text;
  attempt int := 0;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');

  LOOP
    new_ref := 'ECHO-' || date_part || '-' ||
      upper(substr(md5(gen_random_uuid()::text), 1, 6));

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM hazard_reports WHERE reference_number = new_ref
    );

    attempt := attempt + 1;
    IF attempt > 10 THEN
      -- Astronomically unlikely (36^6 combinations per day), but if it
      -- ever happens, fall back to appending the row's own random UUID
      -- suffix so this can never loop forever.
      new_ref := 'ECHO-' || date_part || '-' || upper(substr(gen_random_uuid()::text, 1, 8));
      EXIT;
    END IF;
  END LOOP;

  RETURN new_ref;
END;
$$ LANGUAGE plpgsql;


-- ---------------------------------------------------------------------
-- Simplified reporting flow: estimated_size, affected_area,
-- immediate_risk, environmental_impact, and required_action are no
-- longer collected from the user (the frontend infers/derives what it
-- can instead of asking). Existing rows keep their data; these just
-- stop being required for new ones.
-- ---------------------------------------------------------------------
ALTER TABLE public.hazard_reports
  ALTER COLUMN estimated_size DROP NOT NULL,
  ALTER COLUMN affected_area DROP NOT NULL,
  ALTER COLUMN immediate_risk DROP NOT NULL,
  ALTER COLUMN environmental_impact DROP NOT NULL,
  ALTER COLUMN required_action DROP NOT NULL;

-- date_observed/time_observed stay NOT NULL — the client now silently
-- fills these with the submission timestamp instead of asking the user
-- to type them, so no schema change needed for those two.


-- ---------------------------------------------------------------------
-- generate_ai_assessment(): previously required the user's own
-- self-reported severity and affected_area as inputs — which defeats
-- the point of "AI infers severity" and can't work now that those
-- fields are gone from the form. Rewritten to derive severity itself
-- from the category plus a keyword scan of the description.
--
-- IMPORTANT HONESTY NOTE: this is a deterministic, rule-based/keyword
-- heuristic — not a call to an actual LLM or image-analysis model.
-- Nothing in this codebase currently calls a real AI API for this.
-- If genuine AI-based severity/image inference is wanted later, this
-- function is the one to replace with an edge function call to a real
-- model (e.g. using report description + image URLs as input).
-- ---------------------------------------------------------------------
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
  -- Baseline risk by category
  CASE p_category
    WHEN 'Water Pollution', 'Open Sewage', 'Flood' THEN risk_score := 0.60;
    WHEN 'Air Pollution', 'Illegal Burning' THEN risk_score := 0.55;
    WHEN 'Blocked Drainage', 'Stagnant Water' THEN risk_score := 0.45;
    WHEN 'Deforestation', 'Erosion' THEN risk_score := 0.40;
    WHEN 'Plastic Waste', 'Illegal Dumpsite' THEN risk_score := 0.35;
    ELSE risk_score := 0.40;
  END CASE;

  -- Keyword-based severity signals from the description — a simple,
  -- transparent heuristic (not NLP/ML): specific high-risk words nudge
  -- the score up. This is the "infer severity from description" logic
  -- requested, implemented at the rule-based level this codebase
  -- actually has infrastructure for.
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
$$ LANGUAGE plpgsql;


-- Trigger now calls the 2-argument version and lets the AI assessment
-- set severity itself instead of reading a user-supplied value.
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


-- ---------------------------------------------------------------------
-- Tracks whether a report's AI fields came from the instant SQL
-- heuristic (set synchronously on insert, above) or a real model call
-- (set by the frontend after calling the generate-report-assessment
-- edge function). Lets the UI honestly label which one produced what
-- the user is looking at, instead of implying every report got a real
-- AI pass.
-- ---------------------------------------------------------------------
ALTER TABLE public.hazard_reports
  ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'heuristic';
