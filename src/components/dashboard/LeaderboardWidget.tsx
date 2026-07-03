import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const leaders = [
  { name: 'Amara Okafor', points: 4520, emoji: '🌍' },
  { name: 'Chidi Eze', points: 3890, emoji: '🌎' },
  { name: 'Fatima Bello', points: 3450, emoji: '🌳' },
  { name: 'You', points: 1250, emoji: '🌿', isYou: true },
];

export const LeaderboardWidget: React.FC = () => (
  <Card className="border-none shadow-lg">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-bold flex items-center gap-2">
        <div className="p-1.5 bg-yellow-500/10 rounded-lg"><Trophy className="h-4 w-4 text-yellow-600" /></div>
        Leaderboard
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {leaders.map((l, i) => (
        <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${l.isYou ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'} transition-colors`}>
          <span className="text-lg">{l.emoji}</span>
          <span className={`flex-grow text-xs ${l.isYou ? 'font-black text-primary' : 'font-medium'}`}>{l.name}</span>
          <span className="text-[10px] font-bold text-primary">{l.points.toLocaleString()}</span>
          <Badge variant="outline" className="text-[8px] border-primary/20 text-primary">#{i + 1}</Badge>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-primary" />Your rank: #4</span>
      </div>
    </CardContent>
  </Card>
);
