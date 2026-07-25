import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Sparkles, Loader2, Check, ArrowRight } from 'lucide-react';
import { UpcomingEvent } from '@/hooks/use-events';
import { formatEventDate } from '@/lib/event-format';

interface FeaturedEventProps {
  event: UpcomingEvent;
  isRegistered: boolean;
  isPending: boolean;
  onJoin: () => void;
  onViewDetails: () => void;
}

export function FeaturedEvent({ event, isRegistered, isPending, onJoin, onViewDetails }: FeaturedEventProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto md:h-full min-h-[280px]">
            {event.image_url ? (
              <img src={event.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-7xl">🌍</div>
            )}
            <Badge className="absolute top-4 left-4 bg-primary text-white border-none font-bold gap-1.5 py-1.5 px-3">
              <Sparkles className="h-3.5 w-3.5" /> Featured Event
            </Badge>
          </div>

          <div className="p-8 flex flex-col justify-center">
            <Badge variant="outline" className="w-fit text-[10px] font-bold border-primary/20 text-primary mb-3">
              {event.category}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">{event.title}</h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3">{event.description}</p>

            <div className="space-y-2 mt-5 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">{formatEventDate(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{event.location_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {event.registered_count}{event.max_volunteers ? ` / ${event.max_volunteers}` : ''} volunteers joined
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <Button
                size="lg"
                className="rounded-full gap-2 font-bold flex-1 sm:flex-none"
                variant={isRegistered ? 'outline' : 'default'}
                disabled={isPending}
                onClick={onJoin}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isRegistered ? (
                  <><Check className="h-4 w-4" /> You're Registered</>
                ) : (
                  <>Join This Event <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full font-bold" onClick={onViewDetails}>
                Details
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
