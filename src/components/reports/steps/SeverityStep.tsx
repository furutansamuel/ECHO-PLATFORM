import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  AlertTriangle, 
  Flame, 
  Info,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReportFormData } from '../report-schema';

const SEVERITIES = [
  {
    id: 'Low',
    title: 'Low',
    description: 'Minor environmental issue with minimal immediate impact. Requires routine attention.',
    icon: Info,
    color: 'bg-green-500',
    borderColor: 'border-green-200',
    activeBg: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    id: 'Medium',
    title: 'Medium',
    description: 'Noticeable impact on the local environment. Should be addressed within a few days.',
    icon: AlertCircle,
    color: 'bg-orange-500',
    borderColor: 'border-orange-200',
    activeBg: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  {
    id: 'High',
    title: 'High',
    description: 'Significant environmental damage or health risk. Requires urgent attention.',
    icon: AlertTriangle,
    color: 'bg-red-500',
    borderColor: 'border-red-200',
    activeBg: 'bg-red-50',
    textColor: 'text-red-700'
  },
  {
    id: 'Critical',
    title: 'Critical',
    description: 'Severe immediate threat to life, property, or ecosystem. Emergency action required.',
    icon: Flame,
    color: 'bg-red-900',
    borderColor: 'border-red-400',
    activeBg: 'bg-red-100',
    textColor: 'text-red-900'
  }
];

export default function SeverityStep() {
  const { setValue, watch } = useFormContext<ReportFormData>();
  const selectedSeverity = watch('severity');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {SEVERITIES.map((severity) => {
          const Icon = severity.icon;
          const isSelected = selectedSeverity === severity.id;
          
          return (
            <motion.div
              key={severity.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setValue('severity', severity.id as any)}
              className={cn(
                "relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-5",
                isSelected 
                  ? `${severity.borderColor} ${severity.activeBg} shadow-md` 
                  : "border-border hover:border-muted-foreground/30 bg-card"
              )}
            >
              <div className={cn(
                "p-4 rounded-xl text-white shadow-lg",
                severity.color
              )}>
                <Icon className="h-7 w-7" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={cn("text-lg font-bold", severity.textColor)}>{severity.title}</h3>
                  {isSelected && (
                    <div className={cn("p-1 rounded-full text-white", severity.color)}>
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{severity.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
