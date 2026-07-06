import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "@/components/ui/Image";

const events = [
  {
    name: "Riverfront Cleanup Drive",
    date: "25 July, 2024",
    location: "Green Valley Riverfront",
    volunteers: 45,
    goal: 100,
    imageUrl: "/placeholder.svg",
  },
  {
    name: "Park Restoration Day",
    date: "02 August, 2024",
    location: "Central City Park",
    volunteers: 25,
    goal: 50,
    imageUrl: "/placeholder.svg",
  },
];

export function CleanupEventsWidget() {
  return (
    <Card className="bg-background/60 backdrop-blur-sm premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.calendar className="h-5 w-5 text-primary" />
          <span>Upcoming Cleanup Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, index) => (
          <div key={event.name} className="border p-3 rounded-lg bg-muted/20">
            <div className="flex gap-4">
              <Image src={event.imageUrl} alt={event.name} width={100} height={100} className="rounded-md object-cover hidden sm:block" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold">{event.name}</p>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Icons.calendarDays className="h-3 w-3" />
                  <span>{event.date}</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Icons.mapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                    <Progress value={(event.volunteers / event.goal) * 100} className="h-2" />
                    <span className="text-xs font-medium text-muted-foreground">
                        {event.volunteers}/{event.goal} volunteers
                    </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
       <CardFooter className="pt-4">
        <Button className="w-full" variant="outline" asChild>
          <Link to="/community-insights">See All Events</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
