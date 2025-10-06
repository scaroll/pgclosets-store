"use client"

import { useState } from "react"
import Image from "next/image"
import Link from 'next/link'

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
      <header className="fixed top-0 w-full z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-center py-2 text-sm font-semibold">
            ⭐ 5.0 • 🏠 500+ Installations • ⏰ 15+ Years • 98% Satisfaction
          </div>

          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-lg">
                PG
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-primary)]">PG CLOSETS</h1>
                <p className="text-xs text-[var(--color-secondary)] font-medium">Premium Solutions</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/products" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] px-3 py-2 text-sm font-medium">
                Products
              </Link>
              <Link href="/about" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link href="/services" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] px-3 py-2 text-sm font-medium">
                Services
              </Link>
              <Link href="/contact" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] px-3 py-2 text-sm font-medium">
                Contact
              </Link>

              <div className="flex items-center space-x-4 ml-6">
                <a href="mailto:spencer@peoplesgrp.com" className="text-[var(--color-secondary)] font-semibold hover:text-[var(--color-primary)]">
                  Email Us
                </a>
                <button
                  onClick={() => setQuoteStep(1)}
                  className="bg-[var(--color-secondary)] text-[var(--color-primary)] px-6 py-2 font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all"
                >
                  Get Quote
                </button>
              </div>
            </nav>

            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] p-2"
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
              <Link href="/" className="block px-4 py-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium">
                Home
              </Link>
              <Link href="/products" className="block px-4 py-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium">
                Products
              </Link>
              <Link href="/about" className="block px-4 py-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium">
                About
              </Link>
              <Link href="/services" className="block px-4 py-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium">
                Services
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium">
                Contact
              </Link>

              <div className="px-4 pt-4 grid grid-cols-2 gap-2">
                <a href="mailto:spencer@peoplesgrp.com" className="bg-[var(--color-primary)] text-white py-3 text-center font-semibold">
                  Call Now
                </a>
                <button
                  onClick={() => {
                    setQuoteStep(1)
                    setMobileMenuOpen(false)
                  }}
                  className="bg-[var(--color-secondary)] text-[var(--color-primary)] py-3 font-semibold"
                >
                  Get Quote
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[#2C5AA0]">
        <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="mb-6">
            <span className="inline-block bg-[var(--color-secondary)] text-[var(--color-primary)] px-4 py-2 text-sm font-semibold">
              ⚡ December: 3 Slots Left
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">Premium Closet Doors for Ottawa Homes</h1>
          <p className="text-lg lg:text-xl mb-8 max-w-3xl mx-auto">
            Official Renin Dealer • 500+ Installations • Free Measurement
          </p>

          <div className="flex justify-center space-x-8 mb-8 text-[var(--color-secondary)]">
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Ottawa Homes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5.0★</div>
              <div className="text-sm">Google Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm">Satisfaction Rate</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setQuoteStep(1)}
              className="bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-white font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all"
            >
              Calculate Quote →
            </button>
            <Link
              href="/products"
              className="border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] font-semibold px-8 py-4 transition-all text-center"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[var(--color-primary)]">Premium Door Collection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete selection of premium closet doors with instant pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.name}
                className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all border border-[var(--color-border-default)]"
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
                  <div className="absolute top-2 left-2 bg-[var(--color-primary)] text-white px-3 py-1 text-xs font-semibold">
                    NEW
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">{product.name}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-4">{product.specs}</p>
                  <div className="text-3xl font-bold text-[var(--color-primary)] mb-6">${product.price}.00</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product.name)
                        setQuotePrice(product.price)
                        setQuoteStep(2)
                      }}
                      className="flex-1 bg-[var(--color-primary)] text-white py-3 font-semibold hover:bg-[var(--color-primary)] transition-all text-sm uppercase tracking-wide"
                    >
                      Get Quote
                    </button>
                    <Link
                      href="/products"
                      className="px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all text-sm uppercase tracking-wide text-center"
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
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[var(--color-primary)]">Get Your Quote</h2>
              <p className="text-lg text-gray-600">Professional installation included</p>
            </div>

            <div className="bg-[var(--color-bg-secondary)] p-8 border-2 border-[var(--color-border-default)]">
              {quoteStep === 1 && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-8 text-[var(--color-primary)]">Choose Your Door Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <button
                        key={product.name}
                        onClick={() => {
                          setSelectedProduct(product.name)
                          setQuotePrice(product.price)
                          setQuoteStep(2)
                        }}
                        className="p-4 bg-white border-2 border-[var(--color-border-default)] hover:border-[var(--color-primary)] transition-all"
                      >
                        <div className="aspect-square relative mb-3 overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="font-semibold text-[var(--color-primary)] mb-1 text-sm">{product.name}</div>
                        <div className="text-[var(--color-primary)] font-bold text-lg">${product.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quoteStep === 2 && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-8 text-[var(--color-primary)]">Your Quote: {selectedProduct}</h3>
                  <div className="bg-white p-8 border-2 border-[var(--color-border-default)] mb-6">
                    <div className="text-4xl font-bold text-[var(--color-primary)] mb-6">${quotePrice}</div>
                    <div className="text-sm text-gray-600 mb-6">
                      ✓ Professional installation included
                      <br />✓ Lifetime warranty
                      <br />✓ 2-week delivery guarantee
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="bg-[var(--color-primary)] text-white px-8 py-3 font-semibold hover:bg-[var(--color-primary)] transition-all uppercase tracking-wide inline-block"
                  >
                    Book Consultation
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[var(--color-primary)] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-primary)] font-bold text-lg">
                  PG
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PG CLOSETS</h3>
                  <p className="text-[var(--color-secondary)]">Premium Solutions</p>
                </div>
              </Link>
              <p className="text-gray-300 mb-6">
                Ottawa&apos;s premier closet door specialists, transforming homes with premium solutions.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[var(--color-secondary)]">Sitemap</h4>
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
              <h4 className="text-lg font-semibold mb-4 text-[var(--color-secondary)]">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div>spencer@peoplesgrp.com</div>
                <div>info@pgclosets.com</div>
                <div>Ottawa & Surrounding Areas</div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--color-secondary)] mb-2">Business Hours:</div>
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
