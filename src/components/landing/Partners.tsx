import React from 'react';
import { Code2, Database, Map, Palette, LineChart, Sparkles } from 'lucide-react';

const tech = [
  { name: 'React', icon: Code2 },
  { name: 'Supabase', icon: Database },
  { name: 'Leaflet Maps', icon: Map },
  { name: 'Tailwind CSS', icon: Palette },
  { name: 'Recharts', icon: LineChart },
  { name: 'Lovable AI', icon: Sparkles },
];

export function Partners() {
  return (
    <section className="bg-muted/30 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Built with
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-3xl">
            Technology Stack
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {tech.map((t) => (
            <div
              key={t.name}
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-premium"
            >
              <t.icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
