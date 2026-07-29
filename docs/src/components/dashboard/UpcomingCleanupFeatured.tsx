import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, TreePine, Users, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpcomingEvents } from '@/hooks/use-events';
import { useEventRegistrations } from '@/hooks/use-event-registrations';

function daysUntil(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Starts tomorrow';
  return `Starts in ${diff} days`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
}

export function UpcomingCleanupFeatured() {
  const { events, loading } = useUpcomingEvents(1);
  const { registeredIds, register, unregister, pendingId } = useEventRegistrations();
  const event = events[0];

  if (loading) {
    return <div className="h-48 rounded-3xl bg-muted/40 animate-pulse" />;
  }

  if (!event) return null;

  const isRegistered = registeredIds.has(event.id);

  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {event.image_url && (
        <div className="h-32 w-full overflow-hidden">
          <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <TreePine className="h-4 w-4" />
          <span className="text-xs font-black uppercase tracking-widest">Community Cleanup</span>
        </div>
        <h3 className="text-lg font-black">{formatDate(event.event_date)}</h3>
        <p className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {event.location_name}
        </p>
        <div className="mb-4 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {event.registered_count} Volunteer{event.registered_count === 1 ? '' : 's'}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {daysUntil(event.event_date)}
          </span>
        </div>
        <Button
          className="w-full font-bold"
          variant={isRegistered ? 'outline' : 'default'}
          disabled={pendingId === event.id}
          onClick={() => (isRegistered ? unregister(event.id) : register(event.id))}
        >
          {pendingId === event.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRegistered ? (
            "✓ You're Registered"
          ) : (
            'Join Cleanup →'
          )}
        </Button>
        <Link
          to="/cleanup-events"
          className="mt-2 block text-center text-[11px] font-black uppercase tracking-widest text-primary"
        >
          See All Events
        </Link>
      </div>
    </div>
  );
}

export default React.memo(UpcomingCleanupFeatured);
