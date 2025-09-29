"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import HeroVideo from "../HeroVideo"
import { Product } from "@/types/commerce"
import { formatPrice } from "@/lib/utils"
import StandardLayout from "@/components/layout/StandardLayout"
import { LocalBusinessJSONLD } from "@/lib/seo"
import { LogoBackgroundPatterns } from "@/components/brand/LogoBackgroundPatterns"
import { AnimatedLogo } from "@/components/brand/AnimatedLogo"
import { ResponsiveLogoVariants } from "@/components/brand/ResponsiveLogoVariants"
import { trackLogoInteraction, getUserJourneyStage } from "@/lib/analytics/logo-tracking"
import { LogoConversionOptimizer, CTALogoButton } from "@/components/conversion/LogoConversionOptimizer"

export default function ClientPage({ products }: { products: Product[] }) {
  const [quoteStep, setQuoteStep] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [heroLogoVisible, setHeroLogoVisible] = useState(false)

  const handleHeroLogoClick = () => {
    trackLogoInteraction({
      event: 'hero_logo_click',
      logo_type: 'hero',
      interaction_type: 'click',
      page_location: '/',
      user_journey_stage: 'awareness',
      conversion_context: 'hero_branding'
    });
  }

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setQuoteStep(2)
  }

  return (
    <StandardLayout>
      <LocalBusinessJSONLD />
      <div className="bg-white">

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />

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

        {/* Logo watermark overlay */}
        <div className="absolute top-8 right-8 z-15 opacity-20">
          <ResponsiveLogoVariants
            variant="signature"
            theme="dark"
            width={120}
            height={24}
            animated={true}
            className="filter drop-shadow-lg"
          />
        </div>

        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
          {/* Premium hero logo */}
          <div className="mb-12 flex justify-center">
            <AnimatedLogo
              animation="luxury"
              width={200}
              height={40}
              delay={0.8}
              onAnimationComplete={() => {
                setHeroLogoVisible(true);
                trackLogoInteraction({
                  event: 'hero_logo_animation_complete',
                  logo_type: 'hero',
                  interaction_type: 'animation_complete',
                  page_location: '/',
                  user_journey_stage: 'awareness',
                  animation_type: 'luxury'
                });
              }}
              className="filter drop-shadow-2xl cursor-pointer"
              onClick={handleHeroLogoClick}
            />
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-light tracking-wide">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span>Now scheduling in-home consultations</span>
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extralight mb-8 leading-[1.1] text-white tracking-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Closet Doors</span>
            <br />
            <span className="text-slate-300 text-5xl lg:text-6xl">For Your Home</span>
          </h1>
          <p className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-slate-200 font-light leading-relaxed">
            We design and install closet doors in Ottawa with quality materials and reliable service.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto text-white">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-light mb-2">500+</div>
              <div className="text-sm text-slate-300 uppercase tracking-widest font-light">Luxury Installations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-light mb-2">★★★★★</div>
              <div className="text-sm text-slate-300 uppercase tracking-widest font-light">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-light mb-2">15+</div>
              <div className="text-sm text-slate-300 uppercase tracking-widest font-light">Years Mastery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-light mb-2">Award</div>
              <div className="text-sm text-slate-300 uppercase tracking-widest font-light">Winning Design</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <CTALogoButton
              href="/request-work"
              variant="premium"
              size="lg"
              trackingContext="hero_primary_cta"
              className="hover:scale-105 transform transition-transform duration-300"
            >
              Request Private Consultation
            </CTALogoButton>

            <CTALogoButton
              href="/products"
              variant="secondary"
              size="lg"
              trackingContext="hero_secondary_cta"
              showLogo={false}
              className="text-slate-100 hover:border-white hover:text-white"
            >
              Explore Collection
            </CTALogoButton>
          </div>

          {/* Trust signal below CTAs */}
          <div className="mt-8 flex justify-center">
            <LogoConversionOptimizer
              placement="hero"
              variant="trust_signal"
              size="md"
              className="text-white/70"
            />
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
            <h2 className="text-4xl lg:text-5xl font-extralight mb-4 text-slate-900 tracking-tight">Premium Door Collection</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
              Browse our complete selection of premium closet doors with instant pricing
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

                  {/* Logo watermark on product images */}
                  <div className="absolute bottom-2 right-2 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
                    <ResponsiveLogoVariants
                      variant="compact"
                      theme="dark"
                      width={40}
                      height={8}
                      className="filter drop-shadow-sm"
                    />
                  </div>

                  <div className="absolute top-2 left-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 py-1 text-xs font-light tracking-[0.2em] uppercase backdrop-blur-sm">
                    Premium
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-light text-slate-900 mb-2 tracking-wide">{product.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 truncate font-light">{product.description}</p>
                  <div className="text-3xl font-extralight text-slate-900 mb-6 tracking-tight">{formatPrice(product.variants[0]?.price)}</div>
                  <div className="flex gap-2">
                    <CTALogoButton
                      onClick={() => handleSelectProduct(product)}
                      variant="primary"
                      size="sm"
                      trackingContext="product_card_quote"
                      className="flex-1 text-sm uppercase tracking-widest"
                    >
                      Get Quote
                    </CTALogoButton>
                    <CTALogoButton
                      href={`/products/${product.handle}`}
                      variant="secondary"
                      size="sm"
                      showLogo={false}
                      trackingContext="product_card_details"
                      className="px-4 text-sm uppercase tracking-widest"
                    >
                      Details
                    </CTALogoButton>
                  </div>

                  {/* Trust signal on product cards */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <LogoConversionOptimizer
                      placement="pricing"
                      variant="trust_signal"
                      size="sm"
                    />
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
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#1B4A9C]">Get Your Quote</h2>
              <p className="text-lg text-gray-600">Professional installation included</p>
            </div>

            <div className="bg-[#F5F5F5] p-8 border-2 border-[#E0E0E0]">
              {quoteStep === 1 && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-8 text-[#1B4A9C]">Choose Your Door Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-4 bg-white border-2 border-[#E0E0E0] hover:border-[#1B4A9C] transition-all"
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
                        <div className="font-semibold text-[#1B4A9C] mb-1 text-sm">{product.title}</div>
                        <div className="text-[#1B4A9C] font-bold text-lg">{formatPrice(product.variants[0]?.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quoteStep === 2 && selectedProduct && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-8 text-[#1B4A9C]">Your Quote: {selectedProduct.title}</h3>
                  <div className="bg-white p-8 border-2 border-[#E0E0E0] mb-6">
                    <div className="text-4xl font-bold text-[#1B4A9C] mb-6">{formatPrice(selectedProduct.variants[0]?.price)}</div>
                    <div className="text-sm text-gray-600 mb-6">
                      ✓ Professional installation included
                      <br />✓ Lifetime warranty
                      <br />✓ 2-week delivery guarantee
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="bg-[#1B4A9C] text-white px-8 py-3 font-semibold hover:bg-[#153A7E] transition-all uppercase tracking-wide inline-block"
                  >
                    Book Consultation
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      </div>
    </StandardLayout>
  )
}
