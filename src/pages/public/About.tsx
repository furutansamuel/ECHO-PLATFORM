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

      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Target className="h-12 w-12 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
                <p className="text-muted-foreground mt-2">
                  To empower every Nigerian citizen with the tools and data to monitor their environment, report hazards, and drive meaningful community-led action for a sustainable future.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Leaf className="h-12 w-12 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-primary">Our Vision</h2>
                <p className="text-muted-foreground mt-2">
                  We envision a Nigeria where communities are proactive custodians of their environment, where data-driven decisions lead to healthier ecosystems, and where technology bridges the gap between citizens and governance.
                </p>
              </div>
            </div>
          </div>
          <div className="h-80 rounded-lg overflow-hidden premium-shadow">
            <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/060df7fc-fb5a-4109-890a-cb6e43e9b598/community-cleanup-nigeria-ea6844ea-1782830747692.webp" alt="Community working together" className="w-full h-full object-cover" />
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
