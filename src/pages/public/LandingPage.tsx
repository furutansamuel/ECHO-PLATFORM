import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { CoreFeatures } from '@/components/landing/CoreFeatures';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { AiPreview } from '@/components/landing/AiPreview';
import { MapPreview } from '@/components/landing/MapPreview';
import { CommunityHealth } from '@/components/landing/CommunityHealth';
import { HazardCategories } from '@/components/landing/HazardCategories';
import { UpcomingEvents } from '@/components/landing/UpcomingEvents';
import { CommunityImpact } from '@/components/landing/CommunityImpact';
import { Testimonials } from '@/components/landing/Testimonials';
import { KnowledgeCenter } from '@/components/landing/KnowledgeCenter';
import { Cta } from '@/components/landing/Cta';
import { Partners } from '@/components/landing/Partners';

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Stats />
        <CoreFeatures />
        <HowItWorks />
        <AiPreview />
        <MapPreview />
        <CommunityHealth />
        <HazardCategories />
        <UpcomingEvents />
        <CommunityImpact />
        <Testimonials />
        <KnowledgeCenter />
        <Cta />
        <Partners />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
