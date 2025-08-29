"use client"

import { useEffect } from "react"
import Script from "next/script"

interface PerformanceAnalyticsProps {
  gaId: string
}

export function PerformanceAnalytics({ gaId }: PerformanceAnalyticsProps) {
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      if (typeof window !== "undefined" && "gtag" in window) {
        // @ts-ignore
        const gtag = window.gtag

        // Track Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: "LCP",
              value: Math.round(entry.startTime),
              custom_map: { metric_value: entry.startTime },
            })
          }
        }).observe({ type: "largest-contentful-paint", buffered: true })

        // Track First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: "FID",
              value: Math.round(entry.processingStart - entry.startTime),
              custom_map: { metric_value: entry.processingStart - entry.startTime },
            })
          }
        }).observe({ type: "first-input", buffered: true })

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          gtag("event", "web_vitals", {
            event_category: "Web Vitals",
            event_label: "CLS",
            value: Math.round(clsValue * 1000),
            custom_map: { metric_value: clsValue },
          })
        }).observe({ type: "layout-shift", buffered: true })

        // Track Time to First Byte (TTFB)
        const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
          gtag("event", "web_vitals", {
            event_category: "Web Vitals",
            event_label: "TTFB",
            value: Math.round(ttfb),
            custom_map: { metric_value: ttfb },
          })
        }
      }
    }

    // Wait for gtag to be available
    const checkGtag = () => {
      if (typeof window !== "undefined" && "gtag" in window) {
        trackWebVitals()
      } else {
        setTimeout(checkGtag, 100)
      }
    }

    checkGtag()
  }, [gaId])

  return null
}

export function SEOAnalytics({ gaId }: PerformanceAnalyticsProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      const gtag = window.gtag

      // Track SEO-specific events
      const trackSEOEvents = () => {
        // Track organic search traffic
        const referrer = document.referrer
        if (referrer.includes("google.com") || referrer.includes("bing.com") || referrer.includes("yahoo.com")) {
          gtag("event", "organic_search_visit", {
            event_category: "SEO",
            event_label: "Organic Search Traffic",
            search_engine: referrer.includes("google.com")
              ? "Google"
              : referrer.includes("bing.com")
                ? "Bing"
                : "Yahoo",
          })
        }

        // Track page depth for SEO analysis
        const pathDepth = window.location.pathname.split("/").filter(Boolean).length
        gtag("event", "page_depth", {
          event_category: "SEO",
          event_label: "Page Depth",
          value: pathDepth,
        })

        // Track time on page for SEO engagement
        const startTime = Date.now()
        const trackTimeOnPage = () => {
          const timeOnPage = Date.now() - startTime
          gtag("event", "time_on_page", {
            event_category: "SEO",
            event_label: "Engagement",
            value: Math.round(timeOnPage / 1000), // Convert to seconds
          })
        }

        // Track when user leaves page
        window.addEventListener("beforeunload", trackTimeOnPage)

        // Track scroll depth for engagement
        let maxScroll = 0
        const trackScrollDepth = () => {
          const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
          if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent
            if (maxScroll >= 25 && maxScroll < 50) {
              gtag("event", "scroll_depth_25", { event_category: "SEO", event_label: "Engagement" })
            } else if (maxScroll >= 50 && maxScroll < 75) {
              gtag("event", "scroll_depth_50", { event_category: "SEO", event_label: "Engagement" })
            } else if (maxScroll >= 75 && maxScroll < 90) {
              gtag("event", "scroll_depth_75", { event_category: "SEO", event_label: "Engagement" })
            } else if (maxScroll >= 90) {
              gtag("event", "scroll_depth_90", { event_category: "SEO", event_label: "Engagement" })
            }
          }
        }

        window.addEventListener("scroll", trackScrollDepth, { passive: true })
      }

      trackSEOEvents()
    }
  }, [gaId])

  return null
}

export function ConversionTracking({ gaId }: PerformanceAnalyticsProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      const gtag = window.gtag

      // Track SEO conversion events
      const trackConversions = () => {
        // Track contact form submissions
        const contactForms = document.querySelectorAll('form[action*="contact"]')
        contactForms.forEach((form) => {
          form.addEventListener("submit", () => {
            gtag("event", "contact_form_submit", {
              event_category: "Conversions",
              event_label: "Contact Form",
              value: 1,
            })
          })
        })

        // Track quote requests
        const quoteButtons = document.querySelectorAll('button:contains("Quote"), a:contains("Quote")')
        quoteButtons.forEach((button) => {
          button.addEventListener("click", () => {
            gtag("event", "quote_request", {
              event_category: "Conversions",
              event_label: "Quote Request",
              value: 1,
            })
          })
        })

        // Track phone number clicks
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]')
        phoneLinks.forEach((link) => {
          link.addEventListener("click", () => {
            gtag("event", "phone_click", {
              event_category: "Conversions",
              event_label: "Phone Call",
              value: 1,
            })
          })
        })

        // Track email clicks
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]')
        emailLinks.forEach((link) => {
          link.addEventListener("click", () => {
            gtag("event", "email_click", {
              event_category: "Conversions",
              event_label: "Email Contact",
              value: 1,
            })
          })
        })

        // Track product page views
        if (window.location.pathname.includes("/products/")) {
          gtag("event", "product_view", {
            event_category: "Conversions",
            event_label: "Product Page View",
            value: 1,
          })
        }

        // Track FAQ engagement
        if (window.location.pathname.includes("/faq")) {
          gtag("event", "faq_visit", {
            event_category: "Conversions",
            event_label: "FAQ Page Visit",
            value: 1,
          })
        }
      }

      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", trackConversions)
      } else {
        trackConversions()
      }
    }
  }, [gaId])

  return null
}

export function SpeedInsights() {
  return (
    <Script
      src="https://unpkg.com/@vercel/speed-insights@1.0.12/dist/index.js"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-ignore
        if (typeof window !== "undefined" && window.si) {
          // @ts-ignore
          window.si("track")
        }
      }}
    />
  )
}
