"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import HeroVideo from "../HeroVideo"
import { Product } from "@/types/commerce"
import { formatPrice } from "@/lib/utils"
import StandardLayout from "@/components/layout/StandardLayout"
import { LocalBusinessJSONLD } from "@/lib/seo"
import { LogoBackgroundPatterns } from "@/components/brand/LogoBackgroundPatterns"
import { AnimatedLogo } from "@/components/brand/AnimatedLogo"
// import { ResponsiveLogoVariants } from "@/components/brand/ResponsiveLogoVariants" // Temporarily disabled
import { trackLogoInteraction, getUserJourneyStage } from "@/lib/analytics/logo-tracking"
import { LogoConversionOptimizer, CTALogoButton } from "@/components/conversion/LogoConversionOptimizer"
import TrustSignals from "@/components/conversion/TrustSignals"
import TrustBadges from "@/components/trust/TrustBadges"
import { ProductCard } from "@/components/products"
import { Badge } from "@/components/ui/badge"
import TestimonialCarousel from "@/components/home/TestimonialCarousel"
import FAQSection from "@/components/home/FAQSection"

export default function ClientPage({ products }: { products: Product[] }) {
  const [quoteStep, setQuoteStep] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [heroLogoVisible, setHeroLogoVisible] = useState(false)
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    // No animation delays - instant visibility
    setContentVisible(true)

    // Handle floating CTA on scroll
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowFloatingCTA(true)
      } else {
        setShowFloatingCTA(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
              delay={0}
              onAnimationComplete={() => {
                setHeroLogoVisible(true);
              }}
              className="filter drop-shadow-2xl cursor-pointer"
              onClick={handleHeroLogoClick}
            />
          </div>

          {/* Urgency Badge */}
          <div className="mb-6">
            <Badge
              variant="outline"
              size="default"
              className="inline-flex items-center space-x-2 border-emerald-400/40 bg-emerald-500/10 text-emerald-100 px-5 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-emerald-500/20 backdrop-blur-sm shadow-lg shadow-emerald-500/20"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <span>Limited Availability - Book Your Free Consultation Today</span>
            </Badge>
          </div>

          {/* Massive Hero Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 sm:mb-8 leading-[0.95] text-white tracking-tighter">
            <span className="block bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-2xl">
              Transform Your
            </span>
            <span className="block mt-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent drop-shadow-2xl">
              Closet Space
            </span>
          </h1>

          {/* Enhanced Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-10 sm:mb-14 max-w-4xl mx-auto text-white/90 font-light leading-relaxed tracking-wide px-4">
            Premium custom closets designed for Ottawa homes.
            <span className="block mt-2 text-emerald-200 font-medium">
              Free consultation • Professional installation • Lifetime warranty
            </span>
          </p>

          {/* Dramatic CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
            <Link
              href="/request-work"
              className="add-to-cart relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg tracking-[0.08em] uppercase transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 border-2 border-emerald-400 group touch-target shadow-xl shadow-emerald-500/30 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center">
                Get Free Quote Now
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-5 bg-transparent text-white font-semibold text-lg tracking-[0.08em] uppercase transition-all duration-300 hover:bg-white hover:text-black border-2 border-white/70 hover:border-white group touch-target hover:shadow-xl hover:scale-105"
            >
              <span className="relative z-10">View Gallery</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto text-white">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">500+</div>
              <div className="text-xs text-white/70 uppercase tracking-[0.2em] font-semibold">Installations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">5.0</div>
              <div className="text-xs text-white/70 uppercase tracking-[0.2em] font-semibold">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">15+</div>
              <div className="text-xs text-white/70 uppercase tracking-[0.2em] font-semibold">Years</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">#1</div>
              <div className="text-xs text-white/70 uppercase tracking-[0.2em] font-semibold">In Ottawa</div>
            </div>
          </div>

          {/* Enhanced trust signals below CTAs */}
          <div className="mt-8 space-y-6">
            <div className="flex justify-center">
              <LogoConversionOptimizer
                placement="hero"
                variant="trust_signal"
                size="md"
                className="text-white/70"
              />
            </div>

            {/* Professional badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-sm text-white/80">
              <Badge variant="outline" className="flex items-center gap-2 bg-white/10 px-4 py-2.5 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                <span className="font-semibold">BBB A+ Rated</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 bg-white/10 px-4 py-2.5 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="font-semibold">Google Reviews 5.0</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 bg-white/10 px-4 py-2.5 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="font-semibold">Free Consultation</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 bg-white/10 px-4 py-2.5 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span className="font-semibold">Lifetime Warranty</span>
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-emerald-700 border-t-4 border-emerald-400 shadow-2xl shadow-emerald-900/50 backdrop-blur-sm transition-transform duration-500 ${
          showFloatingCTA ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className="hidden sm:block w-3 h-3 bg-emerald-300 rounded-full animate-pulse"></div>
              <div>
                <p className="font-bold text-lg">Ready to Transform Your Space?</p>
                <p className="text-sm text-emerald-100">Limited slots available this month</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/request-work"
                className="add-to-cart inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-700 font-bold text-sm tracking-wide uppercase transition-all duration-300 hover:bg-emerald-50 hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                Get Free Quote
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button
                onClick={() => setShowFloatingCTA(false)}
                className="px-3 py-3 text-white hover:bg-emerald-800/50 transition-colors rounded"
                aria-label="Close floating banner"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

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
            <h2 className="text-4xl lg:text-5xl font-extralight mb-4 text-slate-900 tracking-tight">Choose Your Style</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
              Browse our collection and get an instant quote. Free consultation included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuoteRequest={handleSelectProduct}
                imageLoadingPriority={index < 2 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Carousel - Social Proof */}
      <TestimonialCarousel />

      {/* FAQ Section - Address Objections */}
      <FAQSection />

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
                        className="product-item p-6 bg-white border-2 border-[#E0E0E0] hover:border-[#1B4A9C] transition-all touch-target"
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
                    className="add-to-cart bg-[#1B4A9C] text-white px-8 py-4 font-semibold hover:bg-[#153A7E] transition-all uppercase tracking-wide inline-block"
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
