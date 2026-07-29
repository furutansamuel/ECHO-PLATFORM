import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Landmark, Award } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Community Reporting',
    desc: 'Report hazards in under a minute with photos, location and severity.',
    href: '/report',
    tone: 'from-primary/20 to-primary/10',
    solid: 'from-primary to-secondary',
  },
  {
    icon: Landmark,
    title: 'Government Collaboration',
    desc: 'Structured, verified data streams to speed up official response and action.',
    href: '/community-insights',
    tone: 'from-secondary/20 to-secondary/10',
    solid: 'from-secondary to-accent',
  },
  {
    icon: Award,
    title: 'Rewards & Recognition',
    desc: 'Earn points and recognition for contributions that improve your community.',
    href: '/rewards',
    tone: 'from-highlight/20 to-highlight/10',
    solid: 'from-highlight to-warning',
  },
];

type Feature = (typeof features)[number];

// Drives the "hovered" look from real pointer/touch events instead of CSS
// :hover. This avoids the "sticky hover" glitch that happens when a browser
// reports hover-capable input on a touch device (e.g. Chrome's "Desktop
// site" mode on Android) — with pure CSS :hover there is no event that ever
// clears the state on a device with no mouse, so tapped cards stay stuck
// mid-animation. Controlling it explicitly means touchend always resets it.
function FeatureCard({ f }: { f: Feature }) {
  const [active, setActive] = useState(false);

  return (
    <Link
      to={f.href}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative overflow-hidden rounded-2xl border p-6 shadow-premium transition-all transform-gpu ${
        active
          ? '-translate-y-1 border-primary/30 shadow-xl'
          : 'border-border/60'
      } bg-card`}
    >
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br ${f.tone} transition-opacity ${
          active ? 'opacity-100' : 'opacity-60'
        }`}
      />
      <div
        className={`icon-badge mb-4 bg-gradient-to-br ${f.solid} shadow-lg transition-transform transform-gpu duration-300 ${
          active ? 'scale-110' : ''
        }`}
      >
        <f.icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
      <span
        className={`mt-4 inline-flex items-center text-sm font-semibold text-primary transition-opacity ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Explore →
      </span>
    </Link>
  );
}

export function CoreFeatures() {
  return (
    <section className="bg-background py-16 lg:py-20">
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
            <FeatureCard key={f.title} f={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
