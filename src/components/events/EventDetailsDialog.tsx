import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, Loader2, Check } from 'lucide-react';
import { UpcomingEvent } from '@/hooks/use-events';
import { formatEventDate, formatEventTime, volunteerProgress } from '@/lib/event-format';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface EventDetailsDialogProps {
  event: UpcomingEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isRegistered: boolean;
  isPending: boolean;
  onJoin: () => void;
}

export function EventDetailsDialog({ event, open, onOpenChange, isRegistered, isPending, onJoin }: EventDetailsDialogProps) {
  const [organizerName, setOrganizerName] = useState<string | null>(null);
  const [organizerLoading, setOrganizerLoading] = useState(false);

  useEffect(() => {
    if (!open || !event || !supabase) {
      setOrganizerName(null);
      return;
    }
    let alive = true;
    setOrganizerLoading(true);
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', event.created_by)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) {
          setOrganizerName(data?.full_name || null);
          setOrganizerLoading(false);
        }
      });
    return () => { alive = false; };
  }, [open, event]);

  if (!event) return null;

  const progress = volunteerProgress(event.registered_count, event.max_volunteers);
  const isCompleted = event.status === 'completed';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative aspect-video w-full">
          {event.image_url ? (
            <img src={event.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-6xl">🌍</div>
          )}
          <Badge className="absolute top-4 left-4 bg-white/90 text-foreground border-none font-bold text-[10px]">
            {event.category}
          </Badge>
        </div>

        <div className="p-6 space-y-5">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-xl font-black leading-tight">{event.title}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">{event.description}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span>{formatEventDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>
                {formatEventTime(event.start_time)}
                {event.end_time ? ` – ${formatEventTime(event.end_time)}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{event.location_name}{event.location_address ? `, ${event.location_address}` : ''}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Volunteers</span>
              <span>{event.registered_count}{event.max_volunteers ? ` / ${event.max_volunteers}` : ''}</span>
            </div>
            {progress !== null && <Progress value={progress} className="h-2" />}
          </div>

          <div className="flex items-center gap-3 pt-1 border-t">
            <Avatar className="h-9 w-9 mt-4">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {(organizerName || 'E')[0]}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Organized by</p>
              <p className="text-sm font-semibold">
                {organizerLoading ? 'Loading...' : organizerName || 'ECHO Community Team'}
              </p>
            </div>
          </div>

          {!isCompleted && (
            <Button
              size="lg"
              className="w-full rounded-full gap-2 font-bold"
              variant={isRegistered ? 'outline' : 'default'}
              disabled={isPending}
              onClick={onJoin}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRegistered ? (
                <><Check className="h-4 w-4" /> You're Registered — Tap to Cancel</>
              ) : (
                'Join This Event'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
