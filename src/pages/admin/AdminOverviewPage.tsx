import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { ClipboardList, BookOpen, Calendar, CheckCircle, Clock, Wrench } from 'lucide-react';

export default function AdminOverviewPage() {
  const { hazardReports, articles, loading } = useIntelligenceData();

  const counts = useMemo(() => {
    return {
      total: hazardReports.length,
      pending: hazardReports.filter((r) => r.status === 'Pending').length,
      verified: hazardReports.filter((r) => r.status === 'Verified').length,
      resolved: hazardReports.filter((r) => r.status === 'Resolved').length,
      articles: articles.length,
    };
  }, [hazardReports, articles]);

  const cards = [
    { label: 'Total Reports', value: counts.total, icon: ClipboardList, href: '/admin/reports' },
    { label: 'Pending Review', value: counts.pending, icon: Clock, href: '/admin/reports' },
    { label: 'Verified', value: counts.verified, icon: CheckCircle, href: '/admin/reports' },
    { label: 'Resolved', value: counts.resolved, icon: Wrench, href: '/admin/reports' },
    { label: 'Articles', value: counts.articles, icon: BookOpen, href: '/admin/knowledge' },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Admin Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">A quick snapshot of what needs attention.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="card-premium p-4 flex flex-col gap-2 hover:border-primary/30 transition-colors"
          >
            <card.icon className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{loading ? '—' : card.value}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/reports" className="card-premium p-6 flex items-center gap-4 hover:border-primary/30 transition-colors">
          <div className="icon-badge gradient-primary h-12 w-12"><ClipboardList className="h-5 w-5" /></div>
          <div>
            <p className="font-semibold">Manage Reports</p>
            <p className="text-xs text-muted-foreground">Verify, reject, or resolve citizen submissions</p>
          </div>
        </Link>
        <Link to="/admin/knowledge" className="card-premium p-6 flex items-center gap-4 hover:border-primary/30 transition-colors">
          <div className="icon-badge gradient-analytics h-12 w-12"><BookOpen className="h-5 w-5" /></div>
          <div>
            <p className="font-semibold">Knowledge Centre</p>
            <p className="text-xs text-muted-foreground">Create and publish articles</p>
          </div>
        </Link>
        <Link to="/admin/events" className="card-premium p-6 flex items-center gap-4 hover:border-primary/30 transition-colors">
          <div className="icon-badge gradient-community h-12 w-12"><Calendar className="h-5 w-5" /></div>
          <div>
            <p className="font-semibold">Events</p>
            <p className="text-xs text-muted-foreground">Manage cleanup events and volunteer signups</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

