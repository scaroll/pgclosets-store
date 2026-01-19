import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilters } from '@/components/products/ProductFilters'
import { prisma } from '@/lib/db/client'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; search?: string }
}) {
  const { category, sort = 'featured', search } = searchParams

  const products = await prisma.product.findMany({
    where: {
      status: 'active',
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      images: { orderBy: { position: 'asc' }, take: 1 },
    },
    orderBy:
      sort === 'price-asc'
        ? { price: 'asc' }
        : sort === 'price-desc'
          ? { price: 'desc' }
          : sort === 'newest'
            ? { createdAt: 'desc' }
            : { featured: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Our Products</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <ProductFilters />
        </aside>

        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
