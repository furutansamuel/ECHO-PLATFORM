import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  UserX, 
  Users, 
  Share2, 
  Bell,
  FileText,
  ShieldCheck,
  Globe,
  Zap
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ReportFormData } from '../report-schema';

export default function AdditionalOptionsStep() {
  const { register, watch, setValue } = useFormContext<ReportFormData>();
  
  const isAnonymous = watch('isAnonymous');
  const notifyVolunteers = watch('notifyVolunteers');
  const shareWithCommunity = watch('shareWithCommunity');
  const receiveUpdates = watch('receiveUpdates');

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-2xl border p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-muted/50 text-muted-foreground">
              <UserX className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="isAnonymous" className="text-base font-bold">Anonymous Report</Label>
              <p className="text-sm text-muted-foreground">Hide your name and profile from public view. Your identity will only be visible to verified administrators.</p>
            </div>
          </div>
          <Switch 
            id="isAnonymous"
            checked={isAnonymous}
            onCheckedChange={(val) => setValue('isAnonymous', val)}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="notifyVolunteers" className="text-base font-bold">Notify Nearby Volunteers</Label>
              <p className="text-sm text-muted-foreground">Alert local environmental volunteers to help with verification or immediate action if needed.</p>
            </div>
          </div>
          <Switch 
            id="notifyVolunteers"
            checked={notifyVolunteers}
            onCheckedChange={(val) => setValue('notifyVolunteers', val)}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Share2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="shareWithCommunity" className="text-base font-bold">Share with Community</Label>
              <p className="text-sm text-muted-foreground">Allow other residents in this area to see this report on the Live Map and contribute updates.</p>
            </div>
          </div>
          <Switch 
            id="shareWithCommunity"
            checked={shareWithCommunity}
            onCheckedChange={(val) => setValue('shareWithCommunity', val)}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Bell className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="receiveUpdates" className="text-base font-bold">Receive Status Updates</Label>
              <p className="text-sm text-muted-foreground">Get real-time push notifications and emails as your report moves through the verification and resolution process.</p>
            </div>
          </div>
          <Switch 
            id="receiveUpdates"
            checked={receiveUpdates}
            onCheckedChange={(val) => setValue('receiveUpdates', val)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border bg-muted/30 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Verified reports earn 2x Impact Points</span>
        </div>
        <div className="p-4 rounded-xl border bg-muted/30 flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Your report helps update the Community Health Score</span>
        </div>
      </div>
    </div>
  );
}
