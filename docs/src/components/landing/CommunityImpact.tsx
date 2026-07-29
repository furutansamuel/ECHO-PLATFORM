import React from 'react';
import { Users, Shield, Building, Globe } from 'lucide-react';

const impactAreas = [
  {
    icon: Users,
    title: 'For Citizens',
    description: 'Easily report issues, see real-time updates, and contribute to a healthier local environment. Your voice matters, and with ECHO, it gets heard.',
    stat: '10,000+ Reports Submitted'
  },
  {
    icon: Shield,
    title: 'For Volunteers',
    description: 'Find and join cleanup events, earn rewards for your contributions, and connect with other passionate environmental advocates in your area.',
    stat: '1,500+ Active Volunteers'
  },
  {
    icon: Building,
    title: 'For Communities',
    description: 'Gain a clear understanding of environmental health, track improvements over time, and use data-driven insights to advocate for change.',
    stat: '45 Communities Engaged'
  },
  {
    icon: Globe,
    title: 'For Agencies',
    description: 'Access verified, structured data on environmental hazards, optimize resource allocation, and collaborate more effectively with communities.',
    stat: '90% Faster Response Time'
  },
];

export function CommunityImpact() {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">Making an Impact, Together</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
            ECHO is more than a tool—it's a collaborative platform that empowers everyone to contribute to a sustainable future for Nigeria.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactAreas.map((area) => (
            <div key={area.title} className="bg-card p-6 rounded-lg premium-shadow flex flex-col">
                <area.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{area.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">{area.description}</p>
                <div className="border-t pt-3 mt-auto">
                    <p className="text-sm font-semibold text-primary">{area.stat}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
