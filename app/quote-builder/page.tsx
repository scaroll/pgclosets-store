import type { Metadata } from 'next'
import { QuoteBuilderWizard } from './quote-builder-wizard'

export const metadata: Metadata = {
  title: 'Quote Builder - PG Closets',
  description: 'Build your custom closet door quote. Configure multiple rooms, select finishes, and get an instant estimate.',
}

export default function QuoteBuilderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <QuoteBuilderWizard />
      </div>
    </main>
  )
}
