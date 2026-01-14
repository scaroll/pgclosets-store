'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

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

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo
    })

    // Report error to monitoring service in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Example: Send to error tracking service
      try {
        // Analytics or error tracking service integration
        if ((window as any).gtag) {
          (window as any).gtag('event', 'exception', {
            description: error.toString(),
            fatal: false
          })
        }
      } catch (reportingError) {
        console.warn('Failed to report error:', reportingError)
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-pg-offwhite px-4">
          <div className="max-w-md w-full">

            {/* Error Card */}
            <div className="card-apple p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h1 className="text-h2 text-pg-navy mb-4">Something went wrong</h1>
              <p className="text-body-m text-pg-gray mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="btn-primary w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>

                <button
                  onClick={this.handleReload}
                  className="btn-secondary w-full"
                >
                  Reload Page
                </button>

                <a
                  href="/"
                  className="btn-secondary w-full inline-flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </a>
              </div>

              {/* Contact Support */}
              <div className="mt-6 pt-6 border-t border-pg-border">
                <p className="text-body-s text-pg-gray mb-2">Still having trouble?</p>
                <a
                  href="/contact"
                  className="text-pg-navy hover:text-pg-sky transition-colors duration-200 text-sm font-medium"
                >
                  Contact Support →
                </a>
              </div>
            </div>

            {/* Error Details in Development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Development Error Details</h3>
                <details className="text-xs text-red-700">
                  <summary className="cursor-pointer mb-2 font-medium">
                    {this.state.error.name}: {this.state.error.message}
                  </summary>
                  <pre className="whitespace-pre-wrap bg-red-100 p-2 rounded text-xs overflow-auto max-h-48">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 whitespace-pre-wrap bg-red-100 p-2 rounded text-xs overflow-auto max-h-48">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              </div>
            )}

          </div>
        </div>
      )
    }

    return this.props.children
  }
}