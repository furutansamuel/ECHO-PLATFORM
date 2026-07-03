import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { useReportsStore } from "@/hooks/use-reports-store";

export default function NotificationsPage() {
  const { notifications } = useReportsStore();

  const mockNotifications = [
    {
      id: "1",
      icon: Icons.alertTriangle,
      title: "Hazard Status Update",
      description: "Your report #123 has been marked as 'In Progress'.",
      time: "30m ago",
      unread: true,
      category: "Status"
    },
    {
      id: "2",
      icon: Icons.bot,
      title: "AI Analysis Complete",
      description: "New environmental health insight generated based on your local area reports.",
      time: "2h ago",
      unread: true,
      category: "AI Insight"
    },
    {
      id: "3",
      icon: Icons.calendar,
      title: "Cleanup Event Reminder",
      description: "'Park Cleanup' is tomorrow at 10:00 AM. Don't forget your gloves!",
      time: "1h ago",
      unread: false,
      category: "Event"
    },
    {
      id: "4",
      icon: Icons.award,
      title: "New Achievement!",
      description: "You've earned the 'Consistent Reporter' badge.",
      time: "1d ago",
      unread: false,
      category: "Achievement"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Notifications</h1>
          <p className="text-muted-foreground italic">Stay updated on your reports and community events</p>
        </div>
        <Badge variant="outline" className="font-black">
          {mockNotifications.filter(n => n.unread).length} Unread
        </Badge>
      </div>

      <Card className="shadow-sm border-muted/20">
        <CardContent className="p-0">
          <div className="divide-y divide-muted/10">
            {mockNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-6 flex gap-4 transition-colors hover:bg-muted/5 cursor-pointer ${notification.unread ? 'bg-primary/5' : ''}`}
              >
                <div className={`p-3 rounded-xl h-fit ${notification.unread ? 'bg-primary/10 text-primary shadow-sm shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                  <notification.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm uppercase tracking-tight">{notification.title}</h3>
                      <Badge variant="secondary" className="text-[9px] font-black uppercase h-4 px-1.5">
                        {notification.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium italic">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{notification.description}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
