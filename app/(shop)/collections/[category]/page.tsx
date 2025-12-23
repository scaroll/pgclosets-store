import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PackageOpen } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSort } from '@/components/products/product-sort'
import { Pagination } from '@/components/shared/pagination'
import { getCategoryData, isValidCategory, getAllCategorySlugs } from '@/lib/data/categories'
import {
  filterAndSortProducts,
  type ProductFilters as Filters,
  type ProductSortOptions,
} from '@/lib/data/products'

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    limit?: string
  }
}

// ============================================================================
// Metadata Generation
// ============================================================================
export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    return {
      title: 'Category Not Found - PG Closets',
      description: 'The requested category could not be found.',
    }
  }

  return {
    title: categoryData.metaTitle,
    description: categoryData.metaDescription,
    keywords: categoryData.keywords,
    openGraph: {
      title: categoryData.metaTitle,
      description: categoryData.metaDescription,
      type: 'website',
      images: [
        {
          url: categoryData.heroImage,
          width: 1200,
          height: 630,
          alt: categoryData.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: categoryData.metaTitle,
      description: categoryData.metaDescription,
      images: [categoryData.heroImage],
    },
  }
}

// ============================================================================
// Static Params Generation (for static site generation)
// ============================================================================
export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({
    category: slug,
  }))
}

// ============================================================================
// Data Fetching
// ============================================================================
function getCategoryProducts(
  categorySlug: string,
  searchParams: CategoryPageProps['searchParams']
) {
  const page = parseInt(searchParams.page || '1')
  const limit = parseInt(searchParams.limit || '24')

  // Get category data to map to proper name
  const categoryData = getCategoryData(categorySlug)
  if (!categoryData) {
    return {
      items: [],
      total: 0,
      page,
      totalPages: 0,
      category: null,
    }
  }

  // Build filters
  const filters: Filters = {
    category: categoryData.name, // Use the proper category name
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

  return {
    items: result.products.map((product) => ({
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
    category: {
      id: categorySlug,
      name: categoryData.name,
      slug: categorySlug,
    },
  }
}

// ============================================================================
// Loading State
// ============================================================================
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

// ============================================================================
// Empty State
// ============================================================================
function EmptyState({ categoryName }: { categoryName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-apple-dark-bg-tertiary flex items-center justify-center mb-6">
        <PackageOpen className="w-8 h-8 text-gray-400 dark:text-apple-dark-text-tertiary" />
      </div>
      <h3 className="text-2xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-2">
        No products found
      </h3>
      <p className="text-apple-gray-600 dark:text-apple-dark-text-secondary text-center max-w-md mb-6">
        We couldn&apos;t find any {categoryName.toLowerCase()} matching your filters. Try adjusting your search criteria or browse all products.
      </p>
      <div className="flex gap-4">
        <Link
          href={`/collections/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
          className="px-6 py-3 bg-apple-blue-500 text-white rounded-apple font-semibold hover:bg-apple-blue-600 transition-colors"
        >
          Clear Filters
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 border border-gray-300 dark:border-apple-dark-border rounded-apple font-semibold hover:bg-gray-50 dark:hover:bg-apple-dark-bg-tertiary transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  )
}

// ============================================================================
// Category Hero Component
// ============================================================================
function CategoryHero({ categoryData }: { categoryData: NonNullable<ReturnType<typeof getCategoryData>> }) {
  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-apple-dark-bg-elevated dark:to-apple-dark-bg-secondary">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={categoryData.heroImage}
          alt={categoryData.name}
          fill
          className="object-cover opacity-20 dark:opacity-10"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent dark:from-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-white/90">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/collections" className="hover:text-white transition-colors">
                Collections
              </Link>
            </li>
            <li>/</li>
            <li className="text-white font-medium">
              {categoryData.name}
            </li>
          </ol>
        </nav>

        {/* Title and Description */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {categoryData.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            {categoryData.description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Validate category
  if (!isValidCategory(params.category)) {
    notFound()
  }

  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    notFound()
  }

  // Fetch products
  const data = getCategoryProducts(params.category, searchParams)

  // If category doesn't exist in database, show empty state
  if (!data.category) {
    return (
      <main className="min-h-screen bg-background">
        <CategoryHero categoryData={categoryData} />
        <div className="container mx-auto px-4 py-12">
          <EmptyState categoryName={categoryData.name} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Category Hero */}
      <CategoryHero categoryData={categoryData} />

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Product Count */}
        <div className="mb-8">
          <p className="text-lg text-apple-gray-600 dark:text-apple-dark-text-secondary">
            {data.total} {data.total === 1 ? 'product' : 'products'} available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <ProductFilters />
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
                <EmptyState categoryName={categoryData.name} />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
