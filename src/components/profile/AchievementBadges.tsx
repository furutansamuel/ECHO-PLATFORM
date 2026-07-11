import { memo } from 'react';
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
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center gap-2 hover:shadow-md transition-all"
            >
              <div className="text-4xl">{badge.emoji}</div>
              <span className="text-[10px] font-black uppercase text-center">{badge.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const AchievementBadges = memo(AchievementBadgesBase);

