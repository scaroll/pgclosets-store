import { NextResponse } from 'next/server'
import { checkDatabaseHealth, testDatabaseConnection } from '@/lib/db'

export const maxDuration = 30

// Database health check endpoint
export async function GET() {
  try {
    // Test database connection
    const isConnected = await testDatabaseConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          error: 'Database connection failed',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    // Get detailed health information
    const health = await checkDatabaseHealth()

    return NextResponse.json({
      status: 'healthy',
      database: health,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[DB_HEALTH_CHECK_ERROR]', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
