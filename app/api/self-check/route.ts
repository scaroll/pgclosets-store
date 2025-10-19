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
  const base = process.env.NEXT_PUBLIC_SITE_URL || ''
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

  for (const p of targets) {
    const url = (base ? base.replace(/\/$/, '') : '') + p
    try {
      const res = await fetch(url || p, { method: 'GET', cache: 'no-store' })
      results.push({ path: p, status: res.status })
    } catch (e: any) {
      results.push({ path: p, error: e?.message || String(e) })
    }
  }

  const failures = results.filter((r) => r.status && r.status >= 400)
  return Response.json({ ok: failures.length === 0, results })
}

