import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/ui/button"

export const metadata: Metadata = {
  title: "About PG Closets | Official Renin Dealer Ottawa",
  description:
    "Learn about PG Closets, Ottawa's trusted Renin dealer specializing in premium door systems and professional installation. Family-owned business serving Ottawa since 2010.",
  keywords:
    "about PG Closets, Renin dealer Ottawa, family business Ottawa, door installation company, Ottawa closet company history",
  openGraph: {
    title: "About PG Closets | Official Renin Dealer Ottawa",
    description:
      "Learn about PG Closets, Ottawa's trusted Renin dealer specializing in premium door systems and professional installation.",
    images: [{ url: "/og-about.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="section-lg bg-muted/30">
        <div className="container-default">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-overline text-accent mb-4">Our Story</p>
              <h1 className="text-display mb-6">
                Family-Owned Excellence Since 2010
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8">
                Ottawa-operated and family-owned, PG Closets has been transforming
                homes across the region with premium Renin door systems and
                exceptional service for over a decade.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" href="/contact">
                  Get Free Consultation
                </Button>
                <Button variant="outline" size="lg" href="/products">
                  Browse Products
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="card overflow-hidden aspect-square">
                <Image
                  src="/images/arcat/renin_199065_hd.jpg"
                  alt="Premium Renin closet doors installed in Ottawa home"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Stats Badge */}
              <div className="absolute -bottom-4 -right-4 card card-elevated p-6 text-center">
                <div className="text-h2 text-primary mb-1">500+</div>
                <div className="text-overline text-muted-foreground">Installations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="section">
        <div className="container-default">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-h2 mb-8">The PG Closets Journey</h2>
              <div className="space-y-6 text-body text-muted-foreground">
                <p>
                  What started as a small family business has grown into Ottawa's most
                  trusted name in premium door systems. As an official Renin dealer,
                  we combine the quality and innovation of Canada's leading door
                  manufacturer with the personal touch and local expertise that only
                  a family business can provide.
                </p>
                <p>
                  Our commitment to excellence has earned us the trust of over 500
                  Ottawa families, and we're proud to maintain a 98% customer
                  satisfaction rating. Every project, from a simple barn door to a
                  complete closet system, receives the same attention to detail and
                  dedication to quality that has defined our business from day one.
                </p>
                <p>
                  Today, we continue to grow while staying true to our founding
                  principles: transparent pricing, quality products, professional
                  installation, and exceptional customer service.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="card overflow-hidden aspect-square relative">
                  <Image
                    src="/images/arcat/renin_199063_hd.jpg"
                    alt="Georgian 6-Panel Design closet doors"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="card overflow-hidden aspect-square relative">
                  <Image
                    src="/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite_v2.jpg"
                    alt="Euro 1-Lite bifold closet doors"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="card overflow-hidden aspect-square relative">
                  <Image
                    src="/images/arcat/renin_205721_hd.jpg"
                    alt="Crochet Multi-X Design barn door"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="card overflow-hidden aspect-square relative">
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

      {/* Values Section */}
      <section className="section bg-muted/30">
        <div className="container-default">
          <div className="text-center mb-12">
            <p className="text-overline text-accent mb-3">Our Values</p>
            <h2 className="text-h2 mb-4">What Drives Us</h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Our mission is simple: to provide Ottawa homeowners with premium door
              solutions that enhance both function and beauty in their homes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ),
                title: "Quality First",
                description:
                  "We partner exclusively with Renin, Canada's premier door manufacturer, to ensure every product meets the highest standards of excellence and durability.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
                title: "Personal Service",
                description:
                  "As a family business, we treat every customer like family, providing personalized attention and care throughout your entire project journey.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                title: "Local Focus",
                description:
                  "We're proud to call Ottawa home and are committed to serving our community with integrity, excellence, and unwavering dedication.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="card card-elevated p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  {value.icon}
                </div>
                <h3 className="text-h4 mb-4">{value.title}</h3>
                <p className="text-body-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container-default">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "500+", label: "Installations" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "5.0", label: "Google Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-display text-primary mb-2">{stat.value}</div>
                <div className="text-overline text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container-narrow text-center">
          <h2 className="text-h2 mb-4">Ready to Work Together?</h2>
          <p className="text-body-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Experience the PG Closets difference for yourself. Let's create
            something beautiful and functional for your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              href="/contact"
            >
              Start Your Project
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="tel:6134225800"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              (613) 422-5800
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
