'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Progress } from '@/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Alert, AlertDescription } from '@/ui/alert'
import {
  Activity,
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  AlertTriangle,
  Target,
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  FileText
} from 'lucide-react'

// Real-time analytics data types
interface RealTimeMetrics {
  visitors: {
    current: number
    today: number
    peak: number
    trend: 'up' | 'down' | 'stable'
    locations: Array<{ country: string; city: string; count: number }>
    devices: { mobile: number; desktop: number; tablet: number }
    sources: Record<string, number>
  }
  performance: {
    pageLoadTime: number
    serverResponse: number
    domContentLoaded: number
    score: number
    vitals: {
      lcp: number
      fid: number
      cls: number
      ttfb: number
      fcp: number
    }
    alerts: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }>
  }
  business: {
    revenue: { hourly: number; daily: number; target: number }
    conversions: { leads: number; quotes: number; sales: number; rate: number }
    engagement: { pageViews: number; bounceRate: number; avgSession: number }
    products: Array<{ name: string; views: number; conversions: number }>
  }
  errors: {
    count: number
    rate: number
    types: Record<string, number>
    latest: Array<{ message: string; timestamp: number; severity: string }>
  }
  alerts: Array<{
    id: string
    type: 'performance' | 'business' | 'technical' | 'security'
    severity: 'info' | 'warning' | 'error' | 'critical'
    message: string
    timestamp: number
    resolved: boolean
  }>
}

interface VisitorActivity {
  id: string
  timestamp: number
  page: string
  action: string
  location: { country: string; city: string }
  device: string
  source: string
  duration: number
  value?: number
}

interface RealtimeEvent {
  id: string
  type: 'pageview' | 'conversion' | 'error' | 'performance'
  timestamp: number
  data: Record<string, any>
  impact: 'low' | 'medium' | 'high'
}

export function RealTimeAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    visitors: {
      current: 0,
      today: 0,
      peak: 0,
      trend: 'stable',
      locations: [],
      devices: { mobile: 0, desktop: 0, tablet: 0 },
      sources: {}
    },
    performance: {
      pageLoadTime: 0,
      serverResponse: 0,
      domContentLoaded: 0,
      score: 0,
      vitals: { lcp: 0, fid: 0, cls: 0, ttfb: 0, fcp: 0 },
      alerts: []
    },
    business: {
      revenue: { hourly: 0, daily: 0, target: 1000 },
      conversions: { leads: 0, quotes: 0, sales: 0, rate: 0 },
      engagement: { pageViews: 0, bounceRate: 0, avgSession: 0 },
      products: []
    },
    errors: {
      count: 0,
      rate: 0,
      types: {},
      latest: []
    },
    alerts: []
  })

  const [visitorActivity, setVisitorActivity] = useState<VisitorActivity[]>([])
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, _setRefreshInterval] = useState(5000) // 5 seconds

  const websocketRef = useRef<WebSocket | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize real-time connection
  const initializeRealTime = useCallback(() => {
    // For demo, we'll simulate real-time data
    // In production, this would connect to your analytics WebSocket
    setIsConnected(true)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (autoRefresh) {
        updateMetrics()
        updateVisitorActivity()
        updateRealtimeEvents()
        setLastUpdate(new Date())
      }
    }, refreshInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [autoRefresh, refreshInterval])

  // Update metrics with simulated real-time data
  const updateMetrics = () => {
    setMetrics(prev => {
      const currentVisitors = Math.floor(Math.random() * 50) + 10
      const hourlyRevenue = Math.floor(Math.random() * 500) + 100

      return {
        visitors: {
          current: currentVisitors,
          today: prev.visitors.today + Math.floor(Math.random() * 5),
          peak: Math.max(prev.visitors.peak, currentVisitors),
          trend: currentVisitors > prev.visitors.current ? 'up' : currentVisitors < prev.visitors.current ? 'down' : 'stable',
          locations: [
            { country: 'Canada', city: 'Toronto', count: Math.floor(Math.random() * 20) + 10 },
            { country: 'Canada', city: 'Vancouver', count: Math.floor(Math.random() * 15) + 8 },
            { country: 'Canada', city: 'Montreal', count: Math.floor(Math.random() * 12) + 5 },
            { country: 'USA', city: 'New York', count: Math.floor(Math.random() * 8) + 3 }
          ],
          devices: {
            mobile: Math.floor(Math.random() * 60) + 40,
            desktop: Math.floor(Math.random() * 40) + 30,
            tablet: Math.floor(Math.random() * 20) + 10
          },
          sources: {
            'Google': Math.floor(Math.random() * 50) + 30,
            'Direct': Math.floor(Math.random() * 30) + 20,
            'Social': Math.floor(Math.random() * 20) + 10,
            'Referral': Math.floor(Math.random() * 15) + 5
          }
        },
        performance: {
          pageLoadTime: Math.random() * 2000 + 800,
          serverResponse: Math.random() * 500 + 200,
          domContentLoaded: Math.random() * 1500 + 600,
          score: Math.floor(Math.random() * 20) + 80,
          vitals: {
            lcp: Math.random() * 3000 + 1500,
            fid: Math.random() * 200 + 50,
            cls: Math.random() * 0.3 + 0.05,
            ttfb: Math.random() * 800 + 300,
            fcp: Math.random() * 2000 + 1000
          },
          alerts: Math.random() > 0.8 ? [
            { type: 'performance', message: 'Page load time increased by 15%', severity: 'medium' }
          ] : []
        },
        business: {
          revenue: {
            hourly: hourlyRevenue,
            daily: prev.business.revenue.daily + hourlyRevenue,
            target: 5000
          },
          conversions: {
            leads: prev.business.conversions.leads + (Math.random() > 0.7 ? 1 : 0),
            quotes: prev.business.conversions.quotes + (Math.random() > 0.9 ? 1 : 0),
            sales: prev.business.conversions.sales + (Math.random() > 0.95 ? 1 : 0),
            rate: Math.random() * 5 + 2
          },
          engagement: {
            pageViews: prev.business.engagement.pageViews + Math.floor(Math.random() * 10) + 5,
            bounceRate: Math.random() * 20 + 30,
            avgSession: Math.random() * 300 + 180
          },
          products: [
            { name: 'Custom Walk-in Closet', views: Math.floor(Math.random() * 50) + 20, conversions: Math.floor(Math.random() * 5) + 1 },
            { name: 'Reach-in Organization', views: Math.floor(Math.random() * 40) + 15, conversions: Math.floor(Math.random() * 3) + 1 },
            { name: 'Pantry Solutions', views: Math.floor(Math.random() * 30) + 10, conversions: Math.floor(Math.random() * 2) }
          ]
        },
        errors: {
          count: prev.errors.count + (Math.random() > 0.9 ? 1 : 0),
          rate: Math.random() * 0.5,
          types: {
            'JavaScript': Math.floor(Math.random() * 5),
            'Network': Math.floor(Math.random() * 3),
            'Resource': Math.floor(Math.random() * 2)
          },
          latest: Math.random() > 0.8 ? [
            { message: 'Failed to load image resource', timestamp: Date.now(), severity: 'low' }
          ] : prev.errors.latest
        },
        alerts: Math.random() > 0.9 ? [
          ...prev.alerts.slice(0, 4),
          {
            id: `alert-${Date.now()}`,
            type: 'performance',
            severity: 'warning',
            message: 'Core Web Vitals score decreased',
            timestamp: Date.now(),
            resolved: false
          }
        ] : prev.alerts
      }
    })
  }

  // Update visitor activity feed
  const updateVisitorActivity = () => {
    const activities = [
      'Viewed homepage',
      'Browsed product catalog',
      'Requested quote',
      'Downloaded brochure',
      'Started chat',
      'Viewed testimonials',
      'Checked pricing',
      'Contacted sales'
    ]

    const locations = [
      { country: 'Canada', city: 'Toronto' },
      { country: 'Canada', city: 'Vancouver' },
      { country: 'Canada', city: 'Montreal' },
      { country: 'USA', city: 'New York' }
    ]

    const devices = ['Mobile', 'Desktop', 'Tablet']
    const sources = ['Google', 'Direct', 'Social', 'Referral']

    if (Math.random() > 0.3) {
      const newActivity: VisitorActivity = {
        id: `activity-${Date.now()}`,
        timestamp: Date.now(),
        page: `/${['', 'products', 'about', 'contact', 'quote'][Math.floor(Math.random() * 5)]!}`,
        action: activities[Math.floor(Math.random() * activities.length)]!,
        location: locations[Math.floor(Math.random() * locations.length)]!,
        device: devices[Math.floor(Math.random() * devices.length)]!,
        source: sources[Math.floor(Math.random() * sources.length)]!,
        duration: Math.floor(Math.random() * 300) + 30,
        value: Math.random() > 0.8 ? Math.floor(Math.random() * 1000) + 100 : undefined
      }

      setVisitorActivity(prev => [newActivity, ...prev.slice(0, 19)]) // Keep last 20
    }
  }

  // Update real-time events
  const updateRealtimeEvents = () => {
    const eventTypes: RealtimeEvent['type'][] = ['pageview', 'conversion', 'error', 'performance']

    if (Math.random() > 0.4) {
      const newEvent: RealtimeEvent = {
        id: `event-${Date.now()}`,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)]!,
        timestamp: Date.now(),
        data: {
          page: window.location.pathname,
          user_agent: navigator.userAgent.substring(0, 50),
          value: Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0
        },
        impact: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      }

      setRealtimeEvents(prev => [newEvent, ...prev.slice(0, 49)]) // Keep last 50
    }
  }

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount)
  }

  // Format time
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString()
  }

  // Get device icon
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'tablet': return <Tablet className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  // Get event icon
  const getEventIcon = (type: RealtimeEvent['type']) => {
    switch (type) {
      case 'pageview': return <Eye className="h-4 w-4 text-blue-600" />
      case 'conversion': return <Target className="h-4 w-4 text-green-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'performance': return <Zap className="h-4 w-4 text-yellow-600" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  // Dismiss alert
  const dismissAlert = (alertId: string) => {
    setMetrics(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    }))
  }

  // Export data
  const exportData = () => {
    const data = {
      metrics,
      visitorActivity: visitorActivity.slice(0, 100),
      events: realtimeEvents.slice(0, 100),
      exportTime: new Date().toISOString()
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Initialize real-time updates
  useEffect(() => {
    const cleanup = initializeRealTime()
    return cleanup
  }, [initializeRealTime])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Real-Time Analytics Dashboard
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Live performance, business metrics, and visitor activity monitoring
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-gray-600">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Alerts */}
      {metrics.alerts.filter(alert => !alert.resolved).length > 0 && (
        <div className="space-y-2">
          {metrics.alerts.filter(alert => !alert.resolved).map(alert => (
            <Alert key={alert.id} className={`${
              alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
              alert.severity === 'error' ? 'border-red-400 bg-red-50' :
              alert.severity === 'warning' ? 'border-yellow-400 bg-yellow-50' :
              'border-blue-400 bg-blue-50'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <div className="flex-1">
                <AlertDescription>
                  <strong>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert:</strong> {alert.message}
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </Button>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics.visitors.current}</div>
            <div className="flex items-center mt-1">
              {metrics.visitors.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : metrics.visitors.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              ) : (
                <Activity className="h-4 w-4 text-gray-600 mr-1" />
              )}
              <span className="text-sm text-gray-600">
                {metrics.visitors.today} today | Peak: {metrics.visitors.peak}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.performance.score}</div>
            <Progress value={metrics.performance.score} className="mt-2 h-2" />
            <div className="text-sm text-gray-600 mt-1">
              Load: {Math.round(metrics.performance.pageLoadTime)}ms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(metrics.business.revenue.daily)}
            </div>
            <Progress
              value={(metrics.business.revenue.daily / metrics.business.revenue.target) * 100}
              className="mt-2 h-2"
            />
            <div className="text-sm text-gray-600 mt-1">
              Target: {formatCurrency(metrics.business.revenue.target)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {metrics.business.conversions.rate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {metrics.business.conversions.leads} leads | {metrics.business.conversions.quotes} quotes
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="activity">Live Activity</TabsTrigger>
          <TabsTrigger value="visitors">Visitor Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="business">Business Metrics</TabsTrigger>
          <TabsTrigger value="events">Event Stream</TabsTrigger>
        </TabsList>

        {/* Live Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Visitor Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {visitorActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                  ) : (
                    visitorActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(activity.device)}
                          <div>
                            <div className="font-medium text-sm">{activity.action}</div>
                            <div className="text-xs text-gray-600">
                              {activity.location.city}, {activity.location.country} • {activity.source}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{formatTime(activity.timestamp)}</div>
                          {activity.value && (
                            <div className="text-xs font-medium text-green-600">
                              {formatCurrency(activity.value)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.visitors.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{location.city}, {location.country}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(location.count / metrics.visitors.current) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium w-8">{location.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.visitors.devices).map(([device, count]) => (
                    <div key={device} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device)}
                        <span className="capitalize">{device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / Object.values(metrics.visitors.devices).reduce((a, b) => a + b, 0)) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium w-8">{count}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.visitors.sources).map(([source, percentage]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="font-medium">{source}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="w-20 h-2" />
                        <span className="text-sm font-medium w-10">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Visitor Insights Tab */}
        <TabsContent value="visitors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.business.engagement.pageViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {(metrics.business.engagement.pageViews / metrics.visitors.current).toFixed(1)} per visitor
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.business.engagement.bounceRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 mt-1">
                  {metrics.business.engagement.bounceRate < 50 ? 'Good' : 'Needs improvement'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(metrics.business.engagement.avgSession / 60)}m
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {Math.round(metrics.business.engagement.avgSession)}s total
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(metrics.performance.vitals).map(([vital, value]) => (
              <Card key={vital}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 uppercase">
                    {vital}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {vital === 'cls' ? value.toFixed(3) : Math.round(value)}
                    {vital !== 'cls' && 'ms'}
                  </div>
                  <Badge variant={
                    (vital === 'lcp' && value <= 2500) ||
                    (vital === 'fid' && value <= 100) ||
                    (vital === 'cls' && value <= 0.1) ||
                    (vital === 'ttfb' && value <= 600) ||
                    (vital === 'fcp' && value <= 1800) ? 'default' : 'destructive'
                  }>
                    {(vital === 'lcp' && value <= 2500) ||
                     (vital === 'fid' && value <= 100) ||
                     (vital === 'cls' && value <= 0.1) ||
                     (vital === 'ttfb' && value <= 600) ||
                     (vital === 'fcp' && value <= 1800) ? 'Good' : 'Poor'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {metrics.performance.alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics.performance.alerts.map((alert, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{alert.type}:</strong> {alert.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Business Metrics Tab */}
        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{metrics.business.conversions.leads}</div>
                <div className="text-sm text-gray-600 mt-1">Today</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Quotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{metrics.business.conversions.quotes}</div>
                <div className="text-sm text-gray-600 mt-1">Requested</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{metrics.business.conversions.sales}</div>
                <div className="text-sm text-gray-600 mt-1">Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.business.conversions.rate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Overall</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.business.products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{product.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">{product.views} views</div>
                      <Badge variant="secondary">{product.conversions} conversions</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Stream Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-Time Event Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {realtimeEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent events</p>
                ) : (
                  realtimeEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        <div>
                          <div className="font-medium text-sm capitalize">{event.type}</div>
                          <div className="text-xs text-gray-600">
                            {event.data.page || 'Unknown page'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          event.impact === 'high' ? 'destructive' :
                          event.impact === 'medium' ? 'secondary' : 'outline'
                        }>
                          {event.impact}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTime(event.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}