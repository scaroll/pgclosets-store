'use client'

/**
 * Global Error Handler
 *
 * This file handles catastrophic errors that occur outside the root layout.
 * Must include its own <html> and <body> tags as it replaces the root layout.
 *
 * Note: This file MUST NOT import the OnceUI providers or any client components
 * that depend on SSR context, as it needs to work during static generation.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center px-6">
            <h1 className="text-4xl font-bold mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-8 py-3 font-semibold hover:bg-blue-700 transition-colors uppercase tracking-wide rounded"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
