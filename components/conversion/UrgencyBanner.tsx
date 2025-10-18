"use client"

import { useState, useEffect } from "react"
import { Clock, Users, TrendingUp } from "lucide-react"

export function UrgencyBanner() {
  const [activeVisitors, setActiveVisitors] = useState(12)
  const [recentOrders, setRecentOrders] = useState(3)

  // Simulate live activity for social proof
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVisitors(prev => Math.max(8, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))))
      if (Math.random() > 0.7) {
        setRecentOrders(prev => prev + 1)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="font-medium">{activeVisitors} customers viewing now</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">{recentOrders} orders in the last 24 hours</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Free quote response within 2 hours</span>
          </div>
        </div>
      </div>
    </div>
  )
}
