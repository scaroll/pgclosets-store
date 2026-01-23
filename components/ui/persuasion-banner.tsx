'use client'

import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export function PersuasionBanner() {
  const [viewerCount, setViewerCount] = useState(3)

  useEffect(() => {
    // Simulate fluctuating viewer count (Social Proof)
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
        return Math.max(2, Math.min(8, prev + change))
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex w-fit animate-pulse items-center justify-center gap-2 rounded-full border border-blue-900/20 bg-blue-900/10 px-3 py-1.5 text-xs font-medium text-blue-400">
      <Users className="h-3 w-3" />
      <span>{viewerCount} architects are viewing this material right now</span>
    </div>
  )
}
