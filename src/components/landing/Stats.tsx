import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, CheckCircle2, HeartPulse, Users } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

const stats = [
  { icon: FileText, value: 1250, label: 'Reports Submitted', suffix: '', tone: 'text-primary', bg: 'bg-primary/10' },
  { icon: CheckCircle2, value: 890, label: 'Cases Resolved', suffix: '', tone: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { icon: HeartPulse, value: 82, label: 'Health Score', suffix: '/100', tone: 'text-sky-600', bg: 'bg-sky-500/10' },
  { icon: Users, value: 45, label: 'Active Communities', suffix: '', tone: 'text-amber-600', bg: 'bg-amber-500/10' },
];

const AnimatedNumber = ({ n }: { n: number }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 100,
    config: { mass: 1, tension: 40, friction: 15 },
  });
  return <animated.span>{number.to((v) => Math.round(v).toLocaleString('en-US'))}</animated.span>;
};

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="border-y border-border/60 bg-muted/30 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-premium transition-all hover:-translate-y-1 hover:shadow-xl md:p-6"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.tone}`} />
              </div>
              <div className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                {isInView && <AnimatedNumber n={stat.value} />}
                <span className="text-lg text-muted-foreground">{stat.suffix}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
