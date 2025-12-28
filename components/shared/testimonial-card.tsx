/**
 * Testimonial Card Component - Customer reviews with Apple design system
 *
 * Features:
 * - Quote text with proper formatting
 * - Customer name and location
 * - Star rating display
 * - Optional customer photo
 * - Animated on scroll
 * - Dark mode optimized
 *
 * @example
 * <TestimonialCard
 *   quote="The custom closet exceeded all expectations!"
 *   name="Sarah Johnson"
 *   location="San Francisco, CA"
 *   rating={5}
 *   photo="/images/customers/sarah.jpg"
 * />
 */

'use client'

import Image from 'next/image'
import * as React from 'react'
// import { Star } from 'lucide-react';
import { cn } from '@/lib/utils'

export interface TestimonialCardProps {
  /**
   * Customer review quote
   */
  quote: string
  /**
   * Customer name
   */
  name: string
  /**
   * Customer location
   */
  location: string
  /**
   * Star rating (1-5)
   */
  rating: number
  /**
   * Optional customer photo URL
   */
  photo?: string
  /**
   * Optional date of review
   */
  date?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Testimonial Card component for customer reviews
 */
export function TestimonialCard({
  quote,
  name,
  location,
  rating,
  photo,
  date,
  className,
}: TestimonialCardProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn(
        'rounded-2xl bg-card p-8 shadow-lg dark:bg-apple-dark-bg-secondary',
        'transition-all duration-500 ease-out',
        'hover:-translate-y-1 hover:shadow-xl',
        'border border-transparent hover:border-primary/10',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        className
      )}
    >
      {/* Rating Stars */}
      <div className="mb-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              'h-5 w-5 transition-colors',
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            )}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="mb-6 text-lg leading-relaxed text-foreground dark:text-apple-dark-text">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4 border-t border-border pt-4 dark:border-apple-dark-bg-tertiary">
        {photo && (
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
            <Image src={photo} alt={name} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-foreground dark:text-apple-dark-text">{name}</p>
          <p className="text-sm text-muted-foreground dark:text-apple-dark-text-secondary">
            {location}
          </p>
        </div>
        {date && (
          <p className="text-sm text-muted-foreground dark:text-apple-dark-text-secondary">
            {date}
          </p>
        )}
      </div>
    </div>
  )
}

TestimonialCard.displayName = 'TestimonialCard'
