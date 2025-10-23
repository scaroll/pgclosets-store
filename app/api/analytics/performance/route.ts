import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@vercel/kv'

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

interface PerformanceMetric {
  name: string
  value: number
  metadata?: any
  timestamp: number
  url: string
  userAgent: string
  sessionId: string
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip')
    const userAgent = headersList.get('user-agent')

    const body: PerformanceMetric = await request.json()

    // Validate the metric data
    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    // Add server-side metadata
    const enrichedMetric = {
      ...body,
      serverTimestamp: Date.now(),
      ip: ip?.split(',')[0] || 'unknown',
      serverUserAgent: userAgent,
      country: headersList.get('x-vercel-ip-country') || 'unknown',
      region: headersList.get('x-vercel-ip-region') || 'unknown',
      city: headersList.get('x-vercel-ip-city') || 'unknown',
    }

    // Store in different data structures for different query patterns

    // 1. Store raw metric for detailed analysis
    await kv.zadd(
      `metrics:${body.name}:raw`,
      {
        score: enrichedMetric.timestamp,
        member: JSON.stringify(enrichedMetric),
      }
    )

    // 2. Store aggregated metrics for quick access
    const hourKey = Math.floor(enrichedMetric.timestamp / (1000 * 60 * 60))
    await kv.zadd(
      `metrics:${body.name}:hourly:${hourKey}`,
      {
        score: enrichedMetric.timestamp,
        member: JSON.stringify({
          value: body.value,
          sessionId: body.sessionId,
        }),
      }
    )

    // 3. Store user session metrics
    await kv.hset(
      `session:${body.sessionId}:metrics`,
      {
        [body.name]: JSON.stringify({
          value: body.value,
          timestamp: enrichedMetric.timestamp,
        }),
      }
    )

    // 4. Store geographic breakdown
    const geoKey = `${enrichedMetric.country}:${enrichedMetric.region}`
    await kv.zadd(
      `metrics:${body.name}:geo:${geoKey}`,
      {
        score: enrichedMetric.timestamp,
        member: JSON.stringify({
          value: body.value,
          city: enrichedMetric.city,
        }),
      }
    )

    // 5. Store device type breakdown
    const deviceType = getDeviceType(body.userAgent)
    await kv.zadd(
      `metrics:${body.name}:device:${deviceType}`,
      {
        score: enrichedMetric.timestamp,
        member: JSON.stringify({
          value: body.value,
        }),
      }
    )

    // 6. Set expiration for data cleanup (keep for 30 days)
    await kv.expire(`metrics:${body.name}:raw`, 60 * 60 * 24 * 30)
    await kv.expire(`metrics:${body.name}:hourly:${hourKey}`, 60 * 60 * 24 * 30)
    await kv.expire(`session:${body.sessionId}:metrics`, 60 * 60 * 24 * 7) // Sessions expire after 7 days

    // 7. Trigger real-time alerts for critical metrics
    await checkPerformanceThresholds(body.name, body.value)

    // 8. Update real-time dashboards
    await updateRealtimeDashboards(body.name, body.value, enrichedMetric)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Performance metric storage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const timeRange = searchParams.get('timeRange') || '24h'
    const breakdown = searchParams.get('breakdown') // 'device', 'geo', 'session'

    if (!metric) {
      return NextResponse.json(
        { error: 'Metric parameter is required' },
        { status: 400 }
      )
    }

    const endTime = Date.now()
    const startTime = getStartTimeByRange(timeRange, endTime)

    let data: any[] = []

    if (breakdown === 'device') {
      // Get device breakdown
      const devices = ['mobile', 'tablet', 'desktop']
      data = await Promise.all(
        devices.map(async (device) => {
          const values = await kv.zrangebyscore(
            `metrics:${metric}:device:${device}`,
            startTime,
            endTime
          )
          const parsedValues = values.map(v => JSON.parse(v)).map(v => v.value)
          return {
            device,
            count: parsedValues.length,
            average: parsedValues.length > 0 ? parsedValues.reduce((a, b) => a + b, 0) / parsedValues.length : 0,
            median: calculateMedian(parsedValues),
            p95: calculatePercentile(parsedValues, 95),
            p99: calculatePercentile(parsedValues, 99),
          }
        })
      )
    } else if (breakdown === 'geo') {
      // Get geographic breakdown (top countries)
      const geoKeys = await kv.keys(`metrics:${metric}:geo:*`)
      data = await Promise.all(
        geoKeys.slice(0, 10).map(async (key) => {
          const values = await kv.zrangebyscore(key, startTime, endTime)
          const parsedValues = values.map(v => JSON.parse(v)).map(v => v.value)
          const [country, region] = key.split(':').slice(2)
          return {
            country,
            region,
            count: parsedValues.length,
            average: parsedValues.length > 0 ? parsedValues.reduce((a, b) => a + b, 0) / parsedValues.length : 0,
          }
        })
      )
    } else {
      // Get aggregated metrics over time
      const interval = getTimeIntervalByRange(timeRange)
      const intervals = Math.floor((endTime - startTime) / interval)

      data = await Promise.all(
        Array.from({ length: Math.min(intervals, 100) }, (_, i) => {
          const intervalStart = startTime + (i * interval)
          const intervalEnd = intervalStart + interval
          const hourKey = Math.floor(intervalStart / (1000 * 60 * 60))

          return kv.zrangebyscore(
            `metrics:${metric}:hourly:${hourKey}`,
            intervalStart,
            intervalEnd
          ).then(values => {
            const parsedValues = values.map(v => JSON.parse(v)).map(v => v.value)
            return {
              timestamp: intervalStart,
              count: parsedValues.length,
              average: parsedValues.length > 0 ? parsedValues.reduce((a, b) => a + b, 0) / parsedValues.length : 0,
              median: calculateMedian(parsedValues),
              p95: calculatePercentile(parsedValues, 95),
            }
          })
        })
      )
    }

    return NextResponse.json({
      metric,
      timeRange,
      breakdown,
      data,
      summary: calculateSummary(data),
    })
  } catch (error) {
    console.error('Performance metric retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile'
  }
  if (/tablet|ipad|android(?!.*mobile)/i.test(ua)) {
    return 'tablet'
  }
  return 'desktop'
}

function getStartTimeByRange(timeRange: string, endTime: number): number {
  const ranges = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  }
  return endTime - (ranges[timeRange as keyof typeof ranges] || ranges['24h'])
}

function getTimeIntervalByRange(timeRange: string): number {
  const intervals = {
    '1h': 5 * 60 * 1000, // 5 minutes
    '24h': 30 * 60 * 1000, // 30 minutes
    '7d': 2 * 60 * 60 * 1000, // 2 hours
    '30d': 6 * 60 * 60 * 1000, // 6 hours
  }
  return intervals[timeRange as keyof typeof intervals] || intervals['24h']
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = values.sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0
  const sorted = values.sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

function calculateSummary(data: any[]): any {
  const allValues = data.flatMap(d => [d.average, d.p95].filter(v => v > 0))
  return {
    totalSamples: data.reduce((sum, d) => sum + d.count, 0),
    overallAverage: allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0,
    worstP95: Math.max(...data.map(d => d.p95 || 0)),
    bestAverage: Math.min(...data.filter(d => d.average > 0).map(d => d.average)),
  }
}

async function checkPerformanceThresholds(metric: string, value: number) {
  const thresholds = {
    lcp: { warning: 2500, critical: 4000 },
    fcp: { warning: 1800, critical: 3000 },
    cls: { warning: 0.1, critical: 0.25 },
    fid: { warning: 100, critical: 300 },
    inp: { warning: 200, critical: 500 },
    ttfb: { warning: 800, critical: 1800 },
    errorRate: { warning: 1, critical: 5 },
  }

  const threshold = thresholds[metric as keyof typeof thresholds]
  if (threshold) {
    if (value >= threshold.critical) {
      await sendAlert('critical', metric, value, threshold.critical)
    } else if (value >= threshold.warning) {
      await sendAlert('warning', metric, value, threshold.warning)
    }
  }
}

async function sendAlert(level: 'warning' | 'critical', metric: string, value: number, threshold: number) {
  // Send alert to monitoring system
  try {
    await fetch('/api/monitoring/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        metric,
        value,
        threshold,
        timestamp: Date.now(),
        message: `${metric.toUpperCase()} performance ${level}: ${value} (threshold: ${threshold})`,
      }),
    })
  } catch (error) {
    console.error('Failed to send performance alert:', error)
  }
}

async function updateRealtimeDashboards(metric: string, value: number, enrichedMetric: any) {
  // Update real-time dashboard data
  try {
    await kv.set(
      `dashboard:current:${metric}`,
      JSON.stringify({
        value,
        timestamp: enrichedMetric.timestamp,
        location: `${enrichedMetric.city}, ${enrichedMetric.country}`,
        device: getDeviceType(enrichedMetric.userAgent),
      }),
      { ex: 300 } // Expire after 5 minutes
    )
  } catch (error) {
    console.error('Failed to update dashboard:', error)
  }
}