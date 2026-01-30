import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@vercel/kv'

export const maxDuration = 30

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

interface AnalyticsEvent {
  name: string
  params: Record<string, any>
  timestamp: number
  userId?: string
  sessionId: string
  userAgent: string
  url: string
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const country = headersList.get('x-vercel-ip-country') || 'unknown'
    const region = headersList.get('x-vercel-ip-region') || 'unknown'
    const city = headersList.get('x-vercel-ip-city') || 'unknown'

    const body: AnalyticsEvent = await request.json()

    // Validate event data
    if (!body.name || !body.sessionId) {
      return NextResponse.json({ error: 'Invalid event data' }, { status: 400 })
    }

    // Enrich event with server-side data
    const enrichedEvent = {
      ...body,
      serverTimestamp: Date.now(),
      ip,
      serverUserAgent: userAgent,
      country,
      region,
      city,
      processed: false,
    }

    // Store event in multiple formats for different analysis needs

    // 1. Store raw event for detailed analysis
    await kv.zadd(`events:raw:${enrichedEvent.name}`, {
      score: enrichedEvent.timestamp,
      member: JSON.stringify(enrichedEvent),
    })

    // 2. Store in daily aggregation
    const dayKey = new Date(enrichedEvent.timestamp).toISOString().split('T')[0]
    await kv.incr(`events:daily:${dayKey}:${enrichedEvent.name}`)
    await kv.expire(`events:daily:${dayKey}:${enrichedEvent.name}`, 60 * 60 * 24 * 90) // 90 days

    // 3. Store in hourly aggregation
    const hourKey = Math.floor(enrichedEvent.timestamp / (1000 * 60 * 60))
    await kv.incr(`events:hourly:${hourKey}:${enrichedEvent.name}`)
    await kv.expire(`events:hourly:${hourKey}:${enrichedEvent.name}`, 60 * 60 * 24 * 30) // 30 days

    // 4. Store user session events
    await kv.zadd(`session:${enrichedEvent.sessionId}:events`, {
      score: enrichedEvent.timestamp,
      member: JSON.stringify({
        name: enrichedEvent.name,
        params: enrichedEvent.params,
        timestamp: enrichedEvent.timestamp,
      }),
    })
    await kv.expire(`session:${enrichedEvent.sessionId}:events`, 60 * 60 * 24 * 7) // 7 days

    // 5. Store geographic breakdown
    await kv.incr(`events:geo:${country}:${enrichedEvent.name}`)
    await kv.expire(`events:geo:${country}:${enrichedEvent.name}`, 60 * 60 * 24 * 90)

    // 6. Store user segment breakdown
    const segment = enrichedEvent.params.user_segment || 'unknown'
    await kv.incr(`events:segment:${segment}:${enrichedEvent.name}`)
    await kv.expire(`events:segment:${segment}:${enrichedEvent.name}`, 60 * 60 * 24 * 90)

    // 7. Special handling for conversion events
    if (enrichedEvent.name.startsWith('conversion_')) {
      await trackConversion(enrichedEvent)
    }

    // 8. Special handling for performance events
    if (
      ['largest_contentful_paint', 'first_input_delay', 'cumulative_layout_shift'].includes(
        enrichedEvent.name
      )
    ) {
      await trackPerformanceMetric(enrichedEvent)
    }

    // 9. Update real-time dashboards
    await updateRealtimeDashboards(enrichedEvent)

    // 10. Trigger alerts for important events
    await checkForAlerts(enrichedEvent)

    return NextResponse.json({ success: true, eventId: generateEventId() })
  } catch (error) {
    console.error('Analytics event processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventName = searchParams.get('event')
    const timeRange = searchParams.get('timeRange') || '24h'
    const breakdown = searchParams.get('breakdown') // 'hourly', 'daily', 'geo', 'segment'

    if (!eventName) {
      return NextResponse.json({ error: 'Event name parameter is required' }, { status: 400 })
    }

    const endTime = Date.now()
    const startTime = getStartTimeByRange(timeRange, endTime)

    let data: any[] = []

    if (breakdown === 'hourly') {
      data = await getHourlyData(eventName, startTime, endTime)
    } else if (breakdown === 'daily') {
      data = await getDailyData(eventName, startTime, endTime)
    } else if (breakdown === 'geo') {
      data = await getGeographicData(eventName, startTime, endTime)
    } else if (breakdown === 'segment') {
      data = await getSegmentData(eventName, startTime, endTime)
    } else {
      data = await getHourlyData(eventName, startTime, endTime)
    }

    return NextResponse.json({
      event: eventName,
      timeRange,
      breakdown,
      data,
      summary: calculateSummary(data),
      totalEvents: data.reduce((sum, d) => sum + d.count, 0),
    })
  } catch (error) {
    console.error('Analytics data retrieval error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function getStartTimeByRange(timeRange: string, endTime: number): number {
  const ranges = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  }
  return endTime - (ranges[timeRange as keyof typeof ranges] || ranges['24h'])
}

async function getHourlyData(
  eventName: string,
  startTime: number,
  endTime: number
): Promise<any[]> {
  const startHour = Math.floor(startTime / (1000 * 60 * 60))
  const endHour = Math.floor(endTime / (1000 * 60 * 60))
  const data = []

  for (let hour = startHour; hour <= endHour; hour++) {
    const count = parseInt((await kv.get(`events:hourly:${hour}:${eventName}`)) || '0')
    data.push({
      timestamp: hour * 1000 * 60 * 60,
      hour,
      count,
      date: new Date(hour * 1000 * 60 * 60).toISOString(),
    })
  }

  return data
}

async function getDailyData(eventName: string, startTime: number, endTime: number): Promise<any[]> {
  const startDate = new Date(startTime).toISOString().split('T')[0]
  const endDate = new Date(endTime).toISOString().split('T')[0]
  const data = []

  const currentDate = new Date(startDate)
  while (currentDate.toISOString().split('T')[0] <= endDate) {
    const dayKey = currentDate.toISOString().split('T')[0]
    const count = parseInt((await kv.get(`events:daily:${dayKey}:${eventName}`)) || '0')
    data.push({
      date: dayKey,
      count,
      timestamp: currentDate.getTime(),
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

async function getGeographicData(
  eventName: string,
  _startTime: number,
  _endTime: number
): Promise<any[]> {
  const countries = ['CA', 'US', 'GB', 'FR', 'DE'] // Top countries
  const data = []

  for (const country of countries) {
    const count = parseInt((await kv.get(`events:geo:${country}:${eventName}`)) || '0')
    if (count > 0) {
      data.push({ country, count })
    }
  }

  return data.sort((a, b) => b.count - a.count)
}

async function getSegmentData(
  eventName: string,
  _startTime: number,
  _endTime: number
): Promise<any[]> {
  const segments = ['new_visitor', 'returning_visitor', 'mobile_user', 'organic_search', 'social']
  const data = []

  for (const segment of segments) {
    const count = parseInt((await kv.get(`events:segment:${segment}:${eventName}`)) || '0')
    if (count > 0) {
      data.push({ segment, count })
    }
  }

  return data.sort((a, b) => b.count - a.count)
}

function calculateSummary(data: any[]): any {
  const totalEvents = data.reduce((sum, d) => sum + d.count, 0)
  const averageEvents = data.length > 0 ? totalEvents / data.length : 0
  const peakEvents = Math.max(...data.map(d => d.count), 0)

  return {
    totalEvents,
    averageEvents: Math.round(averageEvents),
    peakEvents,
    dataPoints: data.length,
  }
}

async function trackConversion(event: any) {
  // Store conversion events with special handling
  await kv.zadd('conversions:all', {
    score: event.timestamp,
    member: JSON.stringify({
      type: event.name.replace('conversion_', ''),
      value: event.params.value,
      currency: event.params.currency,
      userId: event.userId,
      sessionId: event.sessionId,
      country: event.country,
      timestamp: event.timestamp,
    }),
  })

  // Update conversion counters
  await kv.incr(`conversions:${event.name.replace('conversion_', '')}`)
  await kv.incr(`conversions:total`)

  // Store conversion value
  if (event.params.value) {
    await kv.incrbyfloat('revenue:total', event.params.value)
  }
}

async function trackPerformanceMetric(event: any) {
  // Store performance metrics in percentiles
  await kv.zadd(`performance:${event.name}`, {
    score: event.params.value,
    member: JSON.stringify({
      timestamp: event.timestamp,
      sessionId: event.sessionId,
      url: event.url,
    }),
  })

  // Keep only last 1000 measurements per metric
  const count = await kv.zcard(`performance:${event.name}`)
  if (count > 1000) {
    await kv.zremrangebyrank(`performance:${event.name}`, 0, count - 1000 - 1)
  }
}

async function updateRealtimeDashboards(event: any) {
  // Update real-time counters
  await kv.set(
    `dashboard:current:${event.name}`,
    JSON.stringify({
      count: 1,
      lastEvent: event.timestamp,
      latestParams: event.params,
    }),
    { ex: 300 } // Expire after 5 minutes
  )

  // Update active sessions
  await kv.sadd('active:sessions', event.sessionId)
  await kv.expireat('active:sessions', Math.floor(Date.now() / 1000) + 1800) // 30 minutes
}

async function checkForAlerts(event: any) {
  // Check for important events that might need alerts
  const alertEvents = ['conversion_quote_request', 'conversion_purchase', 'javascript_error']

  if (alertEvents.includes(event.name)) {
    try {
      await fetch('/api/monitoring/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'analytics_event',
          eventName: event.name,
          timestamp: event.timestamp,
          params: event.params,
          sessionId: event.sessionId,
        }),
      })
    } catch (error) {
      console.warn('Failed to send analytics alert:', error)
    }
  }
}
