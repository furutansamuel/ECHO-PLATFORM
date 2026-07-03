import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIntelligenceData } from "@/hooks/use-intelligence-data";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Info, Bell, Award } from "lucide-react";

export function NotificationsWidget() {
  const navigate = useNavigate();
  const { alerts, loading } = useIntelligenceData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'flood_risk': return ShieldAlert;
      case 'pollution_increase': return ShieldAlert;
      case 'ai_recommendation': return Icons.bot;
      case 'milestone': return Award;
      case 'community_announcement': return Bell;
      default: return Info;
    }
  };

  return (
    <Card className="shadow-sm border-muted/20 overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-muted/5 group-hover:bg-muted/10 transition-colors">
        <CardTitle className="text-sm font-black uppercase tracking-tight">Recent Notifications</CardTitle>
        <Icons.bell className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-muted/10">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 flex gap-4">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : alerts.length > 0 ? (
            alerts.slice(0, 3).map((alert) => {
              const Icon = getIcon(alert.alert_type);
              return (
                <div 
                  key={alert.id} 
                  className="p-4 flex gap-4 transition-colors hover:bg-muted/5 cursor-pointer bg-primary/5"
                  onClick={() => navigate('/notifications')}
                >
                  <div className="mt-1 p-2 rounded-lg h-fit bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-black truncate">{alert.title}</h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed italic">
                      "{alert.message}"
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <Icons.bell className="h-8 w-8 text-muted-foreground mx-auto opacity-20" />
              <p className="text-xs text-muted-foreground italic">No new environmental alerts.</p>
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4 bg-muted/5 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-[10px] font-black uppercase tracking-widest h-8"
          onClick={() => navigate('/notifications')}
        >
          View All Notifications
        </Button>
      </div>
    </Card>
  );
}
