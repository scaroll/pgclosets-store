"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/Heading-new";
import Text from "@/components/ui/Text-new";
import Card from "@/components/ui/Card-new";
import { Card as ShadcnCard, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { trackCTAClick, trackStickyMobileCTA, trackMeasurementHelperClick } from "@/lib/analytics/events";
import {
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingCart,
  FileText,
  Wrench,
  Shield,
  Star,
  X
} from "lucide-react";

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory_quantity: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  collection?: {
    id: string;
    title: string;
    handle: string;
  };
  metadata?: Record<string, any>;
}

interface RelatedProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  thumbnail: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  collection?: {
    id: string;
    title: string;
    handle: string;
  };
}

interface PremiumProductDetailPageProps {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export function PremiumProductDetailPage({
  product,
  relatedProducts
}: PremiumProductDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Mobile sticky CTA visibility handler
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 200px on mobile
      setShowStickyCTA(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prepare gallery images
  const galleryImages = useMemo(() => {
    const images = [
      product.thumbnail,
      ...product.images.map(img => img.url)
    ].filter((url): url is string => typeof url === "string" && url.length > 0);

    return images.length > 0 ? images : ["/placeholder.svg"];
  }, [product]);

  // Technical specifications from metadata
  const technicalSpecs = useMemo(() => {
    const metadata = product.metadata || {};
    return {
      "Material": metadata.material || "Premium engineered wood",
      "Finish": metadata.finish || "Multiple options available",
      "Hardware": metadata.hardware || "Soft-close mechanism included",
      "Installation": "Professional installation included",
      "Warranty": metadata.warranty || "Lifetime on door, 2-year on hardware",
      "Dimensions": metadata.dimensions || "Custom sizing available",
    };
  }, [product.metadata]);

  // Installation information
  const installationSteps = [
    {
      title: "Consultation & Measurement",
      description: "Our team visits your home to take precise measurements and discuss your requirements.",
      icon: FileText,
    },
    {
      title: "Custom Manufacturing",
      description: "Your door is custom-built to your exact specifications using premium materials.",
      icon: Wrench,
    },
    {
      title: "Professional Installation",
      description: "Certified installers ensure perfect fit and smooth operation.",
      icon: Check,
    },
    {
      title: "Quality Assurance",
      description: "Final inspection and demonstration of all features and maintenance.",
      icon: Shield,
    },
  ];

  // What's included
  const includedItems = [
    "Custom door panel and frame",
    "Premium hardware system",
    "Soft-close mechanism",
    "Professional installation (Ottawa area)",
    "Removal and disposal of old doors",
    "2-year workmanship warranty",
    "Lifetime manufacturer warranty",
    "Free consultation and measurement",
  ];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery with Zoom */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group">
              <Image
                src={galleryImages[selectedImageIndex]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Zoom image"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Grid */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`
                      relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                      ${selectedImageIndex === index
                        ? "border-black shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                      }
                    `}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <Text size="xs" className="uppercase tracking-widest text-gray-500 mb-2">
                {product.collection?.title || "Premium Collection"}
              </Text>
              <Heading level={1} className="mb-4">
                {product.title}
              </Heading>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <Text size="lg" className="text-3xl font-extralight">
                {formatPrice(selectedVariant.price * 100)}
              </Text>
              <Text size="sm" variant="muted">CAD</Text>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <Text size="sm" variant="secondary">4.8 (127 reviews)</Text>
            </div>

            {/* Description */}
            <Text size="base" variant="secondary" className="leading-relaxed">
              {product.description}
            </Text>

            {/* Variant Selection (if multiple variants) */}
            {product.variants.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Select Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`
                        p-3 border-2 rounded-lg text-sm transition-all
                        ${selectedVariant.id === variant.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                        }
                      `}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/request-work" className="flex-1">
                <Button
                  size="lg"
                  variant="primary"
                  fullWidth
                  className="inline-flex items-center justify-center"
                  onClick={() => trackCTAClick({ location: 'pdp-main', label: 'Get Free Quote' })}
                >
                  Get Free Quote
                </Button>
              </Link>
              <Link href="/book-measurement" className="flex-1">
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  className="inline-flex items-center justify-center"
                  onClick={() => trackCTAClick({ location: 'pdp-main', label: 'Book Measurement' })}
                >
                  Book Measurement
                </Button>
              </Link>
            </div>

            {/* Reassurance Copy */}
            <p className="text-sm text-gray-600 text-center mt-2">
              No obligation • Reply within 24h
            </p>

            {/* Measurement Helper Link */}
            <p className="text-sm text-center mt-2">
              <Link
                href="/book-measurement"
                className="text-blue-600 hover:underline"
                onClick={() => trackMeasurementHelperClick({ location: 'pdp' })}
              >
                Need help measuring? View our guide →
              </Link>
            </p>

            {/* Trust Signals / Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700 mt-4 mb-6">
              <div className="flex items-center gap-2">
                <span>⭐ 5.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span>500+ Installs</span>
              </div>
              <div className="flex items-center gap-2">
                <span>BBB A+</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Lifetime Warranty</span>
              </div>
            </div>

            {/* Legacy Trust Signals */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Lifetime Warranty</p>
              </div>
              <div className="text-center">
                <Wrench className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Professional Install</p>
              </div>
              <div className="text-center">
                <Check className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Canadian Made</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="specs"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Technical Specs
              </TabsTrigger>
              <TabsTrigger
                value="installation"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Installation
              </TabsTrigger>
              <TabsTrigger
                value="included"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                What's Included
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Technical Specifications */}
            <TabsContent value="specs" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(technicalSpecs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-4 border-b border-gray-200"
                  >
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-600 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Installation Information */}
            <TabsContent value="installation" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                {installationSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <Card key={index} className="border-0 shadow-sm bg-gray-50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <IconComponent className="w-6 h-6 text-gray-900" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">
                              {step.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-2">
                  Ottawa Area Service
                </h3>
                <p className="text-sm text-gray-700">
                  Professional installation is included for all customers in the Ottawa region.
                  Our certified installers ensure perfect fit and operation with a 2-year workmanship warranty.
                </p>
              </div>
            </TabsContent>

            {/* What's Included */}
            <TabsContent value="included" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">
                    Complete Package Includes:
                  </h3>
                  <ul className="space-y-3">
                    {includedItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-sm bg-gray-50">
                    <CardContent className="p-6">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Warranty Coverage
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Lifetime warranty on door construction</li>
                        <li>• 2-year warranty on hardware components</li>
                        <li>• 2-year warranty on installation workmanship</li>
                        <li>• Full manufacturer support and service</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm bg-gray-50">
                    <CardContent className="p-6">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Care & Maintenance
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Clean with mild soap and water</li>
                        <li>• Avoid harsh chemicals or abrasives</li>
                        <li>• Periodic hardware lubrication recommended</li>
                        <li>• Professional maintenance service available</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="mt-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-6 h-6 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-2xl font-extralight mb-1">4.8 out of 5</p>
                <p className="text-gray-600">Based on 127 reviews</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Sarah M.",
                    rating: 5,
                    review: "Beautiful door and excellent installation service. The team was professional and completed the work quickly. Very happy with the quality!",
                  },
                  {
                    name: "Mike R.",
                    rating: 5,
                    review: "Exactly what we needed for our bedroom closet. The sliding mechanism is smooth and quiet. Great value for the price.",
                  },
                  {
                    name: "Jennifer K.",
                    rating: 5,
                    review: "Outstanding craftsmanship and attention to detail. The installation team was courteous and cleaned up perfectly. Highly recommend!",
                  },
                  {
                    name: "David L.",
                    rating: 4,
                    review: "Great product overall. Installation was professional. Only minor delay in delivery but worth the wait for quality.",
                  },
                ].map((review, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.name} - Verified Purchase
                        </span>
                      </div>
                      <p className="text-gray-700">{review.review}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <Heading level={2}>
                Related Products
              </Heading>
              {product.collection && (
                <Link
                  href={`/products/${product.collection.handle}`}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  View all {product.collection.title}
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.handle}`}
                  className="group"
                >
                  <Card hover padding="sm" className="overflow-hidden">
                    <div className="relative aspect-square bg-gray-50">
                      <Image
                        src={related.thumbnail || "/placeholder.svg"}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <Heading level={3} className="mb-1 line-clamp-2">
                        {related.title}
                      </Heading>
                      <Text size="sm" variant="muted" className="mb-2">
                        {related.collection?.title}
                      </Text>
                      <Text size="lg" className="font-extralight">
                        {formatPrice(related.variants[0]?.price * 100)}
                      </Text>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsZoomOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-6xl w-full aspect-square">
            <Image
              src={galleryImages[selectedImageIndex]}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Mobile Sticky CTA Bar */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-lg
          transition-transform duration-300 ease-in-out
          md:hidden
          ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="flex items-center gap-3 p-4">
          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
            <Image
              src={galleryImages[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <Link href="/request-work" className="flex-1">
            <Button
              size="lg"
              variant="primary"
              className="w-full"
              onClick={() => trackStickyMobileCTA({ product: product.title })}
            >
              Get Free Quote
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
