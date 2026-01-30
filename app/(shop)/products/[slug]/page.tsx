import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Format slug for display
  const displayName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-neutral-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {displayName}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {/* Image Placeholder */}
            <div className="mb-8 flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200">
              <span className="text-neutral-400">Product Image Coming Soon</span>
            </div>

            {/* Coming Soon Message */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center">
              <p className="mb-2 text-xl font-medium text-neutral-900">
                Product details coming soon
              </p>
              <p className="mb-6 text-neutral-600">
                We&apos;re currently updating our product catalog. Full specifications, pricing, and
                ordering options will be available shortly.
              </p>
              <Link
                href="/products"
                className="inline-block rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Ensure the page always renders (returns 200) for any slug
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const displayName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: `${displayName} | PG Closets`,
    description: 'Premium closet systems designed for modern living.',
  }
}
