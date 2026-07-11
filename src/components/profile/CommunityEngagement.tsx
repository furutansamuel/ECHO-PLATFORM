import { memo } from 'react';
import { Users, Megaphone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Campaign {
  id: string | number;
  emoji: string;
  title: string;
  participants: number;
  status: string;
}

interface Volunteer {
  id: string | number;
  emoji: string;
  title: string;
  date: string;
  location: string;
}

interface CommunityEngagementProps {
  isDemo: boolean;
  campaigns: Campaign[];
  volunteers: Volunteer[];
}

function CommunityEngagementBase({ isDemo, campaigns, volunteers }: CommunityEngagementProps) {
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').slice(0, 3);
  const recentVolunteering = volunteers.slice(0, 3);

  return (
    <Card className="border-muted/20 [contain:content]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Community Engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" /> My Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDemo && activeCampaigns.length > 0 ? (
                activeCampaigns.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg bg-primary/5">
                    <span className="text-xl">{c.emoji}</span>
                    <div className="flex-grow">
                      <p className="text-xs font-bold">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground">{c.participants} participants</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none text-[9px]">Active</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No active campaigns yet.</p>
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
              {isDemo && recentVolunteering.length > 0 ? (
                recentVolunteering.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                    <span className="text-xl">{v.emoji}</span>
                    <div className="flex-grow">
                      <p className="text-xs font-bold">{v.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {v.date} • {v.location}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-none text-[9px]">Registered</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No volunteer activities yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

export const CommunityEngagement = memo(CommunityEngagementBase);
