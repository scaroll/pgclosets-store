import { NextResponse } from 'next/server';

// Temporarily disabled edge runtime due to Next.js 15 build issues
// export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface MonitoringMetrics {
  timestamp: string;
  uptime: number;
  memory?: {
    used: number;
    total: number;
    rss: number;
  };
  environment: {
    nodeEnv: string;
    vercelEnv: string;
    region: string;
  };
  performance: {
    responseTime: number;
  };
}

export function GET() {
  const startTime = Date.now();

  try {
    const metrics: MonitoringMetrics = {
      timestamp: new Date().toISOString(),
      uptime: 0, // Edge Runtime doesn't support process.uptime()
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        vercelEnv: process.env.VERCEL_ENV || 'local',
        region: process.env.VERCEL_REGION || 'local',
      },
      performance: {
        responseTime: Date.now() - startTime,
      },
    }

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Monitoring endpoint failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
