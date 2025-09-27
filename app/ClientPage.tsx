"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import HeroVideo from "../HeroVideo"
import { Product } from "@/types/commerce"
import { formatPrice } from "@/lib/utils"
import StandardLayout from "@/components/layout/StandardLayout"
import { LocalBusinessJSONLD } from "@/lib/seo"

export default function ClientPage({ products }: { products: Product[] }) {
  const [quoteStep, setQuoteStep] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
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
            <Link
              href="/request-work"
              className="group bg-slate-900 text-white hover:bg-slate-800 font-light px-12 py-4 text-lg tracking-wide transition-all duration-500 hover:shadow-2xl hover:scale-105"
            >
              <span className="group-hover:hidden">Request Private Consultation</span>
              <span className="hidden group-hover:inline-flex items-center space-x-2">
                <span>Schedule Your Visit</span>
                <span>→</span>
              </span>
            </Link>
            <Link
              href="/products"
              className="group border border-slate-300 text-slate-100 hover:border-white hover:text-white font-light px-12 py-4 text-lg tracking-wide transition-all duration-300 text-center"
            >
              <span className="group-hover:hidden">Explore Collection</span>
              <span className="hidden group-hover:inline">View Curated Designs</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
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
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 py-1 text-xs font-light tracking-[0.2em] uppercase backdrop-blur-sm">
                    Premium
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-light text-slate-900 mb-2 tracking-wide">{product.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 truncate font-light">{product.description}</p>
                  <div className="text-3xl font-extralight text-slate-900 mb-6 tracking-tight">{formatPrice(product.variants[0]?.price)}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectProduct(product)}
                      className="flex-1 bg-slate-900 text-white py-3 font-light hover:bg-slate-800 transition-all duration-500 hover:shadow-xl text-sm uppercase tracking-widest"
                    >
                      Get Quote
                    </button>
                    <Link
                      href={`/products/${product.handle}`}
                      className="px-4 py-3 border border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm uppercase tracking-widest text-center font-light"
                    >
                      Details
                    </Link>
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
