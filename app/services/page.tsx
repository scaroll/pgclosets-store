import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/ui/button"

export const metadata: Metadata = {
  title: "Professional Closet Door Services Ottawa | Installation & Consultation | PG Closets",
  description:
    "Expert closet door installation, consultation, and custom solutions in Ottawa. Free in-home consultation, professional installation, lifetime warranty. Serving Ottawa, Kanata, Nepean, Orleans, Barrhaven.",
  keywords:
    "closet door installation Ottawa, professional door installation, custom closet solutions, home consultation Ottawa, door repair services, closet renovation Ottawa",
  openGraph: {
    title: "Professional Closet Door Services Ottawa | PG Closets",
    description:
      "Expert closet door installation and consultation services in Ottawa. Free consultation, professional installation, lifetime warranty.",
    images: [{ url: "/images/arcat/renin_205738_Bypass_Closet_Doors_Euro_1_Lite.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/services" },
}

const services = [
  {
    title: "Professional Installation",
    description:
      "Expert installation of all Renin closet door systems with precision and care. Our certified installers ensure perfect fit and function.",
    features: ["Certified installers", "Lifetime warranty", "Clean-up included"],
    image: "/images/arcat/renin_205750_Bifold_Closet_Door_Georgian_6_Panel_Insert_Design.jpg",
    cta: "Schedule Installation",
    primary: true,
  },
  {
    title: "Free Consultation",
    description:
      "In-home consultation to assess your space, discuss options, and provide instant CAD pricing for your project.",
    features: ["No obligation", "Instant pricing", "Design recommendations"],
    image: "/images/arcat/renin_205739_Bypass_Closet_Doors_Euro_3_Lite.jpg",
    cta: "Book Consultation",
    primary: false,
  },
  {
    title: "Custom Solutions",
    description:
      "Tailored closet door solutions for unique spaces, including custom sizing, finishes, and hardware configurations.",
    features: ["Custom sizing", "Unique finishes", "Special hardware"],
    image: "/images/arcat/renin_205731_Mix_Match_Hardware_Driftwood_K_Design.jpg",
    cta: "Discuss Custom Project",
    primary: true,
  },
]

const processSteps = [
  {
    step: "1",
    title: "Consultation",
    description: "Free in-home consultation and measurement",
  },
  {
    step: "2",
    title: "Design",
    description: "Product selection and instant CAD pricing",
  },
  {
    step: "3",
    title: "Manufacturing",
    description: "Custom manufacturing and quality control",
  },
  {
    step: "4",
    title: "Installation",
    description: "Professional installation and final inspection",
  },
]

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/arcat/renin_205741_Bypass_Closet_Doors_Harmony_1_Lite.jpg"
            alt="Professional closet door installation showcase"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/90" />
        </div>

        <div className="container-default relative z-10 section-lg text-center text-primary-foreground">
          <p className="text-overline text-accent mb-4">Our Services</p>
          <h1 className="text-display mb-6 max-w-4xl mx-auto">
            Professional Closet Door Services
          </h1>
          <p className="text-body-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Expert installation • Custom solutions • Lifetime warranty
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" href="/contact">
              Get Free Consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/products"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container-default">
          <div className="text-center mb-12">
            <p className="text-overline text-accent mb-3">What We Offer</p>
            <h2 className="text-h2 mb-4">Our Services</h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive closet door solutions from consultation to installation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card card-product">
                <div className="card-product-image">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="card-product-body">
                  <h3 className="text-h4 mb-3">{service.title}</h3>
                  <p className="text-body-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-body-sm text-muted-foreground">
                        <svg className="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={service.primary ? "default" : "outline"}
                    size="default"
                    href="/contact"
                    className="w-full"
                  >
                    {service.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section bg-muted/30">
        <div className="container-default">
          <div className="text-center mb-12">
            <p className="text-overline text-accent mb-3">How It Works</p>
            <h2 className="text-h2 mb-4">Our Process</h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent process from consultation to completion
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6 inline-block">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-h2 text-primary">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-h4 mb-2">{item.title}</h3>
                <p className="text-body-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section">
        <div className="container-default">
          <div className="text-center mb-12">
            <p className="text-overline text-accent mb-3">Coverage</p>
            <h2 className="text-h2 mb-4">Service Areas</h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Proudly serving Ottawa and surrounding communities
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {["Ottawa", "Kanata", "Nepean", "Orleans", "Barrhaven", "Gloucester", "Stittsville", "Manotick"].map(
              (area) => (
                <Link
                  key={area}
                  href={`/${area.toLowerCase()}`}
                  className="badge badge-default text-base px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {area}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container-narrow text-center">
          <h2 className="text-h2 mb-4">Ready to Get Started?</h2>
          <p className="text-body-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Transform your space with premium Renin closet doors. Free consultation,
            transparent pricing, lifetime warranty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" href="/contact">
              Schedule Free Consultation
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

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>5.0 Rating</span>
            </div>
            <span className="text-primary-foreground/30">•</span>
            <span>500+ Happy Customers</span>
            <span className="text-primary-foreground/30">•</span>
            <span>Lifetime Warranty</span>
          </div>
        </div>
      </section>
    </main>
  )
}
