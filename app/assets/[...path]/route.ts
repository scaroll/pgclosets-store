import fs from 'node:fs/promises'
import fss from 'node:fs'
import path from 'node:path'

function mimeTypeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await ctx.params
  const safe = parts.join('/')
  if (safe.includes('..')) return new Response('Bad path', { status: 400 })

  const filePath = path.join(process.cwd(), 'public', 'images', safe)
  const mapped = mapAliasIfMissing(filePath)
  try {
    const data = await fs.readFile(mapped)
    const ext = path.extname(mapped)
    const mime = mimeTypeFromExt(ext)
    return new Response(data, {
      status: 200,
      headers: {
        'content-type': mime,
        // Set long cache to leverage CDN for actual assets
        'cache-control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}

function mapAliasIfMissing(full: string): string {
  if (fss.existsSync(full)) return full
  const pub = path.join(process.cwd(), 'public')
  const rel = path.relative(pub, full).replace(/\\/g, '/') // images/... path
  const m = rel.match(/^images\/(.+)$/)
  if (!m) return full
  const p = m[1] // e.g., products/bypass-modern-minimalist-hero.jpg
  const mappedRel = aliasForProductPath(p)
  if (!mappedRel) return full
  const mappedFull = path.join(pub, 'images', mappedRel)
  return fss.existsSync(mappedFull) ? mappedFull : full
}

function aliasForProductPath(p: string): string | undefined {
  // Only handle products/*
  if (!p.startsWith('products/')) return undefined
  const name = p.replace(/^products\//, '').replace(/\.jpg$/i, '')
  // Determine prefix and suffix by last hyphen chunk
  const parts = name.split('-')
  const suffix = parts.pop() || ''
  const prefix = parts.join('-')

  const groupMap: Record<string, string> = {
    'bypass-modern-minimalist': 'bypass-door',
    'bypass-mirror-traditional': 'mirror-door',
    'bifold-shaker-white': 'bifold-door',
    'pivot-frosted-contemporary': 'pivot-door',
    'barn-steel-contemporary': 'barn-door',
    'room-divider-accordion': 'door',
  }

  // Find known group key
  let key: string | undefined
  for (const k of Object.keys(groupMap)) if (prefix.startsWith(k)) { key = k; break }
  if (!key) return undefined

  const base = groupMap[key]
  // Map suffix to available fallback file names
  const suffixMap: Record<string, string> = {
    hero: 'main',
    og: 'main',
    room: 'lifestyle',
    track: 'hardware',
    stacked: 'lifestyle',
    open: 'open',
    detail: 'detail',
    lifestyle: 'lifestyle',
    installation: base.startsWith('bypass') ? 'system' : (base.startsWith('bifold') ? 'installation' : 'detail'),
  }

  let mappedSuffix = suffixMap[suffix]
  // Adjustments when specific fallback variants don't exist
  if (!mappedSuffix) return undefined
  if (base === 'mirror-door' && suffix === 'detail') mappedSuffix = 'frame'
  if ((base === 'bifold-door' || base === 'pivot-door') && suffix === 'lifestyle') mappedSuffix = 'open'
  if (!mappedSuffix) return undefined
  const candidate = `products/${base}-${mappedSuffix}.jpg`
  return candidate
}
