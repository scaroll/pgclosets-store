import { FeaturedProducts } from "@/components/store/featured-products";
import { HeroSection } from "@/components/store/hero-section";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/Heading-new";
import Text from "@/components/ui/Text-new";
import Card from "@/components/ui/Card-new";
import {
  getFeaturedProducts,
  productCategories,
} from "@/lib/enhanced-renin-products";
import Image from "next/image";
import StandardLayout from "@/components/layout/StandardLayout";

export const metadata = {
  title: "Premium Closet Door Store | Renin Products | PG Closets Ottawa",
  description:
    "Shop premium Renin closet doors online. Barn doors, bypass doors, bifold doors with professional installation. Free shipping in Ottawa area.",
};

export default function StorePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <StandardLayout>
      <main>
        <HeroSection />

        <CategoriesSection />
        <FeaturedProducts products={featuredProducts} />

        <section className="bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <Card padding="lg" className="shadow-xl text-center">
              <Heading level={2} className="mb-4">
                Need Help Choosing?
              </Heading>
              <Text size="lg" variant="secondary" className="mb-8 max-w-2xl mx-auto">
                Our Ottawa experts are here to help you find the perfect closet
                door solution for your home
              </Text>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact">
                  <Button variant="primary" size="lg">
                    Free Online Quote
                  </Button>
                </a>
                <a href="mailto:spencer@peoplesgrp.com">
                  <Button variant="secondary" size="lg">
                    Email: spencer@peoplesgrp.com
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </StandardLayout>
  );
}

function CategoriesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Heading level={2} className="mb-4">
            Shop by Category
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Discover our complete range of premium Renin closet doors and
            hardware
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCategories.map((category, index) => (
            <a
              key={category.id}
              href={`/store/products?category=${category.id}`}
              className="group"
            >
              <Card hover padding="md" className="overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.heroImage || "/placeholder.svg"}
                    alt={`${category.name} - Premium closet doors by Renin`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={index < 3}
                    loading={index < 3 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-4 text-center">
                  <Heading level={3} className="mb-2 group-hover:text-slate-700 transition-colors">
                    {category.name}
                  </Heading>
                  <Text size="base" variant="secondary" className="mb-4">
                    {category.description}
                  </Text>
                  <Button variant="secondary" size="sm">
                    Shop {category.name}
                  </Button>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
