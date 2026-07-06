import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldAlert, LineChart, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  // When the user prefers reduced motion, skip the y-offset slide and
  // just cross-fade in place — respects OS-level accessibility settings
  // without removing the animation entirely.
  const rise = (y: number) => (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y });
  const settle = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-20 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="hero-drift absolute top-10 right-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 20%, black, transparent)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={rise(12)}
            animate={settle}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Environmental Community Health Observatory
          </motion.div>

          <motion.h1
            initial={rise(16)}
            animate={settle}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Cleaner communities,{' '}
            <span className="bg-gradient-to-br from-primary via-accent to-emerald-500 bg-clip-text text-transparent">
              powered by ECHO
            </span>
          </motion.h1>

          <motion.p
            initial={rise(16)}
            animate={settle}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Report environmental hazards, monitor community health, and drive real
            change with AI-verified intelligence.
          </motion.p>

          <motion.div
            initial={rise(16)}
            animate={settle}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" className="h-12 px-8 text-base shadow-premium" asChild>
              <Link to="/report">
                <ShieldAlert className="mr-2 h-5 w-5" />
                Report Hazard
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 border-primary/20 bg-background/60 px-8 text-base backdrop-blur" asChild>
              <Link to="/reports">
                <LineChart className="mr-2 h-5 w-5" />
                Track My Reports
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Free for citizens • Built for Nigeria • Trusted by community leaders
          </motion.p>
        </div>
      </div>
    </section>
  );
}
