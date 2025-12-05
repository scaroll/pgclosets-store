/**
 * Example Usage of JSON Product Data Access Layer
 *
 * This file demonstrates how to use the products-json utility
 * as a fallback when the database is unavailable.
 */

import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductCategories,
  getFeaturedProducts,
  getNewProducts,
  searchProducts,
  getProductsByIds,
  getProductStats,
} from './products-json'

// Example 1: Get all products
export function example1_getAllProducts() {
  const products = getAllProducts()
  console.log(`Total products: ${products.length}`)
  return products
}

// Example 2: Get a single product by slug
export function example2_getProductBySlug() {
  const product = getProductBySlug('renin-modern-barn-door-black')

  if (product) {
    console.log(`Found product: ${product.name}`)
    console.log(`Price: $${product.price / 100}`)
    console.log(`Category: ${product.category}`)
    console.log(`In Stock: ${product.inStock}`)
    console.log(`Variants: ${product.variants?.length || 0}`)
  } else {
    console.log('Product not found')
  }

  return product
}

// Example 3: Get products by category
export function example3_getProductsByCategory() {
  const barnDoors = getProductsByCategory('barn-doors')
  const bifoldDoors = getProductsByCategory('bifold-doors')
  const bypassDoors = getProductsByCategory('bypass-doors')

  console.log(`Barn doors: ${barnDoors.length}`)
  console.log(`Bifold doors: ${bifoldDoors.length}`)
  console.log(`Bypass doors: ${bypassDoors.length}`)

  return { barnDoors, bifoldDoors, bypassDoors }
}

// Example 4: Get all categories
export function example4_getProductCategories() {
  const categories = getProductCategories()
  console.log(`Categories: ${categories.join(', ')}`)
  return categories
}

// Example 5: Get featured products
export function example5_getFeaturedProducts() {
  const allFeatured = getFeaturedProducts()
  const top5Featured = getFeaturedProducts(5)

  console.log(`Total featured products: ${allFeatured.length}`)
  console.log(`Top 5 featured: ${top5Featured.map(p => p.name).join(', ')}`)

  return top5Featured
}

// Example 6: Get new products
export function example6_getNewProducts() {
  const newProducts = getNewProducts(10)
  console.log(`New products: ${newProducts.length}`)
  return newProducts
}

// Example 7: Search products
export function example7_searchProducts() {
  const searchResults = searchProducts('barn')
  console.log(`Search results for 'barn': ${searchResults.length} products`)

  const modernResults = searchProducts('modern')
  console.log(`Search results for 'modern': ${modernResults.length} products`)

  return searchResults
}

// Example 8: Get products by IDs
export function example8_getProductsByIds() {
  const ids = ['renin-barn-modern-01', 'renin-barn-rustic-01']
  const products = getProductsByIds(ids)

  console.log(`Found ${products.length} products by IDs`)
  return products
}

// Example 9: Get product statistics
export function example9_getProductStats() {
  const stats = getProductStats()

  console.log('Product Statistics:')
  console.log(`- Total: ${stats.total}`)
  console.log(`- In Stock: ${stats.inStock}`)
  console.log(`- Out of Stock: ${stats.outOfStock}`)
  console.log(`- Featured: ${stats.featured}`)
  console.log(`- New: ${stats.new}`)
  console.log('By Category:')
  Object.entries(stats.byCategory).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count}`)
  })

  return stats
}

// Example 10: Using in a Next.js API route or Server Component
export async function example10_serverComponent() {
  // This can be used in Server Components or API routes as a fallback
  try {
    // Try to fetch from database first
    // const products = await db.product.findMany()
    // if (products.length === 0) throw new Error('No products in DB')
    // return products

    // If database fails, use JSON fallback
    throw new Error('Database unavailable')
  } catch (error) {
    console.warn('Database unavailable, using JSON fallback')
    const products = getAllProducts()
    return products
  }
}

// Example 11: Product detail page with fallback
export async function example11_productDetailPage(slug: string) {
  try {
    // Try database first
    // const product = await db.product.findUnique({ where: { slug } })
    // if (!product) throw new Error('Not found')
    // return product

    // Fallback to JSON
    throw new Error('Database unavailable')
  } catch (error) {
    console.warn('Using JSON fallback for product detail')
    const product = getProductBySlug(slug)

    if (!product) {
      throw new Error('Product not found')
    }

    return product
  }
}

// Example 12: Filter and sort products
export function example12_filterAndSort() {
  const allProducts = getAllProducts()

  // Filter by price range (e.g., $400-$700)
  const midRangeProducts = allProducts.filter(
    (p) => p.price >= 40000 && p.price <= 70000
  )

  // Sort by price (low to high)
  const sortedByPrice = [...allProducts].sort((a, b) => a.price - b.price)

  // Sort by name (alphabetical)
  const sortedByName = [...allProducts].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  console.log(`Mid-range products ($400-$700): ${midRangeProducts.length}`)
  console.log(`Cheapest product: ${sortedByPrice[0]?.name}`)
  console.log(`Most expensive: ${sortedByPrice[sortedByPrice.length - 1]?.name}`)

  return { midRangeProducts, sortedByPrice, sortedByName }
}

// Run all examples (for testing)
export function runAllExamples() {
  console.log('\n=== Example 1: Get All Products ===')
  example1_getAllProducts()

  console.log('\n=== Example 2: Get Product By Slug ===')
  example2_getProductBySlug()

  console.log('\n=== Example 3: Get Products By Category ===')
  example3_getProductsByCategory()

  console.log('\n=== Example 4: Get Product Categories ===')
  example4_getProductCategories()

  console.log('\n=== Example 5: Get Featured Products ===')
  example5_getFeaturedProducts()

  console.log('\n=== Example 6: Get New Products ===')
  example6_getNewProducts()

  console.log('\n=== Example 7: Search Products ===')
  example7_searchProducts()

  console.log('\n=== Example 8: Get Products By IDs ===')
  example8_getProductsByIds()

  console.log('\n=== Example 9: Get Product Stats ===')
  example9_getProductStats()

  console.log('\n=== Example 12: Filter and Sort ===')
  example12_filterAndSort()
}
