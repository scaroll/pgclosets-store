'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary - Graceful error handling component
 *
 * Catches JavaScript errors anywhere in child component tree,
 * logs errors, and displays fallback UI.
 *
 * Features:
 * - Automatic error catching and logging
 * - User-friendly error messages
 * - Recovery options (retry, go home)
 * - Optional error details for development
 * - Prevents white screen of death
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, info) => logToService(error, info)}
 *   showDetails={process.env.NODE_ENV === 'development'}
 * >
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              {/* Icon and Title */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-charcoal-900 mb-2">
                    Oops! Something went wrong
                  </h1>
                  <p className="text-gray-600">
                    We apologize for the inconvenience. An unexpected error has occurred.
                  </p>
                </div>
              </div>

              {/* Error Details (Development Only) */}
              {this.props.showDetails && this.state.error && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h2 className="font-mono text-sm font-semibold text-gray-900">
                    Error Details (Development Mode)
                  </h2>
                  <div className="font-mono text-xs text-red-600 overflow-auto max-h-40">
                    <p className="font-semibold mb-1">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="text-gray-700 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={this.handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal-900 text-white rounded-lg font-medium hover:bg-charcoal-800 transition-colors"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-charcoal-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </button>
              </div>

              {/* Support Message */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 text-center">
                  If this problem persists, please{' '}
                  <a
                    href="/contact"
                    className="text-copper-600 hover:text-copper-700 font-medium underline"
                  >
                    contact our support team
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * withErrorBoundary - HOC to wrap components with error boundary
 *
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   fallback: <CustomErrorUI />,
 *   onError: (error) => logError(error)
 * })
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
