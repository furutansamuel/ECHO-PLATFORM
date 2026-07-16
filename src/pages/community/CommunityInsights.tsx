import React, { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import CreatePost from '@/components/community/CreatePost';
import PostFeed from '@/components/community/PostFeed';
import { Users, MapPin, Calendar, Bookmark, Share2, Heart, TrendingUp, Award, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_CAMPAIGNS, MOCK_VOLUNTEERS, MOCK_LEADERBOARD, MOCK_COMMUNITY_LEADERS, MOCK_CHALLENGES, MOCK_RECOGNITION, MOCK_FEED, MOCK_EVENTS } from '@/lib/community-data';

const CommunityInsights: React.FC = () => {
  const { user } = useAuth();
  const [joinedCampaigns, setJoinedCampaigns] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [bookmarkedCampaigns, setBookmarkedCampaigns] = useState<string[]>([]);

  const toggleJoinCampaign = (id: string) => {
    setJoinedCampaigns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleRegister = (id: string) => {
    setRegisteredEvents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleJoinChallenge = (id: string) => {
    setJoinedChallenges(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleLike = (id: string) => {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleBookmark = (id: string) => {
    setBookmarkedCampaigns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const activeCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'active');
  const upcomingCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'upcoming');
  const completedCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'completed');
  const upcomingEvents = MOCK_EVENTS.filter(e => !e.completed);
  const completedEvents = MOCK_EVENTS.filter(e => e.completed);
  const featuredEvents = MOCK_EVENTS.filter(e => e.featured);

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
          <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4 text-primary" /> +12% Engagement</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> 2.4k Volunteers</span>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-full border border-border/50 flex-wrap h-auto">
          <TabsTrigger value="campaigns" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Campaigns</TabsTrigger>
          <TabsTrigger value="volunteers" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Volunteers</TabsTrigger>
          <TabsTrigger value="challenges" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Leaderboard</TabsTrigger>
          <TabsTrigger value="feed" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Feed</TabsTrigger>
          <TabsTrigger value="events" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Events</TabsTrigger>
          <TabsTrigger value="recognition" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Recognition</TabsTrigger>
        </TabsList>

        {/* CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="m-0 space-y-8">
          {['active', 'upcoming', 'completed'].map(status => {
            const items = status === 'active' ? activeCampaigns : status === 'upcoming' ? upcomingCampaigns : completedCampaigns;
            if (items.length === 0) return null;
            return (
              <div key={status}>
                <h3 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${status === 'active' ? 'bg-green-500' : status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                  {status.charAt(0).toUpperCase() + status.slice(1)} Campaigns
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(campaign => (
                    <Card key={campaign.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all group flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black">{campaign.category}</Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => toggleBookmark(campaign.id)}>
                              <Bookmark className={`h-3.5 w-3.5 ${bookmarkedCampaigns.includes(campaign.id) ? 'fill-primary text-primary' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                              <Share2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="text-xl">{campaign.emoji}</span>
                          {campaign.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground line-clamp-2">{campaign.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3 flex-grow">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{campaign.location}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{campaign.participants}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span>{campaign.participants}/{campaign.maxParticipants}</span>
                            <span>{Math.round((campaign.participants / campaign.maxParticipants) * 100)}%</span>
                          </div>
                          <Progress value={(campaign.participants / campaign.maxParticipants) * 100} className="h-1.5" />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Organizer: <span className="font-bold">{campaign.organizer}</span></p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        {status !== 'completed' ? (
                          {user ? (
<Button
  size="sm"
  className="w-full rounded-full gap-2"
  variant={joinedCampaigns.includes(campaign.id) ? "outline" : "default"}
  onClick={() => toggleJoinCampaign(campaign.id)}
>
  {joinedCampaigns.includes(campaign.id)
    ? "✓ Joined"
    : "Join Campaign"}
</Button>
) : (
<Button asChild className="w-full rounded-full">
  <Link to="/login">Sign in to Join</Link>
</Button>
)}
                            {joinedCampaigns.includes(campaign.id) ? '✓ Joined' : 'Join Campaign'}
                          </Button>
                        ) : (
                          <Badge className="w-full justify-center bg-gray-100 text-gray-600 border-none">Completed</Badge>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* VOLUNTEERS TAB */}
        <TabsContent value="volunteers" className="m-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_VOLUNTEERS.map(activity => (
              <Card key={activity.id} className="border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-2xl">
                      {activity.emoji}
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">{activity.title}</h4>
                        <Badge variant="outline" className="text-[9px] uppercase border-primary/20 text-primary">{activity.type.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{activity.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{activity.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{activity.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{activity.participants}/{activity.maxParticipants}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        {user ? (
<Button
  size="sm"
  className="w-full rounded-full gap-2"
  variant={joinedCampaigns.includes(campaign.id) ? "outline" : "default"}
  onClick={() => toggleJoinCampaign(campaign.id)}
>
  {joinedCampaigns.includes(campaign.id)
    ? "✓ Joined"
    : "Join Campaign"}
</Button>
) : (
<Button asChild className="w-full rounded-full">
  <Link to="/login">Sign in to Join</Link>
</Button>
)}
                          {registeredEvents.includes(activity.id) ? '✓ Registered' : 'Register'}
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full gap-1 text-xs">
                          <Calendar className="h-3 w-3" /> Add to Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_CHALLENGES.map(challenge => (
              <Card key={challenge.id} className="border-none shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{challenge.emoji}</span>
                      <div>
                        <h4 className="font-bold">{challenge.title}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Reward: {challenge.rewardBadge}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary flex items-center gap-1"><Clock className="h-3 w-3" />{challenge.timeRemaining}</p>
                      <p className="text-[10px] text-muted-foreground">{challenge.participants} participants</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span>Progress: {challenge.progress}/{challenge.goal}</span>
                      <span>{Math.round((challenge.progress / challenge.goal) * 100)}%</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.goal) * 100} className="h-2" />
                  </div>
                  {user ? (
<Button
  size="sm"
  className="w-full rounded-full gap-2"
  variant={joinedCampaigns.includes(campaign.id) ? "outline" : "default"}
  onClick={() => toggleJoinCampaign(campaign.id)}
>
  {joinedCampaigns.includes(campaign.id)
    ? "✓ Joined"
    : "Join Campaign"}
</Button>
) : (
<Button asChild className="w-full rounded-full">
  <Link to="/login">Sign in to Join</Link>
</Button>
)}
                    {joinedChallenges.includes(challenge.id) ? '✓ Joined Challenge' : 'Join Challenge'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* LEADERBOARD TAB */}
        <TabsContent value="leaderboard" className="m-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Individual Leaders
            </h3>
            <Card className="border-none shadow-lg overflow-hidden">
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
                  {MOCK_LEADERBOARD.map(entry => (
                    <TableRow key={entry.rank} className={entry.name === 'You' ? 'bg-primary/10 font-bold' : ''}>
                      <TableCell><span className="text-lg">{entry.emoji}</span> #{entry.rank}</TableCell>
                      <TableCell className="font-bold">{entry.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[9px] border-primary/20 text-primary">{entry.impactLevel}</Badge></TableCell>
                      <TableCell className="text-right font-black text-primary">{entry.impactPoints.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{entry.reportsSubmitted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Community Leaders
            </h3>
            <Card className="border-none shadow-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    <TableHead className="font-black uppercase text-[10px]">Rank</TableHead>
                    <TableHead className="font-black uppercase text-[10px]">Community</TableHead>
                    <TableHead className="font-black uppercase text-[10px] text-right">Health Score</TableHead>
                    <TableHead className="font-black uppercase text-[10px] text-right">Reports</TableHead>
                    <TableHead className="font-black uppercase text-[10px] text-right">Cleanups</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_COMMUNITY_LEADERS.map(leader => (
                    <TableRow key={leader.rank}>
                      <TableCell><span className="text-lg">{leader.emoji}</span> #{leader.rank}</TableCell>
                      <TableCell className="font-bold">{leader.name}</TableCell>
                      <TableCell className="text-right"><Badge className="bg-primary/10 text-primary border-none">{leader.healthScore}%</Badge></TableCell>
                      <TableCell className="text-right font-bold">{leader.totalReports.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{leader.cleanupActivities}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        <Link to="/login">Sign In</Link>
      </Button>
    </CardContent>
  </Card>
)}
        </TabsContent>

        {/* EVENTS TAB */}
        <TabsContent value="events" className="m-0 space-y-8">
          {featuredEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" /> Featured Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredEvents.map(event => (
                  <Card key={event.id} className="border-none shadow-lg overflow-hidden bg-gradient-to-br from-primary/5 to-card">
                    <CardContent className="p-6 space-y-3">
                      <span className="text-3xl">{event.emoji}</span>
                      <h4 className="font-bold">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                      <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{event.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                      </div>
                      {user ? (
<Button
size="sm"
className="w-full rounded-full"
variant={registeredEvents.includes(event.id) ? "outline" : "default"}
onClick={() => toggleRegister(event.id)}
>
{registeredEvents.includes(event.id)
? "✓ Registered"
: "Register"}
</Button>
) : (
<Button asChild className="w-full rounded-full">
<Link to="/login">Sign in to Register</Link>
</Button>
)}
                        {registeredEvents.includes(event.id) ? '✓ Registered' : 'Register'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <Card key={event.id} className="border-none shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <span className="text-2xl">{event.emoji}</span>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm">{event.title}</h4>
                        <p className="text-[10px] text-muted-foreground">{event.date} • {event.location}</p>
                      </div>

                      {user ? (
<Button
size="sm"
className="w-full rounded-full"
variant={registeredEvents.includes(event.id) ? "outline" : "default"}
onClick={() => toggleRegister(event.id)}
>
{registeredEvents.includes(event.id)
? "✓ Registered"
: "Register"}
</Button>
) : (
<Button asChild className="w-full rounded-full">
<Link to="/login">Sign in to Register</Link>
</Button>
)}
                        {registeredEvents.includes(event.id) ? '✓' : 'Join'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Completed Events</h3>
              <div className="space-y-3">
                {completedEvents.map(event => (
                  <Card key={event.id} className="border-none shadow-sm opacity-75">
                    <CardContent className="p-4 flex items-center gap-4">
                      <span className="text-2xl">{event.emoji}</span>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm">{event.title}</h4>
                        <p className="text-[10px] text-muted-foreground">{event.date} • {event.participants} participants</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-600 border-none text-[9px]">Done</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* RECOGNITION TAB */}
        <TabsContent value="recognition" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_RECOGNITION.map(item => (
              <Card key={item.id} className="border-none shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gradient-to-br from-card to-primary/5">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{item.emoji}</span>
                    <Badge variant="outline" className="text-[9px] uppercase border-primary/20 text-primary">{item.category}</Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-primary font-bold mt-1">{item.recipient}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <p className="text-[10px] text-muted-foreground italic">{item.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityInsights;
