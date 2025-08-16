'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
}

interface CategoryShowcaseProps {
  categories: Category[]
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Shop by Category</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our carefully curated collection of premium closet solutions and barn doors.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-card">
              <img
                src={category.image_url || `/category-${category.slug}.png?height=300&width=400&query=${category.name}`}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && <p className="text-muted-foreground mt-2">{category.description}</p>}
                </div>

                <Link href={`/store/products?category=${category.slug}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90">Shop {category.name}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
