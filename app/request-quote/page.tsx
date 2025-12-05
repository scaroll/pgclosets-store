'use client'

import { QuoteRequestForm } from "@/components/quote/quote-request-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo"
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Star,
  Shield,
  TrendingUp,
  Users,
  Award,
} from "lucide-react"

export default function RequestQuotePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-8">
              <Breadcrumbs
                items={[
                  { name: 'Request Quote', url: '/request-quote' }
                ]}
              />
            </div>

            <div className="text-center">
              <div className="inline-block mb-6">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider">
                  <MessageSquare className="w-5 h-5" />
                  100% Free • No Obligation
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Get Your Free Quote
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your space with premium Renin closet doors. Request a free quote and
                discover why over 500 Ottawa families trust PG Closets.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary mb-2">24h</div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Response Time
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary mb-2">500+</div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Happy Clients
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary mb-2">5.0</div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Star Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary mb-2">15+</div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Years Experience
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Why Request a Quote from PG Closets?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the difference of working with Ottawa's premier closet door specialists
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <Card className="apple-transition hover:shadow-xl border-2">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Free Quotes</CardTitle>
                  <CardDescription className="text-base">
                    No hidden fees, no surprises. Get a detailed, transparent quote with complete
                    pricing breakdown at no cost to you.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Benefit 2 */}
              <Card className="apple-transition hover:shadow-xl border-2">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Fast Response</CardTitle>
                  <CardDescription className="text-base">
                    We value your time. Receive your personalized quote within 24 hours, with most
                    requests answered the same day.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Benefit 3 */}
              <Card className="apple-transition hover:shadow-xl border-2">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Expert Advice</CardTitle>
                  <CardDescription className="text-base">
                    Work directly with experienced professionals who understand design, function,
                    and quality craftsmanship.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Tell Us About Your Project
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we'll provide a detailed quote tailored to your needs
              </p>
            </div>

            <QuoteRequestForm />
          </div>
        </div>
      </section>

      {/* Trust Badges & Process */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Our Simple 4-Step Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From quote to installation, we make it easy to transform your space
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white text-3xl font-black mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold">Submit Request</h3>
                <p className="text-muted-foreground">
                  Fill out our simple form with your project details
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white text-3xl font-black mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold">Get Your Quote</h3>
                <p className="text-muted-foreground">
                  Receive detailed pricing within 24 hours
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white text-3xl font-black mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold">Schedule Install</h3>
                <p className="text-muted-foreground">
                  Choose a convenient time for professional installation
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white text-3xl font-black mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold">Enjoy Results</h3>
                <p className="text-muted-foreground">
                  Love your new doors backed by our lifetime warranty
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">Licensed & Insured</div>
                  <div className="text-sm text-muted-foreground">Fully Protected</div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">Official Renin Dealer</div>
                  <div className="text-sm text-muted-foreground">Premium Quality</div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">5.0 Star Rating</div>
                  <div className="text-sm text-muted-foreground">98% Satisfaction</div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">15+ Years</div>
                  <div className="text-sm text-muted-foreground">Local Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-muted-foreground">
                Join hundreds of satisfied homeowners across Ottawa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="apple-transition hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "From quote to installation, PG Closets exceeded our expectations. The barn
                    doors are stunning and the installation was flawless. Highly recommend!"
                  </p>
                  <div className="font-semibold">Sarah M.</div>
                  <div className="text-sm text-muted-foreground">Ottawa, ON</div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="apple-transition hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "Professional, transparent pricing, and beautiful results. The team was
                    punctual, respectful, and cleaned up perfectly. Worth every penny!"
                  </p>
                  <div className="font-semibold">Michael R.</div>
                  <div className="text-sm text-muted-foreground">Kanata, ON</div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="apple-transition hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "Best decision we made for our home renovation. The quality of the Renin doors
                    is exceptional, and PG Closets' service was top-notch throughout."
                  </p>
                  <div className="font-semibold">Jennifer L.</div>
                  <div className="text-sm text-muted-foreground">Barrhaven, ON</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed">
              Get your free quote today and discover why Ottawa homeowners choose PG Closets for
              their door projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="#quote-form"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary text-lg font-bold rounded-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl"
              >
                Request Quote Above
              </a>
              <a
                href="tel:6134225800"
                className="inline-flex items-center justify-center px-10 py-5 border-4 border-white text-white text-lg font-bold rounded-lg hover:bg-white hover:text-primary transition-all"
              >
                Call (613) 422-5800
              </a>
            </div>
            <p className="mt-8 text-sm opacity-90">
              Questions? We're here to help! Reach out anytime for expert advice.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
