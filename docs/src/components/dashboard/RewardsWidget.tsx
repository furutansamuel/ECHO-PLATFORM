import React from 'react';
import { Button } from '@/components/ui/button';
import { Award, Zap, Trophy, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const badges = [
  { name: 'Eco Starter', icon: Star, color: 'text-info', bg: 'bg-info/10' },
  { name: 'Hazard Hunter', icon: Zap, color: 'text-warning', bg: 'bg-warning/10' },
  { name: 'Nature Guardian', icon: Trophy, color: 'text-primary', bg: 'bg-primary/10' },
];

const RewardsWidget = () => {
  return (
    <div className="bg-card border rounded-2xl shadow-sm p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
        <Trophy className="h-24 w-24 text-primary" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div className="p-2 bg-warning/10 rounded-xl">
            <Award className="h-5 w-5 text-warning" />
          </div>
          Impact Center
        </h3>
        <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-2.5 py-1 uppercase tracking-wider">
          Rank #42
        </Badge>
      </div>

      <div className="flex items-center gap-5 mb-8 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-highlight to-warning flex items-center justify-center border shadow-xl shadow-warning/20 shrink-0 transform rotate-3">
          <Zap className="h-8 w-8 text-white fill-white" />
        </div>
        <div>
          <p className="text-3xl font-black tracking-tighter">1,250</p>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            Impact Points
            <TrendingUp className="h-2.5 w-2.5 text-success" />
          </p>
        </div>
      </div>

      <div className="space-y-6 flex-1 relative z-10">
        <div>
          <div className="flex justify-between items-end mb-2.5">
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current Status</p>
              <p className="text-sm font-black text-primary uppercase tracking-tight">Environmental Guardian</p>
            </div>
            <p className="text-[10px] font-bold">75% Complete</p>
          </div>
          <div className="relative">
            <Progress value={75} className="h-2.5 bg-secondary/10" />
            <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-tighter">
              <span>Novice</span>
              <span>Professional</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">Recent Badges</p>
          <div className="flex gap-3">
            {badges.map((badge, index) => (
              <motion.div 
                key={badge.name} 
                whileHover={{ y: -5, scale: 1.05 }}
                className={`w-12 h-12 rounded-xl ${badge.bg} flex items-center justify-center border border-border/40 hover:border-primary/30 shadow-sm transition-all cursor-pointer`}
                title={badge.name}
              >
                <badge.icon className={`h-6 w-6 ${badge.color}`} />
              </motion.div>
            ))}
            <div className="w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer group/add">
              <span className="text-[10px] font-black group-hover:scale-110 transition-transform">+5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t relative z-10">
        <Button className="w-full font-black uppercase tracking-widest text-[10px] h-11 gap-2 bg-gradient-to-r from-highlight to-warning border-none shadow-lg shadow-warning/20 hover:shadow-warning/40 hover:scale-[1.02] transition-all">
          View Achievements
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Helper Badge to avoid import errors if not exported from UI
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
);

export default RewardsWidget;
