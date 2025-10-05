import React from 'react'
import type { Metadata } from 'next'
import {
  Calendar,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Ruler,
  Star,
  ArrowRight,
  Shield,
  Users,
  MessageCircle
} from 'lucide-react'
import MeasurementScheduler from '@/components/booking/measurement-scheduler'

export const metadata: Metadata = {
  title: 'Free Measurement Service | Book Your Appointment | PG Closets',
  description: 'Book a free professional measurement consultation for your Renin closet doors, barn doors, and hardware. Serving Ottawa and surrounding areas with expert installation guidance.',
  keywords: 'free measurement, closet measurement, barn door measurement, Renin products, Ottawa, professional consultation',
  openGraph: {
    title: 'Free Measurement Service | PG Closets',
    description: 'Professional measurement service for Renin closet solutions in Ottawa. Book your free consultation today.',
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Free Professional Measurement Service
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Get precise measurements and expert recommendations for your Renin closet doors,
                barn doors, and hardware. Our professional measurement service ensures perfect
                fit and optimal functionality.
              </p>
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
            <div className="bg-white rounded-lg shadow-xl p-8 text-gray-900">
              <h2 className="text-2xl font-bold mb-4 text-center">Quick Booking Summary</h2>
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
              <a
                href="#booking-form"
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Book Your Free Measurement
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Professional Measurement?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Accurate measurements are crucial for the perfect fit and function of your Renin products.
              Our experienced professionals ensure every detail is captured correctly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Precision Accuracy</h3>
              <p className="text-gray-600">
                Professional-grade tools and techniques ensure measurements are accurate to the millimeter,
                preventing costly mistakes and ensuring perfect fit.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Consultation</h3>
              <p className="text-gray-600">
                Our specialists provide recommendations on the best Renin products for your space,
                considering functionality, aesthetics, and budget.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Guarantee</h3>
              <p className="text-gray-600">
                All measurements come with our quality guarantee. If there's an issue with our measurements,
                we'll make it right at no additional cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Measurement Service Works
            </h2>
            <p className="text-lg text-gray-600">
              Our streamlined process makes it easy to get professional measurements for your project.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Book Online</h3>
              <p className="text-gray-600">
                Schedule your free measurement appointment using our easy online booking system.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirmation Call</h3>
              <p className="text-gray-600">
                Our team will contact you within 24 hours to confirm your appointment and discuss your project.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Visit</h3>
              <p className="text-gray-600">
                Our measurement specialist visits your location and takes precise measurements of your space.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Detailed Quote</h3>
              <p className="text-gray-600">
                Receive a comprehensive quote with product recommendations and installation details within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ottawa Area Service Coverage
            </h2>
            <p className="text-lg text-gray-600">
              We proudly serve the greater Ottawa area with our free measurement service.
            </p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The measurement service was incredibly professional. They caught details I would have
                missed and saved me from a costly mistake. The final installation was perfect!"
              </p>
              <div className="font-semibold text-gray-900">Sarah M., Kanata</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Free measurement service that's actually valuable! They provided great recommendations
                and the quote was very detailed. Highly recommend PG Closets."
              </p>
              <div className="font-semibold text-gray-900">Mike R., Orleans</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The team was punctual, professional, and thorough. They explained everything clearly
                and helped us choose the best Renin products for our needs."
              </p>
              <div className="font-semibold text-gray-900">Jennifer L., Nepean</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is the measurement service really free?
              </h3>
              <p className="text-gray-600">
                Yes, our professional measurement service is completely free with no strings attached.
                We believe in providing value upfront and earning your business through quality service.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does a measurement appointment take?
              </h3>
              <p className="text-gray-600">
                Most measurement appointments take between 1-2 hours, depending on the complexity and
                number of spaces being measured. We'll provide an estimated duration when we confirm your appointment.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What should I do to prepare for the measurement visit?
              </h3>
              <p className="text-gray-600">
                Please ensure the areas to be measured are accessible and clear of obstructions.
                It's helpful to have any inspiration photos or specific requirements ready to discuss.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you provide measurements for DIY installations?
              </h3>
              <p className="text-gray-600">
                Yes, we provide detailed measurements and installation guidance for DIY customers.
                We can also arrange professional installation if you prefer.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I need to reschedule my appointment?
              </h3>
              <p className="text-gray-600">
                You can reschedule your appointment by calling us at (613) 422-5800 or emailing
                info@pgclosets.ca. We ask for at least 24 hours notice when possible.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How quickly will I receive my quote after the measurement?
              </h3>
              <p className="text-gray-600">
                We typically provide detailed quotes within 24-48 hours after the measurement visit.
                Quotes include product recommendations, pricing, and installation details.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can you measure multiple rooms in one visit?
              </h3>
              <p className="text-gray-600">
                Absolutely! We can measure multiple rooms, closets, or spaces during a single visit.
                Just let us know all the areas you'd like measured when booking your appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Book Your Free Measurement Appointment
            </h2>
            <p className="text-lg text-gray-600">
              Ready to get started? Schedule your professional measurement consultation today.
            </p>
          </div>

          <MeasurementScheduler />
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">(613) 422-5800</p>
              <p className="text-sm text-gray-400">Monday - Friday, 9 AM - 5 PM</p>
            </div>

            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@pgclosets.ca</p>
              <p className="text-sm text-gray-400">We respond within 24 hours</p>
            </div>

            <div className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-300">Available on our website</p>
              <p className="text-sm text-gray-400">Monday - Friday, 9 AM - 5 PM</p>
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