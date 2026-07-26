import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ReportFormData } from '../report-schema';
import { ClipboardList, Zap } from 'lucide-react';

export default function HazardDetailsStep() {
  const { register, watch, formState: { errors } } = useFormContext<ReportFormData>();

  const title = watch('title') || '';
  const description = watch('description') || '';

  return (
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
            placeholder="Describe the hazard in detail — what you saw, how big it is, and anything nearby it might affect."
            rows={4}
            {...register('description')}
            className={errors.description ? 'border-destructive' : ''}
          />
          <span className="absolute right-3 bottom-3 text-[10px] text-muted-foreground">
            {description.length}/1000
          </span>
        </div>
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        <p className="text-[11px] text-muted-foreground">
          Severity and environmental impact are assessed automatically after you submit —
          no need to estimate them yourself.
        </p>
      </div>
    </div>
  );
}
