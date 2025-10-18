"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import PgHeader from "@/components/PgHeader"
import PgFooter from "@/components/PgFooter"
import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { VideoGallery } from "@/components/ui/video-gallery"
import { getProductImages, handleImageError } from "@/lib/product-utils"

interface Product {
  slug: string
  title: string
  type: string
  priceRange: string
  currency: string
  description?: string
  features?: string[]
  specifications?: Record<string, string>
  included?: string[]
  warranty?: string
  images?: string[]
}

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [mediaTab, setMediaTab] = useState("photos")

  const productImages = getProductImages(product)

  const installationVideos = [
    {
      id: "1",
      title: `How to Install ${product.title} - Step by Step Guide`,
      thumbnail: `/placeholder.svg?height=360&width=640&text=Installation+Video+1`,
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
    },
    {
      id: "2",
      title: `${product.title} Hardware Installation Tips`,
      thumbnail: `/placeholder.svg?height=360&width=640&text=Hardware+Installation`,
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
    },
    {
      id: "3",
      title: `Maintenance and Care for ${product.title}`,
      thumbnail: `/placeholder.svg?height=360&width=640&text=Maintenance+Guide`,
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
    },
  ]

  const defaultFeatures = product.features || [
    "Premium construction materials",
    "Professional installation included",
    "Soft-close mechanism",
    "2-year workmanship warranty",
    "Canadian-made quality",
  ]

  const defaultSpecs = product.specifications || {
    "Product Type": product.type,
    "Price Range": product.priceRange,
    Currency: product.currency,
    Material: "Premium engineered wood",
    Hardware: "Soft-close mechanism included",
    Installation: "Professional installation",
    Warranty: "Lifetime on door, 2-year on hardware",
  }

  const defaultIncluded = product.included || [
    "Door panel and frame",
    "Premium hardware system",
    "Soft-close mechanism",
    "Professional installation",
    "Hardware disposal",
    "2-year workmanship warranty",
  ]

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "specs", label: "Specifications" },
    { id: "included", label: "What's Included" },
    { id: "warranty", label: "Warranty & Care" },
  ]

  return (
    <div className="min-h-screen bg-pg-offwhite">
      <PgHeader />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-2xl bg-white">
                <Image
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                  onError={(e) => handleImageError(e)}
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedImage === index ? "border-pg-navy" : "border-pg-border"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => handleImageError(e)}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-pg-gray mb-2">{product.type}</p>
                <h1 className="headline-large text-3xl md:text-4xl text-pg-dark mb-4">{product.title}</h1>
                <p className="text-2xl font-semibold text-pg-navy mb-6">
                  {product.priceRange} {product.currency}
                </p>
                <p className="text-lg text-pg-gray">
                  {product.description ||
                    `Premium ${product.type?.toLowerCase() || "closet door"} door system with professional installation and transparent Canadian pricing.`}
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/contact" className="flex-1">
                  <Button className="btn-primary w-full py-4 text-lg">Request Work</Button>
                </Link>
                <Link href="/contact">
                  <Button className="btn-secondary px-8 py-4 text-lg">Get a Quote</Button>
                </Link>
              </div>

              <div className="border-t border-pg-border pt-6">
                <h3 className="font-semibold text-pg-dark mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {defaultFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-pg-gray">
                      <span className="w-2 h-2 bg-pg-sky rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b border-pg-border">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-pg-navy text-pg-navy"
                        : "border-transparent text-pg-gray hover:text-pg-dark"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === "overview" && (
                <div className="prose max-w-none">
                  <p className="text-lg text-pg-gray">
                    {product.description ||
                      `Our ${product.title} offers premium quality construction with professional installation. As an official Renin dealer, we provide transparent Canadian pricing and comprehensive warranty coverage.`}
                  </p>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(defaultSpecs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-pg-border">
                      <span className="font-medium text-pg-dark">{key}</span>
                      <span className="text-pg-gray">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "included" && (
                <div className="space-y-4">
                  <p className="text-lg text-pg-gray mb-6">
                    Every purchase includes professional installation and comprehensive support:
                  </p>
                  <ul className="space-y-3">
                    {defaultIncluded.map((item, index) => (
                      <li key={index} className="flex items-center text-pg-gray">
                        <span className="w-5 h-5 text-green-500 mr-3">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "warranty" && (
                <div className="space-y-6">
                  <div className="bg-pg-sky/10 rounded-2xl p-6">
                    <h3 className="font-semibold text-pg-dark mb-3">Warranty Coverage</h3>
                    <p className="text-pg-gray">
                      {product.warranty ||
                        "Lifetime warranty on door construction, 2-year warranty on hardware and professional installation workmanship."}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-pg-dark mb-3">Care Instructions</h3>
                    <ul className="space-y-2 text-pg-gray">
                      <li>• Clean with mild soap and water</li>
                      <li>• Avoid harsh chemicals or abrasives</li>
                      <li>• Regular hardware maintenance recommended</li>
                      <li>• Professional service available</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-pg-navy mb-6">Media</h2>
            <div className="border-b border-pg-border mb-8">
              <nav className="flex space-x-8">
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    mediaTab === "photos"
                      ? "border-pg-navy text-pg-navy"
                      : "border-transparent text-pg-gray hover:text-pg-dark"
                  }`}
                  onClick={() => setMediaTab("photos")}
                >
                  Photos
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    mediaTab === "videos"
                      ? "border-pg-navy text-pg-navy"
                      : "border-transparent text-pg-gray hover:text-pg-dark"
                  }`}
                  onClick={() => setMediaTab("videos")}
                >
                  Videos
                </button>
              </nav>
            </div>

            <div className="transition-all duration-200 ease-out">
              {mediaTab === "photos" ? (
                <ImageCarousel images={productImages} productTitle={product.title} />
              ) : (
                <VideoGallery videos={installationVideos} />
              )}
            </div>
          </section>
        </div>
      </div>

      <PgFooter />
    </div>
  )
}
