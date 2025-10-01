"use client"

import { useMemo, useState } from "react"
import type { ArcatProduct } from "@/lib/enhanced-renin-products"
import { formatPrice } from "@/lib/enhanced-renin-products"
import { RequestQuoteButton } from "../ui/request-quote-button"
import { Check } from "../ui/icons"
import { EnhancedProductGallery, type MediaItem } from "../product/media/EnhancedProductGallery"
import { InteractiveInstallationGuide } from "../product/media/InteractiveInstallationGuide"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

interface ProductDetailClientProps {
  product: ArcatProduct
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const galleryImages = useMemo(() => {
    const images = [
      ...(Array.isArray(product.arcatImages) ? product.arcatImages : []),
      product.homeDepotImage,
    ].filter((src): src is string => typeof src === "string" && src.length > 0)

    return images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]
  }, [product])

  // Convert gallery images to MediaItem format for enhanced gallery
  const mediaItems: MediaItem[] = useMemo(() => {
    return galleryImages.map((image, index) => ({
      id: `${product.id}-${index}`,
      type: 'image' as const,
      url: image,
      alt: `${product.name} view ${index + 1}`,
      thumbnail: image
    }))
  }, [galleryImages, product.id, product.name])

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedFinish, setSelectedFinish] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const standardSizes = product.specifications?.["Standard Sizes"]
  const sizeOptions = typeof standardSizes === "string" ? standardSizes.split(/,\s*/) : []

  const availableFinishes = product.specifications?.Finish?.split(/,\s*/) ?? []

  const visibleSpecifications = Object.entries(product.specifications ?? {}).filter(([, value]) =>
    Boolean(value),
  )

  // Mock installation guide data (in real app, this would come from the product data)
  const installationSteps = useMemo(() => [
    {
      id: 'step-1',
      title: 'Prepare the Opening',
      description: 'Measure the door opening and ensure it meets the required dimensions. Remove the old door if applicable and clean the area.',
      duration: '15 minutes',
      difficulty: 'easy' as const,
      tools: ['Measuring tape', 'Level', 'Screwdriver'],
      materials: ['Cleaning supplies'],
      tips: ['Double-check measurements before proceeding', 'Ensure the opening is square and level'],
      warnings: ['Wear safety glasses when removing old hardware'],
      checkpoints: ['Opening is clean and debris-free', 'Measurements match product specifications']
    },
    {
      id: 'step-2',
      title: 'Install Track Hardware',
      description: 'Mount the track securely to the wall or ceiling according to the included template. Ensure proper alignment and spacing.',
      duration: '30 minutes',
      difficulty: 'medium' as const,
      tools: ['Drill', 'Level', 'Stud finder', 'Socket wrench'],
      materials: ['Track hardware', 'Screws', 'Wall anchors'],
      tips: ['Use a stud finder to locate wall studs for secure mounting', 'Pre-drill holes to prevent splitting'],
      warnings: ['Ensure track is level to prevent door binding', 'Use appropriate anchors for your wall type'],
      checkpoints: ['Track is securely mounted', 'Track is level and properly aligned']
    },
    {
      id: 'step-3',
      title: 'Hang the Door',
      description: 'Carefully lift the door and attach the rollers to the track. Test the movement and adjust as needed.',
      duration: '20 minutes',
      difficulty: 'medium' as const,
      tools: ['Socket wrench', 'Level'],
      materials: ['Door panel', 'Roller hardware'],
      tips: ['Have a helper assist with lifting heavy doors', 'Test door movement before final adjustments'],
      warnings: ['Door panels can be heavy - use proper lifting technique'],
      checkpoints: ['Door hangs properly on track', 'Door slides smoothly without binding']
    },
    {
      id: 'step-4',
      title: 'Final Adjustments',
      description: 'Make final adjustments to ensure smooth operation. Install any additional hardware like handles or floor guides.',
      duration: '15 minutes',
      difficulty: 'easy' as const,
      tools: ['Screwdriver', 'Allen wrench'],
      materials: ['Handles', 'Floor guides', 'Bumpers'],
      tips: ['Test door operation multiple times', 'Adjust roller height if needed'],
      warnings: ['Do not over-tighten adjustment screws'],
      checkpoints: ['Door operates smoothly', 'All hardware is secure', 'Door closes properly']
    }
  ], [])

  return (
    <div className="section-apple">
      <div className="container-apple">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Product Gallery */}
          <div className="space-y-4">
            <EnhancedProductGallery
              media={mediaItems}
              productName={product.name}
              config={{
                enableZoom: true,
                enableFullscreen: true,
                enable360View: false,
                enableArView: false,
                autoplay: false,
                thumbnailCount: 6
              }}
              onMediaChange={setSelectedImage}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-h1 mb-4">{product.name}</h1>
              <p className="text-body-l text-pg-gray mb-6">{product.description}</p>
              <div className="text-3xl font-bold text-pg-navy">{formatPrice(product.price)}</div>
            </div>

            {/* Product Options */}
            {sizeOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-pg-dark mb-2">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
                >
                  <option value="">Select Size</option>
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {availableFinishes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-pg-dark mb-2">Finish</label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
                >
                  <option value="">Select Finish</option>
                  {availableFinishes.map((finish) => (
                    <option key={finish} value={finish}>
                      {finish}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="bg-pg-light rounded-lg p-6 border-2 border-pg-sky">
                <h4 className="font-semibold text-pg-dark mb-2 text-lg">Get Your Custom Quote</h4>
                <p className="text-sm text-pg-gray mb-4">
                  Professional installation included. Personalized pricing based on your specific requirements.
                </p>
                <RequestQuoteButton
                  product={product}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  selectedOptions={{
                    ...(selectedSize ? { size: selectedSize } : {}),
                    ...(selectedFinish ? { finish: selectedFinish } : {}),
                  }}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-green-700">
                <Check className="w-4 h-4" />
                <span>Professional installation available</span>
              </div>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div>
                <h3 className="text-h3 mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {visibleSpecifications.length > 0 && (
              <div>
                <h3 className="text-h3 mb-4">Specifications</h3>
                <div className="space-y-2">
                  {visibleSpecifications.map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm border-b border-pg-border pb-2">
                      <span className="font-medium">{key.replace(/_/g, " ")}:</span>
                      <span className="text-pg-gray">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

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
                    {product.features.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Key Features</h4>
                        <ul className="space-y-1">
                          {product.features.slice(0, 5).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                  {visibleSpecifications.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {visibleSpecifications.map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 pb-3">
                          <dt className="font-medium text-gray-900 mb-1">
                            {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </dt>
                          <dd className="text-gray-600">{value}</dd>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No specifications available for this product.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation" className="mt-6">
              <InteractiveInstallationGuide
                productName={product.name}
                steps={installationSteps}
                totalTime="1-2 hours"
                skillLevel="intermediate"
              />
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
                            ★
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
                              <span key={star} className="text-yellow-400">★</span>
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
                              <span key={star} className="text-yellow-400">★</span>
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
      </div>
    </div>
  )
}
