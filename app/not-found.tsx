import Link from 'next/link'

// Force dynamic rendering to prevent static generation issues with OnceUI
export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-white shadow-lg">
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
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-6 text-[var(--color-secondary)]">404</div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. Let&apos;s get you back to exploring our premium closet
            doors.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-[var(--color-primary)] text-white px-8 py-3 font-semibold hover:bg-[var(--color-primary)] transition-all uppercase tracking-wide"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white px-8 py-3 font-semibold transition-all uppercase tracking-wide"
          >
            View Products
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Need help finding what you&apos;re looking for?</p>
          <a href="mailto:spencer@peoplesgrp.com" className="text-[var(--color-secondary)] font-semibold hover:text-[var(--color-primary)] text-lg">
            Email us: spencer@peoplesgrp.com
          </a>
        </div>
      </main>

      <footer className="bg-[var(--color-primary)] text-white py-16 mt-20">
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
                <div>Ottawa & Surrounding Areas</div>
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
