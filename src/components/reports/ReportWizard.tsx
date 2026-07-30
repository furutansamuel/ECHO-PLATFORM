import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { HazardReport } from "@/types/reports";

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
  "Location",
  "Evidence",
  "Review",
  "Success",
];

export default function ReportWizard({ editReport }: { editReport?: HazardReport }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Guards against a known browser race: when the footer swaps the Next
  // button for the Submit button at the same screen position, a tap/click
  // gesture that is still in progress can activate the newly-mounted Submit
  // button — submitting the form without the user ever seeing Review.
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advancingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [referenceNumber, setReferenceNumber] = useState(editReport?.reference_number || "");
  const [submittedReportId, setSubmittedReportId] = useState("");

  const { saveReport, updateReport, saveDraft, draft } =
    useReportsStore();

  const [searchParams] = useSearchParams();

  // Editing an existing report seeds the form from that report and
  // ignores any unrelated local draft — a stale draft from a different,
  // unfinished report should never silently overwrite the one the user
  // came here to edit.
  const editDefaultValues: Partial<ReportFormData> | undefined = editReport
    ? {
        category: editReport.category,
        title: editReport.title,
        description: editReport.description,
        dateObserved: editReport.date_observed,
        timeObserved: editReport.time_observed,
        images: editReport.images,
        video: editReport.video,
        location: editReport.location,
        isAnonymous: editReport.is_anonymous,
        notifyVolunteers: editReport.notify_volunteers,
        shareWithCommunity: editReport.share_with_community,
        receiveUpdates: editReport.receive_updates,
      }
    : undefined;

  const methods = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema) as any,
    defaultValues: editDefaultValues || (draft as any) || defaultValues,
    mode: "onChange",
  });

  const {
    watch,
    trigger,
    handleSubmit,
    setValue,
  } = methods;

  // Deep-link support: /report?category=Flood pre-selects that category
  // (used by the landing page's hazard-category cards). Only applies
  // when there's no existing draft, so it never overwrites in-progress
  // work.
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && !draft && !editReport) {
      setValue('category', categoryParam as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formData = watch();

  useEffect(() => {
    if (editReport) return;
    const subscription = watch((value) => {
      saveDraft(value as Partial<Report>);
    });

    return () => subscription.unsubscribe();
  }, [watch, saveDraft, editReport]);

  const nextStep = async () => {
    if (advancingRef.current || isSubmitting) return;

    let fields: string[] = [];

    switch (currentStep) {
      case 0:
        fields = ["category", "title", "description"];
        break;

      case 1:
        fields = [
          "location.address",
          "location.state",
          "location.lga",
          "location.ward",
        ];
        break;

      case 2:
        fields = ["images"];
        break;

      default:
        fields = [];
    }

    advancingRef.current = true;
    setIsAdvancing(true);

    const valid = await trigger(fields as any);

    if (!valid) {
      toast.error("Please complete the required fields.");
      advancingRef.current = false;
      setIsAdvancing(false);
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Defer the step commit until the current click/tap gesture has fully
    // completed. Without this, the commit can land mid-gesture: the footer
    // swaps Next for the Submit button at the same position, and the browser
    // activates the freshly-mounted submit button, instantly submitting the
    // form and skipping the Review step.
    window.setTimeout(() => {
      setCurrentStep((prev) =>
        Math.min(prev + 1, STEPS.length - 1)
      );
      // Keep the footer buttons disabled briefly so a still-in-progress
      // gesture can never activate the newly-mounted Submit button.
      window.setTimeout(() => {
        advancingRef.current = false;
        setIsAdvancing(false);
      }, 250);
    }, 0);
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

  const navigate = useNavigate();

  const onSubmit = async (data: ReportFormData) => {
    // Backstop for the gesture race described above: a submit that fires
    // while a step transition is still settling did not come from a real
    // tap on "Submit Report" — ignore it and leave the Review step visible.
    if (advancingRef.current) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editReport) {
        const success = await updateReport(editReport.id, data as Partial<Report>);
        setIsSubmitting(false);
        if (success) {
          navigate(`/reports/${editReport.id}`);
        }
        return;
      }

      const report: Report = {
        ...(data as any),

        // Captured fresh at the moment of submission rather than relying
        // on the value from when the form first mounted (defaultValues
        // only runs once, so a report started 20 minutes before
        // submitting would otherwise show a stale timestamp).
        dateObserved: new Date().toISOString().split('T')[0],
        timeObserved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),

        id: Math.random().toString(36).substring(2, 10),

        createdAt: new Date().toISOString(),

        // Placeholder only — saveReport() overwrites this with the real
        // reference number the database trigger assigns. The previous
        // version displayed this random client-side placeholder on the
        // success screen instead of the real saved value.
        referenceNumber: "",

        status: "Pending",
      };

      const success = await saveReport(report);

      if (!success) {
        setIsSubmitting(false);
        return;
      }

      setReferenceNumber(report.referenceNumber);
      setSubmittedReportId(report.id);

      setCurrentStep(4);

      toast.success(
        "Hazard report submitted successfully."
      );
    } catch {
      toast.error(
        editReport ? "Unable to update report." : "Unable to submit report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

const renderStep = () => {
  switch (currentStep) {
    case 0:
      return (
        <div className="space-y-8">
          <HazardSelectStep />
          <HazardDetailsStep />
        </div>
      );

    case 1:
      return <LocationStep />;

    case 2:
      return <EvidenceUploadStep />;

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
  const progress = (currentStep / 3) * 100;

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
            {editReport ? "Edit Report" : "Report Environmental Hazard"}
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
                editReport
                  ? "Discard your changes to this report?"
                  : "Cancel report? Your draft will be saved."
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
        onKeyDown={(e) => {
          // Pressing Enter in any text field defaults to submitting the
          // nearest <form> — since this one <form> wraps every step,
          // that meant Enter on step 0/1/2 skipped straight to
          // onSubmit() (which always jumps to the Success screen),
          // bypassing the Review step entirely. Only allow Enter to
          // submit once the user is actually on the Review step. This
          // is a separate failure mode from the button-swap gesture
          // race guarded above — both can independently cause the same
          // "skips Review" symptom, so both guards are needed.
          if (e.key === "Enter" && currentStep !== 3) {
            e.preventDefault();
          }
        }}
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
              isSubmitting ||
              isAdvancing
            }
            onClick={prevStep}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-3">
            {!editReport && (
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
            )}

            {currentStep === 3 ? (
              <Button
                type="submit"
                disabled={isSubmitting || isAdvancing}
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

                    {editReport ? "Saving..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    {editReport ? "Save Changes" : "Submit Report"}

                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isAdvancing || isSubmitting}
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
