export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 animate-pulse">
            <div className="h-4 w-32 bg-muted rounded mx-auto" />
            <div className="h-12 w-96 bg-muted rounded mx-auto" />
            <div className="h-6 w-full max-w-2xl bg-muted rounded mx-auto" />
          </div>
        </div>
      </section>

      {/* Form Section Skeleton */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center space-y-4 animate-pulse">
              <div className="h-10 w-80 bg-muted rounded mx-auto" />
              <div className="h-6 w-full max-w-xl bg-muted rounded mx-auto" />
            </div>

            <div className="bg-card dark:bg-apple-dark-bg-secondary rounded-lg shadow-xl p-8 md:p-10 space-y-6 animate-pulse">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-9 w-full bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-9 w-full bg-muted rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-9 w-full bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-9 w-full bg-muted rounded" />
                </div>
              </div>
              <div className="h-11 w-full bg-muted rounded" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
