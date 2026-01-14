import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pg-offwhite flex items-center justify-center">
      <div className="container-apple">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl font-bold text-pg-navy mb-4">404</div>
            <h1 className="text-h2 mb-4">Page Not Found</h1>
            <p className="text-body-l text-pg-gray mb-8">
              Sorry, we couldn't find the page you're looking for. The page may have been moved or doesn't exist.
            </p>
          </div>

          <div className="card-apple p-8 mb-8">
            <h2 className="text-h3 mb-4">What can you do?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="text-body-l font-semibold text-pg-navy mb-2">Browse Products</h3>
                <p className="text-body-s text-pg-gray">
                  Explore our full collection of custom closet doors and hardware.
                </p>
              </div>
              <div>
                <h3 className="text-body-l font-semibold text-pg-navy mb-2">Get a Quote</h3>
                <p className="text-body-s text-pg-gray">
                  Start your project with a free consultation and quote.
                </p>
              </div>
              <div>
                <h3 className="text-body-l font-semibold text-pg-navy mb-2">Contact Us</h3>
                <p className="text-body-s text-pg-gray">
                  Speak with our team about your closet door needs.
                </p>
              </div>
              <div>
                <h3 className="text-body-l font-semibold text-pg-navy mb-2">View Gallery</h3>
                <p className="text-body-s text-pg-gray">
                  See examples of our beautiful installations.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
            <Link href="/products" className="btn-secondary">
              Browse Products
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}