import { useDemo } from '@/hooks/use-demo';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

const STORAGE_KEY_REPORTS = 'echo_reports';
const STORAGE_KEY_DRAFTS = 'echo_drafts';
const STORAGE_KEY_STATS = 'echo_stats';
const STORAGE_KEY_NOTIFICATIONS = 'echo_notifications';

export const useReportsStore = () => {
  const { isDemoMode } = useDemo();
  const [reports, setReports] = useState<Report[]>([]);
  const [draft, setDraft] = useState<Partial<Report> | null>(null);
  const DEMO_STATS: ReportStats = {
  totalReports: 124,
  verifiedReports: 89,
  pendingReports: 35,
  resolvedReports: 56,
  ecoPoints: 2450,
  cleanupEvents: 12,
  volunteerHours: 48,
  hazardsReported: 124,
  reportsVerified: 89,
};
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
    if (isDemoMode) {
      const storedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
    
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }
    }

    const storedDraft = localStorage.getItem(STORAGE_KEY_DRAFTS);
    if (storedDraft) setDraft(JSON.parse(storedDraft));

    if (isDemoMode) {
      const storedStats = localStorage.getItem(STORAGE_KEY_STATS);
      
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    } else {
      setStats(DEMO_STATS);
    }
  }
    
    if (isDemoMode) {
      const storedNotifications = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }
  }, [isDemoMode]);

  const saveReport = (report: Report) => {
    const updatedReports = [report, ...reports];
    setReports(updatedReports);
    
    if (isDemoMode) {
      localStorage.setItem(
        STORAGE_KEY_REPORTS,
        JSON.stringify(updatedReports)
      );
    }

    // Update stats
    const updatedStats = {
      ...stats,
      totalReports: stats.totalReports + 1,
      pendingReports: stats.pendingReports + 1,
      ecoPoints: stats.ecoPoints + 50, // Award 50 points for reporting
    };
    setStats(updatedStats);
    
    if (isDemoMode) {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(updatedStats));
    }

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
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updatedNotifications));

    // Clear draft
    setDraft(null);
    localStorage.removeItem(STORAGE_KEY_DRAFTS);

    toast.success('Hazard report submitted successfully!');
  };

  const saveDraft = (partialReport: Partial<Report>) => {
    setDraft(partialReport);
    localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(partialReport));
  };

  const deleteDraft = () => {
    setDraft(null);
    localStorage.removeItem(STORAGE_KEY_DRAFTS);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
  };

  return {
    reports,
    draft,
    stats,
    notifications,
    saveReport,
    saveDraft,
    deleteDraft,
    markNotificationAsRead,
  };
};
