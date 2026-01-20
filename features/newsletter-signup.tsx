"use client"

import { useState, type FormEvent } from "react"

interface NewsletterResponse {
  message?: string
  subscribed?: boolean
  error?: string
}

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then(async (response) => {
        const data = (await response.json()) as NewsletterResponse

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to subscribe")
        }

        setIsSubmitted(true)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
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
          className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm disabled:opacity-50"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}
    </div>
  )
}
