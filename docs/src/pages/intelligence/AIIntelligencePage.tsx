import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  Droplets, 
  Wind, 
  Trash2, 
  Zap, 
  AlertCircle,
  BrainCircuit,
  Info,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import HealthGauge from '@/components/intelligence/HealthScore/HealthGauge';
import { AISummaryNarrative } from '@/components/intelligence/AISummaryNarrative';
import { AIKeyMetrics } from '@/components/intelligence/AIKeyMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hrs = Math.round(diffMs / 3_600_000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'}`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}

// Higher value = worse, except for water_quality where higher = better
// (invert=true flips the color/label logic for that one metric).
function forecastBadge(value: number | undefined, invert = false) {
  const v = value ?? 0;
  const bad = invert ? v < 40 : v > 60;
  const mid = invert ? v >= 40 && v < 70 : v >= 30 && v <= 60;
  if (bad) return { label: invert ? 'Low ↓' : 'High ↑', className: 'bg-destructive/10 text-destructive' };
  if (mid) return { label: 'Stable →', className: 'bg-status-warning/10 text-status-warning' };
  return { label: invert ? 'Good ↑' : 'Low ↓', className: 'bg-status-safe/10 text-status-safe' };
}

const AIIntelligencePage: React.FC = () => {
  const { hazardReports, intelligenceSummary, aiAnalysis, loading, error, refetch } = useIntelligenceData();

  // Real hotspots: group hazard_reports by ward, rank by report count,
  // label severity by the most severe report seen in that ward.
  const hotspots = React.useMemo(() => {
    const severityRank: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    const byWard = new Map<string, { count: number; topSeverity: string; category: string }>();
    for (const r of hazardReports) {
      const ward = r.location?.ward || r.location?.lga || 'Unknown area';
      const existing = byWard.get(ward);
      if (!existing) {
        byWard.set(ward, { count: 1, topSeverity: r.severity, category: r.category });
      } else {
        existing.count += 1;
        if ((severityRank[r.severity] || 0) > (severityRank[existing.topSeverity] || 0)) {
          existing.topSeverity = r.severity;
          existing.category = r.category;
        }
      }
    }
    return Array.from(byWard.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4)
      .map(([location, data]) => ({
        location,
        issue: data.category,
        level: data.topSeverity,
        count: data.count,
      }));
  }, [hazardReports]);

  const forecastNarrative = React.useMemo(() => {
    if (!aiAnalysis) return 'AI forecast will appear once enough reports have been analyzed.';
    const floodTxt = aiAnalysis.flood_risk > 60 ? 'elevated flood risk' : aiAnalysis.flood_risk > 30 ? 'moderate flood risk' : 'low flood risk';
    const wasteTxt = aiAnalysis.waste_accumulation > 60 ? 'significant waste accumulation' : aiAnalysis.waste_accumulation > 30 ? 'moderate waste accumulation' : 'well-managed waste levels';
    const airTxt = aiAnalysis.pollution_level > 60 ? 'notable air pollution' : aiAnalysis.pollution_level > 30 ? 'moderate air quality concerns' : 'stable air quality';
    return `Based on ${intelligenceSummary?.total_reports ?? hazardReports.length} community reports over the last ${aiAnalysis.analysis_period}, the AI model detects ${floodTxt}, ${wasteTxt}, and ${airTxt}. ${aiAnalysis.recommendations?.[0]?.message || 'Continued community reporting will improve forecast accuracy.'}`;
  }, [aiAnalysis, intelligenceSummary, hazardReports.length]);

  if (loading && !intelligenceSummary) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'text-severity-critical bg-severity-critical/10 border-severity-critical/20';
      case 'high': return 'text-severity-high bg-severity-high/10 border-severity-high/20';
      case 'medium': return 'text-severity-medium bg-severity-medium/10 border-severity-medium/20';
      default: return 'text-severity-low bg-severity-low/10 border-severity-low/20';
    }
  };

  if (error && !intelligenceSummary) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto pt-20 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Couldn't load Environmental Intelligence</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={refetch} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            Environmental Intelligence
          </h1>
          <p className="text-muted-foreground italic mt-1">
            AI-powered community health monitoring and risk forecasting
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refetch}
          className="w-fit flex items-center gap-2 border-primary/20 hover:bg-primary/5"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </div>

      {/* Top Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Community Health Index */}
        <Card className="lg:col-span-1 overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Activity className="h-5 w-5 text-primary" />
              Community Health Index
            </CardTitle>
            <CardDescription>Overall environmental wellness score</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 pb-8">
            <HealthGauge score={intelligenceSummary?.health_score || 0} />
            
            <div className="mt-4 text-center">
              <Badge variant="outline" className={`text-lg px-4 py-1 mb-2 ${
                (intelligenceSummary?.health_score || 0) >= 80 ? 'text-status-safe bg-status-safe/10' : 
                (intelligenceSummary?.health_score || 0) >= 60 ? 'text-status-warning bg-status-warning/10' : 'text-destructive bg-destructive/10'
              }`}>
                {intelligenceSummary?.community_status || 'Moderate'}
              </Badge>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className={`h-4 w-4 ${intelligenceSummary?.trend === 'increasing' ? 'text-status-safe' : 'text-destructive'}`} />
                <span>{intelligenceSummary?.trend === 'increasing' ? 'Improving' : intelligenceSummary?.trend === 'decreasing' ? 'Declining' : 'Stable'} trend from last month</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-primary/5 border-t border-primary/10 py-3 flex justify-center">
            <p className="text-xs italic text-primary/70">Next update in approx. 12 hours</p>
          </CardFooter>
        </Card>

        {/* AI Environmental Summary — split into two independent, memoized
            cards (src/components/intelligence/AISummaryNarrative.tsx and
            AIKeyMetrics.tsx) so a refetch/re-render of one can't visually
            bleed into or replay animations in the other. */}
        <div className="lg:col-span-2 space-y-6">
          <AISummaryNarrative
            communityStatus={intelligenceSummary?.community_status}
            floodRisk={aiAnalysis?.flood_risk}
            wasteAccumulation={aiAnalysis?.waste_accumulation}
            totalHazards={hazardReports.length}
            topRecommendationType={aiAnalysis?.recommendations?.[0]?.type}
          />
          <AIKeyMetrics
            avgRiskScore={intelligenceSummary?.avg_risk_score || 0}
            resolutionRate={intelligenceSummary?.resolution_rate}
            confidenceScore={aiAnalysis?.confidence_score || 0}
            totalReports={intelligenceSummary?.total_reports}
            climateImpact={aiAnalysis?.climate_impact}
          />
        </div>
      </div>

      {/* Environmental Indicators */}
<Card className="premium-shadow border-primary/10 shadow-xl">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Activity className="h-5 w-5 text-primary" />
      Environmental Indicators
    </CardTitle>

    <CardDescription>
      Live AI analysis of key environmental conditions
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">

    {/* Flood */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-info" />
          <span className="font-semibold">Flood Risk</span>
        </div>

        <span className="font-bold">
          {aiAnalysis?.flood_risk ?? 0}%
        </span>
      </div>

      <Progress value={aiAnalysis?.flood_risk ?? 0} />
    </div>

    {/* Waste */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-secondary" />
          <span className="font-semibold">Waste Accumulation</span>
        </div>

        <span className="font-bold">
          {aiAnalysis?.waste_accumulation ?? 0}%
        </span>
      </div>

      <Progress value={aiAnalysis?.waste_accumulation ?? 0} />
    </div>

    {/* Air */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-severity-high" />
          <span className="font-semibold">Air Pollution</span>
        </div>

        <span className="font-bold">
          {aiAnalysis?.pollution_level ?? 0}%
        </span>
      </div>

      <Progress value={aiAnalysis?.pollution_level ?? 0} />
    </div>

    {/* Water */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-info" />
          <span className="font-semibold">Water Quality</span>
        </div>

        <span className="font-bold">
          {aiAnalysis?.water_quality ?? 0}%
        </span>
      </div>

      <Progress value={aiAnalysis?.water_quality ?? 0} />
    </div>

  </CardContent>
</Card>

        <Card className="premium-shadow border-primary/5 hover:border-primary/20 transition-all group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Trash2 className="h-5 w-5 text-secondary" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Waste Acc.</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{aiAnalysis?.waste_accumulation}%</span>
              <span className="text-xs text-muted-foreground">Density</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-secondary">
              <Info className="h-3 w-3" />
              <span>Plastics & illegal dumping</span>
            </div>
          </CardContent>
        </Card>
  
  <Card className="premium-shadow border-primary/10 shadow-xl">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <BrainCircuit className="h-5 w-5 text-primary" />
      AI Confidence
    </CardTitle>

    <CardDescription>
      Reliability of the current environmental analysis
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-5">

    <div>
      <div className="flex justify-between mb-2">
        <span>Prediction Confidence</span>
        <span className="font-bold">
          {aiAnalysis?.confidence_score ?? 0}%
        </span>
      </div>

      <Progress value={aiAnalysis?.confidence_score ?? 0} />
    </div>

    <div className="grid grid-cols-2 gap-4">

      <div className="rounded-xl border p-4">
        <p className="text-xs text-muted-foreground">
          Reports Analysed
        </p>

        <h2 className="text-2xl font-black">
          {intelligenceSummary?.total_reports ?? 0}
        </h2>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-xs text-muted-foreground">
          Last AI Update
        </p>

        <h2 className="text-lg font-bold">
          {aiAnalysis?.generated_at ? formatRelativeTime(aiAnalysis.generated_at) : 'N/A'}
        </h2>
      </div>

    </div>

  </CardContent>
</Card>

      {/* Recommendations & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-lg font-bold">AI Recommendations</CardTitle>
            <CardDescription>Suggested community and institutional actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiAnalysis?.recommendations?.map((rec, idx) => (
              <motion.div 
                key={rec.type ?? idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border flex gap-4 ${getPriorityColor(rec.priority)}`}
              >
                <div className="shrink-0 pt-1">
                  {rec.type === 'flood' ? <Droplets className="h-5 w-5" /> : 
                   rec.type === 'waste' ? <Trash2 className="h-5 w-5" /> : 
                   rec.type === 'water' ? <Activity className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm uppercase">{rec.type} Mitigation</span>
                    <Badge variant="outline" className="text-[9px] uppercase border-current">{rec.priority}</Badge>
                  </div>
                  <p className="text-sm opacity-90">{rec.message}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
<Card className="shadow-xl border-primary/10">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5 text-primary" />
      Top Environmental Hotspots
    </CardTitle>

    <CardDescription>
      Areas requiring immediate attention
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">

    {hotspots.length === 0 ? (
      <p className="text-sm text-muted-foreground italic text-center py-6">
        Not enough reported data yet to identify hotspots.
      </p>
    ) : hotspots.map((spot) => (

      <div
        key={spot.location}
        className="flex justify-between items-center rounded-xl border p-4 hover:bg-muted/40 transition"
      >

        <div>

          <h4 className="font-semibold">
            📍 {spot.location}
          </h4>

          <p className="text-sm text-muted-foreground">
            {spot.issue} · {spot.count} report{spot.count === 1 ? '' : 's'}
          </p>

        </div>

        <Badge
          className={
            spot.level === "Critical"
              ? "bg-severity-critical/10 text-severity-critical"
              : spot.level === "High"
              ? "bg-severity-high/10 text-severity-high"
              : "bg-severity-medium/10 text-severity-medium"
          }
        >
          {spot.level}
        </Badge>

      </div>

    ))}

  </CardContent>

  <CardFooter>

    <Button variant="outline" className="w-full">

      View Full Risk Map

      <ChevronRight className="ml-2 h-4 w-4"/>

    </Button>

  </CardFooter>

</Card>
      </div>
        {/* AI Environmental Forecast */}

<Card className="shadow-xl border-primary/10 bg-gradient-to-br from-primary/5 via-background to-primary/10">

  <CardHeader>

    <CardTitle className="flex items-center gap-2">

      <BrainCircuit className="h-5 w-5 text-primary" />

      AI Environmental Forecast

    </CardTitle>

    <CardDescription>

      Predicted environmental outlook for the next 7 days

    </CardDescription>

  </CardHeader>

  <CardContent className="space-y-6">

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="rounded-xl border p-4 text-center">

        <Droplets className="mx-auto h-8 w-8 text-info mb-2"/>

        <h4 className="font-bold">Flood Risk</h4>

        <Badge className={`mt-2 ${forecastBadge(aiAnalysis?.flood_risk).className}`}>

          {forecastBadge(aiAnalysis?.flood_risk).label}

        </Badge>

      </div>

      <div className="rounded-xl border p-4 text-center">

        <Trash2 className="mx-auto h-8 w-8 text-secondary mb-2"/>

        <h4 className="font-bold">Waste</h4>

        <Badge className={`mt-2 ${forecastBadge(aiAnalysis?.waste_accumulation).className}`}>

          {forecastBadge(aiAnalysis?.waste_accumulation).label}

        </Badge>

      </div>

      <div className="rounded-xl border p-4 text-center">

        <Wind className="mx-auto h-8 w-8 text-severity-high mb-2"/>

        <h4 className="font-bold">Air Quality</h4>

        <Badge className={`mt-2 ${forecastBadge(aiAnalysis?.pollution_level).className}`}>

          {forecastBadge(aiAnalysis?.pollution_level).label}

        </Badge>

      </div>

      <div className="rounded-xl border p-4 text-center">

        <Droplets className="mx-auto h-8 w-8 text-info mb-2"/>

        <h4 className="font-bold">Water</h4>

        <Badge className={`mt-2 ${forecastBadge(aiAnalysis?.water_quality, true).className}`}>

          {forecastBadge(aiAnalysis?.water_quality, true).label}

        </Badge>

      </div>

    </div>

    <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">

      <h3 className="font-bold text-lg mb-2">

        AI Summary

      </h3>

      <p className="text-muted-foreground leading-relaxed">

        {forecastNarrative}

      </p>

    </div>

  </CardContent>

</Card>

      <div className="text-center pb-8">
        <p className="text-xs text-muted-foreground">
          Last updated: {aiAnalysis?.generated_at ? new Date(aiAnalysis.generated_at).toLocaleString() : 'N/A'} • 
          Data source: {intelligenceSummary?.total_reports || 0} user reports & satellite indices
        </p>
      </div>
    </div>
  );
};

export default AIIntelligencePage;

