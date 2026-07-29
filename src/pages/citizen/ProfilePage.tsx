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
  DialogTrigger,
} from "@/components/ui/dialog";

// Icons
import {
  Award,
  CheckCircle,
  CheckCircle2,
  Clock,
  Edit3,
  FileText,
  Globe,
  Image as ImageIcon,
  Leaf,
  LogOut,
  MapPin,
  Settings,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
  Zap,
  AlertCircle,
  Sparkles,
  Camera,
  Share2,
  Flame,
  Target,
  Compass,
  Download,
  Check,
  ArrowUpRight,
  Map as MapIcon,
  Layers,
  Activity,
  Lightbulb,
  QrCode,
} from "lucide-react";

// Interfaces & Types
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

interface RecentActivity {
  id: string;
  type: "verification" | "report";
  description: string;
  date: string;
  points: number | null;
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

/* ============================================================================
   1. Header Sub-Component (ECHO Premium Glassmorphism Vision)
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
  user,
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

  const activeBanner = profile?.cover_url || COVER_THEMES[coverTheme] || COVER_THEMES.nature;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl bg-gradient-to-b from-sidebar/20 via-background to-background">
      
      {/* Dynamic Cover Banner */}
      <div className="h-48 sm:h-56 md:h-64 lg:h-72 w-full relative overflow-hidden bg-sidebar">
        <img
          src={activeBanner}
          alt="ECHO Environmental Intelligence Banner"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-700 ease-out filter brightness-90 saturate-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30 backdrop-blur-[2px]" />
        
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
          <Button
            size="sm"
            onClick={onShareClick}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-full font-bold text-xs gap-1.5 shadow-lg"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share ID Card
          </Button>
          <Badge className="bg-sidebar-primary/20 text-sidebar-primary border-sidebar-primary/30 backdrop-blur-md px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-sidebar-primary animate-pulse" />
            ECHO Intelligence
          </Badge>
        </div>
      </div>

      {/* Header Profile Info */}
      <div className="relative px-4 sm:px-6 md:px-8 pb-8 -mt-20 sm:-mt-24">
        <div className="flex flex-col items-center text-center">
          
          <div className="relative mb-4 group">
            <div className="p-1.5 rounded-3xl bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/15 shadow-2xl ring-1 ring-secondary/30">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-2xl object-cover shadow-inner">
                <AvatarImage src={profile?.avatar_url || ""} className="object-cover" alt="Profile avatar" />
                <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-white text-3xl sm:text-4xl font-black rounded-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-status-safe border-2 border-background shadow-md" title="Active ECHO Sentinel" />
          </div>

          <div className="flex items-center justify-center gap-2 max-w-full px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground truncate">
              {profile?.full_name || "ECHO Sentinel"}
            </h1>
            <div className="p-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary" title="Verified ECHO Identity">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 fill-secondary/20" />
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-xl mt-2 leading-relaxed px-4">
            "{environmentalBio}"
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary/10 border border-secondary/20 text-secondary backdrop-blur-md shadow-sm">
              <Leaf className="h-3.5 w-3.5 text-secondary" />
              {currentLevelName}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-info/10 border border-info/20 text-info backdrop-blur-md shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-info" />
              {verificationRate}% Trust Rate
            </span>

            {profile?.region && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-highlight/10 border border-highlight/20 text-highlight backdrop-blur-md shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-highlight" />
                {profile.region}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full mt-8">
            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-md text-center shadow-sm hover:border-secondary/30 transition-all">
              <Award className="h-5 w-5 mx-auto mb-1 text-secondary" />
              <p className="text-xl sm:text-2xl font-black text-foreground">{impactPoints.toLocaleString()}</p>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">Impact Points</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-md text-center shadow-sm hover:border-secondary/30 transition-all">
              <FileText className="h-5 w-5 mx-auto mb-1 text-accent" />
              <p className="text-xl sm:text-2xl font-black text-foreground">{reportsSubmitted}</p>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">Reports</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-md text-center shadow-sm hover:border-secondary/30 transition-all">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-info" />
              <p className="text-xl sm:text-2xl font-black text-foreground">{rank ? `#${rank}` : "—"}</p>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">Community Rank</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-md text-center shadow-sm hover:border-secondary/30 transition-all">
              <Star className="h-5 w-5 mx-auto mb-1 text-highlight" />
              <p className="text-xl sm:text-2xl font-black text-foreground">{earnedBadgesCount}</p>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">Badges</p>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Trigger (FAB) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
        <div className="relative">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl ring-4 ring-background transition-transform active:scale-95"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            title="Profile Options"
          >
            <Edit3 className="h-5 w-5" />
          </Button>

          {showQuickMenu && (
            <div className="absolute bottom-14 right-0 w-52 py-2 rounded-2xl bg-background/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl space-y-1 animate-in fade-in slide-in-from-bottom-2">
              <button
                className="w-full px-4 py-2 text-left text-xs font-bold text-foreground hover:bg-secondary/10 flex items-center gap-2 transition-colors"
                onClick={() => {
                  setShowQuickMenu(false);
                  onEditClick();
                }}
              >
                <User className="h-4 w-4 text-secondary" />
                Edit Profile
              </button>
              <button
                className="w-full px-4 py-2 text-left text-xs font-bold text-foreground hover:bg-secondary/10 flex items-center gap-2 transition-colors"
                onClick={() => {
                  setShowQuickMenu(false);
                  setShowCoverPicker(!showCoverPicker);
                }}
              >
                <ImageIcon className="h-4 w-4 text-info" />
                Personalize Cover
              </button>
            </div>
          )}

          {showCoverPicker && (
            <div className="absolute bottom-28 right-0 w-64 p-3 rounded-2xl bg-background/95 backdrop-blur-xl border border-white/20 shadow-2xl space-y-2 animate-in fade-in">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider mb-2">Select Theme</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(COVER_THEMES).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      onSelectCoverTheme(theme);
                      setShowCoverPicker(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold capitalize rounded-xl border transition-all text-left ${
                      coverTheme === theme
                        ? "bg-secondary/20 border-secondary text-secondary"
                        : "bg-muted/50 border-transparent hover:bg-muted"
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
   2. AI Environmental Reputation Score Card
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
    <Card className="border-secondary/20 bg-gradient-to-br from-sidebar/20 via-card to-card backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="relative h-24 w-24 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col items-center justify-center shrink-0 shadow-inner">
              <span className="text-3xl font-black text-secondary">{score}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                <h3 className="text-xs uppercase font-black text-muted-foreground tracking-widest">
                  AI Environmental Reputation
                </h3>
              </div>
              <p className="text-xl font-black text-foreground mt-0.5">{level}</p>
              <div className="flex items-center gap-1 mt-1 text-highlight">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < starsCount ? "fill-highlight" : "text-muted/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
            <div>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">Trend</p>
              <p className="text-sm font-black text-secondary flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" />
                {trend}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">AI Confidence</p>
              <p className="text-sm font-black text-foreground mt-1">{confidence}% Verified</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ============================================================================
   3. ECHO DNA & Intelligence Identity Metrics
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card className="border-white/10 bg-card/60 backdrop-blur-md rounded-2xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-black text-muted-foreground">Environmental Persona</p>
          <p className="text-sm font-black text-foreground truncate">{persona}</p>
        </div>
      </CardContent>
    </Card>

    <Card className="border-white/10 bg-card/60 backdrop-blur-md rounded-2xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-info/10 text-info">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-black text-muted-foreground">Climate Impact Index</p>
          <p className="text-sm font-black text-foreground">{climateIndex} / 100</p>
        </div>
      </CardContent>
    </Card>

    <Card className="border-white/10 bg-card/60 backdrop-blur-md rounded-2xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-accent/20 text-accent-foreground">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-black text-muted-foreground">Eco Contribution Index</p>
          <p className="text-sm font-black text-foreground">{ecoContribution} pts/mo</p>
        </div>
      </CardContent>
    </Card>

    <Card className="border-white/10 bg-card/60 backdrop-blur-md rounded-2xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-highlight/10 text-highlight">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-black text-muted-foreground">Citizen Trust Meter</p>
          <p className="text-sm font-black text-foreground">{trustRate}% Verified</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ============================================================================
   4. Streaks & Goals Component
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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card className="border-highlight/20 bg-highlight/5 backdrop-blur-md rounded-3xl md:col-span-1 flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-highlight">
          <Flame className="h-5 w-5 fill-highlight" />
          <CardTitle className="text-xs uppercase font-black tracking-widest text-muted-foreground">
            Environmental Streaks
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-black text-foreground">{streakDays} Days</p>
          <p className="text-xs text-muted-foreground font-bold">Active Reporting Streak</p>
        </div>
        <Separator />
        <div>
          <p className="text-3xl font-black text-foreground">{activeWeeks} Weeks</p>
          <p className="text-xs text-muted-foreground font-bold">Weeks With Reporting Activity</p>
        </div>
      </CardContent>
    </Card>

    <Card className="border-white/10 bg-card shadow-lg rounded-3xl md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-secondary">
          <Target className="h-5 w-5" />
          <CardTitle className="text-xs uppercase font-black tracking-widest text-muted-foreground">
            Environmental Impact Goals
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progressPercent = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <div key={goal.id} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">{goal.title}</span>
                <span className="text-secondary">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  </div>
);

/* ============================================================================
   5. AI Dynamic Citizen Insights
   ============================================================================ */

interface AiInsightsProps {
  insights: string[];
}

const AiCitizenInsights: React.FC<AiInsightsProps> = ({ insights }) => (
  <Card className="border-secondary/20 bg-gradient-to-br from-sidebar/10 via-card to-card backdrop-blur-md rounded-3xl">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2 text-secondary">
        <Sparkles className="h-5 w-5" />
        <CardTitle className="text-xs uppercase font-black tracking-widest text-muted-foreground">
          AI Citizen Intelligence Insights
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
      {insights.map((insight, idx) => (
        <div
          key={idx}
          className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-start gap-3"
        >
          <Lightbulb className="h-4 w-4 text-highlight shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-foreground leading-relaxed">{insight}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

/* ============================================================================
   6. Environmental Journey Timeline
   ============================================================================ */

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  icon: React.ReactNode;
}

interface JourneyTimelineProps {
  events: TimelineEvent[];
}

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ events }) => (
  <Card className="border-white/10 bg-card shadow-lg rounded-3xl">
    <CardHeader>
      <CardTitle className="text-lg font-black text-foreground flex items-center gap-2">
        <Clock className="h-5 w-5 text-secondary" />
        Environmental Journey Timeline
      </CardTitle>
    </CardHeader>
    <CardContent className="pl-6">
      <div className="relative border-l-2 border-secondary/30 space-y-6 ml-3">
        {events.map((event) => (
          <div key={event.id} className="relative pl-6">
            <div className="absolute -left-[17px] top-0 p-1.5 rounded-full bg-background border-2 border-secondary text-secondary">
              {event.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold">{event.date}</p>
              <h4 className="text-sm font-black text-foreground">{event.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/* ============================================================================
   7. Portfolio & Certificates
   ============================================================================ */

interface EnvironmentalPortfolioProps {
  reports: RecentReport[];
  certificates: Certificate[];
}

const EnvironmentalPortfolio: React.FC<EnvironmentalPortfolioProps> = ({
  reports,
  certificates,
}) => (
  <Card className="border-white/10 bg-card shadow-lg rounded-3xl overflow-hidden">
    <CardHeader>
      <CardTitle className="text-lg font-black text-foreground flex items-center gap-2">
        <Layers className="h-5 w-5 text-secondary" />
        Environmental Portfolio & Verified Impact
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-5 bg-muted/50 rounded-2xl p-1 mb-6">
          <TabsTrigger value="reports" className="rounded-xl text-xs font-bold">Reports</TabsTrigger>
          <TabsTrigger value="certificates" className="rounded-xl text-xs font-bold">Certificates</TabsTrigger>
          <TabsTrigger value="map" className="rounded-xl text-xs font-bold">Heat Map</TabsTrigger>
          <TabsTrigger value="photos" className="rounded-xl text-xs font-bold hidden sm:block">Photos</TabsTrigger>
          <TabsTrigger value="impact" className="rounded-xl text-xs font-bold hidden sm:block">Story</TabsTrigger>
        </TabsList>

        {/* Tab 1: Reports */}
        <TabsContent value="reports" className="space-y-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl bg-muted/30 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-foreground">{report.title}</h4>
                  <p className="text-xs text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</p>
                </div>
                <Badge className="capitalize text-[10px]">{report.status}</Badge>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No reports in portfolio yet.</p>
          )}
        </TabsContent>

        {/* Tab 2: Certificates */}
        <TabsContent value="certificates" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.length > 0 ? (
            certificates.map((cert) => (
              <div key={cert.id} className="p-4 rounded-2xl border border-secondary/20 bg-secondary/5 space-y-2">
                <div className="flex justify-between items-start">
                  <Award className="h-6 w-6 text-secondary" />
                  <span className="text-[10px] font-bold text-muted-foreground">{cert.dateEarned}</span>
                </div>
                <h4 className="font-black text-sm text-foreground">{cert.title}</h4>
                <p className="text-xs text-muted-foreground">{cert.description}</p>
                <Button size="sm" variant="outline" className="w-full text-xs font-bold mt-2 gap-1 rounded-xl">
                  <Download className="h-3 w-3" /> Download Certificate
                </Button>
              </div>
            ))
          ) : (
            <p className="col-span-2 text-center text-sm text-muted-foreground py-8">No certificates earned yet.</p>
          )}
        </TabsContent>

        {/* Tab 3: Heat Map */}
        <TabsContent value="map">
          <div className="h-48 w-full rounded-2xl bg-muted/40 border border-border flex flex-col items-center justify-center gap-2">
            <MapIcon className="h-8 w-8 text-secondary/50" />
            <p className="text-xs font-bold text-muted-foreground">Interactive Regional Heat Map Active</p>
          </div>
        </TabsContent>

        {/* Tab 4: Photos */}
        <TabsContent value="photos">
          <p className="text-center text-sm text-muted-foreground py-8">No field photos uploaded.</p>
        </TabsContent>

        {/* Tab 5: Story */}
        <TabsContent value="impact">
          <p className="text-center text-sm text-muted-foreground py-8">Citizen impact story actively being recorded.</p>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

/* ============================================================================
   8. AI Recommendations
   ============================================================================ */

interface RecommendationsProps {
  items: string[];
}

const AiRecommendations: React.FC<RecommendationsProps> = ({ items }) => (
  <Card className="border-info/20 bg-info/5 backdrop-blur-md rounded-3xl">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2 text-info">
        <Compass className="h-5 w-5" />
        <CardTitle className="text-xs uppercase font-black tracking-widest text-muted-foreground">
          Recommended Next Actions
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-background/50 border border-white/10 text-xs font-bold">
          <span className="text-foreground">{item}</span>
          <ArrowUpRight className="h-4 w-4 text-info" />
        </div>
      ))}
    </CardContent>
  </Card>
);

/* ============================================================================
   9. Shareable Impact Card Modal
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
    <DialogContent className="sm:max-w-md bg-gradient-to-br from-sidebar via-background to-black border-sidebar-primary/30 text-foreground rounded-3xl p-6">
      <DialogHeader>
        <DialogTitle className="text-center text-xl font-black text-sidebar-primary">
          ECHO Citizen Identity Card
        </DialogTitle>
      </DialogHeader>

      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-center space-y-4">
        <Avatar className="h-20 w-20 mx-auto ring-2 ring-sidebar-primary">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback className="bg-secondary text-white font-black">EC</AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-xl font-black text-white">{profile?.full_name || "ECHO Citizen"}</h3>
          <p className="text-xs font-bold text-sidebar-primary">{levelName}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-b border-white/10 py-3 text-center">
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Reputation</p>
            <p className="text-sm font-black text-sidebar-primary">{reputationScore}/100</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Points</p>
            <p className="text-sm font-black text-white">{impactPoints}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Reports</p>
            <p className="text-sm font-black text-white">{reportsSubmitted}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">ECHO Intelligence Network</p>
            <p className="text-xs font-black text-white">Verified Sentinel</p>
          </div>
          <QrCode className="h-10 w-10 text-white/80" />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl">
          Download ID
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

/* ============================================================================
   10. Main Component: ProfilePage
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
        if (isMounted) setDataError("Unable to load latest stats. Please try refreshing.");
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [user, impactPoints]);

  const { currentLevel, nextLevel, progress, pointsToNext } = useMemo(
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

  // Dynamic AI Reputation Calculation
  const reputationScore = useMemo(() => {
    let score = 50;
    score += Math.min(30, impactStats.verifiedReports * 5);
    score += Math.min(20, Math.round(verificationRate * 0.2));
    return Math.min(100, score);
  }, [impactStats.verifiedReports, verificationRate]);

  // Dynamic AI Insights Generator
  const aiInsights = useMemo(() => {
    const insights = [];
    if (verificationRate > 50) {
      insights.push(`Your reports are verified faster than ${Math.min(95, verificationRate + 10)}% of citizens.`);
    } else {
      insights.push("Submit clear photos to increase your verification speed.");
    }
    insights.push(`You have active contributions across ${Math.max(1, impactStats.reportsSubmitted)} environmental sectors.`);
    insights.push("Weekend community activities represent your highest engagement window.");
    return insights;
  }, [verificationRate, impactStats.reportsSubmitted]);

  // Prefers the citizen's own bio (now a real, editable field) and only
  // falls back to an auto-generated line when they haven't written one.
  const environmentalBio = useMemo(() => {
    if (profile?.bio && profile.bio.trim().length > 0) return profile.bio;
    const name = profile?.full_name ? profile.full_name.split(" ")[0] : "Citizen";
    if (impactStats.reportsSubmitted > 0) {
      return `${name} has submitted ${impactStats.reportsSubmitted} environmental reports, protecting local communities through active citizen participation.`;
    }
    return `${name} is an active ECHO Environmental Sentinel contributing to citizen-led climate intelligence.`;
  }, [profile?.bio, profile?.full_name, impactStats.reportsSubmitted]);

  const journeyEvents = useMemo<TimelineEvent[]>(
    () => [
      {
        id: "1",
        title: "Joined ECHO Intelligence",
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
        date: "Current Level",
        icon: <Leaf className="h-3 w-3" />,
      },
    ],
    [profile?.created_at, recentReports, currentLevel.name]
  );

  const sampleGoals: GoalItem[] = [
    { id: "1", title: "Reach Eco Guardian", current: impactPoints, target: 500, unit: "pts", category: "points" },
    { id: "2", title: "Submit Verified Reports", current: impactStats.verifiedReports, target: 10, unit: "reports", category: "reports" },
  ];

  // Real streak/active-weeks derived from the user's own report timestamps
  // (recentReports), not fabricated placeholders. streakDays = consecutive
  // days ending today or yesterday with at least one report. activeWeeks =
  // count of distinct ISO weeks with at least one report.
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
      title: "Verified Community Sentinel",
      issuer: "ECHO Intelligence",
      dateEarned: "2026",
      description: "Awarded for exceptional environmental reporting accuracy and community trust.",
      type: "Hero",
    },
  ];

  const sampleRecommendations = [
    "Attend upcoming Saturday local cleanup event",
    "Complete remaining profile details to maximize trust score",
    "Review local hazard alerts in your ward",
  ];

  if (user && loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto pb-24">
        
        {dataError && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{dataError}</span>
          </div>
        )}

        {/* 1. Profile Header */}
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

        {/* 2. AI Reputation Score */}
        <ReputationScoreCard
          score={reputationScore}
          level="Trusted Environmental Citizen"
          trend="Improving (+4%)"
          confidence={94}
        />

        {/* 3. ECHO DNA Identity Metrics */}
        <EchoDnaMetrics
          trustRate={verificationRate}
          persona="Community Sentinel"
          climateIndex={Math.min(100, reputationScore + 5)}
          ecoContribution={120}
        />

        {/* 4. AI Dynamic Insights */}
        <AiCitizenInsights insights={aiInsights} />

        {/* 5. Streaks and Goals */}
        <StreaksAndGoals streakDays={streakDays} activeWeeks={activeWeeks} goals={sampleGoals} />

        {/* 6. Environmental Journey Timeline */}
        <JourneyTimeline events={journeyEvents} />

        {/* 7. Environmental Portfolio & Heat Map */}
        <EnvironmentalPortfolio reports={recentReports} certificates={sampleCertificates} />

        {/* 8. AI Recommendations */}
        <AiRecommendations items={sampleRecommendations} />

        {/* 9. Account Information */}
        <AccountInformation
          memberSince={profile?.created_at}
          region={profile?.region}
          organization={profile?.organization}
        />

        {/* 10. Actions Footer */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="ghost" className="gap-2 text-muted-foreground rounded-xl">
            <Settings className="h-4 w-4" /> Settings & Security
          </Button>
          <Button
            variant="ghost"
            className="gap-2 text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Share Identity Modal */}
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
