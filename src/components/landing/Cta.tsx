import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldAlert, Map } from 'lucide-react';

export function Cta() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-emerald-700 p-10 shadow-premium md:p-16">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center text-primary-foreground">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Ready to build cleaner, safer communities?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85 md:text-lg">
              Join thousands of citizens using ECHO to report, monitor and improve
              environmental health across Nigeria.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" className="h-12 px-8" asChild>
                <Link to="/report">
                  <ShieldAlert className="mr-2 h-5 w-5" />
                  Report a Hazard
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/map">
                  <Map className="mr-2 h-5 w-5" />
                  Explore Live Map
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/auth/login">
                  Try Demo <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
