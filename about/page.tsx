import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About PG Closets | Official Renin Dealer Ottawa",
  description:
    "Learn about PG Closets, Ottawa&apos;s trusted Renin dealer specializing in premium door systems and professional installation. Family-owned business serving Ottawa since 2010.",
  keywords:
    "about PG Closets, Renin dealer Ottawa, family business Ottawa, door installation company, Ottawa closet company history",
  openGraph: {
    title: "About PG Closets | Official Renin Dealer Ottawa",
    description:
      "Learn about PG Closets, Ottawa&apos;s trusted Renin dealer specializing in premium door systems and professional installation.",
    images: [{ url: "/og-about.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full z-50 bg-white/98 backdrop-blur-md border-b-2 border-[#1e3a8a] shadow-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#87ceeb] text-white text-center py-3 text-sm font-bold tracking-wide">
            ⭐ 5.0 • 🏠 500+ Installations • ⏰ 15+ Years • 98% Satisfaction
          </div>

          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 overflow-hidden border-2 border-[#87ceeb] shadow-lg">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
                    alt="PG Closets Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#1e3a8a] tracking-tight">PG CLOSETS</h1>
                  <p className="text-xs text-[#87ceeb] font-bold tracking-wider">PREMIUM SOLUTIONS</p>
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Gallery", href: "/gallery" },
                { name: "Process", href: "/process" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-300 group ${
                    item.name === "About"
                      ? "text-[#1e3a8a] border-b-2 border-[#87ceeb]"
                      : "text-gray-800 hover:text-[#1e3a8a]"
                  }`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#87ceeb] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              <div className="flex items-center space-x-4">
                <Link href="/book-consultation">
                  <button className="bg-[#87ceeb] text-white px-8 py-3 font-black uppercase tracking-wide hover:bg-[#1e3a8a] hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-[#87ceeb] hover:border-[#1e3a8a]">
                    BOOK CONSULTATION
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-24 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#1e3a8a] text-[#87ceeb] px-6 py-2 text-sm font-black uppercase tracking-wider mb-6">
                OUR STORY
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-[#1e3a8a] mb-8 tracking-tight leading-tight">
                Family-Owned Excellence Since 2010
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Ottawa-operated and family-owned, PG Closets has been transforming homes across the region with premium
                Renin door systems and exceptional service for over a decade.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <button className="bg-[#87ceeb] text-white px-8 py-4 font-black uppercase tracking-wide hover:bg-[#1e3a8a] hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-[#87ceeb] hover:border-[#1e3a8a]">
                    GET FREE CONSULTATION
                  </button>
                </Link>
                <Link href="/products">
                  <button className="border-2 border-[#1e3a8a] text-[#1e3a8a] px-8 py-4 font-black uppercase tracking-wide hover:bg-[#1e3a8a] hover:text-[#87ceeb] transition-all duration-300">
                    BROWSE PRODUCTS
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden shadow-2xl border-4 border-[#87ceeb]">
                <Image
                  src="/images/arcat/renin_199065_hd.jpg"
                  alt="Premium Renin closet doors installed in Ottawa home"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-8 shadow-2xl border-2 border-[#87ceeb]">
                <div className="text-center">
                  <div className="text-3xl font-black text-[#1e3a8a] mb-2">500+</div>
                  <div className="text-sm font-bold text-[#87ceeb] uppercase tracking-wide">INSTALLATIONS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-[#1e3a8a] mb-8 tracking-tight">The PG Closets Journey</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  What started as a small family business has grown into Ottawa&apos;s most trusted name in premium door
                  systems. As an official Renin dealer, we combine the quality and innovation of Canada's leading door
                  manufacturer with the personal touch and local expertise that only a family business can provide.
                </p>
                <p>
                  Our commitment to excellence has earned us the trust of over 500 Ottawa families, and we're proud to
                  maintain a 98% customer satisfaction rating. Every project, from a simple barn door to a complete
                  closet system, receives the same attention to detail and dedication to quality that has defined our
                  business from day one.
                </p>
                <p>
                  Today, we continue to grow while staying true to our founding principles: transparent pricing, quality
                  products, professional installation, and exceptional customer service. When you choose PG Closets,
                  you're not just getting a door system – you're joining a family of satisfied customers who trust us
                  with their homes.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="aspect-square overflow-hidden shadow-xl border-2 border-[#87ceeb]">
                  <Image
                    src="/images/arcat/renin_199063_hd.jpg"
                    alt="Georgian 6-Panel Design closet doors"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden shadow-xl border-2 border-[#87ceeb]">
                  <Image
                    src="/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite_v2.jpg"
                    alt="Euro 1-Lite bifold closet doors"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="aspect-square overflow-hidden shadow-xl border-2 border-[#87ceeb]">
                  <Image
                    src="/images/arcat/renin_205721_hd.jpg"
                    alt="Crochet Multi-X Design barn door"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden shadow-xl border-2 border-[#87ceeb]">
                  <Image
                    src="/images/arcat/renin_176733_Continental_Pavilion_5_Lite.jpg"
                    alt="Euro 5-Lite bypass closet doors"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block bg-[#1e3a8a] text-[#87ceeb] px-6 py-2 text-sm font-black uppercase tracking-wider mb-6">
              OUR VALUES
            </span>
            <h2 className="text-5xl font-black text-[#1e3a8a] mb-8 tracking-tight">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our mission is simple: to provide Ottawa homeowners with premium door solutions that enhance both function
              and beauty in their homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 text-center shadow-2xl border-t-4 border-[#87ceeb] hover:shadow-3xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-[#87ceeb]/10 flex items-center justify-center mx-auto mb-8 border-2 border-[#87ceeb]">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-black text-[#1e3a8a] mb-6 uppercase tracking-wide">Quality First</h3>
              <p className="text-gray-600 leading-relaxed">
                We partner exclusively with Renin, Canada's premier door manufacturer, to ensure every product meets the
                highest standards of excellence and durability.
              </p>
            </div>

            <div className="bg-white p-10 text-center shadow-2xl border-t-4 border-[#87ceeb] hover:shadow-3xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-[#87ceeb]/10 flex items-center justify-center mx-auto mb-8 border-2 border-[#87ceeb]">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-black text-[#1e3a8a] mb-6 uppercase tracking-wide">Personal Service</h3>
              <p className="text-gray-600 leading-relaxed">
                As a family business, we treat every customer like family, providing personalized attention and care
                throughout your entire project journey.
              </p>
            </div>

            <div className="bg-white p-10 text-center shadow-2xl border-t-4 border-[#87ceeb] hover:shadow-3xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-[#87ceeb]/10 flex items-center justify-center mx-auto mb-8 border-2 border-[#87ceeb]">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-black text-[#1e3a8a] mb-6 uppercase tracking-wide">Local Focus</h3>
              <p className="text-gray-600 leading-relaxed">
                We&apos;re proud to call Ottawa home and are committed to serving our community with integrity, excellence,
                and unwavering dedication.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#1e3a8a] to-[#87ceeb] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black mb-8 tracking-tight">Ready to Work Together?</h2>
          <p className="text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            Experience the PG Closets difference for yourself. Let's create something beautiful and functional for your
            home.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact">
              <button className="bg-white text-[#1e3a8a] px-12 py-5 font-black text-xl uppercase tracking-wide hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                START YOUR PROJECT
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-4 border-white text-white px-12 py-5 font-black text-xl uppercase tracking-wide hover:bg-white hover:text-[#1e3a8a] hover:scale-105 transition-all duration-300">
                GET IN TOUCH
              </button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#1e3a8a] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative w-16 h-16 overflow-hidden border-2 border-[#87ceeb]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
                    alt="PG Closets Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight">PG CLOSETS</h3>
                  <p className="text-[#87ceeb] font-bold">PREMIUM SOLUTIONS</p>
                </div>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed max-w-lg text-lg">
                Ottawa&apos;s premier closet door specialists, transforming homes with premium Renin solutions and
                award-winning professional installation services since 2010.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8 text-[#87ceeb] uppercase tracking-wide">Navigation</h4>
              <div className="space-y-4">
                {[
                  { name: "Home", href: "/" },
                  { name: "Products", href: "/products" },
                  { name: "Gallery", href: "/gallery" },
                  { name: "Process", href: "/process" },
                  { name: "About", href: "/about" },
                  { name: "Contact", href: "/contact" },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 font-semibold"
                  >
                    → {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8 text-[#87ceeb] uppercase tracking-wide">Contact</h4>
              <div className="space-y-6 text-gray-300">
                <div className="flex items-center space-x-4">
                  <span className="text-[#87ceeb] text-xl">📧</span>
                  <div>
                    <div className="font-bold text-white">Email</div>
                    <div>info@pgclosets.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[#87ceeb] text-xl">📅</span>
                  <div>
                    <div className="font-bold text-white">Consultations</div>
                    <Link href="/book-consultation" className="text-[#87ceeb] hover:text-white transition-colors">
                      Book Online →
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[#87ceeb] text-xl">📍</span>
                  <div>
                    <div className="font-bold text-white">Service Area</div>
                    <div>Ottawa & Surrounding Areas</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[#87ceeb] text-xl">🕒</span>
                  <div>
                    <div className="font-bold text-white">Business Hours</div>
                    <div className="text-sm">
                      <div>Mon-Fri: 8:00 AM - 6:00 PM</div>
                      <div>Sat: 9:00 AM - 4:00 PM</div>
                      <div>Sun: By Appointment</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-[#87ceeb]/30 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2025 PG Closets. All rights reserved. | Licensed & Insured | A+ BBB Rating
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
