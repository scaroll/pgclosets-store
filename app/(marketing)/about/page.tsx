import type { Metadata } from 'next'
import Image from 'next/image'
import { SectionHeader } from '@/components/shared/section-header'
import { FeatureCard } from '@/components/shared/feature-card'
import { StatsSection } from '@/components/shared/stats-section'
import { CTASection } from '@/components/shared/cta-section'
import {
  Heart,
  Award,
  Users,
  Target,
  Sparkles,
  Shield,
  MapPin,
  Building2,
  Wrench,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Premium Closet Solutions in Ottawa | PG Closets',
  description: 'Discover PG Closets\' story, our commitment to excellence, and why we\'re Ottawa\'s trusted choice for premium custom closet solutions. Expert installation, lifetime warranty, and exceptional service.',
  keywords: 'PG Closets, Ottawa closets, custom closets Ottawa, about us, premium closet solutions, closet installation Ottawa',
  openGraph: {
    title: 'About Us - PG Closets Ottawa',
    description: 'Ottawa\'s premier destination for custom closet solutions. Expert installation, lifetime warranty, and exceptional service.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 1. Hero Section - Full-width image with overlay */}
      <section className="relative h-[60vh] md:h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src="/optimized-images/luxury-walk-in-closet.webp"
          alt="PG Closets - Premium Closet Solutions"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white">
          <p className="text-apple-13 font-semibold uppercase tracking-wider mb-4 text-white/90">
            About PG Closets
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
            Transforming Ottawa homes with premium closet solutions since day one
          </p>
        </div>
      </section>

      {/* 2. Company Story - Split layout with image and text */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden order-2 lg:order-1">
              <Image
                src="/optimized-images/elegant-barn-door-closet.webp"
                alt="PG Closets Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div>
                <p className="text-apple-13 font-semibold text-primary uppercase tracking-wider mb-4">
                  Our Journey
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Crafting Excellence, One Space at a Time
                </h2>
              </div>
              <div className="space-y-4 text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                <p>
                  At PG Closets, we believe that exceptional storage solutions are more than just functional—they're transformative. Our journey began with a simple mission: to bring premium, custom-designed closet solutions to homeowners throughout Ottawa.
                </p>
                <p>
                  What started as a passion for quality craftsmanship has grown into a trusted partnership with hundreds of Ottawa families. We've helped transform bedrooms, walk-in closets, pantries, and more into beautifully organized spaces that enhance daily life.
                </p>
                <p>
                  Every project we undertake reflects our unwavering commitment to excellence. From the initial consultation to the final installation, we approach each space with meticulous attention to detail and a dedication to exceeding expectations.
                </p>
                <p>
                  Today, we're proud to be Ottawa's premier destination for custom closet solutions, backed by expert installation, premium materials, and a lifetime warranty on all our products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Values - 3 value cards with icons */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Our Values"
            title="What Drives Us"
            description="The principles that guide everything we do"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Heart className="w-full h-full" />}
              title="Customer First"
              description="Your satisfaction is our priority. We listen to your needs, understand your vision, and deliver solutions that exceed expectations every time."
            />
            <FeatureCard
              icon={<Award className="w-full h-full" />}
              title="Quality Craftsmanship"
              description="We partner with premium manufacturers and employ expert installers to ensure every project meets our exacting standards of excellence."
            />
            <FeatureCard
              icon={<Shield className="w-full h-full" />}
              title="Lasting Commitment"
              description="Our lifetime warranty and ongoing support demonstrate our confidence in our products and our commitment to your long-term satisfaction."
            />
          </div>
        </div>
      </section>

      {/* 4. Company Stats Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Trusted by Ottawa Homeowners"
            description="Our track record speaks for itself"
          />
          <div className="mt-12">
            <StatsSection
              stats={[
                {
                  value: 1000,
                  label: 'Happy Customers',
                  suffix: '+',
                  icon: <Users className="w-12 h-12" />
                },
                {
                  value: 15,
                  label: 'Years of Excellence',
                  suffix: '+',
                  icon: <Award className="w-12 h-12" />
                },
                {
                  value: 98,
                  label: 'Satisfaction Rate',
                  suffix: '%',
                  icon: <Target className="w-12 h-12" />
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 5. Timeline/History - Company Milestones */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Our Journey"
            title="Key Milestones"
            description="The moments that shaped PG Closets"
          />
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Milestone 1 */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-grow pt-1">
                  <div className="flex items-baseline gap-4 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight">The Beginning</h3>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                      2010
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                    Founded with a vision to bring premium closet solutions to Ottawa homeowners. Started with a small team and big dreams.
                  </p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-grow pt-1">
                  <div className="flex items-baseline gap-4 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight">Expansion</h3>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                      2015
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                    Opened our showroom in Ottawa, allowing customers to experience our products firsthand and work directly with our design experts.
                  </p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-grow pt-1">
                  <div className="flex items-baseline gap-4 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight">Recognition</h3>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                      2018
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                    Reached 500+ satisfied customers and earned recognition as one of Ottawa's top-rated closet solution providers.
                  </p>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300">
                  <Wrench className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-grow pt-1">
                  <div className="flex items-baseline gap-4 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight">Premium Partnerships</h3>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                      2020
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                    Partnered with Renin and other leading manufacturers to offer the finest closet doors and hardware in the industry.
                  </p>
                </div>
              </div>

              {/* Milestone 5 */}
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-grow pt-1">
                  <div className="flex items-baseline gap-4 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight">Today</h3>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                      2024
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                    Serving 1000+ happy customers with expert installation, lifetime warranty, and a commitment to excellence that continues to grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Ottawa Focus - Service Area */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div>
                <p className="text-apple-13 font-semibold text-primary uppercase tracking-wider mb-4">
                  Proudly Serving Ottawa
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Your Local Closet Experts
                </h2>
              </div>
              <div className="space-y-4 text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                <p>
                  As a locally-owned business, we're proud to serve homeowners throughout Ottawa and the surrounding areas. Our deep roots in the community mean we understand the unique needs and styles of Ottawa homes.
                </p>
                <p>
                  We offer free in-home consultations, professional measurements, and expert installation services across the entire Ottawa region.
                </p>
              </div>

              {/* Service Areas List */}
              <div className="pt-4">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Areas We Serve
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Kanata',
                    'Barrhaven',
                    'Orleans',
                    'Nepean',
                    'Gloucester',
                    'Westboro',
                    'The Glebe',
                    'Centretown',
                    'Riverside South',
                    'Stittsville',
                    'Manotick',
                    'Rockcliffe Park'
                  ].map((area) => (
                    <div
                      key={area}
                      className="flex items-center gap-2 text-muted-foreground dark:text-apple-dark-text-secondary"
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/optimized-images/custom-closet-design-process.webp"
                alt="Ottawa Service Areas - PG Closets"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Us Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Why Choose PG Closets"
            title="The PG Closets Difference"
            description="What sets us apart from the competition"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Lifetime Warranty</h3>
              <p className="text-muted-foreground dark:text-apple-dark-text-secondary">
                All products backed by comprehensive lifetime warranty for complete peace of mind.
              </p>
            </div>

            <div className="bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Expert Installation</h3>
              <p className="text-muted-foreground dark:text-apple-dark-text-secondary">
                Professional installation by certified experts ensures perfect fit and finish.
              </p>
            </div>

            <div className="bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Premium Quality</h3>
              <p className="text-muted-foreground dark:text-apple-dark-text-secondary">
                Partnership with leading manufacturers ensures top-tier materials and finishes.
              </p>
            </div>

            <div className="bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Free Consultation</h3>
              <p className="text-muted-foreground dark:text-apple-dark-text-secondary">
                Personalized design consultation and in-home measurements at no cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA Section - Contact/Consultation */}
      <CTASection
        title="Ready to Transform Your Space?"
        description="Schedule your free consultation and discover how we can create the perfect closet solution for your home"
        ctaText="Book Free Consultation"
        ctaHref="/book-measure"
        secondaryCtaText="Contact Us"
        secondaryCtaHref="/contact"
        backgroundImage="/optimized-images/luxury-modern-walk-in-closet.webp"
      />
    </main>
  )
}
