-- Fixes: "insert or update on table report_activities violates foreign
-- key constraint report_activities_report_id_fkey"
--
-- Root cause: auto_generate_ai_assessment() runs as a BEFORE INSERT
-- trigger on hazard_reports, but it called log_report_activity(NEW.id,
-- ...) — at the BEFORE INSERT stage the row doesn't exist in
-- hazard_reports yet, so the FK check on report_activities.report_id
-- fails immediately. This never surfaced before because report
-- submission never actually reached Supabase until recently.
--
-- Fix: the BEFORE trigger only computes and sets the AI columns (no
-- logging). The activity log entry moves into the existing AFTER
-- INSERT trigger (log_report_creation), which runs once the row is
-- real and can safely reference NEW.id.
-- Migration: 20260720080000_fix_ai_assessment_fk_violation.sql

CREATE OR REPLACE FUNCTION auto_generate_ai_assessment()
RETURNS trigger AS $$
DECLARE
  ai_data jsonb;
BEGIN
  ai_data := generate_ai_assessment(
    NEW.category,
    NEW.severity,
    NEW.description,
    NEW.location->>'address'
  );

  NEW.ai_risk_score := (ai_data->>'risk_score')::numeric;
  NEW.ai_priority := ai_data->>'priority';
  NEW.ai_impact := ai_data->>'impact';
  NEW.ai_summary := ai_data->>'summary';
  NEW.ai_generated_at := now();

  -- No activity logging here — NEW.id doesn't exist in hazard_reports
  -- yet at the BEFORE INSERT stage. Moved to log_report_creation below.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

  -- Moved here from auto_generate_ai_assessment() (a BEFORE INSERT
  -- trigger, where NEW.id doesn't exist in the table yet). This trigger
  -- is AFTER INSERT, so the row is real and NEW.ai_risk_score etc. are
  -- already populated by the BEFORE trigger that ran first.
  PERFORM log_report_activity(
    NEW.id,
    NEW.user_id,
    'ai_analysis_generated',
    'AI environmental analysis automatically generated',
    jsonb_build_object(
      'risk_score', NEW.ai_risk_score,
      'priority', NEW.ai_priority
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
