import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Upload, 
  X, 
  Camera, 
  Image as ImageIcon, 
  Video,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReportFormData } from '../report-schema';
import { useAuth } from '@/hooks/use-auth';
import { uploadImage } from '@/lib/storage-upload';
import { supabase } from '@/integrations/supabase/client';

const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

export default function EvidenceUploadStep() {
  const { setValue, watch, formState: { errors } } = useFormContext<ReportFormData>();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const images = watch('images') || [];
  const video = watch('video');

  const uploadFiles = async (files: File[]) => {
    if (!user) {
      toast.error('You must be signed in to attach photos.');
      return;
    }
    const room = Math.max(0, 5 - images.length);
    const toUpload = files.slice(0, room);
    if (files.length > room) {
      toast.info(`Only ${room} more image${room === 1 ? '' : 's'} can be added (max 5).`);
    }

    setUploadingCount((c) => c + toUpload.length);
    const results = await Promise.all(
      toUpload.map((file) => uploadImage('report-images', file, user.id))
    );
    setUploadingCount((c) => Math.max(0, c - toUpload.length));

    const urls = results.filter((r) => r.url).map((r) => r.url as string);
    const failed = results.filter((r) => r.error);
    if (urls.length > 0) {
      setValue('images', [...images, ...urls], { shouldValidate: true });
    }
    failed.forEach((r) => toast.error(r.error || 'Failed to upload an image.'));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(Array.from(files));
    }
    e.target.value = '';
  };

  const uploadVideo = async (file: File) => {
    if (!user) {
      toast.error('You must be signed in to attach a video.');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      toast.error('Video must be under 20MB.');
      return;
    }
    if (!supabase) {
      toast.error('Backend not configured.');
      return;
    }
    setUploadingVideo(true);
    const ext = file.name.split('.').pop() || 'mp4';
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('report-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    setUploadingVideo(false);
    if (error) {
      toast.error('Failed to upload video: ' + error.message);
      return;
    }
    const { data } = supabase.storage.from('report-images').getPublicUrl(path);
    setValue('video', data.publicUrl, { shouldValidate: true });
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadVideo(file);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Images</Label>
          <span className="text-xs text-muted-foreground">Up to 5 images</span>
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
              uploadFiles(Array.from(files));
            }
          }}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center gap-4",
            isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border hover:border-primary/50 bg-card",
            errors.images ? "border-destructive" : ""
          )}
        >
          <div className="bg-primary/10 p-4 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-medium">Drag and drop images here</p>
            <p className="text-sm text-muted-foreground mt-1">Support JPG, PNG, WEBP (Max 5MB each)</p>
          </div>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Browse Gallery
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            multiple 
            className="hidden" 
          />
        </div>

        {/* Previews */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {images.map((img, idx) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeImage(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            {Array.from({ length: uploadingCount }).map((_, i) => (
              <div key={`uploading-${i}`} className="relative aspect-square rounded-lg border bg-muted/30 flex flex-col items-center justify-center gap-2 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-[10px] text-muted-foreground">Uploading…</p>
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground transition-all"
              >
                <Plus className="h-6 w-6" />
                <span className="text-[10px] font-medium">Add More</span>
              </button>
            )}
          </AnimatePresence>
        </div>
        {errors.images && <p className="text-xs text-destructive font-medium">{errors.images.message}</p>}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">Video Evidence (Optional)</Label>
        
        {uploadingVideo ? (
          <div className="h-24 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Uploading video…</span>
          </div>
        ) : !video ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-24 border-dashed flex flex-col gap-2"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="h-6 w-6 text-muted-foreground" />
              <span>Record or Upload Video</span>
              <span className="text-[10px] text-muted-foreground">Max 20MB, MP4/MOV</span>
            </Button>
            <input 
              type="file" 
              ref={videoInputRef} 
              onChange={handleVideoSelect} 
              accept="video/*" 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black group">
            <video src={video} className="w-full h-full object-cover" controls />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => setValue('video', undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>
    {children}
  </label>
);
