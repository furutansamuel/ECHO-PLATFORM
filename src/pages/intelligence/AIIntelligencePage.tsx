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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const AIIntelligencePage: React.FC = () => {
  const { hazardReports, intelligenceSummary, aiAnalysis, loading, refetch } = useIntelligenceData();

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
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

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
                (intelligenceSummary?.health_score || 0) >= 80 ? 'text-green-600 bg-green-50' : 
                (intelligenceSummary?.health_score || 0) >= 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
              }`}>
                {intelligenceSummary?.community_status || 'Moderate'}
              </Badge>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className={`h-4 w-4 ${intelligenceSummary?.trend === 'increasing' ? 'text-green-500' : 'text-red-500'}`} />
                <span>{intelligenceSummary?.trend === 'increasing' ? 'Improving' : intelligenceSummary?.trend === 'decreasing' ? 'Declining' : 'Stable'} trend from last month</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-primary/5 border-t border-primary/10 py-3 flex justify-center">
            <p className="text-xs italic text-primary/70">Next update in approx. 12 hours</p>
          </CardFooter>
        </Card>

        {/* AI Environmental Summary */}
        <Card className="lg:col-span-2 border-none shadow-2xl bg-gradient-to-br from-card to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <BrainCircuit className="h-5 w-5 text-accent" />
              AI Intelligence Executive Summary
            </CardTitle>
            <CardDescription>Synthetic analysis of current local conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <BrainCircuit className="h-12 w-12" />
              </div>
              <p className="text-sm leading-relaxed relative z-10">
                The current environmental intelligence for your community indicates a <strong>{intelligenceSummary?.community_status}</strong> status. 
                Our AI model has detected {aiAnalysis?.flood_risk && aiAnalysis.flood_risk > 40 ? 'elevated flood risks' : 'stable environmental patterns'} 
                based on recent report density. Waste accumulation remains a 
                {aiAnalysis?.waste_accumulation && aiAnalysis.waste_accumulation > 50 ? ' significant concern' : ' managed area'} with {hazardReports.length} total hazards mapped. 
                Immediate focus is recommended for {aiAnalysis?.recommendations?.[0]?.type || 'general sanitation'}.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 rounded-lg bg-background shadow-sm border border-border/50">
                <ShieldAlert className="h-5 w-5 text-destructive mb-2" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Avg Risk</span>
                <span className="text-xl font-black">{((intelligenceSummary?.avg_risk_score || 0) * 10).toFixed(1)}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-background shadow-sm border border-border/50">
                <Activity className="h-5 w-5 text-blue-500 mb-2" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Resol. Rate</span>
                <span className="text-xl font-black">{intelligenceSummary?.resolution_rate}%</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-background shadow-sm border border-border/50">
                <Zap className="h-5 w-5 text-amber-500 mb-2" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Confidence</span>
                <span className="text-xl font-black">{((aiAnalysis?.confidence_score || 0) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-background shadow-sm border border-border/50">
                <AlertCircle className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Reports</span>
                <span className="text-xl font-black">{intelligenceSummary?.total_reports}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Climate Impact Level</span>
                <span>{aiAnalysis?.climate_impact}%</span>
              </div>
              <Progress value={aiAnalysis?.climate_impact || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Indicators */}
        <Card className="premium-shadow border-primary/5 hover:border-primary/20 transition-all group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-blue-50">
                <Droplets className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Flood Risk</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{aiAnalysis?.flood_risk}%</span>
              <span className="text-xs text-muted-foreground">Probability</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
              <Info className="h-3 w-3" />
              <span>Based on terrain & reports</span>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-shadow border-primary/5 hover:border-primary/20 transition-all group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-emerald-50">
                <Trash2 className="h-5 w-5 text-emerald-600" />
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
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
              <Info className="h-3 w-3" />
              <span>Plastics & illegal dumping</span>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-shadow border-primary/5 hover:border-primary/20 transition-all group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-orange-50">
                <Wind className="h-5 w-5 text-orange-600" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Air Pollution</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{aiAnalysis?.pollution_level}%</span>
              <span className="text-xs text-muted-foreground">AQI Est.</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-orange-600">
              <Info className="h-3 w-3" />
              <span>Smoke & illegal burning</span>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-shadow border-primary/5 hover:border-primary/20 transition-all group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-cyan-50">
                <Activity className="h-5 w-5 text-cyan-600" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Water Quality</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{aiAnalysis?.water_quality}%</span>
              <span className="text-xs text-muted-foreground">Purity Index</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-cyan-600">
              <Info className="h-3 w-3" />
              <span>Source contamination risk</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
                key={idx}
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

        <Card className="shadow-xl border-none bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 opacity-10">
            <BrainCircuit className="h-64 w-64" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Preventive Measures</CardTitle>
            <CardDescription className="text-primary-foreground/70">Expert-verified environmental safeguards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {[
              "Clear perimeter drainages before expected rainfall cycles.",
              "Report persistent illegal burning to local LGA immediately.",
              "Organize community waste sorting at primary collection points.",
              "Monitor stagnant water areas for malaria vector control."
            ].map((measure, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="mt-1 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm">{measure}</p>
              </div>
            ))}
            <Button variant="secondary" className="w-full mt-4 group">
              View Detailed Action Plan
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

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
