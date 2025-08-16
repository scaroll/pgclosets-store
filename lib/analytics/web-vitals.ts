// Web Vitals Integration for GA4
// Core Web Vitals tracking with Google Analytics 4

import { ga4 } from './ga4-events'

export interface WebVitalMetric {
  name: string
  value: number
  delta: number
  id: string
  navigationType: string
}

export interface WebVitalsConfig {
  debug?: boolean
  reportAllChanges?: boolean
  thresholds?: {
    lcp?: number // Largest Contentful Paint (milliseconds)
    fid?: number // First Input Delay (milliseconds)
    cls?: number // Cumulative Layout Shift (score)
    fcp?: number // First Contentful Paint (milliseconds)
    ttfb?: number // Time to First Byte (milliseconds)
    inp?: number // Interaction to Next Paint (milliseconds)
  }
}

const DEFAULT_THRESHOLDS = {
  lcp: 2500,  // Good: ≤ 2.5s
  fid: 100,   // Good: ≤ 100ms
  cls: 0.1,   // Good: ≤ 0.1
  fcp: 1800,  // Good: ≤ 1.8s
  ttfb: 800,  // Good: ≤ 0.8s
  inp: 200,   // Good: ≤ 200ms
}

class WebVitalsTracker {
  private config: WebVitalsConfig
  private vitalsData: Map<string, WebVitalMetric> = new Map()
  private isInitialized = false

  constructor(config: WebVitalsConfig = {}) {
    this.config = {
      debug: false,
      reportAllChanges: false,
      thresholds: { ...DEFAULT_THRESHOLDS, ...config.thresholds },
      ...config
    }
  }

  async initialize() {
    if (this.isInitialized || typeof window === 'undefined') {
      return
    }

    try {
      // Dynamic import of web-vitals library
      const webVitalsModule = await import('web-vitals')
      
      // Track Core Web Vitals
      this.trackLCP(webVitalsModule.onLCP)
      this.trackCLS(webVitalsModule.onCLS)
      this.trackFCP(webVitalsModule.onFCP)
      this.trackTTFB(webVitalsModule.onTTFB)

      // Track newer metrics if available
      if ('onINP' in webVitalsModule) {
        this.trackINP(webVitalsModule.onINP)
      }

      this.isInitialized = true

      if (this.config.debug) {
        console.log('[WebVitals] Tracking initialized with config:', this.config)
      }
    } catch (error) {
      console.warn('[WebVitals] Failed to initialize:', error)
    }
  }

  private trackLCP(onLCP: any) {
    onLCP((metric: any) => {
      this.recordMetric('LCP', metric)
      this.sendToGA4('LCP', metric.value, 'ms')
      
      // Track performance rating
      const rating = this.getRating('lcp', metric.value)
      ga4.customEvent({
        event_name: 'web_vital_lcp',
        event_parameters: {
          value: Math.round(metric.value),
          rating,
          navigation_type: metric.navigationType,
          is_final: metric.delta === metric.value
        }
      })
    }, { reportAllChanges: this.config.reportAllChanges })
  }


  private trackCLS(onCLS: any) {
    onCLS((metric: any) => {
      this.recordMetric('CLS', metric)
      this.sendToGA4('CLS', metric.value * 1000, 'score') // Convert to integer
      
      const rating = this.getRating('cls', metric.value)
      ga4.customEvent({
        event_name: 'web_vital_cls',
        event_parameters: {
          value: Math.round(metric.value * 1000), // Send as integer
          rating,
          navigation_type: metric.navigationType,
          is_final: metric.delta === metric.value
        }
      })
    }, { reportAllChanges: this.config.reportAllChanges })
  }

  private trackFCP(onFCP: any) {
    onFCP((metric: any) => {
      this.recordMetric('FCP', metric)
      this.sendToGA4('FCP', metric.value, 'ms')
      
      const rating = this.getRating('fcp', metric.value)
      ga4.customEvent({
        event_name: 'web_vital_fcp',
        event_parameters: {
          value: Math.round(metric.value),
          rating,
          navigation_type: metric.navigationType,
          is_final: true // FCP is always final
        }
      })
    })
  }

  private trackTTFB(onTTFB: any) {
    onTTFB((metric: any) => {
      this.recordMetric('TTFB', metric)
      this.sendToGA4('TTFB', metric.value, 'ms')
      
      const rating = this.getRating('ttfb', metric.value)
      ga4.customEvent({
        event_name: 'web_vital_ttfb',
        event_parameters: {
          value: Math.round(metric.value),
          rating,
          navigation_type: metric.navigationType,
          is_final: true // TTFB is always final
        }
      })
    })
  }

  private trackINP(onINP: any) {
    onINP((metric: any) => {
      this.recordMetric('INP', metric)
      this.sendToGA4('INP', metric.value, 'ms')
      
      const rating = this.getRating('inp', metric.value)
      ga4.customEvent({
        event_name: 'web_vital_inp',
        event_parameters: {
          value: Math.round(metric.value),
          rating,
          navigation_type: metric.navigationType,
          is_final: metric.delta === metric.value
        }
      })
    }, { reportAllChanges: this.config.reportAllChanges })
  }

  private recordMetric(name: string, metric: any) {
    const webVitalMetric: WebVitalMetric = {
      name,
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType
    }
    
    this.vitalsData.set(name, webVitalMetric)

    if (this.config.debug) {
      console.log(`[WebVitals] ${name}:`, webVitalMetric)
    }
  }

  private sendToGA4(metricName: string, value: number, unit: string) {
    ga4.timing(metricName, Math.round(value), 'Web Vitals')
  }

  private getRating(metric: keyof typeof DEFAULT_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.config.thresholds?.[metric] ?? DEFAULT_THRESHOLDS[metric]
    
    switch (metric) {
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
      case 'fid':
      case 'inp':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
      case 'fcp':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
      case 'ttfb':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
      default:
        return value <= threshold ? 'good' : 'needs-improvement'
    }
  }

  // Get summary of all recorded metrics
  getVitalsSummary() {
    const summary: Record<string, any> = {}
    
    this.vitalsData.forEach((metric, name) => {
      const rating = this.getRating(name.toLowerCase() as keyof typeof DEFAULT_THRESHOLDS, metric.value)
      summary[name] = {
        value: Math.round(metric.value),
        rating,
        navigationType: metric.navigationType
      }
    })

    return summary
  }

  // Send comprehensive performance report
  sendPerformanceReport() {
    const summary = this.getVitalsSummary()
    const overallScore = this.calculateOverallScore(summary)
    
    ga4.customEvent({
      event_name: 'performance_report',
      event_parameters: {
        overall_score: overallScore,
        lcp_value: summary.LCP?.value,
        lcp_rating: summary.LCP?.rating,
        fid_value: summary.FID?.value,
        fid_rating: summary.FID?.rating,
        cls_value: summary.CLS?.value,
        cls_rating: summary.CLS?.rating,
        fcp_value: summary.FCP?.value,
        fcp_rating: summary.FCP?.rating,
        ttfb_value: summary.TTFB?.value,
        ttfb_rating: summary.TTFB?.rating,
        inp_value: summary.INP?.value,
        inp_rating: summary.INP?.rating,
      }
    })

    if (this.config.debug) {
      console.log('[WebVitals] Performance report sent:', summary)
    }
  }

  private calculateOverallScore(summary: Record<string, any>): number {
    const ratings = Object.values(summary).map((metric: any) => metric.rating)
    const goodCount = ratings.filter(r => r === 'good').length
    const totalCount = ratings.length
    
    return totalCount > 0 ? Math.round((goodCount / totalCount) * 100) : 0
  }

  // Check if performance is degraded
  isPerformanceDegraded(): boolean {
    const summary = this.getVitalsSummary()
    const poorRatings = Object.values(summary).filter((metric: any) => metric.rating === 'poor').length
    
    return poorRatings > 1 // More than one poor rating indicates degraded performance
  }

  // Get performance insights
  getPerformanceInsights(): string[] {
    const insights: string[] = []
    const summary = this.getVitalsSummary()

    if (summary.LCP?.rating === 'poor') {
      insights.push('Large Contentful Paint is slow - consider optimizing images and server response times')
    }

    if (summary.FID?.rating === 'poor' || summary.INP?.rating === 'poor') {
      insights.push('User interactions are slow - consider reducing JavaScript execution time')
    }

    if (summary.CLS?.rating === 'poor') {
      insights.push('Layout is shifting - ensure proper sizing for images and dynamic content')
    }

    if (summary.TTFB?.rating === 'poor') {
      insights.push('Server response time is slow - consider optimizing backend performance')
    }

    if (insights.length === 0) {
      insights.push('Performance looks good!')
    }

    return insights
  }
}

// Singleton instance
export const webVitalsTracker = new WebVitalsTracker({
  debug: process.env.NODE_ENV === 'development',
  reportAllChanges: false
})

// Auto-initialize when this module is imported
if (typeof window !== 'undefined') {
  // Delay initialization to ensure GA4 is loaded
  setTimeout(() => {
    webVitalsTracker.initialize()
  }, 1000)
}

export { WebVitalsTracker }