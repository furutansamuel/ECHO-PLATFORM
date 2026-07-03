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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-start gap-3 h-full",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "p-3 rounded-lg",
                category.color,
                "text-white shadow-sm"
              )}>
                <Icon className="h-6 w-6" />
              </div>
              
              <div>
                <h3 className="font-bold text-foreground">{category.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-full">
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
