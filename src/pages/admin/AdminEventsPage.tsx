import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Loader2, Pencil, Trash2, MapPin, Calendar } from 'lucide-react';
import type { EventRecord } from '@/types/reports';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    setLoading(false);
    if (error) {
      toast.error('Failed to load events: ' + error.message);
      return;
    }
    setEvents((data as EventRecord[]) || []);
  };

  useEffect(() => { fetchEvents(); }, []);

  const deleteEvent = async (event: EventRecord) => {
    if (!supabase) return;
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('events').delete().eq('id', event.id);
    if (error) {
      toast.error('Failed to delete event: ' + error.message);
      return;
    }
    toast.success('Event deleted.');
    fetchEvents();
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Events</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage cleanup events and volunteer opportunities.</p>
        </div>
        <Button asChild className="btn-glow">
          <Link to="/admin/events/new"><Plus className="h-4 w-4 mr-2" />New Event</Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card-premium overflow-hidden">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="text-center text-muted-foreground py-16 text-sm">No events yet — create your first one.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="card-premium overflow-hidden flex flex-col">
              <div className="aspect-video bg-muted overflow-hidden">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Calendar className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <span className="beacon-badge beacon-badge--warning w-fit">{event.category}</span>
                <h3 className="font-semibold leading-tight">{event.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {new Date(event.event_date).toLocaleDateString()} · {event.start_time}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {event.location_name}
                </p>
                <div className="flex gap-2 mt-auto pt-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link to={`/admin/events/${event.id}/edit`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Edit</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => deleteEvent(event)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
