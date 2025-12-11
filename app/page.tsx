import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { VideoHero } from '@/components/home/hero'
import { ProductCard } from '@/components/products/product-card'
import { SectionHeader } from '@/components/shared/section-header'
import { FeatureCard } from '@/components/shared/feature-card'
import { TestimonialCard } from '@/components/shared/testimonial-card'
import { CTASection } from '@/components/shared/cta-section'
import { BentoGrid, BentoGridItem } from '@/components/shared/bento-grid'

export const metadata: Metadata = {
  title: 'PG Closets | Premium Closet Doors Ottawa | Official Renin Dealer',
  description:
    "Ottawa's premier closet door specialists. Official Renin dealer offering barn doors, bypass doors, bifold doors & professional installation. Free consultations.",
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
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Featured"
            title="Bestselling Products"
            description="Our most popular closet door solutions"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <ProductCard
              product={{
                id: 'renin-bd102-white',
                name: 'Renin BD102 White Barn Door',
                slug: 'renin-bd102-white',
                price: 49999,
                shortDesc: 'Contemporary white barn door with sleek modern design',
                images: ['/optimized-images/elegant-barn-door-closet.webp'],
                inStock: true,
                category: {
                  name: 'Barn Doors',
                  slug: 'barn-doors',
                },
              }}
            />
            <ProductCard
              product={{
                id: 'renin-bd305-black',
                name: 'Renin BD305 Black Frame Glass',
                slug: 'renin-bd305-black',
                price: 64999,
                shortDesc: 'Modern black frame glass barn door with premium hardware',
                images: ['/optimized-images/elegant-barn-door-closet.webp'],
                inStock: true,
                category: {
                  name: 'Glass Doors',
                  slug: 'glass-doors',
                },
              }}
            />
            <ProductCard
              product={{
                id: 'renin-bf201-white',
                name: 'Renin BF201 White Bifold',
                slug: 'renin-bf201-white',
                price: 39999,
                shortDesc: 'Classic white bifold door for compact spaces',
                images: ['/optimized-images/elegant-barn-door-closet.webp'],
                inStock: true,
                category: {
                  name: 'Bifold Doors',
                  slug: 'bifold-doors',
                },
              }}
            />
            <ProductCard
              product={{
                id: 'premium-hardware-set',
                name: 'Premium Hardware Set',
                slug: 'premium-hardware-set',
                price: 29999,
                shortDesc: 'Complete barn door hardware kit with soft-close mechanism',
                images: ['/optimized-images/elegant-barn-door-closet.webp'],
                inStock: true,
                category: {
                  name: 'Hardware',
                  slug: 'hardware',
                },
              }}
            />
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="apple-transition inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
            >
              View All Products
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Value Propositions Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Why Choose PG Closets"
            description="Your trusted partner for premium closet solutions in Ottawa"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              title="Expert Installation"
              description="Professional installation by certified experts. We ensure perfect fit and finish every time."
            />
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              title="Official Renin Dealer"
              description="Authorized dealer with access to the complete Renin product catalog and expert product knowledge."
            />
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              }
              title="Free Consultation"
              description="Get personalized advice from our design experts. Schedule your free consultation today."
            />
          </div>
        </div>
      </section>

      {/* 4. Product Categories Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Explore Our Collections"
            description="Discover the perfect closet solution for your space"
            className="mb-12"
          />
          <BentoGrid className="mx-auto max-w-6xl">
            <BentoGridItem
              title="Barn Doors"
              description="Modern sliding solutions that make a statement."
              href="/collections/barn-doors"
              image="/optimized-images/elegant-barn-door-closet.webp"
              className="min-h-[400px] md:col-span-2 md:row-span-2"
            />
            <BentoGridItem
              title="Bifold Doors"
              description="Space-saving designs for compact areas."
              href="/collections/bifold"
              image="/optimized-images/elegant-barn-door-closet.webp"
              className="min-h-[200px] md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Glass Doors"
              description="Elegant transparency for a modern look."
              href="/collections/glass"
              image="/optimized-images/elegant-barn-door-closet.webp"
              className="min-h-[200px] md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Hardware"
              description="Premium accessories to finish the look."
              href="/collections/hardware"
              image="/optimized-images/elegant-barn-door-closet.webp"
              className="min-h-[200px] md:col-span-3 md:row-span-1"
            />
          </BentoGrid>
        </div>
      </section>

      {/* 5. About Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
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
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                  About Us
                </p>
                <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                  Crafting Excellence Since Day One
                </h2>
              </div>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  At PG Closets, we believe your space should reflect your lifestyle. For years,
                  we&apos;ve been transforming homes across Ottawa with premium closet solutions
                  that combine functionality with stunning design.
                </p>
                <p>
                  Our commitment to quality craftsmanship and customer satisfaction has made us the
                  trusted choice for homeowners who demand the best. Every project is a partnership,
                  and we&apos;re dedicated to bringing your vision to life.
                </p>
                <p>
                  From initial consultation to final installation, our team of experts ensures a
                  seamless experience and results that exceed expectations.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="apple-transition inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:opacity-90"
                >
                  Learn More About Us
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="What Our Customers Say"
            description="Join hundreds of satisfied homeowners across Ottawa"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
              quote="Exceptional service and craftsmanship. The glass barn doors added such an elegant touch to our home. Worth every penny and the quality is outstanding."
              date="Sep 2024"
            />
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <CTASection
        title="Ready to Transform Your Space?"
        description="Schedule your free consultation and get a custom quote today"
        ctaText="Book Free Consultation"
        ctaHref="/book-consultation"
        secondaryCtaText="View Products"
        secondaryCtaHref="/products"
        backgroundImage="/optimized-images/elegant-barn-door-closet.webp"
      />

      {/* 8. Blog Preview Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Blog"
            title="Latest Design Inspiration"
            description="Tips, trends, and ideas for your home transformation"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Blog Post 1 */}
            <Link href="/blog/barn-door-trends-2024" className="group">
              <div className="apple-transition overflow-hidden rounded-2xl bg-card hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/optimized-images/elegant-barn-door-closet.webp"
                    alt="Barn Door Trends 2024"
                    fill
                    className="apple-transition object-cover group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-sm font-semibold text-primary">Design Trends</p>
                  <h3 className="apple-transition text-xl font-bold tracking-tight group-hover:text-primary">
                    Top Barn Door Trends for 2024
                  </h3>
                  <p className="text-muted-foreground">
                    Discover the latest styles and finishes that are transforming modern homes this
                    year.
                  </p>
                  <span className="inline-flex items-center gap-2 font-semibold text-primary">
                    Read More
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Blog Post 2 */}
            <Link href="/blog/choosing-perfect-closet-door" className="group">
              <div className="apple-transition overflow-hidden rounded-2xl bg-card hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/optimized-images/elegant-barn-door-closet.webp"
                    alt="Choosing Perfect Closet Door"
                    fill
                    className="apple-transition object-cover group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-sm font-semibold text-primary">Buying Guide</p>
                  <h3 className="apple-transition text-xl font-bold tracking-tight group-hover:text-primary">
                    How to Choose the Perfect Closet Door
                  </h3>
                  <p className="text-muted-foreground">
                    A comprehensive guide to selecting the ideal closet door for your space and
                    style.
                  </p>
                  <span className="inline-flex items-center gap-2 font-semibold text-primary">
                    Read More
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Blog Post 3 */}
            <Link href="/blog/maximize-small-closet-space" className="group">
              <div className="apple-transition overflow-hidden rounded-2xl bg-card hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/optimized-images/elegant-barn-door-closet.webp"
                    alt="Maximize Small Closet Space"
                    fill
                    className="apple-transition object-cover group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-sm font-semibold text-primary">Organization Tips</p>
                  <h3 className="apple-transition text-xl font-bold tracking-tight group-hover:text-primary">
                    Maximize Your Small Closet Space
                  </h3>
                  <p className="text-muted-foreground">
                    Expert tips and tricks for making the most of compact closet areas.
                  </p>
                  <span className="inline-flex items-center gap-2 font-semibold text-primary">
                    Read More
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="apple-transition inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
            >
              View All Blog Posts
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
