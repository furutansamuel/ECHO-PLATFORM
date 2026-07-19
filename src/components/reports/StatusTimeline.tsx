import React from 'react';
import { CheckCircle2, Clock, Eye, ShieldCheck, UserPlus, PlayCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { ReportStatus } from '@/types/reports';
import { cn } from '@/lib/utils';

interface StatusTimelineProps {
  currentStatus: ReportStatus;
  activities: { status: ReportStatus; timestamp: string; description: string }[];
}

const statusConfig: Record<ReportStatus, { icon: React.ElementType; color: string; description: string }> = {
  'Draft': { icon: Info, color: 'text-muted-foreground bg-muted', description: 'Report is being prepared' },
  'Pending': { icon: Clock, color: 'text-blue-500 bg-blue-50', description: 'Report received and awaiting review' },
  'Submitted': { icon: Clock, color: 'text-blue-500 bg-blue-50', description: 'Report received and awaiting review' },
  'Under Review': { icon: Eye, color: 'text-amber-500 bg-amber-50', description: 'Environmental officers are reviewing the report' },
  'Pending Verification': { icon: UserPlus, color: 'text-indigo-500 bg-indigo-50', description: 'Awaiting field verification by authorized personnel' },
  'Verified': { icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50', description: 'Hazard presence has been confirmed' },
  'Assigned': { icon: PlayCircle, color: 'text-cyan-500 bg-cyan-50', description: 'Response team has been assigned' },
  'In Progress': { icon: PlayCircle, color: 'text-primary bg-primary/10', description: 'Mitigation or cleanup is currently underway' },
  'Resolved': { icon: CheckCircle2, color: 'text-green-600 bg-green-50', description: 'The hazard has been addressed and mitigated' },
  'Closed': { icon: CheckCircle, color: 'text-muted-foreground bg-muted', description: 'The case is officially closed' },
  'Rejected': { icon: XCircle, color: 'text-destructive bg-destructive/10', description: 'This report was reviewed and rejected' },
};

const statusOrder: ReportStatus[] = [
  'Draft',
  'Pending',
  'Under Review',
  'Pending Verification',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, activities }) => {
  // Rejected is a terminal outcome outside the normal positive
  // progression — shown as its own state rather than forced into the
  // stepper (where it would have no valid position in statusOrder).
  if (currentStatus === 'Rejected') {
    const config = statusConfig['Rejected'];
    return (
      <div className="flex items-start gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive text-white shrink-0">
          <config.icon className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-destructive">Report Rejected</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activities.find((a) => a.status === 'Rejected')?.description || config.description}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-8 relative">
          {statusOrder.map((status, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const config = statusConfig[status];
            const activity = activities.find(a => a.status === status);

            return (
              <div key={status} className="flex gap-4 items-start">
                <div 
                  className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                    isCompleted ? "bg-primary border-primary text-white shadow-sm" : "bg-background border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  <config.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start">
                    <h4 className={cn(
                      "text-sm font-semibold",
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {status}
                    </h4>
                    {activity && (
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity?.description || config.description}
                  </p>
                  {isCurrent && (
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary animate-pulse">
                      Current Status
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
