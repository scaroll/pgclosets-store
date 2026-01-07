import { Suspense } from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilters } from '@/components/products/ProductFilters'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ category?: string; sort?: string; search?: string }>

async function getProducts(paramsPromise: SearchParams) {
  try {
    const { prisma } = await import('@/lib/db/client')
    const params = await paramsPromise
    const { category, sort = 'featured', search } = params

    return await prisma.product.findMany({
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
  } catch (error) {
    console.warn('Database unavailable, showing empty products list:', error)
    return []
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const products = await getProducts(searchParams)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Our Products</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-48 animate-pulse rounded bg-gray-100" />}>
            <ProductFilters />
          </Suspense>
        </aside>

        <main className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
              <p className="text-xl font-medium">No products found</p>
              <p className="mt-2">Check back soon for our latest collection!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
