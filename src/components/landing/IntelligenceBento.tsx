import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Sparkles, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface RecentAnalysis {
  id: string;
  category: string;
  title: string;
  location: { ward?: string; lga?: string } | null;
  images: string[] | null;
  ai_summary: string;
  ai_risk_score: number | null;
  ai_model: string | null;
  ai_generated_at: string | null;
}

interface PublicStats {
  total_reports: number;
  resolved_reports: number;
}

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function IntelligenceBento() {
  const [analysis, setAnalysis] = useState<RecentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let alive = true;

    (async () => {
      const [reportRes, statsRes] = await Promise.all([
        supabase
          .from('hazard_reports')
          .select('id, category, title, location, images, ai_summary, ai_risk_score, ai_model, ai_generated_at')
          .not('ai_summary', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.rpc('get_public_landing_stats'),
      ]);

      if (!alive) return;
      if (reportRes.data) setAnalysis(reportRes.data as RecentAnalysis);
      if (statsRes.data) {
        const s = typeof statsRes.data === 'string' ? JSON.parse(statsRes.data) : statsRes.data;
        setStats(s);
      }
      setLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  const activeIncidents = stats ? stats.total_reports - stats.resolved_reports : null;
  const resolutionRate = stats && stats.total_reports > 0
    ? Math.round((stats.resolved_reports / stats.total_reports) * 100)
    : null;

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Environmental Intelligence
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
            See ECHO's AI in action
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            A real assessment from a real submitted report — not a mockup.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-6 md:grid-rows-2">
          {/* Interactive Map — real, links to the actual live map */}
          <Link
            to="/map"
            className="group relative row-span-2 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium transition-all hover:-translate-y-1 hover:shadow-xl md:col-span-2"
          >
            <div className="relative h-48 w-full overflow-hidden md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-primary/20" />
              <div className="absolute inset-0 [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Map className="h-3.5 w-3.5" /> Interactive Map
              </div>
              <h3 className="mt-3 text-xl font-black text-foreground">Live incident map</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore real hazard reports across your region.
              </p>
              <ArrowRight className="mt-2 h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Real AI Analysis — the centerpiece */}
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 shadow-premium md:col-span-4 md:row-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Recent Environmental Analysis
              </div>
              {analysis && (
                <Badge variant="outline" className={analysis.ai_model && analysis.ai_model !== 'heuristic'
                  ? "border-primary/30 text-primary text-[10px]"
                  : "text-muted-foreground text-[10px]"
                }>
                  {analysis.ai_model && analysis.ai_model !== 'heuristic' ? 'Gemini AI' : 'Automated'}
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !analysis ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No analyzed reports yet — be the first to submit one and see AI assessment in action.
                </p>
                <Link to="/report" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-primary">
                  Report a Hazard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5">
                {analysis.images?.[0] && (
                  <img
                    src={analysis.images[0]}
                    alt=""
                    className="h-32 w-full sm:w-32 rounded-2xl object-cover"
                  />
                )}
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{analysis.category}</span>
                    <span className="text-xs text-muted-foreground">
                      {[analysis.location?.ward, analysis.location?.lga].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    "{analysis.ai_summary}"
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    {typeof analysis.ai_risk_score === 'number' && (
                      <span className="text-xs font-semibold text-primary">
                        {Math.round(analysis.ai_risk_score * 100)}% confidence
                      </span>
                    )}
                    {analysis.ai_generated_at && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {timeAgo(analysis.ai_generated_at)}
                      </span>
                    )}
                    <Link to="/map" className="text-xs font-semibold text-primary ml-auto">
                      Explore on the Map →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resolution Rate — real, derived from the same public stats RPC Stats.tsx uses */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-premium">
            <h3 className="text-sm font-bold text-foreground">Resolution Rate</h3>
            <p className="mt-2 text-3xl font-black text-foreground">
              {resolutionRate ?? '—'}{resolutionRate !== null && <span className="text-lg text-muted-foreground">%</span>}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">of all reports resolved</p>
          </div>

          {/* Active Incidents — real */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-premium">
            <h3 className="text-sm font-bold text-foreground">Active Incidents</h3>
            <p className="mt-2 text-3xl font-black text-foreground">{activeIncidents ?? '—'}</p>
            <p className="mt-1 text-xs text-muted-foreground">currently open</p>
          </div>
        </div>
      </div>
    </section>
  );
}
