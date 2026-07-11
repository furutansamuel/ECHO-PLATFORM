import { memo, useState } from 'react';
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Badge {
  id: string | number;
  emoji: string;
  name: string;
  earned?: boolean;
}

interface AchievementBadgesProps {
  badges: Badge[];
}

// Same pattern as FeatureCard in CoreFeatures.tsx: "hovered" look driven by
// real mouse events only (no touch handlers), so it can't stick/bounce on
// touch devices — tapping a badge just does nothing extra, no visual glitch.
function BadgeCard({ badge }: { badge: Badge }) {
  const [active, setActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center gap-2 transition-all transform-gpu ${
        active ? 'shadow-md' : ''
      }`}
    >
      <div className="text-4xl">{badge.emoji}</div>
      <span className="text-[10px] font-black uppercase text-center">{badge.name}</span>
    </div>
  );
}

function AchievementBadgesBase({ badges }: AchievementBadgesProps) {
  return (
    <Card className="border-muted/20 [contain:content]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Achievement Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const AchievementBadges = memo(AchievementBadgesBase);

