"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator } from "lucide-react"
import { trackCTAClick } from "@/lib/analytics/events"
import { getSmartDefaultProduct, getDefaultConfiguratorData } from "@/lib/estimator-defaults"
import { DOOR_TYPES, formatPrice } from "@/lib/door-types"

// Dynamic import - wizard only loads when Quick Configure clicked
const InstantEstimatorWizard = dynamic(
  () => import("@/components/configurator/InstantEstimatorWizard").then(mod => ({ default: mod.InstantEstimatorWizard })),
  { ssr: false }
)

const FEATURED_SLUGS = [
  "renin-barn-doors",
  "renin-bypass-doors",
  "renin-bifold-doors",
] as const

const categories = FEATURED_SLUGS.map((slug) => {
  const door = DOOR_TYPES.find((type) => type.slug === slug)
  return door
    ? {
        name: door.name,
        slug: door.slug,
        image: door.image,
        description: door.description,
        fromPrice: formatPrice(door.fromPrice, true),
      }
    : null
}).filter(Boolean) as Array<{
  name: string
  slug: string
  image: string
  description: string
  fromPrice: string
}>

export function CategoryTiles() {
  const [showEstimator, setShowEstimator] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleQuickConfigure = (categorySlug: string, categoryName: string) => {
    setSelectedCategory(categorySlug)
    setShowEstimator(true)
    trackCTAClick({
      location: 'category_tile',
      label: 'Quick Configure',
      product_name: categoryName,
    })
  }

  const defaultProduct = selectedCategory
    ? getSmartDefaultProduct({
        entryPoint: 'category_tile',
        lastViewedCategory: selectedCategory
      })
    : getSmartDefaultProduct()

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by Door Type
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections of premium closet doors, each designed for specific applications and spaces.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
            <Card key={category.slug} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <Link href={`/collections/${category.slug}`} aria-label={`Browse ${category.name} collection`}>
                <div className="relative aspect-[4/3] overflow-hidden cursor-pointer">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-2xl font-bold mb-1">{category.name}</div>
                    <div className="text-sm opacity-90">{category.description}</div>
                  </div>
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Starting at</div>
                    <div className="text-xl font-semibold">{category.fromPrice}</div>
                  </div>
                  <Link href={`/collections/${category.slug}`} aria-label={`View all ${category.name}`} className="min-h-[48px] min-w-[48px] flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform cursor-pointer" />
                  </Link>
                </div>

                {/* Quick Configure CTA - Opens wizard with smart default */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group/btn hover:bg-teal-600 hover:text-white hover:border-teal-600"
                  onClick={() => handleQuickConfigure(category.slug, category.name)}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Quick Configure
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Estimator Wizard - Opens with context-aware default product */}
    {showEstimator && (
      <InstantEstimatorWizard
        isOpen={showEstimator}
        onClose={() => {
          setShowEstimator(false)
          setSelectedCategory(null)
        }}
        initialProduct={{
          id: defaultProduct.slug,
          title: defaultProduct.title,
          configuratorData: getDefaultConfiguratorData(defaultProduct.slug)
        }}
        entryPoint="category_tile"
      />
    )}
    </>
  )
}
