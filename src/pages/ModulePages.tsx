import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnvironmentalMap from "@/components/intelligence/EnvironmentalMap/EnvironmentalMap";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { EnvironmentalStatsWidget } from "@/components/dashboard/EnvironmentalStatsWidget";

export function EnvironmentalHealthModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Environmental Health</h1>
          <p className="text-muted-foreground italic">Real-time intelligence and monitoring</p>
        </div>
      </div>
      <EnvironmentalStatsWidget />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Interactive Hazard Map</CardTitle>
            <CardDescription>Real-time location of reported hazards</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] p-0">
            <EnvironmentalMap />
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <RecentReports />
        </div>
      </div>
    </div>
  );
}

export function CommunityEngagementModule() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black tracking-tight uppercase">Community Engagement</h1>
      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Cleanup Events</TabsTrigger>
          <TabsTrigger value="forum">Community Forum</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-4">
          <p className="text-muted-foreground italic">Upcoming cleanup activities in your area.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function KnowledgeCentreModule() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black tracking-tight uppercase">Knowledge Centre</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">Resource #{i}</CardTitle>
              <CardDescription>Environmental safety guidelines</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
