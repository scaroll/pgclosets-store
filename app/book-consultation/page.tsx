import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export const metadata: Metadata = {
  title: 'Book Free Consultation | PG Closets Ottawa',
  description:
    "Schedule your free consultation with Ottawa's premier closet door specialists. Virtual consultations, showroom visits, or email consultations available. Official Renin dealer.",
  keywords:
    'closet consultation Ottawa, free consultation, barn door consultation, closet door estimate, Renin dealer Ottawa',
}

export default function BookConsultationPage() {
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
              Get expert advice and a detailed quote for your closet door project. Choose virtual,
              showroom, or email consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Consultation Options Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Consultation Options
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Choose the consultation type that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Virtual Consultation */}
              <Card className="apple-transition border-2 hover:border-primary/50 hover:shadow-lg">
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
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Virtual Consultation</CardTitle>
                  <CardDescription>
                    Connect via video call from the comfort of your home. Share photos and
                    measurements, and get real-time expert advice.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      30-45 minute video call
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Share space photos live
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Detailed quote within 24hrs
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Showroom Visit */}
              <Card className="apple-transition border-2 hover:border-primary/50 hover:shadow-lg">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Showroom Visit</CardTitle>
                  <CardDescription>
                    Visit our showroom to see and touch our full Renin product collection. Get
                    hands-on with door styles and finishes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      See products in person
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Compare finishes & styles
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      One-on-one expert guidance
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Email Consultation */}
              <Card className="apple-transition border-2 hover:border-primary/50 hover:shadow-lg">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Email Consultation</CardTitle>
                  <CardDescription>
                    Share your project details and photos via email. Receive a comprehensive
                    response with recommendations and quote.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Respond at your pace
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Attach photos & drawings
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Written recommendations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Request Your Consultation
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we&apos;ll contact you within 24 hours to confirm your
                consultation
              </p>
            </div>

            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <form className="space-y-6" action="/api/lead" method="POST">
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

                  {/* Consultation Type */}
                  <div className="space-y-3">
                    <Label>Consultation Type *</Label>
                    <RadioGroup
                      defaultValue="virtual"
                      name="consultation_type"
                      className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                      <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 transition-colors hover:border-primary/50">
                        <RadioGroupItem value="virtual" id="virtual" />
                        <Label htmlFor="virtual" className="cursor-pointer">
                          Virtual (Video Call)
                        </Label>
                      </div>
                      <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 transition-colors hover:border-primary/50">
                        <RadioGroupItem value="showroom" id="showroom" />
                        <Label htmlFor="showroom" className="cursor-pointer">
                          Showroom Visit
                        </Label>
                      </div>
                      <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 transition-colors hover:border-primary/50">
                        <RadioGroupItem value="email" id="email-consult" />
                        <Label htmlFor="email-consult" className="cursor-pointer">
                          Email Consultation
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <Label htmlFor="project-type">Project Type *</Label>
                    <Select name="project_type" required>
                      <SelectTrigger id="project-type">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="barn-door">Barn Door Installation</SelectItem>
                        <SelectItem value="bypass-door">Bypass/Sliding Doors</SelectItem>
                        <SelectItem value="bifold-door">Bifold Door Installation</SelectItem>
                        <SelectItem value="mirrors">Mirrors & Decorative</SelectItem>
                        <SelectItem value="hardware">Hardware Only</SelectItem>
                        <SelectItem value="replacement">Door Replacement</SelectItem>
                        <SelectItem value="multiple">Multiple Projects</SelectItem>
                        <SelectItem value="not-sure">Not Sure - Need Advice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date and Time Row */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input id="date" name="preferred_date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select name="preferred_time">
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Select time (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9am - 12pm)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12pm - 4pm)</SelectItem>
                          <SelectItem value="evening">Evening (4pm - 6pm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select name="budget_range">
                      <SelectTrigger id="budget">
                        <SelectValue placeholder="Select budget range (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500">Under $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                        <SelectItem value="over-2000">$2,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Tell Us About Your Project</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe your space, dimensions, style preferences, or any questions you have..."
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
                    Request Free Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Alternative */}
            <div className="mt-8 text-center">
              <p className="mb-4 text-muted-foreground">Prefer to reach out directly?</p>
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
                Email info@pgclosets.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PG Closets Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Why Choose PG Closets?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Ottawa&apos;s trusted source for premium closet door solutions
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-card p-6 text-center shadow-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold">Official Renin Dealer</h3>
                <p className="text-sm text-muted-foreground">
                  Authorized dealer with access to the complete Renin product catalog
                </p>
              </div>

              <div className="rounded-2xl bg-card p-6 text-center shadow-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold">500+ Ottawa Homes</h3>
                <p className="text-sm text-muted-foreground">
                  Trusted by hundreds of homeowners across the Ottawa region
                </p>
              </div>

              <div className="rounded-2xl bg-card p-6 text-center shadow-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold">15+ Years Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Over a decade of professional closet door installation expertise
                </p>
              </div>

              <div className="rounded-2xl bg-card p-6 text-center shadow-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold">5.0 Google Rating</h3>
                <p className="text-sm text-muted-foreground">
                  Consistently rated 5 stars by our satisfied customers
                </p>
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
                {[
                  'Ottawa',
                  'Kanata',
                  'Barrhaven',
                  'Orleans',
                  'Nepean',
                  'Stittsville',
                  'Gloucester',
                  'Westboro',
                ].map(area => (
                  <div key={area} className="space-y-2">
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
                    <h3 className="font-semibold">{area}</h3>
                  </div>
                ))}
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

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Ready to Transform Your Space?
            </h2>
            <p className="mb-8 text-xl opacity-90 md:text-2xl">
              Book your free consultation today and take the first step toward beautiful closet
              doors
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="h-auto px-8 py-6 text-lg" asChild>
                <a href="#booking-form">
                  Request Consultation
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
                <Link href="/products">
                  Browse Products
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
