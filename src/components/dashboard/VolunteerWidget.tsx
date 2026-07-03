import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const upcoming = [
  { title: 'Beach Cleanup', date: 'Feb 15', location: 'Victoria Beach', emoji: '🧹' },
  { title: 'Tree Planting', date: 'Feb 20', location: 'Centenary Park', emoji: '🌱' },
  { title: 'Recycling Drive', date: 'Feb 22', location: 'Community Hall', emoji: '♻️' },
];

export const VolunteerWidget: React.FC = () => (
  <Card className="border-none shadow-lg">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-bold flex items-center gap-2">
        <div className="p-1.5 bg-green-500/10 rounded-lg"><Calendar className="h-4 w-4 text-green-600" /></div>
        Upcoming Volunteer Events
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {upcoming.map((e, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <span className="text-xl">{e.emoji}</span>
          <div className="flex-grow">
            <p className="text-xs font-bold">{e.title}</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />{e.date} • <MapPin className="h-2.5 w-2.5" />{e.location}
            </p>
          </div>
          <Button size="sm" variant="outline" className="rounded-full text-[10px] h-7">Join</Button>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 border-t">
        <Badge className="bg-green-500/10 text-green-700 border-none text-[9px]">3 events this week</Badge>
        <Button variant="ghost" size="sm" className="text-[10px] h-7">View All</Button>
      </div>
    </CardContent>
  </Card>
);
