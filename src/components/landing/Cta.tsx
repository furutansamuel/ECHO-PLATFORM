import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Cta() {
  return (
    <section className="py-12 lg:py-24 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Together, we can build cleaner, safer, and more resilient communities.</h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
          Ready to make a difference? Report a hazard, explore the map, or try a demo to see how ECHO works.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
                <Link to="/report">🚨 Report Hazard</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10 hover:text-white" asChild>
                <Link to="/map">🗺️ Explore Live Map</Link>
            </Button>
            <Button size="lg" variant="ghost" className="hover:bg-white/10 hover:text-white" asChild>
                <Link to="/auth/login">▶️ Try Demo Mode</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
