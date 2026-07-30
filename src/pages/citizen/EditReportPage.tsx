import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportWizard from '@/components/reports/ReportWizard';
import { HazardReport } from '@/types/reports';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ShieldAlert } from 'lucide-react';

// Mirrors ActionButtons' canEdit check: only a report that's still
// Pending can be edited (RLS enforces the same rule server-side on the
// update itself, but checking here too means the user gets a clear
// message instead of a wizard that fails silently on submit).
export default function EditReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<HazardReport | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!supabase || !id) {
        setLoading(false);
        setError('Report not found.');
        return;
      }
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('hazard_reports')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError || !data) {
        setError('This report doesn\'t exist, or you don\'t have permission to edit it.');
        setLoading(false);
        return;
      }

      if (data.status !== 'Pending') {
        setError('Only reports that are still Pending can be edited.');
        setLoading(false);
        return;
      }

      setReport(data as HazardReport);
      setLoading(false);
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShieldAlert className="h-10 w-10 text-muted-foreground" />
        <div>
          <h1 className="text-xl font-bold">Can't edit this report</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">{error}</p>
        </div>
        <Button onClick={() => navigate(id ? `/reports/${id}` : '/reports')}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <ReportWizard editReport={report} />
    </div>
  );
}
