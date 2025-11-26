import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - PG Closets',
  description: 'Learn about PG Closets and our commitment to quality custom closet solutions.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">About PG Closets</h1>
        <div className="prose prose-lg max-w-3xl">
          <p className="text-xl text-muted-foreground">
            Coming soon - Learn about our story, values, and commitment to exceptional quality.
          </p>
        </div>
      </div>
    </main>
  )
}
