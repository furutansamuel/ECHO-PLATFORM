import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export function CommunityHealth() {
  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">Community Health Score</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
            Our AI calculates a real-time Community Health Score based on environmental reports, providing a clear metric of your area's well-being and the impact of your actions.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-border"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="text-primary"
                strokeDasharray="85, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl lg:text-6xl font-bold text-primary">85</span>
                <span className="text-lg font-semibold text-muted-foreground">Good</span>
                <div className="flex items-center text-sm text-status-safe mt-1">
                    <TrendingUp className="h-4 w-4 mr-1"/>
                    <span>+5% this month</span>
                </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link to="/community-health">Learn More & See Your Score</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
