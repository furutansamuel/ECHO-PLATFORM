export default function CleanupEvents() {
  const { user } = useAuth();

  const { events: upcomingEvents, loading: upcomingLoading } =
    useUpcomingEvents();

  const { events: completedEvents, loading: completedLoading } =
    useUpcomingEvents(undefined, ["completed"]);

  const {
    registeredIds,
    register,
    unregister,
    pendingId,
  } = useEventRegistrations();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">

      {/* Hero Section */}
<Card className="border-none shadow-lg bg-gradient-to-r from-primary/10 to-green-50">
  <CardContent className="p-6 md:p-8">

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

      {/* Left */}
      <div className="space-y-3">

        <div className="flex items-center gap-3">
          <Calendar className="h-10 w-10 text-primary" />

          <div>
            <h1 className="text-3xl md:text-4xl font-black">
              Cleanup Events
            </h1>

            <p className="text-muted-foreground mt-1">
              Join environmental cleanup campaigns and help keep your community clean.
            </p>
          </div>
        </div>

      </div>

      {/* Right */}
      <Button size="lg" className="rounded-full">
        Join a Cleanup
      </Button>

    </div>

  </CardContent>
</Card>

      {/* Statistics Cards */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

  {/* Upcoming Events */}
  <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <CardContent className="flex items-center gap-4 p-5">

      <div className="rounded-full bg-primary/10 p-3">
        <Calendar className="h-6 w-6 text-primary" />
      </div>

      <div>
        <p className="text-2xl font-black">
          {upcomingEvents.length}
        </p>

        <p className="text-sm text-muted-foreground">
          Upcoming Events
        </p>
      </div>

    </CardContent>
  </Card>

  {/* Completed Events */}
  <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <CardContent className="flex items-center gap-4 p-5">

      <div className="rounded-full bg-green-100 p-3">
        <Award className="h-6 w-6 text-green-600" />
      </div>

      <div>
        <p className="text-2xl font-black">
          {completedEvents.length}
        </p>

        <p className="text-sm text-muted-foreground">
          Completed Events
        </p>
      </div>

    </CardContent>
  </Card>

  {/* Volunteers */}
  <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <CardContent className="flex items-center gap-4 p-5">

      <div className="rounded-full bg-blue-100 p-3">
        <Users className="h-6 w-6 text-blue-600" />
      </div>

      <div>
        <p className="text-2xl font-black">
          {upcomingEvents.reduce(
            (total, event) => total + (event.registered_count || 0),
            0
          )}
        </p>

        <p className="text-sm text-muted-foreground">
          Registered Volunteers
        </p>
      </div>

    </CardContent>
  </Card>

</div>
      
      {/* EVENTS TAB */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Upcoming Events</h3>
              {upcomingLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No upcoming events right now.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <Card key={event.id} className="border-none shadow-sm hover:shadow-md transition-all">
                      <CardContent className="p-4 flex items-center gap-4">
                        {event.image_url ? (
                          <img src={event.image_url} alt={event.title} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <Calendar className="h-6 w-6 text-primary shrink-0" />
                        )}
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm">{event.title}</h4>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString()} • {event.location_name}
                          </p>
                        </div>
                        {user ? (
                          <Button
                            size="sm"
                            variant={registeredIds.has(event.id) ? "outline" : "default"}
                            className="rounded-full shrink-0"
                            disabled={pendingId === event.id}
                            onClick={() => (registeredIds.has(event.id) ? unregister(event.id) : register(event.id))}
                          >
                            {pendingId === event.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : registeredIds.has(event.id) ? '✓' : 'Join'}
                          </Button>
                        ) : (
                          <Button asChild size="sm" className="rounded-full shrink-0">
                            <Link to="/auth/login">Sign in</Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Completed Events</h3>
              {completedLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : completedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No completed events yet.</p>
              ) : (
                <div className="space-y-3">
                  {completedEvents.map(event => (
                    <Card key={event.id} className="border-none shadow-sm opacity-75">
                      <CardContent className="p-4 flex items-center gap-4">
                        {event.image_url ? (
                          <img src={event.image_url} alt={event.title} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <Calendar className="h-6 w-6 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm">{event.title}</h4>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString()} • {event.registered_count} participants
                          </p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-600 border-none text-[9px]">Done</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
     </div>
  );
}
