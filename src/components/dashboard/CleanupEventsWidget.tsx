import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUpcomingEvents } from "@/hooks/use-events";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

export function CleanupEventsWidget() {
  const { events, loading } = useUpcomingEvents(3);

  return (
    <Card className="bg-background/60 backdrop-blur-sm premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.calendar className="h-5 w-5 text-primary" />
          <span>Upcoming Cleanup Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => <div key={i} className="h-20 rounded-lg bg-muted/40 animate-pulse" />)}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No upcoming events right now.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border p-3 rounded-lg bg-muted/20">
              <div className="flex gap-4">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="rounded-md object-cover hidden sm:block h-[100px] w-[100px]"
                  />
                ) : (
                  <div className="rounded-md bg-muted hidden sm:flex items-center justify-center h-[100px] w-[100px] text-muted-foreground">
                    <Icons.calendar className="h-6 w-6" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <p className="font-semibold">{event.title}</p>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Icons.calendarDays className="h-3 w-3" />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Icons.mapPin className="h-3 w-3" />
                    <span>{event.location_name}</span>
                  </div>
                  {event.max_volunteers ? (
                    <div className="flex items-center gap-2 pt-1">
                      <Progress value={(event.registered_count / event.max_volunteers) * 100} className="h-2" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {event.registered_count}/{event.max_volunteers} volunteers
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-muted-foreground pt-1">
                      {event.registered_count} volunteer{event.registered_count === 1 ? '' : 's'} signed up
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
       <CardFooter className="pt-4">
        <Button className="w-full" variant="outline" asChild>
          <Link to="/community-insights">See All Events</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
