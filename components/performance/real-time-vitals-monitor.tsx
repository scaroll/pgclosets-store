'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Alert, AlertDescription } from '@/ui/alert'
import { Progress } from '@/ui/progress'
import { Switch } from '@/ui/switch'
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Bell,
  BellOff,
  Activity,
  Zap,
  Clock,
  Eye,
  MousePointer,
  Layers,
  Server,
  Gauge
} from 'lucide-react'

// Core Web Vitals Types
interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: Array<{ value: number; timestamp: number }>
  navigationType: string
  threshold: { good: number; poor: number }
  unit: string
  description: string
  impact: string
  optimization: string[]
}

interface PerformanceAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  metric: string
  message: string
  timestamp: number
  threshold: number
  currentValue: number
  recommendation: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface PerformanceConfig {
  alertsEnabled: boolean
  realTimeUpdates: boolean
  performanceBudget: {
    lcp: number
    fid: number
    cls: number
    ttfb: number
    fcp: number
  }
  alertThresholds: {
    lcp: number
    fid: number
    cls: number
    ttfb: number
    fcp: number
  }
}

export function RealTimeVitalsMonitor() {
  const [vitals, setVitals] = useState<Record<string, WebVitalMetric>>({})
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [config, setConfig] = useState<PerformanceConfig>({
    alertsEnabled: true,
    realTimeUpdates: true,
    performanceBudget: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      ttfb: 600,
      fcp: 1800
    },
    alertThresholds: {
      lcp: 4000,
      fid: 300,
      cls: 0.25,
      ttfb: 1500,
      fcp: 3000
    }
  })

  const observersRef = useRef<Map<string, PerformanceObserver>>(new Map())
  const lastAlertTime = useRef<Map<string, number>>(new Map())

  // Initialize Web Vitals monitoring
  const initializeMonitoring = useCallback(() => {
    if (typeof window === 'undefined' || !config.realTimeUpdates) return

    // Clear existing observers
    observersRef.current.forEach(observer => observer.disconnect())
    observersRef.current.clear()

    // LCP (Largest Contentful Paint) Observer
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lcp = entries[entries.length - 1]
      if (lcp) {
        updateVital('LCP', {
          name: 'LCP',
          value: lcp.startTime,
          rating: lcp.startTime <= 2500 ? 'good' : lcp.startTime <= 4000 ? 'needs-improvement' : 'poor',
          delta: 0,
          entries: [],
          navigationType: getNavigationType(),
          threshold: { good: 2500, poor: 4000 },
          unit: 'ms',
          description: 'Largest Contentful Paint - measures loading performance',
          impact: 'Critical for user perception of page load speed',
          optimization: [
            'Optimize images and use next-gen formats',
            'Implement lazy loading for non-critical resources',
            'Use CDN for faster content delivery',
            'Minimize render-blocking resources'
          ]
        })
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    observersRef.current.set('lcp', lcpObserver)

    // FID (First Input Delay) Observer
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming
        if (fidEntry.processingStart) {
          const fid = fidEntry.processingStart - fidEntry.startTime
          updateVital('FID', {
            name: 'FID',
            value: fid,
            rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
            delta: 0,
            entries: [],
            navigationType: getNavigationType(),
            threshold: { good: 100, poor: 300 },
            unit: 'ms',
            description: 'First Input Delay - measures interactivity',
            impact: 'Directly affects user experience during interaction',
            optimization: [
              'Reduce JavaScript execution time',
              'Code split large bundles',
              'Use web workers for heavy computations',
              'Optimize third-party scripts'
            ]
          })
        }
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
    observersRef.current.set('fid', fidObserver)

    // CLS (Cumulative Layout Shift) Observer
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        const clsEntry = entry as LayoutShift
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
        }
      })
      updateVital('CLS', {
        name: 'CLS',
        value: clsValue,
        rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
        delta: 0,
        entries: [],
        navigationType: getNavigationType(),
        threshold: { good: 0.1, poor: 0.25 },
        unit: '',
        description: 'Cumulative Layout Shift - measures visual stability',
        impact: 'Prevents unexpected layout shifts that disrupt user experience',
        optimization: [
          'Always include size attributes on images and videos',
          'Reserve space for ad slots and dynamic content',
          'Avoid inserting content above existing content',
          'Use CSS aspect-ratio for responsive images'
        ]
      })
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
    observersRef.current.set('cls', clsObserver)

    // TTFB (Time to First Byte)
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navEntry) {
      const ttfb = navEntry.responseStart - navEntry.requestStart
      updateVital('TTFB', {
        name: 'TTFB',
        value: ttfb,
        rating: ttfb <= 600 ? 'good' : ttfb <= 1500 ? 'needs-improvement' : 'poor',
        delta: 0,
        entries: [],
        navigationType: getNavigationType(),
        threshold: { good: 600, poor: 1500 },
        unit: 'ms',
        description: 'Time to First Byte - measures server response time',
        impact: 'Foundation for all subsequent loading metrics',
        optimization: [
          'Optimize server response time',
          'Use CDN for static assets',
          'Implement proper caching strategies',
          'Optimize database queries'
        ]
      })

      // FCP (First Contentful Paint)
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        updateVital('FCP', {
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: fcpEntry.startTime <= 1800 ? 'good' : fcpEntry.startTime <= 3000 ? 'needs-improvement' : 'poor',
          delta: 0,
          entries: [],
          navigationType: getNavigationType(),
          threshold: { good: 1800, poor: 3000 },
          unit: 'ms',
          description: 'First Contentful Paint - measures when first content is rendered',
          impact: 'First visual feedback to the user that the page is loading',
          optimization: [
            'Optimize critical rendering path',
            'Minimize render-blocking CSS and JavaScript',
            'Use preload for critical resources',
            'Optimize web fonts loading'
          ]
        })
      }
    }
  }, [config.realTimeUpdates])

  // Update vital and check for alerts
  const updateVital = useCallback((name: string, vital: WebVitalMetric) => {
    setVitals(prev => {
      const prevVital = prev[name]
      const delta = prevVital ? vital.value - prevVital.value : 0

      const updatedVital = {
        ...vital,
        delta,
        entries: [...(prevVital?.entries || []), { value: vital.value, timestamp: Date.now() }].slice(-10)
      }

      // Check for performance alerts
      if (config.alertsEnabled) {
        checkPerformanceThresholds(updatedVital)
      }

      return { ...prev, [name]: updatedVital }
    })
  }, [config.alertsEnabled])

  // Check performance thresholds and generate alerts
  const checkPerformanceThresholds = useCallback((vital: WebVitalMetric) => {
    const thresholdKey = vital.name.toLowerCase() as keyof typeof config.alertThresholds
    const threshold = config.alertThresholds[thresholdKey]
    const budgetKey = vital.name.toLowerCase() as keyof typeof config.performanceBudget
    const budget = config.performanceBudget[budgetKey]

    // Prevent spam alerts - only alert once per minute for the same metric
    const lastAlert = lastAlertTime.current.get(vital.name) || 0
    const now = Date.now()
    if (now - lastAlert < 60000) return

    let alertSeverity: PerformanceAlert['severity'] = 'low'
    let alertType: PerformanceAlert['type'] = 'info'
    let message = ''
    let recommendation = ''

    if (vital.value > threshold) {
      alertSeverity = 'critical'
      alertType = 'error'
      message = `${vital.name} is critically poor (${formatValue(vital.value, vital.unit)} > ${formatValue(threshold, vital.unit)})`
      recommendation = `Immediate optimization required. ${vital.optimization[0]}`
    } else if (vital.value > budget) {
      alertSeverity = vital.rating === 'poor' ? 'high' : 'medium'
      alertType = 'warning'
      message = `${vital.name} exceeds performance budget (${formatValue(vital.value, vital.unit)} > ${formatValue(budget, vital.unit)})`
      recommendation = `Consider optimization: ${vital.optimization[0]}`
    } else if (vital.rating === 'needs-improvement') {
      alertSeverity = 'low'
      alertType = 'warning'
      message = `${vital.name} needs improvement (${formatValue(vital.value, vital.unit)})`
      recommendation = vital.optimization[0]
    }

    if (message) {
      const alert: PerformanceAlert = {
        id: `${vital.name}-${now}`,
        type: alertType,
        metric: vital.name,
        message,
        timestamp: now,
        threshold,
        currentValue: vital.value,
        recommendation,
        severity: alertSeverity
      }

      setAlerts(prev => [alert, ...prev.slice(0, 9)]) // Keep only last 10 alerts
      lastAlertTime.current.set(vital.name, now)

      // Browser notification for critical alerts
      if (alertSeverity === 'critical' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Performance Alert - PG Closets', {
          body: message,
          icon: '/favicon.ico',
          tag: vital.name
        })
      }
    }
  }, [config.alertThresholds, config.performanceBudget])

  // Helper functions
  const getNavigationType = (): string => {
    if (typeof window === 'undefined') return 'unknown'
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return navEntry?.type || 'unknown'
  }

  const formatValue = (value: number, unit: string): string => {
    if (unit === 'ms') return `${Math.round(value)}ms`
    if (unit === '') return value.toFixed(3)
    return `${Math.round(value)}${unit}`
  }

  const getVitalColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'poor': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getVitalIcon = (name: string) => {
    switch (name) {
      case 'LCP': return <Eye className="h-4 w-4" />
      case 'FID': return <MousePointer className="h-4 w-4" />
      case 'CLS': return <Layers className="h-4 w-4" />
      case 'TTFB': return <Server className="h-4 w-4" />
      case 'FCP': return <Activity className="h-4 w-4" />
      default: return <Gauge className="h-4 w-4" />
    }
  }

  const getAlertIcon = (type: PerformanceAlert['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const calculateOverallScore = (): number => {
    const vitalValues = Object.values(vitals)
    if (vitalValues.length === 0) return 0

    const score = vitalValues.reduce((acc, vital) => {
      return acc + (vital.rating === 'good' ? 100 : vital.rating === 'needs-improvement' ? 75 : 50)
    }, 0) / vitalValues.length

    return Math.round(score)
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  // Initialize monitoring
  useEffect(() => {
    if (isMonitoring) {
      initializeMonitoring()
      requestNotificationPermission()
    } else {
      observersRef.current.forEach(observer => observer.disconnect())
      observersRef.current.clear()
    }

    return () => {
      observersRef.current.forEach(observer => observer.disconnect())
      observersRef.current.clear()
    }
  }, [isMonitoring, initializeMonitoring])

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Real-time Performance Monitor
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Live Core Web Vitals monitoring with instant alerts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.alertsEnabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, alertsEnabled: checked }))}
                />
                <label className="text-sm font-medium flex items-center gap-1">
                  {config.alertsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  Alerts
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isMonitoring}
                  onCheckedChange={setIsMonitoring}
                />
                <label className="text-sm font-medium flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Live Monitor
                </label>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-blue-600">{calculateOverallScore()}</div>
            <div className="flex-1">
              <Progress value={calculateOverallScore()} className="h-3" />
              <p className="text-sm text-gray-600 mt-1">
                Overall Performance Score
              </p>
            </div>
            <Badge variant={calculateOverallScore() >= 90 ? 'default' : calculateOverallScore() >= 75 ? 'secondary' : 'destructive'}>
              {calculateOverallScore() >= 90 ? 'Excellent' : calculateOverallScore() >= 75 ? 'Good' : 'Needs Work'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Performance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={`${alert.type === 'error' ? 'border-red-200 bg-red-50' : alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div>
                      <AlertDescription className="font-medium">
                        {alert.message}
                      </AlertDescription>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Recommendation:</strong> {alert.recommendation}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </Button>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals - Live Monitoring</CardTitle>
          <p className="text-sm text-gray-600">Real-time performance metrics with trend analysis</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Object.values(vitals).map((vital) => (
              <div
                key={vital.name}
                className={`p-4 rounded-lg border ${getVitalColor(vital.rating)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{vital.name}</h3>
                  {getVitalIcon(vital.name)}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatValue(vital.value, vital.unit)}
                </div>
                {vital.delta !== 0 && (
                  <div className={`flex items-center text-xs mb-2 ${vital.delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {vital.delta > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(vital.delta).toFixed(vital.unit === '' ? 3 : 0)}{vital.unit}
                  </div>
                )}
                <div className="text-xs opacity-75 mb-2">{vital.description}</div>
                <div className="text-xs">
                  <strong>Budget:</strong> {formatValue(config.performanceBudget[vital.name.toLowerCase() as keyof typeof config.performanceBudget], vital.unit)}
                </div>
                <Progress
                  value={Math.min((vital.value / vital.threshold.poor) * 100, 100)}
                  className="h-2 mt-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      {Object.keys(vitals).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(vitals)
                .filter(vital => vital.rating !== 'good')
                .map((vital) => (
                  <div key={vital.name} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getVitalIcon(vital.name)}
                      <h4 className="font-semibold">{vital.name} - {vital.description}</h4>
                      <Badge variant={vital.rating === 'poor' ? 'destructive' : 'secondary'}>
                        {vital.rating.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{vital.impact}</p>
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Optimization strategies:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {vital.optimization.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}