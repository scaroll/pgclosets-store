import { notFound } from "next/navigation"
import { reninProducts } from "@/lib/renin-products"
import { generateBaseMetadata, generateBreadcrumbSchema } from "@/lib/seo"
// import ProductGrid from "@/components/commerce/product-grid"
import type { Metadata } from "next"

// Enable ISR with 6 hour revalidation
export const revalidate = 21600

// Generate static params for all categories
export async function generateStaticParams() {
  const styles = ['industrial', 'modern', 'rustic', 'traditional', 'contemporary']
  const materials = ['wood', 'steel', 'pine', 'mdf', 'composite']
  
  return [
    ...styles.map(style => ({ category: `style-${style}` })),
    ...materials.map(material => ({ category: `material-${material}` }))
  ]
}

// Generate metadata for each category
export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const [type, value] = category.split('-')
  
  if (!type || !value || !['style', 'material'].includes(type)) {
    return {
      title: 'Category Not Found | PG Closets',
      description: 'The requested category could not be found.'
    }
  }

  const formattedValue = value.charAt(0).toUpperCase() + value.slice(1)
  const title = `${formattedValue} ${type === 'style' ? 'Style' : 'Material'} Barn Doors Ottawa | PG Closets`
  const description = `Discover premium ${formattedValue.toLowerCase()} ${type === 'style' ? 'style' : 'material'} barn doors in Ottawa. Professional installation, quality craftsmanship, and competitive pricing. Browse our ${formattedValue.toLowerCase()} collection.`

  return generateBaseMetadata({
    title,
    description,
    path: `/barn-doors/${category}`,
    images: ['/renin_images/barn_doors/gatsby-chevron-white-main.jpg']
  })
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const [type, value] = category.split('-')
  
  if (!type || !value || !['style', 'material'].includes(type)) {
    notFound()
  }

  // Filter products based on category
  const filters = type === 'style' 
    ? { style: value }
    : { material: value }
  
  const products = reninProducts.filterBarnDoors(filters)
  
  if (products.length === 0) {
    notFound()
  }

  const formattedValue = value.charAt(0).toUpperCase() + value.slice(1)
  const categoryName = `${formattedValue} ${type === 'style' ? 'Style' : 'Material'}`
  
  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || '' },
    { name: 'Barn Doors', url: `${process.env.NEXT_PUBLIC_SITE_URL}/barn-doors` },
    { name: categoryName, url: `${process.env.NEXT_PUBLIC_SITE_URL}/barn-doors/${category}` }
  ])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {categoryName} Barn Doors
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {type === 'style' 
              ? `Explore our collection of ${formattedValue.toLowerCase()} style barn doors, perfect for creating the ideal aesthetic in your Ottawa home.`
              : `Discover barn doors crafted from premium ${formattedValue.toLowerCase()}, combining durability with elegant design for your space.`
            }
          </p>
          <div className="mt-6 text-sm text-slate-500">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Category Description */}
        <div className="bg-slate-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            About {categoryName} Barn Doors
          </h2>
          <div className="prose prose-slate max-w-none">
            {type === 'style' ? (
              <div>
                {value === 'industrial' && (
                  <p>Industrial style barn doors feature bold, structural elements with metal accents and clean lines. Perfect for modern lofts, contemporary homes, and spaces that embrace urban aesthetics.</p>
                )}
                {value === 'modern' && (
                  <p>Modern barn doors showcase sleek, minimalist designs with clean lines and sophisticated finishes. Ideal for contemporary homes that value simplicity and elegance.</p>
                )}
                {value === 'rustic' && (
                  <p>Rustic barn doors bring warmth and character with natural wood textures and traditional craftsmanship. Perfect for farmhouse, cottage, and country-style interiors.</p>
                )}
                {value === 'traditional' && (
                  <p>Traditional barn doors offer timeless appeal with classic proportions and refined details. Suitable for homes that appreciate enduring style and craftsmanship.</p>
                )}
                {value === 'contemporary' && (
                  <p>Contemporary barn doors blend modern functionality with stylish design elements. Great for homes that want current trends without sacrificing lasting appeal.</p>
                )}
              </div>
            ) : (
              <div>
                {value === 'wood' && (
                  <p>Solid wood barn doors offer natural beauty, durability, and the ability to customize with stains and finishes. Each piece showcases unique grain patterns and authentic character.</p>
                )}
                {value === 'steel' && (
                  <p>Steel barn doors provide modern industrial appeal with exceptional durability and minimal maintenance. Perfect for contemporary spaces seeking bold architectural elements.</p>
                )}
                {value === 'pine' && (
                  <p>Pine barn doors combine affordability with natural beauty, featuring distinctive grain patterns and excellent paint/stain retention for custom finishes.</p>
                )}
                {value === 'mdf' && (
                  <p>MDF barn doors offer smooth, consistent surfaces ideal for painted finishes and intricate designs. Engineered for stability and precision manufacturing.</p>
                )}
                {value === 'composite' && (
                  <p>Composite barn doors blend multiple materials for enhanced performance, combining the beauty of wood with improved stability and moisture resistance.</p>
                )}
              </div>
            )}
            <p className="mt-4">
              All our {formattedValue.toLowerCase()} barn doors come with professional installation service throughout the Ottawa area, including Kanata, Orleans, Nepean, and surrounding communities.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={product.images.main}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
                <p className="text-slate-600 text-sm mb-3">
                  {'style' in product ? `${(product as any).style} style, ${(product as any).material}` : (product as any).material}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-slate-900">
                    ${reninProducts.calculatePriceWithTax((product as any).sale_price || product.price).total.toFixed(2)} CAD
                  </div>
                  <a 
                    href={`/store/products/${product.slug}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-slate-600 mb-6">
            Our experts are here to help you find the perfect barn door for your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Free Consultation
            </a>
            <a 
              href="/barn-doors" 
              className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Categories
            </a>
          </div>
        </div>
      </div>
    </>
  )
}