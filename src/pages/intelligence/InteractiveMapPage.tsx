import React, { useState, useMemo } from 'react';
import EnvironmentalMap from '@/components/intelligence/EnvironmentalMap/EnvironmentalMap';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Map as MapIcon, 
  AlertTriangle, 
  ShieldAlert, 
  BrainCircuit,
  ArrowRight,
  Search,
  Layers,
  ChevronDown,
  ChevronUp,
  FilterX
} from 'lucide-react';

export default function InteractiveMapPage() {
  const { hazardReports, aiAnalysis, alerts, loading } = useIntelligenceData();

  // State for Map Overlay Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [legendOpen, setLegendOpen] = useState(true);

  // Safely normalize AI Confidence Score (Handles both 0.70 and 70 gracefully)
  const formattedConfidence = useMemo(() => {
    const rawScore = aiAnalysis?.confidence_score ?? 0;
    if (rawScore <= 0) return '0%';
    const scaledScore = rawScore > 1 ? rawScore : rawScore * 100;
    return `${Math.min(scaledScore, 100).toFixed(0)}%`;
  }, [aiAnalysis?.confidence_score]);

  // Filter reports passed down to the map based on floating search & severity legend
  const filteredReports = useMemo(() => {
    if (!hazardReports) return [];
    return hazardReports.filter((report: any) => {
      const matchesSearch = searchQuery === '' || 
        report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = !selectedSeverity || 
        report.severity?.toLowerCase() === selectedSeverity.toLowerCase();

      return matchesSearch && matchesSeverity;
    });
  }, [hazardReports, searchQuery, selectedSeverity]);

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
              <h3 className="text-xl font-black">{hazardReports?.filter((r: any) => r.status !== 'Resolved').length || 0}</h3>
            </div>
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-center">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Critical</p>
              <h3 className="text-xl font-black text-destructive">{hazardReports?.filter((r: any) => r.severity === 'Critical').length || 0}</h3>
            </div>
          </div>

          {/* AI Hotspots Card */}
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
              {/* ✅ Confidence fixed here */}
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none uppercase text-[9px] font-black">
                Confidence: {formattedConfidence}
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

      {/* Map Area with Overlay Controls */}
      <main className="flex-1 relative">
        
        {/* Floating Map Controls */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
          
          {/* Top Floating Search Card */}
          <div className="pointer-events-auto max-w-sm w-full">
            <Card className="shadow-lg border-border/60 bg-background/95 backdrop-blur">
              <CardContent className="p-2 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
                <Input 
                  value={searchQuery}
                  placeholder="Search map location or hazard..." 
                  className="border-none focus-visible:ring-0 text-xs h-8 shadow-none bg-transparent"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery('')}
                  >
                    <FilterX className="h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Right Collapsible Legend & Severity Filter Card */}
          <div className="self-end pointer-events-auto max-w-xs w-full">
            <Card className="shadow-xl border-border/60 bg-background/95 backdrop-blur transition-all">
              <CardHeader 
                className="p-3 flex flex-row items-center justify-between space-y-0 cursor-pointer select-none"
                onClick={() => setLegendOpen(!legendOpen)}
              >
                <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Map Legend & Filters
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {legendOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </CardHeader>

              {legendOpen && (
                <CardContent className="p-3 pt-0 space-y-2 text-xs">
                  <div className="border-t pt-2 space-y-1">
                    <div className="flex items-center justify-between pb-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Severity Level</p>
                      {selectedSeverity && (
                        <button 
                          onClick={() => setSelectedSeverity(null)}
                          className="text-[10px] text-primary hover:underline font-semibold"
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>

                    {/* Critical Toggle */}
                    <button 
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${selectedSeverity === 'critical' ? 'bg-destructive/15 font-bold border border-destructive/30' : 'hover:bg-muted/60'}`}
                      onClick={() => setSelectedSeverity(selectedSeverity === 'critical' ? null : 'critical')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
                        <span>Critical</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] py-0 h-4">
                        {hazardReports?.filter((r: any) => r.severity?.toLowerCase() === 'critical').length || 0}
                      </Badge>
                    </button>

                    {/* Moderate / Warning Toggle */}
                    <button 
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${selectedSeverity === 'moderate' ? 'bg-amber-500/15 font-bold border border-amber-500/30' : 'hover:bg-muted/60'}`}
                      onClick={() => setSelectedSeverity(selectedSeverity === 'moderate' ? null : 'moderate')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                        <span>Moderate</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] py-0 h-4">
                        {hazardReports?.filter((r: any) => r.severity?.toLowerCase() === 'moderate' || r.severity?.toLowerCase() === 'warning').length || 0}
                      </Badge>
                    </button>

                    {/* Low Toggle */}
                    <button 
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${selectedSeverity === 'low' ? 'bg-blue-500/15 font-bold border border-blue-500/30' : 'hover:bg-muted/60'}`}
                      onClick={() => setSelectedSeverity(selectedSeverity === 'low' ? null : 'low')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        <span>Low / Monitoring</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] py-0 h-4">
                        {hazardReports?.filter((r: any) => r.severity?.toLowerCase() === 'low').length || 0}
                      </Badge>
                    </button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

        </div>

        {/* Map Component */}
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <EnvironmentalMap reports={filteredReports} />
        )}
      </main>
    </div>
  );
}
