import VisualConfiguratorWrapper from '@/components/configurator/VisualConfiguratorWrapper'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { ProductVariants } from '@/components/products/product-variants'
import { QuantitySelector } from '@/components/products/quantity-selector'
import { RelatedProducts } from '@/components/products/related-products'
import { LuxuryQuoteFormServer } from '@/components/ui/luxury-quote-form-server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatProductPrice, getProductBySlug } from '@/lib/data/products'
import { ChevronRight, Package, Shield, Star, Truck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.name} - PG Closets`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const currentPrice = product.salePrice || product.price
  const hasDiscount = !!product.salePrice
  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100
      )
    : 0

  // Parse specifications if they exist
  const specifications = product.specifications || {}

  return (
    <main className="min-h-screen bg-background text-apple-gray-900 dark:text-apple-dark-text">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="transition-colors hover:text-foreground"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Visual Configurator (Replcaing Static Gallery) */}
          <VisualConfiguratorWrapper
            productId={product.id}
            currentUser="demo-user" // In real app, get from session
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="mb-3 text-3xl font-bold md:text-4xl">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">{formatProductPrice(currentPrice)}</div>
                {hasDiscount && (
                  <>
                    <div className="text-xl text-muted-foreground line-through">
                      {formatProductPrice(product.price)}
                    </div>
                    <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      Save {discountPercentage}%
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    In Stock
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariants
                variants={product.variants.map((v, i) => ({
                  ...v,
                  id: v.sku || `v-${i}`,
                  price: v.priceCAD * 100, // Convert to cents for compatibility
                  inStock: v.availability === 'in-stock',
                }))}
              />
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Quantity
              </span>
              <QuantitySelector max={99} />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: currentPrice,
                  image: product.images[0] || '/placeholder.jpg',
                }}
                disabled={!product.inStock}
              />

              <LuxuryQuoteFormServer
                product={{
                  name: product.name,
                  price: currentPrice / 100,
                }}
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 dark:border-apple-dark-border sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="dark:bg-apple-blue-900/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Truck className="h-5 w-5 text-apple-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">On orders over $500</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="dark:bg-apple-blue-900/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Shield className="h-5 w-5 text-apple-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Lifetime Warranty</div>
                  <div className="text-xs text-muted-foreground">On all products</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="dark:bg-apple-blue-900/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Package className="h-5 w-5 text-apple-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">30-day return policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="dark:bg-apple-blue-900/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Star className="h-5 w-5 text-apple-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Quality Assured</div>
                  <div className="text-xs text-muted-foreground">Premium materials</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="description" className="mt-16">
          <TabsList className="h-auto w-full justify-start gap-8 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent px-0 py-4 text-base font-medium data-[state=active]:border-apple-blue-600 data-[state=active]:bg-transparent"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="rounded-none border-b-2 border-transparent px-0 py-4 text-base font-medium data-[state=active]:border-apple-blue-600 data-[state=active]:bg-transparent"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="installation"
              className="rounded-none border-b-2 border-transparent px-0 py-4 text-base font-medium data-[state=active]:border-apple-blue-600 data-[state=active]:bg-transparent"
            >
              Installation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="mb-4 text-2xl font-bold">Product Description</h3>
              <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {product.description}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="mt-8">
            <div className="max-w-3xl">
              <h3 className="mb-6 text-2xl font-bold">Specifications</h3>

              {Object.keys(specifications).length > 0 ? (
                <div className="overflow-hidden rounded-xl border dark:border-apple-dark-border">
                  <table className="w-full">
                    <tbody className="divide-y dark:divide-apple-dark-border">
                      {Object.entries(specifications).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}>
                          <td className="w-1/3 px-6 py-4 text-sm font-medium">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No specifications available for this product.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="installation" className="mt-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="mb-4 text-2xl font-bold">Installation Guide</h3>
              <div className="dark:bg-apple-blue-900/10 dark:border-apple-blue-900/20 mb-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
                <h4 className="text-apple-blue-900 dark:text-apple-blue-100 mb-2 text-lg font-semibold">
                  Professional Installation Recommended
                </h4>
                <p className="text-apple-blue-800 dark:text-apple-blue-200 mb-0">
                  For best results, we recommend professional installation by our certified
                  installers. Contact us to schedule an appointment.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-xl font-semibold">What&apos;s Included</h4>
                  <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    <li>All necessary hardware and fasteners</li>
                    <li>Detailed installation instructions</li>
                    <li>Customer support helpline</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 text-xl font-semibold">Tools Required</h4>
                  <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    <li>Power drill & level</li>
                    <li>Measuring tape</li>
                    <li>Stud finder</li>
                    <li>Safety glasses</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section className="mt-24">
          <RelatedProducts category={product.category} currentProductId={product.id} />
        </section>
      </div>
    </main>
  )
}
