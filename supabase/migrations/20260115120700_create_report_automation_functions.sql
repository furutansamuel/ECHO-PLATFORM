-- Create functions and triggers for report lifecycle automation
-- Migration: 20260115120700_create_report_automation_functions.sql

-- Function to generate unique reference numbers
CREATE OR REPLACE FUNCTION generate_report_reference_number()
RETURNS text AS $$
DECLARE
  new_ref text;
  year_part text;
  seq_part text;
  exists_count integer;
BEGIN
  -- Get current year (last 2 digits)
  year_part := to_char(now(), 'YY');
  
  -- Get next sequence number for this year
  SELECT COUNT(*) + 1 INTO exists_count 
  FROM hazard_reports 
  WHERE reference_number LIKE 'ECHO-' || year_part || '%';
  
  -- Format: ECHO-YY-XXXXX (e.g., ECHO-26-00001)
  seq_part := lpad(exists_count::text, 5, '0');
  new_ref := 'ECHO-' || year_part || '-' || seq_part;
  
  RETURN new_ref;
END;
$$ LANGUAGE plpgsql;

-- Function to generate mock AI assessment based on report data
CREATE OR REPLACE FUNCTION generate_ai_assessment(
  p_category text,
  p_severity text,
  p_description text,
  p_affected_area text
)
RETURNS jsonb AS $$
DECLARE
  risk_score numeric;
  priority text;
  impact text;
  summary text;
BEGIN
  -- Calculate risk score based on severity (0.00 to 1.00)
  CASE p_severity
    WHEN 'Low' THEN risk_score := 0.25;
    WHEN 'Medium' THEN risk_score := 0.50;
    WHEN 'High' THEN risk_score := 0.75;
    WHEN 'Critical' THEN risk_score := 0.95;
    ELSE risk_score := 0.50;
  END CASE;
  
  -- Adjust based on category
  IF p_category IN ('Water Pollution', 'Open Sewage', 'Flood') THEN
    risk_score := LEAST(risk_score + 0.10, 1.00);
  ELSIF p_category IN ('Air Pollution', 'Illegal Burning') THEN
    risk_score := LEAST(risk_score + 0.05, 1.00);
  END IF;
  
  -- Determine priority
  IF risk_score >= 0.80 THEN
    priority := 'Critical';
  ELSIF risk_score >= 0.60 THEN
    priority := 'High';
  ELSIF risk_score >= 0.40 THEN
    priority := 'Medium';
  ELSE
    priority := 'Low';
  END IF;
  
  -- Generate impact description
  CASE p_category
    WHEN 'Plastic Waste' THEN 
      impact := 'Moderate environmental impact. Affects local wildlife and drainage systems. Estimated ' || COALESCE(p_affected_area, '50') || ' square meters affected.';
    WHEN 'Flood' THEN 
      impact := 'High risk to community safety and infrastructure. Potential water contamination. Estimated ' || COALESCE(p_affected_area, '200') || ' households at risk.';
    WHEN 'Water Pollution' THEN 
      impact := 'Severe impact on water sources and public health. Immediate action required. Estimated ' || COALESCE(p_affected_area, '1000') || ' people affected.';
    WHEN 'Air Pollution' THEN 
      impact := 'Health hazard for nearby residents. Respiratory risks elevated. Estimated ' || COALESCE(p_affected_area, '500') || ' meters radius affected.';
    ELSE 
      impact := 'Environmental hazard requiring attention. Estimated ' || COALESCE(p_affected_area, '100') || ' area affected.';
  END CASE;
  
  -- Generate AI summary
  summary := 'AI Analysis: This ' || p_category || ' hazard has been assessed with a risk score of ' || 
             round(risk_score::numeric, 2) || '. Priority level: ' || priority || '. ' || 
             impact || ' Recommended action: Immediate assessment and community notification.';
  
  RETURN jsonb_build_object(
    'risk_score', risk_score,
    'priority', priority,
    'impact', impact,
    'summary', summary
  );
END;
$$ LANGUAGE plpgsql;

-- Function to log report activity
CREATE OR REPLACE FUNCTION log_report_activity(
  p_report_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_description text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO report_activities (report_id, user_id, action_type, description, metadata)
  VALUES (p_report_id, p_user_id, p_action_type, p_description, p_metadata);
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate reference number on insert
CREATE OR REPLACE FUNCTION auto_generate_reference_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_report_reference_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate AI assessment on insert
CREATE OR REPLACE FUNCTION auto_generate_ai_assessment()
RETURNS trigger AS $$
DECLARE
  ai_data jsonb;
BEGIN
  -- Generate AI assessment
  ai_data := generate_ai_assessment(
    NEW.category,
    NEW.severity,
    NEW.description,
    NEW.location->>'address'
  );
  
  -- Update the new row with AI data
  NEW.ai_risk_score := (ai_data->>'risk_score')::numeric;
  NEW.ai_priority := ai_data->>'priority';
  NEW.ai_impact := ai_data->>'impact';
  NEW.ai_summary := ai_data->>'summary';
  NEW.ai_generated_at := now();
  
  -- Log the activity
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

-- Trigger function to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS trigger AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM log_report_activity(
      NEW.id,
      COALESCE(NEW.verifier_id, NEW.user_id),
      'status_changed',
      'Status changed from ' || COALESCE(OLD.status, 'None') || ' to ' || NEW.status,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  
  -- Log verification completion
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    IF NEW.verification_status = 'completed' THEN
      PERFORM log_report_activity(
        NEW.id,
        NEW.verifier_id,
        'verification_completed',
        'Report verification completed',
        jsonb_build_object(
          'confidence', NEW.verification_confidence,
          'notes', NEW.verification_notes
        )
      );
    ELSIF NEW.verification_status = 'in_progress' THEN
      PERFORM log_report_activity(
        NEW.id,
        NEW.verifier_id,
        'verification_started',
        'Report verification started',
        '{}'::jsonb
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_auto_generate_reference ON hazard_reports;
CREATE TRIGGER trigger_auto_generate_reference
  BEFORE INSERT ON hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_reference_number();

DROP TRIGGER IF EXISTS trigger_auto_generate_ai ON hazard_reports;
CREATE TRIGGER trigger_auto_generate_ai
  BEFORE INSERT ON hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_ai_assessment();

DROP TRIGGER IF EXISTS trigger_log_status_change ON hazard_reports;
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION log_status_change();

-- Function to log initial report creation
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
  
  -- Award initial eco points
  PERFORM log_report_activity(
    NEW.id,
    NEW.user_id,
    'eco_points_awarded',
    '50 Eco Points awarded for submitting report',
    jsonb_build_object('points', 50)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_report_creation ON hazard_reports;
CREATE TRIGGER trigger_log_report_creation
  AFTER INSERT ON hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION log_report_creation();
