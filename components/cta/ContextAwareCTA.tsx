'use client'

"use client"

import { useState, useEffect } from "react"
import { AdvancedCTA } from "./AdvancedCTA"
import type { AdvancedCTAProps } from "./AdvancedCTA"

interface UserContext {
  // Behavioral data
  timeOnPage: number
  scrollDepth: number
  pageViews: number
  isReturningVisitor: boolean
  previousPages: string[]

  // Session data
  sessionDuration: number
  deviceType: "mobile" | "desktop" | "tablet"
  location?: string
  timeOfDay: "morning" | "afternoon" | "evening" | "night"

  // Engagement signals
  hasInteracted: boolean
  abandonedCart: boolean
  highIntent: boolean
  urgencyTrigger: boolean

  // Demographics (if available)
  estimatedAge?: "young" | "middle" | "senior"
  interests?: string[]
}

interface ContextRule {
  id: string
  name: string
  condition: (context: UserContext) => boolean
  ctaProps: Partial<AdvancedCTAProps>
  priority: number
}

interface ContextAwareCTAProps {
  defaultCTA: Partial<AdvancedCTAProps>
  rules: ContextRule[]
  pageType: "home" | "product" | "cart" | "checkout" | "contact" | "about"
  className?: string
  onContextChange?: (context: UserContext, selectedRule?: ContextRule) => void
}

export default function ContextAwareCTA({
  defaultCTA,
  rules,
  pageType,
  className = "",
  onContextChange
}: ContextAwareCTAProps) {
  const [context, setContext] = useState<UserContext | null>(null)
  const [selectedRule, setSelectedRule] = useState<ContextRule | null>(null)
  const [startTime] = useState(Date.now())

  // Initialize context tracking
  useEffect(() => {
    const initializeContext = () => {
      const userAgent = navigator.userAgent
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)

      const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop"

      const hour = new Date().getHours()
      const timeOfDay = hour < 6 ? "night" : hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"

      // Get stored context data
      const storedData = getStoredContext()

      const initialContext: UserContext = {
        timeOnPage: 0,
        scrollDepth: 0,
        pageViews: storedData.pageViews + 1,
        isReturningVisitor: storedData.pageViews > 0,
        previousPages: storedData.previousPages,
        sessionDuration: Date.now() - storedData.sessionStart,
        deviceType,
        timeOfDay,
        hasInteracted: false,
        abandonedCart: storedData.abandonedCart,
        highIntent: false,
        urgencyTrigger: false
      }

      setContext(initialContext)
      updateStoredContext(initialContext)
    }

    initializeContext()
  }, [])

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      setContext(prev => {
        if (!prev) return null

        const timeOnPage = (Date.now() - startTime) / 1000
        const updated = { ...prev, timeOnPage }

        // Check for high intent signals
        if (timeOnPage > 60 || prev.scrollDepth > 75) {
          updated.highIntent = true
        }

        // Check for urgency triggers
        if (timeOnPage > 120 && !prev.hasInteracted) {
          updated.urgencyTrigger = true
        }

        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100

      setContext(prev => {
        if (!prev) return null
        return {
          ...prev,
          scrollDepth: Math.max(prev.scrollDepth, scrollPercent),
          hasInteracted: true
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track user interactions
  useEffect(() => {
    const handleInteraction = () => {
      setContext(prev => {
        if (!prev) return null
        return { ...prev, hasInteracted: true }
      })
    }

    const events = ["click", "keydown", "mousemove", "touchstart"]
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction)
      })
    }
  }, [])

  // Evaluate rules when context changes
  useEffect(() => {
    if (!context) return

    // Sort rules by priority (higher priority first)
    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority)

    // Find first matching rule
    const matchingRule = sortedRules.find(rule => rule.condition(context))

    setSelectedRule(matchingRule || null)
    onContextChange?.(context, matchingRule || undefined)
  }, [context, rules, onContextChange])

  // Persist context data
  const getStoredContext = () => {
    if (typeof window === "undefined") {
      return { pageViews: 0, previousPages: [], sessionStart: Date.now(), abandonedCart: false }
    }

    const stored = localStorage.getItem("pgclosets_context")
    if (stored) {
      return JSON.parse(stored)
    }

    const newSession = {
      pageViews: 0,
      previousPages: [],
      sessionStart: Date.now(),
      abandonedCart: false
    }

    localStorage.setItem("pgclosets_context", JSON.stringify(newSession))
    return newSession
  }

  const updateStoredContext = (context: UserContext) => {
    if (typeof window === "undefined") return

    const currentUrl = window.location.pathname
    const stored = getStoredContext()

    const updated = {
      ...stored,
      pageViews: context.pageViews,
      previousPages: [...stored.previousPages.slice(-4), currentUrl].filter(Boolean),
      lastVisit: Date.now(),
      abandonedCart: context.abandonedCart
    }

    localStorage.setItem("pgclosets_context", JSON.stringify(updated))
  }

  if (!context) {
    return null // Loading state
  }

  const finalCTAProps = selectedRule
    ? { ...defaultCTA, ...selectedRule.ctaProps }
    : defaultCTA

  return (
    <div className={className} data-context-rule={selectedRule?.id || "default"}>
      <AdvancedCTA {...finalCTAProps} />

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-2 p-2 bg-gray-100 text-xs rounded">
          <div>Rule: {selectedRule?.name || "Default"}</div>
          <div>Time: {Math.round(context.timeOnPage)}s</div>
          <div>Scroll: {Math.round(context.scrollDepth)}%</div>
          <div>High Intent: {context.highIntent ? "Yes" : "No"}</div>
        </div>
      )}
    </div>
  )
}

// Predefined context rules
export const DefaultContextRules: ContextRule[] = [
  // High intent users
  {
    id: "high_intent_urgent",
    name: "High Intent - Urgent CTA",
    priority: 100,
    condition: (context) => context.highIntent && !context.hasInteracted,
    ctaProps: {
      variant: "urgent",
      text: "Book Now - Limited Availability",
      urgency: {
        enabled: true,
        slotsLeft: 3,
        type: "availability"
      },
      animation: "glow",
      size: "lg"
    }
  },

  // Cart abandonment recovery
  {
    id: "cart_abandonment",
    name: "Cart Abandonment Recovery",
    priority: 95,
    condition: (context) => context.abandonedCart,
    ctaProps: {
      variant: "urgent",
      text: "Complete Your Order - Don't Miss Out!",
      urgency: {
        enabled: true,
        type: "demand"
      },
      riskReduction: {
        enabled: true,
        moneyBack: "30-day money back guarantee"
      },
      animation: "pulse"
    }
  },

  // Returning visitors
  {
    id: "returning_visitor_value",
    name: "Returning Visitor - Value Focus",
    priority: 80,
    condition: (context) => context.isReturningVisitor && context.pageViews > 3,
    ctaProps: {
      variant: "quote",
      text: "Welcome Back - Special Consultation Offer",
      valueProposition: {
        enabled: true,
        benefit: "Exclusive returning customer pricing",
        freeOffer: "Free priority consultation"
      },
      personalization: {
        enabled: true
      }
    }
  },

  // Mobile users with high scroll depth
  {
    id: "mobile_engaged",
    name: "Mobile Engaged User",
    priority: 70,
    condition: (context) => context.deviceType === "mobile" && context.scrollDepth > 60,
    ctaProps: {
      variant: "primary",
      size: "lg",
      text: "Email Us Now",
      icon: "message",
      socialProof: {
        enabled: true,
        recentAction: "Average email response: 2 hours"
      }
    }
  },

  // Evening browsers
  {
    id: "evening_browser",
    name: "Evening Browser",
    priority: 60,
    condition: (context) => context.timeOfDay === "evening",
    ctaProps: {
      variant: "secondary",
      text: "Schedule Tomorrow's Consultation",
      icon: "calendar",
      valueProposition: {
        enabled: true,
        benefit: "Next-day appointment available"
      }
    }
  },

  // Long session users
  {
    id: "long_session",
    name: "Long Session User",
    priority: 50,
    condition: (context) => context.timeOnPage > 180,
    ctaProps: {
      variant: "premium",
      text: "Speak with Our Expert Team",
      socialProof: {
        enabled: true,
        count: 500,
        testimonial: "Exceptional service and quality! - Sarah M."
      },
      riskReduction: {
        enabled: true,
        warranty: "Lifetime warranty",
        noCommitment: true
      }
    }
  },

  // Quick browsers (urgency)
  {
    id: "quick_browser",
    name: "Quick Browser",
    priority: 40,
    condition: (context) => context.timeOnPage < 30 && context.scrollDepth < 25,
    ctaProps: {
      variant: "urgent",
      text: "Quick Quote - 2 Minutes",
      urgency: {
        enabled: true,
        timeLeft: "24 hours",
        type: "time"
      },
      size: "md"
    }
  },

  // First-time visitors
  {
    id: "first_time_visitor",
    name: "First-Time Visitor",
    priority: 30,
    condition: (context) => !context.isReturningVisitor,
    ctaProps: {
      variant: "primary",
      text: "Get Your Free Quote Today",
      socialProof: {
        enabled: true,
        count: 500,
        recentAction: "Join 500+ satisfied Ottawa homeowners"
      },
      valueProposition: {
        enabled: true,
        freeOffer: "Free measurement & consultation"
      }
    }
  }
]

// Page-specific rule sets
export const PageContextRules = {
  home: [
    ...DefaultContextRules,
    {
      id: "home_hero_engagement",
      name: "Home Hero Engagement",
      priority: 85,
      condition: (context: UserContext) => context.timeOnPage > 15 && context.scrollDepth < 30,
      ctaProps: {
        variant: "primary" as const,
        size: "xl" as const,
        text: "See What We Can Do For Your Home",
        animation: "shimmer" as const,
        valueProposition: {
          enabled: true,
          benefit: "Transform your space today"
        }
      }
    }
  ],

  product: [
    ...DefaultContextRules,
    {
      id: "product_detail_engagement",
      name: "Product Detail Engagement",
      priority: 85,
      condition: (context: UserContext) => context.timeOnPage > 45,
      ctaProps: {
        variant: "quote" as const,
        text: "Get This Door Installed",
        icon: "calendar" as const,
        valueProposition: {
          enabled: true,
          benefit: "Professional installation included"
        }
      }
    }
  ],

  cart: [
    {
      id: "cart_completion",
      name: "Cart Completion",
      priority: 100,
      condition: (context: UserContext) => context.timeOnPage > 30,
      ctaProps: {
        variant: "success" as const,
        text: "Complete Your Order Now",
        urgency: {
          enabled: true,
          type: "demand" as const
        },
        riskReduction: {
          enabled: true,
          moneyBack: "100% satisfaction guarantee"
        }
      }
    }
  ]
}

// Utility function to create context-aware CTA with page-specific rules
export function createContextAwareCTA(pageType: keyof typeof PageContextRules, defaultProps: Partial<AdvancedCTAProps>) {
  return function ContextualCTA(props: Partial<ContextAwareCTAProps>) {
    return (
      <ContextAwareCTA
        defaultCTA={defaultProps}
        rules={PageContextRules[pageType]}
        pageType={pageType}
        {...props}
      />
    )
  }
}