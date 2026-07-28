import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status, 
  size = 'md',
  className 
}) => {
  const isVerified = status === 'Verified' || status === 'Resolved' || status === 'Closed';
  const isPending = status === 'Pending Verification' || status === 'Under Review';
  
  if (isVerified) {
    return (
      <Badge className={cn("bg-status-safe hover:bg-status-safe/90 text-white gap-1.5", size === 'sm' && "text-[10px] px-1.5", className)}>
        <ShieldCheck className={cn(size === 'sm' ? "w-3 h-3" : "w-4 h-4")} />
        Verified Hazard
      </Badge>
    );
  }

  if (isPending) {
    return (
      <Badge variant="secondary" className={cn("gap-1.5 bg-status-warning/10 text-status-warning border-status-warning/20", size === 'sm' && "text-[10px] px-1.5", className)}>
        <Shield className={cn(size === 'sm' ? "w-3 h-3" : "w-4 h-4")} />
        Verification Pending
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={cn("gap-1.5 text-muted-foreground border-muted-foreground/20", size === 'sm' && "text-[10px] px-1.5", className)}>
      <ShieldAlert className={cn(size === 'sm' ? "w-3 h-3" : "w-4 h-4")} />
      Unverified Report
    </Badge>
  );
};
