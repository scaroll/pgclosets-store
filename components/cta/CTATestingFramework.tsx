'use client'

"use client"

import { useState, useEffect, useCallback } from "react"
import { AdvancedCTA } from "./AdvancedCTA"
import type { AdvancedCTAProps } from "./AdvancedCTA"

interface CTAVariant {
  id: string
  name: string
  props: Partial<AdvancedCTAProps>
  weight: number // For traffic allocation
}

interface CTATestConfig {
  testId: string
  variants: CTAVariant[]
  metrics: {
    impressions: Record<string, number>
    clicks: Record<string, number>
    conversions: Record<string, number>
  }
  startDate: string
  endDate?: string
  status: "draft" | "active" | "paused" | "completed"
  targetAudience?: {
    device?: "mobile" | "desktop" | "all"
    location?: string[]
    returningVisitor?: boolean
    timeOfDay?: { start: number; end: number }
  }
}

interface CTATestingFrameworkProps {
  testConfig: CTATestConfig
  fallbackVariant: CTAVariant
  onConversion?: (variantId: string, conversionType: string) => void
  className?: string
}

export default function CTATestingFramework({
  testConfig,
  fallbackVariant,
  onConversion,
  className = ""
}: CTATestingFrameworkProps) {
  const [selectedVariant, setSelectedVariant] = useState<CTAVariant | null>(null)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Variant selection logic with traffic allocation
  const selectVariant = useCallback(() => {
    if (testConfig.status !== "active") {
      return fallbackVariant
    }

    // Check if test is within date range
    const now = new Date()
    const startDate = new Date(testConfig.startDate)
    const endDate = testConfig.endDate ? new Date(testConfig.endDate) : null

    if (now < startDate || (endDate && now > endDate)) {
      return fallbackVariant
    }

    // Check audience targeting
    if (testConfig.targetAudience) {
      const { device, location, returningVisitor, timeOfDay } = testConfig.targetAudience

      // Device targeting
      if (device && device !== "all") {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if ((device === "mobile" && !isMobile) || (device === "desktop" && isMobile)) {
          return fallbackVariant
        }
      }

      // Time of day targeting
      if (timeOfDay) {
        const currentHour = now.getHours()
        if (currentHour < timeOfDay.start || currentHour > timeOfDay.end) {
          return fallbackVariant
        }
      }

      // Returning visitor check (simplified - in production, use cookies/localStorage)
      if (returningVisitor !== undefined) {
        const hasVisited = localStorage.getItem("pgclosets_visited") === "true"
        if (returningVisitor !== hasVisited) {
          return fallbackVariant
        }
      }
    }

    // Weighted random selection
    const totalWeight = testConfig.variants.reduce((sum, variant) => sum + variant.weight, 0)
    let random = Math.random() * totalWeight

    for (const variant of testConfig.variants) {
      random -= variant.weight
      if (random <= 0) {
        return variant
      }
    }

    return testConfig.variants[0] || fallbackVariant
  }, [testConfig, fallbackVariant])

  // Initialize variant selection
  useEffect(() => {
    const variant = selectVariant()
    setSelectedVariant(variant)

    // Track impression
    trackEvent("impression", variant.id)

    // Mark user as visited
    localStorage.setItem("pgclosets_visited", "true")
  }, [selectVariant])

  // Event tracking
  const trackEvent = useCallback((eventType: "impression" | "click" | "conversion", variantId: string, conversionType?: string) => {
    // Send to analytics
    console.log(`CTA Test Event: ${eventType}`, {
      testId: testConfig.testId,
      variantId,
      sessionId,
      conversionType,
      timestamp: new Date().toISOString()
    })

    // In production, send to your analytics service
    // Example: analytics.track('cta_test_event', { ... })

    // Update local metrics (in production, this would be server-side)
    if (typeof window !== "undefined") {
      const key = `cta_test_${testConfig.testId}`
      const stored = localStorage.getItem(key)
      const metrics = stored ? JSON.parse(stored) : { impressions: {}, clicks: {}, conversions: {} }

      if (!metrics[`${eventType  }s`][variantId]) {
        metrics[`${eventType  }s`][variantId] = 0
      }
      metrics[`${eventType  }s`][variantId]++

      localStorage.setItem(key, JSON.stringify(metrics))
    }
  }, [testConfig.testId, sessionId])

  // Handle CTA click
  const handleClick = useCallback(() => {
    if (selectedVariant) {
      trackEvent("click", selectedVariant.id)

      // Execute original onClick if provided
      selectedVariant.props.onClick?.()
    }
  }, [selectedVariant, trackEvent])

  // Handle conversion (called externally)
  const handleConversion = useCallback((conversionType: string = "purchase") => {
    if (selectedVariant) {
      trackEvent("conversion", selectedVariant.id, conversionType)
      onConversion?.(selectedVariant.id, conversionType)
    }
  }, [selectedVariant, trackEvent, onConversion])

  // Expose conversion tracking for external use
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__ctaTestConversion = handleConversion
    }
  }, [handleConversion])

  if (!selectedVariant) {
    return null // Or loading state
  }

  return (
    <div className={className} data-test-id={testConfig.testId} data-variant-id={selectedVariant.id}>
      <AdvancedCTA
        {...selectedVariant.props}
        onClick={handleClick}
      />
    </div>
  )
}

// Testing configuration presets
export const CTATestPresets = {
  urgencyTest: {
    testId: "urgency_vs_value_2024_q1",
    variants: [
      {
        id: "control",
        name: "Control - Standard CTA",
        weight: 25,
        props: {
          variant: "primary" as const,
          text: "Get Free Quote",
          icon: "arrow" as const
        }
      },
      {
        id: "urgency_time",
        name: "Time-based Urgency",
        weight: 25,
        props: {
          variant: "urgent" as const,
          text: "Get Quote - Ends Tonight",
          icon: "clock" as const,
          urgency: {
            enabled: true,
            timeLeft: "6 hours",
            type: "time" as const
          },
          animation: "pulse" as const
        }
      },
      {
        id: "urgency_availability",
        name: "Availability Urgency",
        weight: 25,
        props: {
          variant: "urgent" as const,
          text: "Get Quote - 3 Slots Left",
          icon: "calendar" as const,
          urgency: {
            enabled: true,
            slotsLeft: 3,
            type: "availability" as const
          },
          animation: "glow" as const
        }
      },
      {
        id: "value_focused",
        name: "Value Proposition Focus",
        weight: 25,
        props: {
          variant: "quote" as const,
          text: "Free Quote + Lifetime Warranty",
          icon: "shield" as const,
          valueProposition: {
            enabled: true,
            benefit: "Professional consultation included",
            freeOffer: "Free measurement"
          },
          riskReduction: {
            enabled: true,
            warranty: "Lifetime warranty",
            noCommitment: true
          }
        }
      }
    ],
    metrics: {
      impressions: {},
      clicks: {},
      conversions: {}
    },
    startDate: new Date().toISOString(),
    status: "active" as const
  },

  socialProofTest: {
    testId: "social_proof_impact_2024_q1",
    variants: [
      {
        id: "no_social_proof",
        name: "No Social Proof",
        weight: 50,
        props: {
          variant: "primary" as const,
          text: "Request Free Online Quote",
          icon: "calendar" as const
        }
      },
      {
        id: "with_social_proof",
        name: "With Social Proof",
        weight: 50,
        props: {
          variant: "primary" as const,
          text: "Join 500+ Happy Ottawa Homeowners",
          icon: "users" as const,
          socialProof: {
            enabled: true,
            count: 500,
            recentAction: "Mike from Kanata booked 2 hours ago"
          }
        }
      }
    ],
    metrics: {
      impressions: {},
      clicks: {},
      conversions: {}
    },
    startDate: new Date().toISOString(),
    status: "active" as const
  },

  mobileVsDesktopTest: {
    testId: "mobile_desktop_cta_2024_q1",
    variants: [
      {
        id: "compact_mobile",
        name: "Compact for Mobile",
        weight: 100,
        props: {
          variant: "primary" as const,
          size: "sm" as const,
          text: "Get Quote",
          icon: "arrow" as const
        }
      },
      {
        id: "detailed_desktop",
        name: "Detailed for Desktop",
        weight: 100,
        props: {
          variant: "primary" as const,
          size: "lg" as const,
          text: "Request Free Quote & Consultation",
          icon: "calendar" as const,
          valueProposition: {
            enabled: true,
            benefit: "Professional consultation included"
          }
        }
      }
    ],
    metrics: {
      impressions: {},
      clicks: {},
      conversions: {}
    },
    startDate: new Date().toISOString(),
    status: "active" as const,
    targetAudience: {
      device: "all"
    }
  }
}

// Analytics dashboard component for viewing test results
export function CTATestDashboard({ testIds }: { testIds: string[] }) {
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  useEffect(() => {
    const results: Record<string, any> = {}

    testIds.forEach(testId => {
      const key = `cta_test_${testId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        results[testId] = JSON.parse(stored)
      }
    })

    setTestResults(results)
  }, [testIds])

  const calculateConversionRate = (clicks: number, conversions: number) => {
    return clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : "0.00"
  }

  const calculateClickRate = (impressions: number, clicks: number) => {
    return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00"
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">CTA Testing Dashboard</h2>

      {Object.entries(testResults).map(([testId, metrics]) => (
        <div key={testId} className="mb-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{testId}</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Variant</th>
                  <th className="text-left p-2">Impressions</th>
                  <th className="text-left p-2">Clicks</th>
                  <th className="text-left p-2">Conversions</th>
                  <th className="text-left p-2">Click Rate</th>
                  <th className="text-left p-2">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(metrics.impressions || {}).map(variantId => {
                  const impressions = metrics.impressions[variantId] || 0
                  const clicks = metrics.clicks[variantId] || 0
                  const conversions = metrics.conversions[variantId] || 0

                  return (
                    <tr key={variantId} className="border-b">
                      <td className="p-2 font-medium">{variantId}</td>
                      <td className="p-2">{impressions}</td>
                      <td className="p-2">{clicks}</td>
                      <td className="p-2">{conversions}</td>
                      <td className="p-2">{calculateClickRate(impressions, clicks)}%</td>
                      <td className="p-2">{calculateConversionRate(clicks, conversions)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper function to trigger conversion tracking
export function trackCTAConversion(conversionType: string = "purchase") {
  if (typeof window !== "undefined" && (window as any).__ctaTestConversion) {
    (window as any).__ctaTestConversion(conversionType)
  }
}