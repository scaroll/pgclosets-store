import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'lazy' | 'eager';
  critical?: boolean;
}

interface ImageManifest {
  version: number;
  optimized: Array<{
    name: string;
    sizes: Array<{
      size: string;
      format: string;
      path: string;
    }>;
  }>;
  generated: string;
}

/**
 * Apple-grade optimized image component with:
 * - Automatic WebP/AVIF format selection
 * - Responsive sizing for all devices
 * - Progressive loading with blur-up
 * - Critical image preloading
 * - Core Web Vitals optimization
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  fetchPriority = priority ? 'high' : 'auto',
  loading = priority ? 'eager' : 'lazy',
  critical = priority,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
  const [imageManifest, setImageManifest] = useState<ImageManifest | null>(null);

  // Extract image name from path
  const getImageName = (imagePath: string) => {
    const pathParts = imagePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    return fileName.includes('.') ? fileName.split('.')[0] : fileName;
  };

  // Load image manifest
  useEffect(() => {
    const loadManifest = async () => {
      try {
        const response = await fetch('/images/manifest.json');
        if (response.ok) {
          const manifest = await response.json();
          setImageManifest(manifest);
        }
      } catch (error) {
        console.warn('Could not load image manifest:', error);
      }
    };

    loadManifest();
  }, []);

  // Find optimized image sources
  useEffect(() => {
    if (!imageManifest) return;

    const imageName = getImageName(src);
    const optimizedImage = imageManifest.optimized.find(img => img.name === imageName);

    if (optimizedImage) {
      // Use optimized images if available
      const mobileWebp = optimizedImage.sizes.find(
        s => s.size === 'mobile' && s.format === 'webp'
      );
      if (mobileWebp) {
        setOptimizedSrc(mobileWebp.path);
      }
    } else {
      // Fallback to original image
      setOptimizedSrc(src);
    }
  }, [src, imageManifest]);

  // Generate blur data URL for performance
  const generateBlurDataURL = (imagePath: string) => {
    if (blurDataURL) return blurDataURL;

    // Simple 1x1 blur placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=';
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  // Fallback for errors
  if (error && !optimizedSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  const imageSrc = optimizedSrc || src;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={critical}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={generateBlurDataURL(imageSrc)}
        onLoad={handleLoad}
        onError={handleError}
        fetchPriority={fetchPriority}
        loading={loading}
        sizes={sizes}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          critical && 'animate-pulse bg-gray-100 dark:bg-gray-800'
        )}
        // Performance optimizations
        decoding={critical ? 'sync' : 'async'}
        // Critical for LCP optimization
        {...(critical && {
          style: {
            contentVisibility: 'auto',
            containIntrinsicSize: `${width || 400}px ${height || 300}px`,
          },
        })}
      />

      {/* Loading skeleton for better perceived performance */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
            critical && 'animate-pulse',
            'pointer-events-none'
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

/**
 * Hero image component with aggressive optimization
 */
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'priority' | 'critical' | 'fetchPriority'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      critical={true}
      fetchPriority="high"
      loading="eager"
      quality={90}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
    />
  );
};

/**
 * Content image component with balanced optimization
 */
export const ContentImage: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      {...props}
      priority={false}
      critical={false}
      fetchPriority="auto"
      loading="lazy"
      quality={85}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
};

/**
 * Thumbnail image component with minimal optimization
 */
export const ThumbnailImage: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      {...props}
      priority={false}
      critical={false}
      fetchPriority="low"
      loading="lazy"
      quality={75}
      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 10vw"
    />
  );
};

export default OptimizedImage;