import { prisma } from '@/lib/prisma'
import { ProductCard } from './product-card'
import { getAllProducts } from '@/lib/data/products-json'

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
  limit?: number
}

export async function RelatedProducts({
  categoryId,
  currentProductId,
  limit = 4,
}: RelatedProductsProps) {
  let products: Array<{
    id: string
    name: string
    slug: string
    description: string
    shortDesc?: string | null
    price: number | string
    salePrice?: number | string | null
    images: string[]
    category: { name: string }
  }> = []

  try {
    // Try to fetch from Prisma first
    products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
        inStock: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDesc: true,
        price: true,
        salePrice: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    // Fallback to JSON data if Prisma fails
    console.warn('Prisma unavailable for related products, using JSON fallback:', error)

    try {
      const allProducts = getAllProducts()

      // Filter products by category
      // categoryId might be a UUID (from Prisma) or a category slug/name (from JSON)
      const filteredProducts = allProducts.filter((product) => {
        // Exclude current product
        if (product.id === currentProductId || product.slug === currentProductId) {
          return false
        }

        // Only show in-stock products
        if (!product.inStock) {
          return false
        }

        // Match by category: check if categoryId matches category slug or name
        // product.category is a ProductCategory type (e.g., 'barn-doors')
        const categoryMatch =
          product.category === categoryId || // Direct category match
          product.category.toLowerCase() === categoryId.toLowerCase() // Case-insensitive match

        return categoryMatch
      })

      // Transform to match the expected format and limit results
      products = filteredProducts.slice(0, limit).map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDesc: `${product.description.substring(0, 150)}...`,
        price: product.price / 100, // Convert from cents to dollars
        salePrice: product.salePrice ? product.salePrice / 100 : null,
        images: product.images,
        category: {
          // Convert category slug to readable name
          name: product.category
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
        },
      }))
    } catch (jsonError) {
      console.error('Error loading products from JSON:', jsonError)
      return null
    }
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-16 border-t">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">You May Also Like</h2>
        <p className="text-muted-foreground">
          Similar products from our collection
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.slug}
            name={product.name}
            description={product.shortDesc || product.description}
            price={Number(product.salePrice || product.price)}
            image={product.images[0] || '/placeholder.jpg'}
            category={product.category.name}
            href={`/products/${product.slug}`}
          />
        ))}
      </div>
    </section>
  )
}
