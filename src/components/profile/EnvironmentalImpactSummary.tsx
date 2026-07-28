import { memo, useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Calendar, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReducedMotion } from 'framer-motion';

interface ImpactStats {
  communitiesHelped: number;
  cleanupEventsJoined: number;
  volunteerHours: number;
  verificationRate: number;
}

interface EnvironmentalImpactSummaryProps {
  stats: ImpactStats;
}

// Same count-up technique as the landing page's Stats.tsx — plays once
// per mount rather than on every render, so it doesn't re-fire just
// because a parent re-rendered.
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const startedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (prefersReducedMotion) {
      setN(to);
      return;
    }
    const duration = 1200;
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
  }, [to, prefersReducedMotion]);

  return <>{n.toLocaleString('en-US')}{suffix}</>;
}

// Own component + own Card + React.memo: this section no longer re-renders
// (or repaints) when unrelated ProfilePage state changes — the Edit Profile
// modal opening, the level-progress bar animating, the avatar image
// finishing loading, etc. It only re-renders if `stats` itself changes.
// `contain: content` also tells the browser this box's layout/paint is
// independent of its surroundings, so nothing above or below it can visually
// bleed into it even during a reflow.
function EnvironmentalImpactSummaryBase({ stats }: EnvironmentalImpactSummaryProps) {
  const items = [
    {
      key: 'communitiesHelped',
      icon: Users,
      value: stats.communitiesHelped,
      suffix: '',
      label: 'Communities Helped',
      gradient: 'gradient-community',
    },
    {
      key: 'cleanupEventsJoined',
      icon: Calendar,
      value: stats.cleanupEventsJoined,
      suffix: '',
      label: 'Cleanup Events',
      gradient: 'gradient-primary',
    },
    {
      key: 'volunteerHours',
      icon: Clock,
      value: stats.volunteerHours,
      suffix: 'h',
      label: 'Volunteer Hours',
      gradient: 'gradient-analytics',
    },
    {
      key: 'verificationRate',
      icon: Target,
      value: stats.verificationRate,
      suffix: '%',
      label: 'Verification Rate',
      gradient: 'gradient-success',
    },
  ];

  return (
    <Card className="border-muted/20 [contain:content]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Environmental Impact Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ key, icon: Icon, value, suffix, label, gradient }) => (
            <div
              key={key}
              className="card-premium p-4 rounded-xl border text-center flex flex-col items-center gap-2"
            >
              <div className={`icon-badge ${gradient} h-11 w-11`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black">
                <CountUp to={value} suffix={suffix} />
              </p>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const EnvironmentalImpactSummary = memo(EnvironmentalImpactSummaryBase);

