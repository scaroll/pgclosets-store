'use client'

export function VideoHero({
  headline,
  subheadline,
  videoSrc: _videoSrc = '/videos/hero-closet.mp4',
  posterSrc: _posterSrc = '/images/hero-poster.jpg',
  title: _title = 'Transform Your Space',
}) {
  return (
    <section className="relative flex h-96 items-center justify-center bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{headline}</h1>
        {subheadline && <p className="mt-2 text-xl">{subheadline}</p>}
      </div>
    </section>
  )
}

export function ImageHero({ headline }) {
  return <div>ImageHero: {headline}</div>
}

export function SplitHero({ headline }) {
  return <div>SplitHero: {headline}</div>
}
