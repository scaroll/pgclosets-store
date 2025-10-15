"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react"
import { Card } from "@/ui/card"
import { Button } from "@/ui/button"
import { Badge } from "@/ui/badge"

interface InstagramPost {
  id: string
  caption: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
  like_count: number
  comments_count: number
  username: string
}

interface InstagramFeedProps {
  username?: string
  limit?: number
  layout?: "grid" | "carousel" | "masonry"
  showCaption?: boolean
  showStats?: boolean
  showCTA?: boolean
}

export function InstagramFeed({
  username = "pgclosets",
  limit = 6,
  layout = "grid",
  showCaption = false,
  showStats = true,
  showCTA = true,
}: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInstagramFeed() {
      try {
        const response = await fetch(`/api/social/instagram/feed?limit=${limit}`)
        if (!response.ok) {
          throw new Error("Failed to fetch Instagram feed")
        }
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Instagram feed")
        console.error("Instagram feed error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInstagramFeed()
  }, [limit])

  if (loading) {
    return (
      <div className="w-full">
        <div
          className={`grid ${
            layout === "grid"
              ? "grid-cols-2 md:grid-cols-3 gap-4"
              : layout === "carousel"
              ? "grid-flow-col auto-cols-[300px] gap-4 overflow-x-auto"
              : "grid-cols-2 md:grid-cols-3 gap-4"
          }`}
        >
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <Instagram className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" asChild>
          <a
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />
            Visit @{username}
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Instagram className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">No Instagram posts found</p>
        <Button variant="outline" asChild>
          <a
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />
            Follow @{username}
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </Card>
    )
  }

  const layoutClasses = {
    grid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4",
    carousel: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory",
    masonry: "columns-2 md:columns-3 gap-4 space-y-4",
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 p-0.5">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
              <Instagram className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Follow Us on Instagram</h3>
            <a
              href={`https://instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              @{username}
            </a>
          </div>
        </div>
        {showCTA && (
          <Button variant="outline" size="sm" asChild>
            <a href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4 mr-2" />
              Follow
            </a>
          </Button>
        )}
      </div>

      {/* Feed Grid */}
      <div className={layoutClasses[layout]}>
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative block ${layout === "carousel" ? "flex-none w-[300px] snap-center" : ""} ${
              layout === "masonry" ? "break-inside-avoid" : ""
            }`}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={post.media_type === "VIDEO" ? post.thumbnail_url || post.media_url : post.media_url}
                alt={post.caption?.substring(0, 100) || "Instagram post"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Video indicator */}
              {post.media_type === "VIDEO" && (
                <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                  </svg>
                  Video
                </Badge>
              )}

              {/* Carousel indicator */}
              {post.media_type === "CAROUSEL_ALBUM" && (
                <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0">
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Album
                </Badge>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white space-y-2">
                  {showStats && (
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 fill-white" />
                        <span className="font-semibold">{post.like_count?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-semibold">{post.comments_count?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  )}
                  {showCaption && post.caption && (
                    <p className="text-xs text-center px-4 line-clamp-3">{post.caption}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Caption below image (optional) */}
            {showCaption && post.caption && layout !== "masonry" && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.caption}</p>
            )}
          </a>
        ))}
      </div>

      {/* View More CTA */}
      {showCTA && (
        <div className="text-center">
          <Button variant="outline" asChild>
            <a
              href={`https://instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              View More on Instagram
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

// Compact version for sidebars or small spaces
export function InstagramFeedCompact({ username = "pgclosets", limit = 4 }: { username?: string; limit?: number }) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeed() {
      try {
        const response = await fetch(`/api/social/instagram/feed?limit=${limit}`)
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [limit])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Instagram</h4>
        <a
          href={`https://instagram.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          @{username}
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {posts.slice(0, 4).map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square rounded overflow-hidden group"
          >
            <Image
              src={post.media_type === "VIDEO" ? post.thumbnail_url || post.media_url : post.media_url}
              alt="Instagram post"
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="150px"
            />
          </a>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full" asChild>
        <a href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer">
          <Instagram className="h-3 w-3 mr-2" />
          Follow Us
        </a>
      </Button>
    </div>
  )
}
