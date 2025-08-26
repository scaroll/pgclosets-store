// Web Vitals monitoring for Core Web Vitals optimization
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to Google Analytics 4 if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }

  // Send to Vercel Analytics if available
  if (typeof window !== 'undefined' && 'va' in window) {
    ;(window as any).va('track', 'Web Vital', {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
    })
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      entries: metric.entries,
    })
  }
}

export function reportWebVitals() {
  try {
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  } catch (error) {
    console.warn('Web Vitals reporting failed:', error)
  }
}

// Export individual metric functions for custom usage
export { onCLS, onINP, onFCP, onLCP, onTTFB }