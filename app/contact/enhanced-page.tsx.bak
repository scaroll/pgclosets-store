"use client"

import { useState } from "react"
import { AppleCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/AppleCard"
import { Button } from "@/components/ui/button"
import StandardLayout from "@/components/layout/StandardLayout"
import { BUSINESS_INFO } from "@/lib/business-config"
import {
  MapPin, Phone, Mail, Clock, MessageCircle, Calendar,
  CheckCircle, ArrowRight, Send, User, Home, Briefcase,
  Star, Shield, Truck, Award
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Contact form types
interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  projectType: string
  roomType: string
  budget: string
  timeline: string
  address: string
  city: string
  postalCode: string
  message: string
  preferredContact: string
  hearAbout: string
}

// Service area data
const SERVICE_AREAS = [
  "Ottawa", "Kanata", "Nepean", "Orleans", "Barrhaven",
  "Stittsville", "Manotick", "Riverside South", "Findlay Creek",
  "Greely", "Osgoode", "Richmond", "Carp", "Dunrobin"
]

// FAQ data
const CONTACT_FAQ = [
  {
    question: "What areas do you service?",
    answer: "We proudly serve Ottawa and all surrounding areas within a 50km radius, including Kanata, Nepean, Orleans, Barrhaven, and more."
  },
  {
    question: "How quickly can you provide a quote?",
    answer: "We typically provide detailed quotes within 24-48 hours of your consultation. Instant estimates are available online."
  },
  {
    question: "Do you offer free consultations?",
    answer: "Yes! We offer free in-home consultations where we measure your space and discuss design options."
  },
  {
    question: "What are your business hours?",
    answer: "We're open Monday-Friday 8am-6pm, Saturday 9am-4pm, and Sunday by appointment."
  }
]

// Contact methods data
const CONTACT_METHODS = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    description: "Speak directly with our team",
    action: "Call Now",
    value: BUSINESS_INFO.phone,
    link: `tel:${BUSINESS_INFO.phone}`,
    color: "blue"
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    description: "Get a response within 24 hours",
    action: "Send Email",
    value: BUSINESS_INFO.email,
    link: `mailto:${BUSINESS_INFO.email}`,
    color: "green"
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Live Chat",
    description: "Chat with us in real-time",
    action: "Start Chat",
    value: "Available 9am-5pm",
    link: "#",
    color: "purple"
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Book Consultation",
    description: "Schedule an in-home visit",
    action: "Book Now",
    value: "Free consultation",
    link: "/consultation",
    color: "orange"
  }
]

export default function EnhancedContactPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    roomType: "",
    budget: "",
    timeline: "",
    address: "",
    city: "",
    postalCode: "",
    message: "",
    preferredContact: "email",
    hearAbout: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitStatus("success")

    // Reset form after success
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        projectType: "",
        roomType: "",
        budget: "",
        timeline: "",
        address: "",
        city: "",
        postalCode: "",
        message: "",
        preferredContact: "email",
        hearAbout: ""
      })
      setSubmitStatus("idle")
    }, 5000)
  }

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                <span>Serving Ottawa & Surrounding Areas</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Let's Create Your
                <span className="text-blue-600"> Dream Space</span>
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Get in touch for a free consultation and discover how PG Closets can transform
                your home with premium door solutions and expert installation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now: {BUSINESS_INFO.phone}
                </Button>
                <Button size="lg" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Free Consultation
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_METHODS.map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={method.link}>
                  <AppleCard variant="link" hover className="h-full text-center">
                    <CardContent className="pt-6">
                      <div className={`w-16 h-16 rounded-2xl bg-${method.color}-100 flex items-center justify-center mx-auto mb-4`}>
                        <div className={`text-${method.color}-600`}>
                          {method.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      <p className="text-sm font-medium text-blue-600">{method.value}</p>
                      <Button size="sm" variant="ghost" className="mt-3">
                        {method.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </AppleCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form & Info */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <AppleCard variant="elevated" className="p-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Get Your Free Quote</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {submitStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Thank You!
                      </h3>
                      <p className="text-gray-600">
                        We've received your request and will contact you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          Project Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Project Type *
                            </label>
                            <select
                              name="projectType"
                              value={formData.projectType}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              <option value="new-installation">New Installation</option>
                              <option value="replacement">Door Replacement</option>
                              <option value="multiple-rooms">Multiple Rooms</option>
                              <option value="whole-home">Whole Home</option>
                              <option value="commercial">Commercial</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Room Type
                            </label>
                            <select
                              name="roomType"
                              value={formData.roomType}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              <option value="bedroom">Bedroom</option>
                              <option value="master-bedroom">Master Bedroom</option>
                              <option value="walk-in-closet">Walk-in Closet</option>
                              <option value="pantry">Pantry</option>
                              <option value="laundry">Laundry Room</option>
                              <option value="office">Home Office</option>
                              <option value="basement">Basement</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Budget Range
                            </label>
                            <select
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              <option value="under-1000">Under $1,000</option>
                              <option value="1000-2500">$1,000 - $2,500</option>
                              <option value="2500-5000">$2,500 - $5,000</option>
                              <option value="5000-10000">$5,000 - $10,000</option>
                              <option value="over-10000">Over $10,000</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Timeline
                            </label>
                            <select
                              name="timeline"
                              value={formData.timeline}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              <option value="asap">ASAP</option>
                              <option value="1-month">Within 1 Month</option>
                              <option value="2-3-months">2-3 Months</option>
                              <option value="3-6-months">3-6 Months</option>
                              <option value="planning">Just Planning</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Home className="w-5 h-5" />
                          Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Street Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <select
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select...</option>
                              {SERVICE_AREAS.map(area => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              placeholder="K1A 0B1"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Details & Special Requirements
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us more about your project..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Contact Preferences */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Contact Method
                          </label>
                          <select
                            name="preferredContact"
                            value={formData.preferredContact}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="text">Text Message</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            How did you hear about us?
                          </label>
                          <select
                            name="hearAbout"
                            value={formData.hearAbout}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select...</option>
                            <option value="google">Google Search</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="referral">Friend/Family Referral</option>
                            <option value="renin">Renin Website</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isSubmitting ? (
                            <>Submitting...</>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit Quote Request
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-gray-500 text-center mt-4">
                          By submitting this form, you agree to our privacy policy and terms of service.
                        </p>
                      </div>
                    </form>
                  )}
                </CardContent>
              </AppleCard>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <AppleCard variant="glass">
                <CardHeader>
                  <CardTitle>Visit Our Showroom</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">
                        {BUSINESS_INFO.address.street}<br />
                        {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.province}<br />
                        {BUSINESS_INFO.address.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Business Hours</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: By Appointment</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Direct Line</p>
                      <a href={`tel:${BUSINESS_INFO.phone}`} className="text-sm text-blue-600 hover:text-blue-700">
                        {BUSINESS_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href={`mailto:${BUSINESS_INFO.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                        {BUSINESS_INFO.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </AppleCard>

              {/* Why Choose Us */}
              <AppleCard variant="featured">
                <CardHeader>
                  <CardTitle>Why Choose PG Closets?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">Official Renin Dealer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">10-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Free Delivery & Installation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">98% Customer Satisfaction</span>
                  </div>
                </CardContent>
              </AppleCard>

              {/* FAQ */}
              <AppleCard variant="default">
                <CardHeader>
                  <CardTitle>Frequently Asked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {CONTACT_FAQ.map((item, idx) => (
                      <div key={idx} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-2">
                          {item.question}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AppleCard>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AppleCard variant="elevated" className="p-0 overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-blue-100 to-indigo-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map Coming Soon</h3>
                  <p className="text-gray-600">Find us in the heart of Ottawa</p>
                </div>
              </div>
            </div>
          </AppleCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contact us today for your free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Phone className="w-4 h-4 mr-2" />
              Call {BUSINESS_INFO.phone}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Visit
            </Button>
          </div>
        </div>
      </section>
    </StandardLayout>
  )
}