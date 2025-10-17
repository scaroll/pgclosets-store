export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-max section-padding">
        {/* Hero Section Skeleton */}
        <div className="mb-12">
          <div className="skeleton-title max-w-2xl mx-auto mb-4" />
          <div className="skeleton-text max-w-xl mx-auto mb-8" />
          <div className="flex gap-4 justify-center">
            <div className="skeleton-button" />
            <div className="skeleton-button" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="skeleton-card aspect-[4/3]" />
              <div className="skeleton-text w-3/4" />
              <div className="skeleton-text w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}