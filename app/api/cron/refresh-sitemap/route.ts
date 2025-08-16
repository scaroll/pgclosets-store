import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Starting sitemap refresh...')

    // Revalidate the sitemap
    revalidatePath('/sitemap.xml')
    revalidateTag('sitemap')

    // Revalidate key product pages
    revalidatePath('/store/products')
    revalidatePath('/barn-doors')
    revalidatePath('/hardware')
    
    // Revalidate category pages
    revalidateTag('products')
    revalidateTag('categories')

    const timestamp = new Date().toISOString()
    
    console.log('✅ Sitemap refresh completed at:', timestamp)

    return NextResponse.json({
      success: true,
      message: 'Sitemap refreshed successfully',
      timestamp,
      revalidated: [
        '/sitemap.xml',
        '/store/products',
        '/barn-doors',
        '/hardware'
      ]
    })

  } catch (error) {
    console.error('❌ Sitemap refresh failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh sitemap',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}