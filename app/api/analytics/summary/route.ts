import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { subDays, startOfDay, endOfDay } from 'date-fns';

const summaryQuerySchema = z.object({
  period: z.enum(['24h', '7d', '30d', '90d']).default('7d'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Only allow authenticated users
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const { period } = summaryQuerySchema.parse(Object.fromEntries(searchParams));

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '24h':
        startDate = subDays(now, 1);
        break;
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
    }

    const dateRange = {
      gte: startOfDay(startDate),
      lte: endOfDay(now),
    };

    // Fetch analytics data in parallel
    const [
      totalPageViews,
      uniqueVisitors,
      totalProductViews,
      totalSearches,
      totalPurchases,
      topPages,
      topProducts,
      topSearches,
      conversionRate,
      revenue,
    ] = await Promise.all([
      // Total page views
      prisma.pageView.count({
        where: { timestamp: dateRange },
      }),

      // Unique visitors
      prisma.pageView.groupBy({
        by: ['sessionId'],
        where: { timestamp: dateRange },
      }).then(result => result.length),

      // Total product views
      prisma.productView.count({
        where: { timestamp: dateRange },
      }),

      // Total searches
      prisma.searchQuery.count({
        where: { createdAt: dateRange },
      }),

      // Total purchases
      prisma.purchaseEvent.count({
        where: { timestamp: dateRange },
      }),

      // Top pages
      prisma.pageView.groupBy({
        by: ['path'],
        where: { timestamp: dateRange },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),

      // Top products
      prisma.productView.groupBy({
        by: ['productId'],
        where: { timestamp: dateRange },
        _count: { productId: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 10,
      }),

      // Top searches
      prisma.searchQuery.groupBy({
        by: ['query'],
        where: { createdAt: dateRange },
        _count: { query: true },
        orderBy: { _count: { query: 'desc' } },
        take: 10,
      }),

      // Conversion rate (purchases / sessions)
      prisma.pageView.groupBy({
        by: ['sessionId'],
        where: { timestamp: dateRange },
      }).then(sessions => {
        return sessions.length > 0
          ? (prisma.purchaseEvent.count({
              where: { timestamp: dateRange },
            }).then(purchases => (purchases / sessions.length) * 100))
          : 0;
      }),

      // Total revenue
      prisma.purchaseEvent.aggregate({
        where: { timestamp: dateRange },
        _sum: { total: true },
      }),
    ]);

    // Get daily page views trend
    const dailyViews = await prisma.pageView.groupBy({
      by: ['timestamp'],
      where: { timestamp: dateRange },
      _count: { timestamp: true },
    });

    // Format the response
    const summary = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
      overview: {
        pageViews: totalPageViews,
        uniqueVisitors,
        productViews: totalProductViews,
        searches: totalSearches,
        purchases: totalPurchases,
        conversionRate: typeof conversionRate === 'number' ? Math.round(conversionRate * 100) / 100 : 0,
        revenue: (revenue._sum.total || 0) / 100, // Convert from cents to dollars
      },
      topContent: {
        pages: topPages.map(page => ({
          path: page.path,
          views: page._count.path,
        })),
        products: topProducts.map(product => ({
          productId: product.productId,
          views: product._count.productId,
        })),
        searches: topSearches.map(search => ({
          query: search.query,
          count: search._count.query,
        })),
      },
      trends: {
        dailyViews: dailyViews.map(view => ({
          date: view.timestamp.toISOString().split('T')[0],
          views: view._count.timestamp,
        })),
      },
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('[ANALYTICS_SUMMARY_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}