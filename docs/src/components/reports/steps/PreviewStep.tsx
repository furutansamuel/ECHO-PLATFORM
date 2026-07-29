import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Edit3,
  MapPin,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Lock,
  Users,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ReportFormData } from '../report-schema';
import { HAZARD_CATEGORIES } from '../HazardCategories';
import { cn } from '@/lib/utils';

interface PreviewStepProps {
  onEdit: (step: number) => void;
}

// Step indices matching the current 4-step wizard order in
// ReportWizard.tsx: 0 Hazard, 1 Location, 2 Evidence, 3 Review.
const STEP_HAZARD = 0;
const STEP_LOCATION = 1;
const STEP_EVIDENCE = 2;

export default function PreviewStep({ onEdit }: PreviewStepProps) {
  const { watch, setValue } = useFormContext<ReportFormData>();
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
                Hazard
              </h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(STEP_HAZARD)} className="h-8 text-primary">
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

              <p className="text-[11px] text-muted-foreground italic">
                Severity and environmental impact will be assessed automatically once you submit.
              </p>
            </div>
          </section>

          {/* Location Info */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location
              </h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(STEP_LOCATION)} className="h-8 text-primary">
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
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={
                    data.location.lat && data.location.lng
                      ? { backgroundImage: `url('https://staticmap.openstreetmap.de/staticmap.php?center=${data.location.lat},${data.location.lng}&zoom=15&size=600x400&markers=${data.location.lat},${data.location.lng},red-pushpin')` }
                      : { backgroundColor: 'hsl(var(--muted))' }
                  }
                />
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
              <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(STEP_EVIDENCE)} className="h-8 text-primary">
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

          {/* Options — directly toggleable here, no separate step needed */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Options
            </h3>

            <div className="bg-card p-4 rounded-2xl border space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <Label htmlFor="isAnonymous" className="font-medium cursor-pointer">Anonymous</Label>
                </div>
                <Switch
                  id="isAnonymous"
                  checked={data.isAnonymous}
                  onCheckedChange={(val) => setValue('isAnonymous', val)}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <Label htmlFor="notifyVolunteers" className="font-medium cursor-pointer">Notify Volunteers</Label>
                </div>
                <Switch
                  id="notifyVolunteers"
                  checked={data.notifyVolunteers}
                  onCheckedChange={(val) => setValue('notifyVolunteers', val)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
