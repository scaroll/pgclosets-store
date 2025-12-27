import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSort } from '@/components/products/product-sort'
import { Pagination } from '@/components/shared/pagination'
import {
  filterAndSortProducts,
  getAllCategories,
  getProductCountByCategory,
  type ProductFilters as Filters,
  type ProductSortOptions,
} from '@/lib/data/products'
import { PackageOpen } from 'lucide-react'
import type { Metadata } from 'next'
import { Suspense } from 'react'

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

  // Build filters
  const filters: Filters = {}

  if (searchParams.category) {
    filters.category = searchParams.category
  }

  if (searchParams.minPrice) {
    filters.minPrice = parseInt(searchParams.minPrice)
  }

  if (searchParams.maxPrice) {
    filters.maxPrice = parseInt(searchParams.maxPrice)
  }

  if (searchParams.inStock === 'true') {
    filters.inStock = true
  }

  // Build sort options
  let sort: ProductSortOptions | undefined

  switch (searchParams.sort) {
    case 'newest':
      sort = { field: 'createdAt', direction: 'desc' }
      break
    case 'price-asc':
      sort = { field: 'price', direction: 'asc' }
      break
    case 'price-desc':
      sort = { field: 'price', direction: 'desc' }
      break
    case 'name-asc':
      sort = { field: 'name', direction: 'asc' }
      break
    case 'name-desc':
      sort = { field: 'name', direction: 'desc' }
      break
    default:
      sort = { field: 'featured', direction: 'desc' }
  }

  // Get filtered and sorted products
  const result = filterAndSortProducts(filters, sort, { page, limit })

  // Get categories with counts
  const categoryCounts = getProductCountByCategory()
  const categories = getAllCategories().map(cat => ({
    label: cat,
    value: cat.toLowerCase().replace(/\s+/g, '-'),
    count: categoryCounts[cat] || 0,
  }))

  return {
    items: result.products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.shortDescription,
      price: product.price,
      salePrice: product.salePrice,
      images: product.images,
      inStock: product.inStock,
      featured: product.featured,
      bestseller: product.bestseller,
      category: { name: product.category },
    })),
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    categories,
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
        We couldn't find any products matching your filters. Try adjusting your search criteria.
      </p>
      <a
        href="/products"
        className="rounded-apple bg-apple-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-apple-blue-600"
      >
        Clear Filters
      </a>
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const data = await getProducts(searchParams)

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      {/* Page Header */}
      <div className="bg-gray-50 py-12 dark:bg-apple-dark-bg-elevated">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-apple-gray-600 dark:text-apple-dark-text-secondary">
              <li>
                <a href="/" className="hover:text-apple-blue-500">
                  Home
                </a>
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
