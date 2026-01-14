export default function Loading() {
  return (
    <div className="min-h-screen bg-pg-offwhite flex items-center justify-center">
      <div className="container-apple">
        <div className="max-w-md mx-auto text-center">
          <div className="card-apple p-8">
            {/* Loading Spinner */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 border-4 border-pg-sky/20 border-t-pg-sky rounded-full animate-spin"></div>
            </div>

            <h2 className="text-h3 text-pg-navy mb-4">Loading</h2>
            <p className="text-body-m text-pg-gray mb-6">
              Please wait while we prepare your content...
            </p>

            {/* Loading Progress Bar */}
            <div className="w-full bg-pg-sky/20 rounded-full h-2 mb-4">
              <div className="bg-pg-sky h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>

            {/* Skeleton Content */}
            <div className="space-y-3">
              <div className="animate-shimmer h-4 rounded"></div>
              <div className="animate-shimmer h-4 rounded w-3/4 mx-auto"></div>
              <div className="animate-shimmer h-4 rounded w-1/2 mx-auto"></div>
            </div>
          </div>

          {/* Performance Hint */}
          <p className="text-body-s text-pg-gray mt-4">
            Optimizing for best performance...
          </p>
        </div>
      </div>
    </div>
  )
}