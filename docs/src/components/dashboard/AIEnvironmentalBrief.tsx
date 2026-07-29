import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ChevronRight } from 'lucide-react';
import type { IntelligenceSummary, AIEnvironmentalAnalysis } from '@/types/reports';

interface AIEnvironmentalBriefProps {
  summary: IntelligenceSummary | null;
  analysis: AIEnvironmentalAnalysis | null;
  totalReports: number;
}

export function AIEnvironmentalBrief({ summary, analysis, totalReports }: AIEnvironmentalBriefProps) {
  if (!summary) return null;

  const statusWord = summary.community_status.toLowerCase();
  const topRecommendation = analysis?.recommendations?.[0]?.message;

  const trendLine =
    summary.trend === 'increasing'
      ? `Reports have been trending up recently, with ${summary.recent_reports_30d} filed in the last 30 days.`
      : summary.trend === 'decreasing'
      ? `Reports have been trending down recently, with ${summary.recent_reports_30d} filed in the last 30 days.`
      : `Reporting activity has been steady, with ${summary.recent_reports_30d} filed in the last 30 days.`;

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Bot className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold">AI Environmental Brief</h3>
      </div>

      <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
        <p>Your community remains {statusWord} today.</p>
        <p>{trendLine}</p>
        {topRecommendation && <p>{topRecommendation}</p>}
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-[11px] font-medium text-muted-foreground">
          Generated from {totalReports} verified report{totalReports === 1 ? '' : 's'}
        </span>
        <Link
          to="/ai-intelligence"
          className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-primary"
        >
          Read Full Intelligence <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default React.memo(AIEnvironmentalBrief);
