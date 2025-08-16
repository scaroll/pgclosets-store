import { NextRequest, NextResponse } from 'next/server'
import { reninProducts } from '@/lib/renin-products'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paddle-payments-nl5k9vde7-peoples-group.vercel.app'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔥 Starting cache warming...')

    const warmedUrls: string[] = []
    const failedUrls: string[] = []

    // Define critical pages to warm
    const criticalPages = [
      '/',
      '/store',
      '/store/products',
      '/barn-doors',
      '/hardware',
      '/about',
      '/contact'
    ]

    // Get top products to warm
    const barnDoors = reninProducts.getBarnDoors().slice(0, 10) // Top 10 barn doors
    const hardware = reninProducts.getHardware().slice(0, 5) // Top 5 hardware

    const productPages = [
      ...barnDoors.map(p => `/store/products/${p.slug}`),
      ...hardware.map(p => `/store/products/${p.slug}`)
    ]

    const allPages = [...criticalPages, ...productPages]

    // Warm pages in batches
    const batchSize = 5
    for (let i = 0; i < allPages.length; i += batchSize) {
      const batch = allPages.slice(i, i + batchSize)
      
      const promises = batch.map(async (path) => {
        try {
          const url = `${baseUrl}${path}`
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'PG-Closets-Cache-Warmer/1.0'
            }
          })
          
          if (response.ok) {
            warmedUrls.push(path)
            console.log(`✅ Warmed: ${path}`)
          } else {
            failedUrls.push(`${path} (${response.status})`)
            console.warn(`⚠️ Failed to warm: ${path} - ${response.status}`)
          }
        } catch (error) {
          failedUrls.push(`${path} (error)`)
          console.error(`❌ Error warming ${path}:`, error)
        }
      })

      await Promise.all(promises)
      
      // Small delay between batches to avoid overwhelming the server
      if (i + batchSize < allPages.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    const timestamp = new Date().toISOString()
    
    console.log(`🔥 Cache warming completed at: ${timestamp}`)
    console.log(`✅ Successfully warmed: ${warmedUrls.length} pages`)
    console.log(`❌ Failed to warm: ${failedUrls.length} pages`)

    return NextResponse.json({
      success: true,
      message: 'Cache warming completed',
      timestamp,
      stats: {
        total: allPages.length,
        successful: warmedUrls.length,
        failed: failedUrls.length
      },
      warmedUrls,
      failedUrls: failedUrls.length > 0 ? failedUrls : undefined
    })

  } catch (error) {
    console.error('❌ Cache warming failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to warm cache',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}