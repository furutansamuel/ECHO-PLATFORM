-- Create report_drafts table for auto-saving in-progress reports
CREATE TABLE IF NOT EXISTS public.report_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Draft data stored as JSONB (matches ReportFormData schema)
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Metadata
  last_step INTEGER NOT NULL DEFAULT 0,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_report_drafts_user_id ON public.report_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_report_drafts_updated_at ON public.report_drafts(updated_at DESC);

-- Enable RLS
ALTER TABLE public.report_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own drafts
CREATE POLICY "Users can view own drafts"
  ON public.report_drafts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON public.report_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON public.report_drafts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON public.report_drafts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER set_drafts_updated_at
  BEFORE UPDATE ON public.report_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
