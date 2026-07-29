import React from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import type { IntelligenceSummary } from '@/types/reports';

interface CommunityGoalCardProps {
  summary: IntelligenceSummary | null;
}

export function CommunityGoalCard({ summary }: CommunityGoalCardProps) {
  if (!summary) return null;

  const current = Math.round(summary.resolution_rate ?? 0);
  const target = 100;
  const outstanding = Math.max(0, summary.total_reports - summary.resolved_reports);

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-xl bg-highlight/15 p-2 text-highlight">
          <Sprout className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold">Community Goal</h3>
      </div>

      <p className="mb-1 text-xs font-semibold text-muted-foreground">
        Improve Community Resolution Rate
      </p>

      <div className="mb-2 flex items-center justify-between text-sm font-black">
        <span>{current}%</span>
        <span className="text-muted-foreground">→</span>
        <span>{target}%</span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-highlight"
          initial={{ width: 0 }}
          animate={{ width: `${current}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {outstanding > 0
          ? `${outstanding} unresolved report${outstanding === 1 ? '' : 's'} standing between your community and a fully resolved record.`
          : 'Every report in your community has been resolved.'}
      </p>
    </div>
  );
}

export default React.memo(CommunityGoalCard);
