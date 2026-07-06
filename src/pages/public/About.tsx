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
      
      {/* Team Section */}
      <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary">Meet the Team</h2>
                  <p className="text-lg text-muted-foreground mt-2">The passionate minds behind ECHO</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {teamMembers.map(member => (
                      <div key={member.name} className="text-center">
                          <img src={member.image} alt={member.name} className="h-32 w-32 rounded-full mx-auto mb-4 premium-shadow" />
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          <p className="text-muted-foreground text-sm">{member.role}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
}
