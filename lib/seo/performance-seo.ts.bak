/**
 * AGENT 13: Performance SEO Agent - Core Web Vitals Optimization
 * Monitor and optimize for Google's Core Web Vitals
 */

/**
 * Core Web Vitals thresholds (Google's standards)
 */
export const CORE_WEB_VITALS_THRESHOLDS = {
  LCP: {
    good: 2500, // Largest Contentful Paint (ms)
    needsImprovement: 4000,
  },
  FID: {
    good: 100, // First Input Delay (ms)
    needsImprovement: 300,
  },
  CLS: {
    good: 0.1, // Cumulative Layout Shift
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800, // First Contentful Paint (ms)
    needsImprovement: 3000,
  },
  TTFB: {
    good: 800, // Time to First Byte (ms)
    needsImprovement: 1800,
  },
  INP: {
    good: 200, // Interaction to Next Paint (ms)
    needsImprovement: 500,
  }
}

/**
 * Performance metric data structure
 */
export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  threshold: {
    good: number
    needsImprovement: number
  }
}

/**
 * Calculate rating based on threshold
 */
export function calculateRating(
  value: number,
  goodThreshold: number,
  needsImprovementThreshold: number
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= goodThreshold) return 'good'
  if (value <= needsImprovementThreshold) return 'needs-improvement'
  return 'poor'
}

/**
 * Monitor Core Web Vitals in the browser
 */
export function initCoreWebVitals(callback: (metric: PerformanceMetric) => void) {
  if (typeof window === 'undefined') return

  // LCP - Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1] as any

    callback({
      name: 'LCP',
      value: lastEntry.renderTime || lastEntry.loadTime,
      rating: calculateRating(
        lastEntry.renderTime || lastEntry.loadTime,
        CORE_WEB_VITALS_THRESHOLDS.LCP.good,
        CORE_WEB_VITALS_THRESHOLDS.LCP.needsImprovement
      ),
      threshold: CORE_WEB_VITALS_THRESHOLDS.LCP
    })
  })

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch (e) {
    // LCP not supported
  }

  // FID - First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      callback({
        name: 'FID',
        value: entry.processingStart - entry.startTime,
        rating: calculateRating(
          entry.processingStart - entry.startTime,
          CORE_WEB_VITALS_THRESHOLDS.FID.good,
          CORE_WEB_VITALS_THRESHOLDS.FID.needsImprovement
        ),
        threshold: CORE_WEB_VITALS_THRESHOLDS.FID
      })
    })
  })

  try {
    fidObserver.observe({ type: 'first-input', buffered: true })
  } catch (e) {
    // FID not supported
  }

  // CLS - Cumulative Layout Shift
  let clsValue = 0
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as any[]) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
      }
    }

    callback({
      name: 'CLS',
      value: clsValue,
      rating: calculateRating(
        clsValue,
        CORE_WEB_VITALS_THRESHOLDS.CLS.good,
        CORE_WEB_VITALS_THRESHOLDS.CLS.needsImprovement
      ),
      threshold: CORE_WEB_VITALS_THRESHOLDS.CLS
    })
  })

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true })
  } catch (e) {
    // CLS not supported
  }

  // FCP - First Contentful Paint
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      callback({
        name: 'FCP',
        value: entry.startTime,
        rating: calculateRating(
          entry.startTime,
          CORE_WEB_VITALS_THRESHOLDS.FCP.good,
          CORE_WEB_VITALS_THRESHOLDS.FCP.needsImprovement
        ),
        threshold: CORE_WEB_VITALS_THRESHOLDS.FCP
      })
    })
  })

  try {
    fcpObserver.observe({ type: 'paint', buffered: true })
  } catch (e) {
    // FCP not supported
  }

  // TTFB - Time to First Byte
  if (performance.getEntriesByType('navigation').length > 0) {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const ttfb = navEntry.responseStart - navEntry.requestStart

    callback({
      name: 'TTFB',
      value: ttfb,
      rating: calculateRating(
        ttfb,
        CORE_WEB_VITALS_THRESHOLDS.TTFB.good,
        CORE_WEB_VITALS_THRESHOLDS.TTFB.needsImprovement
      ),
      threshold: CORE_WEB_VITALS_THRESHOLDS.TTFB
    })
  }
}

/**
 * Performance optimization recommendations
 */
export interface PerformanceRecommendation {
  metric: string
  currentValue: number
  targetValue: number
  priority: 'high' | 'medium' | 'low'
  recommendations: string[]
}

export function generatePerformanceRecommendations(
  metrics: PerformanceMetric[]
): PerformanceRecommendation[] {
  const recommendations: PerformanceRecommendation[] = []

  metrics.forEach(metric => {
    if (metric.rating === 'poor' || metric.rating === 'needs-improvement') {
      const rec: PerformanceRecommendation = {
        metric: metric.name,
        currentValue: metric.value,
        targetValue: metric.threshold.good,
        priority: metric.rating === 'poor' ? 'high' : 'medium',
        recommendations: []
      }

      switch (metric.name) {
        case 'LCP':
          rec.recommendations = [
            'Optimize and compress hero images',
            'Use modern image formats (WebP/AVIF)',
            'Implement lazy loading for below-fold images',
            'Reduce server response time',
            'Use CDN for static assets',
            'Preload critical resources',
          ]
          break

        case 'FID':
        case 'INP':
          rec.recommendations = [
            'Reduce JavaScript execution time',
            'Break up long tasks',
            'Use web workers for heavy computations',
            'Defer non-critical JavaScript',
            'Implement code splitting',
          ]
          break

        case 'CLS':
          rec.recommendations = [
            'Set explicit width/height on images',
            'Reserve space for dynamic content',
            'Avoid inserting content above existing content',
            'Use CSS aspect-ratio',
            'Preload fonts with font-display: optional',
          ]
          break

        case 'FCP':
          rec.recommendations = [
            'Eliminate render-blocking resources',
            'Minify CSS and JavaScript',
            'Implement critical CSS',
            'Use content-visibility for off-screen content',
            'Reduce server response time',
          ]
          break

        case 'TTFB':
          rec.recommendations = [
            'Use a CDN',
            'Implement server-side caching',
            'Optimize database queries',
            'Use connection pooling',
            'Consider serverless or edge computing',
          ]
          break
      }

      recommendations.push(rec)
    }
  })

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Send metrics to analytics
 */
export function reportWebVitals(metric: PerformanceMetric) {
  // Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.rating,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${metric.name}]`, {
      value: metric.value,
      rating: metric.rating,
      threshold: metric.threshold
    })
  }
}

/**
 * Performance budget checker
 */
export interface PerformanceBudget {
  metric: string
  budget: number
  actual: number
  isWithinBudget: boolean
  overagePercentage: number
}

export function checkPerformanceBudget(
  metrics: PerformanceMetric[],
  budgets: Record<string, number>
): PerformanceBudget[] {
  return Object.entries(budgets).map(([metric, budget]) => {
    const actual = metrics.find(m => m.name === metric)?.value || 0
    const isWithinBudget = actual <= budget
    const overagePercentage = ((actual - budget) / budget) * 100

    return {
      metric,
      budget,
      actual,
      isWithinBudget,
      overagePercentage
    }
  })
}
