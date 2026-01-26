'use client'

import { FeatureCard } from '@/components/shared/feature-card'
import { SectionHeader } from '@/components/shared/section-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Award,
  CheckCircle,
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'

export function QuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    roomCount: '',
    budget: '',
    timeline: '',
    message: '',
    address: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Transform the form data to match the API's expected structure
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          province: 'Ontario', // Default for Ottawa area
        },
        product: {
          name: formData.projectType || 'General Quote Request',
          category: formData.projectType || 'general',
          price: null,
          selectedOptions: {
            roomCount: formData.roomCount,
            budget: formData.budget,
            timeline: formData.timeline,
            address: formData.address,
          },
        },
        notes: formData.message,
      }

      const response = await fetch('/api/quotes/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quote request')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        roomCount: '',
        budget: '',
        timeline: '',
        message: '',
        address: '',
      })

      // Scroll to success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Quote submission failed:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-apple-13 font-semibold uppercase tracking-wider text-primary">
              Free Consultation
            </p>
            <h1 className="mb-6 font-sf-display text-4xl font-semibold tracking-[-0.02em] md:text-6xl">
              Request a Free Quote
            </h1>
            <p className="text-xl text-muted-foreground dark:text-apple-dark-text-secondary">
              Get a personalized quote for your custom closet project. Our experts will help you
              design the perfect storage solution for your space.
            </p>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <section className="border-b border-green-200 bg-green-50 py-8 dark:border-green-800 dark:bg-green-950/20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-green-900 dark:text-green-100 md:text-3xl">
                Quote Request Received!
              </h2>
              <p className="text-lg text-green-800 dark:text-green-200">
                Thank you for your interest! Our team will review your request and contact you
                within 24 hours to discuss your project and provide a detailed quote.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Quote Form Section */}
      <section className="bg-background py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Tell Us About Your Project
              </h2>
              <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                Fill out the form below and we&apos;ll provide you with a customized quote tailored
                to your needs
              </p>
            </div>

            <Card className="bg-card shadow-xl dark:bg-apple-dark-bg-secondary">
              <CardContent className="p-8 md:p-10">
                <form
                  onSubmit={e => {
                    void handleSubmit(e)
                  }}
                  className="space-y-6"
                >
                  {/* Contact Information */}
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 text-xl font-bold">
                      <Mail className="h-5 w-5 text-primary" />
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
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
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(613) 555-0123"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="apple-transition"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address (Optional)</Label>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Ottawa, ON"
                          value={formData.address}
                          onChange={handleChange}
                          className="apple-transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-6 border-t pt-6">
                    <h3 className="flex items-center gap-2 text-xl font-bold">
                      <Wrench className="h-5 w-5 text-primary" />
                      Project Details
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type *</Label>
                        <Select
                          value={formData.projectType}
                          onValueChange={value => handleSelectChange('projectType', value)}
                          required
                        >
                          <SelectTrigger className="apple-transition">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="barn-door">Barn Door Closet</SelectItem>
                            <SelectItem value="closet-system">Custom Closet System</SelectItem>
                            <SelectItem value="bifold">Bifold Door</SelectItem>
                            <SelectItem value="sliding">Sliding Door</SelectItem>
                            <SelectItem value="other">Other / Multiple</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roomCount">Number of Rooms</Label>
                        <Input
                          id="roomCount"
                          name="roomCount"
                          type="number"
                          min="1"
                          max="20"
                          placeholder="1"
                          value={formData.roomCount}
                          onChange={handleChange}
                          className="apple-transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select
                          value={formData.budget}
                          onValueChange={value => handleSelectChange('budget', value)}
                        >
                          <SelectTrigger className="apple-transition">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-500">Under $500</SelectItem>
                            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                            <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                            <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                            <SelectItem value="over-5000">Over $5,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline">Preferred Timeline</Label>
                        <Select
                          value={formData.timeline}
                          onValueChange={value => handleSelectChange('timeline', value)}
                        >
                          <SelectTrigger className="apple-transition">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">As Soon As Possible</SelectItem>
                            <SelectItem value="1-month">Within 1 Month</SelectItem>
                            <SelectItem value="3-months">1-3 Months</SelectItem>
                            <SelectItem value="6-months">3-6 Months</SelectItem>
                            <SelectItem value="no-rush">No Rush / Planning Ahead</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Details</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your vision, space dimensions, style preferences, or any specific requirements..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="apple-transition resize-none"
                      />
                      <p className="text-sm text-muted-foreground">
                        Include dimensions, style preferences, or any special requirements
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                      <p className="font-medium text-red-800 dark:text-red-200">
                        Something went wrong. Please try again or contact us directly at (613)
                        701-6393.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Your Free Quote'}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    By submitting this form, you agree to be contacted about your project. We
                    respect your privacy and will never share your information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose PG Closets Section */}
      <section className="bg-muted/30 py-32">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Why Choose PG Closets"
            title="Your Trusted Closet Experts"
            description="We're committed to delivering exceptional quality and service on every project"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-full w-full" />}
              title="Lifetime Warranty"
              description="All our products come with a comprehensive lifetime warranty, giving you complete peace of mind for years to come."
            />
            <FeatureCard
              icon={<Award className="h-full w-full" />}
              title="Expert Craftsmanship"
              description="Professional installation by certified experts ensures perfect fit, finish, and long-lasting quality."
            />
            <FeatureCard
              icon={<Clock className="h-full w-full" />}
              title="Fast Turnaround"
              description="Most installations completed in 1-2 days. We work efficiently without compromising on quality."
            />
            <FeatureCard
              icon={<Star className="h-full w-full" />}
              title="Premium Materials"
              description="Partnership with leading manufacturers like Renin ensures top-tier materials and stunning finishes."
            />
            <FeatureCard
              icon={<Heart className="h-full w-full" />}
              title="Free Consultation"
              description="Personalized design consultation and in-home measurements at no cost to you."
            />
            <FeatureCard
              icon={<MapPin className="h-full w-full" />}
              title="Local Service"
              description="Proudly serving Ottawa and surrounding areas with dedicated local support and service."
            />
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center font-sf-display text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
              What You Can Expect
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl">24-Hour Response Time</h3>
                      <p className="mt-1 text-sm font-normal text-muted-foreground">
                        We&apos;ll review your request and contact you within one business day to
                        discuss your project.
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl">Free In-Home Consultation</h3>
                      <p className="mt-1 text-sm font-normal text-muted-foreground">
                        We&apos;ll visit your space, take measurements, and discuss design options
                        at no charge.
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl">Detailed Quote</h3>
                      <p className="mt-1 text-sm font-normal text-muted-foreground">
                        Receive a comprehensive quote with no hidden fees, including materials and
                        installation.
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl">No Obligation</h3>
                      <p className="mt-1 text-sm font-normal text-muted-foreground">
                        Get your quote with absolutely no pressure or obligation to move forward.
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Have Questions?</h2>
            <p className="mb-8 text-xl text-muted-foreground dark:text-apple-dark-text-secondary">
              Our team is here to help. Contact us directly for immediate assistance.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="outline" className="px-8 text-lg">
                <a href="tel:+16137016393">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (613) 701-6393
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 text-lg">
                <a href="mailto:info@pgclosets.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
