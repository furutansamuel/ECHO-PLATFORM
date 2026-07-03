import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Camera, 
  Image as ImageIcon, 
  Video,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ReportFormData } from '../report-schema';

export default function EvidenceUploadStep() {
  const { setValue, watch, formState: { errors } } = useFormContext<ReportFormData>();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const images = watch('images') || [];
  const video = watch('video');

  const simulateUpload = async (fileName: string, type: 'image' | 'video') => {
    setUploadingFiles(prev => ({ ...prev, [fileName]: 0 }));
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setUploadingFiles(prev => ({ ...prev, [fileName]: i }));
    }

    // Mock file URL
    const mockUrl = type === 'image' 
      ? `https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400`
      : 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';

    if (type === 'image') {
      setValue('images', [...images, mockUrl], { shouldValidate: true });
    } else {
      setValue('video', mockUrl, { shouldValidate: true });
    }

    setUploadingFiles(prev => {
      const next = { ...prev };
      delete next[fileName];
      return next;
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => simulateUpload(file.name, type));
    }
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
              Array.from(files).forEach(file => simulateUpload(file.name, 'image'));
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
            onChange={(e) => handleFileSelect(e, 'image')} 
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
                key={idx}
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
            
            {Object.entries(uploadingFiles).map(([fileName, progress]) => (
              <div key={fileName} className="relative aspect-square rounded-lg border bg-muted/30 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-full space-y-2">
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground truncate">{fileName}</p>
                </div>
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
        
        {!video ? (
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
              onChange={(e) => handleFileSelect(e, 'video')} 
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
