import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from "@/hooks/use-auth";
import { supabase } from '@/integrations/supabase/client';

export type HazardCategory = 
  | 'Plastic Waste'
  | 'Flood'
  | 'Blocked Drainage'
  | 'Illegal Dumpsite'
  | 'Stagnant Water'
  | 'Water Pollution'
  | 'Air Pollution'
  | 'Illegal Burning'
  | 'Deforestation'
  | 'Erosion'
  | 'Open Sewage'
  | 'Other Environmental Hazard';

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Report {
  id: string;
  category: HazardCategory;
  title: string;
  description: string;
  dateObserved: string;
  timeObserved: string;
  images: string[];
  video?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward: string;
    lga: string;
    state: string;
    landmark: string;
  };
  isAnonymous: boolean;
  notifyVolunteers: boolean;
  shareWithCommunity: boolean;
  receiveUpdates: boolean;
  status: 'Pending' | 'Verified' | 'Resolved' | 'Rejected';
  createdAt: string;
  referenceNumber: string;
}

export interface ReportStats {
  totalReports: number;
  verifiedReports: number;
  pendingReports: number;
  resolvedReports: number;
  ecoPoints: number;
  cleanupEvents: number;
  volunteerHours: number;
  hazardsReported: number;
  reportsVerified: number;
}

export interface EchoNotification {
  id: string;
  title: string;
  message: string;
  type: 'report' | 'ai' | 'alert' | 'event' | 'reward';
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY_DRAFTS = 'echo_drafts';
const STORAGE_KEY_NOTIFICATIONS = 'echo_notifications';

/** Calls the generate-report-assessment edge function (real Gemini call)
 * and, on success, updates the report row with the real assessment,
 * overwriting the instant heuristic values set by the DB trigger at
 * insert time. Silently leaves the heuristic in place on any failure —
 * this must never surface an error to the user, since submission
 * already succeeded before this runs. */
async function requestRealAiAssessment(reportId: string, report: Report) {
  if (!supabase) return;

  const { data, error } = await supabase.functions.invoke('generate-report-assessment', {
    body: {
      category: report.category,
      title: report.title,
      description: report.description,
      ward: report.location?.ward,
      lga: report.location?.lga,
    },
  });

  if (error || !data?.result) {
    throw error || new Error('No result returned');
  }

  const { severity, risk_score, priority, impact, summary } = data.result;

  await supabase
    .from('hazard_reports')
    .update({
      severity,
      ai_risk_score: risk_score,
      ai_priority: priority,
      ai_impact: impact,
      ai_summary: summary,
      ai_generated_at: new Date().toISOString(),
      ai_model: data.model || 'gemini-1.5-flash',
    })
    .eq('id', reportId);
}

export const useReportsStore = () => {
  const { user, userStats } = useAuth();
  const [draft, setDraft] = useState<Partial<Report> | null>(null);
  const EMPTY_STATS: ReportStats = {
  totalReports: 0,
  verifiedReports: 0,
  pendingReports: 0,
  resolvedReports: 0,
  ecoPoints: 0,
  cleanupEvents: 0,
  volunteerHours: 0,
  hazardsReported: 0,
  reportsVerified: 0,
};

  const [stats, setStats] = useState<ReportStats>(EMPTY_STATS);
  const [notifications, setNotifications] = useState<EchoNotification[]>([]);

  useEffect(() => {
    const storedDraft = localStorage.getItem(STORAGE_KEY_DRAFTS);
    if (storedDraft) setDraft(JSON.parse(storedDraft));

    if (user && userStats) {
      setStats({
        totalReports: userStats.total_reports ?? 0,
        verifiedReports: userStats.verified_reports ?? 0,
        pendingReports: userStats.pending_reports ?? 0,
        resolvedReports: userStats.resolved_reports ?? 0,
        ecoPoints: userStats.eco_points ?? 0,
        cleanupEvents: userStats.cleanup_events ?? 0,
        volunteerHours: userStats.volunteer_hours ?? 0,
        hazardsReported: userStats.total_reports ?? 0,
        reportsVerified: userStats.verified_reports ?? 0,
      });
    } else {
      setStats(EMPTY_STATS);
    }

    const storedNotifications = sessionStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, [user, userStats]);

  // Writes the submitted report to Supabase's hazard_reports table. This
  // previously never happened at all — reports only lived in local React
  // state / sessionStorage and vanished on reload, "demo mode" or not.
  // Column names are mapped from the HazardReport type (types/reports.ts),
  // which is already the confirmed real schema used by the map, analytics,
  // and tracking pages elsewhere in the app. estimatedSize/affectedArea/
  // dateObserved/timeObserved/immediateRisk/environmentalImpact/
  // requiredAction don't have dedicated columns in that type, so they're
  // folded into the description rather than silently discarded — worth
  // double-checking against your actual Supabase schema in case dedicated
  // columns exist for them.
  const saveReport = async (report: Report): Promise<boolean> => {
    if (!supabase) {
      toast.error('Unable to submit report: backend not configured.');
      return false;
    }
    if (!user) {
      toast.error('You must be signed in to submit a report.');
      return false;
    }

    // Column names verified against
    // supabase/migrations/20260115120000_create_hazard_reports.sql —
    // location is a single JSONB column (not flat lat/lng/address
    // columns), the owner column is user_id (not reporter_id), and
    // status must be 'Pending' on insert since the RLS policies that
    // let a citizen edit/delete their own report specifically check
    // status = 'Pending'. reference_number is left out entirely so the
    // auto_generate_reference_number() trigger assigns the real
    // ECHO-YYYYMMDD-XXXXXX number — the client-generated placeholder is
    // overwritten by reading it back below. severity is also left out —
    // auto_generate_ai_assessment() now computes and sets it from
    // category + description instead of a user-supplied value.
    // estimated_size/affected_area/immediate_risk/environmental_impact/
    // required_action are no longer collected from the user at all
    // (those columns are now nullable — see
    // docs/migrations/2026-07-25-fix-reference-number-and-simplify-report.sql).
    const { data, error } = await supabase
      .from('hazard_reports')
      .insert({
        title: report.title,
        description: report.description,
        category: report.category,
        date_observed: report.dateObserved,
        time_observed: report.timeObserved,
        status: 'Pending',
        location: report.location,
        images: report.images,
        video: report.video || null,
        is_anonymous: report.isAnonymous,
        notify_volunteers: report.notifyVolunteers,
        share_with_community: report.shareWithCommunity,
        receive_updates: report.receiveUpdates,
        user_id: user.id,
      })
      .select('id, reference_number')
      .single();

    if (error) {
      console.error('Error saving report:', error);
      toast.error('Failed to submit report: ' + error.message);
      return false;
    }

    // The DB trigger (handle_new_report) already awards eco points,
    // creates the "Report Submitted" notification, and clears the
    // saved draft server-side — so this function no longer duplicates
    // that locally. It just reflects the real generated reference
    // number back to the caller and refreshes local stats optimistically.
    report.referenceNumber = data.reference_number;
    report.id = data.id;

    // Real AI assessment: fired off in the background, not awaited.
    // The row already has an instant heuristic assessment from the
    // BEFORE INSERT trigger, so the user sees *something* immediately;
    // this silently upgrades it to a real model result a few seconds
    // later if it succeeds, and just leaves the heuristic in place
    // (ai_model stays 'heuristic') if it fails for any reason.
    requestRealAiAssessment(data.id, report).catch((err) => {
      console.warn('AI assessment upgrade failed, heuristic result stands:', err);
    });

    // Update local stats optimistically; the real numbers will refresh
    // from userStats once the DB trigger/RPC (if any) recalculates them.
    // Eco Points are NOT awarded for merely submitting — only verified,
    // high-priority/critical, or resolved outcomes earn points (see
    // handle_report_status_change in supabase/migrations), so ecoPoints
    // is left untouched here.
    const updatedStats = {
      ...stats,
      totalReports: stats.totalReports + 1,
      pendingReports: stats.pendingReports + 1,
    };
    setStats(updatedStats);

    // Add notification
    const newNotification: EchoNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Report Submitted',
      message: `Your report for ${report.category} has been received. Reference: ${report.referenceNumber}`,
      type: 'report',
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    sessionStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updatedNotifications));

    // Clear draft
    setDraft(null);
    sessionStorage.removeItem(STORAGE_KEY_DRAFTS);

    toast.success('Hazard report submitted successfully!');
    return true;
  };

  // Updates an existing report in place (used by the Edit flow reached
  // from ActionButtons' Edit button on a report's detail page). RLS only
  // permits this while status = 'Pending' — the same rule that already
  // governs deletion in ReportDetailsPage's handleWithdraw — so a report
  // that's moved past Pending will fail here with a clear error instead
  // of silently pretending to succeed.
  const updateReport = async (reportId: string, report: Partial<Report>): Promise<boolean> => {
    if (!supabase) {
      toast.error('Unable to update report: backend not configured.');
      return false;
    }
    if (!user) {
      toast.error('You must be signed in to edit a report.');
      return false;
    }

    const { data, error } = await supabase
      .from('hazard_reports')
      .update({
        title: report.title,
        description: report.description,
        category: report.category,
        date_observed: report.dateObserved,
        time_observed: report.timeObserved,
        location: report.location,
        images: report.images,
        video: report.video || null,
        is_anonymous: report.isAnonymous,
        notify_volunteers: report.notifyVolunteers,
        share_with_community: report.shareWithCommunity,
        receive_updates: report.receiveUpdates,
      })
      .eq('id', reportId)
      .eq('status', 'Pending')
      .select('id');

    if (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report: ' + error.message);
      return false;
    }

    // .update() without .select() returns no error even when the WHERE
    // clause (or RLS) matched zero rows — it would otherwise silently
    // report success on a report that's no longer Pending, or was
    // deleted, without saving anything.
    if (!data || data.length === 0) {
      toast.error('This report can no longer be edited — it may have already been reviewed.');
      return false;
    }

    toast.success('Report updated successfully.');
    return true;
  };

  const saveDraft = (partialReport: Partial<Report>) => {
    setDraft(partialReport);
    sessionStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(partialReport));
  };

  const deleteDraft = () => {
    setDraft(null);
    sessionStorage.removeItem(STORAGE_KEY_DRAFTS);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    sessionStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
  };

  return {
    draft,
    stats,
    notifications,
    saveReport,
    updateReport,
    saveDraft,
    deleteDraft,
    markNotificationAsRead,
  };
};
