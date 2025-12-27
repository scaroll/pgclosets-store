'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="p-20">
      <h1 className="text-4xl font-bold text-blue-600">Client Component Test</h1>
      <p className="mt-4 text-xl">Status: {mounted ? 'Hydrated' : 'SSR'}</p>
      <p className="mt-2 text-lg">
        If you see &quot;Hydrated&quot;, the persistent TypeError is resolved!
      </p>
    </main>
  )
}
