import StandardLayout from "@/components/layout/StandardLayout"
import { ProductFilters } from "@/components/store/product-filters"
import { ProductGrid } from "@/components/store/product-grid"
import Heading from "@/components/ui/Heading-new"
import Text from "@/components/ui/Text-new"
import { arcatProducts, getProductsByCategory, productCategories, searchProducts } from "@/lib/enhanced-renin-products"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
  }>
}

export const metadata = {
  title: "All Products | Premium Closet Doors | PG Closets Ottawa",
  description:
    "Browse our complete catalog of premium Renin closet doors. Barn doors, bypass doors, bifold doors, pivot doors and hardware.",
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const { category, search, sort } = params

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
    <StandardLayout>
      <main className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <Heading level={1} className="mb-4">{selectedCategory ? selectedCategory.name : "All Products"}</Heading>
            <Text size="lg" variant="secondary">
              {selectedCategory
                ? selectedCategory.description
                : "Browse our complete catalog of premium Renin closet doors and hardware"}
            </Text>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters
                categories={productCategories}
                {...(category && { selectedCategory: category })}
                {...(search && { currentSearch: search })}
                {...(sort && { currentSort: sort })}
              />
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <Text size="base" variant="secondary">Showing {filteredProducts.length} products</Text>
              </div>

              <ProductGrid products={filteredProducts as any} />
            </div>
          </div>
        </div>
      </main>
    </StandardLayout>
  )
}
