import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  ChevronRight, 
  FileText,
  Clock,
  ArrowUpDown,
  ListFilter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { VerificationBadge } from '@/components/verification/VerificationBadge';
import { ReportStatus } from '@/types/reports';
import { cn } from '@/lib/utils';

const mockReports = [
  {
    id: '1',
    reference_number: 'ECHO-482910',
    title: 'Open Drainage Issue',
    category: 'Water Management',
    status: 'In Progress' as ReportStatus,
    severity: 'Medium',
    address: '15 Adeniran Ogunsanya St, Surulere',
    created_at: '2024-03-10T10:00:00Z',
  },
  {
    id: '2',
    reference_number: 'ECHO-928371',
    title: 'Illegal Plastic Dumping',
    category: 'Waste Management',
    status: 'Verified' as ReportStatus,
    severity: 'High',
    address: 'Ikeja River Bank',
    created_at: '2024-03-08T14:30:00Z',
  },
  {
    id: '3',
    reference_number: 'ECHO-102938',
    title: 'Oil Spill near Farm',
    category: 'Chemical Pollution',
    status: 'Under Review' as ReportStatus,
    severity: 'Critical',
    address: 'Ondo Road, Akure',
    created_at: '2024-03-12T09:15:00Z',
  },
  {
    id: '4',
    reference_number: 'ECHO-556677',
    title: 'Smoke from Factory',
    category: 'Air Quality',
    status: 'Submitted' as ReportStatus,
    severity: 'Low',
    address: 'Industrial Layout, Kano',
    created_at: '2024-03-14T11:45:00Z',
  }
];

const TrackReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.reference_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'low': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Track My Reports
          </h1>
          <p className="text-muted-foreground">
            Monitor the real-time status and progress of your environmental hazard reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </Button>
          <Button variant="default" onClick={() => navigate('/report')} className="gap-2">
            Report New Hazard
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6 border-none shadow-sm bg-muted/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title or reference number..." 
                className="pl-10 bg-background border-none shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background border-none shadow-none">
                <ListFilter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-background border-none shadow-none">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Waste Management">Waste Management</SelectItem>
                <SelectItem value="Water Management">Water Management</SelectItem>
                <SelectItem value="Air Quality">Air Quality</SelectItem>
                <SelectItem value="Chemical Pollution">Chemical Pollution</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card 
              key={report.id} 
              className="group hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => navigate(`/reports/${report.id}`)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1 bg-primary group-hover:w-2 transition-all" />
                <CardContent className="p-5 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {report.reference_number}
                        </span>
                        <VerificationBadge status={report.status} size="sm" />
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{report.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {report.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Updated {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {report.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3">
                      <Badge variant="outline" className={cn("px-3 py-1", getSeverityColor(report.severity))}>
                        {report.severity} Severity
                      </Badge>
                      <div className="flex items-center text-primary font-bold text-sm">
                        Details
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4 bg-muted/20 rounded-2xl border border-dashed">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No reports found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-1">
              We couldn't find any hazard reports matching your current search or filters.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackReportsPage;
