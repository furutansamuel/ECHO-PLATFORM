import { memo } from 'react';
import { ShieldAlert, Activity, Zap, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AIKeyMetricsProps {
  avgRiskScore: number;
  resolutionRate?: number;
  confidenceScore: number;
  totalReports?: number;
  climateImpact?: number;
}

function AIKeyMetricsBase({
  avgRiskScore,
  resolutionRate,
  confidenceScore,
  totalReports,
  climateImpact,
}: AIKeyMetricsProps) {
  const metrics = [
    { key: 'risk', icon: ShieldAlert, tone: 'text-destructive', label: 'Avg Risk', value: (avgRiskScore * 10).toFixed(1) },
    { key: 'resolution', icon: Activity, tone: 'text-blue-500', label: 'Resol. Rate', value: `${resolutionRate ?? 0}%` },
    { key: 'confidence', icon: Zap, tone: 'text-amber-500', label: 'Confidence', value: `${(confidenceScore * 100).toFixed(0)}%` },
    { key: 'reports', icon: AlertCircle, tone: 'text-primary', label: 'Reports', value: totalReports ?? 0 },
  ];

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-card to-accent/5 [contain:content]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Activity className="h-5 w-5 text-accent" />
          Key Metrics
        </CardTitle>
        <CardDescription>Live indicators behind the summary above</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {metrics.map(({ key, icon: Icon, tone, label, value }) => (
            <div key={key} className="flex flex-col items-center p-3 rounded-lg bg-background shadow-sm border border-border/50">
              <Icon className={`h-5 w-5 mb-2 ${tone}`} />
              <span className="text-xs font-bold uppercase text-muted-foreground">{label}</span>
              <span className="text-xl font-black">{value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Climate Impact Level</span>
            <span>{climateImpact ?? 0}%</span>
          </div>
          <Progress value={climateImpact || 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

export const AIKeyMetrics = memo(AIKeyMetricsBase);

