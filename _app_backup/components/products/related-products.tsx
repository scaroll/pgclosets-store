import { getProductsByCategory } from '@/lib/data/products'
import { ProductCard } from './product-card'

interface RelatedProductsProps {
  category: string
  currentProductId: string
  limit?: number
}

export function RelatedProducts({ category, currentProductId, limit = 4 }: RelatedProductsProps) {
  // Get products by category from the JSON-based data layer
  const allRelatedProducts = getProductsByCategory(category)

  // Filter out the current product and limit the results
  const products = allRelatedProducts
    .filter(product => product.id !== currentProductId)
    .slice(0, limit)

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t pt-16">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold">You May Also Like</h2>
        <p className="text-muted-foreground">Similar products from our collection</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              images: product.images,
            }}
          />
        ))}
      </div>
    </section>
  )
}
