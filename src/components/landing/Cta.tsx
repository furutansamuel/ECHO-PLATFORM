import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Map } from 'lucide-react';

export function Cta() {
  return (
    <section className="relative overflow-hidden py-10 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-700 px-6 py-8 md:px-10 md:py-10 shadow-premium">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <h2 className="text-xl font-black tracking-tight text-primary-foreground md:text-2xl">
              Ready to improve your community?
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row shrink-0">
              <Button size="lg" variant="secondary" className="h-11 px-6" asChild>
                <Link to="/report">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Report a Hazard
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-primary-foreground/40 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/map">
                  <Map className="mr-2 h-4 w-4" />
                  Explore the Map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
