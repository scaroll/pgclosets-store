/**
 * Static product data for fallback when database is not available.
 * Converts Renin product catalog to the format expected by ProductCard component.
 */

import { reninProducts } from '@/data/renin-products-integrated'

// Category mapping from collection handles to display names
const categoryMap: Record<string, string> = {
  'renin-barn-doors': 'Barn Doors',
  'renin-bifold-doors': 'Bifold Doors',
  'renin-bypass-doors': 'Bypass Doors',
  'renin-sliding-doors': 'Sliding Doors',
  'renin-glass-doors': 'Glass Doors',
  'renin-hardware': 'Hardware',
}

export interface StaticProduct {
  id: string
  name: string
  slug: string
  shortDesc?: string
  price: number
  salePrice?: number
  images: string[]
  inStock: boolean
  featured: boolean
  bestseller: boolean
  category?: { name: string; slug: string }
}

/**
 * Convert Renin products to the format expected by ProductCard
 */
export const staticProducts: StaticProduct[] = reninProducts.map((product, index) => {
  // Get price from first variant, or use a default
  const price = product.variants?.[0]?.price ?? 49900

  // Determine if product should be featured (first 6 products)
  const featured = index < 6

  // Determine if product should be bestseller (every 5th product)
  const bestseller = index % 5 === 0

  // Get category from collection
  const categorySlug = product.collection?.handle ?? 'barn-doors'
  const categoryName = categoryMap[categorySlug] ?? product.collection?.title ?? 'Barn Doors'

  return {
    id: product.id,
    name: product.title,
    slug: product.handle,
    shortDesc:
      product.description?.slice(0, 150) + (product.description?.length > 150 ? '...' : ''),
    price,
    salePrice: undefined, // No sales in static data
    images: product.images?.map(img => img.url) ?? [product.thumbnail ?? '/placeholder.jpg'],
    inStock: true, // All static products are in stock
    featured,
    bestseller,
    category: {
      name: categoryName,
      slug: categorySlug.replace('renin-', ''),
    },
  }
})

/**
 * Get unique categories from static products
 */
export const staticCategories = Array.from(
  new Map(
    staticProducts
      .filter(
        (p): p is StaticProduct & { category: NonNullable<StaticProduct['category']> } =>
          p.category !== undefined
      )
      .map(p => [p.category.slug, p.category])
  ).values()
).map(cat => ({
  label: cat.name,
  value: cat.slug,
  count: staticProducts.filter(p => p.category?.slug === cat.slug).length,
}))

/**
 * Check if we should use static data (no database connection)
 */
export const shouldUseStaticData = !process.env.DATABASE_URL
