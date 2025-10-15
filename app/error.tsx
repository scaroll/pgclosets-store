'use client'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-8">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="bg-[var(--color-primary)] text-white px-8 py-3 font-semibold hover:opacity-90 transition-opacity uppercase tracking-wide"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
