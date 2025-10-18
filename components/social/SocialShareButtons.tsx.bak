"use client"

import { useState } from "react"
import { Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, Check, MessageCircle } from "lucide-react"
import { Button } from "@/ui/button"
import { toast } from "sonner"

interface SocialShareButtonsProps {
  url?: string
  title?: string
  description?: string
  image?: string
  hashtags?: string[]
  layout?: "horizontal" | "vertical" | "compact"
  showLabels?: boolean
  showCount?: boolean
}

export function SocialShareButtons({
  url,
  title = "Check out this product from PG Closets",
  description = "Premium barn doors and closet solutions in Ottawa",
  image,
  hashtags = ["PGClosets", "BarnDoors", "InteriorDesign"],
  layout = "horizontal",
  showLabels = true,
  showCount = false,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [shareCount, setShareCount] = useState<Record<string, number>>({})

  // Use current URL if not provided
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)
  const hashtagString = hashtags.join(",")

  const handleShare = async (platform: string, shareUrlTemplate: string) => {
    // Track share event
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "social_share",
            properties: {
              platform,
              url: shareUrl,
              title,
            },
          }),
        })

        // Increment local share count
        setShareCount((prev) => ({
          ...prev,
          [platform]: (prev[platform] || 0) + 1,
        }))
      } catch (error) {
        console.error("Failed to track share:", error)
      }
    }

    // Open share window
    if (platform !== "copy") {
      window.open(shareUrlTemplate, "_blank", "width=600,height=400")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      handleShare("copy", "")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const shareButtons = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#1864D9]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      ariaLabel: "Share on Facebook",
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1A8CD8]",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
      ariaLabel: "Share on Twitter",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2] hover:bg-[#095196]",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      ariaLabel: "Share on LinkedIn",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366] hover:bg-[#1EBE55]",
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      ariaLabel: "Share on WhatsApp",
    },
    {
      name: "Pinterest",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
      color: "bg-[#E60023] hover:bg-[#BD081C]",
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(
        image || ""
      )}&description=${encodedDescription}`,
      ariaLabel: "Share on Pinterest",
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      ariaLabel: "Share via Email",
    },
  ]

  const layoutClasses = {
    horizontal: "flex flex-wrap gap-2",
    vertical: "flex flex-col gap-2",
    compact: "flex gap-1",
  }

  const buttonSizes = {
    horizontal: layout === "compact" ? "h-8 w-8" : "h-10",
    vertical: "h-10 w-full",
    compact: "h-7 w-7",
  }

  return (
    <div className="space-y-3">
      <div className={layoutClasses[layout]}>
        {shareButtons.map((button) => (
          <Button
            key={button.name}
            variant="default"
            size={layout === "compact" ? "sm" : "default"}
            className={`${button.color} text-white border-0 ${
              layout === "horizontal"
                ? showLabels
                  ? "px-4"
                  : buttonSizes[layout]
                : layout === "vertical"
                ? "w-full justify-start"
                : buttonSizes[layout]
            }`}
            onClick={() => handleShare(button.name.toLowerCase(), button.url)}
            aria-label={button.ariaLabel}
          >
            <button.icon className={showLabels && layout !== "compact" ? "h-4 w-4 mr-2" : "h-4 w-4"} />
            {showLabels && layout !== "compact" && <span>{button.name}</span>}
            {showCount && shareCount[button.name.toLowerCase()] > 0 && (
              <span className="ml-2 text-xs opacity-75">({shareCount[button.name.toLowerCase()]})</span>
            )}
          </Button>
        ))}

        {/* Copy Link Button */}
        <Button
          variant="outline"
          size={layout === "compact" ? "sm" : "default"}
          className={
            layout === "horizontal"
              ? showLabels
                ? "px-4"
                : buttonSizes[layout]
              : layout === "vertical"
              ? "w-full justify-start"
              : buttonSizes[layout]
          }
          onClick={copyToClipboard}
          aria-label="Copy link to clipboard"
        >
          {copied ? (
            <>
              <Check className={showLabels && layout !== "compact" ? "h-4 w-4 mr-2" : "h-4 w-4"} />
              {showLabels && layout !== "compact" && <span>Copied!</span>}
            </>
          ) : (
            <>
              <LinkIcon className={showLabels && layout !== "compact" ? "h-4 w-4 mr-2" : "h-4 w-4"} />
              {showLabels && layout !== "compact" && <span>Copy Link</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Native Web Share API component (mobile-optimized)
export function NativeShareButton({
  url,
  title = "Check out this product from PG Closets",
  description,
}: {
  url?: string
  title?: string
  description?: string
}) {
  const [canShare, setCanShare] = useState(false)

  useState(() => {
    if (typeof window !== "undefined" && navigator.share) {
      setCanShare(true)
    }
  }, [])

  const handleNativeShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")

    try {
      await navigator.share({
        title,
        text: description,
        url: shareUrl,
      })

      // Track share event
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "social_share",
          properties: {
            platform: "native_share",
            url: shareUrl,
            title,
          },
        }),
      })

      toast.success("Shared successfully!")
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error)
        toast.error("Failed to share")
      }
    }
  }

  if (!canShare) return null

  return (
    <Button variant="outline" onClick={handleNativeShare} className="w-full">
      <svg
        className="h-4 w-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      Share
    </Button>
  )
}

// Social Share Count Display (aggregated)
export function SocialShareCount({ url, showBreakdown = false }: { url?: string; showBreakdown?: boolean }) {
  const [totalShares, setTotalShares] = useState<number>(0)
  const [breakdown, setBreakdown] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useState(() => {
    async function fetchShareCounts() {
      const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
      try {
        const response = await fetch(`/api/social/share-counts?url=${encodeURIComponent(shareUrl)}`)
        if (response.ok) {
          const data = await response.json()
          setTotalShares(data.total || 0)
          setBreakdown(data.breakdown || {})
        }
      } catch (error) {
        console.error("Failed to fetch share counts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShareCounts()
  }, [url])

  if (loading) {
    return <div className="h-6 w-20 bg-muted animate-pulse rounded" />
  }

  if (totalShares === 0) return null

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">
        {totalShares.toLocaleString()} {totalShares === 1 ? "Share" : "Shares"}
      </div>
      {showBreakdown && Object.keys(breakdown).length > 0 && (
        <div className="text-xs text-muted-foreground space-y-1">
          {Object.entries(breakdown).map(([platform, count]) => (
            <div key={platform} className="flex justify-between">
              <span className="capitalize">{platform}:</span>
              <span>{count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
