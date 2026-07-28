import { useEffect, useState } from "react";

import EditProfileModal from "@/components/profile/EditProfileModal";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { AchievementBadges } from "@/components/profile/AchievementBadges";
import { AccountInformation } from "@/components/profile/AccountInformation";
import { EnvironmentalImpactSummary } from "@/components/profile/EnvironmentalImpactSummary";

import { useAuth } from "@/hooks/use-auth";
import { useEventRegistrations } from "@/hooks/use-event-registrations";

import { supabase } from "@/integrations/supabase/client";

import {
  ACHIEVEMENT_BADGES,
  calculateProgressToNextLevel,
} from "@/lib/impact-constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  Award,
  CheckCircle,
  Clock,
  Edit3,
  FileText,
  Leaf,
  LogOut,
  Mail,
  MapPin,
  Settings,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

interface RecentReport {
  id: string;
  title: string;
  status: string;
  verification_status?: string;
  created_at: string;
  location: { ward?: string; lga?: string } | null;
}

const ProfilePage: React.FC = () => {
  const { user, profile, logout, userStats, loading } = useAuth();
  const { registeredIds } = useEventRegistrations();

  const [editOpen, setEditOpen] = useState(false);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [rank, setRank] = useState<number | null>(null);

  const impactPoints = userStats?.eco_points ?? 0;

  const impactStats = {
    reportsSubmitted: userStats?.total_reports ?? 0,
    verifiedReports: userStats?.verified_reports ?? 0,
    resolvedReports: userStats?.resolved_reports ?? 0,
    volunteerHours: userStats?.volunteer_hours ?? 0,
  };

  useEffect(() => {
    if (!user || !supabase) return;
    let mounted = true;

    (async () => {
      const { data } = await supabase
        .from("hazard_reports")
        .select("id,title,status,verification_status,created_at,location")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (mounted && data) setRecentReports(data as RecentReport[]);

      const { count } = await supabase
        .from("user_stats")
        .select("user_id", { count: "exact", head: true })
        .gt("eco_points", impactPoints);
      if (mounted && typeof count === "number") setRank(count + 1);
    })();

    return () => { mounted = false; };
  }, [user, impactPoints]);

  if (user && loading) {
    return <ProfileSkeleton />;
  }

  const { currentLevel, nextLevel, progress, pointsToNext } = calculateProgressToNextLevel(impactPoints);

  const earnedBadges = ACHIEVEMENT_BADGES.filter((badge) => impactPoints >= badge.pointsRequired);
  const nextBadge = ACHIEVEMENT_BADGES.find((badge) => impactPoints < badge.pointsRequired);

  // Wards touched by this user's own reports — a real, derivable proxy for
  // "communities helped" rather than an untracked column.
  const wardsHelped = new Set(
    recentReports.map((r) => r.location?.ward || r.location?.lga).filter(Boolean)
  ).size;

  // Verification rate — real, derived (verified / submitted). This is the
  // single source for every "trust" display on this page: the header badge
  // and the Environmental Impact summary both read this same value, so
  // there is exactly one number to keep in sync, not three.
  const verificationRate =
    impactStats.reportsSubmitted > 0
      ? Math.round((impactStats.verifiedReports / impactStats.reportsSubmitted) * 100)
      : 0;

  const environmentalImpactStats = {
    communitiesHelped: wardsHelped,
    cleanupEventsJoined: registeredIds.size,
    volunteerHours: impactStats.volunteerHours,
    verificationRate,
  };

  const profileCompletion = (() => {
    let score = 0;
    if (profile?.full_name) score += 20;
    if (profile?.avatar_url) score += 20;
    if (user?.email) score += 20;
    if (profile?.region) score += 20;
    if (profile?.organization) score += 20;
    return score;
  })();

  const environmentalBio = profile?.organization
    ? `Protecting communities through environmental action with ${profile.organization}.`
    : "Dedicated to reporting hazards and building healthier communities.";

  const recentActivities = recentReports.map((report) => ({
    id: report.id,
    type: report.status === "Verified" || report.status === "Resolved" ? "verification" : "report",
    description:
      report.status === "Verified"
        ? `Report verified: ${report.title}`
        : report.status === "Resolved"
        ? `Report resolved: ${report.title}`
        : `Report submitted: ${report.title}`,
    date: report.created_at,
    // Only verified/resolved outcomes actually earn points (see
    // POINTS_RULES) — a bare submission doesn't, so it shows no badge here.
    points:
      report.status === "Verified" || report.status === "Resolved" ? 100 : null,
  }));

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto pb-20">

      {/* ============================================================ */}
      {/* Profile Header — identity block. Left exactly as-is: cover    */}
      {/* banner, avatar, name, role, email, bio, Level/Trust/Region    */}
      {/* badges. Nothing below this duplicates what's shown here.     */}
      {/* ============================================================ */}
      <Card className="border-none shadow-2xl overflow-hidden">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary via-secondary to-accent relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute right-6 top-6">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md uppercase tracking-widest text-[10px] font-black">
              ECHO Member
            </Badge>
          </div>
        </div>

        <CardContent className="relative px-4 sm:px-6 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 -mt-16 mb-8">
            <Avatar className="h-32 w-32 md:h-36 md:w-36 border-4 border-background shadow-2xl">
              <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-black">
                {profile?.full_name?.split(" ").map((name) => name[0]).join("").toUpperCase() || "EC"}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-6 flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight">{profile?.full_name || "Guest User"}</h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black">
                  {profile?.role || "Citizen"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {user?.email || "No email"}
              </p>

              <p className="text-sm italic text-muted-foreground max-w-xl">
                {environmentalBio}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <Badge variant="outline" className="gap-2">
                  <Leaf className="h-3 w-3 text-primary" />
                  {currentLevel.name}
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  {verificationRate}% Trust Rate
                </Badge>
                {profile?.region && (
                  <Badge variant="outline" className="gap-2">
                    <MapPin className="h-3 w-3 text-primary" />
                    {profile.region}
                  </Badge>
                )}
              </div>
            </div>

            <Button variant="outline" className="rounded-full gap-2 border-primary/20" onClick={() => setEditOpen(true)}>
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Completion */}
          <div className="mb-8 p-5 rounded-2xl bg-muted/30 border border-muted/20">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-black text-sm">Profile Completion</span>
              </div>
              <span className="font-black text-primary">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <p className="text-xs text-muted-foreground mt-3">
              Complete your profile to build more trust within the ECHO community.
            </p>
          </div>

          {/* Quick Stats — identity-level numbers only (points, reports,
              rank, badge count). Impact/trust numbers live in the
              Environmental Impact summary below instead of being repeated
              here. */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-none bg-primary/5 shadow-sm">
              <CardContent className="p-5 text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-black text-primary">{impactPoints.toLocaleString()}</p>
                <p className="text-[10px] uppercase font-black text-muted-foreground">Impact Points</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-secondary/5 shadow-sm">
              <CardContent className="p-5 text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-black text-secondary">{impactStats.reportsSubmitted}</p>
                <p className="text-[10px] uppercase font-black text-muted-foreground">Reports</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-accent/5 shadow-sm">
              <CardContent className="p-5 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-black text-accent">{rank ? `#${rank}` : "—"}</p>
                <p className="text-[10px] uppercase font-black text-muted-foreground">Community Rank</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-highlight/5 shadow-sm">
              <CardContent className="p-5 text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-highlight" />
                <p className="text-2xl font-black">{earnedBadges.length}</p>
                <p className="text-[10px] uppercase font-black text-muted-foreground">Badges</p>
              </CardContent>
            </Card>
          </div>

          {/* Impact Level Progress */}
          <div className="mb-8">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl">
                      {currentLevel.emoji}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Current Impact Level</p>
                      <h2 className="text-2xl font-black">{currentLevel.name}</h2>
                      <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
                    </div>
                  </div>
                  {nextLevel && (
                    <div className="text-left lg:text-right">
                      <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Next Milestone</p>
                      <p className="text-xl font-black text-primary">{nextLevel.emoji} {nextLevel.name}</p>
                      <p className="text-sm text-muted-foreground">{pointsToNext} points remaining</p>
                    </div>
                  )}
                </div>
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm">Impact Progress</span>
                    <span className="font-black text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-4" />
                  {nextLevel && (
                    <p className="text-xs text-muted-foreground italic">
                      Keep contributing to unlock {nextLevel.emoji} {nextLevel.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Achievement Preview */}
          {nextBadge && (
            <div className="mb-8">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="text-6xl grayscale">{nextBadge.emoji}</div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Next Badge</p>
                      </div>
                      <h3 className="text-xl font-black mt-1">{nextBadge.name}</h3>
                      <p className="text-sm text-muted-foreground">{nextBadge.description}</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span>Progress</span>
                          <span className="text-primary">{impactPoints} / {nextBadge.pointsRequired}</span>
                        </div>
                        <Progress value={Math.min((impactPoints / nextBadge.pointsRequired) * 100, 100)} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Environmental Impact — the ONE place these four numbers are
              shown (previously duplicated inline here AND in a separate
              "Trust & Reputation Overview" grid). */}
          <div className="mb-8">
            <EnvironmentalImpactSummary stats={environmentalImpactStats} />
          </div>

          {/* Achievements — the shared component, not a second hand-built
              badge grid. */}
          <div className="mb-8">
            <AchievementBadges badges={earnedBadges} />
          </div>

          {/* Account Information */}
<div className="mb-8">
  <div className="flex items-center gap-3 mb-5">
    <User className="h-6 w-6 text-primary" />
    <div>
      <h3 className="text-xl font-black">Account Information</h3>
      <p className="text-sm text-muted-foreground">
        Your ECHO membership details
      </p>
    </div>
  </div>

  <AccountInformation
    memberSince={profile?.created_at}
    region={profile?.region}
    organization={profile?.organization}
  />
</div>

          {/* Recent Impact Activity */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-black">Recent Impact Activity</h3>
            </div>
            <Card className="border-muted/20 shadow-lg">
              <CardContent className="p-6">
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {activity.type === "verification" ? (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              ) : (
                                <FileText className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                          {activity.points !== null && (
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-primary" />
                              <span className="font-black text-primary">+{activity.points}</span>
                            </div>
                          )}
                        </div>
                        {index < recentActivities.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No activity yet — submit your first environmental report to start your impact journey.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Actions */}
          <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row justify-between gap-4">
            <Button variant="ghost" className="gap-2 text-muted-foreground justify-start">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="gap-2 text-destructive hover:bg-destructive/10" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} profile={profile} userId={user?.id} />
    </div>
  );
};

export default ProfilePage;
