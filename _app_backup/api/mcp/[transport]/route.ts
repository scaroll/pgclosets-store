import { createMcpHandler } from 'mcp-handler'
import fs from 'node:fs/promises'
import path from 'node:path'
import products from '../../../../data/pgclosets-products.json'
import { z } from 'zod'

function determineCategory(slug: string): { category: string; images: string[]; description: string } {
  const s = slug.toLowerCase()
  if (s.includes('barn'))
    return {
      category: 'Barn Doors',
      images: [
        '/images/products/barn-door-main.jpg',
        '/images/products/barn-door-detail.jpg',
        '/images/products/barn-door-hardware.jpg',
        '/images/products/barn-door-lifestyle.jpg',
      ],
      description: 'Premium barn door with modern design',
    }
  if (s.includes('bifold'))
    return {
      category: 'Bifold Doors',
      images: [
        '/images/products/bifold-door-main.jpg',
        '/images/products/bifold-door-open.jpg',
        '/images/products/bifold-door-detail.jpg',
        '/images/products/bifold-door-installation.jpg',
      ],
      description: 'Space-saving bifold doors for closets',
    }
  if (s.includes('bypass'))
    return {
      category: 'Bypass Doors',
      images: [
        '/images/products/bypass-door-main.jpg',
        '/images/products/bypass-door-system.jpg',
        '/images/products/bypass-door-detail.jpg',
        '/images/products/bypass-door-lifestyle.jpg',
      ],
      description: 'Smooth-glide bypass door systems',
    }
  if (s.includes('pivot'))
    return {
      category: 'Pivot Doors',
      images: [
        '/images/products/pivot-door-main.jpg',
        '/images/products/pivot-door-open.jpg',
        '/images/products/pivot-door-hardware.jpg',
        '/images/products/pivot-door-detail.jpg',
      ],
      description: 'Modern pivot doors with premium hardware',
    }
  if (s.includes('hardware'))
    return {
      category: 'Hardware',
      images: [
        '/images/products/hardware-main.jpg',
        '/images/products/hardware-detail.jpg',
        '/images/products/hardware-finish.jpg',
        '/images/products/hardware-installation.jpg',
      ],
      description: 'Closet door hardware and finishes',
    }
  if (s.includes('mirror'))
    return {
      category: 'Mirror Doors',
      images: [
        '/images/products/mirror-door-main.jpg',
        '/images/products/mirror-door-reflection.jpg',
        '/images/products/mirror-door-frame.jpg',
        '/images/products/mirror-door-lifestyle.jpg',
      ],
      description: 'Refined mirrored closet doors',
    }
  return {
    category: 'Default',
    images: [
      '/images/products/door-main.jpg',
      '/images/products/door-detail.jpg',
      '/images/products/door-hardware.jpg',
      '/images/products/door-lifestyle.jpg',
    ],
    description: 'General closet door images',
  }
}

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'ping',
      'Health check tool; returns pong with timestamp',
      {},
      async () => ({
        content: [
          { type: 'text', text: `pong ${new Date().toISOString()}` },
        ],
      }),
    )

    server.tool(
      'get_product_images',
      'Return recommended product images for a given slug',
      { slug: z.string().min(1) },
      async ({ slug }) => {
        const result = determineCategory(slug)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      },
    )

    server.tool(
      'vercel_cache_guidance',
      'Explain how to purge CDN cache for /images/* in Vercel UI',
      {},
      async () => ({
        content: [
          {
            type: 'text',
            text:
              'In Vercel Dashboard → Project → Settings → Domains → Purge Cache. Add /images/products/* and /images/services/*, then Redeploy from latest. 404s for these assets were cached; vercel.json now sets no-store for /404 to prevent sticky 404s.',
          },
        ],
      }),
    )

    server.tool(
      'product_meta_by_slug',
      'Return product metadata from pgclosets-products.json by slug',
      { slug: z.string().min(1) },
      async ({ slug }) => {
        const list = (products as any[])
        const hit = list.find((p) => p.slug === slug || p.id === slug)
        if (!hit) {
          return {
            content: [
              { type: 'text', text: JSON.stringify({ found: false }) },
            ],
          }
        }
        return {
          content: [
            { type: 'text', text: JSON.stringify({ found: true, product: hit }) },
          ],
        }
      },
    )

    server.tool(
      'asset_check',
      'Check if a public asset exists on disk',
      { path: z.string().min(1) },
      async ({ path: rel }) => {
        const root = process.cwd()
        const full = path.join(root, 'public', rel.replace(/^\/+/, ''))
        try {
          const st = await fs.stat(full)
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ exists: true, size: st.size, path: rel }),
              },
            ],
          }
        } catch (e: any) {
          return {
            content: [
              { type: 'text', text: JSON.stringify({ exists: false, path: rel }) },
            ],
          }
        }
      },
    )

    server.tool(
      'verify_product_media',
      'Verify media files for a given product slug or id exist in public folder',
      { slug: z.string().min(1) },
      async ({ slug }) => {
        const list = products as any[]
        const product = list.find((p) => p.slug === slug || p.id === slug)
        if (!product) {
          return {
            content: [
              { type: 'text', text: JSON.stringify({ found: false, slug }) },
            ],
          }
        }

        const urls: string[] = []
        if (Array.isArray(product.media)) {
          for (const m of product.media) {
            if (m?.url) urls.push(String(m.url))
          }
        }
        if (product?.seo?.ogImage) urls.push(String(product.seo.ogImage))

        const root = process.cwd()
        const results: Array<{ path: string; exists: boolean; size?: number }> = []
        for (const u of urls) {
          const rel = u.replace(/^\/+/, '')
          const full = path.join(root, 'public', rel)
          try {
            const st = await fs.stat(full)
            results.push({ path: u, exists: true, size: st.size })
          } catch {
            results.push({ path: u, exists: false })
          }
        }
        const missing = results.filter((r) => !r.exists)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  found: true,
                  slug: product.slug,
                  id: product.id,
                  counts: { total: results.length, missing: missing.length },
                  missing,
                },
                null,
                2,
              ),
            },
          ],
        }
      },
    )

    server.tool(
      'bulk_verify_media',
      'Scan multiple products for missing media (default limit 100)',
      { limit: z.number().int().min(1).max(2000).optional() },
      async ({ limit }) => {
        const list = (products as any[])
        const max = Math.min(list.length, limit ?? 100)
        const root = process.cwd()
        const summary: any[] = []
        for (let i = 0; i < max; i++) {
          const p = list[i]
          const urls: string[] = []
          if (Array.isArray(p.media)) {
            for (const m of p.media) if (m?.url) urls.push(String(m.url))
          }
          if (p?.seo?.ogImage) urls.push(String(p.seo.ogImage))
          const missing: string[] = []
          for (const u of urls) {
            const rel = u.replace(/^\/+/, '')
            const full = path.join(root, 'public', rel)
            try {
              await fs.stat(full)
            } catch {
              missing.push(u)
            }
          }
          if (missing.length) {
            summary.push({ slug: p.slug, id: p.id, missingCount: missing.length, missing })
          }
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  scanned: max,
                  withMissing: summary.length,
                  items: summary,
                },
                null,
                2,
              ),
            },
          ],
        }
      },
    )
  },
  {
    // Optional server options / capabilities could be set here
  },
  {
    basePath: '/api/mcp',
    verboseLogs: true,
    maxDuration: 60,
  },
)

export { handler as GET, handler as POST }
