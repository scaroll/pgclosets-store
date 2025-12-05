import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PackageOpen } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSort } from '@/components/products/product-sort'
import { Pagination } from '@/components/shared/pagination'
import { Breadcrumbs } from '@/components/seo'
import { getCategoryData, isValidCategory, getAllCategorySlugs } from '@/lib/data/categories'
import { simpleProducts } from '@/data/simple-products'

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
// Helper Functions
// ============================================================================

/**
 * Map category slug to display name
 */
function getCategoryNameFromSlug(slug: string): string {
  const categoryMap: Record<string, string> = {
    'barn-doors': 'Barn Doors',
    'bifold-doors': 'Bifold Doors',
    'bypass-doors': 'Bypass Doors',
    'glass-doors': 'Glass Doors',
    'hardware': 'Hardware',
  }
  return categoryMap[slug] || slug
}

/**
 * Get products from JSON data fallback
 */
function getCategoryProductsFromJSON(
  categorySlug: string,
  searchParams: CategoryPageProps['searchParams']
) {
  const categoryName = getCategoryNameFromSlug(categorySlug)
  const page = parseInt(searchParams.page || '1')
  const limit = parseInt(searchParams.limit || '24')
  const skip = (page - 1) * limit

  // Filter products by category
  let filteredProducts = simpleProducts.filter(
    product => product.category === categoryName
  )

  // Apply price filter
  if (searchParams.minPrice || searchParams.maxPrice) {
    const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) : 0
    const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : Infinity

    filteredProducts = filteredProducts.filter(product => {
      const productPrice = product.price
      return productPrice >= minPrice && productPrice <= maxPrice
    })
  }

  // Apply sorting
  const sortedProducts = [...filteredProducts]
  switch (searchParams.sort) {
    case 'newest':
      // JSON data doesn't have createdAt, keep original order
      break
    case 'price-asc':
      sortedProducts.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sortedProducts.sort((a, b) => b.price - a.price)
      break
    case 'name-asc':
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
      break
  }

  // Apply pagination
  const paginatedProducts = sortedProducts.slice(skip, skip + limit)

  // Transform to expected format
  const items = paginatedProducts.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.id, // Using id as slug for JSON products
    description: product.description,
    price: product.price * 100, // Convert to cents
    salePrice: undefined,
    images: [product.image],
    inStock: true, // Assume in stock for JSON data
    featured: false,
    bestseller: false,
    category: { name: product.category },
  }))

  return {
    items,
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
    category: {
      id: categorySlug,
      name: categoryName,
      slug: categorySlug,
    },
  }
}

// ============================================================================
// Metadata Generation
// ============================================================================
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
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
export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({
    category: slug,
  }))
}

// ============================================================================
// Data Fetching
// ============================================================================
async function getCategoryProducts(
  categorySlug: string,
  searchParams: CategoryPageProps['searchParams']
) {
  // Try database first, fall back to JSON data if unavailable
  try {
    const page = parseInt(searchParams.page || '1')
    const limit = parseInt(searchParams.limit || '24')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      category: {
        slug: categorySlug
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

    const [products, total, category] = await Promise.all([
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
      prisma.category.findUnique({
        where: { slug: categorySlug },
        select: {
          id: true,
          name: true,
          slug: true,
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
      category,
    }
  } catch (error) {
    // Database unavailable, use JSON data fallback
    console.warn('Database unavailable, using JSON data fallback:', error)
    return getCategoryProductsFromJSON(categorySlug, searchParams)
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
        We couldn't find any {categoryName.toLowerCase()} matching your filters. Try adjusting your search criteria or browse all products.
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
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { name: 'Collections', url: '/collections' },
              { name: categoryData.name, url: `/collections/${categoryData.slug}` }
            ]}
            className="[&_a]:text-white/90 [&_a]:hover:text-white [&_span]:text-white [&_.text-gray-400]:text-white/60"
          />
        </div>

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
  const data = await getCategoryProducts(params.category, searchParams)

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
