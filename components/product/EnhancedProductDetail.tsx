"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Phone, Calendar, Calculator, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { InstantEstimateModal } from "@/components/configurator/InstantEstimateModal"
import { ConfiguratorCalculator } from "@/lib/configurator-calculator"
import type { ProductConfiguratorData, ProductAddon } from "@/types/configurator"
import { cn } from "@/lib/utils"

interface EnhancedProductDetailProps {
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
  }
}

export function EnhancedProductDetail({ product }: EnhancedProductDetailProps) {
  const [showEstimator, setShowEstimator] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const hasConfigurator = Boolean(product.configurator_data)
  const images = product.images || [product.image]

  // Calculate addon total
  const addonTotal = selectedAddons.reduce((total, addonId) => {
    const addon = product.configurator_data?.addons?.find(a => a.id === addonId)
    return total + (addon?.price_cad || 0)
  }, 0)

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  const trackGA4Event = (eventName: string, params: any) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params)
    }
  }

  const handleBookMeasure = () => {
    trackGA4Event('book_measure_click', {
      source: 'pdp',
      product_id: product.id,
      product_title: product.title
    })
  }

  return (
    <>
      {/* Sticky Desktop Bar */}
      {hasConfigurator && (
        <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative rounded overflow-hidden">
                  <Image src={images[0]} alt={product.title} fill className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-medium">{product.title}</div>
                  <div className="text-xs text-muted-foreground">
                    From {ConfiguratorCalculator.formatPrice(product.configurator_data!.installed_price_from_cad)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEstimator(true)}
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
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden border">
              <Image
                src={images[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "relative aspect-square rounded border-2 overflow-hidden transition",
                      idx === currentImageIndex
                        ? "border-black"
                        : "border-transparent hover:border-gray-300"
                    )}
                  >
                    <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.category}
            </div>
            <h1 className="text-3xl font-bold mt-1">{product.title}</h1>

            {hasConfigurator ? (
              <div className="mt-2">
                <div className="text-2xl font-semibold">
                  From {ConfiguratorCalculator.formatPrice(product.configurator_data!.installed_price_from_cad)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Installed • Lead time: {product.configurator_data!.lead_time_weeks} weeks
                </div>
              </div>
            ) : (
              <div className="text-2xl font-semibold mt-2">
                ${(product.price / 100).toFixed(2)}
              </div>
            )}

            <p className="mt-4 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* CTA Buttons */}
            {hasConfigurator && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={() => setShowEstimator(true)}
                  className="flex-1 gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Get Instant Estimate
                </Button>
                <Link href="/book-measure" className="flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleBookMeasure}
                  >
                    <Calendar className="w-5 h-5" />
                    Book In-Home Measure
                  </Button>
                </Link>
              </div>
            )}

            {/* What's Included */}
            {hasConfigurator && product.configurator_data!.includes && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">What's Included</h3>
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

            {/* Add-ons */}
            {hasConfigurator && product.configurator_data!.addons && product.configurator_data!.addons.length > 0 && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Optional Add-Ons</h3>
                  <div className="space-y-3">
                    {product.configurator_data!.addons.map((addon) => (
                      <div key={addon.id} className="flex items-start gap-3">
                        <Checkbox
                          id={addon.id}
                          checked={selectedAddons.includes(addon.id)}
                          onCheckedChange={() => handleAddonToggle(addon.id)}
                        />
                        <Label
                          htmlFor={addon.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{addon.name}</div>
                              <div className="text-sm text-muted-foreground capitalize">
                                {addon.category}
                              </div>
                            </div>
                            <div className="font-semibold">
                              +{ConfiguratorCalculator.formatPrice(addon.price_cad)}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                  {addonTotal > 0 && (
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="font-medium">Add-ons Total:</span>
                      <span className="text-lg font-semibold">
                        +{ConfiguratorCalculator.formatPrice(addonTotal)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="includes">What's Included</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
              <TabsTrigger value="faq">FAQs</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Technical Specifications</h3>
                  {hasConfigurator ? (
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Width Range</div>
                        <div>{product.configurator_data!.opening_min_width}" - {product.configurator_data!.opening_max_width}"</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Height Range</div>
                        <div>{product.configurator_data!.opening_min_height}" - {product.configurator_data!.opening_max_height}"</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Panel Options</div>
                        <div>{product.configurator_data!.panel_options.join(', ')} panels</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Finish Options</div>
                        <div>{product.configurator_data!.finish_options.length} finishes available</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Lead Time</div>
                        <div>{product.configurator_data!.lead_time_weeks} weeks</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Contact us for detailed specifications and measurements.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="includes" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">What's Included With Your Purchase</h3>
                  {hasConfigurator && product.configurator_data!.includes ? (
                    <ul className="space-y-3">
                      {product.configurator_data!.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      All necessary hardware and installation instructions included.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warranty" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Lifetime Workmanship Warranty</h3>
                  <div className="space-y-4">
                    <p>
                      We stand behind our work with a comprehensive lifetime warranty on all installation workmanship.
                    </p>
                    <div>
                      <h4 className="font-medium mb-2">Coverage Includes:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Installation defects and workmanship issues</li>
                        <li>Hardware mounting and alignment</li>
                        <li>Door operation and functionality</li>
                        <li>Structural mounting integrity</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Product Warranty:</h4>
                      <p className="text-sm text-muted-foreground">
                        Manufacturer's warranty applies to product materials and finishes.
                        Contact us for specific warranty terms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">How long does installation take?</h4>
                      <p className="text-sm text-muted-foreground">
                        Typical installations take 2-4 hours depending on complexity.
                        We'll provide a specific timeframe during your in-home measure.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Do I need to prepare the opening?</h4>
                      <p className="text-sm text-muted-foreground">
                        No preparation needed. We handle all measurements, adjustments,
                        and installation. Just clear the area for our installers.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">What's included in the price?</h4>
                      <p className="text-sm text-muted-foreground">
                        Our installed price includes professional in-home measurement,
                        custom fabrication, all hardware, installation, and post-install cleanup.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Can I see samples before ordering?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! We bring finish samples to your in-home measure appointment
                        so you can see them in your actual lighting conditions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Ottawa Projects Section - if available */}
        {hasConfigurator && product.configurator_data!.ottawa_projects_refs && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Recent Ottawa Projects</h2>
            <p className="text-muted-foreground mb-6">
              See how we've installed similar {product.category.toLowerCase()} for Ottawa homeowners.
            </p>
            <Link href="/gallery">
              <Button variant="outline" className="gap-2">
                View Project Gallery
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
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
