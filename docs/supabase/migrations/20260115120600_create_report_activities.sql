-- Create report_activities table for tracking report lifecycle
-- Migration: 20260115120600_create_report_activities.sql

CREATE TABLE IF NOT EXISTS report_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES hazard_reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL CHECK (action_type = ANY (ARRAY[
    'created'::text,
    'draft_saved'::text,
    'submitted'::text,
    'status_changed'::text,
    'verification_started'::text,
    'verification_completed'::text,
    'verification_rejected'::text,
    'assigned'::text,
    'evidence_uploaded'::text,
    'location_updated'::text,
    'ai_analysis_generated'::text,
    'eco_points_awarded'::text,
    'duplicate_detected'::text,
    'resolved'::text,
    'closed'::text,
    'withdrawn'::text
  ])),
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE report_activities ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_activities_report_id ON report_activities(report_id);
CREATE INDEX IF NOT EXISTS idx_report_activities_user_id ON report_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_report_activities_action_type ON report_activities(action_type);
CREATE INDEX IF NOT EXISTS idx_report_activities_created_at ON report_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_activities_report_created ON report_activities(report_id, created_at DESC);

-- RLS Policies
-- Public can read all report activities (for transparency and community visibility)
CREATE POLICY "Public can view report activities"
  ON report_activities
  FOR SELECT
  USING (true);

-- Only authenticated users can create activities for their own reports
CREATE POLICY "Users can create activities for own reports"
  ON report_activities
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL OR -- Allow system-generated activities
    EXISTS (
      SELECT 1 FROM hazard_reports 
      WHERE id = report_id 
      AND user_id = auth.uid()
    )
  );

-- Only admins/system can update activities
CREATE POLICY "Admins can update report activities"
  ON report_activities
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'administrator'
    )
  );

-- Only admins/system can delete activities
CREATE POLICY "Admins can delete report activities"
  ON report_activities
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'administrator'
    )
  );

-- Add comments for documentation
COMMENT ON TABLE report_activities IS 'Tracks all lifecycle events and actions for hazard reports';
COMMENT ON COLUMN report_activities.action_type IS 'Type of action: created, status_changed, verification_completed, etc.';
COMMENT ON COLUMN report_activities.metadata IS 'Additional JSON data for the action (e.g., old/new status, verification details)';
