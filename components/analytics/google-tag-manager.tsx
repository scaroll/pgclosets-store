'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface GoogleTagManagerProps {
  measurementId: string
  debug?: boolean
}

export function GoogleTagManager({ measurementId, debug = false }: GoogleTagManagerProps) {
  useEffect(() => {
    // Initialize gtag function if not already available
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments)
      }
      
      // Make gtag globally available
      window.gtag = gtag
      
      // Configure GA4
      gtag('js', new Date())
      gtag('config', measurementId, {
        debug_mode: debug,
        send_page_view: true,
        // Enhanced e-commerce settings
        allow_enhanced_conversions: true,
        allow_google_signals: true,
        // Privacy settings
        anonymize_ip: true,
        // Performance settings
        transport_type: 'beacon',
      })

      if (debug) {
        console.log('[GA4] Initialized with measurement ID:', measurementId)
      }
    }
  }, [measurementId, debug])

  return (
    <>
      {/* Google Analytics gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={() => {
          if (debug) {
            console.log('[GA4] Script loaded successfully')
          }
        }}
        onError={(error) => {
          console.error('[GA4] Script loading error:', error)
        }}
      />
    </>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}