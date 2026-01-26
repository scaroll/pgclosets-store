import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Free Consultation - PG Closets',
  description:
    'Schedule your free in-home consultation and measurement service. Expert closet door installation in Ottawa with lifetime warranty.',
  keywords:
    'closet consultation Ottawa, free measure, barn door installation, closet door estimate',
}

export default function BookMeasurePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                100% Free, No Obligation
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
              Book Your Free Consultation
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground md:text-2xl">
              Get expert advice, precise measurements, and a detailed quote for your closet door
              project. Our specialists serve the entire Ottawa region.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Why Book a Consultation?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our in-home consultation ensures perfect results for your project
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Benefit 1 */}
              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <svg
                      className="h-8 w-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <CardTitle>Accurate Measurements</CardTitle>
                  <CardDescription>
                    Our experts take precise measurements to ensure perfect fit and functionality.
                    No guesswork, just perfect results.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Benefit 2 */}
              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <svg
                      className="h-8 w-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <CardTitle>Expert Design Advice</CardTitle>
                  <CardDescription>
                    Get personalized recommendations on door styles, finishes, and hardware that
                    complement your space and lifestyle.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Benefit 3 */}
              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <svg
                      className="h-8 w-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <CardTitle>Transparent Pricing</CardTitle>
                  <CardDescription>
                    Receive a detailed, itemized quote with no hidden fees. Know exactly what
                    you&apos;re paying for before making any commitment.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Schedule Your Consultation
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we&apos;ll contact you within 24 hours to confirm your
                appointment
              </p>
            </div>

            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <form className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" placeholder="John Smith" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(613) 555-1234"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Service Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main St, Ottawa, ON"
                      required
                    />
                  </div>

                  {/* Date and Time Row */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input id="date" name="date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time *</Label>
                      <Select name="time" required>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12pm - 4pm)</SelectItem>
                          <SelectItem value="evening">Evening (4pm - 7pm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <Label htmlFor="project-type">Project Type *</Label>
                    <Select name="project-type" required>
                      <SelectTrigger id="project-type">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="barn-door">Barn Door Installation</SelectItem>
                        <SelectItem value="bifold">Bifold Door Installation</SelectItem>
                        <SelectItem value="glass-door">Glass Door Installation</SelectItem>
                        <SelectItem value="hardware">Hardware Only</SelectItem>
                        <SelectItem value="replacement">Door Replacement</SelectItem>
                        <SelectItem value="multiple">Multiple Doors</SelectItem>
                        <SelectItem value="not-sure">Not Sure - Need Advice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Tell us about your project, measurements, style preferences, or any questions you have..."
                      rows={5}
                    />
                  </div>

                  {/* Privacy Notice */}
                  <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                    <p>
                      By submitting this form, you agree to our privacy policy. We&apos;ll only use
                      your information to contact you about your consultation. We never share your
                      data with third parties.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full text-lg">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Book Free Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Alternative */}
            <div className="mt-8 text-center">
              <p className="mb-4 text-muted-foreground">Prefer to talk to someone right away?</p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="tel:+16135551234"
                  className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call (613) 555-1234
                </a>
                <span className="hidden text-muted-foreground sm:inline">or</span>
                <a
                  href="mailto:info@pgclosets.com"
                  className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">What to Expect</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our simple 3-step process from consultation to installation
              </p>
            </div>

            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Connection Line - Hidden on mobile */}
              <div
                className="absolute left-0 right-0 top-16 hidden h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 md:block"
                style={{ width: '66%', left: '17%', top: '64px' }}
              />

              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-primary/10 shadow-lg">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
                      <span className="text-4xl font-bold text-primary-foreground">1</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">Schedule & Meet</h3>
                  <p className="text-muted-foreground">
                    Book your free consultation online or by phone. Our expert will visit your home
                    at your convenience to discuss your needs and preferences.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-primary/10 shadow-lg">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
                      <span className="text-4xl font-bold text-primary-foreground">2</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">Measure & Quote</h3>
                  <p className="text-muted-foreground">
                    We take precise measurements and provide design recommendations. You&apos;ll
                    receive a detailed, transparent quote with no hidden fees within 24 hours.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-primary/10 shadow-lg">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
                      <span className="text-4xl font-bold text-primary-foreground">3</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">Install & Enjoy</h3>
                  <p className="text-muted-foreground">
                    Once approved, our certified installers complete the work with precision. Enjoy
                    your beautiful new closet doors backed by our lifetime warranty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Proudly Serving Ottawa & Region
              </h2>
              <p className="text-lg text-muted-foreground">
                We provide expert closet door installation throughout the National Capital Region
              </p>
            </div>

            <div className="rounded-2xl bg-card p-8 shadow-lg md:p-12">
              <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                <div className="space-y-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Kanata</h3>
                </div>
                <div className="space-y-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Barrhaven</h3>
                </div>
                <div className="space-y-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Nepean</h3>
                </div>
                <div className="space-y-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Orleans</h3>
                </div>
                <div className="space-y-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Stittsville</h3>
                </div>
                <div className="space-y-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Westboro</h3>
                </div>
                <div className="space-y-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Gloucester</h3>
                </div>
                <div className="space-y-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Downtown</h3>
                </div>
              </div>
              <div className="mt-8 border-t pt-8 text-center">
                <p className="text-muted-foreground">
                  <strong>Also serving:</strong> Gatineau, Arnprior, Smiths Falls, Carleton Place,
                  Manotick, and surrounding areas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Your Trust is Our Priority
              </h2>
              <p className="text-lg text-muted-foreground">
                Industry-leading warranties and guarantees for complete peace of mind
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* BBB Accredited */}
              <div className="apple-transition rounded-2xl bg-card p-8 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold">BBB Accredited</h3>
                <p className="mb-4 text-muted-foreground">
                  Proud member of the Better Business Bureau with an A+ rating
                </p>
                <div className="inline-flex items-center gap-2 font-semibold text-primary">
                  <span>A+ Rating</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              {/* Lifetime Warranty */}
              <div className="apple-transition rounded-2xl bg-card p-8 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold">Lifetime Warranty</h3>
                <p className="mb-4 text-muted-foreground">
                  Comprehensive coverage on all products and installation workmanship
                </p>
                <div className="inline-flex items-center gap-2 font-semibold text-primary">
                  <span>Protected Forever</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Satisfaction Guarantee */}
              <div className="apple-transition rounded-2xl bg-card p-8 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold">100% Satisfaction</h3>
                <p className="mb-4 text-muted-foreground">
                  We&apos;re not happy until you&apos;re thrilled with your new closet doors
                </p>
                <div className="inline-flex items-center gap-2 font-semibold text-primary">
                  <span>Guaranteed</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Additional Trust Elements */}
            <div className="mt-12 grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Ready to Transform Your Space?
            </h2>
            <p className="mb-8 text-xl opacity-90 md:text-2xl">
              Book your free consultation today and take the first step toward beautiful, functional
              closet doors
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="h-auto px-8 py-6 text-lg" asChild>
                <a href="#booking-form">
                  Schedule Consultation
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-auto border-2 border-primary-foreground bg-transparent px-8 py-6 text-lg text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <a href="tel:+16135551234">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
