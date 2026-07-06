import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Megaphone, 
  Lightbulb, 
  AlertCircle, 
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const updates = [
  {
    type: 'Emergency Alert',
    title: 'Flood Warning: Lagos Mainland',
    description: 'Heavy rainfall expected. Residents in low-lying areas should take precautions.',
    time: '1 hour ago',
    icon: ShieldAlert,
    color: 'text-red-500',
    bg: 'bg-red-500/10'
  },
  {
    type: 'Government Notice',
    title: 'New Waste Management Policy',
    description: 'LASG announces updated collection schedules for Ikeja and Mushin.',
    time: '5 hours ago',
    icon: Megaphone,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    type: 'Environmental Tip',
    title: 'How to Recycle Plastic at Home',
    description: 'Simple steps to reduce your environmental footprint starting today.',
    time: 'Yesterday',
    icon: Lightbulb,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    type: 'NGO Campaign',
    title: 'Green Earth: Tree Planting',
    description: 'Join the nationwide tree planting campaign this weekend across 36 states.',
    time: '2 days ago',
    icon: AlertCircle,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  }
];

const CommunityUpdates = () => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="bg-card border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between bg-muted/10">
        <h3 className="font-bold text-sm">Community Updates</h3>
        <Button variant="ghost" size="sm" className="text-[10px] h-7 font-bold uppercase tracking-wider">View All</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {updates.map((update, index) => (
          <motion.div 
            key={update.title} 
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
            className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all group cursor-pointer border border-transparent hover:border-border hover:shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${update.bg} border shadow-sm group-hover:scale-105 transition-transform`}>
              <update.icon className={`h-6 w-6 ${update.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1.5">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${update.bg} ${update.color}`}>{update.type}</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">{update.time}</span>
              </div>
              <h4 className="font-bold text-sm mb-1.5 group-hover:text-primary transition-colors truncate tracking-tight">{update.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{update.description}</p>
              <button className="flex items-center gap-1 text-[10px] font-black uppercase text-primary tracking-widest hover:gap-2 transition-all">
                Read Detailed Analysis <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CommunityUpdates);
