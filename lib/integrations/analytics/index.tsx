/**
 * Analytics Integration Hub
 * Centralizes tracking, analytics, and marketing pixels
 */

import { Analytics } from '@vercel/analytics/react';
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
import LinkedInInsightTag from 'react-linkedin-insight-tag';

// Analytics Configuration
export interface AnalyticsConfig {
  googleAnalytics?: {
    trackingId: string;
    enableDevelopmentMode?: boolean;
  };
  googleTagManager?: {
    gtmId: string;
    auth?: string;
    preview?: string;
  };
  hotjar?: {
    hjid: number;
    hjsv: number;
  };
  facebookPixel?: {
    pixelId: string;
    advancedMatching?: boolean;
  };
  linkedinInsight?: {
    partnerId: string;
  };
  vercelAnalytics?: boolean;
}

export class AnalyticsHub {
  private config: AnalyticsConfig;
  private isInitialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    // Initialize Google Analytics
    if (this.config.googleAnalytics) {
      ReactGA.initialize(this.config.googleAnalytics.trackingId, {
        debug: this.config.googleAnalytics.enableDevelopmentMode || false,
      });
    }

    // Initialize Facebook Pixel
    if (this.config.facebookPixel) {
      ReactPixel.init(this.config.facebookPixel.pixelId, {}, {
        autoConfig: true,
        debug: this.config.googleAnalytics?.enableDevelopmentMode || false,
      });

      if (this.config.facebookPixel.advancedMatching) {
        ReactPixel.init(this.config.facebookPixel.pixelId, {
          em: 'user_email@example.com', // Advanced matching parameters
        });
      }
    }

    // Initialize LinkedIn Insight Tag
    if (this.config.linkedinInsight) {
      // LinkedIn tag is automatically initialized with the component
    }

    // Initialize Hotjar
    if (this.config.hotjar) {
      this.initializeHotjar();
    }

    // Initialize Google Tag Manager
    if (this.config.googleTagManager) {
      this.initializeGTM();
    }

    this.isInitialized = true;
  }

  private initializeHotjar() {
    if (!this.config.hotjar) return;

    (function(h, o, t, j, a, r) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: this.config.hotjar!.hjid, hjsv: this.config.hotjar!.hjsv };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  private initializeGTM() {
    if (!this.config.googleTagManager) return;

    (function(w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl + (this.config.googleTagManager?.auth ? '&gtm_auth=' + this.config.googleTagManager.auth : '') + (this.config.googleTagManager?.preview ? '&gtm_preview=' + this.config.googleTagManager.preview : '');
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', this.config.googleTagManager.gtmId);
  }

  // Page Tracking
  trackPageView(path?: string, title?: string) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (this.config.googleAnalytics) {
      ReactGA.pageview(path || window.location.pathname);
    }

    // Facebook Pixel
    if (this.config.facebookPixel) {
      ReactPixel.pageView();
    }

    // Google Tag Manager
    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        pagePath: path || window.location.pathname,
        pageTitle: title || document.title,
      });
    }
  }

  // Event Tracking
  trackEvent(category: string, action: string, label?: string, value?: number, options?: any) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (this.config.googleAnalytics) {
      ReactGA.event({
        category,
        action,
        label,
        value,
        ...options,
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixel) {
      ReactPixel.track('CustomEvent', {
        category,
        action,
        label,
        value,
      });
    }

    // Google Tag Manager
    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'customEvent',
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
        eventValue: value,
      });
    }
  }

  // E-commerce Events
  trackProductView(productId: string, productName: string, price: number, category?: string) {
    this.trackEvent('Ecommerce', 'Product View', productName, price);

    // Facebook Pixel specific
    if (this.config.facebookPixel) {
      ReactPixel.track('ViewContent', {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: price,
        currency: 'USD',
      });
    }

    // Google Tag Manager specific
    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'productView',
        ecommerce: {
          detail: {
            products: [{
              id: productId,
              name: productName,
              price: price,
              category: category,
            }],
          },
        },
      });
    }
  }

  trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1) {
    this.trackEvent('Ecommerce', 'Add to Cart', productName, price * quantity);

    // Facebook Pixel
    if (this.config.facebookPixel) {
      ReactPixel.track('AddToCart', {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: price * quantity,
        currency: 'USD',
      });
    }

    // Google Tag Manager
    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'addToCart',
        ecommerce: {
          add: {
            products: [{
              id: productId,
              name: productName,
              price: price,
              quantity: quantity,
            }],
          },
        },
      });
    }
  }

  trackPurchase(orderId: string, total: number, products: Array<any>) {
    this.trackEvent('Ecommerce', 'Purchase', orderId, total);

    // Facebook Pixel
    if (this.config.facebookPixel) {
      ReactPixel.track('Purchase', {
        content_ids: products.map(p => p.id),
        content_name: 'Order Complete',
        content_type: 'product',
        value: total,
        currency: 'USD',
        num_items: products.length,
      });
    }

    // Google Tag Manager
    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          purchase: {
            actionField: {
              id: orderId,
              revenue: total,
            },
            products: products.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              quantity: p.quantity,
            })),
          },
        },
      });
    }

    // Google Analytics Enhanced Ecommerce
    if (this.config.googleAnalytics) {
      ReactGA.plugin.execute('ec', 'addProduct', products);
      ReactGA.plugin.execute('ec', 'setAction', 'purchase', {
        id: orderId,
        revenue: total,
      });
      ReactGA.plugin.execute('ec', 'send');
    }
  }

  trackCheckoutStep(step: number, option?: string) {
    this.trackEvent('Ecommerce', `Checkout Step ${step}`, option);

    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'checkout',
        ecommerce: {
          checkout: {
            actionField: {
              step: step,
              option: option,
            },
          },
        },
      });
    }
  }

  // Lead Generation Events
  trackLead(leadType: string, value?: number) {
    this.trackEvent('Lead Generation', 'Lead Submitted', leadType, value);

    // Facebook Pixel
    if (this.config.facebookPixel) {
      ReactPixel.track('Lead', {
        content_category: leadType,
        value: value,
        currency: 'USD',
      });
    }
  }

  // Custom Business Events
  trackBooking(bookingType: string, value?: number) {
    this.trackEvent('Booking', 'Appointment Scheduled', bookingType, value);

    // Facebook Pixel
    if (this.config.facebookPixel) {
      ReactPixel.track('Schedule', {
        content_name: bookingType,
        value: value,
        currency: 'USD',
      });
    }
  }

  trackFormSubmission(formName: string, location: string) {
    this.trackEvent('Form', 'Submission', `${formName} - ${location}`);
  }

  trackSearch(query: string, category?: string) {
    this.trackEvent('Search', 'Site Search', category || 'All', undefined, {
      search_term: query,
    });

    // Facebook Pixel
    if (this.config.facebookPixel) {
      ReactPixel.track('Search', {
        search_string: query,
        content_category: category,
      });
    }
  }

  // User Identification
  identifyUser(userId: string, traits?: Record<string, any>) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (this.config.googleAnalytics) {
      ReactGA.set({
        userId: userId,
        ...traits,
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixel && traits?.email) {
      ReactPixel.init(this.config.facebookPixel.pixelId, {
        em: traits.email,
        fn: traits.firstName,
        ln: traits.lastName,
        ph: traits.phone,
      });
    }

    // Google Tag Manager
    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'userIdentified',
        userId: userId,
        userProperties: traits,
      });
    }
  }

  // Enhanced E-commerce
  trackProductImpression(products: Array<{
    id: string;
    name: string;
    price: number;
    category?: string;
    position?: number;
  }>) {
    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'productImpression',
        ecommerce: {
          impressions: products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            position: product.position,
          })),
        },
      });
    }
  }

  // Custom Data Layer Events
  pushToDataLayer(event: string, data: Record<string, any>) {
    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event,
        ...data,
      });
    }
  }

  // Heatmap and User Session Recording
  enableHotjarRecording() {
    if (this.config.hotjar && window.hj) {
      window.hj('trigger', 'recording_start');
    }
  }

  triggerHotjarHeatmap(tag: string) {
    if (this.config.hotjar && window.hj) {
      window.hj('tagRecording', [tag]);
    }
  }

  // Consent Management
  updateConsent(consentSettings: {
    analytics?: boolean;
    advertising?: boolean;
    personalization?: boolean;
  }) {
    if (this.config.googleAnalytics && !consentSettings.analytics) {
      // Disable Google Analytics tracking
      ReactGA.set({ anonymizeIp: true });
    }

    if (this.config.facebookPixel && !consentSettings.advertising) {
      // Revoke Facebook Pixel consent
      ReactPixel.revokeConsent();
    } else if (this.config.facebookPixel && consentSettings.advertising) {
      // Grant Facebook Pixel consent
      ReactPixel.grantConsent();
    }
  }

  // Performance Monitoring
  trackPageLoadTime(loadTime: number) {
    this.trackEvent('Performance', 'Page Load Time', undefined, loadTime);
  }

  trackError(errorMessage: string, errorUrl?: string, errorLine?: number) {
    this.trackEvent('Error', 'JavaScript Error', errorMessage, undefined, {
      url: errorUrl,
      line: errorLine,
    });
  }

  // A/B Testing
  trackABTest(testName: string, variation: string) {
    this.trackEvent('A/B Test', 'Test Viewed', testName, undefined, {
      variation,
    });

    if (this.config.googleTagManager && window.dataLayer) {
      window.dataLayer.push({
        event: 'ABTest',
        testName,
        variation,
      });
    }
  }
}

// React Components for Analytics
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = getAnalyticsConfig();

  return (
    <>
      {config.vercelAnalytics && <Analytics />}
      {config.googleTagManager && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${config.googleTagManager.gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
      {config.linkedinInsight && (
        <LinkedInInsightTag partnerId={config.linkedinInsight.partnerId} />
      )}
      {children}
    </>
  );
};

// Configuration Helper
export const getAnalyticsConfig = (): AnalyticsConfig => {
  return {
    googleAnalytics: {
      trackingId: process.env.GA_TRACKING_ID!,
      enableDevelopmentMode: process.env.NODE_ENV === 'development',
    },
    googleTagManager: {
      gtmId: process.env.GTM_ID!,
      auth: process.env.GTM_AUTH,
      preview: process.env.GTM_PREVIEW,
    },
    hotjar: {
      hjid: parseInt(process.env.HOTJAR_ID || '0'),
      hjsv: parseInt(process.env.HOTJAR_SV || '6'),
    },
    facebookPixel: {
      pixelId: process.env.FACEBOOK_PIXEL_ID!,
      advancedMatching: true,
    },
    linkedinInsight: {
      partnerId: process.env.LINKEDIN_PARTNER_ID!,
    },
    vercelAnalytics: true,
  };
};

// Global Analytics Instance
let analyticsHub: AnalyticsHub | null = null;

export const getAnalyticsHub = () => {
  if (!analyticsHub) {
    analyticsHub = new AnalyticsHub(getAnalyticsConfig());
  }
  return analyticsHub;
};