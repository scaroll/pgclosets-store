/**
 * Image Utility Functions
 * Helpers for optimized image loading with responsive variants
 */

export interface ImageVariant {
  format: 'avif' | 'webp' | 'jpg';
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
  width: number;
  path: string;
}

export interface OptimizedImageSource {
  src: string;
  srcSet: string;
  sizes?: string;
  type?: string;
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(
  basePath: string,
  sizes: Array<{ width: number; suffix: string }>,
  format: 'avif' | 'webp' | 'jpg' = 'webp'
): string {
  return sizes
    .map(({ width, suffix }) => {
      const ext = format === 'jpg' ? 'jpg' : format;
      const path = basePath.replace(/\.[^.]+$/, `${suffix}.${ext}`);
      return `${path} ${width}w`;
    })
    .join(', ');
}

/**
 * Get optimized image sources for <picture> element
 */
export function getOptimizedImageSources(
  imagePath: string,
  alt?: string
): OptimizedImageSource[] {
  // Remove extension and base path
  const baseName = imagePath.replace(/\.[^.]+$/, '');
  const isOptimized = imagePath.includes('/optimized-images/');
  const basePath = isOptimized ? baseName : `/optimized-images/${baseName}`;

  const sizes = [
    { width: 256, suffix: '-thumb' },
    { width: 640, suffix: '-sm' },
    { width: 1080, suffix: '-md' },
    { width: 1920, suffix: '-lg' },
  ];

  return [
    {
      src: `${basePath}.avif`,
      srcSet: generateSrcSet(basePath, sizes, 'avif'),
      type: 'image/avif',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
    {
      src: `${basePath}.webp`,
      srcSet: generateSrcSet(basePath, sizes, 'webp'),
      type: 'image/webp',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
    {
      src: `${basePath}.jpg`,
      srcSet: generateSrcSet(basePath, sizes, 'jpg'),
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
  ];
}

/**
 * Get image path for specific size and format
 */
export function getOptimizedImagePath(
  imagePath: string,
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium',
  format: 'avif' | 'webp' | 'jpg' = 'webp'
): string {
  const suffixMap = {
    thumbnail: '-thumb',
    small: '-sm',
    medium: '-md',
    large: '-lg',
    original: '',
  };

  const baseName = imagePath.replace(/\.[^.]+$/, '');
  const suffix = suffixMap[size];
  const ext = format === 'jpg' ? 'jpg' : format;

  return `/optimized-images/${baseName}${suffix}.${ext}`;
}

/**
 * Preload critical images
 */
export function preloadImage(
  imagePath: string,
  format: 'avif' | 'webp' | 'jpg' = 'avif',
  size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getOptimizedImagePath(imagePath, size, format);
  link.type = `image/${format}`;

  document.head.appendChild(link);
}

/**
 * Generate blur placeholder data URL
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
      <rect width="${width}" height="${height}" fill="#e5e7eb" filter="url(#blur)" />
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Lazy load image configuration
 */
export const lazyLoadConfig = {
  rootMargin: '50px 0px', // Start loading 50px before entering viewport
  threshold: 0.01,
  loading: 'lazy' as const,
};

/**
 * Get responsive image sizes for different breakpoints
 */
export function getResponsiveSizes(type: 'hero' | 'product' | 'thumbnail' | 'gallery' = 'product'): string {
  const sizeMap = {
    hero: '100vw',
    product: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    thumbnail: '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 256px',
    gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px',
  };

  return sizeMap[type];
}

/**
 * Get Next.js Image component props
 */
export interface NextImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function getNextImageProps(
  imagePath: string,
  alt: string,
  options: {
    width?: number;
    height?: number;
    priority?: boolean;
    type?: 'hero' | 'product' | 'thumbnail' | 'gallery';
  } = {}
): NextImageProps {
  const { width = 1920, height = 1080, priority = false, type = 'product' } = options;

  return {
    src: imagePath,
    alt,
    width,
    height,
    quality: 90,
    priority,
    sizes: getResponsiveSizes(type),
    placeholder: 'blur',
    blurDataURL: getBlurDataURL(),
  };
}
