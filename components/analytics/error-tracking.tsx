"use client"

import React, { useEffect, useRef, useCallback } from 'react'
import { getAnalytics } from '../../lib/analytics'
import { AnalyticsError } from '../../types/analytics'

// Error Categories
enum ErrorCategory {
  JAVASCRIPT = 'javascript',
  NETWORK = 'network',
  ANALYTICS = 'analytics',
  FORM = 'form',
  PAYMENT = 'payment',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  API = 'api'
}

// Error Severity Levels
enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Enhanced Error Data
interface EnhancedError extends AnalyticsError {
  severity: ErrorSeverity
  category: ErrorCategory
  userAgent: string
  url: string
  timestamp: number
  sessionId: string
  userId?: string
  context: {
    component?: string
    props?: Record<string, any>
    state?: Record<string, any>
    userActions?: string[]
    performanceMetrics?: PerformanceData
    networkStatus?: string
    memoryUsage?: number
  }
  recovery?: {
    attempted: boolean
    successful: boolean
    method?: string
  }
}

interface PerformanceData {
  memoryUsage: number
  connectionType: string
  renderTime: number
  jsHeapSizeLimit: number
  jsHeapSize: number
  loadTime: number
}

// Performance Metrics
interface PerformanceMetrics {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
  inp: number // Interaction to Next Paint
}

class ErrorTracker {
  private analytics: any
  private errors: EnhancedError[] = []
  private errorCounts: Map<string, number> = new Map()
  private sessionId: string
  private userId?: string
  private performanceObserver?: PerformanceObserver
  private userActions: string[] = []

  constructor() {
    this.analytics = getAnalytics()
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return

    // Set up global error handlers
    this.setupGlobalErrorHandlers()

    // Set up performance monitoring
    this.setupPerformanceMonitoring()

    // Set up network monitoring
    this.setupNetworkMonitoring()

    // Set up user action tracking for context
    this.setupUserActionTracking()

    // Set up unhandled promise rejection tracking
    this.setupPromiseRejectionTracking()

    // Set up React error boundary integration
    this.setupReactErrorTracking()
  }

  // Global Error Handlers
  private setupGlobalErrorHandlers(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        errorType: 'javascript',
        errorMessage: event.message,
        errorStack: event.error?.stack,
        fatal: false,
        timestamp: Date.now(),
        url: event.filename || window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        context: {
          lineNumber: event.lineno,
          columnNumber: event.colno,
          userActions: [...this.userActions],
          performanceMetrics: this.getPerformanceData()
        }
      }, ErrorCategory.JAVASCRIPT, ErrorSeverity.MEDIUM)
    })

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement
        this.trackError({
          errorType: 'resource_load',
          errorMessage: `Failed to load resource: ${target.tagName}`,
          fatal: false,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          sessionId: this.sessionId,
          context: {
            resourceType: target.tagName,
            resourceSrc: target.getAttribute('src') || target.getAttribute('href'),
            userActions: [...this.userActions]
          }
        }, ErrorCategory.NETWORK, ErrorSeverity.LOW)
      }
    }, true)
  }

  private setupPromiseRejectionTracking(): void {
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        errorType: 'unhandled_promise',
        errorMessage: event.reason?.message || 'Unhandled Promise Rejection',
        errorStack: event.reason?.stack,
        fatal: false,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        context: {
          reason: event.reason,
          userActions: [...this.userActions],
          performanceMetrics: this.getPerformanceData()
        }
      }, ErrorCategory.JAVASCRIPT, ErrorSeverity.HIGH)
    })
  }

  // Performance Monitoring
  private setupPerformanceMonitoring(): void {
    // Core Web Vitals
    this.observeWebVitals()

    // Custom performance metrics
    this.observeCustomMetrics()

    // Memory monitoring
    this.setupMemoryMonitoring()

    // Long task monitoring
    this.observeLongTasks()
  }

  private observeWebVitals(): void {
    try {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.trackPerformanceMetric('LCP', entry.startTime, {
            element: entry.element?.tagName,
            url: entry.url
          })
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })

      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming
          if (fidEntry.processingStart) {
            const fid = fidEntry.processingStart - fidEntry.startTime
            this.trackPerformanceMetric('FID', fid, {
              eventType: fidEntry.name
            })
          }
        }
      }).observe({ type: 'first-input', buffered: true })

      // Cumulative Layout Shift
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const clsEntry = entry as LayoutShift
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value || 0
          }
        }
        this.trackPerformanceMetric('CLS', clsValue)
      }).observe({ type: 'layout-shift', buffered: true })

    } catch (error) {
      console.warn('Performance Observer not supported:', error)
    }
  }

  private observeCustomMetrics(): void {
    // Page Load Time
    window.addEventListener('load', () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        this.trackPerformanceMetric('PAGE_LOAD', navigationEntry.loadEventEnd - navigationEntry.fetchStart, {
          domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart,
          firstPaint: this.getFirstPaintTime(),
          dnsLookup: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
          tcpConnection: navigationEntry.connectEnd - navigationEntry.connectStart,
          serverResponse: navigationEntry.responseEnd - navigationEntry.requestStart
        })
      }
    })
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory) {
          const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100

          if (usagePercent > 80) {
            this.trackError({
              errorType: 'memory_warning',
              errorMessage: `High memory usage: ${usagePercent.toFixed(1)}%`,
              fatal: false,
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent,
              sessionId: this.sessionId,
              context: {
                memoryUsage: memory.usedJSHeapSize,
                memoryLimit: memory.jsHeapSizeLimit,
                usagePercent,
                userActions: [...this.userActions]
              }
            }, ErrorCategory.PERFORMANCE, ErrorSeverity.MEDIUM)
          }
        }
      }, 30000) // Check every 30 seconds
    }
  }

  private observeLongTasks(): void {
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.trackError({
              errorType: 'long_task',
              errorMessage: `Long task detected: ${entry.duration}ms`,
              fatal: false,
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent,
              sessionId: this.sessionId,
              context: {
                taskDuration: entry.duration,
                taskName: entry.name,
                userActions: [...this.userActions]
              }
            }, ErrorCategory.PERFORMANCE, ErrorSeverity.LOW)
          }
        }
      }).observe({ type: 'longtask', buffered: true })
    } catch (error) {
      console.warn('Long Task Observer not supported:', error)
    }
  }

  // Network Monitoring
  private setupNetworkMonitoring(): void {
    // Monitor failed network requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        if (!response.ok) {
          this.trackNetworkError(args[0], response.status, response.statusText)
        }
        return response
      } catch (error) {
        this.trackNetworkError(args[0], 0, error.message)
        throw error
      }
    }

    // Monitor XMLHttpRequest failures
    const originalXHR = window.XMLHttpRequest
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR()
      const originalSend = xhr.send

      xhr.send = function(...args) {
        xhr.addEventListener('error', () => {
          this.trackNetworkError(xhr.responseURL, xhr.status, xhr.statusText)
        })
        return originalSend.apply(xhr, args)
      }

      return xhr
    }
  }

  private trackNetworkError(url: string | Request, status: number, statusText: string): void {
    const urlString = typeof url === 'string' ? url : url.url

    this.trackError({
      errorType: 'network',
      errorMessage: `Network request failed: ${status} ${statusText}`,
      fatal: false,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      context: {
        requestUrl: urlString,
        httpStatus: status,
        httpStatusText: statusText,
        connectionType: (navigator as any).connection?.effectiveType,
        userActions: [...this.userActions]
      }
    }, ErrorCategory.NETWORK, ErrorSeverity.MEDIUM)
  }

  // User Action Tracking for Context
  private setupUserActionTracking(): void {
    const trackAction = (action: string) => {
      this.userActions.push(`${Date.now()}:${action}`)
      if (this.userActions.length > 10) {
        this.userActions = this.userActions.slice(-5) // Keep last 5 actions
      }
    }

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      trackAction(`click:${target.tagName}:${target.id || target.className}`)
    })

    document.addEventListener('input', (e) => {
      const target = e.target as HTMLElement
      trackAction(`input:${target.tagName}:${target.getAttribute('name') || target.id}`)
    })

    window.addEventListener('popstate', () => {
      trackAction(`navigation:${window.location.pathname}`)
    })
  }

  // React Error Boundary Integration
  private setupReactErrorTracking(): void {
    // This would be called by React Error Boundaries
    window.addEventListener('react-error', ((event: CustomEvent) => {
      this.trackReactError(event.detail)
    }) as EventListener)
  }

  // Core Error Tracking Methods
  public trackError(
    error: Partial<AnalyticsError>,
    category: ErrorCategory = ErrorCategory.JAVASCRIPT,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const enhancedError: EnhancedError = {
      errorType: error.errorType || 'unknown',
      errorMessage: error.errorMessage || 'Unknown error',
      errorStack: error.errorStack,
      fatal: error.fatal || false,
      timestamp: error.timestamp || Date.now(),
      url: error.url || window.location.href,
      userAgent: error.userAgent || navigator.userAgent,
      sessionId: error.sessionId || this.sessionId,
      userId: error.userId || this.userId,
      severity,
      category,
      context: {
        ...error.context,
        performanceMetrics: this.getPerformanceData(),
        networkStatus: (navigator as any).onLine ? 'online' : 'offline',
        memoryUsage: this.getMemoryUsage(),
        userActions: [...this.userActions]
      }
    }

    // Store error
    this.errors.push(enhancedError)
    this.updateErrorCounts(enhancedError)

    // Send to GA4
    this.sendToAnalytics(enhancedError)

    // Check for error patterns
    this.analyzeErrorPatterns(enhancedError)

    // Limit stored errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-50)
    }
  }

  public trackReactError(errorInfo: {
    error: Error
    errorInfo: { componentStack: string }
    component?: string
    props?: Record<string, any>
    state?: Record<string, any>
  }): void {
    this.trackError({
      errorType: 'react_error',
      errorMessage: errorInfo.error.message,
      errorStack: errorInfo.error.stack,
      fatal: false,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      context: {
        component: errorInfo.component,
        componentStack: errorInfo.errorInfo.componentStack,
        props: errorInfo.props,
        state: errorInfo.state,
        userActions: [...this.userActions]
      }
    }, ErrorCategory.JAVASCRIPT, ErrorSeverity.HIGH)
  }

  public trackFormError(formId: string, fieldName: string, errorMessage: string): void {
    this.trackError({
      errorType: 'form_validation',
      errorMessage: `Form validation error: ${errorMessage}`,
      fatal: false,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      context: {
        formId,
        fieldName,
        validationError: errorMessage,
        userActions: [...this.userActions]
      }
    }, ErrorCategory.FORM, ErrorSeverity.LOW)
  }

  public trackPaymentError(errorCode: string, errorMessage: string, paymentMethod?: string): void {
    this.trackError({
      errorType: 'payment_error',
      errorMessage: `Payment failed: ${errorMessage}`,
      fatal: false,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      context: {
        errorCode,
        paymentMethod,
        userActions: [...this.userActions]
      }
    }, ErrorCategory.PAYMENT, ErrorSeverity.HIGH)
  }

  public trackApiError(endpoint: string, method: string, status: number, errorMessage: string): void {
    this.trackError({
      errorType: 'api_error',
      errorMessage: `API error: ${method} ${endpoint} - ${errorMessage}`,
      fatal: false,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      context: {
        apiEndpoint: endpoint,
        httpMethod: method,
        httpStatus: status,
        userActions: [...this.userActions]
      }
    }, ErrorCategory.API, ErrorSeverity.MEDIUM)
  }

  // Performance Tracking
  private trackPerformanceMetric(name: string, value: number, metadata?: Record<string, any>): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    this.analytics.trackWebVitals({
      name: name as any,
      value,
      delta: 0,
      id: `${name}_${Date.now()}`,
      navigationType: 'navigate',
      rating: this.getMetricRating(name, value)
    })

    // Track performance issues
    if (this.isPerformanceIssue(name, value)) {
      this.trackError({
        errorType: 'performance_issue',
        errorMessage: `Performance threshold exceeded: ${name} = ${value}ms`,
        fatal: false,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        context: {
          metricName: name,
          metricValue: value,
          threshold: this.getPerformanceThreshold(name),
          ...metadata
        }
      }, ErrorCategory.PERFORMANCE, ErrorSeverity.MEDIUM)
    }
  }

  // Analytics Integration
  private sendToAnalytics(error: EnhancedError): void {
    this.analytics.gtag('event', 'exception', {
      description: `${error.category}:${error.errorType}:${error.errorMessage}`,
      fatal: error.fatal,
      error_category: error.category,
      error_type: error.errorType,
      error_severity: error.severity,
      event_category: 'Errors',
      event_label: error.errorType,
      custom_map: {
        error_url: error.url,
        session_id: error.sessionId,
        user_agent: error.userAgent,
        component: error.context.component,
        memory_usage: error.context.memoryUsage
      }
    })
  }

  // Error Pattern Analysis
  private analyzeErrorPatterns(error: EnhancedError): void {
    const errorKey = `${error.category}:${error.errorType}`
    const count = this.errorCounts.get(errorKey) || 0

    // Alert on repeated errors
    if (count >= 5) {
      this.trackError({
        errorType: 'error_pattern',
        errorMessage: `Repeated error detected: ${errorKey} (${count} times)`,
        fatal: false,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        context: {
          originalError: errorKey,
          occurrenceCount: count,
          pattern: 'repeated_error'
        }
      }, ErrorCategory.ANALYTICS, ErrorSeverity.HIGH)
    }
  }

  // Utility Methods
  private updateErrorCounts(error: EnhancedError): void {
    const errorKey = `${error.category}:${error.errorType}`
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1)
  }

  private generateSessionId(): string {
    return `error_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getPerformanceData(): PerformanceData {
    const memory = (performance as any).memory
    const connection = (navigator as any).connection

    return {
      memoryUsage: memory?.usedJSHeapSize || 0,
      connectionType: connection?.effectiveType || 'unknown',
      renderTime: performance.now(),
      jsHeapSizeLimit: memory?.jsHeapSizeLimit || 0,
      jsHeapSize: memory?.usedJSHeapSize || 0,
      loadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0
    }
  }

  private getMemoryUsage(): number {
    const memory = (performance as any).memory
    return memory?.usedJSHeapSize || 0
  }

  private getFirstPaintTime(): number {
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    return firstPaint?.startTime || 0
  }

  private getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    }

    const threshold = thresholds[name as keyof typeof thresholds]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  private isPerformanceIssue(name: string, value: number): boolean {
    const thresholds = {
      LCP: 4000,
      FID: 300,
      CLS: 0.25,
      FCP: 3000,
      TTFB: 1800,
      PAGE_LOAD: 5000
    }

    return value > (thresholds[name as keyof typeof thresholds] || Infinity)
  }

  private getPerformanceThreshold(name: string): number {
    const thresholds = {
      LCP: 4000,
      FID: 300,
      CLS: 0.25,
      FCP: 3000,
      TTFB: 1800,
      PAGE_LOAD: 5000
    }

    return thresholds[name as keyof typeof thresholds] || 0
  }

  // Public API
  public getErrorSummary(): {
    totalErrors: number
    errorsByCategory: Record<string, number>
    errorsBySeverity: Record<string, number>
    recentErrors: EnhancedError[]
  } {
    const errorsByCategory = {}
    const errorsBySeverity = {}

    this.errors.forEach(error => {
      errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1
    })

    return {
      totalErrors: this.errors.length,
      errorsByCategory,
      errorsBySeverity,
      recentErrors: this.errors.slice(-10)
    }
  }

  public setUserId(userId: string): void {
    this.userId = userId
  }

  public clearErrors(): void {
    this.errors = []
    this.errorCounts.clear()
  }
}

// Singleton instance
let errorTracker: ErrorTracker | null = null

export function getErrorTracker(): ErrorTracker {
  if (!errorTracker) {
    errorTracker = new ErrorTracker()
  }
  return errorTracker
}

// React Hook
export function useErrorTracking() {
  const tracker = useRef<ErrorTracker | null>(null)

  useEffect(() => {
    tracker.current = getErrorTracker()
  }, [])

  const trackError = useCallback((
    error: Partial<AnalyticsError>,
    category?: ErrorCategory,
    severity?: ErrorSeverity
  ) => {
    tracker.current?.trackError(error, category, severity)
  }, [])

  const trackReactError = useCallback((errorInfo: any) => {
    tracker.current?.trackReactError(errorInfo)
  }, [])

  const trackFormError = useCallback((formId: string, fieldName: string, errorMessage: string) => {
    tracker.current?.trackFormError(formId, fieldName, errorMessage)
  }, [])

  const trackPaymentError = useCallback((errorCode: string, errorMessage: string, paymentMethod?: string) => {
    tracker.current?.trackPaymentError(errorCode, errorMessage, paymentMethod)
  }, [])

  const trackApiError = useCallback((endpoint: string, method: string, status: number, errorMessage: string) => {
    tracker.current?.trackApiError(endpoint, method, status, errorMessage)
  }, [])

  return {
    trackError,
    trackReactError,
    trackFormError,
    trackPaymentError,
    trackApiError,
    getErrorSummary: () => tracker.current?.getErrorSummary(),
    setUserId: (userId: string) => tracker.current?.setUserId(userId),
    clearErrors: () => tracker.current?.clearErrors()
  }
}

// React Error Boundary Component
export class AnalyticsErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const tracker = getErrorTracker()
    tracker.trackReactError({
      error,
      errorInfo,
      component: this.constructor.name
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error!} />
      }
      return <div>Something went wrong. Please refresh the page.</div>
    }

    return this.props.children
  }
}

export { ErrorTracker, ErrorCategory, ErrorSeverity }
export type { EnhancedError, PerformanceData, PerformanceMetrics }