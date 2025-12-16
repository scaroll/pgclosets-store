import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface WebVitalsData {
  metric: string
  value: number
  url: string
  userAgent: string
  timestamp: number
  [key: string]: any
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''

    // Only process requests from your own domain
    const origin = headersList.get('origin')
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || 'https://pgclosets.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://pgclosets-store.vercel.app',
      'https://www.pgclosets.com',
      'https://pgclosets.ca',
      'https://www.pgclosets.ca'
    ]

    // Check if origin is allowed (also allow Vercel preview deployments)
    const isAllowedOrigin = (origin: string | null): boolean => {
      if (!origin) return true // Allow requests without origin header (same-site)
      if (allowedOrigins.includes(origin)) return true
      // Allow Vercel preview deployments
      if (origin.includes('vercel.app') && origin.includes('pgclosets')) return true
      if (origin.includes('peoples-group.vercel.app')) return true
      return false
    }

    if (!isAllowedOrigin(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      )
    }

    const body: WebVitalsData = await request.json()

    // Validate required fields
    if (!body.metric || typeof body.value !== 'number' || !body.url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Enhanced logging for performance monitoring
    console.log(`📊 Web Vitals - ${body.metric.toUpperCase()}:`, {
      value: body.value,
      url: body.url,
      timestamp: new Date(body.timestamp).toISOString(),
      userAgent: userAgent.substring(0, 100) + '...'
    })

    // Store metrics in your preferred analytics system
    // This could be Google Analytics, Vercel Analytics, or a custom database

    // Google Analytics 4 event
    if (process.env.NEXT_PUBLIC_GA_ID) {
      const gaData = {
        name: 'web_vitals',
        params: {
          metric_name: body.metric,
          metric_value: Math.round(body.value),
          page_location: body.url,
          custom_parameter_1: body.metric === 'LCP' ? 'largest_contentful_paint' :
                            body.metric === 'FID' ? 'first_input_delay' :
                            body.metric === 'CLS' ? 'cumulative_layout_shift' :
                            body.metric === 'FCP' ? 'first_contentful_paint' : 'unknown'
        }
      }

      // In production, you would send this to GA4
      console.log('🎯 GA4 Event:', gaData)
    }

    // Performance alerting for poor metrics
    const thresholds = {
      LCP: 2500,  // Poor: >4.0s
      FID: 100,   // Poor: >300ms
      CLS: 0.1,   // Poor: >0.25
      FCP: 1800,  // Poor: >3.0s
      TTFB: 800   // Poor: >1800ms
    }

    const threshold = thresholds[body.metric as keyof typeof thresholds]
    if (threshold && body.value > threshold * 1.5) {
      console.warn(`🚨 Performance Alert: ${body.metric} (${body.value.toFixed(2)}) significantly exceeds threshold (${threshold})`)

      // In production, you could send alerts to Slack, Discord, or monitoring services
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to monitoring service
        // await sendPerformanceAlert(body.metric, body.value, body.url)
      }
    }

    // Store in database or analytics platform
    // Example for a database:
    /*
    await db.webVitals.create({
      data: {
        metric: body.metric,
        value: body.value,
        url: body.url,
        userAgent: userAgent,
        timestamp: new Date(body.timestamp),
        metadata: body
      }
    })
    */

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Web vitals recorded successfully',
      metric: body.metric,
      value: body.value,
      status: body.value <= threshold ? 'good' : 'needs-improvement'
    })

  } catch (error) {
    console.error('❌ Web Vitals API Error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve aggregated metrics (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const period = searchParams.get('period') || '24h' // 24h, 7d, 30d

    // In a real implementation, you would fetch from your database
    // For now, return mock data
    const mockData = {
      LCP: { avg: 2100, p75: 2800, count: 1250 },
      FID: { avg: 45, p75: 85, count: 980 },
      CLS: { avg: 0.08, p75: 0.15, count: 1320 },
      FCP: { avg: 1500, p75: 2100, count: 1400 },
      TTFB: { avg: 450, p75: 680, count: 1150 }
    }

    const data = metric ? { [metric]: mockData[metric as keyof typeof mockData] } : mockData

    return NextResponse.json({
      success: true,
      period,
      data,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Web Vitals GET Error:', error)

    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    )
  }
}