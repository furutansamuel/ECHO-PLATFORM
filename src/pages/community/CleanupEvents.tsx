import {
  Calendar,
  Loader2,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Info,
MapPinned,
UsersRound,
CalendarDays,
Timer,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


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
  
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
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
            {/* Hero Section */}

<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-green-700 p-8 text-white shadow-xl">

  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>

  <div className="absolute -bottom-12 left-0 h-32 w-32 rounded-full bg-white/5"></div>

  <div className="relative z-10">

    <Badge className="mb-4 bg-white/20 text-white border-0">
      🌍 Volunteer Programme
    </Badge>

    <h1 className="text-4xl font-black tracking-tight">
      Community Cleanup Events
    </h1>

    <p className="mt-3 max-w-2xl text-white/90">
      Join environmental volunteers across your community to clean streets,
      remove illegal dump sites, plant trees, and create a healthier
      environment for everyone.
    </p>

    <div className="mt-6 flex flex-wrap gap-3">

      <Button
        size="lg"
        className="bg-white text-primary hover:bg-white/90"
      >
        <Calendar className="mr-2 h-5 w-5" />
        Browse Events
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="border-white text-white hover:bg-white/10"
      >
        Become a Volunteer
      </Button>

    </div>

  </div>

</div>

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

  <div className="mb-5 flex items-center justify-between">

    <div>

        <h2 className="text-2xl font-black">
            Upcoming Events
        </h2>

        <p className="text-sm text-muted-foreground">
            Register and participate in upcoming environmental activities.
        </p>

    </div>

    <Badge className="bg-primary/10 text-primary">
        {upcomingEvents.length} Events
    </Badge>

</div>

  {/* Upcoming Events */}
  <Card
  key={event.id}
  className="
    overflow-hidden
    border-0
    shadow-lg
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-2xl
  "
>

  {/* Event Image */}

  <div className="relative h-52 w-full overflow-hidden">

    {event.image_url ? (

      <img
        src={event.image_url}
        alt={event.title}
        className="h-full w-full object-cover"
      />

    ) : (

      <div className="flex h-full items-center justify-center bg-gradient-to-r from-primary to-green-700">

        <Calendar className="h-16 w-16 text-white" />

      </div>

    )}

    <Badge
      className="
        absolute
        left-4
        top-4
        bg-white
        text-primary
        font-bold
      "
    >
      Upcoming
    </Badge>

  </div>

  <CardContent className="space-y-4 p-5">

    <h3 className="text-xl font-black">

      {event.title}

    </h3>

    <div className="space-y-2 text-sm">

      <div className="flex items-center gap-2 text-muted-foreground">

        <Calendar className="h-4 w-4 text-primary" />

        {new Date(event.event_date).toLocaleDateString()}

      </div>

      <div className="flex items-center gap-2 text-muted-foreground">

        <MapPin className="h-4 w-4 text-primary" />

        {event.location_name}

      </div>

      <div className="flex items-center gap-2 text-muted-foreground">

        <Users className="h-4 w-4 text-primary" />

        {event.registered_count} Volunteers Joined

      </div>

    </div>

    <div className="pt-3">

      {user ? (

        <Button
          className="w-full rounded-xl"
          disabled={pendingId === event.id}
          variant={
            registeredIds.has(event.id)
              ? "outline"
              : "default"
          }
          onClick={() =>
            registeredIds.has(event.id)
              ? unregister(event.id)
              : register(event.id)
          }
        >

          {pendingId === event.id ? (

            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

          ) : registeredIds.has(event.id) ? (

            "Registered ✓"

          ) : (

            <>
              Join Event
              <ArrowRight className="ml-2 h-4 w-4" />
            </>

          )}

        </Button>

      ) : (

        <Button
          asChild
          className="w-full rounded-xl"
        >
          <Link to="/auth/login">
            Sign in to Join
          </Link>
        </Button>

      )}

    </div>

  </CardContent>

</Card>

  {/* Completed Events */}
  <div className="mb-5 flex items-center justify-between">

    <div>

        <h2 className="text-2xl font-black">
            Past Events
        </h2>

        <p className="text-sm text-muted-foreground">
            Environmental activities successfully completed.
        </p>

    </div>

    <Badge variant="secondary">
        {completedEvents.length} Completed
    </Badge>

</div>
  <Card
  key={event.id}
  className="
    overflow-hidden
    border
    border-green-100
    bg-green-50/30
    shadow-md
    transition-all
    duration-300
    hover:shadow-xl
  "
>

  {/* Image */}

  <div className="relative h-48 overflow-hidden">

    {event.image_url ? (

      <img
        src={event.image_url}
        alt={event.title}
        className="h-full w-full object-cover grayscale"
      />

    ) : (

      <div className="flex h-full items-center justify-center bg-green-700">

        <Calendar className="h-16 w-16 text-white" />

      </div>

    )}

    <Badge
      className="
        absolute
        right-4
        top-4
        bg-green-700
        text-white
        border-0
      "
    >
      ✓ Completed
    </Badge>

  </div>

  <CardContent className="space-y-4 p-5">

    <h3 className="text-xl font-bold">

      {event.title}

    </h3>

    <div className="space-y-2 text-sm">

      <div className="flex items-center gap-2 text-muted-foreground">

        <Calendar className="h-4 w-4 text-primary" />

        {new Date(event.event_date).toLocaleDateString()}

      </div>

      <div className="flex items-center gap-2 text-muted-foreground">

        <Users className="h-4 w-4 text-primary" />

        {event.registered_count} Volunteers Participated

      </div>

    </div>

    <div className="rounded-xl bg-green-100 p-3">

      <p className="text-xs font-semibold text-green-800">

        Thank you to everyone who participated in making the community cleaner.

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

      {/* Featured Event */}
{upcomingEvents.length > 0 && (
  <Card className="overflow-hidden border-none shadow-xl">

    <div className="grid md:grid-cols-2">

      {/* Event Image */}
      <div className="bg-primary/5 flex items-center justify-center min-h-[250px]">

        {upcomingEvents[0].image_url ? (
          <img
            src={upcomingEvents[0].image_url}
            alt={upcomingEvents[0].title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Calendar className="h-20 w-20 text-primary" />
        )}

      </div>

      {/* Event Details */}
      <CardContent className="p-8 flex flex-col justify-center space-y-4">

        <Badge className="w-fit bg-primary text-white">
          Featured Event
        </Badge>

        <h2 className="text-3xl font-black">
          {upcomingEvents[0].title}
        </h2>

        <p className="text-muted-foreground">
          {upcomingEvents[0].description ||
            "Join fellow volunteers in making our community cleaner and healthier."}
        </p>

        <div className="space-y-2 text-sm">

          <p>
            📅{" "}
            {new Date(
              upcomingEvents[0].event_date
            ).toLocaleDateString()}
          </p>

          <p>
            📍 {upcomingEvents[0].location_name}
          </p>

          <p>
            👥 {upcomingEvents[0].registered_count} Volunteers Registered
          </p>

        </div>

        {user ? (
          <Button
            className="w-fit rounded-full"
            onClick={() =>
              registeredIds.has(upcomingEvents[0].id)
                ? unregister(upcomingEvents[0].id)
                : register(upcomingEvents[0].id)
            }
            disabled={pendingId === upcomingEvents[0].id}
          >
            {pendingId === upcomingEvents[0].id
              ? "Please wait..."
              : registeredIds.has(upcomingEvents[0].id)
              ? "✓ Joined"
              : "Join Event"}
          </Button>
        ) : (
          <Button asChild className="w-fit rounded-full">
            <Link to="/auth/login">
              Sign in to Join
            </Link>
          </Button>
        )}

      </CardContent>

    </div>

  </Card>
)}
      
      
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
                  upcomingEvents.map((event) => {
  const joined = registeredIds.has(event.id);

  return (
    <Card
      key={event.id}
      className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Event Image */}
      <div className="h-44 bg-primary/5 flex items-center justify-center">

        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Calendar className="h-12 w-12 text-primary" />
        )}

      </div>

      <CardContent className="p-5 space-y-4">

        <div className="flex items-center justify-between">

          <Badge className="bg-green-100 text-green-700 border-none">
            Open
          </Badge>

          <span className="text-xs text-muted-foreground">
            👥 {event.registered_count} Volunteers
          </span>

        </div>

        <h3 className="text-lg font-bold">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">

          <p>
            📅 {new Date(event.event_date).toLocaleDateString()}
          </p>

          <p>
            📍 {event.location_name}
          </p>

        </div>

        <div className="flex justify-end">

          {user ? (

            <Button
              className="rounded-full"
              variant={joined ? "outline" : "default"}
              disabled={pendingId === event.id}
              onClick={() =>
                joined
                  ? unregister(event.id)
                  : register(event.id)
              }
            >
              {pendingId === event.id
                ? "Loading..."
                : joined
                ? "✓ Joined"
                : "Join Event"}
            </Button>

          ) : (

            <Button asChild className="rounded-full">
              <Link to="/auth/login">
                Sign In
              </Link>
            </Button>

          )}

        </div>

      </CardContent>

    </Card>
  );
})
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
