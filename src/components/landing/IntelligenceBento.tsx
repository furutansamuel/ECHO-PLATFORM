import React from 'react';
import { Link } from 'react-router-dom';
import { Map, BrainCircuit, HeartPulse, AlertTriangle, ArrowRight } from 'lucide-react';

export function IntelligenceBento() {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Environmental Intelligence
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
            See your community's health at a glance
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Live maps, AI insights, health scoring and active incidents — unified.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-6 md:grid-rows-2">
          {/* Interactive Map — hero tile */}
          <Link
            to="/map"
            className="group relative row-span-2 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium transition-all hover:-translate-y-1 hover:shadow-xl md:col-span-4"
          >
            <div className="relative h-64 w-full overflow-hidden md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-primary/20" />
              <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,hsl(var(--primary)/.3),transparent_40%),radial-gradient(circle_at_70%_60%,hsl(210_90%_60%/.3),transparent_45%),radial-gradient(circle_at_50%_80%,hsl(160_70%_50%/.3),transparent_45%)]" />
              <div className="absolute inset-0 [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
              {/* fake pins */}
              <div className="absolute top-1/3 left-1/4 flex h-4 w-4 items-center justify-center rounded-full bg-destructive shadow-lg ring-4 ring-destructive/30 animate-pulse" />
              <div className="absolute top-1/2 left-2/3 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 shadow-lg ring-4 ring-amber-500/30 animate-pulse" />
              <div className="absolute bottom-1/4 left-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-lg ring-4 ring-emerald-500/30 animate-pulse" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Map className="h-3.5 w-3.5" /> Interactive Map
                  </div>
                  <h3 className="mt-3 text-2xl font-black text-foreground">Live incident map</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Real-time hazard reports and community layers across Nigeria.
                  </p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* AI Insights */}
          <Link
            to="/ai-intelligence"
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-premium transition-all hover:-translate-y-1 hover:shadow-xl md:col-span-2"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 to-primary/10" />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
              <BrainCircuit className="h-5 w-5 text-violet-600" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">AI Insights</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Auto-verification, hotspot prediction and risk scoring.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Verified reports</span>
                <span className="font-semibold text-foreground">89%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-violet-500 to-primary" />
              </div>
            </div>
          </Link>

          {/* Health Score */}
          <Link
            to="/community-health"
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-premium transition-all hover:-translate-y-1 hover:shadow-xl md:col-span-1"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-500/10 to-emerald-500/10" />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15">
              <HeartPulse className="h-5 w-5 text-sky-600" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-foreground">Health Score</h3>
            <p className="mt-2 text-3xl font-black text-foreground">
              82<span className="text-lg text-muted-foreground">/100</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">▲ +4 this week</p>
          </Link>

          {/* Active Incidents */}
          <Link
            to="/reports"
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-premium transition-all hover:-translate-y-1 hover:shadow-xl md:col-span-1"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/10 to-rose-500/10" />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-foreground">Active Incidents</h3>
            <p className="mt-2 text-3xl font-black text-foreground">24</p>
            <p className="mt-1 text-xs font-semibold text-amber-600">6 critical</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
