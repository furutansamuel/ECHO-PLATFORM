import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { FileText, CheckCircle2, HeartPulse, Users } from 'lucide-react';

const stats = [
  { icon: FileText, value: 1250, label: 'Reports Submitted', suffix: '', tone: 'text-primary', bg: 'from-primary/20 to-primary/5' },
  { icon: CheckCircle2, value: 890, label: 'Cases Resolved', suffix: '', tone: 'text-emerald-500', bg: 'from-emerald-500/20 to-emerald-500/5' },
  { icon: HeartPulse, value: 82, label: 'Health Score', suffix: '/100', tone: 'text-sky-500', bg: 'from-sky-500/20 to-sky-500/5' },
  { icon: Users, value: 45, label: 'Active Communities', suffix: '', tone: 'text-amber-500', bg: 'from-amber-500/20 to-amber-500/5' },
];

function CountUp({ to, active, duration = 1400 }: { to: number; active: boolean; duration?: number }) {
  const [n, setN] = useState(0);
  const startedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    if (prefersReducedMotion) {
      setN(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, duration, prefersReducedMotion]);

  return <>{n.toLocaleString('en-US')}</>;
}

export function Stats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      aria-labelledby="stats-heading"
      className="relative py-16 lg:py-24"
    >
      <div className="container mx-auto px-4">
        <h2 id="stats-heading" className="sr-only">Key statistics</h2>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/90 via-card/70 to-card/50 p-6 shadow-premium backdrop-blur-xl md:p-10"
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
                className="group relative rounded-2xl border border-border/40 bg-background/40 p-4 backdrop-blur-md transition-colors hover:border-primary/30 md:p-6"
              >
                <div
                  className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bg}`}
                  aria-hidden
                >
                  <stat.icon className={`h-5 w-5 ${stat.tone}`} aria-hidden />
                </div>
                <div className="text-2xl font-black tracking-tight text-foreground md:text-4xl">
                  <CountUp to={stat.value} active={isInView} />
                  <span className="text-base text-muted-foreground md:text-lg">{stat.suffix}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Stats;
