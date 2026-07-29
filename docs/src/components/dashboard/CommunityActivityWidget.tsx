import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const activities = [
  { text: 'Beach cleanup completed', time: '2h ago', emoji: '🧹' },
  { text: 'New campaign launched', time: '5h ago', emoji: '📢' },
  { text: '50 trees planted', time: '1d ago', emoji: '🌱' },
  { text: 'Community meeting scheduled', time: '2d ago', emoji: '🤝' },
];

export const CommunityActivityWidget: React.FC = () => (
  <Card className="border-none shadow-lg">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-bold flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 rounded-lg"><Users className="h-4 w-4 text-primary" /></div>
        Community Activity
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {activities.map((a, i) => (
        <div key={i} className="flex items-center gap-3 text-xs">
          <span className="text-lg">{a.emoji}</span>
          <span className="flex-grow font-medium">{a.text}</span>
          <span className="text-muted-foreground text-[10px]">{a.time}</span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-primary" />+12% this week</span>
        <Badge className="bg-primary/10 text-primary border-none text-[9px]">2.4k active</Badge>
      </div>
    </CardContent>
  </Card>
);
