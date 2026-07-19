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
  estimatedSize: string;
  affectedArea: string;
  dateObserved: string;
  timeObserved: string;
  immediateRisk: string;
  environmentalImpact: string;
  requiredAction: string;
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
  severity: Severity;
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
        totalReports: userStats.reportsSubmitted ?? 0,
        verifiedReports: userStats.verifiedReports ?? 0,
        pendingReports: userStats.pendingReports ?? 0,
        resolvedReports: userStats.resolvedReports ?? 0,
        ecoPoints: userStats.eco_points ?? 0,
        cleanupEvents: userStats.cleanupEventsJoined ?? 0,
        volunteerHours: userStats.volunteerHours ?? 0,
        hazardsReported: userStats.hazardsReported ?? 0,
        reportsVerified: userStats.verifiedReports ?? 0,
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
    // ECHO-YY-NNNNN number — the client-generated placeholder is
    // overwritten by reading it back below.
    const { data, error } = await supabase
      .from('hazard_reports')
      .insert({
        title: report.title,
        description: report.description,
        category: report.category,
        estimated_size: report.estimatedSize,
        affected_area: report.affectedArea,
        date_observed: report.dateObserved,
        time_observed: report.timeObserved,
        immediate_risk: report.immediateRisk,
        environmental_impact: report.environmentalImpact,
        required_action: report.requiredAction,
        severity: report.severity,
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

    // Update local stats optimistically; the real numbers will refresh
    // from userStats once the DB trigger/RPC (if any) recalculates them.
    const updatedStats = {
      ...stats,
      totalReports: stats.totalReports + 1,
      pendingReports: stats.pendingReports + 1,
      ecoPoints: stats.ecoPoints + 50, // Award 50 points for reporting
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
    saveDraft,
    deleteDraft,
    markNotificationAsRead,
  };
};
