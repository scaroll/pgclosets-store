"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import HeroVideo from "../HeroVideo"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quoteStep, setQuoteStep] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quotePrice, setQuotePrice] = useState(459)

  const products = [
    {
      name: "Continental",
      price: 459,
      image: "/images/arcat/renin_176732_hd.jpg",
      specs: "Premium engineered wood core, durable laminate surface",
    },
    {
      name: "Provincial",
      price: 549,
      image: "/images/arcat/renin_205750_hd.jpg",
      specs: "Traditional styling, heavy-duty pivot hinges",
    },
    {
      name: "Gatsby",
      price: 799,
      image: "/images/arcat/renin_205729_hd.jpg",
      specs: "Modern barn door design, premium hardware included",
    },
    {
      name: "Euro",
      price: 899,
      image: "/images/arcat/renin_199063_hd.jpg",
      specs: "Contemporary European styling, soft-close mechanism",
    },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 w-full z-50 bg-white shadow-lg" role="banner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-center py-3 text-sm tracking-wide">
            <div className="flex items-center justify-center space-x-8 text-xs uppercase font-light">
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                <span>Ottawa Team</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                <span>500+ Installations</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                <span>Trusted Service</span>
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/brand/pg-logo.png" alt="PG Closets" width={48} height={48} className="object-contain" />
              <div>
                <div className="text-2xl font-light tracking-wide text-slate-900">PG CLOSETS</div>
                <p className="text-xs text-slate-500 font-light uppercase tracking-widest">Ottawa Design Atelier</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/products" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">
                Products
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">
                About
              </Link>
              <Link href="/services" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">
                Services
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">
                Contact
              </Link>

              <div className="flex items-center space-x-4 ml-6">
                <Link href="/request-work" className="bg-slate-900 text-white px-8 py-2.5 text-sm font-light tracking-wide hover:bg-slate-800 transition-all duration-300">
                  Schedule Consultation
                </Link>
              </div>
            </nav>

            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#1B4A9C] hover:text-[#9BC4E2] p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden border-t py-4 space-y-2 bg-white">
              <Link href="/" className="block px-4 py-2 text-[#1B4A9C] hover:text-[#9BC4E2] font-medium">
                Home
              </Link>
              <Link href="/products" className="block px-4 py-2 text-[#1B4A9C] hover:text-[#9BC4E2] font-medium">
                Products
              </Link>
              <Link href="/about" className="block px-4 py-2 text-[#1B4A9C] hover:text-[#9BC4E2] font-medium">
                About
              </Link>
              <Link href="/services" className="block px-4 py-2 text-[#1B4A9C] hover:text-[#9BC4E2] font-medium">
                Services
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-[#1B4A9C] hover:text-[#9BC4E2] font-medium">
                Contact
              </Link>

              <div className="px-4 pt-4 grid grid-cols-2 gap-2">
                <a href="tel:6134225800" className="bg-[#1B4A9C] text-white py-3 text-center font-semibold">
                  Call Now
                </a>
                <button
                  onClick={() => {
                    setQuoteStep(1)
                    setMobileMenuOpen(false)
                  }}
                  className="bg-[#9BC4E2] text-[#1B4A9C] py-3 font-semibold"
                >
                  Get Quote
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 opacity-5 z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-light tracking-wide">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span>Now scheduling in-home consultations</span>
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extralight mb-8 leading-[1.1] text-slate-100 tracking-tight">
            Closet Doors
            <br />
            <span className="text-slate-300">For Your Home</span>
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#1B4A9C]">Premium Door Collection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete selection of premium closet doors with instant pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.name}
                className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all border border-[#E0E0E0]"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    loading={index < 2 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                    quality={75}
                  />
                  <div className="absolute top-2 left-2 bg-[#1B4A9C] text-white px-3 py-1 text-xs font-semibold">
                    NEW
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{product.name}</h3>
                  <p className="text-[#6B7280] text-sm mb-4">{product.specs}</p>
                  <div className="text-3xl font-bold text-[#1B4A9C] mb-6">${product.price}.00</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product.name)
                        setQuotePrice(product.price)
                        setQuoteStep(2)
                      }}
                      className="flex-1 bg-[#1B4A9C] text-white py-3 font-semibold hover:bg-[#153A7E] transition-all text-sm uppercase tracking-wide"
                    >
                      Get Quote
                    </button>
                    <Link
                      href="/products"
                      className="px-4 py-3 border-2 border-[#1B4A9C] text-[#1B4A9C] hover:bg-[#1B4A9C] hover:text-white transition-all text-sm uppercase tracking-wide text-center"
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
                        key={product.name}
                        onClick={() => {
                          setSelectedProduct(product.name)
                          setQuotePrice(product.price)
                          setQuoteStep(2)
                        }}
                        className="p-4 bg-white border-2 border-[#E0E0E0] hover:border-[#1B4A9C] transition-all"
                      >
                        <div className="aspect-square relative mb-3 overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={`${product.name} closet door design`}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="(max-width: 768px) 50vw, 150px"
                            quality={75}
                          />
                        </div>
                        <div className="font-semibold text-[#1B4A9C] mb-1 text-sm">{product.name}</div>
                        <div className="text-[#1B4A9C] font-bold text-lg">${product.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quoteStep === 2 && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-8 text-[#1B4A9C]">Your Quote: {selectedProduct}</h3>
                  <div className="bg-white p-8 border-2 border-[#E0E0E0] mb-6">
                    <div className="text-4xl font-bold text-[#1B4A9C] mb-6">${quotePrice}</div>
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

      <footer className="bg-[#1B4A9C] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#9BC4E2] flex items-center justify-center text-[#1B4A9C] font-bold text-lg">
                  PG
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PG CLOSETS</h3>
                  <p className="text-[#9BC4E2]">Premium Solutions</p>
                </div>
              </Link>
              <p className="text-gray-300 mb-6">
                Ottawa&apos;s premier closet door specialists, transforming homes with premium solutions.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#9BC4E2]">Sitemap</h4>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-300 hover:text-white">
                  Home
                </Link>
                <Link href="/products" className="block text-gray-300 hover:text-white">
                  Products
                </Link>
                <Link href="/about" className="block text-gray-300 hover:text-white">
                  About
                </Link>
                <Link href="/services" className="block text-gray-300 hover:text-white">
                  Services
                </Link>
                <Link href="/contact" className="block text-gray-300 hover:text-white">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#9BC4E2]">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div>(613) 422-5800</div>
                <div>info@pgclosets.com</div>
                <div>Ottawa & Surrounding Areas</div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="text-sm">
                    <div className="font-semibold text-[#9BC4E2] mb-2">Business Hours:</div>
                    <div>Mon-Fri: 8:00 AM - 6:00 PM</div>
                    <div>Sat: 9:00 AM - 4:00 PM</div>
                    <div>Sun: By Appointment</div>
                  </div>
                </div>
                <div className="mt-2">Licensed & Insured</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PG Closets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
