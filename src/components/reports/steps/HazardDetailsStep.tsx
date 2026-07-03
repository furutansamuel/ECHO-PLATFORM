import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ReportFormData } from '../report-schema';
import { 
  Calendar, 
  Clock, 
  Maximize2, 
  Users, 
  AlertTriangle, 
  Zap,
  ClipboardList
} from 'lucide-react';

export default function HazardDetailsStep() {
  const { register, watch, formState: { errors } } = useFormContext<ReportFormData>();
  
  const title = watch('title') || '';
  const description = watch('description') || '';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            Hazard Title
          </Label>
          <div className="relative">
            <Input
              id="title"
              placeholder="e.g., Major Illegal Dumpsite near Market"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
              {title.length}/100
            </span>
          </div>
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Description
          </Label>
          <div className="relative">
            <Textarea
              id="description"
              placeholder="Describe the hazard in detail..."
              rows={4}
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            <span className="absolute right-3 bottom-3 text-[10px] text-muted-foreground">
              {description.length}/1000
            </span>
          </div>
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedSize" className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-primary" />
              Estimated Size
            </Label>
            <Input
              id="estimatedSize"
              placeholder="e.g., 50 square meters"
              {...register('estimatedSize')}
            />
            {errors.estimatedSize && <p className="text-xs text-destructive">{errors.estimatedSize.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="affectedArea" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Affected Area
            </Label>
            <Input
              id="affectedArea"
              placeholder="e.g., Residential street and park"
              {...register('affectedArea')}
            />
            {errors.affectedArea && <p className="text-xs text-destructive">{errors.affectedArea.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateObserved" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date Observed
            </Label>
            <Input
              id="dateObserved"
              type="date"
              {...register('dateObserved')}
            />
            {errors.dateObserved && <p className="text-xs text-destructive">{errors.dateObserved.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeObserved" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Time Observed
            </Label>
            <Input
              id="timeObserved"
              type="time"
              {...register('timeObserved')}
            />
            {errors.timeObserved && <p className="text-xs text-destructive">{errors.timeObserved.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="immediateRisk" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            Immediate Risk
          </Label>
          <Input
            id="immediateRisk"
            placeholder="e.g., Fire hazard, health risk to children"
            {...register('immediateRisk')}
          />
          {errors.immediateRisk && <p className="text-xs text-destructive">{errors.immediateRisk.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="environmentalImpact" className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Environmental Impact
            </Label>
            <Input
              id="environmentalImpact"
              placeholder="e.g., Water contamination"
              {...register('environmentalImpact')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredAction" className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Required Action
            </Label>
            <Input
              id="requiredAction"
              placeholder="e.g., Waste evacuation"
              {...register('requiredAction')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
