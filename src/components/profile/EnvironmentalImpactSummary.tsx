import { memo } from 'react';
import { TrendingUp, Users, Calendar, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImpactStats {
  communitiesHelped: number;
  cleanupEventsJoined: number;
  volunteerHours: number;
  environmentalScore: number;
}

interface EnvironmentalImpactSummaryProps {
  stats: ImpactStats;
}

// Own component + own Card + React.memo: this section no longer re-renders
// (or repaints) when unrelated ProfilePage state changes — the Edit Profile
// modal opening, the level-progress bar animating, the avatar image
// finishing loading, etc. It only re-renders if `stats` itself changes.
// `contain: content` also tells the browser this box's layout/paint is
// independent of its surroundings, so nothing above or below it can visually
// bleed into it even during a reflow.
function EnvironmentalImpactSummaryBase({ stats }: EnvironmentalImpactSummaryProps) {
  const items = [
    {
      key: 'communitiesHelped',
      icon: Users,
      value: stats.communitiesHelped,
      label: 'Communities Helped',
      tone: 'bg-accent/5 border-accent/10 text-accent',
    },
    {
      key: 'cleanupEventsJoined',
      icon: Calendar,
      value: stats.cleanupEventsJoined,
      label: 'Cleanup Events',
      tone: 'bg-primary/5 border-primary/10 text-primary',
    },
    {
      key: 'volunteerHours',
      icon: Clock,
      value: `${stats.volunteerHours}h`,
      label: 'Volunteer Hours',
      tone: 'bg-accent/5 border-accent/10 text-accent',
    },
    {
      key: 'environmentalScore',
      icon: Target,
      value: stats.environmentalScore,
      label: 'Environmental Score',
      tone: 'bg-primary/5 border-primary/10 text-primary',
    },
  ];

  return (
    <Card className="border-muted/20 [contain:content]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Environmental Impact Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ key, icon: Icon, value, label, tone }) => (
            <div key={key} className={`p-4 rounded-xl border text-center ${tone}`}>
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <p className="text-2xl font-black">{value}</p>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const EnvironmentalImpactSummary = memo(EnvironmentalImpactSummaryBase);

