import { CalendarX2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-primary/20 bg-primary/[0.03]">
      <div className="relative mb-5">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <CalendarX2 className="h-7 w-7 text-primary/70" />
        </div>
        <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1" />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" className="mt-5 rounded-full" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
