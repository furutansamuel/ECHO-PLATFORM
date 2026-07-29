import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Award, 
  Clock,
  Trash2,
  MoreVertical,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export type NotificationType = 
  | 'report_submitted' 
  | 'verification_started' 
  | 'verification_completed' 
  | 'status_updated' 
  | 'eco_points_awarded' 
  | 'community_alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  related_id?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  'report_submitted': { icon: Info, color: 'text-info', bg: 'bg-info-subtle' },
  'verification_started': { icon: Clock, color: 'text-warning', bg: 'bg-warning-subtle' },
  'verification_completed': { icon: ShieldCheck, color: 'text-success', bg: 'bg-success-subtle' },
  'status_updated': { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
  'eco_points_awarded': { icon: Award, color: 'text-highlight', bg: 'bg-highlight/10' },
  'community_alert': { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/5' },
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkRead, 
  onDelete 
}) => {
  const config = typeConfig[notification.type] || typeConfig['community_alert'];

  return (
    <div className={cn(
      "group relative flex gap-4 p-4 transition-all duration-200 border-b",
      notification.is_read ? "bg-background opacity-75" : "bg-primary/5 hover:bg-primary/10"
    )}>
      {!notification.is_read && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2">
          <Circle className="w-2 h-2 fill-primary text-primary" />
        </div>
      )}
      
      <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center", config.bg)}>
        <config.icon className={cn("w-5 h-5", config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn("text-sm font-semibold truncate", !notification.is_read && "text-primary")}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5">
            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {notification.message}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {new Date(notification.timestamp).toLocaleDateString()}
          </span>
          {!notification.is_read && (
            <button 
              onClick={() => onMarkRead(notification.id)}
              className="text-[10px] font-bold text-primary hover:underline"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!notification.is_read && (
              <DropdownMenuItem onClick={() => onMarkRead(notification.id)}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(notification.id)} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete notification
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
