import { NextResponse } from 'next/server';
import { submitAllPages } from '@/lib/indexnow';

export const runtime = 'edge';

export async function POST() {
  try {
    const result = await submitAllPages();

    return NextResponse.json({
      success: true,
      message: `Submitted ${result.urlsSubmitted} URLs to search engines`,
      details: {
        urlsSubmitted: result.urlsSubmitted,
        successCount: result.successCount,
        failedCount: result.failedCount,
        engines: result.results.map((r) => ({
          engine: r.engine,
          success: r.success,
          status: r.status,
          error: r.error,
        })),
      },
    });
  } catch (error) {
    console.error('IndexNow submission failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to submit all pages to IndexNow',
    endpoint: '/api/seo/submit-all',
    method: 'POST',
  });
}
