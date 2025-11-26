import { prisma } from '@/lib/prisma'
import { ProductCard } from './product-card'

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
  const products = await prisma.product.findMany({
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
