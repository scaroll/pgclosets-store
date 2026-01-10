import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const headersList = await headers()
    
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: body.error,
      errorInfo: body.errorInfo,
      url: body.url,
      userAgent: body.userAgent,
      ip: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown',
      referer: headersList.get('referer') || null,
      environment: process.env.NODE_ENV,
      deployment: process.env.VERCEL_ENV,
      region: process.env.VERCEL_REGION,
    }

    // Log to console for now (in production, send to error tracking service)
    console.error('Client Error:', JSON.stringify(errorLog, null, 2))

    // In production, you would send to:
    // - Sentry: Sentry.captureException(new Error(body.error.message))
    // - LogRocket: LogRocket.captureException(new Error(body.error.message))
    // - Custom logging service
    // - Database for analysis

    // For demonstration, we'll store in a simple log format
    if (process.env.NODE_ENV === 'production') {
      // Example: Store in Supabase logs table
      // const supabase = createClient()
      // await supabase.from('error_logs').insert(errorLog)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Error logged successfully',
        errorId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error('Failed to log client error:', errorMessage)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to log error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for error statistics (admin only)
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '24h'
  
  // This would typically require admin authentication
  // For demo purposes, we'll return mock statistics
  
  const stats = {
    period,
    total_errors: 0,
    error_rate: 0,
    most_common_errors: [],
    error_trends: {
      last_hour: 0,
      last_day: 0,
      last_week: 0,
    },
    browser_breakdown: {},
    url_breakdown: {},
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  })
}