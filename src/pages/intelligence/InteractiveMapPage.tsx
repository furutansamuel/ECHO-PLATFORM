import React from 'react';
import EnvironmentalMap from '@/components/intelligence/EnvironmentalMap/EnvironmentalMap';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Map as MapIcon, 
  AlertTriangle, 
  ShieldAlert, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

export default function InteractiveMapPage() {
  const { hazardReports, aiAnalysis, alerts, loading } = useIntelligenceData();

  // environmental_alerts rows aren't strongly typed (analyticsData/alerts
  // are `any[]` in the hook), so this falls back gracefully across a few
  // likely field names rather than assuming an exact schema.
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return null;
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const hours = Math.round(diffMs / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="h-[calc(100vh-5rem)] w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar Panel */}
      <aside className="w-full lg:w-96 bg-card border-r flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <MapIcon className="h-6 w-6 text-primary" />
            Live Hazard Map
          </h1>
          <p className="text-xs text-muted-foreground italic mt-1">Real-time geospatial environmental intelligence</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Active</p>
              <h3 className="text-xl font-black">{hazardReports.filter(r => r.status !== 'Resolved').length}</h3>
            </div>
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-center">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Critical</p>
              <h3 className="text-xl font-black text-destructive">{hazardReports.filter(r => r.severity === 'Critical').length}</h3>
            </div>
          </div>

          {/* AI Hotspots */}
          <Card className="border-none shadow-md bg-accent text-accent-foreground relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 opacity-10">
              <BrainCircuit className="h-24 w-24" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                <BrainCircuit className="h-4 w-4" />
                AI Hotspot Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <p className="text-[11px] italic opacity-90 leading-relaxed">
                3 high-density clusters detected in the last 48 hours. Primary risk: <strong>{aiAnalysis?.recommendations?.[0]?.type || 'Waste Accumulation'}</strong>
              </p>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none uppercase text-[9px] font-black">
                Confidence: {((aiAnalysis?.confidence_score || 0) * 100).toFixed(0)}%
              </Badge>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nearby Alerts</h4>
            {alerts && alerts.length > 0 ? (
              alerts.slice(0, 3).map((alert: any, i: number) => {
                const label = alert.title || alert.message || alert.description || alert.category || 'Environmental Alert';
                const severity = alert.severity || alert.priority;
                const timeAgo = formatTimeAgo(alert.created_at);
                return (
                  <div key={alert.id ?? i} className="flex gap-4 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group border border-border/50">
                    <div className="shrink-0 pt-1">
                      <ShieldAlert className="h-4 w-4 text-status-danger" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">{label}</p>
                      <p className="text-[10px] text-muted-foreground italic">
                        {[timeAgo, severity].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground italic py-2">No active alerts nearby right now.</p>
            )}
          </div>
        </div>

        <div className="p-6 border-t bg-muted/20">
          <Button className="w-full gap-2 rounded-full uppercase text-xs font-black shadow-lg shadow-primary/20">
            <AlertTriangle className="h-4 w-4" />
            Report New Hazard
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </div>
      </aside>

      {/* Map Area */}
      <main className="flex-1 relative">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <EnvironmentalMap reports={hazardReports} />
        )}
      </main>
    </div>
  );
}
