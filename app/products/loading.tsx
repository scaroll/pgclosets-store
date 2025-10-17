export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max section-padding">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="skeleton h-12 w-64 mx-auto mb-4" />
          <div className="skeleton-text max-w-2xl mx-auto" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="skeleton h-10 w-32" />
          <div className="skeleton h-10 w-32" />
          <div className="skeleton h-10 w-32" />
          <div className="skeleton h-10 w-40" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card p-0 overflow-hidden">
              <div className="skeleton h-64 w-full" />
              <div className="p-4 space-y-2">
                <div className="skeleton-text w-3/4" />
                <div className="skeleton-text w-1/2" />
                <div className="skeleton h-6 w-20 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}