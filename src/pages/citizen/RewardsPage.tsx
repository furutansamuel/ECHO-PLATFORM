import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { 
  Award, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Users, 
  Calendar, 
  BookOpen, 
  Clock, 
  Target,
  Zap,
  Leaf,
  Globe,
  Heart
} from 'lucide-react';
import { 
  ACHIEVEMENT_BADGES,
  calculateProgressToNextLevel 
} from '@/lib/impact-constants';

export default function RewardsPage() {
  const { userStats } = useAuth();

  const impactPoints = userStats?.eco_points ?? 0;

const impactStats = userStats ?? {
  reportsSubmitted: 0,
  verifiedReports: 0,
  cleanupEventsJoined: 0,
  environmentalScore: 0,
  communitiesHelped: 0,
  volunteerHours: 0,
};

const pointHistory = userStats?.point_history ?? [];

// ACHIEVEMENT_BADGES is the real catalog of badge names/descriptions/
// point thresholds, kept as legitimate reference data. But it also ships
// hardcoded earned:true/false + earnedDate per badge, which would show
// as real accomplishments for any account — so earned status here is
// recomputed from the account's actual earned-badge list instead.
const earnedBadgeIds = new Set((userStats?.badges ?? []).map((b: any) => b.id));
const badges = ACHIEVEMENT_BADGES.map((b) => ({
  ...b,
  earned: earnedBadgeIds.has(b.id),
}));
  const { currentLevel, nextLevel, progress, pointsToNext } =
    calculateProgressToNextLevel(impactPoints);

  const earnedBadges = badges.filter((b: any) => b.earned);
  const lockedBadges = badges.filter((b: any) => !b.earned);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Impact Center</h1>
          <p className="text-muted-foreground italic text-lg">Your contribution to a safer, cleaner environment</p>
        </div>
        <div className="bg-primary/10 border-2 border-primary/20 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-primary text-white rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Impact Points</p>
            <p className="text-3xl font-black text-primary">{impactPoints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Current Level & Progress */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase italic flex items-center gap-3">
              <span className="text-3xl">{currentLevel.emoji}</span>
              {currentLevel.name}
            </CardTitle>
            <CardDescription className="text-base">
              Level {currentLevel.id} • {pointsToNext > 0 ? `${pointsToNext} points to ${nextLevel?.name}` : 'Maximum level reached!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Progress</span>
                <span className="text-2xl font-black text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-4 bg-muted border border-muted/20" />
              {nextLevel && (
                <p className="text-xs text-muted-foreground italic">
                  {pointsToNext} more points to reach {nextLevel.emoji} {nextLevel.name}
                </p>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Reports', value: impactStats.reportsSubmitted, icon: FileText },
{ label: 'Verified', value: impactStats.verifiedReports, icon: CheckCircle },
{ label: 'Events', value: impactStats.cleanupEventsJoined, icon: Calendar },
                { label: 'Rank', value: '#42', icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-muted/10 text-center">
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-xl font-black">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact Summary */}
        <Card className="bg-gradient-to-br from-primary via-secondary to-accent text-white border-none shadow-xl">
          <CardHeader>
            <CardTitle className="font-black uppercase tracking-tight flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Environmental Score</p>
              <p className="text-3xl font-black italic">{impactStats.environmentalScore}/100</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Communities Helped</p>
              <p className="text-3xl font-black italic">{impactStats.communitiesHelped} Areas</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Volunteer Hours</p>
              <p className="text-3xl font-black italic">{impactStats.volunteerHours}h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Badges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Earned Badges
          </h2>
          <Badge className="bg-primary/10 text-primary border-primary/20 font-black">
            {earnedBadges.length} of {badges.length}
          </Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {earnedBadges.map((badge: any) => (
            <Card key={badge.id} className="border-muted/20 shadow-sm hover:shadow-md transition-all hover:border-primary/50 group">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                    {badge.emoji}
                  </div>
                  <h3 className="font-black uppercase tracking-tight text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground italic leading-snug">{badge.description}</p>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black text-[10px] uppercase tracking-widest">
                    Earned • +{badge.pointsRequired} pts
                  </Badge>
                  {badge.earnedDate && (
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(badge.earnedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Next Achievements */}
      {lockedBadges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 text-muted-foreground" />
            Next Achievements
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lockedBadges.map((badge: any) => (
              <Card key={badge.id} className="border-muted/20 shadow-sm opacity-70 hover:opacity-100 transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="text-5xl mb-2 grayscale">
                      {badge.emoji}
                    </div>
                    <h3 className="font-black uppercase tracking-tight text-sm">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground italic leading-snug">{badge.description}</p>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase">
                        <span>Progress</span>
                        <span>{badge.pointsRequired} pts</span>
                      </div>
                      <Progress value={0} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Point History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Recent Activity
        </h2>
        <Card className="border-muted/20 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {pointHistory.map((entry: any, index: number) => (
                <div key={entry.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {entry.type === 'report' && <FileText className="h-4 w-4 text-primary" />}
                        {entry.type === 'verification' && <CheckCircle className="h-4 w-4 text-primary" />}
                        {entry.type === 'article' && <BookOpen className="h-4 w-4 text-primary" />}
                        {entry.type === 'campaign' && <Users className="h-4 w-4 text-primary" />}
                        {entry.type === 'cleanup' && <Calendar className="h-4 w-4 text-primary" />}
                        {entry.type === 'community' && <Heart className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-black text-primary">+{entry.points}</span>
                    </div>
                  </div>
                  {index < pointHistory.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Rules */}
      <Card className="border-muted/20 shadow-sm bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            How to Earn Impact Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-muted/20">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-sm">Submit Report</p>
                <p className="text-xs text-muted-foreground">+50 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-muted/20">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-sm">Verified Report</p>
                <p className="text-xs text-muted-foreground">+100 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-muted/20">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-sm">Read Article</p>
                <p className="text-xs text-muted-foreground">+10 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-muted/20">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-sm">Join Campaign</p>
                <p className="text-xs text-muted-foreground">+25 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-muted/20">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-sm">Cleanup Event</p>
                <p className="text-xs text-muted-foreground">+75 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-muted/20">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-sm">Community Contribution</p>
                <p className="text-xs text-muted-foreground">+30 points</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
