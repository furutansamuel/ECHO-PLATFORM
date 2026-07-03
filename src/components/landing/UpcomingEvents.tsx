import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

const events = [
  {
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-project-images/1716999818817-cleanup-event-1.jpg',
    title: 'Lekki Beach Cleanup Drive',
    date: 'Saturday, August 3, 2024',
    location: 'Lekki, Lagos',
    volunteers: 48,
  },
  {
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-project-images/1716999849942-cleanup-event-2.jpg',
    title: 'Abuja Central Park Restoration',
    date: 'Saturday, August 10, 2024',
    location: 'Abuja, FCT',
    volunteers: 35,
  },
  {
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-project-images/1716999882283-cleanup-event-3.jpg',
    title: 'Port Harcourt Waterfront Cleanup',
    date: 'Saturday, August 17, 2024',
    location: 'Port Harcourt, Rivers',
    volunteers: 60,
  },
];

export function UpcomingEvents() {
  return (
    <section className="py-12 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">Upcoming Cleanup Events</h2>
            <p className="text-lg text-muted-foreground mt-2">Join fellow volunteers and make a visible difference in your community.</p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/community-insights">View All Events</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.title} className="overflow-hidden group premium-shadow">
                <div className="h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <div className="text-muted-foreground space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary"/><span>{event.date}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/><span>{event.location}</span></div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary"/><span>{event.volunteers} volunteers signed up</span></div>
                </div>
                <Button asChild className="w-full">
                  <Link to="/community-insights">Join Event</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
