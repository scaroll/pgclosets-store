// @ts-nocheck - Quote form page component
'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/shared/section-header'
import { FeatureCard } from '@/components/shared/feature-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Shield,
  Award,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  Wrench,
  Heart,
} from 'lucide-react'

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-apple-13 font-semibold text-primary uppercase tracking-wider mb-4">
              Free Consultation
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Request a Free Quote
            </h1>
            <p className="text-xl text-muted-foreground dark:text-apple-dark-text-secondary">
              Get a personalized quote for your custom closet project. Our experts will help you design the perfect storage solution for your space.
            </p>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <section className="py-8 bg-green-50 dark:bg-green-950/20 border-b border-green-200 dark:border-green-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-green-900 dark:text-green-100">
                Quote Request Received!
              </h2>
              <p className="text-lg text-green-800 dark:text-green-200">
                Thank you for your interest! Our team will review your request and contact you within 24 hours to discuss your project and provide a detailed quote.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Quote Form Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Tell Us About Your Project
              </h2>
              <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                Fill out the form below and we'll provide you with a customized quote tailored to your needs
              </p>
            </div>

            <Card className="bg-card dark:bg-apple-dark-bg-secondary shadow-xl">
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="space-y-6 pt-6 border-t">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      Project Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type *</Label>
                        <Select
                          value={formData.projectType}
                          onValueChange={(value) => handleSelectChange('projectType', value)}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select
                          value={formData.budget}
                          onValueChange={(value) => handleSelectChange('budget', value)}
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
                          onValueChange={(value) => handleSelectChange('timeline', value)}
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
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        Something went wrong. Please try again or contact us directly at (613) 701-6393.
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

                  <p className="text-sm text-center text-muted-foreground">
                    By submitting this form, you agree to be contacted about your project. We respect your privacy and will never share your information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose PG Closets Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Why Choose PG Closets"
            title="Your Trusted Closet Experts"
            description="We're committed to delivering exceptional quality and service on every project"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-full h-full" />}
              title="Lifetime Warranty"
              description="All our products come with a comprehensive lifetime warranty, giving you complete peace of mind for years to come."
            />
            <FeatureCard
              icon={<Award className="w-full h-full" />}
              title="Expert Craftsmanship"
              description="Professional installation by certified experts ensures perfect fit, finish, and long-lasting quality."
            />
            <FeatureCard
              icon={<Clock className="w-full h-full" />}
              title="Fast Turnaround"
              description="Most installations completed in 1-2 days. We work efficiently without compromising on quality."
            />
            <FeatureCard
              icon={<Star className="w-full h-full" />}
              title="Premium Materials"
              description="Partnership with leading manufacturers like Renin ensures top-tier materials and stunning finishes."
            />
            <FeatureCard
              icon={<Heart className="w-full h-full" />}
              title="Free Consultation"
              description="Personalized design consultation and in-home measurements at no cost to you."
            />
            <FeatureCard
              icon={<MapPin className="w-full h-full" />}
              title="Local Service"
              description="Proudly serving Ottawa and surrounding areas with dedicated local support and service."
            />
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight">
              What You Can Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl">24-Hour Response Time</h3>
                      <p className="text-sm font-normal text-muted-foreground mt-1">
                        We'll review your request and contact you within one business day to discuss your project.
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl">Free In-Home Consultation</h3>
                      <p className="text-sm font-normal text-muted-foreground mt-1">
                        We'll visit your space, take measurements, and discuss design options at no charge.
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl">Detailed Quote</h3>
                      <p className="text-sm font-normal text-muted-foreground mt-1">
                        Receive a comprehensive quote with no hidden fees, including materials and installation.
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="apple-transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl">No Obligation</h3>
                      <p className="text-sm font-normal text-muted-foreground mt-1">
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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground dark:text-apple-dark-text-secondary mb-8">
              Our team is here to help. Contact us directly for immediate assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <a href="tel:+16137016393">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (613) 701-6393
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <a href="mailto:info@pgclosets.com">
                  <Mail className="w-5 h-5 mr-2" />
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
