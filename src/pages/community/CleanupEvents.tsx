import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useUpcomingEvents, UpcomingEvent } from '@/hooks/use-events';
import { useEventRegistrations } from '@/hooks/use-event-registrations';

import { HeroSection } from '@/components/events/HeroSection';
import { StatisticsCards } from '@/components/events/StatisticsCards';
import { FeaturedEvent } from '@/components/events/FeaturedEvent';
import { EventCard } from '@/components/events/EventCard';
import { CompletedEventCard } from '@/components/events/CompletedEventCard';
import { EventDetailsDialog } from '@/components/events/EventDetailsDialog';
import { SearchBar, EventFilterView } from '@/components/events/SearchBar';
import { EmptyState } from '@/components/events/EmptyState';
import { SkeletonCards, FeaturedEventSkeleton } from '@/components/events/SkeletonCards';

export default function CleanupEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Exact existing hooks, unmodified — same data source and
  // register/unregister/RLS behavior as before.
  const { events: upcoming, loading: upcomingLoading } = useUpcomingEvents(undefined, ['upcoming', 'ongoing']);
  const { events: completed, loading: completedLoading } = useUpcomingEvents(undefined, ['completed']);
  const { registeredIds, register, unregister, pendingId } = useEventRegistrations();

  const [query, setQuery] = useState('');
  const [view, setView] = useState<EventFilterView>('upcoming');
  const [category, setCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);

  const eventsSectionRef = useRef<HTMLDivElement>(null);
  const scrollToEvents = () => eventsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleBrowseClick = () => scrollToEvents();
  const handleVolunteerClick = () => {
    if (!user) {
      navigate('/auth/register');
    } else {
      scrollToEvents();
    }
  };

  const handleJoin = (eventId: string) => {
    if (registeredIds.has(eventId)) {
      unregister(eventId);
    } else {
      register(eventId);
    }
  };

  // Real, derived — never fabricated: total volunteer sign-ups across
  // every upcoming + completed event.
  const registeredVolunteers = useMemo(
    () => [...upcoming, ...completed].reduce((sum, e) => sum + e.registered_count, 0),
    [upcoming, completed]
  );

  const featuredEvent = upcoming[0] ?? null;

  const matchesQuery = (e: UpcomingEvent) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.location_name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  };
  const matchesCategory = (e: UpcomingEvent) => category === 'all' || e.category === category;

  const filteredUpcoming = useMemo(
    () => upcoming.filter((e) => matchesQuery(e) && matchesCategory(e)),
    [upcoming, query, category]
  );
  const filteredCompleted = useMemo(
    () => completed.filter((e) => matchesQuery(e) && matchesCategory(e)),
    [completed, query, category]
  );
  const registeredEvents = useMemo(
    () => [...upcoming, ...completed].filter((e) => registeredIds.has(e.id) && matchesQuery(e) && matchesCategory(e)),
    [upcoming, completed, registeredIds, query, category]
  );

  const loading = upcomingLoading || completedLoading;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      <HeroSection
        upcomingCount={upcoming.length}
        registeredVolunteers={registeredVolunteers}
        onBrowseClick={handleBrowseClick}
        onVolunteerClick={handleVolunteerClick}
      />

      <StatisticsCards
        upcomingCount={upcoming.length}
        registeredVolunteers={registeredVolunteers}
        completedCount={completed.length}
      />

      {view === 'upcoming' && !query.trim() && category === 'all' && (
        loading ? (
          <FeaturedEventSkeleton />
        ) : featuredEvent ? (
          <FeaturedEvent
            event={featuredEvent}
            isRegistered={registeredIds.has(featuredEvent.id)}
            isPending={pendingId === featuredEvent.id}
            onJoin={() => handleJoin(featuredEvent.id)}
            onViewDetails={() => setSelectedEvent(featuredEvent)}
          />
        ) : null
      )}

      <div ref={eventsSectionRef} className="space-y-6 scroll-mt-20">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          view={view}
          onViewChange={setView}
          category={category}
          onCategoryChange={setCategory}
          registeredCount={registeredIds.size}
        />

        {loading ? (
          <SkeletonCards />
        ) : view === 'upcoming' ? (
          filteredUpcoming.length === 0 ? (
            <EmptyState
              title="No events available yet"
              description="Check back soon, or be the first to know when a new cleanup is scheduled."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={registeredIds.has(event.id)}
                  isPending={pendingId === event.id}
                  onJoin={() => handleJoin(event.id)}
                  onViewDetails={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          )
        ) : view === 'completed' ? (
          filteredCompleted.length === 0 ? (
            <EmptyState
              title="No completed events yet"
              description="Once cleanups wrap up, they'll show up here with their final volunteer counts."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompleted.map((event) => (
                <button key={event.id} onClick={() => setSelectedEvent(event)} className="text-left">
                  <CompletedEventCard event={event} />
                </button>
              ))}
            </div>
          )
        ) : !user ? (
          <EmptyState
            title="Sign in to see your events"
            description="Create an account or log in to track the events you've joined."
            actionLabel="Sign In"
            onAction={() => navigate('/auth/login')}
          />
        ) : registeredEvents.length === 0 ? (
          <EmptyState
            title="You haven't joined any events yet"
            description="Browse upcoming cleanups and tap Join Event to get started."
            actionLabel="Browse Events"
            onAction={() => setView('upcoming')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map((event) =>
              event.status === 'completed' ? (
                <button key={event.id} onClick={() => setSelectedEvent(event)} className="text-left">
                  <CompletedEventCard event={event} />
                </button>
              ) : (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered
                  isPending={pendingId === event.id}
                  onJoin={() => handleJoin(event.id)}
                  onViewDetails={() => setSelectedEvent(event)}
                />
              )
            )}
          </div>
        )}
      </div>

      <EventDetailsDialog
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        isRegistered={selectedEvent ? registeredIds.has(selectedEvent.id) : false}
        isPending={selectedEvent ? pendingId === selectedEvent.id : false}
        onJoin={() => selectedEvent && handleJoin(selectedEvent.id)}
      />
    </div>
  );
}
