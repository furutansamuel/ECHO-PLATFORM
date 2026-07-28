import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Thermometer, 
  Droplets, 
  Trash2, 
  Flame, 
  Bug, 
  Volume2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  Radio,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

// --- Type Definitions ---
export type EnvironmentalStatus = 'good' | 'monitoring' | 'watch' | 'critical';
export type TrendDirection = 'improving' | 'worsening' | 'stable';

export interface EnvironmentalMetric {
  id: string;
  label: string;
  value: string;
  status: EnvironmentalStatus;
  statusLabel: 'STABLE' | 'MONITORING' | 'WATCH' | 'CRITICAL';
  trend: TrendDirection;
  trendText: string;
  confidence?: number;
  subtext: string;
  details?: {
    summary: string;
    affectedAreas: string[];
    actionAdvice: string;
  };
  icon: React.ElementType;
}

export interface EnvironmentalDataProps {
  overallScore?: number;
  scoreChangeWeek?: number;
  overallStatus?: 'STABLE' | 'MONITORING' | 'WATCH' | 'CRITICAL';
  overallStatusText?: string;
  lastUpdatedMinutesAgo?: number;
  summaryStrip?: {
    goodText: string;
    watchText: string;
    criticalText: string;
  };
  metrics?: EnvironmentalMetric[];
  onMetricClick?: (metric: EnvironmentalMetric) => void;
}

// --- Default Props / Fallback Data ---
const defaultMetrics: EnvironmentalMetric[] = [
  {
    id: 'air',
    label: 'Air Quality',
    value: '42 AQI',
    status: 'good',
    statusLabel: 'STABLE',
    trend: 'improving',
    trendText: '↓ -4 AQI today',
    confidence: 98,
    subtext: 'Optimal respiratory levels',
    details: {
      summary: 'Particulate matter (PM2.5) levels are well within WHO safety limits across the central district.',
      affectedAreas: ['Downtown Core', 'Residential Sector 2', 'Northern Parklands'],
      actionAdvice: 'Great conditions for outdoor athletic activities and community sports.',
    },
    icon: Wind,
  },
  {
    id: 'flood',
    label: 'Flood Risk',
    value: 'Elevated',
    status: 'watch',
    statusLabel: 'WATCH',
    trend: 'worsening',
    trendText: '↑ Rainfall expected',
    confidence: 94,
    subtext: 'Monitoring low-lying drainage',
    details: {
      summary: 'Heavy precipitation forecast over the next 12 hours may stress primary drainage networks.',
      affectedAreas: ['Riverside Market Ward', 'Lower Basin Sector 4'],
      actionAdvice: 'Clear debris from stormwater grates and prepare emergency barriers if residing in lower basins.',
    },
    icon: CloudRain,
  },
  {
    id: 'temp',
    label: 'Temperature',
    value: '28°C',
    status: 'good',
    statusLabel: 'STABLE',
    trend: 'stable',
    trendText: '→ Seasonal average',
    subtext: 'Normal thermal index',
    details: {
      summary: 'Ambient temperatures remain balanced with low humidity indices.',
      affectedAreas: ['District-wide'],
      actionAdvice: 'No extreme thermal precautions required today.',
    },
    icon: Thermometer,
  },
  {
    id: 'water',
    label: 'Water Quality',
    value: '92%',
    status: 'good',
    statusLabel: 'STABLE',
    trend: 'improving',
    trendText: '↑ +2% purity index',
    confidence: 97,
    subtext: 'Potable municipal grid',
    details: {
      summary: 'Turbidity and chemical balance testing show pristine output from municipal purification hubs.',
      affectedAreas: ['Municipal Water Sector A', 'Sector B'],
      actionAdvice: 'Standard municipal tap water remains safe for immediate consumption.',
    },
    icon: Droplets,
  },
  {
    id: 'waste',
    label: 'Waste Collection',
    value: 'Delayed',
    status: 'monitoring',
    statusLabel: 'MONITORING',
    trend: 'stable',
    trendText: '→ Sector 4 blockage',
    confidence: 89,
    subtext: 'Sanitation route delay',
    details: {
      summary: 'Road obstructions in Sector 4 have delayed morning sanitation collection routes by 2 hours.',
      affectedAreas: ['Commercial Axis', 'Sector 4 Residential'],
      actionAdvice: 'Keep bins sealed to prevent urban wildlife exposure until trucks complete the secondary loop.',
    },
    icon: Trash2,
  },
  {
    id: 'fire',
    label: 'Fire Risk',
    value: 'Low',
    status: 'good',
    statusLabel: 'STABLE',
    trend: 'stable',
    trendText: '→ Soil moisture high',
    subtext: 'Minimal wildfire hazard',
    details: {
      summary: 'Vegetation moisture levels remain sufficiently high to suppress accidental ignition.',
      affectedAreas: ['Eastern Perimeter Forest'],
      actionAdvice: 'Standard fire safety rules apply.',
    },
    icon: Flame,
  },
  {
    id: 'disease',
    label: 'Disease Risk',
    value: 'Moderate',
    status: 'monitoring',
    statusLabel: 'MONITORING',
    trend: 'worsening',
    trendText: '↑ Vector breeding season',
    confidence: 86,
    subtext: 'Mosquito surveillance active',
    details: {
      summary: 'Stagnant water pools detected post-rainfall present elevated vector breeding potential.',
      affectedAreas: ['Ward 3 Ponds', 'Southern Canal Buffer'],
      actionAdvice: 'Inspect property surroundings for standing water and utilize larvae treatment larvicides.',
    },
    icon: Bug,
  },
  {
    id: 'noise',
    label: 'Noise Pollution',
    value: '68 dB',
    status: 'critical',
    statusLabel: 'CRITICAL',
    trend: 'worsening',
    trendText: '↑ Heavy transit corridor',
    confidence: 99,
    subtext: 'Exceeds residential threshold',
    details: {
      summary: 'Ongoing road infrastructure works combined with rerouted freight traffic exceed ambient dB limits.',
      affectedAreas: ['High Street Corridor', 'Ward 1 Junction'],
      actionAdvice: 'Acoustic insulation recommended for sensitive indoor workspaces along the main arterial route.',
    },
    icon: Volume2,
  },
];

// --- Status Color Design System ---
const statusStyles = {
  good: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 hover:border-emerald-500/40',
    border: 'border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
  },
  monitoring: {
    bg: 'bg-yellow-500/10 dark:bg-yellow-500/15 hover:border-yellow-500/40',
    border: 'border-yellow-500/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    dot: 'bg-yellow-500',
    badgeBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300',
  },
  watch: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15 hover:border-amber-500/40',
    border: 'border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
  },
  critical: {
    bg: 'bg-red-500/10 dark:bg-red-500/15 hover:border-red-500/40',
    border: 'border-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500 animate-pulse',
    badgeBg: 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300',
  },
};

export function EnvironmentalHealthOverview({
  overallScore = 84,
  scoreChangeWeek = 3,
  overallStatus = 'STABLE',
  overallStatusText = 'Conditions are overall favorable across your local community.',
  lastUpdatedMinutesAgo = 2,
  summaryStrip = {
    goodText: 'Air & Water Quality optimal',
    watchText: 'Flood Risk monitoring active',
    criticalText: '1 Noise Pollution alert on High St.',
  },
  metrics = defaultMetrics,
  onMetricClick,
}: EnvironmentalDataProps) {
  const [selectedMetric, setSelectedMetric] = useState<EnvironmentalMetric | null>(null);

  // SVG Gauge calculations
  const strokeDashoffset = 283 - (283 * overallScore) / 100;

  const handleCardClick = (m: EnvironmentalMetric) => {
    setSelectedMetric(m);
    if (onMetricClick) onMetricClick(m);
  };

  return (
    <div className="space-y-4">
      {/* 1. Live Indicator Header & Status Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            LIVE INTELLIGENCE
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Updated {lastUpdatedMinutesAgo} minutes ago
          </span>
        </div>
      </div>

      {/* 2. Today's Environmental Summary Ticker Strip */}
      <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-border/60 bg-muted/30 p-3 text-xs font-medium text-foreground backdrop-blur-sm">
        <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px] mr-1">
          Today's Summary:
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300">
          🟢 {summaryStrip.goodText}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300">
          🟡 {summaryStrip.watchText}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-red-700 dark:text-red-300">
          🔴 {summaryStrip.criticalText}
        </span>
      </div>

      {/* 3. Main Dashboard Matrix */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        
        {/* Environmental Score & Status Card */}
        <Card className="col-span-1 border-emerald-900/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-xl lg:col-span-4 rounded-[24px] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Radio className="h-32 w-32 text-emerald-400" />
          </div>

          <CardContent className="flex flex-col items-center justify-between p-6 text-center h-full relative z-10">
            <div className="w-full flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <span className="text-[11px] font-bold tracking-widest text-emerald-300/80 uppercase">
                Environmental Status
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300">
                🟢 {overallStatus}
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="relative my-4 flex items-center justify-center">
              <svg className="h-44 w-44 transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="11"
                  className="text-emerald-900/80"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="11"
                  strokeDasharray="326"
                  strokeDashoffset={326 - (326 * overallScore) / 100}
                  strokeLinecap="round"
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black tracking-tight text-white">{overallScore}</span>
                <span className="text-xs text-emerald-200/70 font-semibold">/ 100</span>
                <span className="mt-1 inline-flex items-center text-[10px] font-bold text-emerald-300 bg-emerald-800/60 px-1.5 py-0.5 rounded">
                  ▲ +{scoreChangeWeek} this week
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-emerald-50">Healthy Community Standing</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed max-w-xs">
                {overallStatusText}
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
                onClick={() => handleCardClick(m)}
                className={`group relative border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg rounded-[20px] ${style.bg} ${style.border}`}
              >
                <CardContent className="flex flex-col justify-between p-4 h-full">
                  {/* Top Bar: Icon & Status Label */}
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl bg-background/80 backdrop-blur-md shadow-sm ${style.text}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${style.badgeBg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      {m.statusLabel}
                    </span>
                  </div>

                  {/* Main Metric & Values */}
                  <div className="mt-3">
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs font-semibold text-muted-foreground">{m.label}</p>
                      {m.confidence && (
                        <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <Sparkles className="h-2.5 w-2.5" /> {m.confidence}%
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xl font-black tracking-tight text-foreground mt-0.5">
                      {m.value}
                    </p>

                    {/* Trend Indicator Line */}
                    <div className="mt-1.5 flex items-center justify-between border-t border-border/40 pt-1.5">
                      <span className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1">
                        {m.trend === 'improving' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                        {m.trend === 'worsening' && <TrendingDown className="h-3 w-3 text-red-500" />}
                        {m.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
                        {m.trendText}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>

      {/* 4. Interactive Metric Detail Dialog */}
      <Dialog open={!!selectedMetric} onOpenChange={(open) => !open && setSelectedMetric(null)}>
        {selectedMetric && (
          <DialogContent className="sm:max-w-[485px] rounded-[24px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className={`p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}>
                  <selectedMetric.icon className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">{selectedMetric.label} Diagnostic</DialogTitle>
                  <DialogDescription className="text-xs">
                    Real-time AI situational awareness & recommendations
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Metric Value & Confidence Header */}
              <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4 border border-border/60">
                <div>
                  <span className="text-xs text-muted-foreground font-medium">Current Status</span>
                  <p className="text-2xl font-black text-foreground">{selectedMetric.value}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[selectedMetric.status].badgeBg}`}>
                    {selectedMetric.statusLabel}
                  </span>
                  {selectedMetric.confidence && (
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      {selectedMetric.confidence}% Model Confidence
                    </p>
                  )}
                </div>
              </div>

              {/* Detail Summary */}
              {selectedMetric.details && (
                <>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overview</h4>
                    <p className="text-xs text-foreground/90 leading-relaxed bg-background p-3 rounded-xl border">
                      {selectedMetric.details.summary}
                    </p>
                  </div>

                  {/* Affected Wards */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Monitored Locations</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMetric.details.affectedAreas.map((area, idx) => (
                        <span key={idx} className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                          📍 {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Advice */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-950 dark:text-emerald-200">
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Recommended Community Action
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">
                      {selectedMetric.details.actionAdvice}
                    </p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
