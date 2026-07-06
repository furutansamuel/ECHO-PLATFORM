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
  AreaChart,
  Area
} from 'recharts';

const reportTrendData = [
  { name: 'Jan', reports: 400, resolved: 240 },
  { name: 'Feb', reports: 300, resolved: 139 },
  { name: 'Mar', reports: 200, resolved: 980 },
  { name: 'Apr', reports: 278, resolved: 390 },
  { name: 'May', reports: 189, resolved: 480 },
  { name: 'Jun', reports: 239, resolved: 380 },
  { name: 'Jul', reports: 349, resolved: 430 },
];

const categoryData = [
  { name: 'Waste', value: 400, color: '#10b981' },
  { name: 'Water', value: 300, color: '#3b82f6' },
  { name: 'Air', value: 200, color: '#f59e0b' },
  { name: 'Drainage', value: 278, color: '#ef4444' },
];

const pollutionTrendData = [
  { name: 'Mon', level: 30 },
  { name: 'Tue', level: 45 },
  { name: 'Wed', level: 25 },
  { name: 'Thu', level: 60 },
  { name: 'Fri', level: 50 },
  { name: 'Sat', level: 35 },
  { name: 'Sun', level: 20 },
];

const AnalyticsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hazard Reports Trend */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Hazard Reports Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reportTrendData}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="reports" stroke="#10b981" fillOpacity={1} fill="url(#colorReports)" strokeWidth={3} />
              <Area type="monotone" dataKey="resolved" stroke="#3b82f6" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hazard Categories Distribution */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Categories Distribution</h3>
        <div className="h-[300px] w-full flex flex-col md:flex-row items-center">
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-48 space-y-3 mt-4 md:mt-0">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{Math.round((item.value / 1178) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Air Quality Index Trend */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm lg:col-span-2">
        <h3 className="text-lg font-bold mb-6">Environmental Pollution Trends</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pollutionTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                cursor={{fill: 'rgba(16, 185, 129, 0.05)'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="level" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
