import type { Metadata } from 'next'
import { QuoteForm } from './QuoteForm'

export const metadata: Metadata = {
  title: 'Request a Quote | PG Closets',
  description: 'Get a free, no-obligation quote for your custom closet project. Expert installation, lifetime warranty, and premium quality materials. Serving Ottawa and surrounding areas.',
  keywords: 'quote request, free quote, custom closet quote, closet installation quote, Ottawa closets, PG Closets quote, free consultation',
  openGraph: {
    title: 'Request a Quote - PG Closets Ottawa',
    description: 'Get a free quote for your custom closet project. Expert installation, lifetime warranty, and premium quality.',
    type: 'website',
  },
}

export default function QuotePage() {
  return <QuoteForm />
}
