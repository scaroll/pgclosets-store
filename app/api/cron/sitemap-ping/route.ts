import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SITEMAP_URL = 'https://www.pgclosets.com/sitemap.xml';

// List of search engine sitemap ping endpoints
const PING_ENDPOINTS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  // Bing now uses IndexNow instead of sitemap ping
];

interface PingResult {
  engine: string;
  success: boolean;
  status?: number;
  error?: string;
}

// Runs weekly (Mondays at 3 AM) to ping search engines about sitemap
export async function GET() {
  const results: PingResult[] = [];

  await Promise.all(
    PING_ENDPOINTS.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'User-Agent': 'PGClosets-Sitemap-Ping/1.0',
          },
        });

        const engine = new URL(endpoint).hostname.replace('www.', '');

        results.push({
          engine,
          success: response.ok,
          status: response.status,
        });
      } catch (error) {
        const engine = new URL(endpoint).hostname.replace('www.', '');
        results.push({
          engine,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    })
  );

  const successCount = results.filter((r) => r.success).length;

  console.log(`[Sitemap Ping] Pinged ${results.length} engines, ${successCount} successful`);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    sitemapUrl: SITEMAP_URL,
    pingCount: results.length,
    successCount,
    results,
  });
}
