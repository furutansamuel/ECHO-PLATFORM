import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  Map as MapIcon, 
  Navigation,
  User,
  Shield,
  FileText,
  MessageSquare,
  ChevronRight,
  Maximize2,
  Activity
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HazardReport, ReportActivity } from '@/types/reports';
import { StatusTimeline } from './StatusTimeline';
import { ActionButtons } from './ActionButtons';
import { AIRiskCard } from '@/components/ai/AIRiskCard';
import { VerificationBadge } from '@/components/verification/VerificationBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import L from 'leaflet';

// Fix for Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ReportDetailsViewProps {
  report: HazardReport;
  activities: ReportActivity[];
  onEdit?: () => void;
  onWithdraw?: () => void;
}

export const ReportDetailsView: React.FC<ReportDetailsViewProps> = ({
  report,
  activities,
  onEdit,
  onWithdraw
}) => {
  // Same severity → beacon-badge mapping used in the reports table, map
  // popup, and tracking page. "Low" used to render in brand navy
  // (bg-primary) here, reading like a featured tag rather than low risk.
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

  return (
    <div className="container mx-auto pb-20 space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="font-mono">{report.reference_number}</Badge>
            <VerificationBadge status={report.status} />
            <span className={`beacon-badge beacon-badge--${severityVariant(report.severity)}`}>{report.severity} Severity</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{report.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(report.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              {report.category}
            </span>
          </div>
        </div>
        <ActionButtons 
          status={report.status} 
          referenceNumber={report.reference_number}
          onEdit={onEdit}
          onWithdraw={onWithdraw}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Evidence Gallery */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Visual Evidence
              </h2>
              <span className="text-xs text-muted-foreground">{report.images.length} Photos</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.images.map((img, idx) => (
                <div key={idx} className={cn(
                  "relative aspect-video rounded-xl overflow-hidden group border bg-muted",
                  idx === 0 && report.images.length % 2 !== 0 ? "md:col-span-2" : ""
                )}>
                  <img 
                    src={img} 
                    alt={`Evidence ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="icon" className="rounded-full">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {report.video && (
                <div className="md:col-span-2 aspect-video rounded-xl overflow-hidden border bg-black">
                  <video src={report.video} controls className="w-full h-full" />
                </div>
              )}
            </div>
          </section>

          {/* Description & Impact */}
          <Card className="overflow-hidden border-none shadow-sm bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</h4>
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>
              
              <Separator className="bg-border/50" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Location Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <span>{report.location.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span>{report.ward}, {report.lga}, {report.state}</span>
                    </div>
                    {report.landmark && (
                      <div className="flex items-center gap-2 text-sm">
                        <Maximize2 className="w-4 h-4 text-primary" />
                        <span>Landmark: {report.landmark}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Reporter Info</h4>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {report.is_anonymous ? 'Anonymous Contributor' : report.reporter_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {report.is_anonymous ? 'Identity Hidden' : 'Verified Community Member'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {report.estimated_impact && (
                <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Environmental Impact Assessment
                  </h4>
                  <p className="text-sm text-foreground/80">
                    {report.estimated_impact}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Intelligence & Timeline */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <AIRiskCard 
            score={report.ai_risk_score || 0}
            priority={report.ai_priority || 'Standard'}
            level={report.ai_risk_level || 'Low'}
            summary={report.ai_impact_summary || 'No AI summary available yet.'}
            suggestedAction={report.ai_suggested_priority || 'Awaiting further review.'}
            confidence={report.verification_confidence || 85}
          />

          {/* Interactive Map Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-primary" />
                Location Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[200px] w-full bg-muted relative">
                <MapContainer 
                  center={[report.location.lat, report.location.lng]} 
                  zoom={15} 
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[report.location.lat, report.location.lng]}>
                    <Popup>{report.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="p-3 flex items-center justify-between bg-muted/50">
                <div className="text-[10px] text-muted-foreground">
                  {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1">
                  View Full Map
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Lifecycle Timeline */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Report Lifecycle
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ScrollArea className="h-[400px] pr-4">
                <StatusTimeline 
                  currentStatus={report.status} 
                  activities={activities.map(a => ({
                    status: a.status,
                    timestamp: a.created_at,
                    description: a.description
                  }))} 
                />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Verification Workflow (if applicable) */}
          {report.assigned_verifier && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  Verification Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase">Assigned Verifier</p>
                  <p className="text-xs font-medium">{report.assigned_verifier}</p>
                </div>
                {report.verification_notes && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">Field Notes</p>
                    <p className="text-xs">{report.verification_notes}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">Confidence</p>
                    <p className="text-xs font-bold text-amber-600">{report.verification_confidence}%</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] text-muted-foreground uppercase">Date</p>
                    <p className="text-xs">{report.verification_date ? new Date(report.verification_date).toLocaleDateString() : 'Pending'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
