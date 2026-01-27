import { type ImgHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  eager?: boolean; // Set to true for above-the-fold images
}

/**
 * Optimized Image component with automatic lazy loading
 * Use eager={true} for above-the-fold images (hero images, logos, etc.)
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  eager = false,
  className,
  ...props 
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={cn('transition-opacity duration-300', className)}
      {...props}
    />
  );
}
