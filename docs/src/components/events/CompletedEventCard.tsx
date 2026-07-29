import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, MapPin, Users } from 'lucide-react';
import { UpcomingEvent } from '@/hooks/use-events';
import { formatEventDate } from '@/lib/event-format';

export function CompletedEventCard({ event }: { event: UpcomingEvent }) {
  return (
    <Card className="overflow-hidden border-none shadow-md opacity-80 hover:opacity-100 transition-opacity h-full flex flex-col grayscale-[30%] hover:grayscale-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center text-4xl">🌍</div>
        )}
        <Badge className="absolute top-3 left-3 bg-foreground/80 text-white border-none font-bold text-[10px] gap-1">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </Badge>
      </div>
      <div className="p-5 space-y-2 flex-1">
        <h3 className="font-bold text-sm leading-snug line-clamp-2">{event.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location_name}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.registered_count} volunteers</span>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide pt-1">
          Completed {formatEventDate(event.event_date)}
        </p>
      </div>
    </Card>
  );
}
