/** Compresses an image file in the browser before upload: downscales to
 * a max dimension and re-encodes as JPEG. Typical phone camera photos
 * (3-8MB) shrink to a few hundred KB with no visible quality loss for
 * report evidence. Falls back to the original file if compression fails
 * for any reason (unsupported format, canvas error, etc.) rather than
 * blocking the upload. */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.75
): Promise<File> {
  // Skip already-small files and non-standard formats (e.g. HEIC that
  // browsers can't decode into a canvas reliably) — upload as-is.
  if (file.size < 400 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.\w+$/, '.jpg');
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}
