import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  X,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useReportsStore, Report } from '@/hooks/use-reports-store';
import { reportSchema, ReportFormData, defaultValues } from './report-schema';

// Step Components
import HazardSelectStep from './steps/HazardSelectStep';
import HazardDetailsStep from './steps/HazardDetailsStep';
import EvidenceUploadStep from './steps/EvidenceUploadStep';
import LocationStep from './steps/LocationStep';
import SeverityStep from './steps/SeverityStep';
import AdditionalOptionsStep from './steps/AdditionalOptionsStep';
import PreviewStep from './steps/PreviewStep';
import SuccessStep from './steps/SuccessStep';

const STEPS = [
  'Select Hazard',
  'Hazard Details',
  'Upload Evidence',
  'Location',
  'Severity',
  'Additional Options',
  'Preview',
  'Submit'
];

export default function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const { saveReport, saveDraft, draft } = useReportsStore();

  const methods = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema) as any,
    defaultValues: (draft as any) || defaultValues,
    mode: 'onChange',
  });

  const { watch, handleSubmit, trigger } = methods;
  const formData = watch();

  // Auto-save draft
  useEffect(() => {
    const subscription = watch((value) => {
      saveDraft(value as Partial<Report>);
    });
    return () => subscription.unsubscribe();
  }, [watch, saveDraft]);

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (currentStep === 0) fieldsToValidate = ['category'];
    else if (currentStep === 1) fieldsToValidate = ['title', 'description', 'estimatedSize', 'affectedArea', 'dateObserved', 'timeObserved', 'immediateRisk', 'environmentalImpact', 'requiredAction'];
    else if (currentStep === 2) fieldsToValidate = ['images'];
    else if (currentStep === 3) fieldsToValidate = ['location.address', 'location.ward', 'location.lga', 'location.state'];
    else if (currentStep === 4) fieldsToValidate = ['severity'];

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const ref = `ECHO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const report: Report = {
        ...(data as ReportFormData),
        id: Math.random().toString(36).substring(2, 9),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        referenceNumber: ref,
      } as Report;

      const success = await saveReport(report);
      if (success) {
        setReferenceNumber(ref);
        setCurrentStep(STEPS.length - 1); // Move to Success Step
      }
      // On failure, saveReport already shows an error toast — stay on
      // the current step so the person doesn't lose their filled-in data.
    } catch {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <HazardSelectStep />;
      case 1: return <HazardDetailsStep />;
      case 2: return <EvidenceUploadStep />;
      case 3: return <LocationStep />;
      case 4: return <SeverityStep />;
      case 5: return <AdditionalOptionsStep />;
      case 6: return <PreviewStep onEdit={(step) => setCurrentStep(step)} />;
      case 7: return <SuccessStep referenceNumber={referenceNumber} />;
      default: return null;
    }
  };

  const progress = ((currentStep) / (STEPS.length - 1)) * 100;

  if (currentStep === STEPS.length - 1) {
    return <SuccessStep referenceNumber={referenceNumber} />;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Report Environmental Hazard</h1>
            <p className="text-muted-foreground">Step {currentStep + 1} of {STEPS.length - 1}: {STEPS[currentStep]}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => {
            if (confirm('Are you sure you want to cancel? Your progress will be saved as a draft.')) {
              window.history.back();
            }
          }}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            {STEPS.slice(0, -1).map((step, index) => (
              <span 
                key={step} 
                className={index <= currentStep ? 'text-primary' : ''}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  saveDraft(formData as Partial<Report>);
                  toast.success('Draft saved successfully');
                }}
                disabled={isSubmitting}
                className="hidden sm:flex items-center gap-2 text-muted-foreground"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>

              {currentStep === STEPS.length - 2 ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-white px-8 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </motion.div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Report
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-white px-8 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
