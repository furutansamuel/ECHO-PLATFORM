-- ECHO Impact Framework v2
--
-- Aligns the Eco Points backend with the redesign's core philosophy:
-- "ECHO doesn't reward activity. ECHO rewards environmental impact."
-- Users no longer earn Eco Points for merely submitting a report — only for
-- verified/high-priority/critical/resolved outcomes. This migration also
-- introduces Reputation as an independent, non-redeemable trust score that
-- moves only on confirmed moderation decisions (never automatically by AI).
--
-- Additive only: existing eco_points/report counts are untouched, no rows
-- are deleted, no columns are dropped.

-- 1. Reputation — independent from Eco Points and Level.
ALTER TABLE public.user_stats
  ADD COLUMN IF NOT EXISTS reputation_score INTEGER NOT NULL DEFAULT 0;

-- 2. Submitting a report no longer awards Eco Points. It still creates the
--    stats row, increments total/pending counts, sends the notification,
--    and clears the draft — none of that is a reward, just bookkeeping.
CREATE OR REPLACE FUNCTION public.handle_new_report()
RETURNS TRIGGER AS $$
DECLARE
  v_stats_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.user_stats WHERE user_id = NEW.user_id
  ) INTO v_stats_exists;

  IF NOT v_stats_exists THEN
    INSERT INTO public.user_stats (user_id, total_reports, pending_reports)
    VALUES (NEW.user_id, 1, 1);
  ELSE
    UPDATE public.user_stats
    SET
      total_reports = total_reports + 1,
      pending_reports = pending_reports + 1,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;

  INSERT INTO public.notifications (user_id, title, message, type, report_id)
  VALUES (
    NEW.user_id,
    'Report Submitted',
    'Your report for ' || NEW.category || ' has been received. Reference: ' || NEW.reference_number,
    'report',
    NEW.id
  );

  DELETE FROM public.report_drafts WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Verification/resolution/rejection is where Eco Points and Reputation
--    actually move — and only on a confirmed status change, never on AI
--    output alone ("AI assists. Humans decide.").
CREATE OR REPLACE FUNCTION public.handle_report_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_points INTEGER;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'Verified' THEN
      v_points := 100;
      IF NEW.severity IN ('High', 'Critical') THEN
        v_points := v_points + 50;
      END IF;

      UPDATE public.user_stats
      SET
        verified_reports = verified_reports + 1,
        pending_reports = GREATEST(pending_reports - 1, 0),
        eco_points = eco_points + v_points,
        reputation_score = reputation_score + 5,
        updated_at = now()
      WHERE user_id = NEW.user_id;

      INSERT INTO public.notifications (user_id, title, message, type, report_id)
      VALUES (
        NEW.user_id,
        'Report Verified',
        'Your report "' || NEW.title || '" has been verified by the community. +' || v_points || ' Eco Points!',
        'reward',
        NEW.id
      );

    ELSIF NEW.status = 'Resolved' THEN
      UPDATE public.user_stats
      SET
        resolved_reports = resolved_reports + 1,
        eco_points = eco_points + 200,
        reputation_score = reputation_score + 10,
        updated_at = now()
      WHERE user_id = NEW.user_id;

      INSERT INTO public.notifications (user_id, title, message, type, report_id)
      VALUES (
        NEW.user_id,
        'Report Resolved',
        'Great news! Your report "' || NEW.title || '" has been resolved. +200 Eco Points!',
        'reward',
        NEW.id
      );

    ELSIF NEW.status = 'Rejected' THEN
      UPDATE public.user_stats
      SET
        pending_reports = GREATEST(pending_reports - 1, 0),
        reputation_score = GREATEST(reputation_score - 5, 0),
        updated_at = now()
      WHERE user_id = NEW.user_id;

      INSERT INTO public.notifications (user_id, title, message, type, report_id)
      VALUES (
        NEW.user_id,
        'Report Update',
        'Your report "' || NEW.title || '" requires additional information.',
        'alert',
        NEW.id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
