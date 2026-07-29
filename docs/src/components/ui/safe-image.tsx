import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

/**
 * Image with an automatic gradient fallback when the network image fails.
 * Prevents broken-image glyphs from breaking the layout.
 */
export function SafeImage({ src, alt, className, fallbackClassName, ...rest }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-success/20',
          fallbackClassName ?? className
        )}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="h-8 w-8 text-primary/60" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
