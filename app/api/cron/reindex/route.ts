import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Starting weekly reindex...')

    // Comprehensive revalidation for weekly SEO optimization
    const revalidatedPaths = [
      '/',
      '/store',
      '/store/products',
      '/barn-doors',
      '/hardware',
      '/about',
      '/contact',
      '/sitemap.xml',
      '/robots.txt'
    ]

    const revalidatedTags = [
      'sitemap',
      'products',
      'categories',
      'metadata',
      'seo',
      'structured-data'
    ]

    // Revalidate all paths
    for (const path of revalidatedPaths) {
      revalidatePath(path)
    }

    // Revalidate all tags
    for (const tag of revalidatedTags) {
      revalidateTag(tag)
    }

    // Trigger sitemap regeneration
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cron/refresh-sitemap`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    })

    // Submit sitemap to search engines
    const searchEngineResults = await submitToSearchEngines()

    const timestamp = new Date().toISOString()
    
    console.log('✅ Weekly reindex completed at:', timestamp)

    return NextResponse.json({
      success: true,
      message: 'Weekly reindex completed successfully',
      timestamp,
      revalidated: {
        paths: revalidatedPaths,
        tags: revalidatedTags
      },
      searchEngines: searchEngineResults
    })

  } catch (error) {
    console.error('❌ Weekly reindex failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to complete weekly reindex',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function submitToSearchEngines() {
  const results = {
    google: false,
    bing: false
  }

  const sitemapUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`

  try {
    // Submit to Google Search Console (if configured)
    if (process.env.GOOGLE_SEARCH_CONSOLE_URL) {
      const googleResponse = await fetch(
        `${process.env.GOOGLE_SEARCH_CONSOLE_URL}/sitemaps/submit?sitemap=${encodeURIComponent(sitemapUrl)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GOOGLE_API_TOKEN}`
          }
        }
      )
      results.google = googleResponse.ok
    }

    // Submit to Bing Webmaster Tools (if configured)
    if (process.env.BING_WEBMASTER_API_KEY) {
      const bingResponse = await fetch(
        'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ApiKey': process.env.BING_WEBMASTER_API_KEY
          },
          body: JSON.stringify({
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
            urlList: [sitemapUrl]
          })
        }
      )
      results.bing = bingResponse.ok
    }

  } catch (error) {
    console.error('Search engine submission error:', error)
  }

  return results
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}