import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSort } from '@/components/products/product-sort'
import { Pagination } from '@/components/shared/pagination'
import { PackageOpen } from 'lucide-react'
import { staticProducts, staticCategories, shouldUseStaticData } from '@/lib/static-products'
import type { Prisma } from '@prisma/client'

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

  // Use static data if no database connection
  if (shouldUseStaticData) {
    return getStaticProducts(searchParams, page, limit, skip)
  }

  // Build where clause
  const where: Prisma.ProductWhereInput = {}

  // Category filter
  if (searchParams.category) {
    const categoryList = searchParams.category.split(',')
    where.category = {
      slug: { in: categoryList },
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
  let orderBy: Prisma.ProductOrderByWithRelationInput = { featured: 'desc' } // Default: featured

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

  // Fall back to static data if database returned no products
  if (products.length === 0 && total === 0) {
    return getStaticProducts(searchParams, page, limit, skip)
  }

  return {
    items: products.map(product => ({
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
    categories: categories.map(cat => ({
      label: cat.name,
      value: cat.slug,
      count: cat._count.products,
    })),
  }
}

/**
 * Get products from static data with filtering and pagination
 */
function getStaticProducts(
  searchParams: ProductsPageProps['searchParams'],
  page: number,
  limit: number,
  skip: number
) {
  let filtered = [...staticProducts]

  // Category filter
  if (searchParams.category) {
    const categories = searchParams.category.split(',')
    filtered = filtered.filter(p => p.category && categories.includes(p.category.slug))
  }

  // Price range filter
  if (searchParams.minPrice) {
    const minPrice = parseInt(searchParams.minPrice) * 100
    filtered = filtered.filter(p => p.price >= minPrice)
  }
  if (searchParams.maxPrice) {
    const maxPrice = parseInt(searchParams.maxPrice) * 100
    filtered = filtered.filter(p => p.price <= maxPrice)
  }

  // Stock filter
  if (searchParams.inStock === 'true') {
    filtered = filtered.filter(p => p.inStock)
  }

  // Sorting
  switch (searchParams.sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    default:
      // Default: featured first
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }

  const total = filtered.length
  const paginated = filtered.slice(skip, skip + limit)

  return {
    items: paginated.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.shortDesc,
      price: product.price,
      salePrice: product.salePrice,
      images: product.images,
      inStock: product.inStock,
      featured: product.featured,
      bestseller: product.bestseller,
      category: product.category ? { name: product.category.name } : undefined,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    categories: staticCategories,
  }
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-apple-lg border border-gray-200 bg-white dark:border-apple-dark-border dark:bg-apple-dark-bg-secondary"
        >
          <div className="aspect-square bg-gray-200 dark:bg-apple-dark-bg-tertiary" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-apple-dark-bg-tertiary" />
            <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-apple-dark-bg-tertiary" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-apple-dark-bg-tertiary" />
            <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-apple-dark-bg-tertiary" />
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-apple-dark-bg-tertiary" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-apple-dark-bg-tertiary">
        <PackageOpen className="h-8 w-8 text-gray-400 dark:text-apple-dark-text-tertiary" />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-apple-gray-900 dark:text-apple-dark-text">
        No products found
      </h3>
      <p className="mb-6 max-w-md text-center text-apple-gray-600 dark:text-apple-dark-text-secondary">
        We couldn&apos;t find any products matching your filters. Try adjusting your search
        criteria.
      </p>
      <Link
        href="/products"
        className="rounded-apple bg-apple-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-apple-blue-600"
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
      <div className="bg-gray-50 py-12 dark:bg-apple-dark-bg-elevated">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-apple-gray-600 dark:text-apple-dark-text-secondary">
              <li>
                <Link href="/" className="hover:text-apple-blue-500">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-apple-gray-900 dark:text-apple-dark-text">
                Products
              </li>
            </ol>
          </nav>

          <h1 className="mb-2 text-4xl font-bold text-apple-gray-900 dark:text-apple-dark-text md:text-5xl">
            All Products
          </h1>
          <p className="text-lg text-apple-gray-600 dark:text-apple-dark-text-secondary">
            {data.total} {data.total === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-64">
            <ProductFilters categories={data.categories} />
          </aside>

          {/* Products Grid */}
          <div className="min-w-0 flex-1">
            {/* Sort Controls */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-6 dark:border-apple-dark-border">
              <ProductSort showViewToggle={false} />
            </div>

            {/* Products */}
            <Suspense fallback={<ProductsLoading />}>
              {data.items.length > 0 ? (
                <>
                  <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {data.items.map(product => (
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
