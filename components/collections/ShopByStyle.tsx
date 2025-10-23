"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Style {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  trending?: boolean;
  colors: string[];
  features: string[];
}

interface ShopByStyleProps {
  styles: Style[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ShopByStyle({
  styles,
  title = "Shop by Style",
  subtitle = "Find the perfect match for your home aesthetic",
  className
}: ShopByStyleProps) {
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  return (
    <section className={cn("py-16 md:py-24 bg-white", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Styles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {styles.map((style) => (
            <Card
              key={style.id}
              className={cn(
                "group relative overflow-hidden border-0 shadow-lg transition-all duration-300 cursor-pointer",
                "hover:shadow-2xl hover:-translate-y-2"
              )}
              onMouseEnter={() => setHoveredStyle(style.id)}
              onMouseLeave={() => setHoveredStyle(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700",
                    hoveredStyle === style.id ? "scale-110" : "scale-100"
                  )}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Trending Badge */}
                {style.trending && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    Trending
                  </Badge>
                )}

                {/* Quick Actions */}
                <div className={cn(
                  "absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300",
                  hoveredStyle === style.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                )}>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                </div>

                {/* Product Count */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-gray-900">
                      {style.productCount} Products
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-teal-600 transition-colors">
                  {style.name}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {style.description}
                </p>

                {/* Colors */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">Colors:</span>
                  <div className="flex gap-1">
                    {style.colors.map((color, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 border-white shadow-sm",
                          color === '#FFFFFF' && "border-gray-300"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {style.features.slice(0, 3).map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      {feature}
                    </Badge>
                  ))}
                  {style.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      +{style.features.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white group"
                  asChild
                >
                  <Link href={`/collections/style/${style.id}`}>
                    Shop {style.name}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Hover Effect Overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br from-teal-600/10 to-transparent rounded-lg transition-opacity duration-300 pointer-events-none",
                hoveredStyle === style.id ? "opacity-100" : "opacity-0"
              )} />
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 text-lg border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
          >
            View All Styles
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}