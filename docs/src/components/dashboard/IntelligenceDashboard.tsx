import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, ShieldAlert, MapPin, BrainCircuit, Activity, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HealthGauge from '../intelligence/HealthScore/HealthGauge';

export function IntelligenceDashboard() {
    const { intelligenceSummary, aiAnalysis, communityHealthScore, aiInsights, loading } = useIntelligenceData();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Index Gauge */}
                <Card className="lg:col-span-1 border-none shadow-xl bg-gradient-to-br from-card to-primary/5 flex flex-col items-center justify-center p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Environmental Health</h3>
                    {loading ? (
                        <Skeleton className="w-48 h-48 rounded-full" />
                    ) : (
                        <div className="scale-75 -my-8">
                            <HealthGauge score={intelligenceSummary?.health_score || 0} />
                        </div>
                    )}
                    <div className="text-center space-y-2 mt-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase border-primary/20 text-primary bg-primary/5">
                            {intelligenceSummary?.community_status || 'Moderate'}
                        </Badge>
                        <Button asChild variant="ghost" size="sm" className="w-full text-xs font-bold hover:bg-primary/5">
                            <Link to="/community-health">Deep Health Analysis <ChevronRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                    </div>
                </Card>

                {/* AI Trend & Analysis */}
                <Card className="lg:col-span-2 border-none shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <BrainCircuit className="h-48 w-48" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4 text-accent" />
                            AI Environmental Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                                    <p className="text-[11px] font-bold text-accent uppercase mb-1">Current Recommendation</p>
                                    <p className="text-xs italic leading-relaxed text-muted-foreground">
                                        {aiAnalysis?.recommendations?.[0]?.message || 'Environmental patterns are stable. Focus on routine sanitation monitoring.'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Flood Risk</p>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-info" style={{ width: `${aiAnalysis?.flood_risk || 0}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Waste Acc.</p>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-success" style={{ width: `${aiAnalysis?.waste_accumulation || 0}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Regional Comparison</h4>
                                {[
                                    { name: 'Your Ward', score: intelligenceSummary?.health_score || 0, color: 'bg-primary' },
                                    { name: 'LGA Average', score: 64, color: 'bg-muted-foreground/40' },
                                    { name: 'State Average', score: 72, color: 'bg-muted-foreground/20' }
                                ].map((reg, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span>{reg.name}</span>
                                            <span>{reg.score} pts</span>
                                        </div>
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${reg.color}`} style={{ width: `${reg.score}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="pt-2 flex gap-4">
                            <Button asChild variant="outline" size="sm" className="flex-1 text-[10px] uppercase font-black tracking-widest h-8 border-accent/20 hover:bg-accent/5">
                                <Link to="/ai-intelligence">AI Dashboard</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="flex-1 text-[10px] uppercase font-black tracking-widest h-8 border-primary/20 hover:bg-primary/5">
                                <Link to="/analytics">Advanced Charts</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row - Environmental Alerts & Small Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 rounded-2xl bg-warning-subtle border border-warning/30 flex gap-4 items-center group cursor-pointer hover:shadow-md transition-all">
                    <div className="p-2 rounded-lg bg-warning text-white"><ShieldAlert className="h-4 w-4" /></div>
                    <div>
                        <p className="text-[10px] font-black text-warning uppercase">Regional Alert</p>
                        <p className="text-xs font-bold leading-tight">Elevated Heatwave Forecast</p>
                    </div>
                    <ChevronRight className="h-3 w-3 text-warning ml-auto group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="p-4 rounded-2xl bg-info-subtle border border-info/30 flex gap-4 items-center group cursor-pointer hover:shadow-md transition-all">
                    <div className="p-2 rounded-lg bg-info text-white"><Activity className="h-4 w-4" /></div>
                    <div>
                        <p className="text-[10px] font-black text-info uppercase">Water Insight</p>
                        <p className="text-xs font-bold leading-tight">Improved Reservoir Levels</p>
                    </div>
                    <ChevronRight className="h-3 w-3 text-info ml-auto group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="p-4 rounded-2xl bg-success-subtle border border-success/30 flex gap-4 items-center group cursor-pointer hover:shadow-md transition-all">
                    <div className="p-2 rounded-lg bg-success text-white"><TrendingUp className="h-4 w-4" /></div>
                    <div>
                        <p className="text-[10px] font-black text-success uppercase">Growth Index</p>
                        <p className="text-xs font-bold leading-tight">+15% Local Reforestation</p>
                    </div>
                    <ChevronRight className="h-3 w-3 text-accent ml-auto group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-center group cursor-pointer hover:shadow-md transition-all">
                    <div className="p-2 rounded-lg bg-primary text-white"><MapPin className="h-4 w-4" /></div>
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase">Hotspot Detected</p>
                        <p className="text-xs font-bold leading-tight">Ward B: Blocked Drainage</p>
                    </div>
                    <ChevronRight className="h-3 w-3 text-primary/30 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    )
}
