"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  date: string
  project?: string
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export function TestimonialsCarousel({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  className
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [direction, setDirection] = React.useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection
      if (newIndex < 0) newIndex = testimonials.length - 1
      if (newIndex >= testimonials.length) newIndex = 0
      return newIndex
    })
  }

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      paginate(1)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [currentIndex, autoPlay, autoPlayInterval])

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="relative h-[400px] md:h-[300px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="absolute w-full"
          >
            <div className="mx-auto max-w-3xl px-4">
              <div className="rounded-apple-lg bg-white dark:bg-apple-dark-bg-elevated p-8 shadow-apple-lg border border-apple-gray-200 dark:border-apple-dark-border">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < currentTestimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-none text-apple-gray-300 dark:text-apple-dark-text-tertiary"
                      )}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg md:text-xl text-apple-gray-900 dark:text-apple-dark-text mb-6 leading-relaxed">
                  "{currentTestimonial.text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-between border-t border-apple-gray-200 dark:border-apple-dark-border pt-4">
                  <div>
                    <p className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
                      {currentTestimonial.name}
                    </p>
                    <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
                      {currentTestimonial.location}
                      {currentTestimonial.project && ` • ${currentTestimonial.project}`}
                    </p>
                  </div>
                  <p className="text-sm text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    {currentTestimonial.date}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => paginate(-1)}
          className="rounded-full h-10 w-10 p-0"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-8 bg-apple-blue-500 dark:bg-apple-blue-dark"
                  : "w-2 bg-apple-gray-300 dark:bg-apple-dark-text-tertiary hover:bg-apple-gray-400"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => paginate(1)}
          className="rounded-full h-10 w-10 p-0"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
