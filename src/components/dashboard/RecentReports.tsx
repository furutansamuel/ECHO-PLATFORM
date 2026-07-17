import { useNavigate } from 'react-router-dom';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

// Maps the report's real severity to a beacon-badge tier. High and
// Critical both read as "danger" — the underlying data only has one
// hazard-color tier above "warning", so that's an honest mapping rather
// than inventing a fourth visual tier the design system doesn't have.
const severityVariant = (severity: string): 'safe' | 'warning' | 'danger' => {
  switch (severity as Severity) {
    case 'Low':
      return 'safe';
    case 'Medium':
      return 'warning';
    case 'High':
    case 'Critical':
    default:
      return 'danger';
  }
};

// The dot only pulses while a report is still active. Resolved/Closed
// reports get a static dot — the animation itself carries status meaning.
const RESOLVED_STATUSES = new Set(['Resolved', 'Closed']);
const isActiveStatus = (status: string) => !RESOLVED_STATUSES.has(status);

const statusVariant = (status: string): 'safe' | 'warning' | 'danger' => {
  if (RESOLVED_STATUSES.has(status)) return 'safe';
  if (status === 'Verified' || status === 'Assigned' || status === 'In Progress') return 'warning';
  return 'danger';
};

export function RecentReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hazardReports } = useIntelligenceData();
  const reports = hazardReports.filter((r) => r.reporter_id === user?.id);

  return (
    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="font-bold text-sm">Recent Reports</h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/reports')} className="text-[10px] font-black uppercase tracking-widest h-8 px-3">
          View All Reports
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
              <th className="px-6 py-4 font-black">Hazard</th>
              <th className="px-6 py-4 font-black">Location</th>
              <th className="px-6 py-4 font-black">Severity</th>
              <th className="px-6 py-4 font-black">Status</th>
              <th className="px-6 py-4 text-right font-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/20">
            {reports.length > 0 ? (
              reports.slice(0, 5).map((report) => (
                <tr key={report.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/5 text-primary rounded-lg group-hover:bg-primary/10 transition-colors">
                        <Icons.alertTriangle className="h-4 w-4" />
                      </div>
                      <span className="font-black text-xs uppercase tracking-tight">{report.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground font-medium italic">
                    {report.address}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`beacon-badge beacon-badge--${severityVariant(report.severity)}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`beacon-badge beacon-badge--${statusVariant(report.status)}`}>
                      <span
                        className={`beacon-dot ${isActiveStatus(report.status) ? 'beacon-dot--active' : ''}`}
                        aria-hidden="true"
                      />
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-primary hover:text-white transition-all rounded-lg"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      <Icons.chevronRight className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic text-xs font-medium">
                  No reports found. Start by reporting a hazard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
