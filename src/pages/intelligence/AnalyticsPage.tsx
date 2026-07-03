import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
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
  PieChart as PieChartIcon, 
  Filter,
  Download,
  Calendar,
  Layers,
  Info,
  RefreshCw,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export default function AnalyticsPage() {
  const { analyticsData, hazardReports, intelligenceSummary, aiAnalysis, loading } = useIntelligenceData();
const COLORS = ['#1B5E20', '#2E7D32', '#43A047', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9'];
const SEVERITY_COLORS = {
  Critical: '#C62828',
  High: '#EF5350',
  Medium: '#F9A825',
  Low: '#81C784'
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
            <div className="mt-4 flex items-center gap-1 text-[10px] text-green-600 font-bold">
              <TrendingUp className="h-3 w-3" />
              <span>12% INCREASE FROM LAST MONTH</span>
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
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
              <div className="p-2 bg-amber-100 rounded-lg">
                <RefreshCw className="h-5 w-5 text-amber-600" />
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
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-[10px] text-red-600 font-bold mt-4 uppercase tracking-tighter">Requires immediate attention</p>
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
                    <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1B5E20" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#616161'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#616161'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#1B5E20', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="count" stroke="#1B5E20" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
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
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0E0E0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="severity" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#616161', fontWeight: 'bold'}} 
                  width={60}
                />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {severityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || '#1B5E20'} />
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 8, fill: '#616161'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#616161'}} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar name="Resolved" dataKey="resolved_count" fill="#1B5E20" radius={[4, 4, 0, 0]} />
                <Bar name="Avg Risk" dataKey="avg_risk_score" fill="#F9A825" radius={[4, 4, 0, 0]} />
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
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
          <h4 className="flex items-center gap-2 font-bold text-amber-700 mb-2">
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
