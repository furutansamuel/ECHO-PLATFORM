return (
  <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">

    {/* Hero */}
    <HeroSection />
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-primary via-primary/90 to-green-700 text-white">

  <CardContent className="p-8">

    <Badge className="mb-4 bg-white/20 border-0">
      🌍 Volunteer Programme
    </Badge>

    <h1 className="text-4xl font-black">
      Community Cleanup Events
    </h1>

    <p className="mt-3 max-w-2xl text-white/90">
      Join environmental volunteers across your community to clean streets,
      remove illegal dump sites, plant trees and protect the environment.
    </p>

    <div className="mt-6 flex flex-wrap gap-3">

      <Button className="bg-white text-primary hover:bg-white/90">
        Browse Events
      </Button>

      <Button
        variant="outline"
        className="border-white text-white hover:bg-white/10"
      >
        Become a Volunteer
      </Button>

    </div>

  </CardContent>

</Card>

    {/* Statistics */}
    <StatisticsSection />
    <div className="grid gap-4 md:grid-cols-3">

<Card>

<CardContent className="p-5">

<div className="flex items-center gap-4">

<div className="rounded-full bg-primary/10 p-3">
<CalendarDays className="h-6 w-6 text-primary"/>
</div>

<div>

<p className="text-3xl font-black">
{upcomingEvents.length}
</p>

<p className="text-muted-foreground">
Upcoming Events
</p>

</div>

</div>

</CardContent>

</Card>

<Card>

<CardContent className="p-5">

<div className="flex items-center gap-4">

<div className="rounded-full bg-blue-100 p-3">
<UsersRound className="h-6 w-6 text-blue-600"/>
</div>

<div>

<p className="text-3xl font-black">

{upcomingEvents.reduce(
(total,event)=>total+(event.registered_count||0),
0
)}

</p>

<p className="text-muted-foreground">

Registered Volunteers

</p>

</div>

</div>

</CardContent>

</Card>

<Card>

<CardContent className="p-5">

<div className="flex items-center gap-4">

<div className="rounded-full bg-green-100 p-3">

<MapPinned className="h-6 w-6 text-green-700"/>

</div>

<div>

<p className="text-3xl font-black">

{completedEvents.length}

</p>

<p className="text-muted-foreground">

Completed Events

</p>

</div>

</div>

</CardContent>

</Card>

</div>

    {/* Featured Event */}
    <FeaturedEvent />
    {upcomingEvents.length > 0 && (

<Card className="overflow-hidden shadow-xl">

<div className="grid md:grid-cols-2">

<div>

{upcomingEvents[0].image_url ?

<img
src={upcomingEvents[0].image_url}
alt={upcomingEvents[0].title}
className="h-full w-full object-cover"
/>

:

<div className="flex h-full min-h-[260px] items-center justify-center bg-primary/5">

<Calendar className="h-20 w-20 text-primary"/>

</div>

}

</div>

<CardContent className="p-8">

<Badge>Featured Event</Badge>

<h2 className="mt-4 text-3xl font-black">

{upcomingEvents[0].title}

</h2>

<p className="mt-3 text-muted-foreground">

{upcomingEvents[0].description}

</p>

</CardContent>

</div>

</Card>

)}

    {/* Upcoming Events */}
    <UpcomingEventsSection />
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

{upcomingEvents.map(event=>{

const joined=registeredIds.has(event.id);

return(

<Card
key={event.id}
className="overflow-hidden shadow-lg hover:shadow-xl transition-all"
>

<div className="h-52">

{event.image_url?

<img
src={event.image_url}
alt={event.title}
className="h-full w-full object-cover"
/>

:

<div className="flex h-full items-center justify-center bg-primary">

<Calendar className="h-16 w-16 text-white"/>

</div>

}

</div>

<CardContent className="space-y-4 p-5">

<h3 className="text-xl font-bold">

{event.title}

</h3>

<div className="space-y-2 text-sm">

<p>📅 {new Date(event.event_date).toLocaleDateString()}</p>

<p>📍 {event.location_name}</p>

<p>👥 {event.registered_count} Volunteers</p>

</div>

<Button
className="w-full"
variant={joined?"outline":"default"}
onClick={()=>joined?unregister(event.id):register(event.id)}
>

{joined?"Registered ✓":"Join Event"}

</Button>

</CardContent>

</Card>

);

})}

</div>

    {/* Completed Events */}
    <CompletedEventsSection />
    <div className="grid gap-6 md:grid-cols-2">

{completedEvents.map(event=>(

<Card
key={event.id}
className="overflow-hidden bg-green-50"
>

<CardContent className="p-5">

<h3 className="font-bold">

{event.title}

</h3>

<p className="text-sm text-muted-foreground">

{new Date(event.event_date).toLocaleDateString()}

</p>

<Badge className="mt-4">

Completed

</Badge>

</CardContent>

</Card>

))}

</div>

    {/* Event Details Dialog */}
    <EventDetailsDialog />
    <Dialog
open={!!selectedEvent}
onOpenChange={() => setSelectedEvent(null)}
>

<DialogContent>

<DialogHeader>

<DialogTitle>

{selectedEvent?.title}

</DialogTitle>

</DialogHeader>

<p>

{selectedEvent?.description}

</p>

</DialogContent>

</Dialog>

  </div>
);
