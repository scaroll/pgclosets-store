'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Gauge,
  Monitor,
  Smartphone
} from 'lucide-react'

interface WebVitalsData {
  LCP: { avg: number; p75: number; count: number; status: 'good' | 'needs-improvement' | 'poor' }
  FID: { avg: number; p75: number; count: number; status: 'good' | 'needs-improvement' | 'poor' }
  CLS: { avg: number; p75: number; count: number; status: 'good' | 'needs-improvement' | 'poor' }
  FCP: { avg: number; p75: number; count: number; status: 'good' | 'needs-improvement' | 'poor' }
  TTFB: { avg: number; p75: number; count: number; status: 'good' | 'needs-improvement' | 'poor' }
}

interface PerformanceMetrics {
  overallScore: number
  mobileScore: number
  desktopScore: number
  lastUpdated: string
  period: string
  data: WebVitalsData
}

const thresholds = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 }
}

/**
 * Advanced Performance Dashboard for monitoring Core Web Vitals and SEO metrics
 */
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    fetchMetrics()
  }, [selectedPeriod])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh, selectedPeriod])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/web-vitals?period=${selectedPeriod}`)
      const data = await response.json()

      if (data.success) {
        const processedMetrics = processMetricsData(data.data)
        setMetrics(processedMetrics)
      }
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const processMetricsData = (data: any): PerformanceMetrics => {
    const processed = {
      overallScore: 0,
      mobileScore: 0,
      desktopScore: 0,
      lastUpdated: new Date().toISOString(),
      period: selectedPeriod,
      data: {
        LCP: { ...data.LCP, status: getMetricStatus(data.LCP?.avg || 0, 'LCP') },
        FID: { ...data.FID, status: getMetricStatus(data.FID?.avg || 0, 'FID') },
        CLS: { ...data.CLS, status: getMetricStatus(data.CLS?.avg || 0, 'CLS') },
        FCP: { ...data.FCP, status: getMetricStatus(data.FCP?.avg || 0, 'FCP') },
        TTFB: { ...data.TTFB, status: getMetricStatus(data.TTFB?.avg || 0, 'TTFB') }
      }
    }

    // Calculate overall score based on individual metrics
    const scores = Object.values(processed.data).map(metric => {
      const status = metric.status
      return status === 'good' ? 100 : status === 'needs-improvement' ? 70 : 40
    })

    processed.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

    return processed
  }

  const getMetricStatus = (value: number, metric: keyof typeof thresholds): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = thresholds[metric]
    if (value <= threshold.good) return 'good'
    if (value <= threshold.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50'
      case 'poor': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4" />
      case 'needs-improvement': return <AlertTriangle className="w-4 h-4" />
      case 'poor': return <AlertTriangle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const formatMetricValue = (metric: string, value: number) => {
    switch (metric) {
      case 'LCP':
      case 'FCP':
      case 'TTFB':
        return `${(value / 1000).toFixed(2)}s`
      case 'FID':
        return `${Math.round(value)}ms`
      case 'CLS':
        return value.toFixed(3)
      default:
        return value.toString()
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-gray-600">Monitor Core Web Vitals and SEO performance</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="w-4 h-4 mr-2" />
            Auto Refresh
          </Button>
          <Button onClick={fetchMetrics}>
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Overall Performance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                  {metrics.overallScore}
                </div>
                <div className="flex-1">
                  <Progress value={metrics.overallScore} className="h-2" />
                  <p className="text-sm text-gray-600 mt-1">
                    {metrics.overallScore >= 90 ? 'Excellent' :
                     metrics.overallScore >= 70 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Mobile Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${getScoreColor(metrics.mobileScore)}`}>
                  {metrics.mobileScore || '--'}
                </div>
                <div className="flex-1">
                  <Progress value={metrics.mobileScore || 0} className="h-2" />
                  <p className="text-sm text-gray-600 mt-1">Mobile optimization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Desktop Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${getScoreColor(metrics.desktopScore)}`}>
                  {metrics.desktopScore || '--'}
                </div>
                <div className="flex-1">
                  <Progress value={metrics.desktopScore || 0} className="h-2" />
                  <p className="text-sm text-gray-600 mt-1">Desktop optimization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Core Web Vitals */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Core Web Vitals
            </CardTitle>
            <CardDescription>
              Real user performance metrics for {selectedPeriod}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(metrics.data).map(([metric, data]) => (
                <div key={metric} className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold">{metric}</h3>
                    <Badge className={getStatusColor(data.status)}>
                      {getStatusIcon(data.status)}
                      <span className="ml-1">{data.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {formatMetricValue(metric, data.avg)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    p75: {formatMetricValue(metric, data.p75)}
                  </p>
                  <div className="text-xs text-gray-500">
                    {data.count.toLocaleString()} samples
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics && Object.entries(metrics.data).map(([metric, data]) => {
              if (data.status === 'good') return null

              const threshold = thresholds[metric as keyof typeof thresholds]
              const recommendations = getRecommendations(metric, data.avg, threshold)

              return (
                <div key={metric} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800">{metric} Needs Improvement</h4>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Current: {formatMetricValue(metric, data.avg)} (Target: {formatMetricValue(metric, threshold.good)})
                  </p>
                  <ul className="text-sm text-yellow-600 space-y-1">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}

            {metrics && Object.values(metrics.data).every(data => data.status === 'good') && (
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Excellent Performance!</h4>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  All Core Web Vitals are within recommended thresholds. Keep monitoring to maintain performance.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getRecommendations(metric: string, value: number, threshold: { good: number; needsImprovement: number }): string[] {
  switch (metric) {
    case 'LCP':
      return [
        'Optimize largest contentful image with WebP/AVIF format',
        'Preload critical images and fonts',
        'Implement resource hints (preconnect, prefetch)',
        'Improve server response time (TTFB)',
        'Use CDN for static assets'
      ]
    case 'FID':
      return [
        'Minimize JavaScript execution time',
        'Code-split third-party scripts',
        'Remove unused JavaScript and CSS',
        'Optimize interaction readiness',
        'Reduce main thread work'
      ]
    case 'CLS':
      return [
        'Always include dimensions for images and videos',
        'Reserve space for dynamic content and ads',
        'Avoid inserting content above existing content',
        'Use CSS aspect-ratio for media elements',
        'Ensure fonts don\'t cause layout shifts'
      ]
    case 'FCP':
      return [
        'Reduce server response time (TTFB)',
        'Optimize CSS delivery',
        'Eliminate render-blocking resources',
        'Preload critical resources',
        'Minimize critical path depth'
      ]
    case 'TTFB':
      return [
        'Improve server performance',
        'Use CDN for faster content delivery',
        'Enable HTTP/2 or HTTP/3',
        'Optimize database queries',
        'Implement edge caching'
      ]
    default:
      return ['Consult performance optimization documentation']
  }
}

export default PerformanceDashboard