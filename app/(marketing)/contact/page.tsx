'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitStatus('success')
    setFormData({ name: '', email: '', subject: '', message: '' })

    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }))
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have a question or ready to transform your space? We&apos;re here to help bring your
              vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {/* Email Card */}
            <Card className="apple-transition hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:info@pgclosets.com"
                  className="break-all text-lg font-semibold text-primary hover:underline"
                >
                  info@pgclosets.com
                </a>
                <p className="mt-2 text-sm text-muted-foreground">24-48 hour response</p>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="apple-transition hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                <CardTitle className="text-xl">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Ottawa, ON</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Serving the greater Ottawa area
                </p>
              </CardContent>
            </Card>

            {/* Hours Card */}
            <Card className="apple-transition hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">Mon-Fri: 9AM-6PM</p>
                <p className="text-sm font-medium">Sat: 10AM-4PM</p>
                <p className="mt-2 text-sm text-muted-foreground">Closed Sundays</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Send Us a Message</h2>
              <p className="mb-8 text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you within 24-48 hours.
              </p>

              <form onSubmit={e => void handleSubmit(e)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="apple-transition"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="apple-transition"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={handleSelectChange} required>
                    <SelectTrigger className="apple-transition">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Free Consultation Request</SelectItem>
                      <SelectItem value="quote">Get a Quote</SelectItem>
                      <SelectItem value="installation">Installation Question</SelectItem>
                      <SelectItem value="product">Product Inquiry</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project or question..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="apple-transition resize-none"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="font-medium text-green-800">
                      Thank you! We&apos;ll be in touch soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="font-medium text-red-800">
                      Something went wrong. Please try again.
                    </p>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="text-sm text-muted-foreground">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </form>
            </div>

            {/* Map Section */}
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Service Area</h2>
              <p className="mb-8 text-muted-foreground">
                We proudly serve Ottawa and surrounding areas with professional closet solutions.
              </p>

              <Card className="overflow-hidden">
                <div className="relative aspect-[4/3] bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d179714.45162856146!2d-75.89850032989784!3d45.25015855583904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce05b25f5113af%3A0x8a6a51e131dd15ed!2sOttawa%2C%20ON!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="PG Closets Service Area - Ottawa, ON"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-bold">Areas We Serve:</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Ottawa Downtown</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Kanata</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Barrhaven</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Orleans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Nepean</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Gloucester</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Stittsville</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Business Hours</h2>
              <p className="text-muted-foreground">
                Visit our showroom or schedule a consultation during our business hours
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b py-3">
                    <span className="text-lg font-semibold">Monday - Friday</span>
                    <span className="text-lg">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between border-b py-3">
                    <span className="text-lg font-semibold">Saturday</span>
                    <span className="text-lg">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-lg font-semibold">Sunday</span>
                    <span className="text-lg text-muted-foreground">Closed</span>
                  </div>
                </div>

                <div className="mt-8 rounded-lg bg-primary/5 p-4">
                  <p className="text-center text-sm">
                    <strong>Note:</strong> Book a free virtual consultation or showroom visit online
                    anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Common Questions</h2>
              <p className="text-muted-foreground">
                Find quick answers to frequently asked questions
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-6 w-6 flex-shrink-0 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>How long does installation take?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Most installations are completed in 1-2 days depending on the scope. We&apos;ll
                    provide a detailed timeline during your consultation.
                  </p>
                </CardContent>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-6 w-6 flex-shrink-0 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Do you offer free consultations?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! We offer complimentary virtual consultations via video call or showroom
                    visits to discuss design options and get a quote.
                  </p>
                </CardContent>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-6 w-6 flex-shrink-0 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>What brands do you carry?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We are an Official Renin Dealer with access to their complete product catalog
                    including barn doors, bypass doors, bifold doors, and hardware.
                  </p>
                </CardContent>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-6 w-6 flex-shrink-0 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Can I customize my closet design?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Absolutely! We specialize in custom solutions tailored to your space, style
                    preferences, and budget.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/faq"
                className="apple-transition inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
              >
                View All FAQs
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
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Schedule a free consultation today and let&apos;s transform your space together
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="px-8 text-lg">
                <Link href="/book-consultation">Book Free Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 text-lg">
                <a href="mailto:info@pgclosets.com">Email Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
