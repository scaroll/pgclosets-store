/**
 * Resource Hints and Preloading Utilities
 * Optimizes resource loading priority for better performance
 */

import React from 'react';

export interface ResourceHint {
  rel: "preconnect" | "dns-prefetch" | "preload" | "prefetch" | "prerender";
  href: string;
  as?: string;
  type?: string;
  crossOrigin?: "anonymous" | "use-credentials";
}

/**
 * Critical third-party domains to preconnect
 */
export const PRECONNECT_DOMAINS: ResourceHint[] = [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preconnect",
    href: "https://www.google-analytics.com",
  },
  {
    rel: "preconnect",
    href: "https://www.googletagmanager.com",
  },
];

/**
 * DNS prefetch for external resources
 */
export const DNS_PREFETCH_DOMAINS: ResourceHint[] = [
  {
    rel: "dns-prefetch",
    href: "https://www.renin.com",
  },
  {
    rel: "dns-prefetch",
    href: "https://cdn.renin.com",
  },
  {
    rel: "dns-prefetch",
    href: "https://images.unsplash.com",
  },
  {
    rel: "dns-prefetch",
    href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com",
  },
];

/**
 * Critical resources to preload
 */
export const PRELOAD_RESOURCES: ResourceHint[] = [
  {
    rel: "preload",
    href: "/fonts/inter-var.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

/**
 * Generate resource hint elements
 */
export function generateResourceHints(): JSX.Element[] {
  const hints = [
    ...PRECONNECT_DOMAINS,
    ...DNS_PREFETCH_DOMAINS,
    ...PRELOAD_RESOURCES,
  ];

  return hints.map((hint, index) => {
    const props: any = {
      key: `resource-hint-${index}`,
      rel: hint.rel,
      href: hint.href,
    };

    if (hint.as) props.as = hint.as;
    if (hint.type) props.type = hint.type;
    if (hint.crossOrigin) props.crossOrigin = hint.crossOrigin;

    return React.createElement('link', props);
  });
}

/**
 * Prefetch critical routes
 */
export const PREFETCH_ROUTES = [
  "/products",
  "/contact",
  "/about",
  "/services",
];

/**
 * Dynamically add resource hints
 */
export function addResourceHint(hint: ResourceHint): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = hint.rel;
  link.href = hint.href;

  if (hint.as) link.setAttribute("as", hint.as);
  if (hint.type) link.type = hint.type;
  if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;

  document.head.appendChild(link);
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(images: string[]): void {
  if (typeof document === "undefined") return;

  images.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    link.fetchPriority = "high";
    document.head.appendChild(link);
  });
}

/**
 * Prefetch route on hover (intelligent prefetching)
 */
export function prefetchOnHover(route: string): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = route;
  document.head.appendChild(link);
}
