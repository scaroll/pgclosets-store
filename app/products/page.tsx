"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function ProductsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const products = [
    {
      name: "Continental",
      price: 459,
      image: "/images/renin_176732_hd.jpg",
      specs: "Premium engineered wood core, durable laminate surface",
    },
    {
      name: "Provincial",
      price: 549,
      image: "/images/renin_205750_hd.jpg",
      specs: "Traditional styling, heavy-duty pivot hinges",
    },
    {
      name: "Gatsby",
      price: 799,
      image: "/images/renin_205729_hd.jpg",
      specs: "Modern barn door design, premium hardware included",
    },
    {
      name: "Euro",
      price: 899,
      image: "/images/renin_199063_hd.jpg",
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
              <Link href="/" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
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
                <Link href="/request-work" className="bg-[#9BC4E2] text-[#1B4A9C] py-3 font-semibold text-center">
                  Get Quote
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="pt-48">
        <section id="products" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-[#1B4A9C]">Our Door Collection</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Browse our complete selection of premium closet doors with instant pricing. Each door is crafted with the finest materials and designed to elevate your space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.name}
                  className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all border border-[#E0E0E0]"
                >
                  <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      loading={index < 3 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={80}
                    />
                    <div className="absolute top-2 left-2 bg-[#1B4A9C] text-white px-3 py-1 text-xs font-semibold">
                      NEW
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{product.name}</h3>
                    <p className="text-[#6B7280] text-sm mb-4 h-10">{product.specs}</p>
                    <div className="text-3xl font-bold text-[#1B4A9C] mb-6">${product.price}.00</div>
                    <div className="flex gap-2">
                      <Link
                        href="/request-work"
                        className="flex-1 bg-[#1B4A9C] text-white py-3 font-semibold hover:bg-[#153A7E] transition-all text-sm uppercase tracking-wide text-center"
                      >
                        Get Quote
                      </Link>
                      <Link
                        href={`/products/${product.name.toLowerCase()}`}
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
      </main>

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
                Ottawa's premier closet door specialists, transforming homes with premium solutions.
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
