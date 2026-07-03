import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
    AlertTriangle, 
    Map, 
    BrainCircuit, 
    History, 
    Wrench, 
    Award, 
    Bell, 
    AreaChart 
} from 'lucide-react';

const features = [
  { icon: AlertTriangle, title: 'Report Hazard', href: '/report' },
  { icon: Map, title: 'Interactive Map', href: '/map' },
  { icon: BrainCircuit, title: 'AI Intelligence', href: '/ai-intelligence' },
  { icon: History, title: 'Track Reports', href: '/reports' },
  { icon: Wrench, title: 'Cleanup Events', href: '/community-insights' },
  { icon: Award, title: 'Impact Center', href: '/rewards' },
  { icon: Bell, title: 'Notifications', href: '/notifications' },
  { icon: AreaChart, title: 'Community Health', href: '/community-health' },
];

export function CoreFeatures() {
  return (
    <section className="py-12 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">Everything You Need, All in One Place</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            ECHO provides a comprehensive suite of tools for citizens, communities, and agencies.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link to={feature.href} key={feature.title}>
              <Card className="group text-center p-6 hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl premium-shadow h-full">
                <CardHeader className="p-0 items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
