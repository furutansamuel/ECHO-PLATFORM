import React from 'react';
import { Leaf, Target } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/use-document-title';

const teamMembers = [
    { name: 'Dr. Amina Yusuf', role: 'Founder & Lead Environmental Scientist', image: 'https://randomuser.me/api/portraits/women/48.jpg' },
    { name: 'Babatunde Adebayo', role: 'Head of Technology', image: 'https://randomuser.me/api/portraits/men/48.jpg' },
    { name: 'Chioma Nwosu', role: 'Community Engagement Lead', image: 'https://randomuser.me/api/portraits/women/49.jpg' },
    { name: 'David Okon', role: 'Lead GIS Analyst', image: 'https://randomuser.me/api/portraits/men/49.jpg' },
];

export default function AboutPage() {
  useDocumentTitle(
    'About Us',
    'Learn about ECHO\'s mission to build a cleaner, safer, and more resilient Nigeria through community-powered environmental intelligence.'
  );
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">About ECHO</h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
            We are a team of scientists, engineers, and community organizers dedicated to building a cleaner, safer, and more resilient Nigeria through technology.
          </p>
        </div>
      </section>

      {/* Our Story, Mission & Vision */}
<section className="py-20">
  <div className="container mx-auto px-4">

    <div className="text-center max-w-3xl mx-auto mb-14">
      <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
        Our Story
      </span>

      <h2 className="mt-5 text-3xl md:text-4xl font-bold text-primary">
        Inspired by Communities, Built for Nigeria
      </h2>

      <p className="mt-6 text-lg text-muted-foreground leading-8">
        ECHO (Environmental Community Health Observatory) was founded in
        Lafia, Nasarawa State, with a vision to help communities tackle
        environmental challenges through technology. From illegal waste
        dumping and flooding to pollution and sanitation issues, many hazards
        go unreported or receive delayed attention.
      </p>

      <p className="mt-5 text-muted-foreground leading-8">
        ECHO bridges this gap by enabling citizens to report environmental
        hazards, monitor community risks, and support informed action through
        mapping, real-time reporting, and environmental intelligence.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">

      {/* Mission */}
      <div className="rounded-3xl border bg-background p-8 shadow-sm hover:shadow-lg transition-all">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Target className="h-8 w-8 text-primary" />
        </div>

        <h3 className="text-2xl font-bold text-primary">
          Our Mission
        </h3>

        <p className="mt-4 text-muted-foreground leading-8">
          To empower communities with digital tools that make environmental
          reporting simple, transparent, and actionable while encouraging
          collaboration between citizens, organisations, and government
          agencies.
        </p>

      </div>

      {/* Vision */}
      <div className="rounded-3xl border bg-background p-8 shadow-sm hover:shadow-lg transition-all">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-subtle">
          <Leaf className="h-8 w-8 text-success" />
        </div>

        <h3 className="text-2xl font-bold text-primary">
          Our Vision
        </h3>

        <p className="mt-4 text-muted-foreground leading-8">
          To become Nigeria's leading community environmental intelligence
          platform, creating cleaner, healthier, safer, and more resilient
          communities through innovation, citizen participation, and
          data-driven environmental action.
        </p>

      </div>

    </div>

  </div>
</section>
      
      {/* Founder Section */}
<section className="py-20 bg-primary/5">
  <div className="container mx-auto px-4">

    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-bold text-primary">
        Meet the Founder
      </h2>

      <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
        The vision behind ECHO is driven by a passion for technology,
        environmental sustainability, and community impact.
      </p>
    </div>

    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

      {/* Founder Image */}
      <div className="flex justify-center">

        <div className="relative">

          {/* Replace this div with your image later */}
          <div className="h-72 w-72 rounded-3xl border-4 border-primary/20 bg-primary/5 flex items-center justify-center shadow-xl">

            <div className="text-center px-6">
              <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                👤
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                Upload your professional photo here later.
              </p>
            </div>

          </div>

          {/* Example after upload:
          <img
            src="/images/founder.jpg"
            alt="Founder"
            className="h-72 w-72 rounded-3xl object-cover shadow-xl"
          />
          */}

        </div>

      </div>

      {/* Founder Details */}
      <div>

        <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          Founder & Lead Developer
        </span>

        <h3 className="mt-4 text-3xl font-bold">
          Furutan Lawrence Samuel
        </h3>

        <p className="mt-2 text-primary font-medium">
          📍 Based in Lafia, Nasarawa State, Nigeria
        </p>

        <p className="mt-6 text-muted-foreground leading-8">
          ECHO (Environmental Community Health Observatory) was created to
          empower citizens with modern digital tools for reporting
          environmental hazards, monitoring community health risks, and
          supporting data-driven environmental action.

          Inspired by the environmental challenges faced across Nigerian
          communities, ECHO combines technology, mapping, artificial
          intelligence, and community participation to promote a cleaner,
          healthier, and more resilient future.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8">

          <div className="rounded-xl bg-background p-5 shadow-sm border">
            <h4 className="font-bold text-primary text-lg">
              Mission
            </h4>

            <p className="text-sm text-muted-foreground mt-2">
              Empower communities through technology-driven environmental
              reporting.
            </p>
          </div>

          <div className="rounded-xl bg-background p-5 shadow-sm border">
            <h4 className="font-bold text-primary text-lg">
              Vision
            </h4>

            <p className="text-sm text-muted-foreground mt-2">
              Build safer, cleaner and smarter communities across Nigeria.
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>
</section>
    </div>
  );
}
