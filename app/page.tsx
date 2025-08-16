import { Carousel } from '@/components/carousel'
import { ThreeItemGrid } from '@/components/grid/three-items'
import { StoreFooter } from '@/components/store/store-footer'
import type { Metadata } from "next"

// Enable ISR with 24 hour revalidation for homepage
export const revalidate = 86400

export const metadata: Metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and custom product catalog for PG Closets Ottawa.',
  openGraph: {
    type: 'website'
  }
}

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <StoreFooter />
    </>
  )
}
