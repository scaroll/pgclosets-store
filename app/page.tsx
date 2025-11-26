import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { VideoHero } from '@/components/home/hero'
import { ProductCard } from '@/components/products/product-card'
import { SectionHeader } from '@/components/shared/section-header'
import { FeatureCard } from '@/components/shared/feature-card'
import { TestimonialCard } from '@/components/shared/testimonial-card'
import { CTASection } from '@/components/shared/cta-section'

export const metadata: Metadata = {
  title: 'Home - PG Closets',
  description: 'Transform your space with premium closet solutions. Expert installation, lifetime warranty, and free consultation in Ottawa.',
}

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero Section */}
      <VideoHero
        videoSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4"
        posterSrc="/optimized-images/elegant-barn-door-closet.webp"
        headline="Transform Your Space"
        subheadline="Premium closet solutions for modern living"
        ctaText="Shop Now"
        ctaHref="/products"
        secondaryCtaText="Book Consultation"
        secondaryCtaHref="/book-measure"
      />

      {/* 2. Featured Products Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Featured"
            title="Bestselling Products"
            description="Our most popular closet door solutions"
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProductCard
              product={{
                id: "renin-bd102-white",
                name: "Renin BD102 White Barn Door",
                slug: "renin-bd102-white",
                price: 49999,
                shortDesc: "Contemporary white barn door with sleek modern design",
                images: ["/optimized-images/elegant-barn-door-closet.webp"],
                inStock: true,
                category: {
                  name: "Barn Doors",
                  slug: "barn-doors"
                }
              }}
            />
            <ProductCard
              product={{
                id: "renin-bd305-black",
                name: "Renin BD305 Black Frame Glass",
                slug: "renin-bd305-black",
                price: 64999,
                shortDesc: "Modern black frame glass barn door with premium hardware",
                images: ["/optimized-images/elegant-barn-door-closet.webp"],
                inStock: true,
                category: {
                  name: "Glass Doors",
                  slug: "glass-doors"
                }
              }}
            />
            <ProductCard
              product={{
                id: "renin-bf201-white",
                name: "Renin BF201 White Bifold",
                slug: "renin-bf201-white",
                price: 39999,
                shortDesc: "Classic white bifold door for compact spaces",
                images: ["/optimized-images/elegant-barn-door-closet.webp"],
                inStock: true,
                category: {
                  name: "Bifold Doors",
                  slug: "bifold-doors"
                }
              }}
            />
            <ProductCard
              product={{
                id: "premium-hardware-set",
                name: "Premium Hardware Set",
                slug: "premium-hardware-set",
                price: 29999,
                shortDesc: "Complete barn door hardware kit with soft-close mechanism",
                images: ["/optimized-images/elegant-barn-door-closet.webp"],
                inStock: true,
                category: {
                  name: "Hardware",
                  slug: "hardware"
                }
              }}
            />
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline apple-transition"
            >
              View All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Value Propositions Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Why Choose PG Closets"
            description="Your trusted partner for premium closet solutions in Ottawa"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Expert Installation"
              description="Professional installation by certified experts. We ensure perfect fit and finish every time."
            />
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Lifetime Warranty"
              description="All our products come with a comprehensive lifetime warranty for your peace of mind."
            />
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
              title="Free Consultation"
              description="Get personalized advice from our design experts. Schedule your free consultation today."
            />
          </div>
        </div>
      </section>

      {/* 4. Product Categories Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Explore Our Collections"
            description="Discover the perfect closet solution for your space"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Barn Doors */}
            <Link href="/collections/barn-doors" className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/optimized-images/elegant-barn-door-closet.webp"
                alt="Barn Doors Collection"
                fill
                className="object-cover apple-transition group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Barn Doors</h3>
                  <p className="text-white/90 mb-4">Modern sliding solutions</p>
                  <span className="inline-flex items-center gap-2 font-semibold opacity-0 group-hover:opacity-100 apple-transition">
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Bifold Doors */}
            <Link href="/collections/bifold" className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/optimized-images/elegant-barn-door-closet.webp"
                alt="Bifold Doors Collection"
                fill
                className="object-cover apple-transition group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Bifold Doors</h3>
                  <p className="text-white/90 mb-4">Space-saving designs</p>
                  <span className="inline-flex items-center gap-2 font-semibold opacity-0 group-hover:opacity-100 apple-transition">
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Glass Doors */}
            <Link href="/collections/glass" className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/optimized-images/elegant-barn-door-closet.webp"
                alt="Glass Doors Collection"
                fill
                className="object-cover apple-transition group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Glass Doors</h3>
                  <p className="text-white/90 mb-4">Elegant transparency</p>
                  <span className="inline-flex items-center gap-2 font-semibold opacity-0 group-hover:opacity-100 apple-transition">
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Hardware */}
            <Link href="/collections/hardware" className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/optimized-images/elegant-barn-door-closet.webp"
                alt="Hardware Collection"
                fill
                className="object-cover apple-transition group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Hardware</h3>
                  <p className="text-white/90 mb-4">Premium accessories</p>
                  <span className="inline-flex items-center gap-2 font-semibold opacity-0 group-hover:opacity-100 apple-transition">
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. About Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/optimized-images/elegant-barn-door-closet.webp"
                alt="PG Closets Showroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                  About Us
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Crafting Excellence Since Day One
                </h2>
              </div>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  At PG Closets, we believe your space should reflect your lifestyle. For years, we've been transforming homes across Ottawa with premium closet solutions that combine functionality with stunning design.
                </p>
                <p>
                  Our commitment to quality craftsmanship and customer satisfaction has made us the trusted choice for homeowners who demand the best. Every project is a partnership, and we're dedicated to bringing your vision to life.
                </p>
                <p>
                  From initial consultation to final installation, our team of experts ensures a seamless experience and results that exceed expectations.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 apple-transition text-lg"
                >
                  Learn More About Us
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="What Our Customers Say"
            description="Join hundreds of satisfied homeowners across Ottawa"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              location="Kanata, Ottawa"
              rating={5}
              quote="The team at PG Closets transformed our master bedroom closet beyond our expectations. The barn door installation was flawless and the quality is outstanding!"
              date="Nov 2024"
            />
            <TestimonialCard
              name="Michael Chen"
              location="Barrhaven, Ottawa"
              rating={5}
              quote="From consultation to installation, the entire process was professional and smooth. Our new bifold closet doors are beautiful and functional. Highly recommend!"
              date="Oct 2024"
            />
            <TestimonialCard
              name="Emily Robertson"
              location="Westboro, Ottawa"
              rating={5}
              quote="Exceptional service and craftsmanship. The glass barn doors added such an elegant touch to our home. Worth every penny and the lifetime warranty gives us peace of mind."
              date="Sep 2024"
            />
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <CTASection
        title="Ready to Transform Your Space?"
        description="Schedule your free consultation and get a custom quote today"
        ctaText="Get a Free Estimate"
        ctaHref="/book-measure"
        secondaryCtaText="Call Us Now"
        secondaryCtaHref="tel:+16135551234"
        backgroundImage="/optimized-images/elegant-barn-door-closet.webp"
      />

      {/* 8. Blog Preview Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Blog"
            title="Latest Design Inspiration"
            description="Tips, trends, and ideas for your home transformation"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <Link href="/blog/barn-door-trends-2024" className="group">
              <div className="bg-card rounded-2xl overflow-hidden apple-transition hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/optimized-images/elegant-barn-door-closet.webp"
                    alt="Barn Door Trends 2024"
                    fill
                    className="object-cover apple-transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-sm text-primary font-semibold">Design Trends</p>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-primary apple-transition">
                    Top Barn Door Trends for 2024
                  </h3>
                  <p className="text-muted-foreground">
                    Discover the latest styles and finishes that are transforming modern homes this year.
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Blog Post 2 */}
            <Link href="/blog/choosing-perfect-closet-door" className="group">
              <div className="bg-card rounded-2xl overflow-hidden apple-transition hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/optimized-images/elegant-barn-door-closet.webp"
                    alt="Choosing Perfect Closet Door"
                    fill
                    className="object-cover apple-transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-sm text-primary font-semibold">Buying Guide</p>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-primary apple-transition">
                    How to Choose the Perfect Closet Door
                  </h3>
                  <p className="text-muted-foreground">
                    A comprehensive guide to selecting the ideal closet door for your space and style.
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Blog Post 3 */}
            <Link href="/blog/maximize-small-closet-space" className="group">
              <div className="bg-card rounded-2xl overflow-hidden apple-transition hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/optimized-images/elegant-barn-door-closet.webp"
                    alt="Maximize Small Closet Space"
                    fill
                    className="object-cover apple-transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-sm text-primary font-semibold">Organization Tips</p>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-primary apple-transition">
                    Maximize Your Small Closet Space
                  </h3>
                  <p className="text-muted-foreground">
                    Expert tips and tricks for making the most of compact closet areas.
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline apple-transition"
            >
              View All Blog Posts
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
