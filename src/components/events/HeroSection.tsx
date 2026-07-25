import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, ArrowRight } from 'lucide-react';
import { useCountUp } from '@/hooks/use-count-up';

interface HeroSectionProps {
  upcomingCount: number;
  registeredVolunteers: number;
  onBrowseClick: () => void;
  onVolunteerClick: () => void;
}

function MiniStat({ value, label }: { value: number; label: string }) {
  const animated = useCountUp(value);
  return (
    <div className="text-center sm:text-left">
      <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">{animated.toLocaleString()}</p>
      <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mt-0.5">{label}</p>
    </div>
  );
}

export function HeroSection({ upcomingCount, registeredVolunteers, onBrowseClick, onVolunteerClick }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0">
        <img
          src="/images/community-cleanup.jpeg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 gradient-primary opacity-90" />
      </div>

      {/* Floating decorations — subtle, ambient, not distracting */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-10 right-[15%] text-white/20"
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Leaf className="h-16 w-16" />
          </motion.div>
          <motion.div
            className="absolute bottom-16 left-[8%] text-white/15"
            animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Leaf className="h-24 w-24" />
          </motion.div>
        </>
      )}

      <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 text-center sm:text-left">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto sm:mx-0"
        >
          <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm mb-5 gap-1.5 py-1.5 px-3">
            <Users className="h-3.5 w-3.5" /> Volunteer Programme
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
            Community Cleanup Events
          </h1>
          <p className="text-white/80 text-base sm:text-lg mt-5 max-w-xl mx-auto sm:mx-0 leading-relaxed">
            Join fellow Lafia residents in hands-on environmental action — from
            neighborhood cleanups to tree planting — and turn reports into
            real, visible change.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center sm:justify-start">
            <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 font-bold gap-2" onClick={onBrowseClick}>
              Browse Events <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white font-bold" onClick={onVolunteerClick}>
              Become a Volunteer
            </Button>
          </div>

          <div className="flex gap-10 mt-12 justify-center sm:justify-start">
            <MiniStat value={upcomingCount} label="Upcoming" />
            <MiniStat value={registeredVolunteers} label="Volunteers" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
