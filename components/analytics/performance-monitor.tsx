"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      // Monitor Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("[v0] LCP:", entry.startTime)
            // Track LCP performance
            if (window.gtag) {
              window.gtag("event", "web_vitals", {
                name: "LCP",
                value: Math.round(entry.startTime),
                event_category: "Performance",
              })
            }
          }
        }
      })

      observer.observe({ entryTypes: ["largest-contentful-paint"] })

      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any // Type assertion for layout-shift entries
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value || 0
          }
        }
        console.log("[v0] CLS:", clsValue)
        if (window.gtag) {
          window.gtag("event", "web_vitals", {
            name: "CLS",
            value: Math.round(clsValue * 1000),
            event_category: "Performance",
          })
        }
      })

      clsObserver.observe({ entryTypes: ["layout-shift"] })

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any // Type assertion for first-input entries
          if (fidEntry.processingStart) {
            console.log("[v0] FID:", fidEntry.processingStart - fidEntry.startTime)
            if (window.gtag) {
              window.gtag("event", "web_vitals", {
                name: "FID",
                value: Math.round(fidEntry.processingStart - fidEntry.startTime),
                event_category: "Performance",
              })
            }
          }
        }
      })

      fidObserver.observe({ entryTypes: ["first-input"] })

      return () => {
        observer.disconnect()
        clsObserver.disconnect()
        fidObserver.disconnect()
      }
    }
  }, [])

  return null
}

