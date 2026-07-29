import { CalendarCheck2, Users, PartyPopper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCountUp } from '@/hooks/use-count-up';
import { motion } from 'framer-motion';

interface StatisticsCardsProps {
  upcomingCount: number;
  registeredVolunteers: number;
  completedCount: number;
}

function StatCard({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  delay: number;
}) {
  const animated = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-none shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="text-3xl font-black tabular-nums leading-none">{animated.toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1.5">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatisticsCards({ upcomingCount, registeredVolunteers, completedCount }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard icon={CalendarCheck2} value={upcomingCount} label="Upcoming Events" delay={0} />
      <StatCard icon={Users} value={registeredVolunteers} label="Registered Volunteers" delay={0.1} />
      <StatCard icon={PartyPopper} value={completedCount} label="Completed Events" delay={0.2} />
    </div>
  );
}
