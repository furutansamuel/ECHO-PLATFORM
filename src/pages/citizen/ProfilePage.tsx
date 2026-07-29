import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

// Modal & Skeleton components
import EditProfileModal from "@/components/profile/EditProfileModal";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { AccountInformation } from "@/components/profile/AccountInformation";

// Context & Hooks
import { useAuth } from "@/hooks/use-auth";
import { useEventRegistrations } from "@/hooks/use-event-registrations";

// Integrations & Utilities
import { supabase } from "@/integrations/supabase/client";
import {
  ACHIEVEMENT_BADGES,
  calculateProgressToNextLevel,
} from "@/lib/impact-constants";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Icons
import {
  Award,
  CheckCircle2,
  Clock,
  Edit3,
  FileText,
  Globe,
  ImageIcon,
  Leaf,
  LogOut,
  MapPin,
  Settings,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
  AlertCircle,
  Sparkles,
  Share2,
  Flame,
  Target,
  Compass,
  Download,
  ArrowUpRight,
  Map as MapIcon,
  Layers,
  Activity,
  Lightbulb,
  QrCode,
} from "lucide-react";

// Interfaces
interface RecentReport {
  id: string;
  title: string;
  status: string;
  verification_status?: string;
  created_at: string;
  category?: string;
  image_url?: string;
  location: { ward?: string; lga?: string; lat?: number; lng?: number } | null;
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  dateEarned: string;
  description: string;
  type: "Volunteer" | "Hero" | "Response" | "Advocate";
}

interface GoalItem {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  category: "reports" | "points" | "hours" | "streak";
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  icon: React.ReactNode;
}

/* ============================================================================
   1. Profile Header Component
   ============================================================================ */

interface ProfileHeaderProps {
  profile: any;
  user: any;
  currentLevelName: string;
  verificationRate: number;
  environmentalBio: string;
  impactPoints: number;
  reportsSubmitted: number;
  rank: number | null;
  earnedBadgesCount: number;
  coverTheme: string;
  onSelectCoverTheme: (theme: string) => void;
  onEditClick: () => void;
  onShareClick: () => void;
}

const COVER_THEMES: Record<string, string> = {
  nature: "https://images.unsplash.com/photo-1511497584788-876761c1298b?auto=format&fit=crop&w=1600&q=80",
  satellite: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
  gradient: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
  seasonal: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  currentLevelName,
  verificationRate,
  environmentalBio,
  impactPoints,
  reportsSubmitted,
  rank,
  earnedBadgesCount,
  coverTheme,
  onSelectCoverTheme,
  onEditClick,
  onShareClick,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  const userInitials = useMemo(() => {
    if (!profile?.full_name) return "EC";
    return profile.full_name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [profile?.full_name]);

  const activeBanner =
    profile?.cover_url && profile.cover_url.trim() !== ""
      ? profile.cover_url
      : COVER_THEMES[coverTheme] || COVER_THEMES.nature;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-xl bg-card">
      {/* Cover Banner */}
      <div className="h-44 sm:h-52 md:h-60 w-full relative overflow-hidden bg-muted">
        <img
          src={activeBanner}
          alt="ECHO Header Banner"
          className="w-full h-full object-cover transition-all duration-700 brightness-95"
          onError={(e) => {
            (e.target as HTMLImageElement).src = COVER_THEMES.nature;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/20" />

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            size="sm"
            onClick={onShareClick}
            className="bg-background/80 hover:bg-background text-foreground backdrop-blur-md border border-border/60 rounded-full font-semibold text-xs gap-1.5 shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5 text-primary" />
            Share Profile
          </Button>
          <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md px-3 py-1 text-[11px] font-bold rounded-full shadow-sm flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            ECHO Community
          </Badge>
        </div>
      </div>

      {/* Header Info */}
      <div className="relative px-4 sm:px-6 md:px-8 pb-6 -mt-16 sm:-mt-20">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="p-1 rounded-3xl bg-background border border-border shadow-xl">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-2xl object-cover">
                <AvatarImage src={profile?.avatar_url || ""} className="object-cover" alt="Avatar" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl sm:text-3xl font-black rounded-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 max-w-full px-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground truncate">
              {profile?.full_name || "ECHO Community Member"}
            </h1>
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-lg mt-1.5 leading-relaxed px-4">
            "{environmentalBio}"
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {/* Level Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
              <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              {currentLevelName}
            </span>

            {/* Verified Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              {verificationRate}% Verified
            </span>

            {/* Region Badge */}
            {profile?.region && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                {profile.region}
              </span>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-center">
              <Award className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-lg sm:text-xl font-bold text-foreground">{impactPoints.toLocaleString()}</p>
              <p className="text-[10px] font-medium text-muted-foreground">Impact Points</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-center">
              <FileText className="h-4 w-4 mx-auto mb-1 text-info" />
              <p className="text-lg sm:text-xl font-bold text-foreground">{reportsSubmitted}</p>
              <p className="text-[10px] font-medium text-muted-foreground">Reports</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-center">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-secondary" />
              <p className="text-lg sm:text-xl font-bold text-foreground">{rank ? `#${rank}` : "—"}</p>
              <p className="text-[10px] font-medium text-muted-foreground">Community Rank</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-center">
              <Star className="h-4 w-4 mx-auto mb-1 text-warning" />
              <p className="text-lg sm:text-xl font-bold text-foreground">{earnedBadgesCount}</p>
              <p className="text-[10px] font-medium text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAB Options */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="relative">
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform active:scale-95"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            title="Options"
          >
            <Edit3 className="h-4 w-4" />
          </Button>

          {showQuickMenu && (
            <div className="absolute bottom-12 right-0 w-48 py-1.5 rounded-2xl bg-card border border-border shadow-xl space-y-0.5">
              <button
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                onClick={() => {
                  setShowQuickMenu(false);
                  onEditClick();
                }}
              >
                <User className="h-3.5 w-3.5 text-primary" />
                Edit Profile
              </button>
              <button
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                onClick={() => {
                  setShowQuickMenu(false);
                  setShowCoverPicker(!showCoverPicker);
                }}
              >
                <ImageIcon className="h-3.5 w-3.5 text-info" />
                Change Cover
              </button>
            </div>
          )}

          {showCoverPicker && (
            <div className="absolute bottom-24 right-0 w-56 p-3 rounded-2xl bg-card border border-border shadow-xl space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Theme</p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(COVER_THEMES).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      onSelectCoverTheme(theme);
                      setShowCoverPicker(false);
                    }}
                    className={`px-2.5 py-1.5 text-xs font-medium capitalize rounded-xl border transition-all text-left ${
                      coverTheme === theme
                        ? "bg-primary/10 border-primary text-primary font-bold"
                        : "bg-muted/30 border-transparent hover:bg-muted"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. Eco Score Card
   ============================================================================ */

interface ReputationScoreCardProps {
  score: number;
  level: string;
  trend: string;
  confidence: number;
}

const ReputationScoreCard: React.FC<ReputationScoreCardProps> = ({
  score,
  level,
  trend,
  confidence,
}) => {
  const starsCount = Math.min(5, Math.max(1, Math.round(score / 20)));

  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur-md shadow-sm rounded-3xl">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-black text-primary">{score}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  Community Impact Score
                </h3>
              </div>
              <p className="text-lg font-bold text-foreground mt-0.5">{level}</p>
              <div className="flex items-center gap-1 mt-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < starsCount ? "fill-amber-400 text-amber-400" : "text-muted/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Activity Trend</p>
              <p className="text-xs font-bold text-primary flex items-center gap-1 mt-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {trend}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Verification</p>
              <p className="text-xs font-bold text-foreground mt-1">{confidence}% Accurate</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ============================================================================
   3. ECHO Overview Metrics
   ============================================================================ */

interface EchoDnaProps {
  trustRate: number;
  persona: string;
  climateIndex: number;
  ecoContribution: number;
}

const EchoDnaMetrics: React.FC<EchoDnaProps> = ({
  trustRate,
  persona,
  climateIndex,
  ecoContribution,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
    <Card className="border-border/50 bg-card/60 rounded-2xl">
      <CardContent className="p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Role Focus</p>
          <p className="text-xs font-bold text-foreground truncate">{persona}</p>
        </div>
      </CardContent>
    </Card>

    <Card className="border-border/50 bg-card/60 rounded-2xl">
      <CardContent className="p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-info/10 text-info">
          <Globe className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Impact Rating</p>
          <p className="text-xs font-bold text-foreground">{climateIndex} / 100</p>
        </div>
      </CardContent>
    </Card>

    <Card className="border-border/50 bg-card/60 rounded-2xl">
      <CardContent className="p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
          <Compass className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Pace</p>
          <p className="text-xs font-bold text-foreground">{ecoContribution} pts/Month</p>
        </div>
      </CardContent>
    </Card>

    <Card className="border-border/50 bg-card/60 rounded-2xl">
      <CardContent className="p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-warning/10 text-warning">
          <Layers className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Verification Rate</p>
          <p className="text-xs font-bold text-foreground">{trustRate}% Verified</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ============================================================================
   4. Streaks & Goals
   ============================================================================ */

interface StreaksAndGoalsProps {
  streakDays: number;
  activeWeeks: number;
  goals: GoalItem[];
}

const StreaksAndGoals: React.FC<StreaksAndGoalsProps> = ({
  streakDays,
  activeWeeks,
  goals,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="border-primary/20 bg-primary/5 rounded-3xl md:col-span-1 flex flex-col justify-between p-5">
      <div className="flex items-center gap-2 text-primary mb-3">
        <Flame className="h-4 w-4 fill-primary" />
        <span className="text-xs uppercase font-bold text-muted-foreground">
          Activity Streak
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-2xl font-bold text-foreground">{streakDays} Days</p>
          <p className="text-xs text-muted-foreground font-medium">Current Streak</p>
        </div>
        <Separator />
        <div>
          <p className="text-2xl font-bold text-foreground">{activeWeeks} Weeks</p>
          <p className="text-xs text-muted-foreground font-medium">Active Contribution Weeks</p>
        </div>
      </div>
    </Card>

    <Card className="border-border/60 bg-card rounded-3xl md:col-span-2 p-5">
      <div className="flex items-center gap-2 text-primary mb-4">
        <Target className="h-4 w-4" />
        <span className="text-xs uppercase font-bold text-muted-foreground">
          Personal Goals
        </span>
      </div>
      <div className="space-y-3.5">
        {goals.map((goal) => {
          const progressPercent = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <div key={goal.id} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground">{goal.title}</span>
                <span className="text-primary font-bold">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

/* ============================================================================
   5. Smart Suggestions
   ============================================================================ */

interface AiInsightsProps {
  insights: string[];
}

const AiCitizenInsights: React.FC<AiInsightsProps> = ({ insights }) => (
  <Card className="border-border/60 bg-card rounded-3xl">
    <CardHeader className="pb-2 pt-4 px-5">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-4 w-4" />
        <CardTitle className="text-xs uppercase font-bold text-muted-foreground">
          Smart Community Tips
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2.5 px-5 pb-5 pt-1">
      {insights.map((insight, idx) => (
        <div
          key={idx}
          className="p-3 rounded-2xl bg-muted/30 border border-border/40 flex items-start gap-2.5"
        >
          <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-foreground leading-relaxed">{insight}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

/* ============================================================================
   6. Activity Journey
   ============================================================================ */

interface JourneyTimelineProps {
  events: TimelineEvent[];
}

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ events }) => (
  <Card className="border-border/60 bg-card rounded-3xl">
    <CardHeader className="p-5 pb-2">
      <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        Community History
      </CardTitle>
    </CardHeader>
    <CardContent className="p-5 pt-2 pl-7">
      <div className="relative border-l-2 border-primary/20 space-y-5 ml-2">
        {events.map((event) => (
          <div key={event.id} className="relative pl-5">
            <div className="absolute -left-[13px] top-0.5 p-1 rounded-full bg-card border-2 border-primary text-primary">
              {event.icon}
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold">{event.date}</p>
              <h4 className="text-xs font-bold text-foreground">{event.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/* ============================================================================
   7. Activity & Impact Portfolio
   ============================================================================ */

interface EnvironmentalPortfolioProps {
  reports: RecentReport[];
  certificates: Certificate[];
}

const EnvironmentalPortfolio: React.FC<EnvironmentalPortfolioProps> = ({
  reports,
  certificates,
}) => (
  <Card className="border-border/60 bg-card rounded-3xl overflow-hidden p-5">
    <div className="mb-4 flex items-center gap-2">
      <Layers className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-bold text-foreground">Activity & Achievements</h3>
    </div>

    <Tabs defaultValue="reports" className="w-full">
      <TabsList className="grid grid-cols-3 bg-muted/50 rounded-2xl p-1 mb-4">
        <TabsTrigger value="reports" className="rounded-xl text-xs font-semibold">Reports</TabsTrigger>
        <TabsTrigger value="certificates" className="rounded-xl text-xs font-semibold">Certificates</TabsTrigger>
        <TabsTrigger value="map" className="rounded-xl text-xs font-semibold">Area Map</TabsTrigger>
      </TabsList>

      <TabsContent value="reports" className="space-y-2">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="p-3 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-xs text-foreground">{report.title}</h4>
                <p className="text-[10px] text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</p>
              </div>
              <Badge variant="outline" className="capitalize text-[10px] font-semibold">{report.status}</Badge>
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-muted-foreground py-6">No reports submitted yet.</p>
        )}
      </TabsContent>

      <TabsContent value="certificates" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <div key={cert.id} className="p-3.5 rounded-2xl border border-primary/20 bg-primary/5 space-y-1.5">
              <div className="flex justify-between items-start">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">{cert.dateEarned}</span>
              </div>
              <h4 className="font-bold text-xs text-foreground">{cert.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-normal">{cert.description}</p>
              <Button size="sm" variant="outline" className="w-full text-xs font-semibold mt-2 gap-1 rounded-xl h-8">
                <Download className="h-3 w-3" /> Save Certificate
              </Button>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-xs text-muted-foreground py-6">No certificates available.</p>
        )}
      </TabsContent>

      <TabsContent value="map">
        <div className="h-40 w-full rounded-2xl bg-muted/30 border border-border/40 flex flex-col items-center justify-center gap-1.5">
          <MapIcon className="h-6 w-6 text-primary/60" />
          <p className="text-xs font-medium text-muted-foreground">Regional Hazard Map Active</p>
        </div>
      </TabsContent>
    </Tabs>
  </Card>
);

/* ============================================================================
   8. Recommended Actions
   ============================================================================ */

interface RecommendationsProps {
  items: string[];
}

const AiRecommendations: React.FC<RecommendationsProps> = ({ items }) => (
  <Card className="border-info/20 bg-info/5 rounded-3xl p-5">
    <div className="flex items-center gap-2 text-info mb-3">
      <Compass className="h-4 w-4" />
      <span className="text-xs uppercase font-bold text-muted-foreground">
        Recommended Actions
      </span>
    </div>
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-card border border-border/40 text-xs font-medium">
          <span className="text-foreground">{item}</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-info shrink-0" />
        </div>
      ))}
    </div>
  </Card>
);

/* ============================================================================
   9. Share Profile Modal
   ============================================================================ */

interface ShareCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  reputationScore: number;
  impactPoints: number;
  reportsSubmitted: number;
  levelName: string;
}

const ShareCardModal: React.FC<ShareCardModalProps> = ({
  open,
  onOpenChange,
  profile,
  reputationScore,
  impactPoints,
  reportsSubmitted,
  levelName,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md bg-card border-border text-foreground rounded-3xl p-6">
      <DialogHeader>
        <DialogTitle className="text-center text-lg font-bold text-foreground">
          ECHO Member Card
        </DialogTitle>
      </DialogHeader>

      <div className="p-5 rounded-2xl bg-muted/30 border border-border text-center space-y-3">
        <Avatar className="h-16 w-16 mx-auto ring-2 ring-primary/40">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">EC</AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-lg font-bold text-foreground">{profile?.full_name || "Community Member"}</h3>
          <p className="text-xs text-primary font-semibold">{levelName}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-b border-border/60 py-2.5 text-center">
          <div>
            <p className="text-[9px] uppercase font-bold text-muted-foreground">Impact Score</p>
            <p className="text-xs font-bold text-primary">{reputationScore}/100</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold text-muted-foreground">Impact Points</p>
            <p className="text-xs font-bold text-foreground">{impactPoints}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold text-muted-foreground">Reports</p>
            <p className="text-xs font-bold text-foreground">{reportsSubmitted}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-left">
            <p className="text-[9px] uppercase font-bold text-muted-foreground">Impact Status</p>
            <p className="text-xs font-semibold text-foreground">Active Member</p>
          </div>
          <QrCode className="h-8 w-8 text-foreground/70" />
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Button className="w-full font-bold rounded-xl h-9">
          Share Card
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

/* ============================================================================
   10. Main Page Component
   ============================================================================ */

const ProfilePage: React.FC = () => {
  const { user, profile, logout, userStats, loading } = useAuth();
  const { registeredIds } = useEventRegistrations();

  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [coverTheme, setCoverTheme] = useState("nature");
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!user || !supabase) return;
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        setDataError(null);

        const { data: reports, error: reportsError } = await supabase
          .from("hazard_reports")
          .select("id,title,status,verification_status,created_at,location")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (reportsError) throw reportsError;
        if (isMounted && reports) setRecentReports(reports as RecentReport[]);

        const { count, error: rankError } = await supabase
          .from("user_stats")
          .select("user_id", { count: "exact", head: true })
          .gt("eco_points", impactPoints);

        if (rankError) throw rankError;
        if (isMounted && typeof count === "number") setRank(count + 1);
      } catch (err: any) {
        console.error("Failed to load profile details:", err.message || err);
        if (isMounted) setDataError("Unable to load profile data.");
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [user, impactPoints]);

  const { currentLevel } = useMemo(
    () => calculateProgressToNextLevel(impactPoints),
    [impactPoints]
  );

  const verificationRate = useMemo(
    () =>
      impactStats.reportsSubmitted > 0
        ? Math.round((impactStats.verifiedReports / impactStats.reportsSubmitted) * 100)
        : 0,
    [impactStats.verifiedReports, impactStats.reportsSubmitted]
  );

  const reputationScore = useMemo(() => {
    let score = 50;
    score += Math.min(30, impactStats.verifiedReports * 5);
    score += Math.min(20, Math.round(verificationRate * 0.2));
    return Math.min(100, score);
  }, [impactStats.verifiedReports, verificationRate]);

  const aiInsights = useMemo(() => {
    const insights = [];
    if (verificationRate > 50) {
      insights.push(`Your reports get verified faster than ${Math.min(95, verificationRate + 10)}% of local submissions.`);
    } else {
      insights.push("Add photos to your reports to help speed up verification.");
    }
    insights.push(`Active contributions submitted across ${Math.max(1, impactStats.reportsSubmitted)} environmental categories.`);
    return insights;
  }, [verificationRate, impactStats.reportsSubmitted]);

  const environmentalBio = useMemo(() => {
    if (profile?.bio && profile.bio.trim().length > 0) return profile.bio;
    const name = profile?.full_name ? profile.full_name.split(" ")[0] : "Citizen";
    if (impactStats.reportsSubmitted > 0) {
      return `${name} has submitted ${impactStats.reportsSubmitted} environmental reports to keep our local community clean and safe.`;
    }
    return `${name} is an active member of the ECHO community environment group.`;
  }, [profile?.bio, profile?.full_name, impactStats.reportsSubmitted]);

  const journeyEvents = useMemo<TimelineEvent[]>(
    () => [
      {
        id: "1",
        title: "Joined ECHO",
        date: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Recent",
        icon: <User className="h-3 w-3" />,
      },
      {
        id: "2",
        title: "First Environmental Report",
        date: recentReports[recentReports.length - 1]?.created_at
          ? new Date(recentReports[recentReports.length - 1].created_at).toLocaleDateString()
          : "Active",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "3",
        title: `Reached ${currentLevel.name}`,
        date: "Current Rank",
        icon: <Leaf className="h-3 w-3" />,
      },
    ],
    [profile?.created_at, recentReports, currentLevel.name]
  );

  const sampleGoals: GoalItem[] = [
    { id: "1", title: "Reach Next ECHO Level", current: impactPoints, target: 500, unit: "pts", category: "points" },
    { id: "2", title: "Submit Verified Reports", current: impactStats.verifiedReports, target: 10, unit: "reports", category: "reports" },
  ];

  const { streakDays, activeWeeks } = useMemo(() => {
    const dates = recentReports
      .map((r) => r.created_at)
      .filter((d): d is string => Boolean(d))
      .map((d) => new Date(d));

    if (dates.length === 0) return { streakDays: 0, activeWeeks: 0 };

    const dayKeys = new Set(dates.map((d) => d.toISOString().slice(0, 10)));

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!dayKeys.has(cursor.toISOString().slice(0, 10))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (dayKeys.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const weekKeys = new Set(
      dates.map((d) => {
        const onejan = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil(
          ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
        );
        return `${d.getFullYear()}-W${week}`;
      })
    );

    return { streakDays: streak, activeWeeks: weekKeys.size };
  }, [recentReports]);

  const sampleCertificates: Certificate[] = [
    {
      id: "c1",
      title: "Community Member Award",
      issuer: "ECHO Platform",
      dateEarned: "2026",
      description: "Recognized for consistent local environmental contributions.",
      type: "Hero",
    },
  ];

  const sampleRecommendations = [
    "Join the next local weekend cleanup drive",
    "Complete your profile settings to earn bonus points",
    "Check recent hazard reports in your area",
  ];

  if (user && loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto pb-24">
        {dataError && (
          <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2.5 text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{dataError}</span>
          </div>
        )}

        {/* 1. Header */}
        <ProfileHeader
          profile={profile}
          user={user}
          currentLevelName={currentLevel.name}
          verificationRate={verificationRate}
          environmentalBio={environmentalBio}
          impactPoints={impactPoints}
          reportsSubmitted={impactStats.reportsSubmitted}
          rank={rank}
          earnedBadgesCount={ACHIEVEMENT_BADGES.filter((b) => impactPoints >= b.pointsRequired).length}
          coverTheme={coverTheme}
          onSelectCoverTheme={setCoverTheme}
          onEditClick={() => setEditOpen(true)}
          onShareClick={() => setShareOpen(true)}
        />

        {/* 2. Eco Score */}
        <ReputationScoreCard
          score={reputationScore}
          level="Active ECHO Contributor"
          trend="Steady (+4%)"
          confidence={94}
        />

        {/* 3. Quick Overview */}
        <EchoDnaMetrics
          trustRate={verificationRate}
          persona="Community Member"
          climateIndex={Math.min(100, reputationScore + 5)}
          ecoContribution={120}
        />

        {/* 4. Community Tips */}
        <AiCitizenInsights insights={aiInsights} />

        {/* 5. Streaks and Goals */}
        <StreaksAndGoals streakDays={streakDays} activeWeeks={activeWeeks} goals={sampleGoals} />

        {/* 6. Activity History */}
        <JourneyTimeline events={journeyEvents} />

        {/* 7. Achievements & Portfolio */}
        <EnvironmentalPortfolio reports={recentReports} certificates={sampleCertificates} />

        {/* 8. Next Actions */}
        <AiRecommendations items={sampleRecommendations} />

        {/* 9. Account Details */}
        <AccountInformation
          memberSince={profile?.created_at}
          region={profile?.region}
          organization={profile?.organization}
        />

        {/* 10. Footer */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
          <Button
            asChild
            variant="ghost"
            className="gap-2 text-muted-foreground rounded-xl text-xs font-semibold"
          >
            <Link to="/settings">
              <Settings className="h-3.5 w-3.5" /> Settings
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="gap-2 text-destructive hover:bg-destructive/10 rounded-xl text-xs font-semibold"
            onClick={() => logout()}
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </Button>
        </div>
      </div>

      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} />

      <ShareCardModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        profile={profile}
        reputationScore={reputationScore}
        impactPoints={impactPoints}
        reportsSubmitted={impactStats.reportsSubmitted}
        levelName={currentLevel.name}
      />
    </div>
  );
};

export default ProfilePage;
