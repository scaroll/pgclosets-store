import { prisma } from '@/lib/db';
import StandardLayout from '@/components/layout/StandardLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Closet & Sliding Doors | PG Closets Ottawa',
  description: 'Pick a door type to configure size, panels, and finish. Get an instant installed estimate. Barn doors, bypass doors, bifold doors, and more.',
  openGraph: {
    title: 'Shop Closet & Sliding Doors | PG Closets Ottawa',
    description: 'Pick a door type to configure size, panels, and finish. Get an instant installed estimate.',
    url: 'https://www.pgclosets.com/products',
    type: 'website',
  },
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const {
    category,
    sort = 'featured',
    search,
    minPrice,
    maxPrice,
    inStock
  } = searchParams;

  // Build where clause for filtering
  const where: any = {
    status: 'active',
  };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  if (minPrice) {
    where.price = { ...where.price, gte: parseInt(minPrice) * 100 }; // Convert to cents
  }

  if (maxPrice) {
    where.price = { ...where.price, lte: parseInt(maxPrice) * 100 }; // Convert to cents
  }

  if (inStock === 'true') {
    where.inventory = { gt: 0 };
  }

  // Build orderBy clause for sorting
  let orderBy: any = { featured: 'desc' };

  if (sort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else if (sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name') {
    orderBy = { name: 'asc' };
  }

  // Fetch products from database
  const products = await prisma.product.findMany({
    where,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1
      },
      reviews: {
        where: { status: 'approved' },
        select: { rating: true }
      }
    },
    orderBy,
  });

  // Calculate average ratings
  const productsWithRatings = products.map(product => {
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    return {
      ...product,
      averageRating: avgRating,
      reviewCount: product.reviews.length,
    };
  });

  // Get categories for filters
  const categories = await prisma.product.findMany({
    where: { status: 'active' },
    select: { category: true },
    distinct: ['category'],
  });

  const uniqueCategories = categories.map(c => c.category);

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-lg text-gray-600">
            Discover premium doors and hardware for your home
          </p>
        </div>

        {/* Search results info */}
        {search && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-900">
              Showing results for: <span className="font-semibold">"{search}"</span>
              <span className="ml-2 text-sm">({productsWithRatings.length} products found)</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <ProductFilters
              categories={uniqueCategories}
              currentCategory={category}
              currentSort={sort}
              currentMinPrice={minPrice}
              currentMaxPrice={maxPrice}
              currentInStock={inStock}
            />
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {productsWithRatings.length} {productsWithRatings.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Products Grid */}
            {productsWithRatings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsWithRatings.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  No products found matching your criteria.
                </p>
                <a
                  href="/products"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Clear filters and show all products
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </StandardLayout>
  );
}