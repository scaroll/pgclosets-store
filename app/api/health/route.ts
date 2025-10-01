import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

// Edge Runtime compatible - removed Node.js process APIs
export const runtime = 'edge'

export async function GET(_request: NextRequest) {
  const timestamp = new Date().toISOString()

  try {
    // Basic health checks - Edge Runtime compatible
    const checks = {
      timestamp,
      status: 'healthy',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      deployment: process.env.VERCEL_ENV || 'local',
      region: process.env.VERCEL_REGION || 'local',
    }

    return NextResponse.json(checks, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        timestamp,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  }
}