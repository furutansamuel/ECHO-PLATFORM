-- Extend hazard_reports with verification workflow and AI analysis fields
-- Migration: 20260115120500_extend_hazard_reports_verification_ai.sql

-- Drop the old status check constraint
ALTER TABLE hazard_reports DROP CONSTRAINT IF EXISTS hazard_reports_status_check;

-- Add new status values to support the full lifecycle
ALTER TABLE hazard_reports ADD CONSTRAINT hazard_reports_status_check 
  CHECK (status = ANY (ARRAY[
    'Draft'::text, 
    'Submitted'::text, 
    'Under Review'::text, 
    'Pending Verification'::text, 
    'Verified'::text, 
    'Assigned'::text, 
    'In Progress'::text, 
    'Resolved'::text, 
    'Closed'::text,
    'Pending'::text,  -- Keep for backward compatibility
    'Verified'::text, -- Keep for backward compatibility
    'Resolved'::text, -- Keep for backward compatibility
    'Rejected'::text  -- Keep for backward compatibility
  ]));

-- Add verification workflow fields
ALTER TABLE hazard_reports 
  ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending'::text,
  ADD COLUMN IF NOT EXISTS verifier_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS verification_notes text,
  ADD COLUMN IF NOT EXISTS verification_date timestamptz,
  ADD COLUMN IF NOT EXISTS verification_confidence numeric(3,2) CHECK (verification_confidence >= 0 AND verification_confidence <= 1),
  ADD COLUMN IF NOT EXISTS duplicate_id uuid REFERENCES hazard_reports(id);

-- Add AI analysis fields
ALTER TABLE hazard_reports 
  ADD COLUMN IF NOT EXISTS ai_risk_score numeric(3,2) CHECK (ai_risk_score >= 0 AND ai_risk_score <= 1),
  ADD COLUMN IF NOT EXISTS ai_priority text CHECK (ai_priority = ANY (ARRAY['Low'::text, 'Medium'::text, 'High'::text, 'Critical'::text])),
  ADD COLUMN IF NOT EXISTS ai_impact text,
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS ai_generated_at timestamptz;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_hazard_reports_verification_status ON hazard_reports(verification_status);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_verifier_id ON hazard_reports(verifier_id);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_ai_priority ON hazard_reports(ai_priority);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_ai_risk_score ON hazard_reports(ai_risk_score);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_duplicate_id ON hazard_reports(duplicate_id);

-- Add comments for documentation
COMMENT ON COLUMN hazard_reports.verification_status IS 'Verification workflow status: pending, in_progress, completed, rejected';
COMMENT ON COLUMN hazard_reports.verifier_id IS 'User ID of the assigned verifier';
COMMENT ON COLUMN hazard_reports.verification_notes IS 'Notes and observations from the verifier';
COMMENT ON COLUMN hazard_reports.verification_confidence IS 'Confidence score of verification (0.00 to 1.00)';
COMMENT ON COLUMN hazard_reports.duplicate_id IS 'Reference to duplicate report if detected';
COMMENT ON COLUMN hazard_reports.ai_risk_score IS 'AI-generated risk assessment score (0.00 to 1.00)';
COMMENT ON COLUMN hazard_reports.ai_priority IS 'AI-generated priority level for response';
COMMENT ON COLUMN hazard_reports.ai_impact IS 'AI-estimated community and environmental impact';
COMMENT ON COLUMN hazard_reports.ai_summary IS 'AI-generated summary and recommendations';
