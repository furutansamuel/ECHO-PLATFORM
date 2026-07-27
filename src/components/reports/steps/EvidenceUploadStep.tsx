import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Camera,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ReportFormData } from "../report-schema";
import { compressImage } from "@/lib/image-compression";

export default function EvidenceUploadStep() {
  const {
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<ReportFormData>();

  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<
    Record<string, number>
  >({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const images = watch("images") || [];
  const video = watch("video");

  const validateFile = (
    file: File,
    type: "image" | "video"
  ): boolean => {
    if (type === "image") {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image.");
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Each image must be less than 5MB.");
        return false;
      }

      if (images.length >= 10) {
        toast.error("Maximum of 10 images allowed.");
        return false;
      }
    }

    if (type === "video") {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video.");
        return false;
      }

      if (file.size > 20 * 1024 * 1024) {
        toast.error("Video must be less than 20MB.");
        return false;
      }
    }

    return true;
  };

  const uploadFile = async (
    file: File,
    type: "image" | "video"
  ) => {
    if (!validateFile(file, type)) return;

    // Both images and videos live in the single 'report-evidence' bucket —
    // that's the only bucket that actually exists with a matching storage
    // RLS policy (see docs/echo-supabase-sync.sql). Uploading to
    // 'report-images'/'report-videos' always failed with "new row violates
    // row-level security policy" because those buckets don't exist at all.
    const bucket = "report-evidence";

    let uploadFile = file;
    if (type === "image") {
      setUploadingFiles((prev) => ({ ...prev, [file.name]: 5 }));
      uploadFile = await compressImage(file);
    }

    const extension = uploadFile.name.split(".").pop();

    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

    setUploadingFiles((prev) => {
      const next = { ...prev };
      delete next[file.name];
      return { ...next, [filename]: 25 };
    });

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast.error(error.message);

      setUploadingFiles((prev) => {
        const next = { ...prev };
        delete next[filename];
        return next;
      });

      return;
    }

    setUploadingFiles((prev) => ({
      ...prev,
      [filename]: 100,
    }));

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    if (type === "image") {
      // Read the CURRENT images array at the moment this upload
      // finishes, not the 'images' variable captured when uploadFile()
      // was first called. Multiple images upload concurrently
      // (handleFileSelect fires uploadFile for each file without
      // awaiting), and they all closed over the same stale snapshot of
      // 'images' from that render — so each completed upload was
      // overwriting the previous one's addition instead of appending
      // to it, leaving only the last image that finished. getValues()
      // always reads the live form state, so each completion correctly
      // appends onto whatever is there right now.
      const currentImages = getValues("images") || [];
      setValue(
        "images",
        [...currentImages, data.publicUrl],
        {
          shouldValidate: true,
        }
      );
    } else {
      setValue("video", data.publicUrl, {
        shouldValidate: true,
      });
    }

    setUploadingFiles((prev) => {
      const next = { ...prev };
      delete next[filename];
      return next;
    });

    toast.success(
      `${type === "image" ? "Image" : "Video"} uploaded successfully.`
    );
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const files = e.target.files;

    if (!files) return;

    Array.from(files).forEach((file) => {
      uploadFile(file, type);
    });

    e.target.value = "";
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];

    try {
      const path = imageUrl.split("/").pop();

      if (path) {
        await supabase.storage
          .from("report-evidence")
          .remove([path]);
      }
    } catch {}

    const updated = [...images];
    updated.splice(index, 1);

    setValue("images", updated, {
      shouldValidate: true,
    });
  };

  const removeVideo = async () => {
    if (!video) return;

    try {
      const path = video.split("/").pop();

      if (path) {
        await supabase.storage
          .from("report-evidence")
          .remove([path]);
      }
    } catch {}

    setValue("video", undefined);
  };

return (
  <div className="space-y-8">
    {/* ================= IMAGES ================= */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          Images
        </Label>

        <span className="text-xs text-muted-foreground">
          {images.length}/10 Images
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);

          const files = e.dataTransfer.files;

          if (!files) return;

          Array.from(files).forEach((file) => {
            uploadFile(file, "image");
          });
        }}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 transition-all duration-300",
          "flex flex-col items-center justify-center gap-5",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40",
          errors.images && "border-destructive"
        )}
      >
        <div className="rounded-full bg-primary/10 p-5">
          <Upload className="h-8 w-8 text-primary" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-semibold">
            Upload Hazard Images
          </h3>

          <p className="text-sm text-muted-foreground">
            Drag & drop or choose images from your phone.
          </p>

          <p className="text-xs text-muted-foreground">
            JPG • PNG • WEBP • Max 5MB each
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Gallery
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </Button>
        </div>

        {/* Gallery */}

        <input
          ref={fileInputRef}
          hidden
          multiple
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleFileSelect(e, "image")
          }
        />

        {/* Camera */}

        <input
          ref={cameraInputRef}
          hidden
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) =>
            handleFileSelect(e, "image")
          }
        />
      </div>

      {errors.images && (
        <p className="text-sm text-destructive">
          {errors.images.message}
        </p>
      )}

      {/* Upload Progress */}

      {Object.entries(uploadingFiles).length > 0 && (
        <div className="space-y-3">
          {Object.entries(uploadingFiles).map(
            ([file, progress]) => (
              <div
                key={file}
                className="rounded-lg border p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="truncate text-xs">
                    {file}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {progress}%
                  </span>
                </div>

                <Progress value={progress} />
              </div>
            )
          )}
        </div>
      )}

      {/* Image Preview */}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image}
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              className="group relative overflow-hidden rounded-xl border bg-muted aspect-square"
            >
              <img
                src={image}
                alt={`Evidence ${index + 1}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() =>
                    removeImage(index)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}

          {images.length < 10 && (
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-border transition hover:border-primary hover:bg-primary/5"
            >
              <Plus className="mb-2 h-6 w-6" />

              <span className="text-xs font-medium">
                Add Image
              </span>
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>

        {/* ================= VIDEO ================= */}

    <div className="space-y-4 border-t pt-8">
      <Label className="text-base font-semibold">
        Video Evidence (Optional)
      </Label>

      {!video ? (
        <>
          <Button
            type="button"
            variant="outline"
            className="h-28 w-full border-dashed"
            onClick={() => videoInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <Video className="h-6 w-6" />
              <span>Upload Video</span>
              <span className="text-xs text-muted-foreground">
                MP4 • MOV • WEBM • Max 20MB
              </span>
            </div>
          </Button>

          <input
            ref={videoInputRef}
            hidden
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e, "video")}
          />
        </>
      ) : (
        <div className="relative overflow-hidden rounded-xl border">
          <video
            src={video}
            controls
            className="aspect-video w-full bg-black"
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-3 top-3"
            onClick={removeVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  </div>
);
}

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

const Label = ({
  children,
  className,
}: LabelProps) => (
  <label
    className={cn(
      "text-sm font-medium leading-none",
      className
    )}
  >
    {children}
  </label>
);

