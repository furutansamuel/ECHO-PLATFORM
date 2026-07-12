import React from 'react';
import { Link } from 'react-router-dom';
import { useDemo } from '@/hooks/use-demo';
import { useAuth } from '@/hooks/use-auth';
import { EnvironmentalImpactSummary } from '@/components/profile/EnvironmentalImpactSummary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Presentation, RefreshCcw, ShieldAlert } from 'lucide-react';
import { DashboardSearch } from '@/components/dashboard/DashboardSearch';
import { IntelligenceDashboard } from '@/components/dashboard/IntelligenceDashboard';
import { RecentReports } from '@/components/dashboard/RecentReports';
import { CleanupEventsWidget } from '@/components/dashboard/CleanupEventsWidget';
import { RewardsSummaryWidget } from '@/components/dashboard/RewardsSummaryWidget';
import { CommunityActivityWidget } from '@/components/dashboard/CommunityActivityWidget';
import { VolunteerWidget } from '@/components/dashboard/VolunteerWidget';
import { CampaignWidget } from '@/components/dashboard/CampaignWidget';
import { LeaderboardWidget } from '@/components/dashboard/LeaderboardWidget';
import { ChallengeWidget } from '@/components/dashboard/ChallengeWidget';

export default function CitizenDashboard() {
  const { userStats } = useAuth();

const impactStats = userStats ?? {
  reportsSubmitted: 0,
  verifiedReports: 0,
  cleanupEventsJoined: 0,
  environmentalScore: 0,
  communitiesHelped: 0,
  volunteerHours: 0,
};
  const { isDemoMode, isPresentationMode, setPresentationMode, resetDemo } = useDemo();

  if (isPresentationMode) {
    return (
      <div className="space-y-8 p-6 md:p-12 bg-background min-h-[100dvh]">
        <div className="flex items-center justify-between border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-primary">ECHO PLATFORM</h1>
            <p className="text-muted-foreground font-medium">Environmental Community Health Observatory • Showcase Mode</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-1 text-sm font-bold border-primary/20 bg-primary/5 text-primary">3MTT KNOWLEDGE SHOWCASE 2.0</Badge>
            <Button variant="outline" size="sm" onClick={() => setPresentationMode(false)} className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Exit
            </Button>
          </div>
        </div>

        <IntelligenceDashboard />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentReports />
          </div>
          <div className="space-y-8">
            <RewardsSummaryWidget />
            <CommunityActivityWidget />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <CampaignWidget />
          <VolunteerWidget />
          <LeaderboardWidget />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {isDemoMode && (
        <Card className="border-primary/20 bg-primary/5 shadow-none">
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Demo Mode Active</p>
                <p className="text-xs text-muted-foreground">You are exploring ECHO with pre-seeded data for the showcase.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetDemo} className="text-xs h-8 gap-1.5">
                <RefreshCcw className="h-3.5 w-3.5" /> Reset Demo
              </Button>
              <Button variant="default" size="sm" onClick={() => setPresentationMode(true)} className="text-xs h-8 gap-1.5">
                <Presentation className="h-3.5 w-3.5" /> Presentation Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Environmental Intelligence</h1>
          <p className="text-muted-foreground font-medium">Real-time community health monitoring and impact tracking.</p>
        </div>
        <div className="flex w-full flex-col-reverse items-stretch gap-2 md:w-auto md:flex-row md:items-center">
          <div className="w-full md:w-auto">
            <DashboardSearch />
          </div>
          <Button size="lg" className="h-11 shadow-premium" asChild>
            <Link to="/report">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Report Hazard
            </Link>
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-12 gap-6 auto-rows-min">
        {/* Main Intelligence Section - Large Bento Piece */}
        <div className="col-span-12 lg:col-span-9 row-span-2">
          <IntelligenceDashboard />
      div className="col-span-12">
    <EnvironmentalImpactSummary stats={impactStats} />
  </div>
        </div>

        {/* Recent Reports - Wide Bento Piece */}
        <div className="col-span-12 lg:col-span-8">
          <RecentReports />
        </div>

        {/* Rewards Summary - Tall Bento Piece */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2">
          <RewardsSummaryWidget />
        </div>

        {/* Community Activity - Square Bento Piece */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <CommunityActivityWidget />
        </div>

        {/* Volunteer & Campaigns - Dynamic Pieces */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <VolunteerWidget />
        </div>
        
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <CampaignWidget />
        </div>

        {/* Leaderboard & Cleanup Events - Bottom Row */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <LeaderboardWidget />
          <CleanupEventsWidget />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <ChallengeWidget />
        </div>
      </div>
    </div>
  );
}
