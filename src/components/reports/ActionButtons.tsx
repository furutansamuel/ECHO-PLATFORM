import React from 'react';
import { Share2, Download, Printer, Copy, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ActionButtonsProps {
  status: string;
  referenceNumber: string;
  onEdit?: () => void;
  onWithdraw?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  status, 
  referenceNumber,
  onEdit,
  onWithdraw
}) => {
  const canEdit = status === 'Draft' || status === 'Pending';
  const canWithdraw = status === 'Draft' || status === 'Submitted' || status === 'Under Review';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceNumber);
    toast.success('Reference number copied to clipboard');
  };

  const handleShare = () => {
    toast.info('Share functionality initialized');
  };

  const handleDownload = () => {
    toast.success('Report summary download started');
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
      <Button variant="secondary" size="sm" onClick={handleShare} className="flex-1 md:flex-none">
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
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
