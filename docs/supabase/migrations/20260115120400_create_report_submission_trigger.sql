-- Function to handle post-report-submission logic:
-- 1. Award eco points
-- 2. Create notification
-- 3. Update user stats
CREATE OR REPLACE FUNCTION public.handle_new_report()
RETURNS TRIGGER AS $$
DECLARE
  v_stats_exists BOOLEAN;
BEGIN
  -- Check if user_stats row exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_stats WHERE user_id = NEW.user_id
  ) INTO v_stats_exists;
  
  -- Create stats row if it doesn't exist
  IF NOT v_stats_exists THEN
    INSERT INTO public.user_stats (user_id, total_reports, pending_reports, eco_points)
    VALUES (NEW.user_id, 1, 1, 50);
  ELSE
    -- Update stats: increment reports and award points
    UPDATE public.user_stats
    SET 
      total_reports = total_reports + 1,
      pending_reports = pending_reports + 1,
      eco_points = eco_points + 50,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  -- Create notification for the user
  INSERT INTO public.notifications (user_id, title, message, type, report_id)
  VALUES (
    NEW.user_id,
    'Report Submitted',
    'Your report for ' || NEW.category || ' has been received. Reference: ' || NEW.reference_number,
    'report',
    NEW.id
  );
  
  -- Delete the user's draft if it exists
  DELETE FROM public.report_drafts WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new report insertion
CREATE TRIGGER on_report_submitted
  AFTER INSERT ON public.hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_report();

-- Function to handle report status changes (verification, resolution)
CREATE OR REPLACE FUNCTION public.handle_report_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Update user stats based on new status
    IF NEW.status = 'Verified' THEN
      UPDATE public.user_stats
      SET 
        verified_reports = verified_reports + 1,
        pending_reports = GREATEST(pending_reports - 1, 0),
        eco_points = eco_points + 100, -- Bonus for verification
        updated_at = now()
      WHERE user_id = NEW.user_id;
      
      -- Notification for verification
      INSERT INTO public.notifications (user_id, title, message, type, report_id)
      VALUES (
        NEW.user_id,
        'Report Verified',
        'Your report "' || NEW.title || '" has been verified by the community. +100 Eco Points!',
        'reward',
        NEW.id
      );
      
    ELSIF NEW.status = 'Resolved' THEN
      UPDATE public.user_stats
      SET 
        resolved_reports = resolved_reports + 1,
        eco_points = eco_points + 200, -- Bonus for resolution
        updated_at = now()
      WHERE user_id = NEW.user_id;
      
      -- Notification for resolution
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
        updated_at = now()
      WHERE user_id = NEW.user_id;
      
      -- Notification for rejection
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

-- Trigger on report status change
CREATE TRIGGER on_report_status_changed
  AFTER UPDATE OF status ON public.hazard_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_report_status_change();
