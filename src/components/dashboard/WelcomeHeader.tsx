import { useAuth } from '@/hooks/use-auth';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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

  return (
    <motion.div 
      initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
        {getGreeting()}, <span className="text-primary">{firstName}</span> 👋
      </h1>
      <p className="text-sm text-muted-foreground font-medium mt-1">
        Your environmental updates at a glance.
      </p>
    </motion.div>
  );
};

export default React.memo(WelcomeHeader);
