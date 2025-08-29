import { arcatProducts, productCategories, getProductsByCategory, searchProducts } from "@/lib/enhanced-renin-products"
import { ProductGrid } from "@/components/store/product-grid"
import { ProductFilters } from "@/components/store/product-filters"

interface ProductsPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
  }
}

export const metadata = {
  title: "All Products | Premium Closet Doors | PG Closets Ottawa",
  description:
    "Browse our complete catalog of premium Renin closet doors. Barn doors, bypass doors, bifold doors, pivot doors and hardware.",
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search, sort } = searchParams

  let filteredProducts = arcatProducts

  // Filter by category
  if (category) {
    filteredProducts = getProductsByCategory(category)
  }

  // Filter by search
  if (search) {
    filteredProducts = searchProducts(search)
    // If category is also selected, filter the search results by category
    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.category === category)
    }
  }

  // Sort products
  if (sort) {
    switch (sort) {
      case "price-low":
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
        break
      case "name":
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Default: in stock first, then by name
        filteredProducts = [...filteredProducts].sort((a, b) => {
          if (a.inStock && !b.inStock) return -1
          if (!a.inStock && b.inStock) return 1
          return a.name.localeCompare(b.name)
        })
    }
  }

  const selectedCategory = category ? productCategories.find((cat) => cat.id === category) : null

  return (
    <main className="section-apple">
      <div className="container-apple">
        <div className="mb-12">
          <h1 className="text-h1 mb-4">{selectedCategory ? selectedCategory.name : "All Products"}</h1>
          <p className="text-body-l text-pg-gray">
            {selectedCategory
              ? selectedCategory.description
              : "Browse our complete catalog of premium Renin closet doors and hardware"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              categories={productCategories}
              selectedCategory={category}
              currentSearch={search}
              currentSort={sort}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-body-s text-pg-gray">Showing {filteredProducts.length} products</p>
            </div>

            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </main>
  )
}
