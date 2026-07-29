import React from 'react';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CountUp } from '@/components/ui/count-up';
import { Badge } from '@/components/ui/badge';

interface PointsBalanceProps {
  balance: number;
  level: number;
  levelName: string;
  pointsToNextLevel: number;
  nextLevelProgress: number;
  totalContributions: number;
}

export const PointsBalance: React.FC<PointsBalanceProps> = ({
  balance,
  level,
  levelName,
  pointsToNextLevel,
  nextLevelProgress,
  totalContributions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="col-span-1 bg-primary text-primary-foreground overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <Trophy size={120} />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
            <Star className="w-4 h-4" />
            Impact Points Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            <CountUp start={0} end={balance} duration={2} />
          </div>
          <p className="text-xs mt-1 opacity-80">
            You've earned {balance} points this month
          </p>
          <div className="mt-6 flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              Top 5%
            </div>
            <div className="text-[10px] opacity-80">
              Community Contributor
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Progress to Level {level + 1}
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {levelName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium">Level {level}</span>
              <span className="text-muted-foreground">{pointsToNextLevel} points to Level {level + 1}</span>
            </div>
            <Progress value={nextLevelProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1 text-center border-r">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Reports</p>
              <p className="text-xl font-bold text-primary">{totalContributions}</p>
            </div>
            <div className="space-y-1 text-center border-r">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Verified</p>
              <p className="text-xl font-bold text-success">{Math.floor(totalContributions * 0.8)}</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Streaks</p>
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-highlight fill-highlight" />
                <span className="text-xl font-bold text-highlight">12</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
