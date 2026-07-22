import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { HAZARD_CATEGORIES } from '../HazardCategories';
import { cn } from '@/lib/utils';
import { ReportFormData } from '../report-schema';

export default function HazardSelectStep() {
  const { setValue, watch, formState: { errors } } = useFormContext<ReportFormData>();
  const selectedCategory = watch('category');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {HAZARD_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setValue('category', category.id, { shouldValidate: true })}
              className={cn(
                "relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-2 min-h-[150px]",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div
  className={cn(
    "w-11 h-11 rounded-xl flex items-center justify-center",
    category.color,
    "text-white shadow-sm"
  )}
>
                <Icon className="h-5 w-5" />
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-foreground leading-tight">{category.title}</h3>
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground line-clamp-2">{category.description}</p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
    <Check className="h-3 w-3" />
</div>
              )}
            </motion.div>
          );
        })}
      </div>
      {errors.category && (
        <p className="text-sm text-destructive font-medium">{errors.category.message}</p>
      )}
    </div>
  );
}
