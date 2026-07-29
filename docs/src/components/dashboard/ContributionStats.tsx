import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Award, 
  Trophy,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useReportsStore } from '@/hooks/use-reports-store';

const ContributionStats = () => {
  const { stats } = useReportsStore();
  const prefersReducedMotion = useReducedMotion();

  const contributionStats = [
    { label: 'Hazards Reported', value: stats.hazardsReported.toString(), icon: FileText, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Reports Verified', value: stats.reportsVerified.toString(), icon: CheckCircle2, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Cleanups Joined', value: '04', icon: Calendar, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Volunteer Hours', value: '24h', icon: Clock, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Points Earned', value: (stats.ecoPoints / 1000).toFixed(1) + 'k', icon: Award, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Community Rank', value: '#12', icon: Trophy, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {contributionStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : index * 0.05 }}
          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
          className="bg-card border rounded-2xl p-5 text-center transition-all cursor-pointer group shadow-sm hover:shadow-md hover:border-primary/20"
        >
          <div className={`mx-auto w-11 h-11 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transform transition-transform group-hover:rotate-6`}>
            <stat.icon className={`h-5.5 w-5.5 ${stat.color}`} />
          </div>
          <div className="flex items-center justify-center gap-1">
            <h4 className="text-2xl font-black tracking-tight">{stat.value}</h4>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">{stat.label}</p>
          
          <div className="mt-3 pt-3 border-t border-border/50 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[8px] font-black uppercase text-primary flex items-center gap-0.5">
               View All <ArrowUpRight className="h-2 w-2" />
             </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(ContributionStats);
