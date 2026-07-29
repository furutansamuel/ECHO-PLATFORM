import { useAuth } from '@/hooks/use-auth';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const WelcomeHeader = () => {
  const { profile } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  if (!profile) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = profile.full_name?.split(' ')[0] || 'Citizen';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <motion.div 
      initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
        {getGreeting()}, <span className="text-primary">{firstName}</span> 👋
      </h1>
      <p className="mt-0.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        {profile.region && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {profile.region}
          </span>
        )}
        {profile.region && <span className="text-muted-foreground/40">•</span>}
        <span>{today}</span>
      </p>
    </motion.div>
  );
};

export default React.memo(WelcomeHeader);
