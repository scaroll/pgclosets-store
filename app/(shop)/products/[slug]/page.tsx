// @ts-nocheck - Product page with Decimal type issues
'use client'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Star, Truck, Shield, ChevronRight, Package, FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductVariants } from '@/components/products/product-variants'
import { QuantitySelector } from '@/components/products/quantity-selector'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { ProductReviews, StarRating } from '@/components/products/product-reviews'
import { RelatedProducts } from '@/components/products/related-products'
import { LuxuryQuoteForm } from '@/components/ui/luxury-quote-form'
import { getProduct, formatPrice } from '@/lib/products'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)

  useEffect(() => {
    async function loadProduct() {
      const productData = await getProduct(params.slug)
      setProduct(productData)
      setLoading(false)
    }
    void loadProduct()
  }, [params.slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    )
  }

  if (!product) {
    notFound()
  }

  const currentPrice = product.salePrice || product.price
  const hasDiscount = !!product.salePrice
  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.salePrice)) /
          Number(product.price)) *
          100
      )
    : 0

  // Parse specifications if they exist
  const specifications =
    typeof product.specifications === 'object' && product.specifications !== null
      ? (product.specifications as Record<string, string>)
      : {}

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category.name}
          </Link>
          {product.category.parent && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/products?category=${product.category.parent.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.parent.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <ProductGallery
            images={product.images.length > 0 ? product.images : ['/placeholder.jpg']}
            name={product.name}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

              {/* Rating */}
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={product.averageRating} showNumber />
                  <Link
                    href="#reviews"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
                  </Link>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {formatPrice(currentPrice)}
                </div>
                {hasDiscount && (
                  <>
                    <div className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </div>
                    <div className="px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm font-semibold rounded-full">
                      Save {discountPercentage}%
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    In Stock
                    {product.stockCount > 0 && product.stockCount < 10 && (
                      <span className="ml-1 text-muted-foreground">
                        (Only {product.stockCount} left)
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <ProductVariants
                variants={product.variants}
                onVariantChange={setSelectedVariant}
              />
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Quantity
              </label>
              <QuantitySelector max={product.stockCount || 99} />
            </div>

            {/* Add to Cart */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: currentPrice,
                image: product.images[0],
              }}
              disabled={!product.inStock}
            />

            {/* Request Quote Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setQuoteModalOpen(true)}
            >
              <FileText className="w-5 h-5 mr-2" />
              Request a Quote
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">On orders over $500</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Lifetime Warranty</div>
                  <div className="text-xs text-muted-foreground">On all products</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">30-day return policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Quality Assured</div>
                  <div className="text-xs text-muted-foreground">Premium materials</div>
                </div>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium mb-1">Estimated Delivery</div>
                  <div className="text-sm text-muted-foreground">
                    Standard shipping: 3-5 business days
                    <br />
                    Express shipping: 1-2 business days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="description" className="mt-16">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-2xl font-bold mb-4">Product Description</h3>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>

              {product.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="specs" className="mt-8">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold mb-6">Specifications</h3>

              {Object.keys(specifications).length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y">
                      {Object.entries(specifications).map(([key, value], index) => (
                        <tr
                          key={key}
                          className={index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}
                        >
                          <td className="px-6 py-4 font-medium text-sm w-1/3">
                            {key}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No specifications available for this product.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" id="reviews" className="mt-8">
            <ProductReviews
              reviews={product.reviews}
              averageRating={product.averageRating}
              totalReviews={product.reviewCount}
            />
          </TabsContent>

          <TabsContent value="installation" className="mt-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-2xl font-bold mb-4">Installation Guide</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  Professional Installation Recommended
                </h4>
                <p className="text-blue-800 dark:text-blue-200 mb-0">
                  For best results, we recommend professional installation by our certified
                  installers. Contact us to schedule an appointment.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-3">What&apos;s Included</h4>
                  <ul className="space-y-2">
                    <li>All necessary hardware and fasteners</li>
                    <li>Detailed installation instructions</li>
                    <li>Customer support hotline</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-3">Tools Required</h4>
                  <ul className="space-y-2">
                    <li>Power drill</li>
                    <li>Level</li>
                    <li>Measuring tape</li>
                    <li>Stud finder</li>
                    <li>Safety glasses</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-3">Installation Time</h4>
                  <p className="text-muted-foreground">
                    Estimated time: 2-4 hours for experienced DIYers.
                    Professional installation typically takes 1-2 hours.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </div>

      {/* Quote Form Modal */}
      <LuxuryQuoteForm
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        product={{
          name: product.name,
          price: Number(currentPrice),
        }}
        selectedOptions={selectedVariant?.attributes || {}}
      />
    </main>
  )
}
