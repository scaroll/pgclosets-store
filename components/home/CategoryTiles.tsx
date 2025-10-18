"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator } from "lucide-react"
import { trackCTAClick } from "@/lib/analytics/events"
import { DOOR_TYPES, formatPrice } from "@/lib/door-types"

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

// Default dimensions for different door types (common sizes)
const DEFAULT_DIMENSIONS: Record<string, { width: number; height: number; panels: string }> = {
  'renin-barn-doors': { width: 72, height: 84, panels: '1' },
  'renin-bypass-doors': { width: 72, height: 84, panels: '2' },
  'renin-bifold-doors': { width: 48, height: 80, panels: '2' },
  'renin-pivot-doors': { width: 36, height: 84, panels: '1' },
  'renin-closet-doors': { width: 60, height: 80, panels: '2' },
  'renin-room-dividers': { width: 96, height: 96, panels: '3' },
}

export function CategoryTiles() {
  const buildEstimateUrl = (categorySlug: string) => {
    const defaults = DEFAULT_DIMENSIONS[categorySlug] || { width: 72, height: 84, panels: '2' }
    const params = new URLSearchParams({
      category: categorySlug.replace('renin-', ''),
      width: defaults.width.toString(),
      height: defaults.height.toString(),
      panels: defaults.panels,
    })
    return `/instant-estimate?${params.toString()}`
  }

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

                {/* Quick Configure CTA - Links to instant estimator with pre-filled params */}
                <Link href={buildEstimateUrl(category.slug)} className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group/btn hover:bg-teal-600 hover:text-white hover:border-teal-600"
                    onClick={() => trackCTAClick({
                      location: 'category_tile',
                      label: 'Quick Configure',
                      product_name: category.name,
                    })}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Quick Configure
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
