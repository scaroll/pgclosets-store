import type { Metadata } from "next"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Home,
  MessageSquare,
  Calendar,
  ClipboardCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Quote Request Received | PG Closets - Custom Closet Doors Ottawa",
  description:
    "Thank you for requesting a quote from PG Closets. We'll review your project details and get back to you within 24 hours.",
  robots: "noindex, nofollow",
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function QuoteSuccessPage({ searchParams }: PageProps) {
  // Extract quote reference from URL params
  const quoteRef = typeof searchParams.ref === "string" ? searchParams.ref : null
  const customerName = typeof searchParams.name === "string" ? searchParams.name : null

  return (
    <main className="min-h-screen bg-background">
      {/* Success Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-green-50 via-background to-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-6 shadow-xl">
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                {customerName ? `Thank You, ${customerName}!` : "Request Received!"}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your quote request has been successfully submitted. We're excited to help transform
                your space with premium closet doors.
              </p>
            </div>

            {/* Quote Reference Card */}
            {quoteRef && (
              <Card className="max-w-2xl mx-auto mb-8 shadow-xl border-2">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center space-y-3">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Quote Reference Number
                    </div>
                    <div className="inline-block px-6 py-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                      <div className="text-3xl md:text-4xl font-black text-primary tracking-tight font-mono">
                        {quoteRef}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pt-2">
                      Please save this reference number for your records. We've also sent it to your
                      email.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                What Happens Next?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Here's what you can expect from the PG Closets team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <Card className="apple-transition hover:shadow-xl border-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 text-white text-2xl font-black shadow-lg">
                    1
                  </div>
                  <CardTitle className="text-xl">We Review Your Request</CardTitle>
                  <CardDescription className="text-base">
                    Our team carefully reviews your project details and requirements to prepare a
                    tailored quote.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Step 2 */}
              <Card className="apple-transition hover:shadow-xl border-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 text-white text-2xl font-black shadow-lg">
                    2
                  </div>
                  <CardTitle className="text-xl">We Contact You</CardTitle>
                  <CardDescription className="text-base">
                    Within 24 hours, we'll reach out via your preferred contact method to discuss
                    your project.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Step 3 */}
              <Card className="apple-transition hover:shadow-xl border-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 text-white text-2xl font-black shadow-lg">
                    3
                  </div>
                  <CardTitle className="text-xl">Detailed Quote</CardTitle>
                  <CardDescription className="text-base">
                    Receive a comprehensive quote with transparent pricing, product details, and
                    timeline.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Step 4 */}
              <Card className="apple-transition hover:shadow-xl border-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 text-white text-2xl font-black shadow-lg">
                    4
                  </div>
                  <CardTitle className="text-xl">Schedule Install</CardTitle>
                  <CardDescription className="text-base">
                    Once approved, we'll schedule a convenient time for professional installation.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Guarantee */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-2 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="pt-12 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {/* Response Time */}
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                      <Clock className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <div className="text-4xl font-black text-primary mb-2">24h</div>
                      <div className="text-lg font-bold mb-1">Response Guarantee</div>
                      <div className="text-sm text-muted-foreground">
                        We'll get back to you within one business day
                      </div>
                    </div>
                  </div>

                  {/* Free Consultation */}
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                      <MessageSquare className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <div className="text-4xl font-black text-primary mb-2">100%</div>
                      <div className="text-lg font-bold mb-1">Free Consultation</div>
                      <div className="text-sm text-muted-foreground">
                        No obligation. No hidden fees. Ever.
                      </div>
                    </div>
                  </div>

                  {/* Expert Team */}
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                      <ClipboardCheck className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <div className="text-4xl font-black text-primary mb-2">15+</div>
                      <div className="text-lg font-bold mb-1">Years Experience</div>
                      <div className="text-sm text-muted-foreground">
                        Trusted by 500+ Ottawa families
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Need Immediate Assistance?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Our team is here to help. Reach out anytime if you have questions about your quote.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Phone */}
              <Card className="apple-transition hover:shadow-xl border-2">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Call Us</CardTitle>
                  <CardDescription className="text-base">
                    Speak with our team directly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="tel:6134225800"
                    className="text-2xl font-bold text-primary hover:underline inline-block mb-2"
                  >
                    (613) 422-5800
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 8:00 AM - 6:00 PM
                    <br />
                    Saturday: 9:00 AM - 4:00 PM
                  </p>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="apple-transition hover:shadow-xl border-2">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Email Us</CardTitle>
                  <CardDescription className="text-base">
                    Send us your questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:info@pgclosets.ca"
                    className="text-lg font-bold text-primary hover:underline inline-block mb-2 break-all"
                  >
                    info@pgclosets.ca
                  </a>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 2 hours during business hours
                  </p>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="apple-transition hover:shadow-xl border-2">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Visit Us</CardTitle>
                  <CardDescription className="text-base">
                    See our showroom
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-base font-semibold mb-2">
                    Ottawa, Ontario
                    <br />
                    Serving Greater Ottawa Area
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Schedule an appointment to view our door samples and finishes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Products Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Calendar className="w-16 h-16 mx-auto text-primary mb-6" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                While You Wait...
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Explore our product catalog and get inspired for your project
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg font-bold px-8 py-6">
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg font-bold px-8 py-6">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Reassurance Banner */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-4xl font-bold mb-4">
              Your Quote Request Is In Good Hands
            </h3>
            <p className="text-lg md:text-xl opacity-95">
              We're committed to providing you with the best service and quality products. Our team
              is reviewing your request and will contact you shortly.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
