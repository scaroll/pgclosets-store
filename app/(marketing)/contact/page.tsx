import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - PG Closets',
  description: 'Get in touch with PG Closets for a free consultation on your custom closet project.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
        <div className="prose prose-lg max-w-3xl">
          <p className="text-xl text-muted-foreground">
            Coming soon - Contact form and information.
          </p>
        </div>
      </div>
    </main>
  )
}
