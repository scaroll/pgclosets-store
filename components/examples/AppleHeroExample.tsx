"use client"

import { AppleHero } from "@/components/home/AppleHero"
import { AppleShowcase } from "@/components/product/AppleShowcase"
import { FeatureHighlight } from "@/components/features/FeatureHighlight"
import { VideoHero } from "@/components/media/VideoHero"

/**
 * Example: Complete Apple-Style Homepage
 *
 * This demonstrates how to use all the cinematic components together
 * to create a stunning Apple-quality experience.
 */

export function AppleHeroExample() {
  return (
    <main>
      {/* Hero Section - Fullscreen with Parallax */}
      <AppleHero
        videoUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4"
        posterImage="/images/hero-poster.jpg"
        headline="Transform Your Space"
        subheadline="Premium closet solutions that inspire"
        ctaText="Explore products"
        ctaLink="#showcase"
        secondaryCtaText="Get a quote"
        secondaryCtaLink="/quote"
      />

      {/* Product Showcase - Horizontal Scroll */}
      <AppleShowcase
        title="Our Collections"
        subtitle="Premium doors engineered for modern living"
        products={[
          {
            id: "1",
            name: "Barn Door Collection",
            price: "$899",
            image: "/images/products/barn-door.jpg",
            slug: "barn-door-collection",
            tagline: "Rustic elegance",
            newProduct: true,
          },
          {
            id: "2",
            name: "Sliding Doors",
            price: "$1,299",
            image: "/images/products/sliding-door.jpg",
            slug: "sliding-doors",
            tagline: "Space-saving design",
          },
          {
            id: "3",
            name: "Bifold Doors",
            price: "$799",
            image: "/images/products/bifold-door.jpg",
            slug: "bifold-doors",
            tagline: "Classic style",
          },
        ]}
      />

      {/* Feature Highlights - Alternating Layouts */}
      <FeatureHighlight
        features={[
          {
            id: "1",
            headline: "Expertly Crafted",
            description:
              "Each door is precision-engineered with premium materials to ensure lasting beauty and performance.",
            image: "/images/features/craftsmanship.jpg",
            ctaText: "Learn about our process",
            ctaLink: "/about/craftsmanship",
            secondaryCtaText: "View materials",
            secondaryCtaLink: "/materials",
          },
          {
            id: "2",
            headline: "Professional Installation",
            description:
              "Our certified installers ensure perfect fit and finish, backed by our lifetime warranty.",
            image: "/images/features/installation.jpg",
            ctaText: "Book installation",
            ctaLink: "/book-measure",
            secondaryCtaText: "See our work",
            secondaryCtaLink: "/gallery",
          },
          {
            id: "3",
            headline: "Endless Customization",
            description:
              "Choose from hundreds of finishes, hardware options, and configurations to match your unique style.",
            image: "/images/features/customization.jpg",
            ctaText: "Explore options",
            ctaLink: "/customizer",
          },
        ]}
      />

      {/* Video Hero - Full Background */}
      <VideoHero
        videoSources={{
          mp4: "https://example.com/showroom.mp4",
          webm: "https://example.com/showroom.webm",
        }}
        posterImage="/images/showroom-poster.jpg"
        alt="Our Ottawa showroom"
        overlay
        overlayOpacity={0.4}
        className="h-screen"
      >
        <div className="text-center text-white">
          <h2 className="mb-4 text-5xl font-bold md:text-7xl">
            Visit Our Showroom
          </h2>
          <p className="mb-8 text-2xl font-light">
            See and touch our products in person
          </p>
          <a
            href="/showroom"
            className="inline-flex items-center gap-2 text-xl font-semibold text-[#0071e3] transition-colors hover:text-[#0077ed]"
          >
            Get directions →
          </a>
        </div>
      </VideoHero>
    </main>
  )
}

/**
 * Example: Product Detail Page with Apple Layout
 */

export function AppleProductExample() {
  return (
    <div>
      {/* This would be imported and used in app/products/[slug]/page.tsx */}
      {/* See: app/products/[slug]/AppleLayout.tsx for the full implementation */}
    </div>
  )
}
