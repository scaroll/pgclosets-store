"use client"

import { useState } from "react"
import { LocalBusinessJSONLD } from "../lib/seo"
import { Button } from "../components/ui/button"

export default function ClientPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans">
      <LocalBusinessJSONLD />

      {/* <CHANGE> Added header with logo, navigation, and mobile menu as specified */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">PG Closets</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-900 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <a
                href="/products"
                className="text-gray-900 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Products
              </a>
              <a
                href="/contact"
                className="text-gray-900 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </a>
              <Button variant="default" size="sm" className="bg-blue-900 hover:bg-blue-700">
                Get Quote
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-900 hover:text-blue-700 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2 animate-in slide-in-from-top duration-200">
              <a href="/" className="block px-3 py-2 text-gray-900 hover:text-blue-700 font-medium">
                Home
              </a>
              <a href="/products" className="block px-3 py-2 text-gray-900 hover:text-blue-700 font-medium">
                Products
              </a>
              <a href="/contact" className="block px-3 py-2 text-gray-900 hover:text-blue-700 font-medium">
                Contact
              </a>
              <Button variant="default" size="sm" className="mx-3 bg-blue-900 hover:bg-blue-700">
                Get Quote
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* <CHANGE> Updated hero section with navy background and exact specifications */}
      <section className="bg-blue-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">Ottawa's Renin Closet Door Experts</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Official dealer • Professional installation</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              className="bg-white text-blue-900 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              Get Free Quote
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-3 bg-transparent"
            >
              View Products
            </Button>
          </div>
        </div>
      </section>

      {/* <CHANGE> Updated products section with exact 2x2 grid and specified content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Sliding Doors",
                subtitle: "12+ styles",
                description: "Space-saving bypass doors perfect for any room",
                image: "/images/arcat/renin_205739_Bypass_Closet_Doors_Euro_3_Lite.jpg",
              },
              {
                title: "Bifold Doors",
                subtitle: "8+ styles",
                description: "Classic folding design with modern functionality",
                image: "/images/arcat/renin_205746_Bifold_Closet_Door_Euro_1_Lite.jpg",
              },
              {
                title: "Barn Doors",
                subtitle: "25+ styles",
                description: "Trendy sliding barn door systems",
                image: "/images/arcat/renin_205731_Mix_Match_Hardware_Driftwood_K_Design.jpg",
              },
              {
                title: "Hardware",
                subtitle: "15+ options",
                description: "Premium hardware and accessories",
                image: "/images/arcat/renin_205752_Barn_Door_Hardware_Kits_Cadium_Bent_Strap.jpg",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-blue-900 font-semibold mb-3">{product.subtitle}</p>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <Button variant="outline" className="w-full hover:bg-blue-900 hover:text-white bg-transparent">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <CHANGE> Added CTA section with navy background as specified */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Transform Your Home</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ready to upgrade your closet doors? Get a free consultation and quote today.
          </p>
          <Button
            variant="default"
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100 font-semibold px-8 py-3"
          >
            Get Your Quote
          </Button>
        </div>
      </section>

      {/* <CHANGE> Added footer with contact info and social links as specified */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">PG Closets</h3>
              <p className="text-gray-600 mb-4">Ottawa's premier Renin closet door specialists</p>
              <p className="text-gray-600">Official dealer • Professional installation</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-600">
                <p>📧 spencer@peoplesgrp.com</p>
                <p>📱 (613) 422-5800</p>
                <p>📍 Ottawa, Ontario</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-900 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-900 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297L3.182 17.635l1.935-1.935c.807.807 1.958 1.297 3.323 1.297c2.58 0 4.677-2.097 4.677-4.677s-2.097-4.677-4.677-4.677c-1.365 0-2.516.49-3.323 1.297L3.182 6.365l1.944-1.944c.875-.807 2.026-1.297 3.323-1.297c2.58 0 4.677 2.097 4.677 4.677s-2.097 4.677-4.677 4.677z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 PG Closets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
