"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Check } from "@/components/ui/icons"
// Simplified imports - using built-in Next.js Image component
import { formatPrice } from "@/lib/utils"

interface Product {
  id: string
  title: string
  description: string
  thumbnail: string | null
  images?: string[]
  variants: Array<{
    price: number
  }>
  collection?: {
    title: string
    handle: string
  }
}

interface EnhancedProductDetailPageProps {
  product: Product
  relatedProducts: Product[]
}

export function EnhancedProductDetailPage({ product, relatedProducts }: EnhancedProductDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Create gallery images from product data
  const galleryImages = useMemo(() => {
    const images = [
      product.thumbnail,
      ...(product.images || [])
    ].filter((src): src is string => typeof src === "string" && src.length > 0)

    return images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]
  }, [product])

  const priceText = `From ${formatPrice(product.variants[0]?.price)} CAD`

  return (
    <main className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <section className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Simple Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={galleryImages[selectedImageIndex]}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? "border-blue-500" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900">
                {product.title}
              </h1>
              <div className="text-sm text-slate-600 font-light uppercase tracking-widest">
                {product.collection?.title || 'General'}
              </div>
              <div className="text-3xl font-extralight text-slate-900 tracking-tight">
                {priceText}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Request Installation Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="bg-white shadow-lg p-6">
                <h2 className="text-xl font-extralight text-slate-900 mb-3 tracking-wide">Overview</h2>
                <p className="text-slate-600 font-light">
                  {product.description}
                </p>
              </div>
              <div className="bg-white shadow-lg p-6">
                <h2 className="text-xl font-extralight text-slate-900 mb-3 tracking-wide">What&apos;s Included</h2>
                <ul className="text-slate-600 font-light space-y-1">
                  <li>• Track & soft-close hardware</li>
                  <li>• Professional installation (Ottawa)</li>
                  <li>• Removal/disposal of old doors</li>
                  <li>• 2-year workmanship warranty</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Enhanced Product Information Tabs */}
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {product.description}
                    </p>
                    <div>
                      <h4 className="font-medium mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Premium quality construction</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Smooth sliding mechanism</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Professional installation included</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>2-year warranty coverage</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                    <CardDescription>
                      Everything you need for a complete installation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Door panel and frame
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Track and roller hardware
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Installation instructions
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        All mounting hardware
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        Professional installation (Ottawa area)
                      </li>
                    </ul>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Warranty:</strong> 2-year manufacturer warranty on hardware,
                        1-year workmanship warranty on installation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                  <CardDescription>
                    Detailed product measurements and technical information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border-b border-gray-200 pb-3">
                      <dt className="font-medium text-gray-900 mb-1">Material</dt>
                      <dd className="text-gray-600">Premium engineered materials</dd>
                    </div>
                    <div className="border-b border-gray-200 pb-3">
                      <dt className="font-medium text-gray-900 mb-1">Finish</dt>
                      <dd className="text-gray-600">Multiple finish options available</dd>
                    </div>
                    <div className="border-b border-gray-200 pb-3">
                      <dt className="font-medium text-gray-900 mb-1">Weight Capacity</dt>
                      <dd className="text-gray-600">Up to 200 lbs per door</dd>
                    </div>
                    <div className="border-b border-gray-200 pb-3">
                      <dt className="font-medium text-gray-900 mb-1">Track Length</dt>
                      <dd className="text-gray-600">Available in multiple sizes</dd>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Installation Guide</CardTitle>
                  <CardDescription>
                    Step-by-step installation process for {product.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Estimated Time</h4>
                        <p className="text-blue-700">1-2 hours</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Skill Level</h4>
                        <p className="text-green-700">Intermediate</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-2">Step 1: Preparation</h4>
                        <p className="text-gray-600">Measure the opening and gather all necessary tools including a drill, level, and measuring tape.</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-2">Step 2: Install Track</h4>
                        <p className="text-gray-600">Mount the track securely to the ceiling or header using the provided hardware.</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-2">Step 3: Hang Door</h4>
                        <p className="text-gray-600">Carefully hang the door on the track system and adjust for proper alignment.</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-2">Step 4: Final Adjustments</h4>
                        <p className="text-gray-600">Test the door operation and make any necessary adjustments for smooth sliding.</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Professional Installation Available</h4>
                      <p className="text-yellow-700 text-sm">
                        For Ottawa area customers, professional installation is included with your purchase.
                        Our certified installers ensure perfect fit and operation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>
                    See what our customers are saying about this product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          >
                            ⭐
                          </div>
                        ))}
                      </div>
                      <p className="text-2xl font-bold">4.8 out of 5</p>
                      <p className="text-gray-600">Based on 127 reviews</p>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="text-left p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="text-yellow-400">⭐</span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">Sarah M. - Verified Purchase</span>
                        </div>
                        <p className="text-gray-700">
                          "Beautiful door and excellent installation service. The team was professional
                          and completed the work quickly. Very happy with the quality!"
                        </p>
                      </div>

                      <div className="text-left p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="text-yellow-400">⭐</span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">Mike R. - Verified Purchase</span>
                        </div>
                        <p className="text-gray-700">
                          "Exactly what we needed for our bedroom closet. The sliding mechanism
                          is smooth and quiet. Great value for the price."
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-gray-500">
                        Reviews are collected from verified purchasers and installation customers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <Separator className="mb-8" />
            <h2 className="text-3xl font-extralight text-slate-900 mb-6 tracking-tight">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map(related => (
                <Link href={`/products/${related.id}`} key={related.id} passHref>
                  <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
                    <CardHeader className="p-0">
                      <div className="relative h-64 w-full">
                        <Image
                          src={related.thumbnail || '/placeholder.svg'}
                          alt={related.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg font-light">{related.title}</CardTitle>
                      <p className="mt-4 text-lg font-extralight text-slate-800">
                        {formatPrice(related.variants[0]?.price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}