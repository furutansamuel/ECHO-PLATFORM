import React from 'react';
import { AlertTriangle, ShieldCheck, TrendingUp, Users, Activity } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const insightData = [
  {
    title: 'Top Hazard',
    value: 'Waste',
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    description: '32% of all reports'
  },
  {
    title: 'Safest Community',
    value: 'Lekki 1',
    icon: ShieldCheck,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    description: 'Minimal hazards'
  },
  {
    title: 'Highest Risk',
    value: 'Oshodi',
    icon: Activity,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    description: 'High waste density'
  },
  {
    title: 'Improvement',
    value: '+12%',
    icon: TrendingUp,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    description: 'Weekly health score'
  }
];

const EnvironmentalInsights = () => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {insightData.map((item, index) => (
        <motion.div 
          key={item.title} 
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
          className="bg-card rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all cursor-default group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2.5 rounded-xl ${item.bg} group-hover:scale-110 transition-transform`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">{item.title}</p>
              <h3 className="text-lg font-black tracking-tight mt-1">{item.value}</h3>
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(EnvironmentalInsights);
