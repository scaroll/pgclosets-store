import Link from 'next/link'
"use client"
import Script from "next/script"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function ContactClientPage({ contactEmbedEnabled = true }: { contactEmbedEnabled?: boolean }) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const siteStats = {
    installations: "500+",
    rating: "5.0",
    experience: "15+",
    satisfaction: "98%",
  }

  useEffect(() => {
    if (!contactEmbedEnabled) {
      setScriptError(true)
      return
    }
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css"
    link.media = "screen"
    link.onerror = () => setScriptError(true)
    document.head.appendChild(link)

    // Robust polling for the Jobber embed. We fallback to the native form
    // if the widget doesn't attach within a reasonable time window or if
    // the container is missing.
    const START = Date.now()
    const MAX_MS = 10000
    const POLL_MS = 500
    const containerId = "83a3d24e-c18d-441c-80d1-d85419ea28ae"

    const poll = () => {
      const el = document.getElementById(containerId)
      const attached = !!el && el.children.length > 0
      if (attached) return
      if (Date.now() - START >= MAX_MS) {
        setScriptError(true)
        setScriptLoaded(false)
        return
      }
      setTimeout(poll, POLL_MS)
    }
    setTimeout(poll, POLL_MS)

    return () => {
      const existingLink = document.querySelector(
        'link[href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css"]',
      )
      if (existingLink) {
        document.head.removeChild(existingLink)
      }
    }
  }, [contactEmbedEnabled])

  const handleScriptLoad = () => {
    setScriptLoaded(true)
    // Keep error state untouched; polling will decide whether to show the
    // fallback if the widget doesn't attach despite script load.
  }

  const handleScriptError = () => {
    setScriptError(true)
    setScriptLoaded(false)
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="fixed top-0 w-full z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1B4A9C] to-[#4A5F8A] text-white text-center py-2 text-sm font-semibold">
            ⭐ {siteStats.rating} • 🏠 {siteStats.installations} Installations • ⏰ {siteStats.experience} Years •{" "}
            {siteStats.satisfaction} Satisfaction
          </div>

          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
                  alt="PG Closets Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1B4A9C]">PG CLOSETS</h1>
                <p className="text-xs text-[#9BC4E2] font-medium">Premium Solutions</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/products" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                Products
              </Link>
              <Link href="/about" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link href="/services" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                Services
              </Link>
              <Link
                href="/contact"
                className="text-[#9BC4E2] hover:text-[#1B4A9C] px-3 py-2 text-sm font-medium font-semibold"
              >
                Contact
              </Link>

              <div className="flex items-center space-x-4 ml-6">
                <a href="tel:6134225800" className="text-[#9BC4E2] font-semibold hover:text-[#1B4A9C]">
                  (613) 422-5800
                </a>
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
              <Link
                href="/contact"
                className="block px-4 py-2 text-[#9BC4E2] hover:text-[#1B4A9C] font-medium font-semibold"
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="pt-32 pb-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-[#1B4A9C]">
              Home
            </Link>{" "}
            / <span className="text-[#1B4A9C] font-medium">Contact</span>
          </nav>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B4A9C] mb-4">Request Work</h1>
        <p className="mt-2 text-slate-600 mb-8">
          Use the form below to tell us about your project. Prefer email?{" "}
          <a className="underline text-[#1B4A9C] hover:text-[#9BC4E2]" href="mailto:info@pgclosets.com">
            info@pgclosets.com
          </a>
        </p>

        <div className="mt-8 border border-slate-200 bg-white p-6 shadow-sm">
          <div id="83a3d24e-c18d-441c-80d1-d85419ea28ae">
            {!scriptLoaded && !scriptError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Loading contact form...</div>
              </div>
            )}
            {scriptError && (
              <div className="py-8">
                <h3 className="text-xl font-semibold text-[#1B4A9C] mb-6">Contact Form</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Details *</label>
                    <textarea
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
                      placeholder="Tell us about your closet door project..."
                    ></textarea>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="bg-[#1B4A9C] text-white px-8 py-3 font-semibold hover:bg-[#153A7E] transition-all"
                    >
                      Send Message
                    </button>
                    <a
                      href="mailto:info@pgclosets.com?subject=Closet Door Project"
                      className="border-2 border-[#1B4A9C] text-[#1B4A9C] px-8 py-3 font-semibold hover:bg-[#1B4A9C] hover:text-white transition-all text-center"
                    >
                      Email Directly
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#1B4A9C] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
                    alt="PG Closets Logo"
                    fill
                    className="object-contain"
                  />
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
                {/* Added business hours section */}
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
            {/* Updated copyright to 2025 */}
            <p>&copy; 2025 PG Closets. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Script
        src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        data-clienthub-id="83a3d24e-c18d-441c-80d1-d85419ea28ae"
      />
    </div>
  )
}
