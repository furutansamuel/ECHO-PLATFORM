import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2, Droplet, Wind, CloudFog, Factory } from 'lucide-react';

const categories = [
  { name: 'Plastic Waste', icon: Trash2, slug: 'plastic-waste', gradient: 'gradient-primary' },
  { name: 'Flood', icon: Droplet, slug: 'flood', gradient: 'gradient-analytics' },
  { name: 'Blocked Drainage', icon: CloudFog, slug: 'blocked-drainage', gradient: 'gradient-secondary' },
  { name: 'Illegal Dumpsite', icon: Trash2, slug: 'illegal-dumpsite', gradient: 'gradient-community' },
  { name: 'Stagnant Water', icon: Droplet, slug: 'stagnant-water', gradient: 'gradient-analytics' },
  { name: 'Water Pollution', icon: Factory, slug: 'water-pollution', gradient: 'gradient-ai' },
  { name: 'Air Pollution', icon: Wind, slug: 'air-pollution', gradient: 'gradient-secondary' },
  { name: 'Illegal Burning', icon: Wind, slug: 'illegal-burning', gradient: 'gradient-community' },
  { name: 'Other Hazards', icon: ArrowRight, slug: 'other', gradient: 'gradient-success' },
];

export function HazardCategories() {
  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">Report a Hazard</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Select a category to quickly report an environmental issue in your community. Your report makes a difference.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link to={`/report?category=${category.slug}`} key={category.name}>
              <Card className="group hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl premium-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                  <div className={`icon-badge ${category.gradient} h-11 w-11 transition-transform duration-300 group-hover:scale-110`}>
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
