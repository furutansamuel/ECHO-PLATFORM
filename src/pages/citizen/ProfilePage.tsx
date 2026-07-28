import React, { useEffect, useState, useMemo } from "react";

// Modal & Skeleton components
import EditProfileModal from "@/components/profile/EditProfileModal";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { AchievementBadges } from "@/components/profile/AchievementBadges";
import { AccountInformation } from "@/components/profile/AccountInformation";
import { EnvironmentalImpactSummary } from "@/components/profile/EnvironmentalImpactSummary";

// Context & Hooks
import { useAuth } from "@/hooks/use-auth";
import { useEventRegistrations } from "@/hooks/use-event-registrations";

// Integrations & Utilities
import { supabase } from "@/integrations/supabase/client";
import {
  ACHIEVEMENT_BADGES,
  POINTS_RULES,
  calculateProgressToNextLevel,
} from "@/lib/impact-constants";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Icons
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
  AlertCircle,
} from "lucide-react";

// Types
interface RecentReport {
  id: string;
  title: string;
  status: string;
  verification_status?: string;
  created_at: string;
  location: { ward?: string; lga?: string } | null;
}

interface RecentActivity {
  id: string;
  type: "verification" | "report";
  description: string;
  date: string;
  points: number | null;
}

/* ============================================================================
   Sub-Components
   ============================================================================ */

interface ProfileHeaderProps {
  profile: any;
  user: any;
  currentLevelName: string;
  verificationRate: number;
  environmentalBio: string;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  user,
  currentLevelName,
  verificationRate,
  environmentalBio,
  onEditClick,
}) => {
  const userInitials = useMemo(() => {
    if (!profile?.full_name) return "EC";
    return profile.full_name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [profile?.full_name]);

  return (
    <Card className="border-none shadow-xl overflow-hidden bg-card">
      {/* Cover Banner */}
      <div className="h-28 sm:h-36 md:h-48 lg:h-56 bg-gradient-to-r from-primary via-secondary to-accent relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md uppercase tracking-widest text-[10px] font-black">
            ECHO Member
          </Badge>
        </div>
      </div>

      {/* Profile Bar */}
      <CardContent className="relative px-4 sm:px-6 md:px-8 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-6 -mt-14 sm:-mt-16 md:-mt-20 mb-6 text-center md:text-left">
          
          {/* Avatar & User Details */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 min-w-0 w-full md:w-auto">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 border-4 border-background shadow-2xl shrink-0">
              <AvatarImage src={profile?.avatar_url || ""} className="object-cover" alt="Profile avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl sm:text-4xl font-black">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5 min-w-0 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate max-w-full">
                  {profile?.full_name || "Guest User"}
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black shrink-0">
                  {profile?.role || "Citizen"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 truncate">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user?.email || "No email available"}</span>
              </p>

              <p className="text-sm italic text-muted-foreground max-w-xl line-clamp-2 md:line-clamp-none">
                {environmentalBio}
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <Leaf className="h-3 w-3 text-primary shrink-0" />
                  {currentLevelName}
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                  {verificationRate}% Trust Rate
                </Badge>
                {profile?.region && (
                  <Badge variant="outline" className="gap-1.5 text-xs">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    {profile.region}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="shrink-0 w-full md:w-auto pt-2 md:pt-0">
            <Button
              variant="outline"
              className="w-full md:w-auto rounded-full gap-2 border-primary/20 hover:border-primary/40 shadow-sm"
              onClick={onEditClick}
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ProfileCompletionProps {
  score: number;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ score }) => (
  <Card className="border-muted/20 bg-muted/10 shadow-sm">
    <CardContent className="p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <span className="font-black text-sm">Profile Completion</span>
        </div>
        <span className="font-black text-primary">{score}%</span>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-xs text-muted-foreground mt-3">
        Complete your profile to build more trust within the ECHO community.
      </p>
    </CardContent>
  </Card>
);

interface QuickStatsGridProps {
  impactPoints: number;
  reportsSubmitted: number;
  rank: number | null;
  earnedBadgesCount: number;
}

const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({
  impactPoints,
  reportsSubmitted,
  rank,
  earnedBadgesCount,
}) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
        <p className="text-2xl font-black text-secondary">{reportsSubmitted}</p>
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
        <p className="text-2xl font-black">{earnedBadgesCount}</p>
        <p className="text-[10px] uppercase font-black text-muted-foreground">Badges</p>
      </CardContent>
    </Card>
  </div>
);

interface ImpactLevelProgressProps {
  currentLevel: { emoji: string; name: string; description: string };
  nextLevel?: { emoji: string; name: string } | null;
  pointsToNext: number;
  progress: number;
}

const ImpactLevelProgress: React.FC<ImpactLevelProgressProps> = ({
  currentLevel,
  nextLevel,
  pointsToNext,
  progress,
}) => (
  <Card className="border-none shadow-lg overflow-hidden">
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl shrink-0">
            {currentLevel.emoji}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">
              Current Impact Level
            </p>
            <h2 className="text-2xl font-black">{currentLevel.name}</h2>
            <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
          </div>
        </div>

        {nextLevel && (
          <div className="text-left lg:text-right">
            <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">
              Next Milestone
            </p>
            <p className="text-xl font-black text-primary">
              {nextLevel.emoji} {nextLevel.name}
            </p>
            <p className="text-sm text-muted-foreground">{pointsToNext} points remaining</p>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-black text-sm">Impact Progress</span>
          <span className="font-black text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
        {nextLevel && (
          <p className="text-xs text-muted-foreground italic">
            Keep contributing to unlock {nextLevel.emoji} {nextLevel.name}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

interface NextBadgePreviewProps {
  nextBadge: { emoji: string; name: string; description: string; pointsRequired: number };
  impactPoints: number;
}

const NextBadgePreview: React.FC<NextBadgePreviewProps> = ({ nextBadge, impactPoints }) => {
  const badgeProgress = useMemo(
    () => Math.min((impactPoints / nextBadge.pointsRequired) * 100, 100),
    [impactPoints, nextBadge.pointsRequired]
  );

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="text-6xl grayscale shrink-0">{nextBadge.emoji}</div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Star className="h-5 w-5 text-primary shrink-0" />
              <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">
                Next Badge
              </p>
            </div>
            <h3 className="text-xl font-black mt-1 truncate">{nextBadge.name}</h3>
            <p className="text-sm text-muted-foreground">{nextBadge.description}</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Progress</span>
                <span className="text-primary">
                  {impactPoints} / {nextBadge.pointsRequired}
                </span>
              </div>
              <Progress value={badgeProgress} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentActivityListProps {
  activities: RecentActivity[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => (
  <Card className="border-muted/20 shadow-md">
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="h-6 w-6 text-primary shrink-0" />
        <h3 className="text-xl font-black">Recent Impact Activity</h3>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    {activity.type === "verification" ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {activity.points !== null && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-black text-primary">+{activity.points}</span>
                  </div>
                )}
              </div>
              {index < activities.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8 text-sm">
          No activity yet — submit your first environmental report to start your impact journey.
        </p>
      )}
    </CardContent>
  </Card>
);

interface ProfileActionsProps {
  onLogout: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onLogout }) => (
  <div className="pt-6 border-t flex flex-col sm:flex-row justify-between gap-4">
    <Button variant="ghost" className="gap-2 text-muted-foreground justify-start sm:justify-center">
      <Settings className="h-4 w-4" />
      Settings
    </Button>
    <Button
      variant="ghost"
      className="gap-2 text-destructive hover:bg-destructive/10 justify-start sm:justify-center"
      onClick={onLogout}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  </div>
);

/* ============================================================================
   Main Component: ProfilePage
   ============================================================================ */

const ProfilePage: React.FC = () => {
  const { user, profile, logout, userStats, loading } = useAuth();
  const { registeredIds } = useEventRegistrations();

  const [editOpen, setEditOpen] = useState(false);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  // Derived user statistics
  const impactPoints = userStats?.eco_points ?? 0;

  const impactStats = useMemo(
    () => ({
      reportsSubmitted: userStats?.total_reports ?? 0,
      verifiedReports: userStats?.verified_reports ?? 0,
      resolvedReports: userStats?.resolved_reports ?? 0,
      volunteerHours: userStats?.volunteer_hours ?? 0,
    }),
    [userStats]
  );

  // Fetch Async Data safely
  useEffect(() => {
    if (!user || !supabase) return;
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        setDataError(null);

        // Recent Reports Query
        const { data: reports, error: reportsError } = await supabase
          .from("hazard_reports")
          .select("id,title,status,verification_status,created_at,location")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (reportsError) throw reportsError;
        if (isMounted && reports) setRecentReports(reports as RecentReport[]);

        // User Rank Query
        const { count, error: rankError } = await supabase
          .from("user_stats")
          .select("user_id", { count: "exact", head: true })
          .gt("eco_points", impactPoints);

        if (rankError) throw rankError;
        if (isMounted && typeof count === "number") setRank(count + 1);
      } catch (err: any) {
        console.error("Failed to load profile details:", err.message || err);
        if (isMounted) {
          setDataError("Unable to load latest stats. Please try refreshing.");
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [user, impactPoints]);

  // Derived Values
  const { currentLevel, nextLevel, progress, pointsToNext } = useMemo(
    () => calculateProgressToNextLevel(impactPoints),
    [impactPoints]
  );

  const earnedBadges = useMemo(
    () => ACHIEVEMENT_BADGES.filter((b) => impactPoints >= b.pointsRequired),
    [impactPoints]
  );

  const nextBadge = useMemo(
    () => ACHIEVEMENT_BADGES.find((b) => impactPoints < b.pointsRequired),
    [impactPoints]
  );

  const wardsHelped = useMemo(
    () =>
      new Set(
        recentReports.map((r) => r.location?.ward || r.location?.lga).filter(Boolean)
      ).size,
    [recentReports]
  );

  const verificationRate = useMemo(
    () =>
      impactStats.reportsSubmitted > 0
        ? Math.round((impactStats.verifiedReports / impactStats.reportsSubmitted) * 100)
        : 0,
    [impactStats.verifiedReports, impactStats.reportsSubmitted]
  );

  const environmentalImpactStats = useMemo(
    () => ({
      communitiesHelped: wardsHelped,
      cleanupEventsJoined: registeredIds.size,
      volunteerHours: impactStats.volunteerHours,
      verificationRate,
    }),
    [wardsHelped, registeredIds.size, impactStats.volunteerHours, verificationRate]
  );

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile?.full_name) score += 20;
    if (profile?.avatar_url) score += 20;
    if (user?.email) score += 20;
    if (profile?.region) score += 20;
    if (profile?.organization) score += 20;
    return score;
  }, [profile, user?.email]);

  const environmentalBio = useMemo(
    () =>
      profile?.organization
        ? `Protecting communities through environmental action with ${profile.organization}.`
        : "Dedicated to reporting hazards and building healthier communities.",
    [profile?.organization]
  );

  // Derived Activities map using centralized POINTS_RULES constant
  const recentActivities = useMemo<RecentActivity[]>(
    () =>
      recentReports.map((report) => {
        const isVerified = report.status === "Verified";
        const isResolved = report.status === "Resolved";

        let earnedPoints: number | null = null;
        if (isResolved) {
          earnedPoints = POINTS_RULES.REPORT_RESOLVED;
        } else if (isVerified) {
          earnedPoints = POINTS_RULES.REPORT_VERIFIED;
        }

        return {
          id: report.id,
          type: isVerified || isResolved ? "verification" : "report",
          description: isResolved
            ? `Report resolved: ${report.title}`
            : isVerified
            ? `Report verified: ${report.title}`
            : `Report submitted: ${report.title}`,
          date: report.created_at,
          points: earnedPoints,
        };
      }),
    [recentReports]
  );

  if (user && loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto pb-24">
        
        {/* Error State Notice */}
        {dataError && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{dataError}</span>
          </div>
        )}

        {/* Header Block */}
        <ProfileHeader
          profile={profile}
          user={user}
          currentLevelName={currentLevel.name}
          verificationRate={verificationRate}
          environmentalBio={environmentalBio}
          onEditClick={() => setEditOpen(true)}
        />

        {/* Profile Completion Indicator */}
        <ProfileCompletion score={profileCompletion} />

        {/* Quick Stats Grid */}
        <QuickStatsGrid
          impactPoints={impactPoints}
          reportsSubmitted={impactStats.reportsSubmitted}
          rank={rank}
          earnedBadgesCount={earnedBadges.length}
        />

        {/* Impact Level Progress */}
        <ImpactLevelProgress
          currentLevel={currentLevel}
          nextLevel={nextLevel}
          pointsToNext={pointsToNext}
          progress={progress}
        />

        {/* Next Achievement Preview */}
        {nextBadge && <NextBadgePreview nextBadge={nextBadge} impactPoints={impactPoints} />}

        {/* Environmental Impact Summary */}
        <EnvironmentalImpactSummary stats={environmentalImpactStats} />

        {/* Achievement Badges */}
        <AchievementBadges badges={earnedBadges} />

        {/* Account Information (Card encapsulation managed internally) */}
        <AccountInformation
          memberSince={profile?.created_at}
          region={profile?.region}
          organization={profile?.organization}
        />

        {/* Recent Impact Activity */}
        <RecentActivityList activities={recentActivities} />

        {/* Profile Actions Footer */}
        <ProfileActions onLogout={() => logout()} />

      </div>

      {/* Edit Profile Modal */}
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

