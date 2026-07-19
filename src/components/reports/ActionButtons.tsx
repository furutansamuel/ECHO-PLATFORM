import React from 'react';
import { Download, Printer, Copy, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShareMenu } from '@/components/reports/ShareMenu';
import { downloadTextReceipt } from '@/lib/share-utils';

interface ActionButtonsProps {
  status: string;
  referenceNumber: string;
  reportId: string;
  title: string;
  category: string;
  onEdit?: () => void;
  onWithdraw?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  status, 
  referenceNumber,
  reportId,
  title,
  category,
  onEdit,
  onWithdraw
}) => {
  const canEdit = status === 'Draft' || status === 'Pending';
  const canWithdraw = status === 'Draft' || status === 'Submitted' || status === 'Under Review';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceNumber);
    toast.success('Reference number copied to clipboard');
  };

  // Note: report detail pages require sign-in, and a recipient can only
  // view it if RLS allows them to — their own report, one marked
  // share_with_community, or an admin account. Sharing still works as
  // a link, but won't always be viewable by whoever receives it.
  const shareUrl = `${window.location.origin}/reports/${reportId}`;
  const shareData = {
    title: `ECHO Hazard Report: ${title}`,
    text: `I reported a ${category} hazard on ECHO (Ref: ${referenceNumber}).`,
    url: shareUrl,
  };

  const handleDownload = () => {
    downloadTextReceipt(`echo-report-${referenceNumber}.txt`, [
      'ECHO — Environmental Community Health Observatory',
      'Hazard Report Receipt',
      '',
      `Reference Number: ${referenceNumber}`,
      `Title: ${title}`,
      `Category: ${category}`,
      `Status: ${status}`,
      `Generated: ${new Date().toLocaleString()}`,
    ]);
    toast.success('Report summary downloaded');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {canEdit && (
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 md:flex-none">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )}
      {canWithdraw && (
        <Button variant="destructive" size="sm" onClick={onWithdraw} className="flex-1 md:flex-none">
          <Trash2 className="w-4 h-4 mr-2" />
          Withdraw
        </Button>
      )}
      <ShareMenu data={shareData} className="flex-1 md:flex-none" />
      <Button variant="secondary" size="sm" onClick={handleDownload} className="flex-1 md:flex-none">
        <Download className="w-4 h-4 mr-2" />
        Summary
      </Button>
      <Button variant="secondary" size="sm" onClick={handlePrint} className="flex-1 md:flex-none">
        <Printer className="w-4 h-4 mr-2" />
        Print
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopyRef} className="flex-1 md:flex-none">
        <Copy className="w-4 h-4 mr-2" />
        Ref: {referenceNumber}
      </Button>
    </div>
  );
};
