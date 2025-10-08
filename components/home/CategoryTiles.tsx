"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Barn Doors",
    slug: "renin-barn-doors",
    image: "https://www.renin.com/wp-content/uploads/2021/06/BD041-Augusta-Bright-White-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
    description: "Single-panel sliding doors with modern tracks",
    fromPrice: "$89900"
  },
  {
    name: "Bypass Doors",
    slug: "renin-bypass-doors",
    image: "https://www.renin.com/wp-content/uploads/2019/10/HS215-Bordeaux-Bright-White-Beauty-Room-Image.jpg",
    description: "Space-saving multi-panel closet doors",
    fromPrice: "$129900"
  },
  {
    name: "Bifold Doors",
    slug: "renin-bifold-doors",
    image: "https://www.renin.com/wp-content/uploads/2019/10/BF209-Chateau-Bright-White-Beauty-Room-Image.jpg",
    description: "Classic folding doors for standard closets",
    fromPrice: "$79900"
  }
]

export function CategoryTiles() {
  return (
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
            <Link key={category.slug} href={`/collections/${category.slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative aspect-[4/3] overflow-hidden">
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
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Starting at</div>
                      <div className="text-xl font-semibold">{category.fromPrice}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
