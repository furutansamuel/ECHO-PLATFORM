import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Zap, 
  Users, 
  Award,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useReportsStore } from '@/hooks/use-reports-store';

const mockActivities = [
  {
    type: 'Hazard Submitted',
    title: 'New report: Improper Waste Disposal',
    description: 'Reported at Mushin Central, Lagos.',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    type: 'Report Verified',
    title: 'Community verified your report',
    description: 'Flood Risk at Lekki Phase 2 was verified by 5 users.',
    time: '5 hours ago',
    icon: CheckCircle2,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    type: 'AI Insight Generated',
    title: 'New environmental health insight',
    description: 'AI detected a 15% improvement in your local air quality.',
    time: 'Yesterday',
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10'
  },
  {
    type: 'Cleanup Joined',
    title: 'Joined Victoria Island Clean-up',
    description: 'You successfully registered for the upcoming event.',
    time: '2 days ago',
    icon: Users,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    type: 'Reward Earned',
    title: 'Earned 50 Impact Points',
    description: 'Awarded for verification of 3 community reports.',
    time: '3 days ago',
    icon: Award,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  }
];

const ActivityTimeline = () => {
  const { reports: storeReports } = useReportsStore();

  const allActivities = [
    ...storeReports.map(report => ({
      type: 'Hazard Submitted',
      title: `New report: ${report.title}`,
      description: `Reported at ${report.location.address || 'Unknown Location'}.`,
      time: 'Just now',
      icon: FileText,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    })),
    ...mockActivities
  ].slice(0, 10);

  return (
    <div className="bg-card border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-muted/10">
        <h3 className="font-bold text-sm">Activity Timeline</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {allActivities.map((activity, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
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

export default ActivityTimeline;
