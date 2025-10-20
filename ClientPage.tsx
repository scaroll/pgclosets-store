"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from "react"
// import { LocalBusinessJSONLD } from "@/lib/seo" // Temporarily disabled due to build error
import { Button } from "@/components/ui/button"

export default function ClientPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* <LocalBusinessJSONLD /> */}

      {/* <CHANGE> Added header with logo, navigation, and mobile menu as specified */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <svg className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-2xl font-bold text-gray-900">PG Closets</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-900 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                href="/contact"
                className="text-gray-900 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </Link>
              <Button variant="primary" size="sm" className="bg-blue-900 hover:bg-blue-700">
                Get Quote
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-900 hover:text-blue-700 p-2"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2 animate-in slide-in-from-top duration-200">
              <Link href="/" className="block px-3 py-2 text-gray-900 hover:text-blue-700 font-medium">
                Home
              </Link>
              <Link href="/products" className="block px-3 py-2 text-gray-900 hover:text-blue-700 font-medium">
                Products
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-900 hover:text-blue-700 font-medium">
                Contact
              </Link>
              <Button variant="primary" size="sm" className="mx-3 bg-blue-900 hover:bg-blue-700">
                Get Quote
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* <CHANGE> Updated hero section with navy background and exact specifications */}
      <section className="relative bg-blue-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/arcat/renin_176732_hd.jpg"
            alt="Modern closet with sliding doors"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-shadow-lg">Ottawa&apos;s Renin Closet Door Experts</h1>
          <p className="text-xl lg:text-2xl mb-10 max-w-3xl mx-auto font-light">Official dealer of premium Renin products with professional installation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-blue-900 hover:bg-gray-200 font-semibold px-10 py-4 text-lg transition-transform hover:scale-105"
            >
              Get a Free Quote
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-10 py-4 text-lg transition-transform hover:scale-105 bg-transparent"
            >
              View Our Products
            </Button>
          </div>
        </div>
      </section>

      {/* <CHANGE> Updated products section with exact 2x2 grid and specified content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Explore Our Collection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">From modern to classic, find the perfect doors to elevate your space.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Sliding Doors",
                subtitle: "12+ styles",
                description: "Space-saving bypass doors perfect for any room.",
                image: "/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite.jpg",
              },
              {
                title: "Bifold Doors",
                subtitle: "8+ styles",
                description: "Classic folding design with modern functionality.",
                image: "/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite.jpg",
              },
              {
                title: "Barn Doors",
                subtitle: "25+ styles",
                description: "Trendy sliding barn door systems for a rustic touch.",
                image: "/images/arcat/renin_176732_hd.jpg",
              },
              {
                title: "Hardware",
                subtitle: "15+ options",
                description: "Premium hardware and accessories for a custom finish.",
                image: "/images/arcat/renin_199063_hd.jpg",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{product.title}</h3>
                  <p className="text-blue-800 font-semibold text-sm mb-3">{product.subtitle}</p>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <Button variant="link" className="text-blue-900 font-semibold p-0">
                    Learn More &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <CHANGE> Added CTA section with navy background as specified */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Ready to Transform Your Home?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-light">
            Get a free, no-obligation consultation and quote from our experts today.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-200 font-semibold px-10 py-4 text-lg transition-transform hover:scale-105"
          >
            Request Your Free Quote
          </Button>
        </div>
      </section>

      {/* <CHANGE> Added footer with contact info and social links as specified */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-white mb-4">PG Closets</h3>
              <p className="text-gray-400 mb-4">Ottawa&apos;s premier Renin closet door specialists.</p>
              <p className="text-sm text-gray-500">Official dealer & installer.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 spencer@peoplesgrp.com</p>
                <p>📱 (613) 422-5800</p>
                <p>📍 Ottawa, Ontario</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} PG Closets. All rights reserved. | <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link> | <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
