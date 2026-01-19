'use client'

export function VideoHeroTest({ headline }: { headline?: string }) {
  return (
    <div className="bg-blue-500 p-20 text-center text-white">
      <h1 className="text-4xl font-bold">{headline}</h1>
    </div>
  )
}
