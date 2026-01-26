import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

// Enable ISR with 24 hour revalidation for homepage
export const revalidate = 86400

export const metadata: Metadata = {
  title: "PG Closets | Custom Closets & Storage Solutions in Ottawa",
  description:
    "Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts. Request your free quote today.",
  keywords:
    "custom closets Ottawa, closet design Ottawa, storage solutions Ottawa, pantry organization, garage storage, closet installation, home organization Ottawa, custom storage NCR",
  authors: [{ name: "PG Closets" }],
  creator: "PG Closets",
  publisher: "PG Closets",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Ottawa",
    "geo.position": "45.4215;-75.6972",
    ICBM: "45.4215, -75.6972",
  },
  openGraph: {
    title: "PG Closets | Custom Closets & Storage Solutions in Ottawa",
    description:
      "Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts.",
    url: "https://www.pgclosets.com",
    siteName: "PG Closets",
    locale: "en_CA",
    images: [
      {
        url: "https://www.pgclosets.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PG Closets - Custom Storage Solutions Ottawa",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@pgclosets",
    title: "PG Closets | Custom Closets & Storage Solutions in Ottawa",
    description:
      "Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts.",
    images: ["https://www.pgclosets.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.pgclosets.com",
  },
}

// Featured products data
const featuredProducts = [
  {
    name: "Continental",
    slug: "continental",
    image: "/images/arcat/renin_176732_hd.jpg",
    price: 459,
    category: "Bifold Doors",
    description: "Premium engineered wood core with durable laminate surface",
  },
  {
    name: "Provincial",
    slug: "provincial",
    image: "/images/arcat/renin_205750_hd.jpg",
    price: 549,
    category: "Panel Doors",
    description: "Traditional styling with heavy-duty pivot hinges",
  },
  {
    name: "Gatsby",
    slug: "gatsby",
    image: "/images/arcat/renin_205729_hd.jpg",
    price: 799,
    category: "Barn Doors",
    description: "Modern barn door design with premium hardware included",
  },
  {
    name: "Euro",
    slug: "euro",
    image: "/images/arcat/renin_199063_hd.jpg",
    price: 899,
    category: "Sliding Doors",
    description: "Contemporary European styling with soft-close mechanism",
  },
]

// Trust indicators
const trustIndicators = [
  { value: "500+", label: "Installations" },
  { value: "15+", label: "Years Experience" },
  { value: "5.0", label: "Google Rating" },
  { value: "100%", label: "Satisfaction" },
]

// Service areas
const serviceAreas = [
  "Ottawa",
  "Kanata",
  "Barrhaven",
  "Nepean",
  "Orleans",
  "Stittsville",
  "Manotick",
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section
        id="main-content"
        className="relative min-h-[90vh] flex items-center bg-background"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-closet.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-default section-xl">
          <div className="max-w-2xl">
            {/* Overline */}
            <p className="text-overline text-accent mb-4">
              Ottawa&apos;s Premier Closet Design Studio
            </p>

            {/* Headline */}
            <h1 className="text-display text-foreground mb-6">
              Closets.{" "}
              <span className="text-muted-foreground">Redefined.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-body-lg text-muted-foreground mb-8 max-w-xl">
              Transform your space with custom closet solutions designed for
              your lifestyle. From walk-in wardrobes to pantry systems, we
              craft storage that works beautifully.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" asChild>
                <Link href="/contact">Book Free Consultation</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/products">View Collection</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
              {trustIndicators.map((item) => (
                <div key={item.label}>
                  <p className="text-2xl font-semibold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="section bg-muted">
        <div className="container-default">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Lifetime Warranty",
                description: "Quality guaranteed on all installations",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: "5-Star Rated",
                description: "Trusted by 500+ Ottawa homeowners",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Local Experts",
                description: "Proudly serving the Ottawa region",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Authorized Dealer",
                description: "Official Renin closet doors partner",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="text-h4 mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-lg">
        <div className="container-default">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-overline text-accent mb-3">The Collection</p>
            <h2 className="text-h1 mb-4">Signature Door Designs</h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Premium closet doors crafted for Ottawa homes. Each design
              combines timeless aesthetics with modern functionality.
            </p>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group"
              >
                <article className="card card-interactive h-full">
                  {/* Image */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-caption text-muted-foreground mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-h4 mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-semibold">
                      From ${product.price}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        CAD
                      </span>
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* View all link */}
          <div className="text-center mt-10">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/products">
                View All Products
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-lg bg-primary text-primary-foreground">
        <div className="container-default">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <p className="text-overline text-primary-foreground/70 mb-4">
                Why Choose PG Closets
              </p>
              <h2 className="text-h1 mb-6">
                Craftsmanship Meets Innovation
              </h2>
              <p className="text-body-lg text-primary-foreground/80 mb-8">
                For over 15 years, we&apos;ve been transforming Ottawa homes
                with custom storage solutions that combine exceptional design
                with lasting quality.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Free in-home design consultation",
                  "Custom solutions for any space",
                  "Professional installation included",
                  "Local support and service",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>

              <Button variant="accent" size="lg" asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden">
              <Image
                src="/images/workshop.jpg"
                alt="PG Closets workshop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section">
        <div className="container-default">
          <div className="text-center mb-10">
            <p className="text-overline text-accent mb-3">Service Areas</p>
            <h2 className="text-h2 mb-4">Proudly Serving Ottawa & Region</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Free in-home consultations throughout the National Capital Region
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {serviceAreas.map((area) => (
              <Link
                key={area}
                href={`/${area.toLowerCase()}`}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-muted text-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg bg-accent">
        <div className="container-narrow text-center">
          <h2 className="text-h1 text-accent-foreground mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-body-lg text-accent-foreground/80 mb-8 max-w-xl mx-auto">
            Schedule your free consultation today. Our design experts will
            visit your home to discuss your vision and provide a custom quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="tel:6134225800">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                (613) 422-5800
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
