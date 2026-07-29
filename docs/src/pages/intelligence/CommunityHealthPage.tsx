import React from 'react';
import HealthGauge from '@/components/intelligence/HealthScore/HealthGauge';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { Skeleton } from '@/components/ui/skeleton';
import { HeartPulse, TrendingUp, Info, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import CategoryScores from '@/components/intelligence/HealthScore/CategoryScores';
import HistoricalHealthChart from '@/components/intelligence/HealthScore/HistoricalHealthChart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CommunityHealthPage() {
  const { intelligenceSummary, aiAnalysis, loading } = useIntelligenceData();

  const healthCategories = aiAnalysis ? {
    flood_risk: 100 - aiAnalysis.flood_risk,
    waste_management: 100 - aiAnalysis.waste_accumulation,
    air_quality: 100 - aiAnalysis.pollution_level,
    water_quality: aiAnalysis.water_quality
  } : {};

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <HeartPulse className="h-8 w-8 text-primary" />
            Community Health Intelligence
          </h1>
          <p className="text-muted-foreground italic mt-1">
            Comprehensive environmental well-being monitoring for your local area
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 font-bold tracking-widest uppercase border-primary/20 text-primary">
            Live Index
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Gauge */}
        <Card className="lg:col-span-1 border-none shadow-2xl bg-gradient-to-br from-card to-primary/5 flex flex-col items-center justify-center p-8 overflow-hidden">
          <div className="relative mb-4">
            {loading ? (
              <Skeleton className="h-64 w-64 rounded-full" />
            ) : (
              <HealthGauge score={intelligenceSummary?.health_score || 0} />
            )}
          </div>
          <div className="text-center space-y-2 mt-4 relative z-10">
            <Badge className={`text-sm px-4 py-1 uppercase tracking-widest font-black ${
              (intelligenceSummary?.health_score || 0) >= 80 ? 'bg-status-safe text-white' : 
              (intelligenceSummary?.health_score || 0) >= 60 ? 'bg-status-warning text-white' : 'bg-destructive text-white'
            }`}>
              {intelligenceSummary?.community_status}
            </Badge>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium italic">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Stable progress this month</span>
            </div>
          </div>
        </Card>

        {/* Historical Trend */}
        <div className="lg:col-span-2">
          <HistoricalHealthChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div>
          {loading ? (
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          ) : (
            <CategoryScores scores={healthCategories} />
          )}
        </div>

        {/* Intelligence Insights */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-accent text-accent-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CheckCircle className="h-40 w-40" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Health Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {[
                "Improve water quality by reporting blocked sewage lines in Ward C.",
                "Participate in the upcoming Recycling Drive to boost waste score.",
                "Plant local trees near urban centers to mitigate air pollution."
              ].map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="mt-1 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium italic">{suggestion}</p>
                </div>
              ))}
              <Button variant="secondary" className="w-full mt-2 group font-bold">
                View Full Improvement Roadmap
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase text-primary">Data Integrity</h4>
              <p className="text-xs text-muted-foreground italic leading-relaxed mt-1">
                The Health Score is calculated using a weighted composite of report resolution rates, AI-detected risk levels, and community participation indices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
