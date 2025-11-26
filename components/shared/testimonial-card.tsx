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

'use client';

import * as React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TestimonialCardProps {
  /**
   * Customer review quote
   */
  quote: string;
  /**
   * Customer name
   */
  name: string;
  /**
   * Customer location
   */
  location: string;
  /**
   * Star rating (1-5)
   */
  rating: number;
  /**
   * Optional customer photo URL
   */
  photo?: string;
  /**
   * Optional date of review
   */
  date?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
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
  const [isVisible, setIsVisible] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        'bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-8 shadow-lg',
        'transition-all duration-500 ease-out',
        'hover:shadow-xl hover:-translate-y-1',
        'border border-transparent hover:border-primary/10',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-5 h-5 transition-colors',
              i < rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            )}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-foreground dark:text-apple-dark-text mb-6 text-lg leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4 border-t border-border dark:border-apple-dark-bg-tertiary pt-4">
        {photo && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-foreground dark:text-apple-dark-text">
            {name}
          </p>
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
  );
}

TestimonialCard.displayName = 'TestimonialCard';
