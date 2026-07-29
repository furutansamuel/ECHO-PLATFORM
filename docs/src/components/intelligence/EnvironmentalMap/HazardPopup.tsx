import { Icons } from "@/components/ui/icons";
import { HazardReport } from "@/types/reports";
import { Button } from "@/components/ui/button";
import { VerificationBadge } from "@/components/verification/VerificationBadge";
import { Navigation, BrainCircuit, ExternalLink } from "lucide-react";

// Same severity → beacon-badge mapping used in RecentReports.tsx — High
// and Critical both read as "danger" since the design system only has
// one hazard-color tier above "warning".
const severityVariant = (severity: string): 'safe' | 'warning' | 'danger' => {
  switch (severity) {
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

const RESOLVED_STATUSES = new Set(['Resolved', 'Closed', 'Rejected']);

interface HazardPopupProps {
  hazard: HazardReport;
}

export function HazardPopup({ hazard }: HazardPopupProps) {
  return (
    <div className="p-1 min-w-[220px] font-sans">
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className={`beacon-badge beacon-badge--${severityVariant(hazard.severity)}`}>
          {hazard.severity}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-black uppercase">
          <span
            className={`beacon-dot ${!RESOLVED_STATUSES.has(hazard.status) ? 'beacon-dot--active' : ''}`}
            aria-hidden="true"
          />
          {hazard.status}
        </span>
      </div>
      
      <h3 className="font-black text-sm uppercase tracking-tight mb-1">{hazard.category}</h3>
      
      {hazard.ai_risk_score && (
        <div className="text-[9px] font-bold text-accent mb-2 flex items-center gap-1">
          <BrainCircuit className="h-3 w-3" />
          AI Risk Assessment: {Math.round(hazard.ai_risk_score * 100)}%
        </div>
      )}

      <p className="text-[11px] text-muted-foreground italic mb-3 flex items-center gap-1">
        <Icons.mapPin className="h-3 w-3" />
        {hazard.location.address}
      </p>

      <div className="bg-muted/30 rounded-lg p-2 mb-3">
        <p className="text-[10px] leading-relaxed line-clamp-2">
          {hazard.description}
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-muted/20">
        <div className="flex items-center justify-between">
            <VerificationBadge status={hazard.status} size="sm" />
            <div className="text-[9px] text-muted-foreground italic font-medium">
            {new Date(hazard.created_at).toLocaleDateString()}
            </div>
        </div>
        <Button 
            size="sm" 
            className="w-full h-8 text-[10px] uppercase font-black tracking-widest gap-2"
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hazard.location.lat},${hazard.location.lng}`, '_blank')}
        >
            <Navigation className="h-3 w-3" />
            Route to Hazard
            <ExternalLink className="h-2 w-2 ml-auto opacity-50" />
        </Button>
      </div>
    </div>
  );
}
