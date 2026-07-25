import React, { useMemo } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'framer-motion';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { useAuth } from '@/hooks/use-auth';

const ActivityTimeline = () => {
  const { user } = useAuth();
  const { hazardReports } = useIntelligenceData();
  // Real hazard_reports schema uses `user_id` as the owner column and a
  // nested `location` JSONB object (not a flat `reporter_id`/`address`) —
  // verified against supabase/migrations/20260115120000_create_hazard_reports.sql.
  const storeReports = hazardReports.filter((r: any) => r.user_id === user?.id);
  const prefersReducedMotion = useReducedMotion();

  const formatRelativeTime = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diffMs / 60_000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    return days === 1 ? 'Yesterday' : `${days}d ago`;
  };

  const statusMeta = (status: string) => {
    if (status === 'Verified' || status === 'Resolved' || status === 'Closed') {
      return { type: 'Report Verified', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10' };
    }
    return { type: 'Hazard Submitted', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' };
  };

  const allActivities = useMemo(
    () => storeReports
      .map((report: any) => {
        const meta = statusMeta(report.status);
        return {
          id: `report-${report.id}`,
          type: meta.type,
          title: meta.type === 'Report Verified' ? `Verified: ${report.title}` : `New report: ${report.title}`,
          description: `Reported at ${report.location?.address || report.location?.ward || 'Unknown location'}.`,
          time: formatRelativeTime(report.created_at),
          icon: meta.icon,
          color: meta.color,
          bg: meta.bg,
        };
      })
      .slice(0, 10),
    [storeReports]
  );

  return (
    <div className="bg-card border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-muted/10">
        <h3 className="font-bold text-sm">Activity Timeline</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {allActivities.length === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-6">
              No activity yet — submit your first hazard report to see it here.
            </p>
          )}
          {allActivities.map((activity, index) => (
            <motion.div 
              key={activity.id} 
              initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="relative flex items-start gap-6 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-xl border bg-card shadow-sm shrink-0 z-10 transition-transform group-hover:scale-110">
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className={`text-[10px] font-black uppercase tracking-widest ${activity.color}`}>{activity.type}</div>
                  <time className="font-black text-[9px] text-muted-foreground uppercase whitespace-nowrap bg-muted/40 px-1.5 py-0.5 rounded-md">{activity.time}</time>
                </div>
                <div className="text-xs font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{activity.title}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{activity.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="p-3 border-t text-center bg-muted/10">
        <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest w-full gap-1.5 group">
          View Complete History
          <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ActivityTimeline);

