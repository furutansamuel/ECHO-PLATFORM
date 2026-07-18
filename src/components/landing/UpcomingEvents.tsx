import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, CalendarX } from 'lucide-react';
import { useUpcomingEvents } from '@/hooks/use-events';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export function UpcomingEvents() {
  const { events, loading } = useUpcomingEvents(3);

  return (
    <section className="py-12 lg:py-24 section-bg-soft">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl text-primary">Upcoming Cleanup Events</h2>
            <p className="text-lg text-muted-foreground mt-2">Join fellow volunteers and make a visible difference in your community.</p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/community-insights">View All Events</Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <CalendarX className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No cleanup events scheduled right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden group premium-shadow">
                <div className="h-48 overflow-hidden bg-muted">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <Calendar className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="text-muted-foreground space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span>{formatDate(event.event_date)}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>{event.location_name}</span></div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>
                        {event.registered_count} volunteer{event.registered_count === 1 ? '' : 's'} signed up
                        {event.max_volunteers ? ` (of ${event.max_volunteers})` : ''}
                      </span>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/community-insights">Join Event</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
