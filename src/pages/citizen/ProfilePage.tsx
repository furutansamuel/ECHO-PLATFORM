import EditProfileModal from "@/components/profile/EditProfileModal";
import { AchievementBadges } from "@/components/profile/AchievementBadges";
import { AccountInformation } from "@/components/profile/AccountInformation";
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
    : userStats ?? {
        reportsSubmitted: 0,
        verifiedReports: 0,
        cleanupEventsJoined: 0,
        environmentalScore: 0,
        communitiesHelped: 0,
        volunteerHours: 0,
      };

const badges =
  isDemo
    ? ACHIEVEMENT_BADGES
    : userStats?.badges ?? [];

const pointHistory =
  isDemo
    ? MOCK_POINT_HISTORY
    : userStats?.point_history ?? [];

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

const recentActivities = pointHistory.slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto pb-20">
      {/* Profile Header */}
      <Card className="border-none shadow-2xl overflow-hidden">
        <div className="h-20 sm:h-24 md:h-28 bg-gradient-to-r from-primary via-secondary to-accent" />
        <CardContent className="relative px-4 pt-6 sm:px-6 md:px-8">
          <div className="flex flex-col items-center gap-4 -mt-10 mb-8 text-center md:flex-row md:items-end md:gap-6 md:text-left">
            <Avatar className="h-28 w-28 border-4 border-primary shadow-2xl sm:h-32 sm:w-32 md:h-36 md:w-36">
              <AvatarImage
  src={profile?.avatar_url || ""}
  className="object-cover scale-110"
/>
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-black md:text-4xl">
                {
  loading
    ? ''
    : profile?.full_name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        || 'JD'
                }
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
  {userStats?.community_rank
  ? `#${userStats.community_rank}`
  : '—'}
</h3>

<p className="text-[10px] italic text-muted-foreground mt-1">
  {userStats?.community_rank_percentile
  ? `Top ${userStats.community_rank_percentile}%`
  : 'Not ranked'}
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
              <Progress
  value={loading ? undefined : progress}
  className="h-3"
/>
              {nextLevel && (
                <p className="text-xs text-muted-foreground italic">
                  {pointsToNext} more points to reach {nextLevel.emoji} {nextLevel.name}
                </p>
              )}
            </div>
          </div>

          {/* Environmental Impact Summary — own component, own Card, memoized:
              see src/components/profile/EnvironmentalImpactSummary.tsx */}

          {/* Achievement Badges — own component, own Card, memoized:
              see src/components/profile/AchievementBadges.tsx */}
          <div className="mb-8">
            <AchievementBadges badges={earnedBadges} />
          </div>

          {/* Community Engagement — own component, own Card, memoized:
              see src/components/profile/CommunityEngagement.tsx */}

          {/* Account Information — own component, own Card, memoized:
              see src/components/profile/AccountInformation.tsx */}
          <div className="mb-8">
            <AccountInformation
              memberSince={profile?.created_at}
              region={profile?.region}
              organization={profile?.organization}
            />
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h4>
            <Card className="border-muted/20 [contain:content]">
              <CardContent className="pt-6">
  <div className="space-y-4">
    {pointHistory.length > 0 ? (
      recentActivities.map((entry, index) => (
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

          {index < recentActivities.length - 1 && (
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
