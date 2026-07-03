import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Edit3, 
  MapPin, 
  AlertTriangle, 
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Eye,
  Lock,
  MessageSquare,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReportFormData } from '../report-schema';
import { HAZARD_CATEGORIES } from '../HazardCategories';
import { cn } from '@/lib/utils';

interface PreviewStepProps {
  onEdit: (step: number) => void;
}

export default function PreviewStep({ onEdit }: PreviewStepProps) {
  const { watch } = useFormContext<ReportFormData>();
  const data = watch();

  const categoryInfo = HAZARD_CATEGORIES.find(c => c.id === data.category);
  const Icon = categoryInfo?.icon || AlertTriangle;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-white rounded-full">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Review Mode</p>
            <p className="text-sm text-primary/80">Please double check your report before submitting.</p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary">Ready to Submit</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Hazard Information
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(1)} className="h-8 text-primary">
                <Edit3 className="h-3 w-3 mr-2" /> Edit
              </Button>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border space-y-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl text-white", categoryInfo?.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl">{data.title || 'No Title'}</h4>
                  <p className="text-sm text-muted-foreground">{data.category}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</p>
                <p className="text-sm leading-relaxed">{data.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Estimated Size</p>
                  <p className="text-sm font-medium">{data.estimatedSize}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Affected Area</p>
                  <p className="text-sm font-medium">{data.affectedArea}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Date Observed</p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {data.dateObserved} at {data.timeObserved}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Severity</p>
                  <Badge className={cn(
                    data.severity === 'Critical' ? 'bg-red-900' :
                    data.severity === 'High' ? 'bg-red-500' :
                    data.severity === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                  )}>
                    {data.severity}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Location Info */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(3)} className="h-8 text-primary">
                <Edit3 className="h-3 w-3 mr-2" /> Edit
              </Button>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Address</p>
                  <p className="text-sm font-medium">{data.location.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Ward</p>
                    <p className="text-sm font-medium">{data.location.ward}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">LGA</p>
                    <p className="text-sm font-medium">{data.location.lga}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">State</p>
                  <p className="text-sm font-medium">{data.location.state}</p>
                </div>
              </div>
              
              <div className="relative rounded-xl overflow-hidden border aspect-video">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/3.3792,6.5244,12,0/600x400?access_token=mock')] bg-cover bg-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Evidence
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(2)} className="h-8 text-primary">
                <Edit3 className="h-3 w-3 mr-2" /> Edit
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {data.images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden border">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
              {data.video && (
                <div className="col-span-2 aspect-video rounded-lg overflow-hidden border bg-black flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-white/70">
                    <Eye className="h-6 w-6" />
                    <span className="text-xs">Video Attached</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Options
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(5)} className="h-8 text-primary">
                <Edit3 className="h-3 w-3 mr-2" /> Edit
              </Button>
            </div>
            
            <div className="bg-card p-4 rounded-2xl border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Anonymous
                </div>
                <Badge variant={data.isAnonymous ? 'default' : 'outline'}>{data.isAnonymous ? 'Yes' : 'No'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  Notify Volunteers
                </div>
                <Badge variant={data.notifyVolunteers ? 'default' : 'outline'}>{data.notifyVolunteers ? 'Yes' : 'No'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Share with Community
                </div>
                <Badge variant={data.shareWithCommunity ? 'default' : 'outline'}>{data.shareWithCommunity ? 'Yes' : 'No'}</Badge>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const FileText = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
