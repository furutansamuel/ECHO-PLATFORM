import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { HAZARD_CATEGORIES } from '../HazardCategories';
import { cn } from '@/lib/utils';
import { ReportFormData } from '../report-schema';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '@/components/ui/command';

// Only the first 8 show on the main screen — everything else lives in
// the searchable "More" sheet. Keeps the first screen short (spec:
// reduce section height ~50-60%) without hiding any category.
const VISIBLE_COUNT = 8;

interface CompactCardProps {
  icon: React.ElementType;
  label: string;
  color?: string;
  selected: boolean;
  onClick: () => void;
}

function CompactCard({ icon: Icon, label, color, selected, onClick }: CompactCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 py-3 px-1 text-center transition-colors duration-200",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-muted/40"
      )}
    >
      <div
        className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm",
          color || "bg-primary"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-[11px] font-semibold leading-tight text-foreground line-clamp-1">
        {label}
      </span>

      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-background"
        >
          <Check className="h-3 w-3 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

export default function HazardSelectStep() {
  const { setValue, watch, formState: { errors } } = useFormContext<ReportFormData>();
  const selectedCategory = watch('category');
  const [moreOpen, setMoreOpen] = useState(false);
  const [search, setSearch] = useState('');

  const visible = HAZARD_CATEGORIES.slice(0, VISIBLE_COUNT);

  const selectCategory = (id: string) => {
    setValue('category', id as any, { shouldValidate: true });
  };

  const filtered = HAZARD_CATEGORIES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {visible.map((category) => (
          <CompactCard
            key={category.id}
            icon={category.icon}
            label={category.title}
            color={category.color}
            selected={selectedCategory === category.id}
            onClick={() => selectCategory(category.id)}
          />
        ))}

        {/* More — opens a searchable sheet with every category, so the
            main screen never has to show all 12+ at once. */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-3 px-1 text-center hover:border-primary/40 hover:bg-muted/40 transition-colors duration-200"
        >
          <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-muted text-muted-foreground">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-semibold leading-tight text-foreground">More</span>
        </motion.button>
      </div>

      {errors.category && (
        <p className="text-sm text-destructive font-medium">{errors.category.message}</p>
      )}

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] flex flex-col">
          <SheetHeader className="text-left">
            <SheetTitle>All Hazard Categories</SheetTitle>
          </SheetHeader>
          <Command className="flex-1 overflow-hidden" shouldFilter={false}>
            <CommandInput
              placeholder="Search categories..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[55vh]">
              <CommandEmpty>No categories match "{search}".</CommandEmpty>
              {filtered.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={() => {
                      selectCategory(category.id);
                      setMoreOpen(false);
                    }}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0", category.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{category.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{category.description}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </SheetContent>
      </Sheet>
    </div>
  );
}
