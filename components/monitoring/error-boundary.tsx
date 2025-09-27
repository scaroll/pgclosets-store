"use client"

import React, { ErrorInfo, ReactNode } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

// Error tracking function
const trackError = (error: Error, errorInfo: ErrorInfo) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Boundary caught an error:', error)
    console.error('Error Info:', errorInfo)
  }

  // In production, you would send this to your error tracking service
  if (process.env.NODE_ENV === 'production') {
    try {
      // Example: Sentry, LogRocket, or custom error service
      fetch('/api/errors', {
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
          errorInfo: {
            componentStack: errorInfo.componentStack,
          },
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(err => {
        console.error('Failed to track error:', err)
      })
    } catch (trackingError) {
      console.error('Error tracking failed:', trackingError)
    }
  }
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    trackError(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development'
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-lg">
                We apologize for the inconvenience. An unexpected error has occurred.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isDev && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2 flex items-center">
                    <Bug className="h-4 w-4 mr-2" />
                    Development Error Details
                  </h3>
                  <pre className="text-sm text-red-700 overflow-auto max-h-40">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-3">
                      <summary className="text-sm font-medium text-red-800 cursor-pointer">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Don&apos;t worry - your data is safe. Try refreshing the page or returning to the homepage.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={this.handleReset} variant="default" className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={this.handleReload} variant="outline" className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>
                  <Button onClick={this.handleGoHome} variant="outline" className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p>
                  If this problem persists, please contact support at{' '}
                  <a href="mailto:support@pgclosets.com" className="text-blue-600 hover:underline">
                    support@pgclosets.com
                  </a>
                </p>
                {isDev && (
                  <p className="mt-1 text-xs">
                    Error ID: {Date.now().toString(36)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Hook for programmatic error reporting
export const useErrorReporting = () => {
  const reportError = (error: Error, context?: Record<string, any>) => {
    trackError(error, { componentStack: JSON.stringify(context) } as ErrorInfo)
  }

  return { reportError }
}

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  React.useEffect(() => {
    // Core Web Vitals monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('Navigation timing:', entry)
          } else if (entry.entryType === 'paint') {
            console.log('Paint timing:', entry)
          } else if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry)
          }
        }
      })

      try {
        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
      } catch (_e) {
        console.warn('P_erformanc_e Obs_erv_er not fully support_ed')
      }

      return () => observer.disconnect()
    }
  }, [])
}