import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2, Droplet, Wind, CloudFog, Factory } from 'lucide-react';

// Short classification codes, styled like a civic hazard-dispatch code —
// grounded in how emergency/civic systems actually tag incident types,
// not decorative 01/02/03 numbering (these categories have no real order).
const categories = [
  { name: 'Plastic Waste', code: 'PWS', icon: Trash2, slug: 'plastic-waste', gradient: 'gradient-primary' },
  { name: 'Flood', code: 'FLD', icon: Droplet, slug: 'flood', gradient: 'gradient-analytics' },
  { name: 'Blocked Drainage', code: 'BDR', icon: CloudFog, slug: 'blocked-drainage', gradient: 'gradient-secondary' },
  { name: 'Illegal Dumpsite', code: 'IDS', icon: Trash2, slug: 'illegal-dumpsite', gradient: 'gradient-community' },
  { name: 'Stagnant Water', code: 'STW', icon: Droplet, slug: 'stagnant-water', gradient: 'gradient-analytics' },
  { name: 'Water Pollution', code: 'WPL', icon: Factory, slug: 'water-pollution', gradient: 'gradient-ai' },
  { name: 'Air Pollution', code: 'APL', icon: Wind, slug: 'air-pollution', gradient: 'gradient-secondary' },
  { name: 'Illegal Burning', code: 'IBN', icon: Wind, slug: 'illegal-burning', gradient: 'gradient-community' },
  { name: 'Other Hazards', code: 'OTH', icon: ArrowRight, slug: 'other', gradient: 'gradient-success' },
];

export function HazardCategories() {
  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl text-primary">Report a Hazard</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Select a category to quickly report an environmental issue in your community. Your report makes a difference.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link to={`/report?category=${category.slug}`} key={category.name}>
              <Card className="card-premium group h-full">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground">
                      {category.code}
                    </span>
                    <CardTitle className="text-lg font-semibold mt-0.5">{category.name}</CardTitle>
                  </div>
                  <div className={`icon-badge ${category.gradient} h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground group-hover:text-primary">
                    Report now <ArrowRight className="inline-block h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
