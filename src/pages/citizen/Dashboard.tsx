import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { EnvironmentalImpactSummary } from '@/components/profile/EnvironmentalImpactSummary';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
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

  return (
    <div className="space-y-6 p-4 md:p-6">
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
  {/* Environmental Impact Summary - Top KPI Section */}
  <div className="col-span-12">
    <EnvironmentalImpactSummary stats={impactStats} />
  </div>

  {/* Main Intelligence Section */}
  <div className="col-span-12 lg:col-span-8">
    <IntelligenceDashboard />
  </div>

  {/* Rewards Summary */}
  <div className="col-span-12 md:col-span-6 lg:col-span-4">
    <RewardsSummaryWidget />
  </div>

  {/* Recent Reports */}
  <div className="col-span-12 lg:col-span-8">
    <RecentReports />
  </div>

  {/* Community Widgets */}
  <div className="col-span-12 md:col-span-6 lg:col-span-4">
    <CommunityActivityWidget />
  </div>

  <div className="col-span-12 md:col-span-6 lg:col-span-4">
    <VolunteerWidget />
  </div>

  <div className="col-span-12 md:col-span-6 lg:col-span-4">
    <CampaignWidget />
  </div>

  {/* Bottom Widgets */}
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
