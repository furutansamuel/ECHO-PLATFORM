import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReportDetailsView } from '@/components/reports/ReportDetailsView';
import { HazardReport, ReportActivity } from '@/types/reports';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Mock data generator for the demo
const getMockReport = (id: string): HazardReport => ({
  id,
  reference_number: `ECHO-${Math.floor(100000 + Math.random() * 900000)}`,
  title: 'Illegal Plastic Dumping in Riverbed',
  description: 'Large quantities of industrial plastic waste have been dumped along the river bank, obstructing water flow and posing a threat to local aquatic life. The waste appears to be non-biodegradable packing material.',
  category: 'Waste Management',
  severity: 'High',
  status: 'In Progress',
  latitude: 6.5244,
  longitude: 3.3792,
  address: '32 Riverview Avenue, near the Old Bridge',
  ward: 'Ward 4',
  lga: 'Ikeja',
  state: 'Lagos',
  landmark: 'Old Bridge',
  images: [
    'https://storage.googleapis.com/dala-prod-public-storage/generated-images/060df7fc-fb5a-4109-890a-cb6e43e9b598/river-pollution-8d70d1de-1782913517088.webp',
    'https://storage.googleapis.com/dala-prod-public-storage/generated-images/060df7fc-fb5a-4109-890a-cb6e43e9b598/illegal-dumping-7eaf3a8b-1782913517236.webp'
  ],
  is_anonymous: false,
  reporter_name: 'John Doe',
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
  verification_status: 'Verified',
  assigned_verifier: 'Officer Sarah Johnson',
  verification_notes: 'Confirmed hazard presence. Significant industrial waste detected. Immediate action required to prevent downstream contamination.',
  verification_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  verification_confidence: 98,
  ai_risk_score: 82,
  ai_priority: 'Urgent',
  ai_risk_level: 'High',
  ai_impact_summary: 'Hazard poses a significant threat to local biodiversity and water quality. Potential for flooding if not cleared before the rainy season.',
  ai_suggested_priority: 'Deploy Waste Management Task Force within 48 hours.',
  estimated_impact: 'Medium-term ecological damage to the riparian zone. High risk of microplastic contamination in the local water supply.'
});

const getMockActivities = (reportId: string): ReportActivity[] => [
  { id: '1', report_id: reportId, status: 'Submitted', description: 'Report successfully submitted by citizen.', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', report_id: reportId, status: 'Under Review', description: 'Preliminary review completed by AI.', created_at: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', report_id: reportId, status: 'Pending Verification', description: 'Assigned to field officer Sarah Johnson.', created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', report_id: reportId, status: 'Verified', description: 'Field verification complete. Hazard confirmed.', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', report_id: reportId, status: 'Assigned', description: 'Cleanup crew dispatched from Ikeja Depot.', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '6', report_id: reportId, status: 'In Progress', description: 'Manual clearance of large debris underway.', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
];

const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // In a real app, we would fetch data from Supabase here
  const report = getMockReport(id || 'default');
  const activities = getMockActivities(id || 'default');

  const handleWithdraw = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Withdrawing report...',
        success: () => {
          navigate('/reports');
          return 'Report withdrawn successfully.';
        },
        error: 'Failed to withdraw report.'
      }
    );
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

  return (
    <ReportDetailsView 
      report={report} 
      activities={activities} 
      onWithdraw={handleWithdraw}
    />
  );
};

export default ReportDetailsPage;
