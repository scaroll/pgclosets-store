import React from 'react'
import type { Metadata } from 'next'
import {
  Calendar,
  Clock,
  CheckCircle,
  MapPin,
  Mail,
  Ruler,
  Star,
  ArrowRight,
  Shield,
  Users,
  MessageCircle
} from 'lucide-react'
import MeasurementScheduler from '@/components/booking/measurement-scheduler'
import Heading from '@/components/ui/Heading-new'
import Text from '@/components/ui/Text-new'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/Card-new'

export const metadata: Metadata = {
  title: 'Free Online Quote Service | Book Your Appointment | PG Closets',
  description: 'Book a free professional measurement consultation for your Renin closet doors, barn doors, and hardware. Serving Ottawa and surrounding areas with expert installation guidance.',
  keywords: 'free online quote, closet measurement, barn door measurement, Renin products, Ottawa, professional consultation',
  openGraph: {
    title: 'Free Online Quote Service | PG Closets',
    description: 'Professional measurement service for Renin closet solutions in Ottawa. Book your free online quote today.',
    type: 'website',
  }
}

export default function BookMeasurementPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading level={1} className="mb-6 text-white">
                Free Professional Measurement Service
              </Heading>
              <Text size="lg" className="mb-8 text-blue-100">
                Get precise measurements and expert recommendations for your Renin closet doors,
                barn doors, and hardware. Our professional measurement service ensures perfect
                fit and optimal functionality.
              </Text>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>Completely Free</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>Professional Service</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>No Obligation</span>
                </div>
              </div>
            </div>
            <Card className="text-gray-900">
              <Heading level={2} className="mb-4 text-center">Quick Booking Summary</Heading>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Available Monday - Friday</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <span>9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Ottawa Area Service</span>
                </div>
                <div className="flex items-center">
                  <Ruler className="w-5 h-5 text-blue-600 mr-3" />
                  <span>2-Hour Consultation</span>
                </div>
              </div>
              <a href="#booking-form" className="block mt-6">
                <Button variant="primary" size="lg" className="w-full">
                  Book Your Free Online Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Why Choose Professional Measurement?
            </Heading>
            <Text size="base" className="max-w-3xl mx-auto">
              Accurate measurements are crucial for the perfect fit and function of your Renin products.
              Our experienced professionals ensure every detail is captured correctly.
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8 text-blue-600" />
              </div>
              <Heading level={3} className="mb-4">Precision Accuracy</Heading>
              <Text size="base">
                Professional-grade tools and techniques ensure measurements are accurate to the millimeter,
                preventing costly mistakes and ensuring perfect fit.
              </Text>
            </Card>

            <Card className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <Heading level={3} className="mb-4">Expert Consultation</Heading>
              <Text size="base">
                Our specialists provide recommendations on the best Renin products for your space,
                considering functionality, aesthetics, and budget.
              </Text>
            </Card>

            <Card className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <Heading level={3} className="mb-4">Quality Guarantee</Heading>
              <Text size="base">
                All measurements come with our quality guarantee. If there's an issue with our measurements,
                we'll make it right at no additional cost.
              </Text>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              How Our Measurement Service Works
            </Heading>
            <Text size="base">
              Our streamlined process makes it easy to get professional measurements for your project.
            </Text>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <Heading level={3} className="mb-2">Book Online</Heading>
              <Text size="base">
                Schedule your free online quote appointment using our easy online booking system.
              </Text>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <Heading level={3} className="mb-2">Confirmation Call</Heading>
              <Text size="base">
                Our team will contact you within 24 hours to confirm your appointment and discuss your project.
              </Text>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <Heading level={3} className="mb-2">Professional Visit</Heading>
              <Text size="base">
                Our measurement specialist visits your location and takes precise measurements of your space.
              </Text>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <Heading level={3} className="mb-2">Detailed Quote</Heading>
              <Text size="base">
                Receive a comprehensive quote with product recommendations and installation details within 48 hours.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Ottawa Area Service Coverage
            </Heading>
            <Text size="base">
              We proudly serve the greater Ottawa area with our free online quote service.
            </Text>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Ottawa', 'Kanata', 'Orleans', 'Nepean', 'Barrhaven',
              'Gloucester', 'Stittsville', 'Manotick', 'Riverside South',
              'Hunt Club', 'Bells Corners', 'Blackburn Hamlet'
            ].map((area) => (
              <div key={area} className="bg-white rounded-lg shadow-sm p-4 text-center">
                <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <span className="font-medium text-gray-900">{area}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't see your area listed? Contact us to check if we serve your location.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              What Our Customers Say
            </Heading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Text size="base" className="mb-4">
                "The measurement service was incredibly professional. They caught details I would have
                missed and saved me from a costly mistake. The final installation was perfect!"
              </Text>
              <Text size="base" className="font-semibold">Sarah M., Kanata</Text>
            </Card>

            <Card>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Text size="base" className="mb-4">
                "Free measurement service that's actually valuable! They provided great recommendations
                and the quote was very detailed. Highly recommend PG Closets."
              </Text>
              <Text size="base" className="font-semibold">Mike R., Orleans</Text>
            </Card>

            <Card>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Text size="base" className="mb-4">
                "The team was punctual, professional, and thorough. They explained everything clearly
                and helped us choose the best Renin products for our needs."
              </Text>
              <Text size="base" className="font-semibold">Jennifer L., Nepean</Text>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Frequently Asked Questions
            </Heading>
          </div>

          <div className="space-y-6">
            <Card>
              <Heading level={3} className="mb-2">
                Is the measurement service really free?
              </Heading>
              <Text size="base">
                Yes, our professional measurement service is completely free with no strings attached.
                We believe in providing value upfront and earning your business through quality service.
              </Text>
            </Card>

            <Card>
              <Heading level={3} className="mb-2">
                How long does a measurement appointment take?
              </Heading>
              <Text size="base">
                Most measurement appointments take between 1-2 hours, depending on the complexity and
                number of spaces being measured. We'll provide an estimated duration when we confirm your appointment.
              </Text>
            </Card>

            <Card>
              <Heading level={3} className="mb-2">
                What should I do to prepare for the measurement visit?
              </Heading>
              <Text size="base">
                Please ensure the areas to be measured are accessible and clear of obstructions.
                It's helpful to have any inspiration photos or specific requirements ready to discuss.
              </Text>
            </Card>

            <Card>
              <Heading level={3} className="mb-2">
                Do you provide measurements for DIY installations?
              </Heading>
              <Text size="base">
                Yes, we provide detailed measurements and installation guidance for DIY customers.
                We can also arrange professional installation if you prefer.
              </Text>
            </Card>

            <Card>
              <Heading level={3} className="mb-2">
                What if I need to reschedule my appointment?
              </Heading>
              <Text size="base">
                You can reschedule your appointment by emailing info@pgclosets.ca. We ask for at least 24 hours notice when possible.
              </Text>
            </Card>

            <Card>
              <Heading level={3} className="mb-2">
                How quickly will I receive my quote after the measurement?
              </Heading>
              <Text size="base">
                We typically provide detailed quotes within 24-48 hours after the measurement visit.
                Quotes include product recommendations, pricing, and installation details.
              </Text>
            </Card>

            <Card>
              <Heading level={3} className="mb-2">
                Can you measure multiple rooms in one visit?
              </Heading>
              <Text size="base">
                Absolutely! We can measure multiple rooms, closets, or spaces during a single visit.
                Just let us know all the areas you'd like measured when booking your appointment.
              </Text>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Book Your Free Online Quote Appointment
            </Heading>
            <Text size="base">
              Ready to get started? Schedule your professional measurement consultation today.
            </Text>
          </div>

          <MeasurementScheduler />
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <Heading level={3} className="mb-2 text-white">Email Us</Heading>
              <Text size="base" className="text-gray-300">info@pgclosets.ca</Text>
              <Text size="sm" className="text-gray-400">We respond within 24 hours</Text>
            </div>

            <div className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <Heading level={3} className="mb-2 text-white">Contact Form</Heading>
              <Text size="base" className="text-gray-300">Available on our website</Text>
              <Text size="sm" className="text-gray-400">Fast response guaranteed</Text>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              Questions about our measurement service? Don't hesitate to reach out.
              We're here to help make your Renin closet project a success.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}