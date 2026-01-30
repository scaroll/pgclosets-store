import type { NextRequest } from 'next/server'

export const maxDuration = 30

function determineCategory(slug: string): {
  category: string
  images: string[]
  description: string
} {
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || ''
  if (!slug) return Response.json({ error: 'slug is required' }, { status: 400 })
  const result = determineCategory(slug)
  return Response.json(result)
}
