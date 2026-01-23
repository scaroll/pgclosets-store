'use client'

interface HeroProps {
  headline?: string
  subheadline?: string
  videoSrc?: string
  posterSrc?: string
  title?: string
}

export function VideoHero({
  videoSrc: _videoSrc = '/videos/hero-closet.mp4',
  posterSrc: _posterSrc = '/images/hero-poster.jpg',
  title: _title = "Ottawa's #1 Choice for Luxury Storage",
  headline = 'The Storage System Preferred by Top Architects',
  subheadline = 'Precision-engineered for the modern estate. Trusted by 500+ luxury homes.',
}: HeroProps) {
  return (
    <section className="relative flex h-96 items-center justify-center bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{headline}</h1>
        {subheadline && <p className="mt-2 text-xl">{subheadline}</p>}
      </div>
    </section>
  )
}

export function ImageHero({ headline }: { headline?: string }) {
  return <div>ImageHero: {headline}</div>
}

export function SplitHero({ headline }: { headline?: string }) {
  return <div>SplitHero: {headline}</div>
}
