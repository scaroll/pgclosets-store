"use client"

import { useState, useEffect } from "react"
import { Instagram, Facebook, Youtube } from "lucide-react"
import { Button } from "@/ui/button"
import { Badge } from "@/ui/badge"

interface SocialPlatform {
  name: string
  username: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  count?: number
}

interface SocialFollowButtonsProps {
  platforms?: ("instagram" | "facebook" | "pinterest" | "tiktok" | "youtube" | "linkedin")[]
  showCount?: boolean
  layout?: "horizontal" | "vertical" | "compact" | "icons-only"
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

const platformData: Record<string, Omit<SocialPlatform, "count">> = {
  instagram: {
    name: "Instagram",
    username: "@pgclosets",
    url: "https://instagram.com/pgclosets",
    icon: Instagram,
    color: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600",
  },
  facebook: {
    name: "Facebook",
    username: "PG Closets",
    url: "https://facebook.com/pgclosets",
    icon: Facebook,
    color: "bg-[#1877F2]",
  },
  pinterest: {
    name: "Pinterest",
    username: "@pgclosets",
    url: "https://pinterest.com/pgclosets",
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
    color: "bg-[#E60023]",
  },
  tiktok: {
    name: "TikTok",
    username: "@pgclosets",
    url: "https://tiktok.com/@pgclosets",
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
    color: "bg-black",
  },
  youtube: {
    name: "YouTube",
    username: "PG Closets",
    url: "https://youtube.com/@pgclosets",
    icon: Youtube,
    color: "bg-[#FF0000]",
  },
  linkedin: {
    name: "LinkedIn",
    username: "PG Closets",
    url: "https://linkedin.com/company/pgclosets",
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "bg-[#0A66C2]",
  },
}

export function SocialFollowButtons({
  platforms = ["instagram", "facebook", "pinterest", "tiktok", "youtube"],
  showCount = false,
  layout = "horizontal",
  size = "md",
  animated = true,
}: SocialFollowButtonsProps) {
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(showCount)

  useEffect(() => {
    if (showCount) {
      fetchFollowerCounts()
    }
  }, [showCount, platforms])

  async function fetchFollowerCounts() {
    try {
      const response = await fetch("/api/social/follower-counts")
      if (response.ok) {
        const data = await response.json()
        setFollowerCounts(data.counts || {})
      }
    } catch (error) {
      console.error("Failed to fetch follower counts:", error)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: {
      button: "h-8 px-3 text-xs",
      icon: "h-3 w-3",
      iconOnly: "h-8 w-8",
    },
    md: {
      button: "h-10 px-4 text-sm",
      icon: "h-4 w-4",
      iconOnly: "h-10 w-10",
    },
    lg: {
      button: "h-12 px-6 text-base",
      icon: "h-5 w-5",
      iconOnly: "h-12 w-12",
    },
  }

  const layoutClasses = {
    horizontal: "flex flex-wrap gap-3",
    vertical: "flex flex-col gap-3",
    compact: "flex gap-2",
    "icons-only": "flex gap-2",
  }

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className={layoutClasses[layout]}>
      {platforms.map((platformKey) => {
        const platform = platformData[platformKey]
        if (!platform) return null

        const Icon = platform.icon
        const count = followerCounts[platformKey]
        const isIconOnly = layout === "icons-only"

        return (
          <Button
            key={platformKey}
            variant="default"
            size={size}
            asChild
            className={`
              ${platform.color}
              text-white
              border-0
              ${isIconOnly ? sizeClasses[size].iconOnly : sizeClasses[size].button}
              ${animated ? "transition-all hover:scale-105 hover:shadow-lg" : ""}
            `}
          >
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${platform.name}`}
              className="inline-flex items-center gap-2"
            >
              <Icon className={sizeClasses[size].icon} />
              {!isIconOnly && (
                <>
                  {layout !== "compact" && <span>{platform.name}</span>}
                  {showCount && count !== undefined && (
                    <Badge variant="secondary" className="ml-auto">
                      {loading ? "..." : formatCount(count)}
                    </Badge>
                  )}
                </>
              )}
            </a>
          </Button>
        )
      })}
    </div>
  )
}

// Floating social sidebar for sticky positioning
export function SocialFollowSidebar({
  platforms = ["instagram", "facebook", "pinterest"],
  position = "left",
}: {
  platforms?: ("instagram" | "facebook" | "pinterest" | "tiktok" | "youtube")[]
  position?: "left" | "right"
}) {
  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 ${
        position === "left" ? "left-0" : "right-0"
      } z-40 hidden lg:flex flex-col gap-2`}
    >
      {platforms.map((platformKey) => {
        const platform = platformData[platformKey]
        if (!platform) return null

        const Icon = platform.icon

        return (
          <a
            key={platformKey}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${platform.name}`}
            className={`
              ${platform.color}
              text-white
              p-3
              ${position === "left" ? "rounded-r-lg" : "rounded-l-lg"}
              shadow-lg
              hover:scale-110
              transition-transform
              group
            `}
          >
            <Icon className="h-5 w-5" />
            <span
              className={`
              absolute
              top-1/2
              -translate-y-1/2
              ${position === "left" ? "left-full ml-2" : "right-full mr-2"}
              bg-black/90
              text-white
              text-xs
              px-2
              py-1
              rounded
              opacity-0
              group-hover:opacity-100
              transition-opacity
              whitespace-nowrap
            `}
            >
              Follow on {platform.name}
            </span>
          </a>
        )
      })}
    </div>
  )
}

// Social proof stats component
export function SocialProofStats() {
  const [stats, setStats] = useState({
    totalFollowers: 0,
    totalEngagement: 0,
    avgRating: 0,
    reviewCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch("/api/social/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error("Failed to fetch social stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  const statItems = [
    {
      label: "Social Followers",
      value: stats.totalFollowers.toLocaleString(),
      icon: "👥",
    },
    {
      label: "Engagement Rate",
      value: `${stats.totalEngagement}%`,
      icon: "❤️",
    },
    {
      label: "Average Rating",
      value: `${stats.avgRating}/5`,
      icon: "⭐",
    },
    {
      label: "Happy Customers",
      value: stats.reviewCount.toLocaleString(),
      icon: "😊",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-card border rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
