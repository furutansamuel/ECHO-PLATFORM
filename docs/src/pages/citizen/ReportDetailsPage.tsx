import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReportDetailsView } from '@/components/reports/ReportDetailsView';
import { HazardReport, ReportActivity } from '@/types/reports';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ShieldAlert } from 'lucide-react';

const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [report, setReport] = useState<HazardReport | null>(null);
  const [activities, setActivities] = useState<ReportActivity[]>([]);

  const fetchReport = async () => {
    if (!supabase || !id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);

    const { data: reportData, error: reportError } = await supabase
      .from('hazard_reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (reportError || !reportData) {
      // Either the report doesn't exist, or RLS silently excluded it
      // (not the owner, not shared, not an admin) — both look the same
      // from here, so a generic "not found" is shown either way rather
      // than leaking which case it is.
      setLoading(false);
      setNotFound(true);
      return;
    }

    setReport(reportData as HazardReport);

    const { data: activityData } = await supabase
      .from('report_activities')
      .select('*')
      .eq('report_id', id)
      .order('created_at', { ascending: true });

    setActivities((activityData as ReportActivity[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleWithdraw = async () => {
    if (!supabase || !report) return;
    if (!confirm('Withdraw this report? This cannot be undone.')) return;

    // RLS only permits deleting a report while it's still Pending — if
    // it's moved past that (e.g. already Verified), this will fail with
    // a clear error rather than silently pretending to succeed.
    const { error } = await supabase.from('hazard_reports').delete().eq('id', report.id);
    if (error) {
      toast.error('Could not withdraw this report: ' + error.message);
      return;
    }
    toast.success('Report withdrawn successfully.');
    navigate('/reports');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="h-12 w-2/3 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[150px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !report) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShieldAlert className="h-10 w-10 text-muted-foreground" />
        <div>
          <h1 className="text-xl font-bold">Report not found</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            This report doesn't exist, or you don't have permission to view it.
          </p>
        </div>
        <Button onClick={() => navigate('/reports')}>Back to My Reports</Button>
      </div>
    );
  }

  return (
    <ReportDetailsView 
      report={report} 
      activities={activities} 
      onWithdraw={handleWithdraw}
    />
  );
};

export default ReportDetailsPage;
