"use client"

import type React from "react"

import { useState } from "react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    try {
      // Call newsletter API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
      } else {
        alert(result.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      alert('Failed to subscribe. Please try again later.')
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-semibold mb-2">Thank you for subscribing!</h3>
        <p className="text-muted-foreground text-sm">
          You&apos;ll receive our latest closet design tips and exclusive offers.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
      <div className="text-center mb-4">
        <h3 className="font-semibold mb-2">Stay Updated</h3>
        <p className="text-muted-foreground text-sm">Get the latest closet design tips and exclusive offers</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm"
          required
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}
