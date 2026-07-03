import React from 'react';

const logos = [
  { name: 'Government Agency', logo: 'https://via.placeholder.com/150x60?text=Gov+Agency' },
  { name: 'NGO Partner', logo: 'https://via.placeholder.com/150x60?text=NGO+Partner' },
  { name: 'Environmental Org', logo: 'https://via.placeholder.com/150x60?text=Eco+Org' },
  { name: 'Community Association', logo: 'https://via.placeholder.com/150x60?text=Community' },
  { name: 'Academic Institution', logo: 'https://via.placeholder.com/150x60?text=University' },
  { name: 'Corporate Sponsor', logo: 'https://via.placeholder.com/150x60?text=Sponsor' },
];

export function Partners() {
  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">Our Partners & Supporters</h2>
          <p className="text-lg text-muted-foreground mt-2">We are proud to collaborate with leading organizations to amplify our impact.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((partner) => (
            <div key={partner.name} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src={partner.logo} alt={partner.name} className="h-12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
