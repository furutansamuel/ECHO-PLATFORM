import { supabase } from '@/integrations/supabase/client';

export type UploadBucket = 'report-images' | 'article-images' | 'event-images' | 'profile-images';

const MAX_SIZES: Record<UploadBucket, number> = {
  'report-images': 5 * 1024 * 1024,
  'article-images': 5 * 1024 * 1024,
  'event-images': 5 * 1024 * 1024,
  'profile-images': 2 * 1024 * 1024,
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Uploads a single image file to the given Supabase Storage bucket and
 * returns its public URL. `folder` should usually be the current user's
 * id — report-images and profile-images RLS policies specifically check
 * that the first path segment matches auth.uid().
 */
export async function uploadImage(
  bucket: UploadBucket,
  file: File,
  folder: string
): Promise<UploadResult> {
  if (!supabase) {
    return { url: null, error: 'Backend not configured.' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: 'Only JPG, PNG, and WEBP images are supported.' };
  }

  const maxSize = MAX_SIZES[bucket];
  if (file.size > maxSize) {
    return { url: null, error: `Image must be under ${Math.round(maxSize / 1024 / 1024)}MB.` };
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${folder}/${uniqueName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

/** Uploads multiple images in parallel, returning URLs in the same order.
 * Files that fail to upload are dropped (with their errors collected)
 * rather than failing the whole batch — one bad photo shouldn't block
 * the others a citizen already successfully attached. */
export async function uploadImages(
  bucket: UploadBucket,
  files: File[],
  folder: string
): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.all(files.map((file) => uploadImage(bucket, file, folder)));
  const urls = results.filter((r) => r.url).map((r) => r.url as string);
  const errors = results.filter((r) => r.error).map((r) => r.error as string);
  return { urls, errors };
}
