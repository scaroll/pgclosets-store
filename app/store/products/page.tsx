export const dynamic = 'force-dynamic'

import { FeaturedProducts } from "@/components/store/featured-products"
import { reninProducts } from "@/lib/renin-products"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SearchParams {
  category?: string
  search?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  // Get all products from Renin database
  const allBarnDoors = reninProducts.getBarnDoors()
  const allHardware = reninProducts.getHardware()
  
  let filteredProducts = [...allBarnDoors, ...allHardware]
  
  // Apply filters
  if (params.category) {
    if (params.category === 'barn-doors') {
      filteredProducts = allBarnDoors
    } else if (params.category === 'hardware') {
      filteredProducts = allHardware
    }
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredProducts = reninProducts.searchProducts(searchTerm)
  }

  // Create category filters
  const categories = [
    {
      id: "barn-doors",
      name: "Barn Doors",
      slug: "barn-doors",
      count: allBarnDoors.length
    },
    {
      id: "hardware", 
      name: "Hardware",
      slug: "hardware",
      count: allHardware.length
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Our Products</h1>
        <p className="text-muted-foreground">Discover our premium collection of Renin barn doors and hardware</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Simple Category Filter */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <a 
                  href="/store/products"
                  className={`block p-2 rounded-md transition-colors ${!params.category ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                >
                  All Products ({allBarnDoors.length + allHardware.length})
                </a>
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/store/products?category=${category.slug}`}
                    className={`block p-2 rounded-md transition-colors ${params.category === category.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                  >
                    {category.name} ({category.count})
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} products
            </p>
            {params.category && (
              <Badge variant="secondary">
                {categories.find(c => c.slug === params.category)?.name}
              </Badge>
            )}
          </div>
          <FeaturedProducts products={filteredProducts} />
        </div>
      </div>
    </div>
  )
}
