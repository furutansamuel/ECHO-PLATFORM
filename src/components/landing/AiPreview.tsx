import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BrainCircuit, TrendingUp, ShieldAlert, BarChart } from 'lucide-react';

const aiFeatures = [
  {
    icon: BarChart,
    title: 'Community Health Score',
    description: "Get a real-time, data-driven score for your community's environmental health, helping to focus cleanup efforts.",
  },
  {
    icon: BrainCircuit,
    title: 'AI Summary & Insights',
    description: "Our AI automatically summarizes environmental reports and identifies key trends, saving time for decision-makers.",
  },
  {
    icon: ShieldAlert,
    title: 'Predictive Risk Level',
    description: "ECHO analyzes data to predict areas at high risk for future environmental issues like flooding or pollution.",
  },
  {
    icon: TrendingUp,
    title: 'Environmental Trends',
    description: "Track the impact of community action over time with clear, visual data on environmental improvements.",
  },
];

export function AiPreview() {
  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="lg:pr-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">AI Environmental Intelligence</h2>
            <p className="text-lg text-muted-foreground mb-6">
              ECHO uses advanced Artificial Intelligence to turn raw data into actionable intelligence. Understand your environment like never before.
            </p>
            <Button asChild size="lg">
              <Link to="/ai-intelligence">Explore AI Features</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {aiFeatures.map((feature) => (
              <Card key={feature.title} className="bg-white premium-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
