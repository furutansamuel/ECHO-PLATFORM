-- Create user_stats table for tracking eco points and contributions
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Report stats
  total_reports INTEGER NOT NULL DEFAULT 0,
  verified_reports INTEGER NOT NULL DEFAULT 0,
  pending_reports INTEGER NOT NULL DEFAULT 0,
  resolved_reports INTEGER NOT NULL DEFAULT 0,
  
  -- Community engagement
  cleanup_events INTEGER NOT NULL DEFAULT 0,
  volunteer_hours INTEGER NOT NULL DEFAULT 0,
  
  -- Gamification
  eco_points INTEGER NOT NULL DEFAULT 0,
  community_rank INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_eco_points ON public.user_stats(eco_points DESC);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own stats"
  ON public.user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view other users' public stats (rank, points)
CREATE POLICY "Users can view public stats"
  ON public.user_stats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own stats"
  ON public.user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all stats (for edge functions)
CREATE POLICY "Service role can manage stats"
  ON public.user_stats
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER set_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
