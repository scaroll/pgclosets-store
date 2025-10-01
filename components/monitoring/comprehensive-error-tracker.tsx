'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Progress } from '@/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import {
  AlertTriangle,
  Bug,
  Network,
  Code,
  TrendingUp,
  RefreshCw,
  Download,
  Filter,
  Search,
  X
} from 'lucide-react'

// Error types and interfaces
interface ErrorDetails {
  id: string
  type: 'javascript' | 'promise' | 'resource' | 'network' | 'performance' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  stack?: string
  filename?: string
  line?: number
  column?: number
  timestamp: number
  url: string
  userAgent: string
  userId?: string
  sessionId: string
  tags: string[]
  context: Record<string, any>
  resolved: boolean
  count: number
}

interface ErrorStats {
  total: number
  byType: Record<string, number>
  bySeverity: Record<string, number>
  last24h: number
  resolvedCount: number
  topErrors: Array<{ id: string; message: string; count: number }>
  errorRate: number
  trends: {
    increasing: string[]
    decreasing: string[]
  }
}

interface NetworkError {
  url: string
  method: string
  status: number
  statusText: string
  timestamp: number
  responseTime: number
}

interface PerformanceIssue {
  type: 'slow_page' | 'large_resource' | 'memory_leak' | 'unoptimized_image'
  description: string
  value: number
  threshold: number
  url: string
  timestamp: number
  impact: 'low' | 'medium' | 'high'
}

export function ComprehensiveErrorTracker() {
  const [errors, setErrors] = useState<ErrorDetails[]>([])
  const [stats, setStats] = useState<ErrorStats>({
    total: 0,
    byType: {},
    bySeverity: {},
    last24h: 0,
    resolvedCount: 0,
    topErrors: [],
    errorRate: 0,
    trends: { increasing: [], decreasing: [] }
  })
  const [networkErrors, setNetworkErrors] = useState<NetworkError[]>([])
  const [performanceIssues, setPerformanceIssues] = useState<PerformanceIssue[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const sessionId = useRef(generateSessionId())
  const originalConsoleError = useRef<typeof console.error>()
  const errorCounts = useRef<Map<string, number>>(new Map())

  // Initialize error tracking
  const initializeErrorTracking = useCallback(() => {
    if (typeof window === 'undefined' || !isMonitoring) return

    // JavaScript Error Tracking
    const handleError = (event: ErrorEvent) => {
      const error = createErrorDetails({
        type: 'javascript',
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        severity: determineSeverity(event.message, event.error?.stack)
      })
      addError(error)
    }

    // Promise Rejection Tracking
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      const error = createErrorDetails({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        severity: 'high'
      })
      addError(error)
    }

    // Resource Error Tracking
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement
      if (target !== window && target.tagName) {
        const error = createErrorDetails({
          type: 'resource',
          message: `Failed to load ${target.tagName.toLowerCase()}: ${(target as any).src || (target as any).href}`,
          severity: 'medium',
          context: {
            resourceType: target.tagName.toLowerCase(),
            resourceUrl: (target as any).src || (target as any).href
          }
        })
        addError(error)
      }
    }

    // Network Error Tracking
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const responseTime = endTime - startTime

        if (!response.ok) {
          const networkError: NetworkError = {
            url: typeof args[0] === 'string' ? args[0] : args[0].url,
            method: (args[1]?.method || 'GET').toUpperCase(),
            status: response.status,
            statusText: response.statusText,
            timestamp: Date.now(),
            responseTime
          }
          setNetworkErrors(prev => [networkError, ...prev.slice(0, 49)])

          // Create error for failed requests
          if (response.status >= 500) {
            const error = createErrorDetails({
              type: 'network',
              message: `Network error: ${response.status} ${response.statusText}`,
              severity: 'high',
              context: {
                url: networkError.url,
                method: networkError.method,
                status: response.status,
                responseTime
              }
            })
            addError(error)
          }
        }

        return response
      } catch (err) {
        const endTime = performance.now()
        const networkError: NetworkError = {
          url: typeof args[0] === 'string' ? args[0] : args[0].url,
          method: (args[1]?.method || 'GET').toUpperCase(),
          status: 0,
          statusText: 'Network Error',
          timestamp: Date.now(),
          responseTime: endTime - startTime
        }
        setNetworkErrors(prev => [networkError, ...prev.slice(0, 49)])

        const error = createErrorDetails({
          type: 'network',
          message: `Network request failed: ${err}`,
          severity: 'critical',
          context: {
            url: networkError.url,
            method: networkError.method
          }
        })
        addError(error)

        throw err
      }
    }

    // Performance Issue Tracking
    if ('PerformanceObserver' in window) {
      // Track long tasks
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Long task threshold
            const issue: PerformanceIssue = {
              type: 'slow_page',
              description: `Long task detected: ${entry.duration.toFixed(2)}ms`,
              value: entry.duration,
              threshold: 50,
              url: window.location.href,
              timestamp: Date.now(),
              impact: entry.duration > 100 ? 'high' : 'medium'
            }
            setPerformanceIssues(prev => [issue, ...prev.slice(0, 29)])
          }
        })
      }).observe({ entryTypes: ['longtask'] })

      // Track large resources
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming
          if (resourceEntry.transferSize && resourceEntry.transferSize > 1000000) { // 1MB threshold
            const issue: PerformanceIssue = {
              type: 'large_resource',
              description: `Large resource: ${resourceEntry.name} (${(resourceEntry.transferSize / 1024 / 1024).toFixed(2)}MB)`,
              value: resourceEntry.transferSize,
              threshold: 1000000,
              url: resourceEntry.name,
              timestamp: Date.now(),
              impact: 'medium'
            }
            setPerformanceIssues(prev => [issue, ...prev.slice(0, 29)])
          }
        })
      }).observe({ entryTypes: ['resource'] })
    }

    // Console Error Interception
    originalConsoleError.current = console.error
    console.error = (...args) => {
      const error = createErrorDetails({
        type: 'javascript',
        message: args.join(' '),
        severity: 'medium',
        context: { consoleArgs: args }
      })
      addError(error)
      originalConsoleError.current?.(...args)
    }

    // Security Error Tracking
    const handleSecurityError = (event: SecurityPolicyViolationEvent) => {
      const error = createErrorDetails({
        type: 'security',
        message: `CSP Violation: ${event.violatedDirective}`,
        severity: 'high',
        context: {
          violatedDirective: event.violatedDirective,
          blockedURI: event.blockedURI,
          effectiveDirective: event.effectiveDirective
        }
      })
      addError(error)
    }

    // Event Listeners
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handlePromiseRejection)
    window.addEventListener('error', handleResourceError, true)
    document.addEventListener('securitypolicyviolation', handleSecurityError)

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handlePromiseRejection)
      window.removeEventListener('error', handleResourceError, true)
      document.removeEventListener('securitypolicyviolation', handleSecurityError)

      if (originalConsoleError.current) {
        console.error = originalConsoleError.current
      }

      window.fetch = originalFetch
    }
  }, [isMonitoring])

  // Create error details object
  const createErrorDetails = (errorData: Partial<ErrorDetails>): ErrorDetails => {
    const errorKey = `${errorData.type}-${errorData.message}`
    const existingCount = errorCounts.current.get(errorKey) || 0
    errorCounts.current.set(errorKey, existingCount + 1)

    return {
      id: generateErrorId(),
      type: errorData.type || 'javascript',
      severity: errorData.severity || 'medium',
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      filename: errorData.filename,
      line: errorData.line,
      column: errorData.column,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: sessionId.current,
      tags: generateErrorTags(errorData),
      context: errorData.context || {},
      resolved: false,
      count: existingCount + 1
    }
  }

  // Add error to state and send to analytics
  const addError = useCallback((error: ErrorDetails) => {
    setErrors(prev => {
      const updated = [error, ...prev.slice(0, 99)] // Keep last 100 errors
      updateStats(updated)
      return updated
    })

    // Send to analytics/monitoring service
    sendErrorToAnalytics(error)
  }, [])

  // Update error statistics
  const updateStats = (errorList: ErrorDetails[]) => {
    const now = Date.now()
    const last24h = now - 24 * 60 * 60 * 1000

    const byType: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}
    let last24hCount = 0
    let resolvedCount = 0

    errorList.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1

      if (error.timestamp > last24h) last24hCount++
      if (error.resolved) resolvedCount++
    })

    const topErrors = Object.entries(
      errorList.reduce((acc, error) => {
        const key = error.message.substring(0, 100)
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({
        id: generateErrorId(),
        message,
        count
      }))

    setStats({
      total: errorList.length,
      byType,
      bySeverity,
      last24h: last24hCount,
      resolvedCount,
      topErrors,
      errorRate: errorList.length > 0 ? (last24hCount / errorList.length) * 100 : 0,
      trends: { increasing: [], decreasing: [] } // Would be calculated with historical data
    })
  }

  // Send error to analytics service
  const sendErrorToAnalytics = (error: ErrorDetails) => {
    // Integration with your analytics service (GA4, Sentry, etc.)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: error.severity === 'critical',
        error_type: error.type,
        error_severity: error.severity,
        page_url: error.url,
        session_id: error.sessionId
      })
    }

    // Could also send to external monitoring service
    // Example: Sentry, LogRocket, etc.
  }

  // Helper functions
  const generateSessionId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const generateErrorId = (): string => {
    return `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const determineSeverity = (message: string, stack?: string): ErrorDetails['severity'] => {
    const criticalKeywords = ['network', 'security', 'payment', 'auth']
    const highKeywords = ['uncaught', 'unhandled', 'timeout', 'failed']

    const text = (`${message  } ${  stack || ''}`).toLowerCase()

    if (criticalKeywords.some(keyword => text.includes(keyword))) return 'critical'
    if (highKeywords.some(keyword => text.includes(keyword))) return 'high'
    return 'medium'
  }

  const generateErrorTags = (errorData: Partial<ErrorDetails>): string[] => {
    const tags: string[] = []

    if (errorData.filename?.includes('node_modules')) tags.push('third-party')
    if (errorData.message?.includes('network')) tags.push('network')
    if (errorData.message?.includes('timeout')) tags.push('timeout')
    if (errorData.type === 'resource') tags.push('resource-loading')

    return tags
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-50 border-red-200'
      case 'high': return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-700 bg-blue-50 border-blue-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'javascript': return <Code className="h-4 w-4" />
      case 'promise': return <Bug className="h-4 w-4" />
      case 'resource': return <Download className="h-4 w-4" />
      case 'network': return <Network className="h-4 w-4" />
      case 'performance': return <TrendingUp className="h-4 w-4" />
      case 'security': return <AlertTriangle className="h-4 w-4" />
      default: return <Bug className="h-4 w-4" />
    }
  }

  const filteredErrors = errors.filter(error => {
    const matchesType = filterType === 'all' || error.type === filterType
    const matchesSeverity = filterSeverity === 'all' || error.severity === filterSeverity
    const matchesSearch = !searchTerm ||
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.filename?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSeverity && matchesSearch
  })

  const markAsResolved = (errorId: string) => {
    setErrors(prev => prev.map(error =>
      error.id === errorId ? { ...error, resolved: true } : error
    ))
  }

  const clearAllErrors = () => {
    setErrors([])
    setNetworkErrors([])
    setPerformanceIssues([])
    errorCounts.current.clear()
  }

  const exportErrors = () => {
    const dataStr = JSON.stringify({ errors, networkErrors, performanceIssues }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `error-report-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Initialize tracking
  useEffect(() => {
    const cleanup = initializeErrorTracking()
    return cleanup
  }, [initializeErrorTracking])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-600" />
                Error Monitoring Dashboard
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive error tracking and performance monitoring
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportErrors}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllErrors}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                {isMonitoring ? 'Monitoring' : 'Paused'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.last24h}</div>
              <div className="text-sm text-gray-600">Last 24 Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolvedCount}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.errorRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="errors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="errors">JavaScript Errors</TabsTrigger>
          <TabsTrigger value="network">Network Issues</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* JavaScript Errors Tab */}
        <TabsContent value="errors" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="all">All Types</option>
                    <option value="javascript">JavaScript</option>
                    <option value="promise">Promise</option>
                    <option value="resource">Resource</option>
                    <option value="network">Network</option>
                    <option value="security">Security</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search errors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  {searchTerm && (
                    <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error List */}
          <div className="space-y-3">
            {filteredErrors.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Bug className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No errors found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredErrors.map((error) => (
                <Card key={error.id} className={error.resolved ? 'opacity-50' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(error.type)}
                          <Badge variant="outline" className={getSeverityColor(error.severity)}>
                            {error.severity}
                          </Badge>
                          <Badge variant="secondary">{error.type}</Badge>
                          {error.count > 1 && (
                            <Badge variant="destructive">{error.count}x</Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(error.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="font-medium mb-1">{error.message}</div>
                        {error.filename && (
                          <div className="text-sm text-gray-600 mb-1">
                            {error.filename}:{error.line}:{error.column}
                          </div>
                        )}
                        {error.stack && (
                          <details className="text-xs text-gray-500 mt-2">
                            <summary className="cursor-pointer">Stack trace</summary>
                            <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                          </details>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!error.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsResolved(error.id)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Network Issues Tab */}
        <TabsContent value="network" className="space-y-6">
          <div className="space-y-3">
            {networkErrors.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Network className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No network issues detected</p>
                </CardContent>
              </Card>
            ) : (
              networkErrors.map((networkError, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Network className="h-4 w-4" />
                          <Badge variant={networkError.status >= 500 ? 'destructive' : 'secondary'}>
                            {networkError.status} {networkError.statusText}
                          </Badge>
                          <Badge variant="outline">{networkError.method}</Badge>
                        </div>
                        <div className="font-medium">{networkError.url}</div>
                        <div className="text-sm text-gray-600">
                          Response time: {networkError.responseTime.toFixed(2)}ms
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(networkError.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="space-y-3">
            {performanceIssues.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No performance issues detected</p>
                </CardContent>
              </Card>
            ) : (
              performanceIssues.map((issue, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <Badge variant={issue.impact === 'high' ? 'destructive' : 'secondary'}>
                            {issue.impact} impact
                          </Badge>
                          <Badge variant="outline">{issue.type.replace('_', ' ')}</Badge>
                        </div>
                        <div className="font-medium">{issue.description}</div>
                        <div className="text-sm text-gray-600">{issue.url}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(issue.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Errors by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(type)}
                        <span className="capitalize">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / stats.total) * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Errors by Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.bySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="capitalize">{severity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / stats.total) * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Error Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topErrors.map((error, index) => (
                  <div key={error.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{error.message}</span>
                    <Badge variant="secondary">{error.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}