import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { CoreFeatures } from '@/components/landing/CoreFeatures';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { HazardCategories } from '@/components/landing/HazardCategories';
import { IntelligenceBento } from '@/components/landing/IntelligenceBento';
import { CommunityImpact } from '@/components/landing/CommunityImpact';
import { UpcomingEvents } from '@/components/landing/UpcomingEvents';
import { Cta } from '@/components/landing/Cta';

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Stats />
        <CoreFeatures />
        <HowItWorks />
        <IntelligenceBento />
        <CommunityImpact />
        <UpcomingEvents />
        <Cta />

      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
