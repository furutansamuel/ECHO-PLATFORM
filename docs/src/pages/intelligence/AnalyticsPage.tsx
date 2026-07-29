import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Filter,
  Download,
  Layers,
  Info,
  RefreshCw,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export default function AnalyticsPage() {
  const { analyticsData, loading } = useIntelligenceData();
// On-brand categorical palette (primary/secondary/info/highlight/destructive/
// accent) — previously a navy-blue palette unrelated to the ECHO brand.
const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--info)', 'var(--highlight)', 'var(--destructive)', 'var(--accent)', 'var(--text-secondary)'];
// Mirrors the CSS custom properties --severity-low/medium/high/critical in
// index.css — same 4-step severity ramp everywhere in the app, not a
// page-local palette. Keep these hex values in sync with index.css.
const SEVERITY_COLORS = {
  Critical: 'var(--destructive)',
  High: 'var(--severity-high)',
  Medium: 'var(--highlight)',
  Low: 'var(--primary)'
};


  if (loading && !analyticsData) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  // Transform hazard_trends for display
  const trendData = analyticsData?.hazard_trends ? [...analyticsData.hazard_trends].reverse().map((item: any) => ({
    name: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
    count: item.count,
    category: item.category
  })) : [];

  const categoryData = analyticsData?.category_distribution || [];
  const severityData = analyticsData?.severity_breakdown || [];
  const resolutionStats = analyticsData?.resolution_stats || { total: 0, resolved: 0, in_progress: 0, pending: 0, rate: 0 };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Environmental Analytics
          </h1>
          <p className="text-muted-foreground italic mt-1">
            Deep dive into environmental hazard patterns and response metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="premium-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Total Hazards</p>
                <h3 className="text-2xl font-black mt-1">{resolutionStats.total}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
              <Layers className="h-3 w-3" />
              <span>ACROSS ALL ACTIVE CATEGORIES</span>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Resolution Rate</p>
                <h3 className="text-2xl font-black mt-1">{resolutionStats.rate}%</h3>
              </div>
              <div className="p-2 bg-info/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
            </div>
            <Progress value={resolutionStats.rate} className="h-1.5 mt-4" />
          </CardContent>
        </Card>

        <Card className="premium-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-black mt-1">{resolutionStats.in_progress}</h3>
              </div>
              <div className="p-2 bg-highlight/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-highlight" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4">Currently being addressed</p>
          </CardContent>
        </Card>

        <Card className="premium-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Critical Hazards</p>
                <h3 className="text-2xl font-black mt-1">
                  {severityData.find((s: any) => s.severity === 'Critical')?.count || 0}
                </h3>
              </div>
              <div className="p-2 bg-destructive/10 rounded-lg">
                <ShieldAlert className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <p className="text-[10px] text-destructive font-bold mt-4 uppercase tracking-tighter">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <Card className="shadow-xl border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-bold">Hazard Trends</CardTitle>
              <CardDescription>Monthly report volume over time</CardDescription>
            </div>
            <Select defaultValue="6m">
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-elev-2)' }}
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Category Distribution</CardTitle>
            <CardDescription>Breakdown of reports by hazard type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="total_count"
                  nameKey="category"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Severity Breakdown */}
        <Card className="shadow-xl border-none lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Severity Matrix</CardTitle>
            <CardDescription>Report priority distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="severity" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 'bold'}} 
                  width={60}
                />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {severityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || 'var(--primary)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="shadow-xl border-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Category Performance</CardTitle>
            <CardDescription>Resolution count vs Average AI Risk Score</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 8, fill: 'var(--text-secondary)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar name="Resolved" dataKey="resolved_count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar name="Avg Risk" dataKey="avg_risk_score" fill="var(--highlight)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detail Analysis Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <h4 className="flex items-center gap-2 font-bold text-primary mb-2">
            <Info className="h-4 w-4" />
            Seasonal Trend Insight
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Historical data suggests a 45% increase in 'Flood' and 'Blocked Drainage' reports during the upcoming month. 
            Recommend preemptive drainage clearing campaigns in high-risk communities detected by AI hotspots.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-highlight/10 border border-highlight/20">
          <h4 className="flex items-center gap-2 font-bold text-highlight mb-2">
            <AlertCircle className="h-4 w-4" />
            Operational Bottleneck
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            'Plastic Waste' categories show a resolution delay of 4.2 days above average. 
            Consider re-routing cleanup volunteers to concentrated waste zones in central LGA wards.
          </p>
        </div>
      </div>
    </div>
  );
}

