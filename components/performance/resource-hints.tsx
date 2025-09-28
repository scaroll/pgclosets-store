"use client"

import { useEffect } from "react"

interface ResourceHintsProps {
  // Critical resources to preload
  criticalImages?: string[]
  criticalFonts?: string[]
  criticalCSS?: string[]

  // Resources to prefetch for next navigation
  prefetchImages?: string[]
  prefetchPages?: string[]

  // DNS prefetch for external domains
  dnsPrefetchDomains?: string[]

  // Preconnect to critical origins
  preconnectOrigins?: string[]

  // Module preload for JavaScript
  modulePreload?: string[]
}

const DEFAULT_PRECONNECT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://www.google-analytics.com',
  'https://www.googletagmanager.com',
]

const DEFAULT_DNS_PREFETCH_DOMAINS = [
  'cdn.renin.com',
  'images.unsplash.com',
  'hebbkx1anhila5yf.public.blob.vercel-storage.com',
]

export default function ResourceHints({
  criticalImages = [],
  criticalFonts = [],
  criticalCSS = [],
  prefetchImages = [],
  prefetchPages = [],
  dnsPrefetchDomains = DEFAULT_DNS_PREFETCH_DOMAINS,
  preconnectOrigins = DEFAULT_PRECONNECT_ORIGINS,
  modulePreload = [],
}: ResourceHintsProps) {

  useEffect(() => {
    if (typeof window === 'undefined') return

    const head = document.head
    const addedLinks: HTMLLinkElement[] = []

    // Helper function to create and add link elements
    const addLink = (rel: string, href: string, as?: string, type?: string, crossOrigin?: string) => {
      // Check if link already exists
      const existing = head.querySelector(`link[rel="${rel}"][href="${href}"]`)
      if (existing) return

      const link = document.createElement('link')
      link.rel = rel
      link.href = href

      if (as) link.setAttribute('as', as)
      if (type) link.type = type
      if (crossOrigin) link.crossOrigin = crossOrigin

      head.appendChild(link)
      addedLinks.push(link)
    }

    // Add preconnect hints
    preconnectOrigins.forEach(origin => {
      addLink('preconnect', origin, undefined, undefined, origin.includes('fonts.gstatic.com') ? 'anonymous' : undefined)
    })

    // Add DNS prefetch hints
    dnsPrefetchDomains.forEach(domain => {
      addLink('dns-prefetch', domain.startsWith('http') ? domain : `https://${domain}`)
    })

    // Preload critical images
    criticalImages.forEach(src => {
      // Determine image format for better preloading
      const format = src.includes('.webp') ? 'image/webp' :
                   src.includes('.avif') ? 'image/avif' :
                   src.includes('.jpg') || src.includes('.jpeg') ? 'image/jpeg' :
                   src.includes('.png') ? 'image/png' : undefined

      addLink('preload', src, 'image', format)
    })

    // Preload critical fonts
    criticalFonts.forEach(src => {
      addLink('preload', src, 'font', 'font/woff2', 'anonymous')
    })

    // Preload critical CSS
    criticalCSS.forEach(src => {
      addLink('preload', src, 'style')
    })

    // Module preload for JavaScript
    modulePreload.forEach(src => {
      addLink('modulepreload', src)
    })

    // Prefetch images for next navigation (lower priority)
    prefetchImages.forEach(src => {
      addLink('prefetch', src, 'image')
    })

    // Prefetch pages for next navigation
    prefetchPages.forEach(href => {
      addLink('prefetch', href)
    })

    // Cleanup function
    return () => {
      addedLinks.forEach(link => {
        try {
          head.removeChild(link)
        } catch (e) {
          // Link may have already been removed
        }
      })
    }
  }, [
    criticalImages,
    criticalFonts,
    criticalCSS,
    prefetchImages,
    prefetchPages,
    dnsPrefetchDomains,
    preconnectOrigins,
    modulePreload,
  ])

  // This component doesn't render anything
  return null
}

// Hook for programmatic resource hints
export function useResourceHints() {
  const preloadImage = (src: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = src
    link.as = 'image'
    document.head.appendChild(link)
  }

  const prefetchPage = (href: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }

  const preconnectOrigin = (origin: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    document.head.appendChild(link)
  }

  return { preloadImage, prefetchPage, preconnectOrigin }
}

// Component for smart image prefetching based on viewport
export function SmartImagePrefetch({
  images,
  threshold = 0.1,
  rootMargin = '50px'
}: {
  images: { src: string; priority: 'high' | 'medium' | 'low' }[]
  threshold?: number
  rootMargin?: string
}) {

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const { preloadImage } = useResourceHints()
    const prefetchedImages = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.prefetchSrc

            if (src && !prefetchedImages.has(src)) {
              preloadImage(src)
              prefetchedImages.add(src)
              observer.unobserve(img)
            }
          }
        })
      },
      { threshold, rootMargin }
    )

    // Create invisible elements to trigger prefetching
    images.forEach(({ src, priority }) => {
      const img = document.createElement('img')
      img.style.position = 'absolute'
      img.style.width = '1px'
      img.style.height = '1px'
      img.style.opacity = '0'
      img.style.pointerEvents = 'none'
      img.dataset.prefetchSrc = src
      img.dataset.priority = priority

      document.body.appendChild(img)
      observer.observe(img)
    })

    return () => {
      observer.disconnect()
    }
  }, [images, threshold, rootMargin])

  return null
}

// High-priority resource hints for above-the-fold content
export function CriticalResourceHints() {
  return (
    <ResourceHints
      criticalImages={[
        '/images/hero-image-optimized.webp',
        '/images/pg-logo-optimized.webp',
      ]}
      criticalFonts={[
        'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
      ]}
      modulePreload={[
        '/_next/static/chunks/main.js',
        '/_next/static/chunks/pages/_app.js',
      ]}
    />
  )
}

// Product page specific resource hints
export function ProductResourceHints({ productImages }: { productImages: string[] }) {
  const prefetchImages = productImages.slice(1, 4) // Prefetch next 3 images

  return (
    <ResourceHints
      criticalImages={[productImages[0]]} // First image is critical
      prefetchImages={prefetchImages}
      prefetchPages={['/cart', '/checkout']} // Likely next navigation
    />
  )
}