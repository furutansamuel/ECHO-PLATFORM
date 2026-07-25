import React, { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import CreatePost from '@/components/community/CreatePost';
import PostFeed from '@/components/community/PostFeed';
import { Users, Calendar, Heart, Award, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUpcomingEvents } from '@/hooks/use-events';
import { useEventRegistrations } from '@/hooks/use-event-registrations';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { calculateLevel } from '@/lib/impact-constants';

/** Sections without a real backing table yet — shown as an honest
 * "coming soon" placeholder instead of hardcoded demo content, so
 * testers don't file bugs against fake campaigns/challenges/awards. */
function ComingSoon({ label }: { label: string }) {
  return (
    <Card className="border-dashed border-2 shadow-none">
      <CardContent className="py-16 text-center space-y-3">
        <Sparkles className="h-8 w-8 text-primary/60 mx-auto" />
        <h3 className="font-bold">{label} are coming soon</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We're building this out for a future release. Check back soon, or explore
          Campaigns, Events, and the community Feed in the meantime.
        </p>
      </CardContent>
    </Card>
  );
}

interface LeaderRow {
  user_id: string;
  eco_points: number;
  total_reports: number;
  full_name: string;
}

interface WardLeader {
  ward: string;
  totalReports: number;
  resolvedReports: number;
  healthScore: number;
}

const CommunityInsights: React.FC = () => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [leaders, setLeaders] = useState<LeaderRow[]>([]);
  const [wardLeaders, setWardLeaders] = useState<WardLeader[]>([]);
  const [leadersLoading, setLeadersLoading] = useState(true);

  const { events: upcomingEvents, loading: upcomingLoading } = useUpcomingEvents();
  const { events: completedEvents, loading: completedLoading } = useUpcomingEvents(undefined, ['completed']);
  const { registeredIds, register, unregister, pendingId } = useEventRegistrations();

  const toggleLike = (id: string) => {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  useEffect(() => {
    if (!supabase) { setLeadersLoading(false); return; }
    let alive = true;

    (async () => {
      setLeadersLoading(true);

      const { data: statsRows } = await supabase
        .from('user_stats')
        .select('user_id, eco_points, total_reports')
        .order('eco_points', { ascending: false })
        .limit(10);

      if (alive && statsRows && statsRows.length > 0) {
        const userIds = statsRows.map((r: any) => r.user_id);
        const { data: profileRows } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);
        const nameMap = new Map((profileRows || []).map((p: any) => [p.id, p.full_name]));
        setLeaders(
          statsRows.map((r: any) => ({
            user_id: r.user_id,
            eco_points: r.eco_points,
            total_reports: r.total_reports,
            full_name: nameMap.get(r.user_id) || 'ECHO Citizen',
          }))
        );
      } else if (alive) {
        setLeaders([]);
      }

      // Ward "health score" derived from the actual resolution rate of
      // reports filed in that ward — a real, computed metric rather than
      // a stored/fabricated score.
      const { data: reportRows } = await supabase
        .from('hazard_reports')
        .select('status, location');

      if (alive && reportRows) {
        const byWard = new Map<string, { total: number; resolved: number }>();
        for (const r of reportRows as any[]) {
          const ward = r.location?.ward || r.location?.lga;
          if (!ward) continue;
          const entry = byWard.get(ward) || { total: 0, resolved: 0 };
          entry.total += 1;
          if (r.status === 'Resolved' || r.status === 'Closed') entry.resolved += 1;
          byWard.set(ward, entry);
        }
        const ranked = Array.from(byWard.entries())
          .map(([ward, v]) => ({
            ward,
            totalReports: v.total,
            resolvedReports: v.resolved,
            healthScore: v.total > 0 ? Math.round((v.resolved / v.total) * 100) : 0,
          }))
          .sort((a, b) => b.totalReports - a.totalReports)
          .slice(0, 5);
        setWardLeaders(ranked);
      }

      if (alive) setLeadersLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Community Hub
          </h1>
          <p className="text-muted-foreground italic mt-1">
            Campaigns, volunteering, challenges & recognition
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> {leaders.length > 0 ? `${leaders.length}+ Active Reporters` : 'Growing Community'}</span>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-full border border-border/50 flex-wrap h-auto">
          <TabsTrigger value="campaigns" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Campaigns</TabsTrigger>
          <TabsTrigger value="challenges" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Leaderboard</TabsTrigger>
          <TabsTrigger value="feed" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Feed</TabsTrigger>
          <TabsTrigger value="events" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Events</TabsTrigger>
          <TabsTrigger value="recognition" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Recognition</TabsTrigger>
        </TabsList>

        {/* CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="m-0 space-y-8">
          <ComingSoon label="Community campaigns" />
        </TabsContent>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="m-0">
          <ComingSoon label="Community challenges" />
        </TabsContent>

        {/* LEADERBOARD TAB */}
        <TabsContent value="leaderboard" className="m-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Individual Leaders
            </h3>
            <Card className="border-none shadow-lg overflow-hidden">
              {leadersLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : leaders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">No reports submitted yet — be the first on the board.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="font-black uppercase text-[10px]">Rank</TableHead>
                      <TableHead className="font-black uppercase text-[10px]">Name</TableHead>
                      <TableHead className="font-black uppercase text-[10px]">Level</TableHead>
                      <TableHead className="font-black uppercase text-[10px] text-right">Points</TableHead>
                      <TableHead className="font-black uppercase text-[10px] text-right">Reports</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaders.map((entry, i) => {
                      const level = calculateLevel(entry.eco_points);
                      const isYou = user && entry.user_id === user.id;
                      return (
                        <TableRow key={entry.user_id} className={isYou ? 'bg-primary/10 font-bold' : ''}>
                          <TableCell>#{i + 1}</TableCell>
                          <TableCell className="font-bold">{isYou ? 'You' : entry.full_name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[9px] border-primary/20 text-primary">{level.emoji} {level.name}</Badge></TableCell>
                          <TableCell className="text-right font-black text-primary">{entry.eco_points.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{entry.total_reports}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Community Leaders
            </h3>
            <Card className="border-none shadow-lg overflow-hidden">
              {leadersLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : wardLeaders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">Not enough reported data yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="font-black uppercase text-[10px]">Rank</TableHead>
                      <TableHead className="font-black uppercase text-[10px]">Community</TableHead>
                      <TableHead className="font-black uppercase text-[10px] text-right">Health Score</TableHead>
                      <TableHead className="font-black uppercase text-[10px] text-right">Reports</TableHead>
                      <TableHead className="font-black uppercase text-[10px] text-right">Resolved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wardLeaders.map((leader, i) => (
                      <TableRow key={leader.ward}>
                        <TableCell>#{i + 1}</TableCell>
                        <TableCell className="font-bold">{leader.ward}</TableCell>
                        <TableCell className="text-right"><Badge className="bg-primary/10 text-primary border-none">{leader.healthScore}%</Badge></TableCell>
                        <TableCell className="text-right font-bold">{leader.totalReports.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{leader.resolvedReports}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* FEED TAB */}
        <TabsContent value="feed" className="m-0 space-y-6">
          <PostFeed />

          {user ? (
            <CreatePost />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  Sign in to share environmental reports and community updates.
                </p>
                <Button asChild>
                  <Link to="/auth/login">Sign In</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* RECOGNITION TAB */}
        <TabsContent value="recognition" className="m-0">
          <ComingSoon label="Community recognition & awards" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityInsights;
