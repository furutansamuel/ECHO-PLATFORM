import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@/components/icons';
import { Leaf, Share2, MessageCircle, Camera, Briefcase } from 'lucide-react';

const productLinks = [
  { name: 'Live Map', href: '/map' },
  { name: 'Report Hazard', href: '/report' },
  { name: 'AI Intelligence', href: '/ai-intelligence' },
  { name: 'Community Health', href: '/community-health' },
];

const resourceLinks = [
  { name: 'Knowledge Centre', href: '/knowledge' },
  { name: 'Cleanup Events', href: '/community-insights' },
  { name: 'Impact Center', href: '/rewards' },
  { name: 'FAQ', href: '/faq' },
];

const companyLinks = [
  { name: 'About ECHO', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/' },
  { name: 'Terms of Service', href: '/' },
  { name: 'Cookie Policy', href: '/' },
  { name: 'Accessibility', href: '/' },
];

const socials = [
  { name: 'Facebook', icon: Share2, href: '#' },
  { name: 'Twitter', icon: MessageCircle, href: '#' },
  { name: 'Instagram', icon: Camera, href: '#' },
  { name: 'LinkedIn', icon: Briefcase, href: '#' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 section-bg-soft">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container mx-auto px-4 py-12 lg:py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground">ECHO</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Environmental Community Health Observatory — AI-powered environmental
              intelligence for cleaner, safer communities.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Features</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {productLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-muted-foreground transition-colors hover:text-primary">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {resourceLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-muted-foreground transition-colors hover:text-primary">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {companyLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-muted-foreground transition-colors hover:text-primary">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {legalLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-muted-foreground transition-colors hover:text-primary">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ECHO — Environmental Community Health Observatory.</p>
          <p>Built for Nigeria 🇳🇬 · Powered by community</p>
        </div>
      </div>
    </footer>
  );
}
