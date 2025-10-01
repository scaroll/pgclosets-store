import { NextResponse } from 'next/server';

// Use Edge Runtime for fastest response
export const runtime = 'edge';
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

export async function GET() {
  const startTime = Date.now();

  try {
    const metrics: MonitoringMetrics = {
      timestamp: new Date().toISOString(),
      uptime: typeof process !== 'undefined' ? process.uptime() : 0,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        vercelEnv: process.env.VERCEL_ENV || 'local',
        region: process.env.VERCEL_REGION || 'local',
      },
      performance: {
        responseTime: Date.now() - startTime,
      },
    };

    // Add memory stats if available (not in Edge)
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      metrics.memory = {
        used: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
        rss: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
      };
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
