export function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <section className="relative bg-white pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge skeleton */}
            <div className="inline-block w-32 h-8 bg-slate-200 rounded-full animate-pulse mb-8" />

            {/* Title skeleton */}
            <div className="space-y-4 mb-8">
              <div className="h-16 bg-slate-200 rounded animate-pulse mx-auto max-w-lg" />
              <div className="h-16 bg-slate-200 rounded animate-pulse mx-auto max-w-md" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-3 mb-12 max-w-3xl mx-auto">
              <div className="h-6 bg-slate-200 rounded animate-pulse" />
              <div className="h-6 bg-slate-200 rounded animate-pulse max-w-2xl mx-auto" />
            </div>

            {/* Features skeleton */}
            <div className="flex justify-center items-center gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
                  <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters skeleton */}
        <div className="mb-12">
          {/* Search and count skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="max-w-md">
              <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
          </div>

          {/* Category buttons skeleton */}
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-10 bg-slate-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-slate-100">
              {/* Image skeleton */}
              <div className="aspect-square bg-slate-200 animate-pulse" />

              {/* Content skeleton */}
              <div className="p-6">
                <div className="w-16 h-3 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="w-full h-6 bg-slate-200 rounded animate-pulse mb-3" />
                <div className="space-y-2 mb-4">
                  <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-20 h-6 bg-slate-200 rounded animate-pulse" />
                  <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}