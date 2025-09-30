"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Kanata, Ottawa",
    rating: 5,
    text: "PG Closets transformed our master bedroom closet beyond our expectations. The installation was flawless, and the team was professional and clean. Worth every penny!",
    image: "/testimonials/customer-1.jpg",
    project: "Master Bedroom Closet System"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Orleans, Ottawa",
    rating: 5,
    text: "From consultation to installation, the entire process was seamless. They helped us maximize our small closet space with creative solutions. Highly recommend!",
    image: "/testimonials/customer-2.jpg",
    project: "Custom Sliding Door Installation"
  },
  {
    id: 3,
    name: "Jennifer Martinez",
    location: "Barrhaven, Ottawa",
    rating: 5,
    text: "The quality of the Renin doors is outstanding, and PG Closets' installation was perfect. Our home value increased and guests always compliment the closets!",
    image: "/testimonials/customer-3.jpg",
    project: "Whole Home Closet Renovation"
  },
  {
    id: 4,
    name: "David Thompson",
    location: "Nepean, Ottawa",
    rating: 5,
    text: "Best decision we made for our renovation. The barn doors look stunning and function perfectly. The team was on time, on budget, and exceeded expectations.",
    image: "/testimonials/customer-4.jpg",
    project: "Barn Door Installation"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    location: "Downtown Ottawa",
    rating: 5,
    text: "Working with PG Closets was a pleasure. They listened to our needs, offered expert advice, and delivered exactly what we wanted. The warranty gives us peace of mind.",
    image: "/testimonials/customer-5.jpg",
    project: "Pantry & Kitchen Storage"
  },
  {
    id: 6,
    name: "Robert Williams",
    location: "Stittsville, Ottawa",
    rating: 5,
    text: "Professional service from start to finish. The free consultation was thorough, pricing was transparent, and installation was quick. Our closet is now a showpiece!",
    image: "/testimonials/customer-6.jpg",
    project: "Walk-in Closet Design"
  }
]

export default function TestimonialCarousel() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span className="text-sm font-medium text-emerald-700 tracking-wide uppercase">
              500+ Happy Customers
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-extralight mb-4 text-slate-900 tracking-tight">
            What Our Clients Say
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
            Don't just take our word for it. Hear from homeowners across Ottawa who transformed their spaces with PG Closets.
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">5.0 Google Rating</span>
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">500+</span> Installations
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">15+</span> Years Experience
            </div>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-300 h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Rating Stars */}
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-slate-700 mb-6 leading-relaxed flex-grow">
                        "{testimonial.text}"
                      </p>

                      {/* Project Type */}
                      <div className="mb-4 pb-4 border-b border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                          Project
                        </p>
                        <p className="text-sm text-slate-700 font-medium mt-1">
                          {testimonial.project}
                        </p>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-6">
            Join hundreds of satisfied homeowners across Ottawa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/request-work"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-base tracking-wide uppercase transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:scale-105 rounded-lg"
            >
              Get Your Free Quote
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="tel:6134225800"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-semibold text-base tracking-wide uppercase transition-all duration-300 border-2 border-slate-200 hover:border-slate-300 hover:shadow-md rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (613) 422-5800
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
