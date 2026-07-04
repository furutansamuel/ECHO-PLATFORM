import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Users, Map, Landmark, BarChart3, Award } from 'lucide-react';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Environmental Intelligence',
    desc: 'Verified insights, hotspot detection and risk prediction powered by machine learning.',
    href: '/ai-intelligence',
    tone: 'from-primary/20 to-emerald-400/10',
    iconTone: 'text-primary',
  },
  {
    icon: Users,
    title: 'Community Reporting',
    desc: 'Report hazards in under a minute with photos, location and severity.',
    href: '/report',
    tone: 'from-sky-500/20 to-cyan-400/10',
    iconTone: 'text-sky-600',
  },
  {
    icon: Map,
    title: 'Interactive GIS Mapping',
    desc: 'Explore live incidents, clusters and environmental layers across your region.',
    href: '/map',
    tone: 'from-emerald-500/20 to-teal-400/10',
    iconTone: 'text-emerald-600',
  },
  {
    icon: Landmark,
    title: 'Government Collaboration',
    desc: 'Structured, verified data streams to speed up official response and action.',
    href: '/community-insights',
    tone: 'from-amber-500/20 to-yellow-400/10',
    iconTone: 'text-amber-600',
  },
  {
    icon: BarChart3,
    title: 'Environmental Analytics',
    desc: 'Trends, community health scores and long-term impact dashboards.',
    href: '/community-health',
    tone: 'from-violet-500/20 to-purple-400/10',
    iconTone: 'text-violet-600',
  },
  {
    icon: Award,
    title: 'Rewards & Community Impact',
    desc: 'Earn points and recognition for contributions that improve your community.',
    href: '/rewards',
    tone: 'from-rose-500/20 to-pink-400/10',
    iconTone: 'text-rose-600',
  },
];

export function CoreFeatures() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            One platform for environmental health
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Everything citizens, communities and agencies need — unified.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.href}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-premium transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${f.tone} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.tone}`}>
                <f.icon className={`h-6 w-6 ${f.iconTone}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
