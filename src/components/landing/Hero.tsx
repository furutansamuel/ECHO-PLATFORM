import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldAlert, LineChart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const slides = [
  {
    src: '/images/lafia-aerial.jpeg',
    alt: 'Aerial view of Lafia, Nasarawa State, Nigeria',
  },
  {
    src: '/images/community-cleanup.jpeg',
    alt: 'Community environmental cleanup in Nigeria',
  },
  {
    src: '/images/flood-monitoring.jpeg',
    alt: 'Flood monitoring and environmental hazards in Nigeria',
  },
  {
    src: '/images/environ-dash.jpeg',
    alt: 'Environmental intelligence dashboard and analytics',
  },
];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    if (prefersReducedMotion) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
  }, [prefersReducedMotion]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer]);

  const go = (next: number) => {
    setIndex((next + slides.length) % slides.length);
    startTimer();
  };

  const rise = (y: number) => (prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y });
  const settle = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
  <section
    className="relative overflow-hidden"
    aria-labelledby="hero-heading"
  >
      {/* Carousel background */}
      <div className="absolute inset-0">
        {/* Fallback gradient sits BEHIND images */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-accent/30" />
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={1920}
            height={1080}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
            decoding="async"
            onError={() => setFailed((prev) => ({ ...prev, [i]: true }))}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out',
              i === index && !failed[i] ? 'opacity-100' : 'opacity-0'
            )}
          />
        ))}
        {/* Dark overlay for readability sits ABOVE images */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background/85 dark:from-background/80 dark:via-background/70 dark:to-background/90" />
        {/* Subtle grain / dots */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>


      <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={rise(12)}
            animate={settle}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Environmental Intelligence for Safer Communities
          </motion.div>

          <motion.h2
  id="hero-heading"
  initial={rise(16)}
  animate={settle}
  transition={{ duration: 0.6, delay: 0.05 }}
  className="text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
>
  Environmental Community Health Observatory (ECHO)
</motion.h2>

          <motion.p
  initial={rise(16)}
  animate={settle}
  transition={{ duration: 0.6, delay: 0.15 }}
  className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl"
>
  Empowering communities to report, monitor, and respond to environmental hazards through AI-driven environmental intelligence.
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
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-primary/30 bg-background/60 px-8 text-base backdrop-blur"
              asChild
            >
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

        {/* Carousel controls */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground backdrop-blur-md transition-colors hover:bg-background/80"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  i === index ? 'w-8 bg-primary' : 'w-2 bg-foreground/30 hover:bg-foreground/50'
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground backdrop-blur-md transition-colors hover:bg-background/80"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
