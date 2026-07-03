import React from 'react';
import { Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const challenges = [
  { title: 'Plant 100 Trees', progress: 73, goal: 100, time: '12 days', emoji: '🌱' },
  { title: 'Clean Your Street', progress: 38, goal: 50, time: '8 days', emoji: '🧹' },
  { title: 'Recycling Week', progress: 156, goal: 200, time: '3 days', emoji: '♻️' },
];

export const ChallengeWidget: React.FC = () => (
  <Card className="border-none shadow-lg">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-bold flex items-center gap-2">
        <div className="p-1.5 bg-purple-500/10 rounded-lg"><Target className="h-4 w-4 text-purple-600" /></div>
        Active Challenges
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {challenges.map((c, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <span>{c.emoji}</span>{c.title}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{c.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={(c.progress / c.goal) * 100} className="h-1.5 flex-grow" />
            <span className="text-[10px] font-bold text-primary">{Math.round((c.progress / c.goal) * 100)}%</span>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 border-t">
        <Badge className="bg-purple-500/10 text-purple-700 border-none text-[9px]">3 active</Badge>
        <Button variant="ghost" size="sm" className="text-[10px] h-7">View All</Button>
      </div>
    </CardContent>
  </Card>
);
