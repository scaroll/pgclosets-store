"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import HeroVideo from "../HeroVideo"
import { Product } from "@/types/commerce"
import { formatPrice } from "@/lib/utils"
import StandardLayout from "@/components/layout/StandardLayout"
import { LocalBusinessJSONLD } from "@/lib/seo"

// Import conversion components
import TrustSignals from "@/components/conversion/TrustSignals"
import { PrimaryCTA, UrgentCTA, QuoteCTA } from "@/components/conversion/OptimizedCTA"
import UrgencyBanner from "@/components/conversion/UrgencyBanner"
import SocialProof from "@/components/conversion/SocialProof"
import { QuoteWidget } from "@/components/conversion/QuoteWidget"
import ConversionTracking, { useConversionTracking, TrackingCTA } from "@/components/conversion/ConversionTracking"

export default function ClientPage({ products }: { products: Product[] }) {
  const [quoteStep, setQuoteStep] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { trackConversions } = useConversionTracking()

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setQuoteStep(2)
    trackConversions.productView(product.title)
  }

  const _handlePrimaryCTA = () => {
    trackConversions.quoteRequest(750)
  }

  const _handleSecondaryCTA = () => {
    trackConversions.productView("Collection Browse")
  }

  return (
    <StandardLayout>
      <ConversionTracking />
      <LocalBusinessJSONLD />

      {/* Urgency Banner */}
      <UrgencyBanner
        variant="consultation"
        position="top"
        dismissible={true}
      />

      <div className="bg-white" style={{ paddingTop: '60px' }}>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
          {/* Enhanced Value Proposition */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>🔥 FREE Installation This Month - Save $500!</span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extralight mb-8 leading-[1.1] text-white tracking-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Premium Closet Doors</span>
            <br />
            <span className="text-slate-300 text-4xl lg:text-5xl">Transform Your Ottawa Home</span>
          </h1>

          {/* Enhanced Value Proposition */}
          <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-slate-200 font-light leading-relaxed">
            Get a <span className="text-white font-semibold">FREE quote in 24 hours</span> for premium closet doors with
            <span className="text-white font-semibold"> lifetime warranty</span> and professional installation.
          </p>

          {/* Trust Indicators */}
          <TrustSignals variant="compact" className="mb-8 justify-center" />

          {/* Optimized CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <TrackingCTA
              ctaText="Get Free Quote in 24 Hours"
              ctaLocation="Hero_Primary"
              conversionType="quote"
              value={750}
              href="/request-work"
            >
              <PrimaryCTA
                size="xl"
                text="Get FREE Quote in 24 Hours"
                subtext="No obligation • Professional consultation"
              />
            </TrackingCTA>

            <TrackingCTA
              ctaText="Call Now for Instant Quote"
              ctaLocation="Hero_Phone"
              conversionType="phone"
              href="tel:+16134225800"
            >
              <div className="group bg-green-600 text-white hover:bg-green-700 font-semibold px-12 py-6 text-xl tracking-wide transition-all duration-500 hover:shadow-2xl hover:scale-105 rounded-lg">
                <span className="flex items-center justify-center gap-3">
                  📞 Call Now: (613) 422-5800
                  <span className="text-sm opacity-90">Instant Quote</span>
                </span>
              </div>
            </TrackingCTA>
          </div>

          {/* Enhanced Social Proof Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto text-white">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2 text-green-400">500+</div>
              <div className="text-sm text-slate-300 uppercase tracking-widest font-light">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2 text-yellow-400">★★★★★</div>
              <div className="text-sm text-slate-300 uppercase tracking-widest font-light">5-Star Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2 text-blue-400">15+</div>
              <div className="text-sm text-slate-300 uppercase tracking-widest font-light">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2 text-purple-400">∞</div>
              <div className="text-sm text-slate-300 uppercase tracking-widest font-light">Lifetime Warranty</div>
            </div>
          </div>

          {/* Additional CTA with urgency */}
          <div className="text-center">
            <p className="text-slate-300 text-sm mb-4">⏰ Only 3 consultation slots left this week</p>
            <UrgentCTA
              size="lg"
              text="Book Today - Limited Availability"
              subtext="Secure your preferred time slot"
              href="/request-work"
            />
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <TrustSignals variant="hero" />

      {/* Enhanced Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-extralight mb-4 text-slate-900 tracking-tight">
              Premium Door Collection
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide mb-6">
              Browse our complete selection of luxury closet doors with <span className="font-semibold text-slate-900">instant pricing</span> and professional installation
            </p>

            {/* Product CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <QuoteCTA
                text="Get Product Quote Now"
                subtext="Custom pricing in 24 hours"
                href="/request-work"
              />
              <Link
                href="/products"
                className="px-8 py-3 border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 text-lg font-medium tracking-wide text-center rounded-lg"
              >
                View All 50+ Designs →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => (
              <div
                key={product.id}
                className="bg-white shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 rounded-lg"
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
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm rounded-full">
                    ✓ In Stock
                  </div>
                  <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                    FREE Install
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-light text-slate-900 mb-2 tracking-wide">{product.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 font-light">{product.description}</p>

                  {/* Enhanced pricing with urgency */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                      {formatPrice(product.variants[0]?.price)}
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      ✓ Installation included ✓ Lifetime warranty
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <TrackingCTA
                      ctaText="Get Quote"
                      ctaLocation="Product_Card"
                      conversionType="quote"
                      value={product.variants[0]?.price}
                      className="flex-1"
                    >
                      <button
                        onClick={() => handleSelectProduct(product)}
                        className="flex-1 bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition-all duration-500 hover:shadow-xl text-sm uppercase tracking-widest rounded-lg"
                      >
                        Get FREE Quote
                      </button>
                    </TrackingCTA>

                    <TrackingCTA
                      ctaText="View Details"
                      ctaLocation="Product_Card"
                      conversionType="engagement"
                      href={`/products/${product.handle}`}
                    >
                      <Link
                        href={`/products/${product.handle}`}
                        className="px-4 py-3 border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm uppercase tracking-widest text-center font-semibold rounded-lg"
                      >
                        Details
                      </Link>
                    </TrackingCTA>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to action after products */}
          <div className="text-center mt-12">
            <p className="text-slate-600 mb-6">
              Can't find exactly what you're looking for? We create custom solutions!
            </p>
            <PrimaryCTA
              size="lg"
              text="Get Custom Quote"
              subtext="Free consultation • Custom designs"
              href="/request-work"
            />
          </div>
        </div>
      </section>

      {/* Quote Widget Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-slate-900 mb-4">
              Get Your Instant Quote
            </h2>
            <p className="text-lg text-slate-600">
              Calculate your project cost in under 2 minutes
            </p>
          </div>
          <QuoteWidget variant="full" />
        </div>
      </section>

      {/* Social Proof Section */}
      <SocialProof variant="reviews" />

      {/* Enhanced Quote Section with Urgency */}
      {quoteStep > 0 && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-900">
                🎯 Your Personalized Quote
              </h2>
              <p className="text-lg text-blue-700">
                Professional installation included • Lifetime warranty • FREE consultation
              </p>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-xl">
              {quoteStep === 1 && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-8 text-blue-900">Choose Your Door Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-4 bg-white border-2 border-blue-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300 rounded-lg"
                      >
                        <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
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
                        <div className="font-semibold text-blue-900 mb-1 text-sm">{product.title}</div>
                        <div className="text-blue-700 font-bold text-lg">{formatPrice(product.variants[0]?.price)}</div>
                        <div className="text-xs text-green-600 font-semibold mt-1">✓ FREE Installation</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quoteStep === 2 && selectedProduct && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-8 text-blue-900">
                    🎉 Your Quote: {selectedProduct.title}
                  </h3>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-8 mb-6">
                    <div className="text-5xl font-bold text-green-700 mb-4">
                      {formatPrice(selectedProduct.variants[0]?.price)}
                    </div>
                    <div className="text-lg text-green-700 mb-6 space-y-2">
                      <div>✓ Professional installation included ($300 value)</div>
                      <div>✓ Lifetime warranty</div>
                      <div>✓ FREE in-home consultation</div>
                      <div>✓ 2-week delivery guarantee</div>
                    </div>
                    <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-6">
                      <div className="text-amber-800 font-semibold mb-1">🔥 Limited Time Offer</div>
                      <div className="text-amber-700 text-sm">Book this week and save $500 on installation!</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <UrgentCTA
                      size="lg"
                      text="Book FREE Consultation Now"
                      subtext="Secure this price • Limited slots"
                      href="/contact"
                    />
                    <a
                      href="tel:+16134225800"
                      className="flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-4 font-semibold hover:bg-green-700 transition-all duration-300 text-lg tracking-wide rounded-lg"
                    >
                      📞 Call Now: (613) 422-5800
                      <span className="text-sm opacity-90">Instant Booking</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-4">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join 500+ satisfied Ottawa homeowners who chose PG Closets
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <PrimaryCTA
              size="xl"
              text="Get FREE Quote Today"
              subtext="24-hour response guaranteed"
              href="/request-work"
            />
            <a
              href="tel:+16134225800"
              className="bg-green-600 text-white hover:bg-green-700 font-semibold px-12 py-6 text-xl tracking-wide transition-all duration-500 hover:shadow-2xl hover:scale-105 rounded-lg flex items-center justify-center gap-3"
            >
              📞 (613) 422-5800
              <span className="text-sm opacity-90">Call Now</span>
            </a>
          </div>

          <div className="mt-8 text-slate-400 text-sm">
            🛡️ Licensed & Insured • ⭐ 5-Star Rated • 🎯 Lifetime Warranty • 🚚 FREE Consultation
          </div>
        </div>
      </section>

      </div>
    </StandardLayout>
  )
}