import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { HazardReport } from '@/types/reports';

interface EnvironmentalUpdatesCarouselProps {
  reports: HazardReport[];
}

const RESOLVED_STATUSES = ['Resolved', 'Closed'];

function severityMeta(report: HazardReport) {
  const isResolved = RESOLVED_STATUSES.includes(report.status);
  if (isResolved) {
    return { dot: '🟢', tint: 'bg-status-safe/10 border-status-safe/20', icon: CheckCircle2, iconColor: 'text-status-safe', tag: 'Resolved' };
  }
  if (report.severity === 'Critical' || report.severity === 'High') {
    return { dot: '🔴', tint: 'bg-destructive/10 border-destructive/20', icon: AlertTriangle, iconColor: 'text-destructive', tag: report.severity === 'Critical' ? 'High Risk' : 'High Severity' };
  }
  return { dot: '🟠', tint: 'bg-status-warning/10 border-status-warning/20', icon: AlertTriangle, iconColor: 'text-status-warning', tag: 'Monitoring' };
}

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.round(diffMs / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export function EnvironmentalUpdatesCarousel({ reports }: EnvironmentalUpdatesCarouselProps) {
  const items = useMemo(
    () =>
      [...reports]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8),
    [reports]
  );

  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold">🌍 Environmental Updates</h3>
      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pl-1 pr-4 scrollbar-none snap-x snap-mandatory">
        {items.map((report) => {
          const meta = severityMeta(report);
          const place = report.location?.ward || report.location?.lga || 'Unknown location';
          return (
            <div
              key={report.id}
              className={`flex w-56 flex-shrink-0 snap-start flex-col gap-2 rounded-2xl border p-4 ${meta.tint}`}
            >
              <div className="flex items-center gap-2 text-xs font-black">
                <span>{meta.dot}</span>
                <span className="truncate">{report.category}</span>
              </div>
              <p className="text-sm font-bold text-foreground">{place}</p>
              <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-2 text-[10px] font-bold uppercase tracking-wider">
                <span className={meta.iconColor}>{meta.tag}</span>
                <span className="text-muted-foreground">{formatRelativeTime(report.created_at)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(EnvironmentalUpdatesCarousel);
