'use client'

import Script from 'next/script'
import { useEffect, useCallback } from 'react'

interface GoogleTagManagerProps {
  gtmId: string
  dataLayer?: Record<string, any>
  enableDebug?: boolean
}

interface GTMDataLayer {
  event: string
  [key: string]: any
}

// Enhanced GTM implementation with comprehensive event tracking
export function GoogleTagManager({ gtmId, dataLayer = {}, enableDebug = false }: GoogleTagManagerProps) {
  // Initialize dataLayer and GTM configuration
  const initializeGTM = useCallback(() => {
    if (typeof window === 'undefined') return

    // Initialize dataLayer with default configuration
    window.dataLayer = window.dataLayer || []

    // Push initial configuration
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
      // Enhanced ecommerce configuration
      ecommerce: {
        currency: 'CAD',
        country: 'Canada'
      },
      // User properties
      user_properties: {
        user_type: 'anonymous',
        session_id: generateSessionId(),
        page_location: window.location.href,
        page_referrer: document.referrer || 'direct'
      },
      // Site configuration
      site_config: {
        site_name: 'PG Closets',
        site_version: '2.0',
        environment: process.env.NODE_ENV,
        debug_mode: enableDebug
      },
      // Performance configuration
      performance_config: {
        track_web_vitals: true,
        track_user_timing: true,
        track_exceptions: true
      },
      ...dataLayer
    })

    // Enhanced event tracking setup
    setupEnhancedTracking()

    if (enableDebug) {
      console.log('GTM initialized with dataLayer:', window.dataLayer)
    }
  }, [dataLayer, enableDebug, gtmId])

  // Enhanced tracking setup
  const setupEnhancedTracking = () => {
    if (typeof window === 'undefined') return

    // Track page view with enhanced data
    gtmPush({
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      content_group1: getContentGroup(window.location.pathname),
      content_group2: getDeviceType(),
      content_group3: getTrafficSource(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timestamp: new Date().toISOString()
    })

    // Enhanced form tracking
    setupFormTracking()

    // Enhanced interaction tracking
    setupInteractionTracking()

    // Enhanced scroll tracking
    setupScrollTracking()

    // Enhanced error tracking
    setupErrorTracking()

    // Enhanced performance tracking
    setupPerformanceTracking()

    // Enhanced e-commerce tracking
    setupEcommerceTracking()
  }

  // Form tracking with comprehensive data
  const setupFormTracking = () => {
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      if (!form) return

      const formData = new FormData(form)
      const formFields = Array.from(formData.keys())

      gtmPush({
        event: 'form_submit',
        form_id: form.id || 'unknown',
        form_name: form.name || form.id || 'unknown',
        form_action: form.action || window.location.href,
        form_method: form.method || 'GET',
        form_fields: formFields,
        form_field_count: formFields.length,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
    })

    // Track form field interactions
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const form = target.closest('form')
        gtmPush({
          event: 'form_field_focus',
          field_name: (target as HTMLInputElement).name || 'unknown',
          field_type: (target as HTMLInputElement).type || 'unknown',
          field_id: target.id || 'unknown',
          form_id: form?.id || 'unknown',
          page_location: window.location.href
        })
      }
    })
  }

  // Enhanced interaction tracking
  const setupInteractionTracking = () => {
    // Click tracking with detailed context
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      const button = target.closest('button')

      if (link) {
        const isExternal = link.hostname !== window.location.hostname
        const isDownload = link.href.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|exe|dmg)$/i)
        const isEmail = link.href.startsWith('mailto:')

        gtmPush({
          event: isExternal ? 'external_link_click' : isDownload ? 'file_download' : isEmail ? 'email_click' : 'internal_link_click',
          link_url: link.href,
          link_text: link.textContent?.trim() || '',
          link_id: link.id || 'unknown',
          link_classes: link.className || '',
          is_external: isExternal,
          is_download: !!isDownload,
          file_extension: isDownload ? link.href.split('.').pop() : null,
          page_location: window.location.href,
          click_position: {
            x: event.clientX,
            y: event.clientY
          }
        })
      } else if (button) {
        gtmPush({
          event: 'button_click',
          button_text: button.textContent?.trim() || '',
          button_id: button.id || 'unknown',
          button_classes: button.className || '',
          button_type: (button).type || 'button',
          page_location: window.location.href,
          click_position: {
            x: event.clientX,
            y: event.clientY
          }
        })
      }
    })

    // Video tracking (if applicable)
    document.addEventListener('play', (event) => {
      const video = event.target as HTMLVideoElement
      if (video.tagName === 'VIDEO') {
        gtmPush({
          event: 'video_play',
          video_url: video.src || video.currentSrc,
          video_title: video.title || 'Unknown',
          video_duration: video.duration,
          page_location: window.location.href
        })
      }
    })
  }

  // Enhanced scroll tracking with milestones
  const setupScrollTracking = () => {
    let maxScroll = 0
    const milestones = [25, 50, 75, 90, 100]
    const trackedMilestones = new Set<number>()

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent

        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
            trackedMilestones.add(milestone)
            gtmPush({
              event: 'scroll_milestone',
              scroll_depth: milestone,
              page_location: window.location.href,
              content_group: getContentGroup(window.location.pathname),
              timestamp: new Date().toISOString()
            })
          }
        })
      }
    }

    window.addEventListener('scroll', trackScroll, { passive: true })
  }

  // Enhanced error tracking
  const setupErrorTracking = () => {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      gtmPush({
        event: 'javascript_error',
        error_message: event.message,
        error_filename: event.filename,
        error_line: event.lineno,
        error_column: event.colno,
        error_stack: event.error?.stack || 'Not available',
        page_location: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    })

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      gtmPush({
        event: 'promise_rejection',
        error_message: event.reason?.message || String(event.reason),
        error_stack: event.reason?.stack || 'Not available',
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
    })

    // Resource loading errors
    window.addEventListener('error', (event) => {
      const target = event.target as HTMLElement
      if (target !== window && target.tagName) {
        gtmPush({
          event: 'resource_error',
          resource_type: target.tagName.toLowerCase(),
          resource_url: (target as any).src || (target as any).href,
          page_location: window.location.href,
          timestamp: new Date().toISOString()
        })
      }
    }, true)
  }

  // Enhanced performance tracking
  const setupPerformanceTracking = () => {
    // Web Vitals tracking
    if ('PerformanceObserver' in window) {
      // LCP tracking
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lcp = entries[entries.length - 1]
        if (lcp) {
          gtmPush({
            event: 'web_vitals',
            metric_name: 'LCP',
            metric_value: Math.round(lcp.startTime),
            metric_rating: lcp.startTime <= 2500 ? 'good' : lcp.startTime <= 4000 ? 'needs_improvement' : 'poor',
            page_location: window.location.href
          })
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })

      // FID tracking
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming
          if (fidEntry.processingStart) {
            const fid = fidEntry.processingStart - fidEntry.startTime
            gtmPush({
              event: 'web_vitals',
              metric_name: 'FID',
              metric_value: Math.round(fid),
              metric_rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs_improvement' : 'poor',
              page_location: window.location.href
            })
          }
        })
      }).observe({ type: 'first-input', buffered: true })

      // CLS tracking
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const clsEntry = entry as LayoutShift
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
          }
        })
        gtmPush({
          event: 'web_vitals',
          metric_name: 'CLS',
          metric_value: parseFloat(clsValue.toFixed(4)),
          metric_rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs_improvement' : 'poor',
          page_location: window.location.href
        })
      }).observe({ type: 'layout-shift', buffered: true })
    }

    // Navigation timing
    window.addEventListener('load', () => {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navTiming) {
        gtmPush({
          event: 'navigation_timing',
          dns_time: Math.round(navTiming.domainLookupEnd - navTiming.domainLookupStart),
          connect_time: Math.round(navTiming.connectEnd - navTiming.connectStart),
          request_time: Math.round(navTiming.responseStart - navTiming.requestStart),
          response_time: Math.round(navTiming.responseEnd - navTiming.responseStart),
          dom_processing_time: Math.round(navTiming.domContentLoadedEventEnd - navTiming.responseEnd),
          load_complete_time: Math.round(navTiming.loadEventEnd - navTiming.navigationStart),
          page_location: window.location.href
        })
      }
    })
  }

  // Enhanced e-commerce tracking setup
  const setupEcommerceTracking = () => {
    // Product impression tracking (for product listings)
    const observeProductImpressions = () => {
      const productElements = document.querySelectorAll('[data-product-id]')

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement
              const productId = element.dataset.productId
              const productName = element.dataset.productName || 'Unknown'
              const productCategory = element.dataset.productCategory || 'Unknown'
              const productPrice = element.dataset.productPrice || '0'

              gtmPush({
                event: 'view_item',
                ecommerce: {
                  currency: 'CAD',
                  value: parseFloat(productPrice),
                  items: [{
                    item_id: productId,
                    item_name: productName,
                    item_category: productCategory,
                    price: parseFloat(productPrice),
                    quantity: 1
                  }]
                }
              })

              observer.unobserve(element)
            }
          })
        }, { threshold: 0.5 })

        productElements.forEach(element => observer.observe(element))
      }
    }

    // Observe on DOM ready and mutations
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeProductImpressions)
    } else {
      observeProductImpressions()
    }

    // Re-observe on dynamic content changes
    if ('MutationObserver' in window) {
      const mutationObserver = new MutationObserver(() => {
        observeProductImpressions()
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }
  }

  // Helper functions
  const generateSessionId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const getContentGroup = (path: string): string => {
    if (path.includes('/products/')) return 'Product Pages'
    if (path.includes('/admin/')) return 'Admin'
    if (path.includes('/cart')) return 'Cart'
    if (path.includes('/checkout')) return 'Checkout'
    if (path.includes('/account/')) return 'Account'
    if (path.includes('/about')) return 'About'
    if (path.includes('/contact')) return 'Contact'
    if (path.includes('/faq')) return 'FAQ'
    if (path === '/') return 'Homepage'
    return 'Other'
  }

  const getDeviceType = (): string => {
    if (typeof window === 'undefined') return 'Unknown'
    const width = window.innerWidth
    if (width <= 768) return 'Mobile'
    if (width <= 1024) return 'Tablet'
    return 'Desktop'
  }

  const getTrafficSource = (): string => {
    if (typeof document === 'undefined') return 'Unknown'
    const referrer = document.referrer
    if (!referrer) return 'Direct'
    if (referrer.includes('google.com')) return 'Google'
    if (referrer.includes('facebook.com')) return 'Facebook'
    if (referrer.includes('instagram.com')) return 'Instagram'
    if (referrer.includes('bing.com')) return 'Bing'
    if (referrer.includes('yahoo.com')) return 'Yahoo'
    return 'Referral'
  }

  const gtmPush = (data: GTMDataLayer) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data)
      if (enableDebug) {
        console.log('GTM Event:', data)
      }
    }
  }

  // Initialize GTM when component mounts
  useEffect(() => {
    initializeGTM()
  }, [initializeGTM])

  return (
    <>
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `
        }}
      />

      {/* Google Tag Manager NoScript Fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}

// Export enhanced tracking functions for manual use
export const trackEcommerceEvent = (eventName: string, ecommerceData: any) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ecommerce: ecommerceData,
      timestamp: new Date().toISOString()
    })
  }
}

export const trackCustomEvent = (eventName: string, eventData: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString()
    })
  }
}

export const setUserProperties = (userProperties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'user_properties_update',
      user_properties: userProperties,
      timestamp: new Date().toISOString()
    })
  }
}

// Declare global types
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}