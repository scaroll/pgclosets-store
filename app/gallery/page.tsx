import { MediaGallery } from "../../components/MediaGallery"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1B4A9C] to-[#4A5F8A] text-white text-center py-2 text-sm font-semibold">
            ⭐ 5.0 • 🏠 500+ Installations • ⏰ 15+ Years • 98% Satisfaction
          </div>

          <div className="flex justify-between items-center h-20">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#1B4A9C] flex items-center justify-center text-white font-bold text-lg">
                PG
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1B4A9C]">PG CLOSETS</h1>
                <p className="text-xs text-[#9BC4E2] font-medium">Premium Solutions</p>
              </div>
            </a>

            <nav className="hidden lg:flex items-center space-x-6">
              <a href="/" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="/products" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                Products
              </a>
              <a href="/about" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                About
              </a>
              <a href="/services" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                Services
              </a>
              <a href="/contact" className="text-[#1B4A9C] hover:text-[#9BC4E2] px-3 py-2 text-sm font-medium">
                Contact
              </a>

              <div className="flex items-center space-x-4 ml-6">
                <a href="tel:6134225800" className="text-[#9BC4E2] font-semibold hover:text-[#1B4A9C]">
                  (613) 422-5800
                </a>
                <a
                  href="/contact"
                  className="bg-[#9BC4E2] text-[#1B4A9C] px-6 py-2 font-semibold hover:bg-[#1B4A9C] hover:text-white transition-all"
                >
                  Get Quote
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-[#1B4A9C]">Project Gallery</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how we've transformed Ottawa homes with premium closet doors. Over 500 successful installations
              showcasing our craftsmanship and attention to detail.
            </p>
          </div>

          <div className="bg-gray-50 p-8 mb-12 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-[#1B4A9C] mb-2">500+</div>
                <div className="text-sm text-gray-600">Completed Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B4A9C] mb-2">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B4A9C] mb-2">5.0★</div>
                <div className="text-sm text-gray-600">Google Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B4A9C] mb-2">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          <MediaGallery />

          <div className="text-center mt-12 bg-[#1B4A9C] text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-lg mb-6 text-[#9BC4E2]">
              Join 500+ satisfied Ottawa homeowners who chose PG Closets for their premium door solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-[#9BC4E2] text-[#1B4A9C] px-8 py-3 font-semibold hover:bg-white transition-all uppercase tracking-wide"
              >
                Get Free Quote
              </a>
              <a
                href="tel:6134225800"
                className="border-2 border-[#9BC4E2] text-[#9BC4E2] hover:bg-[#9BC4E2] hover:text-[#1B4A9C] px-8 py-3 font-semibold transition-all uppercase tracking-wide"
              >
                Call (613) 422-5800
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#1B4A9C] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <a href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#9BC4E2] flex items-center justify-center text-[#1B4A9C] font-bold text-lg">
                  PG
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PG CLOSETS</h3>
                  <p className="text-[#9BC4E2]">Premium Solutions</p>
                </div>
              </a>
              <p className="text-gray-300 mb-6">
                Ottawa's premier closet door specialists, transforming homes with premium solutions.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#9BC4E2]">Sitemap</h4>
              <div className="space-y-2">
                <a href="/" className="block text-gray-300 hover:text-white">
                  Home
                </a>
                <a href="/products" className="block text-gray-300 hover:text-white">
                  Products
                </a>
                <a href="/about" className="block text-gray-300 hover:text-white">
                  About
                </a>
                <a href="/services" className="block text-gray-300 hover:text-white">
                  Services
                </a>
                <a href="/contact" className="block text-gray-300 hover:text-white">
                  Contact
                </a>
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
