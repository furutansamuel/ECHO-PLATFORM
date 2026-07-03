import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

const activities = [
  {
    icon: Icons.fileText,
    title: "New hazard report submitted",
    description: "Illegal dumping near Green Park.",
    time: "5m ago",
  },
  {
    icon: Icons.checkCircle,
    title: "Report verified",
    description: "Pothole on Main St confirmed by another user.",
    time: "30m ago",
  },
  {
    icon: Icons.award,
    title: "Reward earned!",
    description: "You received 50 Impact Points for your contributions.",
    time: "1h ago",
  },
  {
    icon: Icons.users,
    title: "Joined cleanup event",
    description: "You joined the 'River Cleanup' event.",
    time: "3h ago",
  },
];

export function RecentActivityWidget() {
  return (
    <Card className="bg-background/60 backdrop-blur-sm premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.activity className="h-5 w-5 text-primary" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <activity.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
