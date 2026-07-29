import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Globe2, Sparkles, Award, Trophy, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { calculateLevel } from '@/lib/impact-constants';

interface EchoPulseHeroProps {
  healthScore: number;
  communityStatus: string;
  confidence: number;
  totalReports: number;
}

// Real Community Health -> ring/status language.
function pulseBand(score: number): 'healthy' | 'monitoring' | 'critical' {
  if (score >= 70) return 'healthy';
  if (score >= 40) return 'monitoring';
  return 'critical';
}

const bandCopy: Record<string, { label: string; quote: string; ring: string; ringTrack: string }> = {
  healthy: {
    label: 'Healthy Community',
    quote: 'Your actions keep your community healthier.',
    ring: 'var(--highlight-gold)',
    ringTrack: 'color-mix(in srgb, white 18%, transparent)',
  },
  monitoring: {
    label: 'Monitoring Needed',
    quote: 'A few issues need attention to keep things on track.',
    ring: 'var(--highlight-gold)',
    ringTrack: 'color-mix(in srgb, white 18%, transparent)',
  },
  critical: {
    label: 'Critical Attention Needed',
    quote: 'Your community needs urgent action right now.',
    ring: 'var(--pulse-critical-glow)',
    ringTrack: 'color-mix(in srgb, white 12%, transparent)',
  },
};

export function EchoPulseHero({ healthScore, communityStatus, confidence, totalReports }: EchoPulseHeroProps) {
  const { profile, userStats } = useAuth();
  const [rank, setRank] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const points = userStats?.eco_points ?? 0;
  const level = calculateLevel(points);
  const band = pulseBand(healthScore);
  const copy = bandCopy[band];

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    (async () => {
      const { count } = await supabase
        .from('user_stats')
        .select('user_id', { count: 'exact', head: true })
        .gt('eco_points', points);
      if (alive && typeof count === 'number') setRank(count + 1);
    })();
    return () => { alive = false; };
  }, [points]);

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, healthScore)) / 100) * circumference;

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] p-6 text-white shadow-xl ${
        band === 'critical' ? 'gradient-critical' : 'gradient-primary'
      }`}
    >
      {/* Slowly rotating globe watermark */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 opacity-10"
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        <Globe2 className="h-56 w-56" />
      </motion.div>

      <div className="relative z-10 space-y-5">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/100">
            🌍 ECHO Status
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-2.5 py-1 text-[10px] font-extrabold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            LIVE
          </span>
        </div>

        <p className="text-xs font-semibold text-white/90">
  {profile?.region ? `Community: ${profile.region}` : 'Your Local Community'}
</p>


        {/* Ring */}
        <div className="flex flex-col items-center py-2">
          <div className="relative h-44 w-44">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke={copy.ringTrack} strokeWidth="12" />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke={copy.ring}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-5xl font-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {healthScore}
              </motion.span>
              <span className="text-[11px] font-semibold text-white/70">Community Health</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-bold">{copy.label}</p>
          <p className="mt-1 max-w-[240px] text-center text-xs text-white/75">{copy.quote}</p>
        </div>

        {/* Stat grid: Fully centered 4-column layout on desktop, 2-column on mobile */}
        <div className="border-t border-white/20 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4">
            
            {/* 1. Eco Points / Impact */}
            <div className="flex flex-col items-center justify-center text-center min-w-0">
              <div className="flex items-center justify-center gap-1.5 h-4 text-white/60 w-full">
                <Zap className="h-3 w-3 shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest truncate">My Impact</p>
              </div>
              <p className="text-lg font-black truncate mt-1 w-full">{points.toLocaleString()} pts</p>
            </div>

            {/* 2. Level */}
            <div className="flex flex-col items-center justify-center text-center min-w-0">
              <div className="flex items-center justify-center gap-1.5 h-4 text-white/60 w-full">
                <Award className="h-3 w-3 shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest truncate">Level</p>
              </div>
              <p className="text-lg font-black truncate mt-1 w-full">
                {level.emoji} {level.name}
              </p>
            </div>

            {/* 3. Community Rank */}
            <div className="flex flex-col items-center justify-center text-center min-w-0">
              <div className="flex items-center justify-center gap-1.5 h-4 text-white/60 w-full">
                <Trophy className="h-3 w-3 shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest truncate">Community Rank</p>
              </div>
              <p className="text-lg font-black truncate mt-1 w-full">
                {rank ? `#${rank}` : '—'}
              </p>
            </div>

            {/* 4. AI Confidence */}
            <div className="flex flex-col items-center justify-center text-center min-w-0">
              <div className="flex items-center justify-center gap-1.5 h-4 text-white/60 w-full">
                <Sparkles className="h-3 w-3 shrink-0 text-white/80" />
                <p className="text-[10px] font-black uppercase tracking-widest truncate">AI Confidence</p>
              </div>
              <p className="text-lg font-black truncate mt-1 w-full">
                {totalReports > 0 ? `${confidence}%` : '—'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default React.memo(EchoPulseHero);

