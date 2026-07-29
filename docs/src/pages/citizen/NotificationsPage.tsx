import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { ClipboardList, BrainCircuit, AlertTriangle, Calendar, Award, Trash2, BellOff, CheckCheck } from 'lucide-react';

const TYPE_CONFIG: Record<Notification['type'], { icon: React.ElementType; gradient: string; label: string }> = {
  report: { icon: ClipboardList, gradient: 'gradient-primary', label: 'Status' },
  ai: { icon: BrainCircuit, gradient: 'gradient-ai', label: 'AI Insight' },
  alert: { icon: AlertTriangle, gradient: 'gradient-warning', label: 'Alert' },
  event: { icon: Calendar, gradient: 'gradient-analytics', label: 'Event' },
  reward: { icon: Award, gradient: 'gradient-success', label: 'Achievement' },
};

const timeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your reports and community events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-bold">{unreadCount} Unread</Badge>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-1.5">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <BellOff className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">You're all caught up — no notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.alert;
            return (
              <Card
                key={notification.id}
                className={`card-premium overflow-hidden cursor-pointer group ${notification.is_read ? 'opacity-70' : 'border-primary/20'}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className={`icon-badge ${config.gradient} h-11 w-11 shrink-0`}>
                    <config.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        <Badge variant="secondary" className="text-[9px] font-bold uppercase h-4 px-1.5">
                          {config.label}
                        </Badge>
                        {!notification.is_read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(notification.created_at)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
