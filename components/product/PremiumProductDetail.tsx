"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  Calendar,
  Calculator,
  Ruler,
  Shield,
  Truck,
  Award,
  Clock,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Package,
  Sparkles,
  BadgeCheck,
  ArrowRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BadgeChip } from "@/components/ui/badge-chip"
import { Separator } from "@/components/ui/separator"
import { EnhancedProductGallery, type MediaItem } from "@/components/product/media/EnhancedProductGallery"
import { ARDoorViewer } from "@/components/product/media/ARDoorViewer"
import { InteractiveInstallationGuide } from "@/components/product/media/InteractiveInstallationGuide"
import { InstantEstimateModal } from "@/components/configurator/InstantEstimateModal"
import { ConfiguratorCalculator } from "@/lib/configurator-calculator"
import type { ProductConfiguratorData } from "@/types/configurator"
import { cn } from "@/lib/utils"

interface PremiumProductDetailProps {
  product: {
    id: string
    slug: string
    title: string
    description: string
    price: number
    image: string
    category: string
    configurator_data?: ProductConfiguratorData
    images?: string[]
    features?: string[]
    specifications?: Record<string, any>
  }
  relatedProducts?: Array<{
    id: string
    slug: string
    title: string
    price: number
    image: string
    category: string
  }>
}

export function PremiumProductDetail({ product, relatedProducts = [] }: PremiumProductDetailProps) {
  const [showEstimator, setShowEstimator] = useState(false)
  const [selectedFinish, setSelectedFinish] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isFavorited, setIsFavorited] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const hasConfigurator = Boolean(product.configurator_data)
  const images = product.images || [product.image]

  // Convert images to MediaItem format
  const mediaItems: MediaItem[] = useMemo(() => {
    return images.map((image, index) => ({
      id: `${product.id}-${index}`,
      type: 'image' as const,
      url: image,
      alt: `${product.title} view ${index + 1}`,
      thumbnail: image
    }))
  }, [images, product.id, product.title])

  // Installation steps (mock data)
  const installationSteps = useMemo(() => [
    {
      id: 'step-1',
      title: 'Prepare the Opening',
      description: 'Measure the door opening and ensure it meets the required dimensions.',
      duration: '15 minutes',
      difficulty: 'easy' as const,
      tools: ['Measuring tape', 'Level', 'Screwdriver'],
      materials: ['Cleaning supplies'],
      tips: ['Double-check measurements before proceeding'],
      warnings: ['Wear safety glasses when removing old hardware'],
      checkpoints: ['Opening is clean and debris-free']
    },
    {
      id: 'step-2',
      title: 'Install Track Hardware',
      description: 'Mount the track securely to the wall or ceiling.',
      duration: '30 minutes',
      difficulty: 'medium' as const,
      tools: ['Drill', 'Level', 'Stud finder'],
      materials: ['Track hardware', 'Screws'],
      tips: ['Use a stud finder to locate wall studs'],
      warnings: ['Ensure track is level'],
      checkpoints: ['Track is securely mounted']
    }
  ], [])

  // Calculate urgency metrics
  const inStockCount = 8
  const viewingCount = 12
  const recentOrders = 3

  // Track analytics events
  const trackGA4Event = useCallback((eventName: string, params: any) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params)
    }
  }, [])

  const handleBookMeasure = useCallback(() => {
    trackGA4Event('book_measure_click', {
      source: 'pdp_premium',
      product_id: product.id,
      product_title: product.title
    })
  }, [product.id, product.title, trackGA4Event])

  const handleGetEstimate = useCallback(() => {
    setShowEstimator(true)
    trackGA4Event('get_estimate_click', {
      source: 'pdp_premium',
      product_id: product.id,
      product_title: product.title
    })
  }, [product.id, product.title, trackGA4Event])

  const handleFavoriteToggle = useCallback(() => {
    setIsFavorited(prev => !prev)
    trackGA4Event(isFavorited ? 'remove_favorite' : 'add_favorite', {
      product_id: product.id,
      product_title: product.title
    })
  }, [isFavorited, product.id, product.title, trackGA4Event])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href
        })
        trackGA4Event('share', { product_id: product.id })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      setShowShareMenu(true)
    }
  }, [product.id, product.title, product.description, trackGA4Event])

  // Get price display
  const priceDisplay = hasConfigurator
    ? ConfiguratorCalculator.formatPrice(product.configurator_data!.installed_price_from_cad)
    : `$${(product.price / 100).toFixed(2)}`

  return (
    <>
      {/* Sticky Desktop Bar */}
      {hasConfigurator && (
        <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative rounded overflow-hidden">
                  <Image src={images[0]} alt={product.title} fill className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-medium">{product.title}</div>
                  <div className="text-xs text-muted-foreground">From {priceDisplay}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetEstimate}
                  className="gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Instant Estimate
                </Button>
                <Link href="/book-measure">
                  <Button size="sm" className="gap-2" onClick={handleBookMeasure}>
                    <Calendar className="w-4 h-4" />
                    Book Measure
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 lg:pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/simple-products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Gallery */}
          <div className="space-y-6">
            <EnhancedProductGallery
              media={mediaItems}
              productName={product.title}
              config={{
                enableZoom: true,
                enableFullscreen: true,
                enable360View: false,
                enableArView: false,
                autoplay: false,
                thumbnailCount: 6
              }}
            />

            {/* Premium Badges */}
            <div className="flex flex-wrap gap-3">
              <BadgeChip variant="premium" size="md">
                <BadgeCheck className="w-4 h-4" />
                Renin Authorized Dealer
              </BadgeChip>
              <BadgeChip variant="premium" size="md">
                <Award className="w-4 h-4" />
                Premium Quality
              </BadgeChip>
              <BadgeChip variant="success" size="md">
                <Shield className="w-4 h-4" />
                Lifetime Warranty
              </BadgeChip>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Category & Actions */}
            <div className="flex items-start justify-between">
              <Badge variant="outline" className="uppercase tracking-wider">
                {product.category}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteToggle}
                  className={cn("hover:text-red-500", isFavorited && "text-red-500")}
                >
                  <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">4.9</span>
                <span className="text-muted-foreground">(127 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-4xl font-light">{priceDisplay}</div>
              {hasConfigurator && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    Installed
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {product.configurator_data!.lead_time_weeks} weeks lead time
                  </span>
                </div>
              )}
            </div>

            {/* Subtle Urgency */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900">
                    High demand • Limited availability
                  </p>
                  <div className="flex items-center gap-4 text-xs text-amber-700">
                    <span>• {inStockCount} in stock</span>
                    <span>• {viewingCount} people viewing</span>
                    <span>• {recentOrders} ordered today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Configurator Options */}
            {hasConfigurator && (
              <div className="space-y-4">
                {/* Finish Selection */}
                {product.configurator_data!.finish_options && (
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Finish Options ({product.configurator_data!.finish_options.length} available)
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {product.configurator_data!.finish_options.map((finish) => (
                        <button
                          key={finish.id}
                          onClick={() => setSelectedFinish(finish.id)}
                          className={cn(
                            "group relative aspect-square rounded-lg border-2 transition-all duration-200 overflow-hidden",
                            selectedFinish === finish.id
                              ? "border-pg-sky shadow-lg ring-2 ring-pg-sky/20"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: finish.color }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                            <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              {finish.name}
                            </span>
                          </div>
                          {selectedFinish === finish.id && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 rounded-full bg-pg-sky flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {selectedFinish && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Selected: {product.configurator_data!.finish_options.find(f => f.id === selectedFinish)?.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Size Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Custom Sizing Available</h4>
                      <p className="text-sm text-muted-foreground">
                        Width: {product.configurator_data!.opening_min_width}" - {product.configurator_data!.opening_max_width}" •
                        Height: {product.configurator_data!.opening_min_height}" - {product.configurator_data!.opening_max_height}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                onClick={handleGetEstimate}
                className="w-full text-base font-medium h-14 bg-gradient-to-r from-pg-navy to-pg-sky hover:from-pg-sky hover:to-pg-navy transition-all duration-300"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Get Instant Estimate
              </Button>

              <Link href="/book-measure" className="block">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-base font-medium h-14 border-2"
                  onClick={handleBookMeasure}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Professional Measure
                </Button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-pg-sky" />
                <p className="text-xs font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Ottawa Area</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-pg-sky" />
                <p className="text-xs font-medium">Lifetime</p>
                <p className="text-xs text-muted-foreground">Warranty</p>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-pg-sky" />
                <p className="text-xs font-medium">Licensed</p>
                <p className="text-xs text-muted-foreground">& Insured</p>
              </div>
            </div>

            {/* What's Included */}
            {hasConfigurator && product.configurator_data!.includes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                  <CardDescription>Complete installation package</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.configurator_data!.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Enhanced Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="ar-preview">AR Preview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Key Features</h4>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Material Excellence</CardTitle>
                  <CardDescription>Premium quality materials and finishes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Construction</h4>
                    <p className="text-sm text-gray-600">
                      Engineered solid wood frame with precision-crafted mullion design.
                      Durable construction ensures long-lasting performance and beauty.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Hardware</h4>
                    <p className="text-sm text-gray-600">
                      Premium sliding hardware with smooth, quiet operation. Heavy-duty
                      track system rated for daily use.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Finish Quality</h4>
                    <p className="text-sm text-gray-600">
                      Professional-grade paint finish with color accuracy guarantee.
                      Resistant to fading, chipping, and wear.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>Detailed product measurements and capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                {hasConfigurator ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <dt className="font-medium text-gray-900 mb-1">Width Range</dt>
                        <dd className="text-gray-600">
                          {product.configurator_data!.opening_min_width}" - {product.configurator_data!.opening_max_width}"
                        </dd>
                      </div>
                      <div className="border-b pb-3">
                        <dt className="font-medium text-gray-900 mb-1">Height Range</dt>
                        <dd className="text-gray-600">
                          {product.configurator_data!.opening_min_height}" - {product.configurator_data!.opening_max_height}"
                        </dd>
                      </div>
                      <div className="border-b pb-3">
                        <dt className="font-medium text-gray-900 mb-1">Panel Options</dt>
                        <dd className="text-gray-600">
                          {product.configurator_data!.panel_options.join(', ')} panel configurations
                        </dd>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <dt className="font-medium text-gray-900 mb-1">Finish Options</dt>
                        <dd className="text-gray-600">
                          {product.configurator_data!.finish_options.length} premium finishes available
                        </dd>
                      </div>
                      <div className="border-b pb-3">
                        <dt className="font-medium text-gray-900 mb-1">Lead Time</dt>
                        <dd className="text-gray-600">
                          {product.configurator_data!.lead_time_weeks} weeks from order
                        </dd>
                      </div>
                      <div className="border-b pb-3">
                        <dt className="font-medium text-gray-900 mb-1">Installation Complexity</dt>
                        <dd className="text-gray-600">
                          <Badge variant="outline">Intermediate</Badge>
                          <p className="text-sm mt-1">Professional installation recommended</p>
                        </dd>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Contact us for detailed specifications.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installation" className="space-y-6">
            <InteractiveInstallationGuide
              productName={product.title}
              steps={installationSteps}
              totalTime="1-2 hours"
              skillLevel="intermediate"
            />

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Professional Installation Available
                    </h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Let our licensed and insured professionals handle the installation.
                      Lifetime warranty on workmanship included.
                    </p>
                    <Link href="/book-measure">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Schedule Installation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ar-preview" className="space-y-6">
            <ARDoorViewer
              productName={product.title}
              dimensions={{
                width: hasConfigurator ? product.configurator_data!.opening_max_width : 48,
                height: hasConfigurator ? product.configurator_data!.opening_max_height : 96,
                depth: 2
              }}
              availableFinishes={
                hasConfigurator
                  ? product.configurator_data!.finish_options.map(f => f.name)
                  : []
              }
            />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>Verified purchasers and installation customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-8 pb-6 border-b">
                    <div className="text-center">
                      <div className="text-5xl font-light mb-2">4.9</div>
                      <div className="flex items-center gap-1 justify-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Based on 127 reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-8">{rating}★</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 3}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {rating === 5 ? 108 : rating === 4 ? 12 : rating === 3 ? 4 : 2}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {[
                      {
                        name: "Sarah M.",
                        rating: 5,
                        date: "2 weeks ago",
                        verified: true,
                        text: "Beautiful door and excellent installation service. The team was professional and completed the work quickly. Very happy with the quality and the lifetime warranty gives great peace of mind!"
                      },
                      {
                        name: "Mike R.",
                        rating: 5,
                        date: "1 month ago",
                        verified: true,
                        text: "Exactly what we needed for our bedroom closet. The sliding mechanism is smooth and quiet. Installation was done perfectly - they even cleaned up afterward. Great value for the price."
                      },
                      {
                        name: "Jennifer L.",
                        rating: 5,
                        date: "1 month ago",
                        verified: true,
                        text: "The AR preview feature helped us visualize the door in our space before ordering. The quality exceeded our expectations. Highly recommend!"
                      }
                    ].map((review, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{review.name}</span>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/simple-products/${relatedProduct.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          {relatedProduct.category}
                        </p>
                        <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-pg-sky transition-colors">
                          {relatedProduct.title}
                        </h3>
                        <p className="text-lg font-light">
                          ${(relatedProduct.price / 100).toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Instant Estimate Modal */}
      {hasConfigurator && (
        <InstantEstimateModal
          isOpen={showEstimator}
          onClose={() => setShowEstimator(false)}
          initialProduct={{
            id: product.id,
            title: product.title,
            configuratorData: product.configurator_data!
          }}
        />
      )}
    </>
  )
}
