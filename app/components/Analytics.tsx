'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// Google Analytics Measurement ID - Replace with your actual ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Google Analytics event tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

// Google Analytics tracking component
function GoogleAnalyticsTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && GA_MEASUREMENT_ID) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

// Main Analytics component
export default function Analytics() {
  if (!GA_MEASUREMENT_ID) {
    // No GA ID configured
    return null;
  }

  return (
    <>
      {/* Google Analytics Scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      {/* Page view tracking */}
      <Suspense fallback={null}>
        <GoogleAnalyticsTracking />
      </Suspense>
    </>
  );
}

// Vercel Analytics component (imported from @vercel/analytics)
export function VercelAnalytics() {
  // This will be replaced with actual Vercel Analytics when installed
  // For now, we'll create a placeholder
  return null;
}

// Custom event tracking hooks
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Track in Google Analytics
    if (GA_MEASUREMENT_ID) {
      event({
        action: eventName,
        category: properties?.category || 'general',
        label: properties?.label,
        value: properties?.value,
      });
    }

    // Track in Vercel Analytics (when available)
    // track(eventName, properties);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, properties);
    }
  };

  const trackPageView = (url: string) => {
    pageview(url);
  };

  return {
    trackEvent,
    trackPageView,
  };
}

// E-commerce tracking functions
export const trackProductView = (product: {
  id: string;
  name: string;
  category: string;
  price: number;
}) => {
  event({
    action: 'view_item',
    category: 'ecommerce',
    label: product.name,
    value: product.price,
  });
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}) => {
  event({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: product.name,
    value: product.price * product.quantity,
  });
};

export const trackCheckout = (value: number) => {
  event({
    action: 'begin_checkout',
    category: 'ecommerce',
    value,
  });
};

export const trackPurchase = (transactionId: string, value: number) => {
  event({
    action: 'purchase',
    category: 'ecommerce',
    label: transactionId,
    value,
  });
};

// Form tracking functions
export const trackFormSubmit = (formName: string) => {
  event({
    action: 'form_submit',
    category: 'engagement',
    label: formName,
  });
};

export const trackFormError = (formName: string, errorType: string) => {
  event({
    action: 'form_error',
    category: 'engagement',
    label: `${formName}_${errorType}`,
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount,
  });
};

// Social tracking
export const trackSocialShare = (network: string, _contentId?: string) => {
  event({
    action: 'share',
    category: 'social',
    label: network,
  });
};

// Download tracking
export const trackDownload = (fileName: string) => {
  event({
    action: 'download',
    category: 'engagement',
    label: fileName,
  });
};

// Video tracking
export const trackVideoPlay = (videoTitle: string) => {
  event({
    action: 'video_play',
    category: 'engagement',
    label: videoTitle,
  });
};

export const trackVideoComplete = (videoTitle: string) => {
  event({
    action: 'video_complete',
    category: 'engagement',
    label: videoTitle,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (depth: number) => {
  event({
    action: 'scroll_depth',
    category: 'engagement',
    label: `${depth}%`,
    value: depth,
  });
};

// Time on page tracking
export const trackTimeOnPage = (seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'engagement',
    value: seconds,
  });
};

// Add TypeScript global type definitions
