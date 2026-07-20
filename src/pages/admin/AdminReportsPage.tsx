import React, { useState, useMemo } from 'react';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { uploadImages } from '@/lib/storage-upload';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Loader2, Trash2, CheckCircle, XCircle, Wrench, Eye } from 'lucide-react';
import type { HazardReport } from '@/types/reports';

const STATUS_OPTIONS = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
const SEVERITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

const severityVariant = (severity: string): 'safe' | 'warning' | 'danger' => {
  switch (severity) {
    case 'Low': return 'safe';
    case 'Medium': return 'warning';
    default: return 'danger';
  }
};

const RESOLVED_STATUSES = new Set(['Resolved', 'Closed', 'Rejected']);

export default function AdminReportsPage() {
  const { user } = useAuth();
  const { hazardReports, loading, refetch } = useIntelligenceData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selected, setSelected] = useState<HazardReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionFiles, setResolutionFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return hazardReports.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${r.title} ${r.reference_number} ${r.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [hazardReports, statusFilter, severityFilter, search]);

  const updateStatus = async (report: HazardReport, status: string) => {
    if (!supabase || !user) return;
    setSaving(true);
    const patch: Record<string, unknown> = { status };
    if (status === 'Verified') {
      patch.verification_status = 'completed';
      patch.verifier_id = user.id;
    }
    const { error } = await supabase.from('hazard_reports').update(patch).eq('id', report.id);
    setSaving(false);
    if (error) {
      toast.error('Failed to update report: ' + error.message);
      return;
    }
    toast.success(`Report marked ${status}.`);
    refetch();
  };

  const resolveWithPhotos = async () => {
    if (!selected || !supabase || !user) return;
    setSaving(true);

    let resolutionImageUrls: string[] = [];
    if (resolutionFiles.length > 0) {
      const { urls, errors } = await uploadImages('report-images', resolutionFiles, `${selected.id}`);
      resolutionImageUrls = urls;
      errors.forEach((e) => toast.error(e));
    }

    const { error } = await supabase
      .from('hazard_reports')
      .update({
        status: 'Resolved',
        resolution_notes: resolutionNotes || null,
        resolution_images: resolutionImageUrls.length > 0 ? resolutionImageUrls : selected.resolution_images,
      })
      .eq('id', selected.id);

    setSaving(false);
    if (error) {
      toast.error('Failed to resolve report: ' + error.message);
      return;
    }
    toast.success('Report resolved.');
    setSelected(null);
    setResolutionNotes('');
    setResolutionFiles([]);
    refetch();
  };

  const deleteReport = async (report: HazardReport) => {
    if (!supabase) return;
    if (!confirm(`Delete report ${report.reference_number}? This cannot be undone.`)) return;
    const { error } = await supabase.from('hazard_reports').delete().eq('id', report.id);
    if (error) {
      toast.error('Failed to delete report: ' + error.message);
      return;
    }
    toast.success('Report deleted.');
    refetch();
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Reports Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Verify, reject, resolve, or remove citizen hazard reports.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, reference number, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            {SEVERITY_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="rounded-xl border overflow-hidden divide-y">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 flex-1 max-w-[180px]" />
              <Skeleton className="h-4 w-24 hidden sm:block" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-16 text-sm">No reports match these filters.</p>
      ) : (
        <div className="rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((report) => (
                <tr key={report.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{report.reference_number}</td>
                  <td className="px-4 py-3 font-medium max-w-[220px] truncate">{report.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.category}</td>
                  <td className="px-4 py-3">
                    <span className={`beacon-badge beacon-badge--${severityVariant(report.severity)}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`beacon-badge beacon-badge--${RESOLVED_STATUSES.has(report.status) ? (report.status === 'Rejected' ? 'danger' : 'safe') : 'warning'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelected(report)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-status-safe" onClick={() => updateStatus(report, 'Verified')} title="Verify" disabled={saving}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-status-danger" onClick={() => updateStatus(report, 'Rejected')} title="Reject" disabled={saving}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-status-warning" onClick={() => setSelected(report)} title="Resolve">
                        <Wrench className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteReport(report)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.reference_number} — {selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground text-xs">Category</p><p>{selected.category}</p></div>
                <div><p className="text-muted-foreground text-xs">Severity</p><p>{selected.severity}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground text-xs">Location</p><p>{selected.location?.address}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground text-xs">Description</p><p>{selected.description}</p></div>
              </div>

              {selected.images?.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Evidence photos</p>
                  <div className="grid grid-cols-4 gap-2">
                    {selected.images.map((img) => (
                      <img key={img} src={img} className="aspect-square object-cover rounded-md" />
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-semibold">Resolve this report</p>
                <Textarea
                  placeholder="Resolution notes (optional)"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
                <div>
                  <label className="text-xs text-muted-foreground">After / resolution photos (optional)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setResolutionFiles(Array.from(e.target.files || []))}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            <Button onClick={resolveWithPhotos} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wrench className="h-4 w-4 mr-2" />}
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
