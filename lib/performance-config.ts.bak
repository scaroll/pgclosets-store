// Performance optimization configurations for Renin components

export const PERFORMANCE_CONFIG = {
  // Lazy loading settings
  lazyLoading: {
    threshold: 0.1,
    rootMargin: '100px',
    enableIntersectionObserver: true
  },

  // Image optimization settings
  imageOptimization: {
    quality: 85,
    sizes: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
    placeholder: 'blur' as const,
    priority: false,
    loading: 'lazy' as const
  },

  // Gallery settings
  gallery: {
    maxImagesPerRow: {
      mobile: 2,
      tablet: 3,
      desktop: 4
    },
    lightboxPreloadCount: 3,
    thumbnailSize: 120,
    enableVirtualization: true,
    debounceTime: 150
  },

  // Visualizer settings
  visualizer: {
    renderDebounceTime: 300,
    maxCanvasSize: {
      mobile: { width: 320, height: 240 },
      tablet: { width: 640, height: 480 },
      desktop: { width: 800, height: 600 }
    },
    enableWebGL: true,
    cacheRenderedImages: true
  },

  // Mobile-specific optimizations
  mobile: {
    maxImageQuality: 75,
    disableAnimations: false,
    enableTouchOptimizations: true,
    reducedMotion: false,
    swipeThreshold: 50
  },

  // Caching configuration
  cache: {
    enableImageCache: true,
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    cacheTTL: 24 * 60 * 60 * 1000, // 24 hours
    enableServiceWorker: true
  }
};

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  wide: 1920
} as const;

// Performance monitoring helpers
export const performanceHelpers = {
  // Check if device is low-end
  isLowEndDevice(): boolean {
    if (typeof navigator === 'undefined') return false;

    // Check for reduced data preference
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection?.saveData || connection?.effectiveType?.includes('2g')) {
        return true;
      }
    }

    // Check device memory (if available)
    if ('deviceMemory' in navigator) {
      return (navigator as any).deviceMemory <= 4;
    }

    // Check CPU cores
    if (navigator.hardwareConcurrency <= 2) {
      return true;
    }

    return false;
  },

  // Get optimal image quality based on device capabilities
  getOptimalImageQuality(): number {
    if (this.isLowEndDevice()) {
      return PERFORMANCE_CONFIG.mobile.maxImageQuality;
    }
    return PERFORMANCE_CONFIG.imageOptimization.quality;
  },

  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get device type based on screen size
  getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    if (width < BREAKPOINTS.mobile) return 'mobile';
    if (width < BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
  },

  // Calculate optimal grid columns based on device and content
  getOptimalGridColumns(itemCount: number): { mobile: number; tablet: number; desktop: number } {
    const deviceType = this.getDeviceType();
    const maxCols = PERFORMANCE_CONFIG.gallery.maxImagesPerRow;

    return {
      mobile: Math.min(itemCount, maxCols.mobile),
      tablet: Math.min(itemCount, maxCols.tablet),
      desktop: Math.min(itemCount, maxCols.desktop)
    };
  }
};

// SEO and accessibility helpers
export const accessibilityHelpers = {
  // Generate ARIA labels for gallery images
  generateImageAriaLabel(imageName: string, index: number, total: number): string {
    return `${imageName}, image ${index + 1} of ${total}`;
  },

  // Generate structured data for images
  generateImageStructuredData(images: Array<{ src: string; alt: string; caption?: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      'numberOfItems': images.length,
      'image': images.map(img => ({
        '@type': 'ImageObject',
        'url': img.src,
        'name': img.alt,
        'description': img.caption || img.alt
      }))
    };
  }
};

export default PERFORMANCE_CONFIG;