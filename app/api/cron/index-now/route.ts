import { NextResponse } from 'next/server';
import { submitAllPages } from '@/lib/indexnow';

export const runtime = 'edge';

// Runs every hour to notify search engines of page updates
export async function GET() {
  try {
    const result = await submitAllPages();

    console.log(`[IndexNow Cron] Submitted ${result.urlsSubmitted} URLs`);
    console.log(`[IndexNow Cron] Success: ${result.successCount}, Failed: ${result.failedCount}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      urlsSubmitted: result.urlsSubmitted,
      successCount: result.successCount,
      failedCount: result.failedCount,
    });
  } catch (error) {
    console.error('[IndexNow Cron] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
