/**
 * DIVISION 14: PERFORMANCE ENGINEERING
 * Code Splitting Utilities - Agents 3-4
 *
 * Dynamic import helpers for optimal code splitting:
 * - Component-level lazy loading
 * - Route-based splitting
 * - Vendor chunk optimization
 * - Loading state management
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface DynamicLoadOptions {
  loading?: ComponentType;
  ssr?: boolean;
  suspense?: boolean;
}

export interface LazyLoadConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// ============================================================================
// DYNAMIC IMPORT HELPERS
// ============================================================================

/**
 * Create dynamic component with optimized loading
 */
export function createDynamicComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicLoadOptions = {}
) {
  return dynamic(importFn, {
    loading: options.loading || (() => (
      <div className="animate-pulse bg-muted h-32 w-full rounded-lg" />
    )),
    ssr: options.ssr ?? true,
    suspense: options.suspense ?? false,
  });
}

/**
 * Create client-side only component (no SSR)
 */
export function createClientComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicLoadOptions = {}
) {
  return createDynamicComponent(importFn, {
    ...options,
    ssr: false,
  });
}

// ============================================================================
// COMMON DYNAMIC COMPONENTS
// ============================================================================

/**
 * Heavy UI components - Load on demand
 */

// Rich Text Editor
export const DynamicEditor = createClientComponent(
  () => import('@/components/editor/RichTextEditor'),
  {
    loading: () => (
      <div className="border rounded-lg p-4 bg-muted/50">
        <div className="h-48 animate-pulse bg-muted rounded" />
      </div>
    ),
  }
);

// Charts and Analytics
export const DynamicChart = createClientComponent(
  () => import('@/components/analytics/Chart'),
  {
    loading: () => (
      <div className="h-64 animate-pulse bg-muted rounded-lg" />
    ),
  }
);

// Product Configurator (heavy component)
export const DynamicConfigurator = createDynamicComponent(
  () => import('@/components/products/ProductConfigurator'),
  {
    ssr: false, // Client-side only for interactive features
    loading: () => (
      <div className="space-y-4">
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
        <div className="h-12 animate-pulse bg-muted rounded-lg w-1/3" />
      </div>
    ),
  }
);

// Image Gallery (with lazy loading)
export const DynamicGallery = createDynamicComponent(
  () => import('@/components/gallery/ImageGallery'),
  {
    loading: () => (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-muted rounded-lg" />
        ))}
      </div>
    ),
  }
);

// Video Player
export const DynamicVideoPlayer = createClientComponent(
  () => import('@/components/media/VideoPlayer'),
  {
    loading: () => (
      <div className="aspect-video animate-pulse bg-muted rounded-lg flex items-center justify-center">
        <svg className="w-16 h-16 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
        </svg>
      </div>
    ),
  }
);

// Modal/Dialog (load when needed)
export const DynamicModal = createClientComponent(
  () => import('@/components/ui/dialog')
);

// Dropdown Menu (load on interaction)
export const DynamicDropdown = createClientComponent(
  () => import('@/components/ui/dropdown-menu')
);

// Calendar/Date Picker
export const DynamicCalendar = createClientComponent(
  () => import('@/components/ui/calendar'),
  {
    loading: () => (
      <div className="w-full h-64 animate-pulse bg-muted rounded-lg" />
    ),
  }
);

// ============================================================================
// ROUTE-BASED CODE SPLITTING
// ============================================================================

/**
 * Admin dashboard components - Load only for admin users
 */
export const AdminDashboard = createDynamicComponent(
  () => import('@/app/admin/dashboard/page'),
  {
    ssr: false,
    loading: () => (
      <div className="container mx-auto p-8 space-y-6">
        <div className="h-12 animate-pulse bg-muted rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    ),
  }
);

/**
 * Product pages - Split by category
 */
export const BifoldDoorsPage = createDynamicComponent(
  () => import('@/app/products/bifold-doors/page')
);

export const BypassDoorsPage = createDynamicComponent(
  () => import('@/app/products/bypass-doors/page')
);

export const BarnDoorsPage = createDynamicComponent(
  () => import('@/app/products/barn-doors/page')
);

// ============================================================================
// VENDOR CHUNK OPTIMIZATION
// ============================================================================

/**
 * Heavy third-party libraries - Load separately
 */

// Framer Motion animations (heavy)
export const createAnimatedComponent = <P extends {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) => {
  return createDynamicComponent(importFn, {
    ssr: false, // Animations are client-side only
  });
};

// Date utilities (large library)
export async function loadDateFns() {
  const dateFns = await import('date-fns');
  return dateFns;
}

// Form validation (Zod)
export async function loadZod() {
  const zod = await import('zod');
  return zod;
}

// React Hook Form
export async function loadReactHookForm() {
  const rhf = await import('react-hook-form');
  return rhf;
}

// ============================================================================
// LAZY LOADING WITH INTERSECTION OBSERVER
// ============================================================================

/**
 * Intersection Observer for lazy component loading
 */
export class LazyComponentLoader {
  private observer: IntersectionObserver | null = null;
  private loadedComponents = new Set<string>();

  constructor(private config: LazyLoadConfig = {}) {
    if (typeof window !== 'undefined') {
      this.initializeObserver();
    }
  }

  private initializeObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const componentId = entry.target.getAttribute('data-component-id');
            if (componentId && !this.loadedComponents.has(componentId)) {
              this.loadComponent(entry.target as HTMLElement);
              if (this.config.triggerOnce ?? true) {
                this.observer?.unobserve(entry.target);
              }
            }
          }
        });
      },
      {
        rootMargin: this.config.rootMargin || '50px',
        threshold: this.config.threshold || 0.1,
      }
    );
  }

  private loadComponent(element: HTMLElement): void {
    const componentId = element.getAttribute('data-component-id');
    const componentLoader = element.getAttribute('data-component-loader');

    if (!componentId || !componentLoader) return;

    // Trigger component load
    const event = new CustomEvent('load-component', {
      detail: { componentId, componentLoader },
    });
    element.dispatchEvent(event);

    this.loadedComponents.add(componentId);
  }

  observe(element: HTMLElement): void {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  disconnect(): void {
    this.observer?.disconnect();
  }
}

// ============================================================================
// PREFETCH UTILITIES
// ============================================================================

/**
 * Prefetch critical routes
 */
export function prefetchCriticalRoutes() {
  if (typeof window === 'undefined') return;

  const criticalRoutes = [
    '/products',
    '/products/bifold-doors',
    '/products/bypass-doors',
    '/contact',
  ];

  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch on hover
 */
export function setupHoverPrefetch() {
  if (typeof window === 'undefined') return;

  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href]');

    if (link && link instanceof HTMLAnchorElement) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
      }
    }
  });
}

// ============================================================================
// BUNDLE SIZE TRACKING
// ============================================================================

/**
 * Track component load times
 */
export function trackComponentLoad(
  componentName: string,
  startTime: number
): void {
  const loadTime = performance.now() - startTime;

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'component_load', {
      event_category: 'Performance',
      event_label: componentName,
      value: Math.round(loadTime),
    });
  }

  console.log(`[Code Splitting] ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
}

/**
 * Measure bundle impact
 */
export async function measureBundleImpact<T>(
  bundleName: string,
  loadFn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  const startMemory = (performance as any).memory?.usedJSHeapSize;

  const result = await loadFn();

  const loadTime = performance.now() - startTime;
  const endMemory = (performance as any).memory?.usedJSHeapSize;
  const memoryIncrease = endMemory ? endMemory - startMemory : 0;

  console.log(`[Bundle Impact] ${bundleName}`);
  console.log(`  Load time: ${loadTime.toFixed(2)}ms`);
  if (memoryIncrease > 0) {
    console.log(`  Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
  }

  return result;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const lazyComponentLoader = new LazyComponentLoader();

export {
  prefetchCriticalRoutes,
  setupHoverPrefetch,
  trackComponentLoad,
  measureBundleImpact,
};
