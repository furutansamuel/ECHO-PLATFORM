import EditProfileModal from "@/components/profile/EditProfileModal";
import { useState } from "react";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { Shield, Award, Settings, LogOut, Mail, Edit3, FileText, CheckCircle, Users, Calendar, BookOpen, Clock, TrendingUp, Target, Heart, Zap, Megaphone } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  MOCK_IMPACT_POINTS, 
  MOCK_IMPACT_STATS, 
  MOCK_POINT_HISTORY,
  ACHIEVEMENT_BADGES,
  calculateProgressToNextLevel 
} from '@/lib/impact-constants';
import { MOCK_CAMPAIGNS, MOCK_VOLUNTEERS } from '@/lib/community-data';

const ProfilePage: React.FC = () => {
  const { user, profile, logout, userStats, loading, refreshProfile } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const isDemo =
  sessionStorage.getItem('echo_demo_mode') === 'true';

const impactPoints =
  isDemo
    ? MOCK_IMPACT_POINTS
    : userStats?.eco_points ?? 0;

const impactStats =
  isDemo
    ? MOCK_IMPACT_STATS
    : userStats;

const badges =
  userStats?.badges ??
  (isDemo ? ACHIEVEMENT_BADGES : []);

const pointHistory =
  userStats?.point_history ??
  (isDemo ? MOCK_POINT_HISTORY : []);

  if (user && !isDemo && loading) {
  return <ProfileSkeleton />;
}

const {
  currentLevel,
  nextLevel,
  progress,
  pointsToNext,
} = calculateProgressToNextLevel(impactPoints);

const earnedBadges = badges.filter((b: any) => b.earned);

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto pb-20">
      {/* Profile Header */}
      <Card className="border-none shadow-2xl overflow-hidden">
        <div className="h-28 sm:h-32 md:h-40 bg-gradient-to-r from-primary via-secondary to-accent" />
        <CardContent className="relative px-4 pt-0 sm:px-6 md:px-8">
          <div className="flex flex-col items-center gap-4 -mt-14 mb-8 text-center md:flex-row md:items-end md:gap-6 md:text-left">
            <Avatar className="h-24 w-24 border-4 border-background shadow-2xl sm:h-28 sm:w-28 md:h-32 md:w-32">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-black md:text-4xl">
                {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'JD'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow space-y-1 md:pb-2">
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{profile?.full_name || 'Guest User'}</h1>
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black tracking-widest">
                  {profile?.role || 'Citizen'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 md:justify-start">
                <Mail className="h-3 w-3" />
                {user?.email || 'No email provided'}
              </p>
            </div>
            <Button variant="outline" className="rounded-full gap-2 border-primary/20 md:pb-2" onClick={() => setEditOpen(true)}>
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Impact Level & Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="premium-shadow border-none bg-primary/5 text-center p-4">
              <p className="text-xs font-bold uppercase text-muted-foreground">Impact Points</p>
             <h3 className="text-3xl font-black text-primary"> {impactPoints.toLocaleString()}</h3>
              <p className="text-[10px] italic text-muted-foreground mt-1">{currentLevel.emoji} {currentLevel.name}</p>
            </Card>
            <Card className="premium-shadow border-none bg-secondary/5 text-center p-4">
              <p className="text-xs font-bold uppercase text-muted-foreground">Reports</p>
              <h3 className="text-3xl font-black text-secondary">
  {impactStats.reportsSubmitted}
</h3>

<p className="text-[10px] italic text-muted-foreground mt-1">
  {impactStats.verifiedReports} Verified
</p>
            </Card>
            <Card className="premium-shadow border-none bg-accent/5 text-center p-4">
              <p className="text-xs font-bold uppercase text-muted-foreground">Community Rank</p>
              <h3 className="text-3xl font-black text-accent">
  {user && userStats?.community_rank
    ? `#${userStats.community_rank}`
    : isDemo
    ? '#42'
    : 'N/A'}
</h3>

<p className="text-[10px] italic text-muted-foreground mt-1">
  {userStats?.community_rank_percentile
    ? `Top ${userStats.community_rank_percentile}%`
    : isDemo
    ? 'Top 5%'
    : ''}
</p>
            </Card>
          </div>

          {/* Level Progress */}
          <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentLevel.emoji}</span>
                <div>
                  <h3 className="font-black text-lg">{currentLevel.name}</h3>
                  <p className="text-xs text-muted-foreground">{currentLevel.description}</p>
                </div>
              </div>
              {nextLevel && (
                <div className="text-right">
                  <p className="text-xs font-bold text-muted-foreground">Next Level</p>
                  <p className="font-black text-primary">{nextLevel.emoji} {nextLevel.name}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold">Progress</span>
                <span className="font-black text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              {nextLevel && (
                <p className="text-xs text-muted-foreground italic">
                  {pointsToNext} more points to reach {nextLevel.emoji} {nextLevel.name}
                </p>
              )}
            </div>
          </div>

          {/* Environmental Impact Summary */}
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Environmental Impact Summary
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-black text-accent">{impactStats.communitiesHelped}</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Communities Helped</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-black text-primary">{impactStats.cleanupEventsJoined}</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Cleanup Events</p>
              </div>
              
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-black text-accent">{impactStats.volunteerHours}h</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Volunteer Hours</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-black text-primary">{impactStats.environmentalScore}</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Environmental Score</p>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievement Badges
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center gap-2 hover:shadow-md transition-all">
                  <div className="text-4xl">{badge.emoji}</div>
                  <span className="text-[10px] font-black uppercase text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Engagement */}
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Community Engagement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-muted/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" /> My Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isDemo ? (
  MOCK_CAMPAIGNS
    .filter(c => c.status === 'active')
    .slice(0, 3)
    .map(c => (
      <div
        key={c.id}
        className="flex items-center gap-3 p-2 rounded-lg bg-primary/5"
      >
        <span className="text-xl">{c.emoji}</span>

        <div className="flex-grow">
          <p className="text-xs font-bold">{c.title}</p>
          <p className="text-[10px] text-muted-foreground">
            {c.participants} participants
          </p>
        </div>

        <Badge className="bg-primary/10 text-primary border-none text-[9px]">
          Active
        </Badge>
      </div>
    ))
) : (
  <p className="text-sm text-muted-foreground">
    No active campaigns yet.
  </p>
)}
                    
                </CardContent>
              </Card>
              <Card className="border-muted/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> My Volunteer Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isDemo ? (
  MOCK_VOLUNTEERS.slice(0, 3).map(v => (
    <div
      key={v.id}
      className="flex items-center gap-3 p-2 rounded-lg bg-green-50"
    >
      <span className="text-xl">{v.emoji}</span>

      <div className="flex-grow">
        <p className="text-xs font-bold">{v.title}</p>
        <p className="text-[10px] text-muted-foreground">
          {v.date} • {v.location}
        </p>
      </div>

      <Badge className="bg-green-100 text-green-700 border-none text-[9px]">
        Registered
      </Badge>
    </div>
  ))
) : (
  <p className="text-sm text-muted-foreground">
    No volunteer activities yet.
  </p>
)}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Account Information */}
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-bold italic">
  {profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : 'Not available'}
</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Last Activity</span>
                <span className="text-sm font-bold italic">
  No activity yet
</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Preferred Region</span>
                <span className="text-sm font-bold italic"> {profile?.region || 'Not set'}</span>
                
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Organization</span>
                <span className="text-sm font-bold italic">{profile?.organization || 'Not set'}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h4>
            <Card className="border-muted/20">
              <CardContent className="pt-6">
  <div className="space-y-4">
    {pointHistory.length > 0 ? (
      pointHistory.slice(0, 5).map((entry, index) => (
        <div key={entry.id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {entry.type === 'report' && (
                  <FileText className="h-4 w-4 text-primary" />
                )}
                {entry.type === 'verification' && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
                {entry.type === 'article' && (
                  <BookOpen className="h-4 w-4 text-primary" />
                )}
                {entry.type === 'campaign' && (
                  <Users className="h-4 w-4 text-primary" />
                )}
                {entry.type === 'cleanup' && (
                  <Calendar className="h-4 w-4 text-primary" />
                )}
                {entry.type === 'community' && (
                  <Heart className="h-4 w-4 text-primary" />
                )}
              </div>

              <div>
                <p className="font-bold text-sm">
                  {entry.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-black text-primary">
                +{entry.points}
              </span>
            </div>
          </div>

          {index < pointHistory.slice(0, 5).length - 1 && (
            <Separator className="my-4" />
          )}
        </div>
      ))
    ) : (
      <p className="text-center text-muted-foreground py-8">
        No recent activity yet.
      </p>
    )}
  </div>
</CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 pt-8 border-t flex items-center justify-between">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:bg-destructive/10" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        userId={user?.id}
        />
    </div>
  );
};

export default ProfilePage;
