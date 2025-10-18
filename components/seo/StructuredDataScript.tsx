'use client'

import Script from 'next/script'

interface StructuredDataScriptProps {
  data: object
  id?: string
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload'
}

/**
 * Reusable component for injecting JSON-LD structured data
 */
export function StructuredDataScript({
  data,
  id = 'structured-data',
  strategy = 'beforeInteractive'
}: StructuredDataScriptProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy={strategy}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  )
}

/**
 * Server-side alternative using standard script tag
 */
export function StructuredDataTag({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  )
}
