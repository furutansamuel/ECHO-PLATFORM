import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, Users, Loader2, Check } from 'lucide-react';
import { UpcomingEvent } from '@/hooks/use-events';
import { formatEventDate, volunteerProgress } from '@/lib/event-format';

const CATEGORY_ICON: Record<string, string> = {
  Cleanup: '🧹',
  'Tree Planting': '🌳',
  Workshop: '📚',
  'Awareness Campaign': '📣',
  Other: '🌍',
};

interface EventCardProps {
  event: UpcomingEvent;
  isRegistered: boolean;
  isPending: boolean;
  onJoin: () => void;
  onViewDetails: () => void;
}

export function EventCard({ event, isRegistered, isPending, onJoin, onViewDetails }: EventCardProps) {
  const progress = volunteerProgress(event.registered_count, event.max_volunteers);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group h-full flex flex-col">
        <button
          onClick={onViewDetails}
          className="relative aspect-[4/3] w-full overflow-hidden text-left"
          aria-label={`View details for ${event.title}`}
        >
          {event.image_url ? (
            <img
              src={event.image_url}
              alt=""
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-5xl">
              {CATEGORY_ICON[event.category] || '🌍'}
            </div>
          )}
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground border-none font-bold text-[10px] backdrop-blur-sm">
            {CATEGORY_ICON[event.category]} {event.category}
          </Badge>
        </button>

        <div className="p-5 flex flex-col flex-1 gap-3">
          <h3 className="font-bold text-base leading-snug line-clamp-2">{event.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>

          <div className="space-y-1.5 text-xs text-muted-foreground mt-auto pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{formatEventDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.location_name}</span>
            </div>
          </div>

          {progress !== null ? (
            <div className="space-y-1">
              <Progress value={progress} className="h-1.5" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                {event.registered_count}/{event.max_volunteers} volunteers
              </p>
            </div>
          ) : (
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Users className="h-3 w-3" /> {event.registered_count} signed up
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" className="flex-1 rounded-full text-xs" onClick={onViewDetails}>
              View Details
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-full text-xs gap-1"
              variant={isRegistered ? 'outline' : 'default'}
              disabled={isPending}
              onClick={onJoin}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isRegistered ? (
                <><Check className="h-3.5 w-3.5" /> Registered</>
              ) : (
                'Join Event'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
