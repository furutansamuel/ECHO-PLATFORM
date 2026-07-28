import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { calculateProgressToNextLevel } from '@/lib/impact-constants';

export function RewardsSummaryWidget() {
  const navigate = useNavigate();
  const { user, userStats } = useAuth();
  const [rank, setRank] = useState<number | null>(null);

const points = userStats?.eco_points ?? 0;

const {
  currentLevel,
  nextLevel,
  progress,
  pointsToNext,
} = calculateProgressToNextLevel(points);

  useEffect(() => {
    if (!user || !supabase) return;
    let alive = true;

    // user_stats.community_rank is never populated by any trigger/RPC —
    // compute rank live instead of reading a column that's always null.
    (async () => {
      const { count } = await supabase
        .from('user_stats')
        .select('user_id', { count: 'exact', head: true })
        .gt('eco_points', points);
      if (alive && typeof count === 'number') setRank(count + 1);
    })();

    return () => { alive = false; };
  }, [user, points]);

  return (
    <Card className="shadow-sm border-muted/20 overflow-hidden flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Icons.award className="h-5 w-5" />
          <span>Impact Center</span>
        </CardTitle>
        <CardDescription>
  {nextLevel
    ? `${pointsToNext} points away from ${nextLevel.name}`
    : 'Highest level reached'}
</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progress to Next Level</span>
            <span>{progress}%</span>
          </div>
<Progress value={progress} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/10 dark:border-primary/20">
            <p className="text-[10px] text-primary/80 font-black uppercase tracking-widest mb-1">Total Points</p>
            <p className="text-xl font-black text-primary">{points.toLocaleString()}</p>
          </div>
          <div className="bg-secondary/5 dark:bg-secondary/10 p-3 rounded-lg border border-secondary/10 dark:border-secondary/20">
            <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Impact Rank</p>
            <p className="text-xl font-black text-secondary">
              {rank ? `#${rank}` : '—'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-2 pb-4">
        <Button 
          variant="outline" 
          className="w-full font-black uppercase tracking-widest text-[10px] h-8"
          onClick={() => navigate('/rewards')}
        >
          View Achievements
        </Button>
      </CardFooter>
    </Card>
  );
}
