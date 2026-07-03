import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';

export function MapPreview() {
  return (
    <section className="py-12 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden premium-shadow bg-gray-200 order-2 lg:order-1">
            {/* Placeholder for an actual map preview image */}
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-project-images/1716999741618-map-preview.png" 
              alt="Interactive Map Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg text-center">
                    <Map className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="font-bold text-primary">Live Map coming soon</p>
                </div>
            </div>
          </div>
          <div className="lg:pl-8 order-1 lg:order-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">See the Full Picture</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Explore a live, interactive map of environmental reports across Nigeria. Filter by hazard type, see heatmaps of problem areas, and track the status of cleanup efforts in real-time.
            </p>
            <ul className="space-y-2 mb-8 text-muted-foreground">
              <li className="flex items-center gap-2">- View real-time hazard markers</li>
              <li className="flex items-center gap-2">- Access detailed report information</li>
              <li className="flex items-center gap-2">- Understand environmental health with heatmaps</li>
              <li className="flex items-center gap-2">- Filter by category and status</li>
            </ul>
            <Button asChild size="lg">
              <Link to="/map">Explore the Live Map</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
