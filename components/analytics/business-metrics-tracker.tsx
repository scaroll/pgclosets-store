'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Progress } from '@/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Phone,
  Mail,
  FileText,
  Calendar,
  Target,
  BarChart3,
  Activity
} from 'lucide-react'

// Business Metrics Types
interface ConversionFunnelStep {
  name: string
  visitors: number
  percentage: number
  dropOff: number
  averageTime: number
  conversionRate: number
}

interface BusinessMetrics {
  revenue: {
    total: number
    daily: number
    weekly: number
    monthly: number
    target: number
    currency: string
    trend: 'up' | 'down' | 'stable'
    percentageChange: number
  }
  visitors: {
    total: number
    unique: number
    returning: number
    bounceRate: number
    averageSessionDuration: number
    pageViews: number
    pageviewsPerSession: number
  }
  conversions: {
    leads: number
    quotes: number
    sales: number
    conversionRate: number
    leadConversionRate: number
    averageOrderValue: number
    customerLifetimeValue: number
  }
  engagement: {
    emailSignups: number
    phoneClicks: number
    brochureDownloads: number
    virtualConsultations: number
    blogEngagement: number
    socialShares: number
  }
  products: {
    mostViewed: Array<{ name: string; views: number; conversions: number }>
    topPerforming: Array<{ name: string; revenue: number; margin: number }>
    categoryPerformance: Record<string, { views: number; conversions: number; revenue: number }>
  }
  geography: {
    topCities: Array<{ city: string; visitors: number; conversions: number }>
    topProvinces: Array<{ province: string; visitors: number; revenue: number }>
  }
  timing: {
    peakHours: Array<{ hour: number; visitors: number; conversions: number }>
    peakDays: Array<{ day: string; visitors: number; conversions: number }>
    seasonalTrends: Record<string, number>
  }
}

interface FunnelData {
  landing: ConversionFunnelStep
  productView: ConversionFunnelStep
  engagement: ConversionFunnelStep
  leadCapture: ConversionFunnelStep
  quote: ConversionFunnelStep
  consultation: ConversionFunnelStep
  proposal: ConversionFunnelStep
  conversion: ConversionFunnelStep
}

interface CustomerJourney {
  stage: string
  touchpoints: Array<{
    name: string
    timestamp: number
    value?: number
    metadata?: Record<string, any>
  }>
  totalTime: number
  conversionProbability: number
}

export function BusinessMetricsTracker() {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    revenue: {
      total: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      target: 100000,
      currency: 'CAD',
      trend: 'stable',
      percentageChange: 0
    },
    visitors: {
      total: 0,
      unique: 0,
      returning: 0,
      bounceRate: 0,
      averageSessionDuration: 0,
      pageViews: 0,
      pageviewsPerSession: 0
    },
    conversions: {
      leads: 0,
      quotes: 0,
      sales: 0,
      conversionRate: 0,
      leadConversionRate: 0,
      averageOrderValue: 0,
      customerLifetimeValue: 0
    },
    engagement: {
      emailSignups: 0,
      phoneClicks: 0,
      brochureDownloads: 0,
      virtualConsultations: 0,
      blogEngagement: 0,
      socialShares: 0
    },
    products: {
      mostViewed: [],
      topPerforming: [],
      categoryPerformance: {}
    },
    geography: {
      topCities: [],
      topProvinces: []
    },
    timing: {
      peakHours: [],
      peakDays: [],
      seasonalTrends: {}
    }
  })

  const [funnelData, setFunnelData] = useState<FunnelData>({
    landing: { name: 'Landing Page', visitors: 1000, percentage: 100, dropOff: 0, averageTime: 45, conversionRate: 100 },
    productView: { name: 'Product View', visitors: 650, percentage: 65, dropOff: 35, averageTime: 120, conversionRate: 65 },
    engagement: { name: 'Engagement', visitors: 420, percentage: 42, dropOff: 23, averageTime: 180, conversionRate: 42 },
    leadCapture: { name: 'Lead Capture', visitors: 280, percentage: 28, dropOff: 14, averageTime: 90, conversionRate: 28 },
    quote: { name: 'Quote Request', visitors: 180, percentage: 18, dropOff: 10, averageTime: 300, conversionRate: 18 },
    consultation: { name: 'Consultation', visitors: 120, percentage: 12, dropOff: 6, averageTime: 600, conversionRate: 12 },
    proposal: { name: 'Proposal', visitors: 80, percentage: 8, dropOff: 4, averageTime: 900, conversionRate: 8 },
    conversion: { name: 'Sale', visitors: 50, percentage: 5, dropOff: 3, averageTime: 1200, conversionRate: 5 }
  })

  const [customerJourneys, setCustomerJourneys] = useState<CustomerJourney[]>([])
  const [isTracking, setIsTracking] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d')

  const sessionData = useRef({
    startTime: Date.now(),
    pageViews: 0,
    interactions: 0,
    leadCaptured: false,
    quotesRequested: 0
  })

  // Initialize business metrics tracking
  const initializeTracking = useCallback(() => {
    if (typeof window === 'undefined' || !isTracking) return

    // Track page views and session data
    trackPageView()

    // Set up interaction tracking
    setupInteractionTracking()

    // Set up form submission tracking
    setupFormTracking()

    // Set up engagement tracking
    setupEngagementTracking()

    // Set up e-commerce tracking
    setupEcommerceTracking()

    // Fetch and update metrics periodically
    const interval = setInterval(updateMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isTracking])

  // Track page view with enhanced business context
  const trackPageView = () => {
    sessionData.current.pageViews++

    const pageType = getPageType(window.location.pathname)
    const contentGroup = getContentGroup(window.location.pathname)

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        content_group1: contentGroup,
        content_group2: pageType,
        page_view_count: sessionData.current.pageViews,
        session_engagement: calculateSessionEngagement()
      })
    }

    // Track funnel progression
    updateFunnelProgress(pageType)
  }

  // Set up comprehensive interaction tracking
  const setupInteractionTracking = () => {
    // Click tracking with business context
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      const button = target.closest('button')

      if (link || button) {
        const element = link || button
        const text = element?.textContent?.trim().toLowerCase() || ''
        const href = link?.href || ''
        const classes = element?.className || ''

        // Track specific business interactions
        if (text.includes('quote') || text.includes('estimate')) {
          trackBusinessEvent('quote_interest', { source: 'button_click', text, url: href })
        } else if (text.includes('contact') || text.includes('call')) {
          trackBusinessEvent('contact_interest', { source: 'button_click', text, url: href })
        } else if (text.includes('brochure') || text.includes('download')) {
          trackBusinessEvent('brochure_interest', { source: 'button_click', text, url: href })
        } else if (href.includes('mailto:')) {
          trackBusinessEvent('email_click', { email: href.replace('mailto:', ''), source: 'click' })
        }

        sessionData.current.interactions++
      }
    })

    // Scroll depth tracking for engagement
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth

        if (scrollDepth >= 75) {
          trackBusinessEvent('high_engagement', { scroll_depth: scrollDepth, page: window.location.pathname })
        }
      }
    }

    window.addEventListener('scroll', trackScrollDepth, { passive: true })

    // Time on page tracking
    const startTime = Date.now()
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime
      if (timeOnPage > 120000) { // More than 2 minutes
        trackBusinessEvent('engaged_visitor', { time_on_page: timeOnPage, page: window.location.pathname })
      }
    })
  }

  // Set up form tracking for lead capture
  const setupFormTracking = () => {
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      if (!form) return

      const formType = getFormType(form)
      const formData = new FormData(form)
      const fields = Array.from(formData.keys())

      // Track lead capture
      if (formType === 'lead_capture' || formType === 'contact') {
        sessionData.current.leadCaptured = true
        trackBusinessEvent('lead_captured', {
          form_type: formType,
          fields,
          source: window.location.pathname,
          session_pageviews: sessionData.current.pageViews,
          session_time: Date.now() - sessionData.current.startTime
        })
      }

      // Track quote requests
      if (formType === 'quote_request') {
        sessionData.current.quotesRequested++
        trackBusinessEvent('quote_requested', {
          form_type: formType,
          quote_number: sessionData.current.quotesRequested,
          source: window.location.pathname
        })
      }

      // Track newsletter signups
      if (formType === 'newsletter') {
        trackBusinessEvent('newsletter_signup', {
          source: window.location.pathname
        })
      }
    })
  }

  // Set up engagement tracking
  const setupEngagementTracking = () => {
    // Video engagement
    document.addEventListener('play', (event) => {
      const video = event.target as HTMLVideoElement
      if (video.tagName === 'VIDEO') {
        trackBusinessEvent('video_engagement', {
          video_source: video.src,
          page: window.location.pathname
        })
      }
    })

    // PDF/brochure downloads
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href.match(/\.(pdf|doc|docx)$/i)) {
        trackBusinessEvent('document_download', {
          document_url: link.href,
          document_type: link.href.split('.').pop(),
          page: window.location.pathname
        })
      }
    })

    // Virtual consultation scheduling
    const consultationButtons = document.querySelectorAll('[data-consultation], [data-virtual-meeting]')
    consultationButtons.forEach(button => {
      button.addEventListener('click', () => {
        trackBusinessEvent('consultation_interest', {
          button_text: button.textContent?.trim(),
          page: window.location.pathname
        })
      })
    })
  }

  // Set up e-commerce tracking
  const setupEcommerceTracking = () => {
    // Product view tracking
    const productElements = document.querySelectorAll('[data-product-id]')

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const productId = element.dataset.productId
            const productName = element.dataset.productName
            const productCategory = element.dataset.productCategory
            const productPrice = element.dataset.productPrice

            trackBusinessEvent('product_view', {
              product_id: productId,
              product_name: productName,
              product_category: productCategory,
              product_price: productPrice,
              page: window.location.pathname
            })

            observer.unobserve(element)
          }
        })
      }, { threshold: 0.5 })

      productElements.forEach(element => observer.observe(element))
    }

    // Cart interactions
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const button = target.closest('button')

      if (button) {
        const text = button.textContent?.toLowerCase() || ''

        if (text.includes('add to cart') || text.includes('add to wishlist')) {
          trackBusinessEvent('add_to_cart_interest', {
            button_text: button.textContent?.trim(),
            page: window.location.pathname
          })
        }
      }
    })
  }

  // Track business events
  const trackBusinessEvent = (eventName: string, eventData: Record<string, any>) => {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'Business Metrics',
        event_label: eventData.source || window.location.pathname,
        ...eventData,
        timestamp: new Date().toISOString()
      })
    }

    // Update local metrics based on event
    updateLocalMetrics(eventName, eventData)

    // Update customer journey
    updateCustomerJourney(eventName, eventData)
  }

  // Update local metrics
  const updateLocalMetrics = (eventName: string, eventData: Record<string, any>) => {
    setMetrics(prev => {
      const updated = { ...prev }

      switch (eventName) {
        case 'lead_captured':
          updated.conversions.leads++
          break
        case 'quote_requested':
          updated.conversions.quotes++
          break
        case 'phone_click':
          updated.engagement.phoneClicks++
          break
        case 'email_click':
        case 'newsletter_signup':
          updated.engagement.emailSignups++
          break
        case 'document_download':
          updated.engagement.brochureDownloads++
          break
        case 'consultation_interest':
          updated.engagement.virtualConsultations++
          break
        case 'product_view':
          // Update product views
          const productName = eventData.product_name || 'Unknown Product'
          const existing = updated.products.mostViewed.find(p => p.name === productName)
          if (existing) {
            existing.views++
          } else {
            updated.products.mostViewed.push({ name: productName, views: 1, conversions: 0 })
          }
          break
      }

      return updated
    })
  }

  // Update customer journey
  const updateCustomerJourney = (eventName: string, eventData: Record<string, any>) => {
    const stage = getJourneyStage(eventName)
    const touchpoint = {
      name: eventName,
      timestamp: Date.now(),
      value: eventData.value || 0,
      metadata: eventData
    }

    setCustomerJourneys(prev => {
      const existing = prev.find(journey => journey.stage === stage)
      if (existing) {
        existing.touchpoints.push(touchpoint)
        existing.totalTime = Date.now() - existing.touchpoints[0].timestamp
        existing.conversionProbability = calculateConversionProbability(existing.touchpoints)
        return [...prev]
      } else {
        return [...prev, {
          stage,
          touchpoints: [touchpoint],
          totalTime: 0,
          conversionProbability: 0.1
        }]
      }
    })
  }

  // Update funnel progress
  const updateFunnelProgress = (pageType: string) => {
    setFunnelData(prev => {
      const updated = { ...prev }

      switch (pageType) {
        case 'landing':
          updated.landing.visitors++
          break
        case 'product':
          updated.productView.visitors++
          break
        case 'contact':
          updated.leadCapture.visitors++
          break
        case 'quote':
          updated.quote.visitors++
          break
      }

      // Recalculate percentages
      const total = updated.landing.visitors
      Object.keys(updated).forEach(key => {
        const step = updated[key as keyof FunnelData]
        step.percentage = (step.visitors / total) * 100
        step.conversionRate = step.percentage
      })

      return updated
    })
  }

  // Fetch and update metrics from analytics API
  const updateMetrics = async () => {
    try {
      // This would integrate with your analytics API
      // For now, we'll simulate with some realistic data
      setMetrics(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          daily: Math.floor(Math.random() * 5000) + 2000,
          weekly: Math.floor(Math.random() * 35000) + 15000,
          monthly: Math.floor(Math.random() * 150000) + 75000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          percentageChange: (Math.random() * 20) - 10
        },
        visitors: {
          ...prev.visitors,
          total: Math.floor(Math.random() * 1000) + 500,
          unique: Math.floor(Math.random() * 800) + 400,
          bounceRate: Math.random() * 30 + 35,
          averageSessionDuration: Math.random() * 300 + 120
        }
      }))
    } catch (error) {
      console.error('Failed to update metrics:', error)
    }
  }

  // Helper functions
  const getPageType = (pathname: string): string => {
    if (pathname === '/') return 'landing'
    if (pathname.includes('/products/')) return 'product'
    if (pathname.includes('/contact')) return 'contact'
    if (pathname.includes('/quote')) return 'quote'
    if (pathname.includes('/about')) return 'about'
    return 'other'
  }

  const getContentGroup = (pathname: string): string => {
    if (pathname.includes('/products/')) return 'Product Pages'
    if (pathname.includes('/admin/')) return 'Admin'
    if (pathname.includes('/contact')) return 'Contact'
    if (pathname === '/') return 'Homepage'
    return 'Other'
  }

  const getFormType = (form: HTMLFormElement): string => {
    const action = form.action.toLowerCase()
    const id = form.id?.toLowerCase() || ''
    const classes = form.className?.toLowerCase() || ''

    if (action.includes('contact') || id.includes('contact') || classes.includes('contact')) {
      return 'contact'
    }
    if (action.includes('quote') || id.includes('quote') || classes.includes('quote')) {
      return 'quote_request'
    }
    if (action.includes('newsletter') || id.includes('newsletter') || classes.includes('newsletter')) {
      return 'newsletter'
    }
    return 'lead_capture'
  }

  const getJourneyStage = (eventName: string): string => {
    if (eventName.includes('view') || eventName.includes('landing')) return 'awareness'
    if (eventName.includes('engagement') || eventName.includes('scroll')) return 'interest'
    if (eventName.includes('contact') || eventName.includes('lead')) return 'consideration'
    if (eventName.includes('quote') || eventName.includes('consultation')) return 'intent'
    if (eventName.includes('purchase') || eventName.includes('sale')) return 'purchase'
    return 'other'
  }

  const calculateSessionEngagement = (): number => {
    const timeOnSite = Date.now() - sessionData.current.startTime
    const baseScore = Math.min(timeOnSite / 60000, 10) // 10 points max for time (10 minutes)
    const pageViewScore = Math.min(sessionData.current.pageViews * 2, 10) // 2 points per page view, max 10
    const interactionScore = Math.min(sessionData.current.interactions * 1, 10) // 1 point per interaction, max 10

    return Math.round(baseScore + pageViewScore + interactionScore)
  }

  const calculateConversionProbability = (touchpoints: Array<any>): number => {
    let score = 0.1 // Base probability

    touchpoints.forEach(touchpoint => {
      switch (touchpoint.name) {
        case 'product_view': score += 0.1; break
        case 'contact_interest': score += 0.2; break
        case 'quote_interest': score += 0.3; break
        case 'consultation_interest': score += 0.4; break
        case 'lead_captured': score += 0.5; break
        case 'quote_requested': score += 0.7; break
      }
    })

    return Math.min(score, 1.0)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount)
  }

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  // Initialize tracking
  useEffect(() => {
    const cleanup = initializeTracking()
    return cleanup
  }, [initializeTracking])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Business Metrics & Conversion Analytics
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive business performance tracking and customer journey analytics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="border rounded px-3 py-1"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Badge variant={isTracking ? 'default' : 'secondary'}>
                {isTracking ? 'Live Tracking' : 'Paused'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="journey">Customer Journey</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.revenue.monthly)}</div>
                <div className="flex items-center mt-1">
                  {metrics.revenue.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${metrics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(metrics.revenue.percentageChange).toFixed(1)}% from last month
                  </span>
                </div>
                <Progress
                  value={(metrics.revenue.monthly / metrics.revenue.target) * 100}
                  className="mt-2 h-2"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Target: {formatCurrency(metrics.revenue.target)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Unique Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.visitors.unique.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {metrics.visitors.returning} returning visitors
                </div>
                <div className="text-sm text-gray-600">
                  Bounce rate: {formatPercentage(metrics.visitors.bounceRate)}
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
                <div className="text-2xl font-bold">{formatPercentage(metrics.conversions.conversionRate)}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {metrics.conversions.leads} leads captured
                </div>
                <div className="text-sm text-gray-600">
                  {metrics.conversions.quotes} quotes requested
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Avg Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.conversions.averageOrderValue)}</div>
                <div className="text-sm text-gray-600 mt-1">
                  CLV: {formatCurrency(metrics.conversions.customerLifetimeValue)}
                </div>
                <div className="text-sm text-gray-600">
                  {metrics.conversions.sales} sales completed
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold">Daily</div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(metrics.revenue.daily)}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">Weekly</div>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.revenue.weekly)}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">Monthly</div>
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.revenue.monthly)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
              <p className="text-sm text-gray-600">Track customer journey from first visit to conversion</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(funnelData).map(([key, step], index) => (
                  <div key={key} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{step.name}</span>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{step.visitors.toLocaleString()} visitors</span>
                        <span>{formatPercentage(step.percentage)}</span>
                        <span>Avg: {Math.round(step.averageTime / 60)}m</span>
                      </div>
                    </div>
                    <Progress value={step.percentage} className="h-4" />
                    {index > 0 && step.dropOff > 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        Drop-off: {step.dropOff.toLocaleString()} visitors ({formatPercentage((step.dropOff / funnelData.landing.visitors) * 100)})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Funnel Optimization Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">High Drop-off: Product View to Engagement</h4>
                    <p className="text-sm text-red-700">35% of visitors leave after viewing products. Consider improving product descriptions and adding customer testimonials.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Optimize Lead Capture</h4>
                    <p className="text-sm text-yellow-700">Only 28% of engaged visitors become leads. Try reducing form fields and adding incentives.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Strong Conversion Rate</h4>
                    <p className="text-sm text-green-700">5% overall conversion rate is excellent for home improvement industry.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Signups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.engagement.emailSignups}</div>
                <div className="text-sm text-gray-600 mt-1">Newsletter subscribers</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.engagement.phoneClicks}</div>
                <div className="text-sm text-gray-600 mt-1">Call button interactions</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Brochure Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.engagement.brochureDownloads}</div>
                <div className="text-sm text-gray-600 mt-1">PDF downloads</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Virtual Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.engagement.virtualConsultations}</div>
                <div className="text-sm text-gray-600 mt-1">Consultation requests</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Blog Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.engagement.blogEngagement}</div>
                <div className="text-sm text-gray-600 mt-1">Blog interactions</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Social Shares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.engagement.socialShares}</div>
                <div className="text-sm text-gray-600 mt-1">Content shares</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Most Viewed Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.products.mostViewed.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No product data available</p>
                  ) : (
                    metrics.products.mostViewed.slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{product.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{product.views} views</Badge>
                          <Badge variant="outline">{product.conversions} conversions</Badge>
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
                  <DollarSign className="h-5 w-5" />
                  Top Performing Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.products.topPerforming.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No revenue data available</p>
                  ) : (
                    metrics.products.topPerforming.slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{product.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">{formatCurrency(product.revenue)}</Badge>
                          <Badge variant="outline">{formatPercentage(product.margin)} margin</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Journey Tab */}
        <TabsContent value="journey" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Customer Journeys</CardTitle>
              <p className="text-sm text-gray-600">Real-time tracking of customer interactions and conversion probability</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerJourneys.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active customer journeys</p>
                ) : (
                  customerJourneys.map((journey, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold capitalize">{journey.stage} Stage</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {formatPercentage(journey.conversionProbability * 100)} probability
                          </Badge>
                          <Badge variant="secondary">
                            {Math.round(journey.totalTime / 60000)}m total time
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {journey.touchpoints.slice(-5).map((touchpoint, tIndex) => (
                          <div key={tIndex} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{touchpoint.name.replace('_', ' ')}</span>
                            <span className="text-gray-500">
                              {new Date(touchpoint.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Progress value={journey.conversionProbability * 100} className="mt-3 h-2" />
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