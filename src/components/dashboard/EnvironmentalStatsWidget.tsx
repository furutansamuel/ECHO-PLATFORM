import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { CountUp } from "@/components/ui/count-up";
import { useReportsStore } from "@/hooks/use-reports-store";

export function EnvironmentalStatsWidget() {
  const { stats } = useReportsStore();

  const statItems = [
    {
      title: "Reports Submitted",
      value: stats.hazardsReported,
      icon: Icons.fileText,
      color: "text-blue-500",
    },
    {
      title: "Events Joined",
      value: 78,
      icon: Icons.calendar,
      color: "text-purple-500",
    },
    {
      title: "Impact Points",
      value: stats.ecoPoints,
      icon: Icons.award,
      color: "text-yellow-500",
    },
    {
      title: "Community Rank",
      value: 12,
      icon: Icons.trophy,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 col-span-full">
      {statItems.map((stat, index) => (
        <Card key={index} className="bg-background/60 backdrop-blur-sm premium-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp
                start={0}
                end={stat.value}
                duration={2.5}
                separator=","
              />
            </div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
