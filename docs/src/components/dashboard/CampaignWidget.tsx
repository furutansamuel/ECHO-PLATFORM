import React from 'react';
import { Megaphone, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const campaigns = [
  { title: 'Green Lagos Initiative', participants: 234, goal: 500, emoji: '🌳' },
  { title: 'Clean Water for All', participants: 189, goal: 300, emoji: '🚰' },
  { title: 'Plastic-Free June', participants: 45, goal: 1000, emoji: '♻️' },
];

export const CampaignWidget: React.FC = () => (
  <Card className="border-none shadow-lg">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-bold flex items-center gap-2">
        <div className="p-1.5 bg-info/10 rounded-lg"><Megaphone className="h-4 w-4 text-info" /></div>
        Active Campaigns
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {campaigns.map((c, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <span>{c.emoji}</span>{c.title}
            </span>
            <span className="text-[10px] text-muted-foreground">{c.participants}/{c.goal}</span>
          </div>
          <Progress value={(c.participants / c.goal) * 100} className="h-1.5" />
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 border-t">
        <Badge className="bg-primary/10 text-primary border-none text-[9px]">3 active</Badge>
        <Button variant="ghost" size="sm" className="text-[10px] h-7">View All</Button>
      </div>
    </CardContent>
  </Card>
);
