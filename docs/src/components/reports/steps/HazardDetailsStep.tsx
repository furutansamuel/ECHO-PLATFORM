import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ReportFormData } from '../report-schema';
import { HAZARD_CATEGORIES } from '../HazardCategories';
import { ClipboardList, Zap, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AiValidation {
  matches: boolean;
  suggested_category: string;
  suggested_title: string;
  related: string[];
}

const categoryLabel = (id: string) => HAZARD_CATEGORIES.find((c) => c.id === id)?.title || id;

export default function HazardDetailsStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ReportFormData>();

  const title = watch('title') || '';
  const description = watch('description') || '';
  const category = watch('category');

  const [validation, setValidation] = useState<AiValidation | null>(null);
  const [checking, setChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedRef = useRef<string>('');

  // Debounced AI category check — fires ~1.2s after the user stops
  // typing, only once the description is substantial enough to
  // classify, and only when it or the category actually changed since
  // the last check (so re-renders don't refire it).
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!category || description.trim().length < 15 || !supabase) {
      setValidation(null);
      return;
    }

    const key = `${category}::${description}`;
    if (key === lastCheckedRef.current) return;

    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      setDismissed(false);
      try {
        const { data, error } = await supabase.functions.invoke('validate-hazard-category', {
          body: { category, description },
        });
        if (!error && data?.result) {
          setValidation(data.result);
          lastCheckedRef.current = key;
        }
      } catch {
        // Silent — this is a helpful suggestion, not a required step.
        // Never blocks or interrupts the user filling out the form.
      } finally {
        setChecking(false);
      }
    }, 1200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [category, description]);

  const useAiSuggestion = () => {
    if (!validation) return;
    setValue('category', validation.suggested_category as any, { shouldValidate: true });
    if (validation.suggested_title) {
      setValue('title', validation.suggested_title, { shouldValidate: true });
    }
    setDismissed(true);
  };

  const showSuggestion = validation && !validation.matches && !dismissed;
  const showConfirmation = validation && validation.matches && !dismissed;

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

      {checking && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking category against description...
        </div>
      )}

      {showConfirmation && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Your selected category matches the AI analysis.
        </div>
      )}

      {showSuggestion && (
        <div className="rounded-xl border border-status-warning/40 bg-status-warning/10 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-status-warning">
            <Sparkles className="h-4 w-4" /> AI Suggestion
          </div>
          <p className="text-sm text-foreground">
            This appears to be: <span className="font-semibold">✔ {categoryLabel(validation!.suggested_category)}</span>
          </p>
          {validation!.suggested_title && (
            <p className="text-sm text-foreground">
              Suggested title: <span className="font-semibold">"{validation!.suggested_title}"</span>
            </p>
          )}
          {validation!.related.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Also Related:
              <ul className="list-disc list-inside">
                {validation!.related.map((r) => (
                  <li key={r}>{categoryLabel(r)}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={cn("flex-1 rounded-full")}
              onClick={() => setDismissed(true)}
            >
              Keep My Selection
            </Button>
            <Button
              type="button"
              size="sm"
              className="flex-1 rounded-full"
              onClick={useAiSuggestion}
            >
              Use AI Suggestion
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
