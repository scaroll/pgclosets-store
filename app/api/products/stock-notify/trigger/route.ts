import { NextResponse } from 'next/server'
import { processProductNotifications } from '@/scripts/send-stock-notifications'

/**
 * API endpoint to trigger stock notifications when a product comes back in stock
 *
 * This endpoint should be called when:
 * 1. An admin manually updates inventory
 * 2. An inventory management system webhook fires
 * 3. A scheduled job detects new stock
 *
 * Usage:
 * POST /api/products/stock-notify/trigger
 * Body: { productId: "prod_123" }
 *
 * Or for multiple products:
 * Body: { productIds: ["prod_123", "prod_456"] }
 */
export async function POST(request: Request) {
  try {
    // Optional: Add authentication/authorization
    const authHeader = request.headers.get('authorization')
    const apiKey = process.env.STOCK_NOTIFY_API_KEY

    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, productIds } = body

    if (!productId && !productIds) {
      return NextResponse.json(
        { error: 'productId or productIds required' },
        { status: 400 }
      )
    }

    const results: Record<string, number> = {}

    // Process single product
    if (productId) {
      try {
        const count = await processProductNotifications(productId)
        results[productId] = count
      } catch (error) {
        console.error(`Error processing notifications for ${productId}:`, error)
        return NextResponse.json(
          {
            error: 'Failed to process notifications',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 500 }
        )
      }
    }

    // Process multiple products
    if (productIds && Array.isArray(productIds)) {
      for (const id of productIds) {
        try {
          const count = await processProductNotifications(id)
          results[id] = count

          // Add delay between products to avoid overwhelming email service
          await new Promise((resolve) => setTimeout(resolve, 500))
        } catch (error) {
          console.error(`Error processing notifications for ${id}:`, error)
          results[id] = -1 // Indicate error
        }
      }
    }

    const totalSent = Object.values(results).reduce((sum, count) => sum + count, 0)

    return NextResponse.json({
      success: true,
      message: `Processed stock notifications`,
      totalNotificationsSent: totalSent,
      results,
    })
  } catch (error) {
    console.error('Error in stock notification trigger:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check if there are pending notifications for a product
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'productId query parameter required' },
        { status: 400 }
      )
    }

    // This would need to be implemented with actual database query
    // For now, return a placeholder response
    return NextResponse.json({
      productId,
      pendingNotifications: 0,
      message: 'Feature requires database implementation',
    })
  } catch (error) {
    console.error('Error checking pending notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
