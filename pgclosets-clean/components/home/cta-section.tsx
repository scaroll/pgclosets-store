import Link from 'next/link'
import { Phone, Calendar, ArrowRight, Star, Clock } from 'lucide-react'

const CTASection = () => {
  return (
    <section className="section-apple bg-gradient-to-br from-pg-navy to-pg-navy/90 text-white relative overflow-hidden">
      <div className="container-apple relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Headline */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-white">
              Ready to Transform Your Home?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join over 2,000 satisfied Ottawa homeowners who have upgraded their homes with our premium closet doors.
              Get your free consultation today.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Calendar className="w-8 h-8 text-pg-sky mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Free Consultation</h3>
              <p className="text-sm text-white/80">In-home design consultation with no obligation</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Star className="w-8 h-8 text-pg-sky mx-auto mb-3" />
              <h3 className="font-semibold mb-2">5-Star Service</h3>
              <p className="text-sm text-white/80">Rated #1 for quality and customer satisfaction</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Clock className="w-8 h-8 text-pg-sky mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quick Installation</h3>
              <p className="text-sm text-white/80">Professional installation in 2-3 hours</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/contact"
              className="group bg-white text-pg-navy hover:bg-white/95 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-strong flex items-center space-x-3 min-w-64 justify-center"
            >
              <Phone className="w-5 h-5" />
              <span>Get Free Quote</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/products"
              className="group bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3 min-w-64 justify-center"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>(613) 555-0123</span>
            </div>
            <div className="text-center">
              <span>Available Mon-Fri 9AM-5PM, Sat 10AM-4PM</span>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="flex flex-wrap items-center justify-center space-x-6 text-xs text-white/70">
              <span>Licensed & Insured</span>
              <span>•</span>
              <span>Better Business Bureau A+</span>
              <span>•</span>
              <span>Lifetime Warranty</span>
              <span>•</span>
              <span>Local Ottawa Business</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pg-sky/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl" />

      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  )
}

export default CTASection