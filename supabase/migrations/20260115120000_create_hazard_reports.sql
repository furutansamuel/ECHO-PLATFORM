-- Create hazard_reports table for environmental hazard submissions
CREATE TABLE IF NOT EXISTS public.hazard_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Hazard Information
  category TEXT NOT NULL CHECK (category IN (
    'Plastic Waste', 'Flood', 'Blocked Drainage', 'Illegal Dumpsite',
    'Stagnant Water', 'Water Pollution', 'Air Pollution', 'Illegal Burning',
    'Deforestation', 'Erosion', 'Open Sewage', 'Other Environmental Hazard'
  )),
  title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) >= 10 AND char_length(description) <= 1000),
  estimated_size TEXT NOT NULL,
  affected_area TEXT NOT NULL,
  date_observed DATE NOT NULL,
  time_observed TIME NOT NULL,
  immediate_risk TEXT NOT NULL,
  environmental_impact TEXT NOT NULL,
  required_action TEXT NOT NULL,
  
  -- Evidence (stored as JSON arrays of URLs)
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  video TEXT,
  
  -- Location
  location JSONB NOT NULL,
  
  -- Severity
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  
  -- Options
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  notify_volunteers BOOLEAN NOT NULL DEFAULT true,
  share_with_community BOOLEAN NOT NULL DEFAULT true,
  receive_updates BOOLEAN NOT NULL DEFAULT true,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Resolved', 'Rejected')),
  reference_number TEXT NOT NULL UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hazard_reports_user_id ON public.hazard_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_status ON public.hazard_reports(status);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_severity ON public.hazard_reports(severity);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_category ON public.hazard_reports(category);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_created_at ON public.hazard_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_reference_number ON public.hazard_reports(reference_number);

-- Enable Row Level Security
ALTER TABLE public.hazard_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON public.hazard_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view shared community reports
CREATE POLICY "Users can view shared reports"
  ON public.hazard_reports
  FOR SELECT
  TO authenticated
  USING (share_with_community = true);

-- Users can insert their own reports
CREATE POLICY "Users can insert own reports"
  ON public.hazard_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports (only before verification)
CREATE POLICY "Users can update own reports"
  ON public.hazard_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'Pending')
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reports (only before verification)
CREATE POLICY "Users can delete own reports"
  ON public.hazard_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'Pending');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
