import { NextResponse } from 'next/server';

export const runtime = 'edge';

const CRITICAL_ENDPOINTS = [
  { path: '/', name: 'Homepage' },
  { path: '/products', name: 'Products Page' },
  { path: '/contact', name: 'Contact Page' },
  { path: '/api/products/search', name: 'Products API' },
];

interface HealthCheckResult {
  endpoint: string;
  name: string;
  status: number;
  responseTime: number;
  healthy: boolean;
}

// Runs every hour to check critical endpoint availability
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgclosets.com';
  const results: HealthCheckResult[] = [];

  await Promise.all(
    CRITICAL_ENDPOINTS.map(async ({ path, name }) => {
      const startTime = Date.now();
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'PGClosets-Uptime-Monitor/1.0',
          },
        });

        const responseTime = Date.now() - startTime;

        results.push({
          endpoint: path,
          name,
          status: response.status,
          responseTime,
          healthy: response.ok,
        });
      } catch (error) {
        results.push({
          endpoint: path,
          name,
          status: 0,
          responseTime: Date.now() - startTime,
          healthy: false,
        });
      }
    })
  );

  const allHealthy = results.every((r) => r.healthy);
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

  console.log(`[Uptime Check] Status: ${allHealthy ? 'HEALTHY' : 'DEGRADED'}`);
  console.log(`[Uptime Check] Avg Response Time: ${avgResponseTime.toFixed(0)}ms`);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    status: allHealthy ? 'healthy' : 'degraded',
    avgResponseTime: Math.round(avgResponseTime),
    results,
  });
}
