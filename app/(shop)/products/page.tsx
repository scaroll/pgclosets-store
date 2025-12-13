import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSort } from '@/components/products/product-sort'
import { Pagination } from '@/components/shared/pagination'
import { PackageOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products - PG Closets',
  description: 'Browse our selection of premium custom closets and storage solutions.',
}

interface ProductsPageProps {
  searchParams: {
    category?: string
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    limit?: string
  }
}

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1')
  const limit = parseInt(searchParams.limit || '24')
  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {}

  // Category filter
  if (searchParams.category) {
    const categories = searchParams.category.split(',')
    where.category = {
      slug: { in: categories }
    }
  }

  // Price range filter
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) {
      where.price.gte = parseInt(searchParams.minPrice) * 100 // Convert to cents
    }
    if (searchParams.maxPrice) {
      where.price.lte = parseInt(searchParams.maxPrice) * 100 // Convert to cents
    }
  }

  // Stock filter
  if (searchParams.inStock === 'true') {
    where.inStock = true
  }

  // Build orderBy clause
  let orderBy: any = { featured: 'desc' } // Default: featured

  switch (searchParams.sort) {
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    case 'price-asc':
      orderBy = { price: 'asc' }
      break
    case 'price-desc':
      orderBy = { price: 'desc' }
      break
    case 'name-asc':
      orderBy = { name: 'asc' }
      break
    case 'name-desc':
      orderBy = { name: 'desc' }
      break
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ])

  return {
    items: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.shortDesc || undefined,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      images: product.images,
      inStock: product.inStock,
      featured: product.featured,
      bestseller: product.bestseller,
      category: product.category ? { name: product.category.name } : undefined,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    categories: categories.map((cat) => ({
      label: cat.name,
      value: cat.slug,
      count: cat._count.products,
    })),
  }
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-apple-dark-bg-secondary rounded-apple-lg overflow-hidden border border-gray-200 dark:border-apple-dark-border animate-pulse"
        >
          <div className="aspect-square bg-gray-200 dark:bg-apple-dark-bg-tertiary" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-apple-dark-bg-tertiary rounded w-1/4" />
            <div className="h-6 bg-gray-200 dark:bg-apple-dark-bg-tertiary rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-apple-dark-bg-tertiary rounded w-full" />
            <div className="h-8 bg-gray-200 dark:bg-apple-dark-bg-tertiary rounded w-1/3" />
            <div className="h-10 bg-gray-200 dark:bg-apple-dark-bg-tertiary rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-apple-dark-bg-tertiary flex items-center justify-center mb-6">
        <PackageOpen className="w-8 h-8 text-gray-400 dark:text-apple-dark-text-tertiary" />
      </div>
      <h3 className="text-2xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-2">
        No products found
      </h3>
      <p className="text-apple-gray-600 dark:text-apple-dark-text-secondary text-center max-w-md mb-6">
        We couldn&apos;t find any products matching your filters. Try adjusting your search criteria.
      </p>
      <Link
        href="/products"
        className="px-6 py-3 bg-apple-blue-500 text-white rounded-apple font-semibold hover:bg-apple-blue-600 transition-colors"
      >
        Clear Filters
      </Link>
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const data = await getProducts(searchParams)

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-apple-dark-bg-elevated py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-apple-gray-600 dark:text-apple-dark-text-secondary">
              <li>
                <Link href="/" className="hover:text-apple-blue-500">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-apple-gray-900 dark:text-apple-dark-text font-medium">
                Products
              </li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-2">
            All Products
          </h1>
          <p className="text-lg text-apple-gray-600 dark:text-apple-dark-text-secondary">
            {data.total} {data.total === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <ProductFilters categories={data.categories} />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-apple-dark-border">
              <ProductSort showViewToggle={false} />
            </div>

            {/* Products */}
            <Suspense fallback={<ProductsLoading />}>
              {data.items.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                    {data.items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={data.page}
                    totalPages={data.totalPages}
                    itemsPerPage={parseInt(searchParams.limit || '24')}
                  />
                </>
              ) : (
                <EmptyState />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
