import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  FilterX,
  X
} from 'lucide-react';

export default function InteractiveMapPage() {
  const { hazardReports, aiAnalysis, alerts, loading } = useIntelligenceData();

  // State for Map Overlay Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  
  // Collapsible States
  const [searchOpen, setSearchOpen] = useState(true);
  const [legendOpen, setLegendOpen] = useState(false);

  // Safely normalize AI Confidence Score
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
      <aside className="w-full lg:w-96 bg-card border-r flex flex-col z-20 shadow-xl shrink-0 max-h-[42vh] lg:max-h-none">
        <div className="px-4 py-3 border-b lg:p-6">
          <h1 className="text-base font-black uppercase tracking-tight flex items-center gap-2 lg:text-2xl">
            <MapIcon className="h-4 w-4 text-primary lg:h-6 lg:w-6" />
            Environmental Map
          </h1>
          <p className="hidden text-xs text-muted-foreground italic mt-1 lg:block">Real-time geospatial environmental intelligence</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 lg:p-6 lg:space-y-6">
          {/* Stats Summary — compact single row on mobile, cards on desktop */}
          <div className="flex gap-2 lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 lg:block lg:p-4 lg:rounded-xl lg:text-center">
              <p className="text-[9px] font-black uppercase text-muted-foreground lg:text-[10px]">Active</p>
              <h3 className="text-sm font-black lg:text-xl">{hazardReports?.filter((r: any) => r.status !== 'Resolved').length || 0}</h3>
            </div>
            <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg bg-destructive/5 border border-destructive/10 lg:block lg:p-4 lg:rounded-xl lg:text-center">
              <p className="text-[9px] font-black uppercase text-muted-foreground lg:text-[10px]">Critical</p>
              <h3 className="text-sm font-black text-destructive lg:text-xl">{hazardReports?.filter((r: any) => r.severity === 'Critical').length || 0}</h3>
            </div>
          </div>

          {/* AI Hotspots Card (ECHO Branded) — compact strip on mobile, full card on desktop */}
          <Card className="border border-sidebar-primary/20 shadow-md bg-gradient-to-br from-sidebar to-black text-white relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 text-sidebar-primary/10 pointer-events-none hidden lg:block">
              <BrainCircuit className="h-28 w-28" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-sidebar-primary/10 rounded-full blur-2xl pointer-events-none" />

            <CardContent className="relative z-10 flex items-center gap-2 p-2.5 lg:hidden">
              <BrainCircuit className="h-3.5 w-3.5 text-sidebar-primary shrink-0 animate-pulse" />
              <p className="flex-1 text-[10px] font-semibold text-white/85 truncate">
                {aiAnalysis?.recommendations?.[0]?.type || 'Waste Accumulation'} risk detected
              </p>
              <Badge className="shrink-0 bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30 text-[8px] font-black px-1.5 py-0 h-4">
                {formattedConfidence}
              </Badge>
            </CardContent>

            <div className="hidden lg:block">
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-sidebar-primary">
                  <BrainCircuit className="h-4 w-4 text-sidebar-primary animate-pulse" />
                  AI Hotspot Detection
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 relative z-10">
                <p className="text-[11px] italic text-white/80 leading-relaxed">
                  3 high-density clusters detected in the last 48 hours. Primary risk: <strong className="text-sidebar-primary font-semibold">{aiAnalysis?.recommendations?.[0]?.type || 'Waste Accumulation'}</strong>
                </p>

                <Badge className="bg-sidebar-primary/20 hover:bg-sidebar-primary/30 text-sidebar-primary border border-sidebar-primary/30 uppercase text-[9px] font-black tracking-wider shadow-sm backdrop-blur-sm">
                  Confidence: {formattedConfidence}
                </Badge>
              </CardContent>
            </div>
          </Card>

          {/* Recent Alerts */}
          <div className="space-y-2 lg:space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground lg:text-[10px]">Nearby Alerts</h4>
            {alerts && alerts.length > 0 ? (
              alerts.slice(0, 3).map((alert: any, i: number) => {
                const label = alert.title || alert.message || alert.description || alert.category || 'Environmental Alert';
                const severity = alert.severity || alert.priority;
                const timeAgo = formatTimeAgo(alert.created_at);
                return (
                  <div key={alert.id ?? i} className="flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer group border border-border/50 lg:gap-4 lg:p-3 lg:rounded-xl">
                    <div className="shrink-0 pt-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-status-danger lg:h-4 lg:w-4" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">{label}</p>
                      <p className="text-[10px] text-muted-foreground italic">
                        {[timeAgo, severity].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground italic py-1 lg:py-2">No active alerts nearby right now.</p>
            )}
          </div>
        </div>

        <div className="hidden p-6 border-t bg-muted/20 lg:block">
          <Button asChild className="w-full gap-2 rounded-full uppercase text-xs font-black shadow-lg shadow-primary/20">
            <Link to="/report">
              <AlertTriangle className="h-4 w-4" />
              Report New Hazard
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Link>
          </Button>
        </div>
      </aside>

      {/* Map Area with Overlay Controls */}
      <main className="flex-1 relative min-h-0">
        
        {/* Floating Map Controls Wrapper */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-[1100]">
          
          {/* TOP OVERLAY: Collapsible Search Bar */}
          <div className="pointer-events-auto max-w-sm w-full transition-all duration-300">
            {searchOpen ? (
              <Card className="shadow-lg border-border/60 bg-background/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
                <CardContent className="p-2 flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
                  <Input 
                    value={searchQuery}
                    placeholder="Search map location or hazard..." 
                    className="border-none focus-visible:ring-0 text-xs h-8 shadow-none bg-transparent"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                      onClick={() => setSearchQuery('')}
                    >
                      <FilterX className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0 border-l rounded-none pl-2"
                    onClick={() => setSearchOpen(false)}
                    title="Collapse search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="bg-background/90 backdrop-blur-md shadow-md gap-2 border-border/60 font-semibold text-xs rounded-full pointer-events-auto"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-3.5 w-3.5 text-primary" />
                <span>Search Map</span>
                {searchQuery && (
                  <Badge variant="secondary" className="text-[9px] px-1.5 h-4 ml-1">
                    Active
                  </Badge>
                )}
              </Button>
            )}
          </div>

          {/* BOTTOM RIGHT OVERLAY: Collapsible Legend Card */}
          <div className="self-end pointer-events-auto max-w-[260px] w-full transition-all duration-300 ease-in-out">
            <Card className="shadow-xl border-border/60 bg-background/95 backdrop-blur-md transition-all duration-300">
              <CardHeader 
                className="p-3 flex flex-row items-center justify-between space-y-0 cursor-pointer select-none hover:bg-muted/40 transition-colors rounded-t-xl"
                onClick={() => setLegendOpen(!legendOpen)}
              >
                <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary shrink-0" />
                  <span>Map Legend & Filters</span>
                  
                  {/* Indicator when card is collapsed with active filter */}
                  {!legendOpen && selectedSeverity && (
                    <Badge variant="destructive" className="ml-1 text-[8px] h-4 px-1.5 uppercase font-bold">
                      {selectedSeverity}
                    </Badge>
                  )}
                </CardTitle>

                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${legendOpen ? 'rotate-180' : 'rotate-0'}`} />
                </Button>
              </CardHeader>

              {/* Animated Collapsible Container */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  legendOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'
                }`}
              >
                <div className="overflow-hidden">
                  <CardContent className="p-3 pt-0 space-y-2 text-xs">
                    <div className="border-t pt-2 space-y-1">
                      <div className="flex items-center justify-between pb-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Severity Level</p>
                        {selectedSeverity && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSeverity(null);
                            }}
                            className="text-[10px] text-primary hover:underline font-semibold"
                          >
                            Clear Filter
                          </button>
                        )}
                      </div>

                      {/* Critical Filter Toggle */}
                      <button 
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-left ${
                          selectedSeverity === 'critical' 
                            ? 'bg-severity-critical/15 font-bold border border-severity-critical/30' 
                            : 'hover:bg-muted/60'
                        }`}
                        onClick={() => setSelectedSeverity(selectedSeverity === 'critical' ? null : 'critical')}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-severity-critical animate-pulse" />
                          <span>Critical</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] py-0 h-4">
                          {hazardReports?.filter((r: any) => r.severity?.toLowerCase() === 'critical').length || 0}
                        </Badge>
                      </button>

                      {/* High Filter Toggle */}
                      <button 
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-left ${
                          selectedSeverity === 'high' 
                            ? 'bg-severity-high/15 font-bold border border-severity-high/30' 
                            : 'hover:bg-muted/60'
                        }`}
                        onClick={() => setSelectedSeverity(selectedSeverity === 'high' ? null : 'high')}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-severity-high" />
                          <span>High</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] py-0 h-4">
                          {hazardReports?.filter((r: any) => r.severity?.toLowerCase() === 'high').length || 0}
                        </Badge>
                      </button>

                      {/* Medium Filter Toggle */}
                      <button 
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-left ${
                          selectedSeverity === 'medium' 
                            ? 'bg-severity-medium/15 font-bold border border-severity-medium/30' 
                            : 'hover:bg-muted/60'
                        }`}
                        onClick={() => setSelectedSeverity(selectedSeverity === 'medium' ? null : 'medium')}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-severity-medium" />
                          <span>Medium</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] py-0 h-4">
                          {hazardReports?.filter((r: any) => r.severity?.toLowerCase() === 'medium').length || 0}
                        </Badge>
                      </button>

                      {/* Low Filter Toggle */}
                      <button 
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-left ${
                          selectedSeverity === 'low' 
                            ? 'bg-severity-low/15 font-bold border border-severity-low/30' 
                            : 'hover:bg-muted/60'
                        }`}
                        onClick={() => setSelectedSeverity(selectedSeverity === 'low' ? null : 'low')}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-severity-low" />
                          <span>Low</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] py-0 h-4">
                          {hazardReports?.filter((r: any) => r.severity?.toLowerCase() === 'low').length || 0}
                        </Badge>
                      </button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>

        </div>

        {/* Map Rendering */}
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <EnvironmentalMap reports={filteredReports} />
        )}
      </main>
    </div>
  );
}
