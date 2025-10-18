"use client"

import Script from "next/script"
import { PerformanceAnalytics, SEOAnalytics, ConversionTracking, SpeedInsights } from "./performance-analytics"

interface EnhancedGoogleAnalyticsProps {
  gaId: string
}

export function EnhancedGoogleAnalytics({ gaId }: EnhancedGoogleAnalyticsProps) {
  return (
    <>
      {/* Core Google Analytics */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <Script
        id="google-analytics-enhanced"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              // Enhanced ecommerce tracking
              custom_map: {
                'metric_value': 'custom_metric_1'
              },
              // SEO-specific tracking
              content_group1: 'SEO Traffic',
              content_group2: window.location.pathname,
              // Performance tracking
              site_speed_sample_rate: 100,
              // Enhanced link attribution
              link_attribution: true,
              // Cross-domain tracking for subdomains
              linker: {
                domains: ['pgclosets.com', 'www.pgclosets.com']
              }
            });

            // Track 404 errors for SEO
            if (document.title.includes('404') || document.title.includes('Not Found')) {
              gtag('event', 'page_not_found', {
                event_category: 'SEO',
                event_label: window.location.pathname,
                value: 1
              });
            }

            // Track external link clicks
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.hostname !== window.location.hostname) {
                gtag('event', 'external_link_click', {
                  event_category: 'SEO',
                  event_label: link.href,
                  transport_type: 'beacon'
                });
              }
            });

            // Track file downloads
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.href.match(/\\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|exe|dmg)$/i)) {
                gtag('event', 'file_download', {
                  event_category: 'SEO',
                  event_label: link.href,
                  transport_type: 'beacon'
                });
              }
            });
          `,
        }}
      />

      {/* Performance Analytics */}
      <PerformanceAnalytics gaId={gaId} />

      {/* SEO Analytics */}
      <SEOAnalytics gaId={gaId} />

      {/* Conversion Tracking */}
      <ConversionTracking gaId={gaId} />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </>
  )
}
