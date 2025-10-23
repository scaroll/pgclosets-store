import products from '../../../data/pgclosets-products.json'

const PAGES = [
  '/',
  '/about',
  '/services',
  '/services/installation',
  '/products',
  '/collections/renin-bypass-doors',
  '/search',
  '/wishlist',
]

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const results: any[] = []

  const slugs: string[] = []
  try {
    const list = products as any[]
    for (let i = 0; i < Math.min(5, list.length); i++) {
      const p = list[i]
      if (p?.slug) slugs.push(`/store/products/${encodeURIComponent(p.slug)}`)
    }
  } catch {}

  const targets = [...PAGES, ...slugs]

  // Check pages in parallel with timeout
  const checkPromises = targets.map(async (path) => {
    const url = (base ? base.replace(/\/$/, '') : '') + path
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    try {
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Self-Check/1.0)'
        }
      })
      clearTimeout(timeoutId)

      // Consider 2xx and 3xx as success, ignore soft 404s for dynamic content
      const isHealthy = res.status < 400 || (res.status === 404 && path.includes('/products/'))

      return {
        path,
        status: res.status,
        healthy: isHealthy,
        responseTime: Date.now()
      }
    } catch (e: any) {
      clearTimeout(timeoutId)
      return {
        path,
        error: e?.message || String(e),
        healthy: false,
        responseTime: Date.now()
      }
    }
  })

  const checkResults = await Promise.allSettled(checkPromises)

  for (const result of checkResults) {
    if (result.status === 'fulfilled') {
      results.push(result.value)
    } else {
      results.push({
        path: 'unknown',
        error: result.reason?.message || 'Check failed',
        healthy: false
      })
    }
  }

  const failures = results.filter((r) => !r.healthy)
  const criticalFailures = results.filter((r) => r.status && r.status >= 500)

  return Response.json({
    ok: criticalFailures.length === 0,
    degraded: failures.length > 0,
    results,
    summary: {
      total: results.length,
      healthy: results.length - failures.length,
      degraded: failures.length,
      critical: criticalFailures.length
    }
  })
}

