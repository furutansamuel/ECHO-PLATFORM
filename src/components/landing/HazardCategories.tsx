import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
// Single source of truth — the same category list the actual report
// form uses. The old version of this section had its own hardcoded
// array with different names/slugs than the real categories, so
// clicking a card here didn't line up with what the report form
// actually accepted.
import { HAZARD_CATEGORIES } from '@/components/reports/HazardCategories';

const PREVIEW_COUNT = 8;

export function HazardCategories() {
  const preview = HAZARD_CATEGORIES.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl text-primary">Report a Hazard</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Select a category to quickly report an environmental issue in your community. Your report makes a difference.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {preview.map((category) => (
            <Link to={`/report?category=${encodeURIComponent(category.id)}`} key={category.id}>
              <Card className="card-premium group h-full">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">{category.title}</CardTitle>
                  <div className={`icon-badge ${category.color} h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Button asChild size="lg" className="rounded-full gap-2">
            <Link to="/report">
              Report a Hazard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/map">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
