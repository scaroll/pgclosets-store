"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  date: string
  image?: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    location: "Westboro",
    rating: 5,
    date: "March 2025",
    text: "PG Closets transformed our master bedroom closet beyond our expectations. The team was professional, punctual, and the quality of their work is exceptional. Our custom walk-in closet is now the envy of all our friends. Highly recommend their services!",
    image: "/api/placeholder/80/80"
  },
  {
    id: "2",
    name: "Michael Chen",
    location: "Kanata",
    rating: 5,
    date: "February 2025",
    text: "From the initial consultation to the final installation, everything was seamless. They listened to our needs and designed a storage solution that maximized every inch of space. The craftsmanship is outstanding and the price was very competitive. Worth every penny!",
    image: "/api/placeholder/80/80"
  },
  {
    id: "3",
    name: "Jennifer Thompson",
    location: "Barrhaven",
    rating: 5,
    date: "January 2025",
    text: "We had PG Closets install custom closet systems in all three bedrooms. The attention to detail and quality of materials exceeded our expectations. The installers were courteous and left everything spotless. Our home organization has improved dramatically!",
    image: "/api/placeholder/80/80"
  },
  {
    id: "4",
    name: "David Robertson",
    location: "Orleans",
    rating: 5,
    date: "December 2024",
    text: "Outstanding service from start to finish! The design consultation was thorough and they offered creative solutions we hadn't considered. Installation was quick and professional. Our garage storage system has completely changed how we use the space. Couldn't be happier!",
    image: "/api/placeholder/80/80"
  },
  {
    id: "5",
    name: "Lisa Anderson",
    location: "Nepean",
    rating: 5,
    date: "November 2024",
    text: "PG Closets did an amazing job on our pantry organization system. They worked with our budget and created a custom solution that looks beautiful and is incredibly functional. The quality is top-notch and the team was a pleasure to work with. Highly recommended!",
    image: "/api/placeholder/80/80"
  },
  {
    id: "6",
    name: "Robert Williams",
    location: "Stittsville",
    rating: 5,
    date: "October 2024",
    text: "We couldn't be more pleased with our new closet system. The design process was collaborative and they really listened to what we wanted. The installation was flawless and completed on schedule. The end result is a beautiful, functional space that we use every day. Thank you PG Closets!",
    image: "/api/placeholder/80/80"
  }
]

export default function TestimonialCarousel() {
  const [api, setApi] = React.useState<any>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    // Set up autoplay
    const autoplay = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 5000)

    // Update current slide
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })

    return () => {
      clearInterval(autoplay)
    }
  }, [api])

  return (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what Ottawa homeowners have to say about their PG Closets experience.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-4">
                  <Card className="border-2 border-gray-100 hover:border-black transition-all duration-300 hover:shadow-xl bg-white">
                    <div className="p-6 md:p-8">
                      {/* Rating Stars */}
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            aria-hidden="true"
                          />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-gray-700 leading-relaxed mb-6 min-h-[120px]">
                        "{testimonial.text}"
                      </blockquote>

                      {/* Customer Info */}
                      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-gray-600 flex items-center justify-center text-white font-bold text-lg">
                            {testimonial.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-black">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {testimonial.location}, Ottawa • {testimonial.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12 border-black hover:bg-black hover:text-white" />
          <CarouselNext className="hidden md:flex -right-4 lg:-right-12 border-black hover:bg-black hover:text-white" />
        </Carousel>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                current === index
                  ? "bg-black w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ready to transform your space?</p>
          <a
            href="/request-work"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white font-medium text-sm tracking-wider uppercase hover:bg-white hover:text-black border-2 border-black transition-all duration-300"
          >
            Get Your Free Quote
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export { TestimonialCarousel }