"use client";

import { AnimatedLogo } from "@/components/brand/AnimatedLogo";
import { LogoBackgroundPatterns } from "@/components/brand/LogoBackgroundPatterns";
import StandardLayout from "@/components/layout/StandardLayout";
import { formatPrice } from "@/lib/pricing";
import { LocalBusinessJSONLD } from "@/lib/seo/LocalBusinessJSONLD";
import type { Product } from "@/types/commerce";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HeroVideo from "../HeroVideo";
// import { ResponsiveLogoVariants } from "@/components/brand/ResponsiveLogoVariants" // Temporarily disabled
import {
    CTALogoButton,
} from "@/components/conversion/LogoConversionOptimizer";
import {
    trackLogoInteraction,
} from "@/lib/analytics/logo-tracking";

export default function ClientPage({ products }: { products: Product[] }) {
  const [quoteStep, setQuoteStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [_heroLogoVisible, setHeroLogoVisible] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuoteStep(2);
  };

  return (
    <StandardLayout>
      <LocalBusinessJSONLD />
      <div className="bg-white">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
          <HeroVideo />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />

          {/* Enhanced logo background pattern overlay */}
          <div className="absolute inset-0 z-10">
            <LogoBackgroundPatterns
              pattern="luxury"
              opacity={0.03}
              animated={true}
              density="sparse"
              className="text-white"
            />
          </div>

          {/* Logo watermark overlay - temporarily disabled */}
          {/* <div className="absolute top-8 right-8 z-15 opacity-20">
          <ResponsiveLogoVariants
            variant="signature"
            theme="dark"
            width={120}
            height={24}
            animated={true}
            className="filter drop-shadow-lg"
          />
        </div> */}

          {/* Removed ambient glow effects for cleaner aesthetic */}
          <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
            {/* Premium hero logo */}
            <div className="mb-8 flex justify-center">
              <AnimatedLogo
                animation="luxury"
                width={200}
                height={40}
                delay={0.8}
                onAnimationComplete={() => {
                  setHeroLogoVisible(true);
                  trackLogoInteraction({
                    event: "hero_logo_animation_complete",
                    logo_type: "hero",
                    interaction_type: "animation_complete",
                    page_location: "/",
                    user_journey_stage: "awareness",
                    animation_type: "luxury",
                  });
                }}
                className="filter drop-shadow-2xl cursor-pointer"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light mb-4 text-white tracking-tight">
              <span className="block">Elevated Taste</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-1 opacity-90">
                Without Pretense
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-8 max-w-2xl mx-auto text-white/80 font-light leading-relaxed">
              Official Renin dealer offering curated collections, professional installation, and lifetime warranty for your Ottawa home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-work"
                className="add-to-cart inline-flex items-center justify-center px-10 py-4 bg-white text-black font-medium text-base tracking-wider uppercase transition-all duration-300 hover:bg-gray-200 border-2 border-white group touch-target"
              >
                <span className="relative z-10">Get a Free Quote</span>
                <svg
                  className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center px-10 py-4 bg-transparent text-white font-medium text-base tracking-wider uppercase transition-all duration-300 hover:bg-white hover:text-black border-2 border-white/50 hover:border-white group touch-target"
              >
                <span className="relative z-10">View Products</span>
              </Link>
            </div>

            {/* Enhanced trust signals below CTAs */}
            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>BBB A+ Rated</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span>Google 5.0 ⭐⭐⭐⭐⭐</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>Lifetime Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="py-20 bg-gray-50 relative">
          {/* Subtle logo background pattern for products section */}
          <LogoBackgroundPatterns
            pattern="watermark"
            opacity={0.02}
            density="sparse"
            className="absolute inset-0 text-slate-300"
          />

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-extralight mb-4 text-slate-900 tracking-tight">
                Choose Your Style
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
                Browse our curated collection of premium closet doors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-gray-100"
                >
                  <div className="aspect-square relative overflow-hidden group">
                    <Image
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading={index < 2 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase">
                      Bestseller
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-light text-slate-900 mb-2 tracking-wide">
                      {product.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 truncate font-light">
                      {product.description}
                    </p>
                    <div className="text-3xl font-extralight text-slate-900 mb-6 tracking-tight">
                      {formatPrice(product.variants?.[0]?.price ?? 0)}
                    </div>
                    <div className="flex gap-2">
                      <CTALogoButton
                        onClick={() => handleSelectProduct(product)}
                        variant="primary"
                        size="sm"
                        trackingContext="product_card_quote"
                        className="add-to-cart flex-1 text-sm uppercase tracking-widest py-3"
                      >
                        Get Quote
                      </CTALogoButton>
                      <CTALogoButton
                        href={`/products/${product.handle}`}
                        variant="secondary"
                        size="sm"
                        showLogo={false}
                        trackingContext="product_card_details"
                        className="touch-target px-4 text-sm uppercase tracking-widest py-3"
                      >
                        Details
                      </CTALogoButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {quoteStep > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[var(--color-primary)]">
                  Get Your Instant Quote
                </h2>
                <p className="text-lg text-gray-600">
                  Professional installation always included.
                </p>
              </div>

              <div className="bg-[var(--color-bg-secondary)] p-8 border-2 border-[var(--color-border-default)]">
                {quoteStep === 1 && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-8 text-[var(--color-primary)]">
                      1. Choose Your Door Style
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {products.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="product-item p-6 bg-white border-2 border-[var(--color-border-default)] hover:border-[var(--color-primary)] transition-all touch-target"
                        >
                          <div className="aspect-square relative mb-3 overflow-hidden">
                            <Image
                              src={product.thumbnail || "/placeholder.svg"}
                              alt={`${product.title} closet door design`}
                              fill
                              className="object-cover"
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw, 150px"
                              quality={75}
                            />
                          </div>
                          <div className="font-semibold text-[var(--color-primary)] mb-1 text-sm">
                            {product.title}
                          </div>
                          <div className="text-[var(--color-primary)] font-bold text-lg">
                            {formatPrice(product.variants?.[0]?.price ?? 0)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quoteStep === 2 && selectedProduct && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-8 text-[var(--color-primary)]">
                      2. Your Quote: {selectedProduct.title}
                    </h3>
                    <div className="bg-white p-8 border-2 border-[var(--color-border-default)] mb-6">
                      <div className="text-4xl font-bold text-[var(--color-primary)] mb-6">
                        {formatPrice(selectedProduct.variants?.[0]?.price ?? 0)}
                      </div>
                      <div className="text-sm text-gray-600 mb-6">
                        ✓ Professional installation included
                        <br />✓ Lifetime warranty
                        <br />✓ 2-week delivery guarantee
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="add-to-cart bg-[var(--color-primary)] text-white px-8 py-4 font-semibold hover:bg-[var(--color-primary)] transition-all uppercase tracking-wide inline-block"
                    >
                      Book Free Online Quote
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </StandardLayout>
  );
}
