'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export function FloatingQuoteButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility)

    // Check initial scroll position
    toggleVisibility()

    // Cleanup
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
    >
      <Link
        href="/request-quote"
        className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 md:px-8 md:py-5"
        aria-label="Get a quote"
      >
        {/* Icon */}
        <div className="relative">
          <MessageSquare className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 md:h-6 md:w-6" />
          {/* Pulse animation */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
          </span>
        </div>

        {/* Text - hidden on mobile, shown on desktop */}
        <span className="hidden font-semibold tracking-wide sm:inline-block">
          Get Quote
        </span>

        {/* Mobile text - single word */}
        <span className="font-semibold tracking-wide sm:hidden">
          Quote
        </span>

        {/* Arrow indicator */}
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>

      {/* Decorative glow effect */}
      <div className="absolute inset-0 -z-10 rounded-full bg-blue-600/20 blur-xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
    </div>
  )
}
