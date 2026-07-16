import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/use-auth';
import { calculateProgressToNextLevel } from '@/lib/impact-constants';

export function RewardsSummaryWidget() {
  const navigate = useNavigate();
  const { userStats } = useAuth();

const points = userStats?.eco_points ?? 0;

const {
  currentLevel,
  nextLevel,
  progress,
  pointsToNext,
} = calculateProgressToNextLevel(points);

  return (
    <Card className="shadow-sm border-muted/20 overflow-hidden flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
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
            <span>0%</span>
          </div>
<Progress value={0} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest mb-1">Total Points</p>
            <p className="text-xl font-black text-purple-900 dark:text-purple-100">0</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
            <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest mb-1">Impact Rank</p>
            <p className="text-xl font-black text-green-900 dark:text-green-100">—</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-2 pb-4">
        <Button 
          variant="outline" 
          className="w-full text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-black uppercase tracking-widest text-[10px] h-8"
          onClick={() => navigate('/rewards')}
        >
          View Achievements
        </Button>
      </CardFooter>
    </Card>
  );
}
