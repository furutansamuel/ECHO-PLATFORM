import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Wind,
  CloudRain,
  Trash2,
  Droplets,
  Radio,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import HealthGauge from '@/components/intelligence/HealthScore/HealthGauge';
import { RewardsSummaryWidget } from '@/components/dashboard/RewardsSummaryWidget';
import { CleanupEventsWidget } from '@/components/dashboard/CleanupEventsWidget';
import { QuickActionsWidget } from '@/components/dashboard/QuickActionsWidget';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import KnowledgeCentrePreview from '@/components/dashboard/KnowledgeCentrePreview';

// --- Types ---
type EnvironmentalStatus = 'good' | 'monitoring' | 'watch' | 'critical';

interface EnvironmentalMetric {
  id: string;
  label: string;
  value: string;
  status: EnvironmentalStatus;
  statusLabel: 'STABLE' | 'MONITORING' | 'WATCH' | 'CRITICAL';
  subtext: string;
  icon: React.ElementType;
  details: {
    summary: string;
    affectedAreas: string[];
    actionAdvice: string;
  };
}

// A risk score (0-100, higher = worse) becomes a status band.
function statusFromRisk(score: number): { status: EnvironmentalStatus; label: EnvironmentalMetric['statusLabel'] } {
  if (score >= 76) return { status: 'critical', label: 'CRITICAL' };
  if (score >= 56) return { status: 'watch', label: 'WATCH' };
  if (score >= 31) return { status: 'monitoring', label: 'MONITORING' };
  return { status: 'good', label: 'STABLE' };
}

// A quality score (0-100, higher = better) — inverted polarity, e.g. water quality.
function statusFromQuality(score: number): { status: EnvironmentalStatus; label: EnvironmentalMetric['statusLabel'] } {
  if (score < 40) return { status: 'critical', label: 'CRITICAL' };
  if (score < 60) return { status: 'watch', label: 'WATCH' };
  if (score < 80) return { status: 'monitoring', label: 'MONITORING' };
  return { status: 'good', label: 'STABLE' };
}

const statusStyles: Record<EnvironmentalStatus, { bg: string; border: string; text: string; dot: string; badgeBg: string }> = {
  good: {
    bg: 'bg-status-safe/10 hover:border-status-safe/40',
    border: 'border-status-safe/20',
    text: 'text-status-safe',
    dot: 'bg-status-safe',
    badgeBg: 'bg-status-safe/15 text-status-safe',
  },
  monitoring: {
    bg: 'bg-info/10 hover:border-info/40',
    border: 'border-info/20',
    text: 'text-info',
    dot: 'bg-info',
    badgeBg: 'bg-info/15 text-info',
  },
  watch: {
    bg: 'bg-status-warning/10 hover:border-status-warning/40',
    border: 'border-status-warning/20',
    text: 'text-status-warning',
    dot: 'bg-status-warning',
    badgeBg: 'bg-status-warning/15 text-status-warning',
  },
  critical: {
    bg: 'bg-destructive/10 hover:border-destructive/40',
    border: 'border-destructive/20',
    text: 'text-destructive',
    dot: 'bg-destructive animate-pulse',
    badgeBg: 'bg-destructive/15 text-destructive',
  },
};

// Real category groupings the AI analysis RPC uses server-side —
// kept in sync with get_ai_environmental_analysis() in supabase/migrations.
const CATEGORY_GROUPS: Record<string, string[]> = {
  flood: ['Flood'],
  waste: ['Plastic Waste', 'Illegal Dumpsite'],
  pollution: ['Air Pollution', 'Illegal Burning'],
  water: ['Water Pollution'],
};

const ADVICE: Record<string, string> = {
  flood: 'Clear debris from stormwater drains near you and report any new flooding through the app.',
  waste: 'Avoid dumping in unauthorized sites and report illegal dumping so cleanup crews can be routed.',
  pollution: 'Limit outdoor burning and report smoke or air pollution sources in your area.',
  water: 'Avoid contact with visibly contaminated water sources and report suspected pollution.',
};

export default function Dashboard() {
  const { intelligenceSummary, aiAnalysis, hazardReports, loading, error } = useIntelligenceData();
  const [selectedMetric, setSelectedMetric] = useState<EnvironmentalMetric | null>(null);

  const totalReports = intelligenceSummary?.total_reports ?? 0;
  const healthScore = intelligenceSummary?.health_score ?? 0;
  const communityStatus = intelligenceSummary?.community_status ?? 'Moderate';
  const confidence = aiAnalysis?.confidence_score ?? 0;

  // Real affected wards per category — derived from the user's own visible
  // hazard reports (high/critical severity, not yet resolved), not invented.
  const affectedWardsFor = (categories: string[]): string[] => {
    const wards = new Set<string>();
    for (const r of hazardReports) {
      if (!categories.includes(r.category)) continue;
      if (!['High', 'Critical'].includes(r.severity)) continue;
      if (['Resolved', 'Closed', 'Rejected'].includes(r.status)) continue;
      const place = r.location?.ward || r.location?.lga;
      if (place) wards.add(place);
    }
    return Array.from(wards).slice(0, 4);
  };

  const metrics: EnvironmentalMetric[] = useMemo(() => {
    if (!aiAnalysis) return [];

    const flood = statusFromRisk(aiAnalysis.flood_risk ?? 0);
    const waste = statusFromRisk(aiAnalysis.waste_accumulation ?? 0);
    const pollution = statusFromRisk(aiAnalysis.pollution_level ?? 0);
    const water = statusFromQuality(aiAnalysis.water_quality ?? 0);

    return [
      {
        id: 'flood',
        label: 'Flood Risk',
        value: `${aiAnalysis.flood_risk ?? 0}%`,
        status: flood.status,
        statusLabel: flood.label,
        subtext: 'Share of flood reports still unresolved',
        icon: CloudRain,
        details: {
          summary: typeof aiAnalysis.climate_impact === 'string'
            ? aiAnalysis.climate_impact
            : 'Based on the ratio of unresolved high-severity flood reports in your community.',
          affectedAreas: affectedWardsFor(CATEGORY_GROUPS.flood),
          actionAdvice: ADVICE.flood,
        },
      },
      {
        id: 'waste',
        label: 'Waste Accumulation',
        value: `${aiAnalysis.waste_accumulation ?? 0}%`,
        status: waste.status,
        statusLabel: waste.label,
        subtext: 'Share of dumping/waste reports still unresolved',
        icon: Trash2,
        details: {
          summary: 'Based on the ratio of unresolved high-severity plastic waste and illegal dumpsite reports.',
          affectedAreas: affectedWardsFor(CATEGORY_GROUPS.waste),
          actionAdvice: ADVICE.waste,
        },
      },
      {
        id: 'pollution',
        label: 'Air Pollution Risk',
        value: `${aiAnalysis.pollution_level ?? 0}%`,
        status: pollution.status,
        statusLabel: pollution.label,
        subtext: 'Share of air pollution/burning reports still unresolved',
        icon: Wind,
        details: {
          summary: 'Based on the ratio of unresolved high-severity air pollution and illegal burning reports.',
          affectedAreas: affectedWardsFor(CATEGORY_GROUPS.pollution),
          actionAdvice: ADVICE.pollution,
        },
      },
      {
        id: 'water',
        label: 'Water Quality',
        value: `${aiAnalysis.water_quality ?? 0}%`,
        status: water.status,
        statusLabel: water.label,
        subtext: 'Estimated purity based on water pollution reports',
        icon: Droplets,
        details: {
          summary: 'Based on the ratio of unresolved high-severity water pollution reports.',
          affectedAreas: affectedWardsFor(CATEGORY_GROUPS.water),
          actionAdvice: ADVICE.water,
        },
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiAnalysis, hazardReports]);

  const circumference = 2 * Math.PI * 52;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Skeleton className="col-span-1 h-96 rounded-[24px] lg:col-span-4" />
          <div className="col-span-1 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-8">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 rounded-[20px]" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Live indicator */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-status-safe/30 bg-status-safe/10 px-3 py-1 text-xs font-bold text-status-safe">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-safe opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status-safe"></span>
            </span>
            COMMUNITY INTELLIGENCE
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {totalReports > 0
              ? `Based on ${totalReports} community report${totalReports === 1 ? '' : 's'} • ${confidence}% confidence`
              : 'No community reports yet'}
          </span>
        </div>
      </div>

      <QuickActionsWidget />

      {error ? (
        <Card className="border-none shadow-md border-l-4 border-l-destructive">
          <CardContent className="p-8 text-center space-y-2">
            <Radio className="h-8 w-8 mx-auto text-destructive" />
            <p className="text-sm font-semibold text-foreground">Couldn't load environmental intelligence</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">{error}</p>
          </CardContent>
        </Card>
      ) : totalReports === 0 ? (
        <Card className="border-none shadow-md">
          <CardContent className="p-8 text-center space-y-2">
            <Radio className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Not enough data yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Environmental intelligence is generated from community hazard reports. Once reports come in, this dashboard will fill in with real risk indicators for your area.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Health Score Card */}
          <Card className="col-span-1 border-none bg-gradient-primary text-white shadow-xl lg:col-span-4 rounded-[24px] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Radio className="h-32 w-32" />
            </div>
            <CardContent className="flex flex-col items-center justify-between p-6 text-center h-full relative z-10">
              <div className="w-full flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-[11px] font-bold tracking-widest text-white/80 uppercase">
                  Environmental Status
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/25 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                  {communityStatus}
                </span>
              </div>

              <div className="relative my-4 flex items-center justify-center scale-75 -my-4">
                <HealthGauge score={healthScore} />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Community Environmental Health</h3>
                <p className="text-xs text-white/80 leading-relaxed max-w-xs">
                  Score is computed from unresolved high-severity reports across your community — the fewer serious issues left open, the higher the score.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Diagnostic Metrics Grid */}
          <div className="col-span-1 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-8">
            {metrics.map((m) => {
              const style = statusStyles[m.status];
              const IconComponent = m.icon;

              return (
                <Card
                  key={m.id}
                  onClick={() => setSelectedMetric(m)}
                  className={`group relative border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg rounded-[20px] ${style.bg} ${style.border}`}
                >
                  <CardContent className="flex flex-col justify-between p-4 h-full">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl bg-background/80 backdrop-blur-md shadow-sm ${style.text}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${style.badgeBg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {m.statusLabel}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-semibold text-muted-foreground">{m.label}</p>
                      <p className="text-xl font-black tracking-tight text-foreground mt-0.5">
                        {m.value}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between border-t border-border/40 pt-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {m.subtext}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Personal impact + upcoming events — real widgets, already wired to live data */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RewardsSummaryWidget />
        <CleanupEventsWidget />
      </div>

      {/* Recent activity + learning resources */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityTimeline />
        <KnowledgeCentrePreview />
      </div>

      {/* Metric Detail Dialog */}
      <Dialog open={!!selectedMetric} onOpenChange={(open) => !open && setSelectedMetric(null)}>
        {selectedMetric && (
          <DialogContent className="sm:max-w-[485px] rounded-[24px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <selectedMetric.icon className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">{selectedMetric.label}</DialogTitle>
                  <DialogDescription className="text-xs">
                    Derived from real community hazard reports
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4 border border-border/60">
                <div>
                  <span className="text-xs text-muted-foreground font-medium">Current Reading</span>
                  <p className="text-2xl font-black text-foreground">{selectedMetric.value}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[selectedMetric.status].badgeBg}`}>
                    {selectedMetric.statusLabel}
                  </span>
                  <p className="text-[11px] font-semibold text-primary mt-1 flex items-center justify-end gap-1">
                    <Sparkles className="h-3 w-3" /> {confidence}% confidence
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overview</h4>
                <p className="text-xs text-foreground/90 leading-relaxed bg-background p-3 rounded-xl border">
                  {selectedMetric.details.summary}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {selectedMetric.details.affectedAreas.length > 0 ? 'Affected Areas' : 'Monitored Areas'}
                </h4>
                {selectedMetric.details.affectedAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMetric.details.affectedAreas.map((area, idx) => (
                      <span key={idx} className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                        📍 {area}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No specific wards currently flagged for this category.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-status-safe/30 bg-status-safe/10 p-3.5">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1 text-status-safe">
                  <ShieldCheck className="h-4 w-4" />
                  Recommended Community Action
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {selectedMetric.details.actionAdvice}
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
