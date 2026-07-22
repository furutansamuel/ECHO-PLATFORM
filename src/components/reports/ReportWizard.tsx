import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import { useReportsStore, Report } from "@/hooks/use-reports-store";

import {
  reportSchema,
  ReportFormData,
  defaultValues,
} from "./report-schema";

import HazardSelectStep from "./steps/HazardSelectStep";
import HazardDetailsStep from "./steps/HazardDetailsStep";
import EvidenceUploadStep from "./steps/EvidenceUploadStep";
import LocationStep from "./steps/LocationStep";
import PreviewStep from "./steps/PreviewStep";
import SuccessStep from "./steps/SuccessStep";

const STEPS = [
  "Hazard",
  "Details",
  "Evidence & Location",
  "Preview",
  "Success",
];

export default function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [referenceNumber, setReferenceNumber] = useState("");
  const [submittedReportId, setSubmittedReportId] = useState("");

  const { saveReport, saveDraft, draft } =
    useReportsStore();

  const methods = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema) as any,
    defaultValues: (draft as any) || defaultValues,
    mode: "onChange",
  });

  const {
    watch,
    trigger,
    handleSubmit,
  } = methods;

  const formData = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      saveDraft(value as Partial<Report>);
    });

    return () => subscription.unsubscribe();
  }, [watch, saveDraft]);

  const nextStep = async () => {
    let fields: string[] = [];

    switch (currentStep) {
      case 0:
        fields = ["category"];
        break;

      case 1:
        fields = [
          "title",
          "description",
          "severity",
        ];
        break;

      case 2:
        fields = [
          "images",
          "location.address",
          "location.state",
          "location.lga",
        ];
        break;

      default:
        fields = [];
    }

    const valid = await trigger(fields as any);

    if (!valid) {
      toast.error("Please complete the required fields.");
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setCurrentStep((prev) =>
      Math.min(prev + 1, STEPS.length - 1)
    );
  };

  const prevStep = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setCurrentStep((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);

    try {
      const referenceNumber = `ECHO-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      const report: Report = {
        ...(data as any),

        id: Math.random().toString(36).substring(2, 10),

        createdAt: new Date().toISOString(),

        referenceNumber,

        status: "Pending",
      };

      const success = await saveReport(report);

      if (!success) {
        setIsSubmitting(false);
        return;
      }

      setReferenceNumber(referenceNumber);
      setSubmittedReportId(report.id);

      setCurrentStep(4);

      toast.success(
        "Hazard report submitted successfully."
      );
    } catch {
      toast.error(
        "Unable to submit report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

const renderStep = () => {
  switch (currentStep) {
    case 0:
      return <HazardSelectStep />;

    case 1:
      return <HazardDetailsStep />;

    case 2:
      return (
        <div className="space-y-8">
          <EvidenceUploadStep />
          <LocationStep />
        </div>
      );

    case 3:
      return (
        <PreviewStep
          onEdit={(step) => setCurrentStep(step)}
        />
      );

    case 4:
      return (
        <SuccessStep
          referenceNumber={referenceNumber}
          reportId={submittedReportId}
          title={methods.getValues("title")}
          category={methods.getValues("category")}
        />
      );

    default:
      return null;
  }
};

const progress =
  const progress =
(currentStep / 3) * 100;

if (currentStep === 4) {
  return (
    <SuccessStep
      referenceNumber={referenceNumber}
      reportId={submittedReportId}
      title={methods.getValues("title")}
      category={methods.getValues("category")}
    />
  );
}

return (
  <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Report Environmental Hazard
          </h1>

          <p className="text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length - 1}:{" "}
            {STEPS[currentStep]}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (
              confirm(
                "Cancel report? Your draft will be saved."
              )
            ) {
              window.history.back();
            }
          }}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />

        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          {STEPS.slice(0, -1).map((_, index) => (
            <span
              key={index}
              className={
                index <= currentStep
                  ? "text-primary"
                  : ""
              }
            >
              {index + 1}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Form */}
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -20,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-8">
          <Button
            type="button"
            variant="outline"
            disabled={
              currentStep === 0 ||
              isSubmitting
            }
            onClick={prevStep}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => {
                saveDraft(
                  formData as Partial<Report>
                );

                toast.success(
                  "Draft saved."
                );
              }}
              className="hidden sm:flex"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>

            {currentStep === 3 ? (
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    </motion.div>

                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Report

                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
              >
                Next

                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  </div>
);
}
