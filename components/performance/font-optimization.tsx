'use client'

import { useEffect } from 'react'

// Font preloading component
export function FontPreloader() {
  useEffect(() => {
    // Preload critical fonts
    const fontUrls = [
      'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.woff2',
      'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVI.woff2'
    ]

    fontUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.href = url
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Add font-display: swap to existing fonts
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 400 700 900;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 400 600;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVI.woff2') format('woff2');
      }
      
      /* Fallback fonts with similar metrics */
      .font-loading {
        font-family: system-ui, -apple-system, sans-serif;
      }
      
      .font-loaded {
        font-family: var(--font-open-sans), system-ui, -apple-system, sans-serif;
      }
      
      .font-heading-loaded {
        font-family: var(--font-montserrat), system-ui, -apple-system, sans-serif;
      }
    `
    document.head.appendChild(style)

    // Mark fonts as loaded after a reasonable time
    const timer = setTimeout(() => {
      document.documentElement.classList.add('fonts-loaded')
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return null
}

// Font loading hook for components
export function useFontLoading() {
  useEffect(() => {
    // Use Font Loading API if available
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-ready')
      })
    }
  }, [])
}

// Component for critical CSS inlining
export function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical above-the-fold styles */
          .hero-section {
            min-height: 80vh;
            background: linear-gradient(to right, #0f172a, #334155);
          }
          
          .hero-title {
            font-size: clamp(2rem, 8vw, 4rem);
            font-weight: 900;
            line-height: 1.1;
            color: white;
          }
          
          .hero-subtitle {
            font-size: clamp(1rem, 4vw, 1.25rem);
            color: #cbd5e1;
            margin-bottom: 2rem;
          }
          
          .btn-primary {
            background-color: #ea580c;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: background-color 0.2s;
          }
          
          .btn-primary:hover {
            background-color: #dc2626;
          }
          
          /* Loading states */
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `
      }}
    />
  )
}