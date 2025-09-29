'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  eventId: string | null
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      errorInfo: errorInfo.componentStack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      timestamp: new Date().toISOString(),
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Full Details:', errorDetails)
      console.groupEnd()
    }

    // Send to monitoring services
    this.reportError(error, errorDetails)

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo,
      eventId: this.generateEventId(),
    })
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props

    if (resetOnPropsChange && this.state.hasError) {
      if (resetKeys) {
        const hasResetKeyChanged = resetKeys.some(
          (resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey
        )
        if (hasResetKeyChanged) {
          this.resetErrorBoundary()
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  private generateEventId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private reportError = async (error: Error, errorDetails: any) => {
    try {
      // Send to multiple monitoring services
      await Promise.allSettled([
        this.reportToSentry(error, errorDetails),
        this.reportToAnalytics(error, errorDetails),
        this.reportToCustomEndpoint(error, errorDetails),
      ])
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private reportToSentry = async (error: Error, errorDetails: any) => {
    // In a real app, you'd use the Sentry SDK
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          component: 'ErrorBoundary',
          url: errorDetails.url,
        },
        extra: errorDetails,
      })
    }
  }

  private reportToAnalytics = async (error: Error, errorDetails: any) => {
    // Report to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        error_component: 'ErrorBoundary',
        error_url: errorDetails.url,
        custom_map: {
          custom_dimension_1: 'error_boundary',
          custom_dimension_2: error.name,
        },
      })
    }

    // Report to PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('error_boundary_triggered', {
        error_message: error.message,
        error_stack: error.stack,
        error_url: errorDetails.url,
        error_timestamp: errorDetails.timestamp,
      })
    }
  }

  private reportToCustomEndpoint = async (error: Error, errorDetails: any) => {
    try {
      // Report to custom error tracking endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          errorDetails,
          eventId: this.state.eventId,
        }),
      })
    } catch (fetchError) {
      // Silently fail - don't want error reporting to crash the app
      console.warn('Failed to report to custom endpoint:', fetchError)
    }
  }

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    })
  }

  private handleRetry = () => {
    this.resetErrorBoundary()
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  private handleReportIssue = () => {
    const { error, eventId } = this.state
    const subject = encodeURIComponent(`Error Report: ${error?.message || 'Unknown Error'}`)
    const body = encodeURIComponent(`
Error ID: ${eventId}
Error Message: ${error?.message || 'Unknown'}
URL: ${typeof window !== 'undefined' ? window.location.href : 'Unknown'}
Time: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:


---
Technical Details:
${error?.stack || 'No stack trace available'}
`)

    const mailtoLink = `mailto:support@pgclosets.com?subject=${subject}&body=${body}`

    if (typeof window !== 'undefined') {
      window.open(mailtoLink)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 text-sm">
                We're sorry for the inconvenience. Please try one of the options below.
              </p>
              {this.state.eventId && (
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  Error ID: {this.state.eventId}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>

              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full"
              >
                Reload Page
              </Button>

              <Button
                onClick={this.handleReportIssue}
                variant="outline"
                className="w-full text-sm"
              >
                Report Issue
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                  <div className="text-red-600 font-bold mb-2">{this.state.error.message}</div>
                  <pre className="whitespace-pre-wrap text-gray-800">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="text-gray-600 font-bold mb-1">Component Stack:</div>
                      <pre className="whitespace-pre-wrap text-gray-800">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Hook for manual error reporting
export function useErrorHandler() {
  const reportError = (error: Error, context?: Record<string, any>) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      timestamp: new Date().toISOString(),
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Manual Error Report:', error, errorDetails)
    }

    // Report to monitoring services (same as ErrorBoundary)
    if (typeof window !== 'undefined') {
      // Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          error_context: 'manual_report',
        })
      }

      // PostHog
      if ((window as any).posthog) {
        (window as any).posthog.capture('manual_error_report', {
          error_message: error.message,
          error_stack: error.stack,
          error_context: context,
        })
      }

      // Sentry
      if ((window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: { source: 'manual_report' },
          extra: errorDetails,
        })
      }
    }
  }

  return { reportError }
}

// Component-specific error boundaries
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      console.error('Page Error:', error, errorInfo)
    }}
  >
    {children}
  </ErrorBoundary>
)

export const FormErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-800 text-sm">
          There was an error with the form. Please refresh the page and try again.
        </p>
      </div>
    }
    onError={(error) => {
      console.error('Form Error:', error)
    }}
  >
    {children}
  </ErrorBoundary>
)

export const ChartErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="p-8 text-center border border-gray-200 rounded-lg">
        <p className="text-gray-500">Unable to load chart</p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
)