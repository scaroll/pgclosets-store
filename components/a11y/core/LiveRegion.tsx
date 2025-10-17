'use client'

import type { ReactNode} from 'react';
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Live Region Component
 * WCAG 2.1 AAA - ARIA Live Regions for Dynamic Content
 *
 * Announces dynamic content changes to screen readers
 */

type LiveRegionPoliteness = 'polite' | 'assertive' | 'off'
type LiveRegionRole = 'status' | 'alert' | 'log' | 'timer'

interface LiveRegionProps {
  children?: ReactNode
  politeness?: LiveRegionPoliteness
  role?: LiveRegionRole
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  clearAfter?: number
  className?: string
  visible?: boolean
}

export function LiveRegion({
  children,
  politeness = 'polite',
  role = 'status',
  atomic = true,
  relevant = 'text',
  clearAfter,
  className,
  visible = false
}: LiveRegionProps) {
  const [content, setContent] = useState(children)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (children) {
      setContent(children)

      if (clearAfter && clearAfter > 0) {
        // Clear previous timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        // Set new timeout to clear content
        timeoutRef.current = setTimeout(() => {
          setContent(null)
        }, clearAfter)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [children, clearAfter])

  return (
    <div
      role={role}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn(
        'live-region',
        {
          'sr-only': !visible,
          'p-4 rounded-md border': visible
        },
        className
      )}
    >
      {content}

      {!visible && (
        <style jsx>{`
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
        `}</style>
      )}
    </div>
  )
}

/**
 * Status Announcer Hook
 * Provides programmatic status announcements
 */
export function useStatusAnnouncer() {
  const [message, setMessage] = useState<string | null>(null)
  const [politeness, setPoliteness] = useState<LiveRegionPoliteness>('polite')

  const announce = (
    text: string,
    options: {
      politeness?: LiveRegionPoliteness
      clearAfter?: number
    } = {}
  ) => {
    const { politeness: p = 'polite', clearAfter = 1000 } = options

    setPoliteness(p)
    setMessage(text)

    if (clearAfter > 0) {
      setTimeout(() => {
        setMessage(null)
      }, clearAfter)
    }
  }

  const clear = () => {
    setMessage(null)
  }

  return {
    message,
    politeness,
    announce,
    clear,
    LiveRegion: () => (
      <LiveRegion politeness={politeness} clearAfter={0}>
        {message}
      </LiveRegion>
    )
  }
}

/**
 * Loading Announcer
 * Announces loading states to screen readers
 */
interface LoadingAnnouncerProps {
  loading: boolean
  loadingMessage?: string
  completeMessage?: string
  errorMessage?: string
  error?: boolean
}

export function LoadingAnnouncer({
  loading,
  loadingMessage = 'Loading...',
  completeMessage = 'Content loaded',
  errorMessage = 'Error loading content',
  error = false
}: LoadingAnnouncerProps) {
  const prevLoadingRef = useRef(loading)
  const [announcement, setAnnouncement] = useState<string | null>(null)

  useEffect(() => {
    // Loading started
    if (loading && !prevLoadingRef.current) {
      setAnnouncement(loadingMessage)
    }
    // Loading completed
    else if (!loading && prevLoadingRef.current) {
      if (error) {
        setAnnouncement(errorMessage)
      } else {
        setAnnouncement(completeMessage)
      }
    }

    prevLoadingRef.current = loading
  }, [loading, error, loadingMessage, completeMessage, errorMessage])

  return (
    <LiveRegion
      politeness={error ? 'assertive' : 'polite'}
      role={error ? 'alert' : 'status'}
      clearAfter={3000}
    >
      {announcement}
    </LiveRegion>
  )
}

/**
 * Route Announcer
 * Announces page navigation to screen readers
 */
interface RouteAnnouncerProps {
  route: string
  title?: string
}

export function RouteAnnouncer({ route, title }: RouteAnnouncerProps) {
  const prevRouteRef = useRef(route)
  const [announcement, setAnnouncement] = useState<string | null>(null)

  useEffect(() => {
    if (route !== prevRouteRef.current) {
      const message = title
        ? `Navigated to ${title}`
        : `Page changed to ${route}`

      setAnnouncement(message)
      prevRouteRef.current = route

      // Clear announcement after delay
      const timeout = setTimeout(() => {
        setAnnouncement(null)
      }, 2000)

      return () => clearTimeout(timeout)
    }
    return undefined
  }, [route, title])

  return (
    <LiveRegion politeness="assertive" role="status">
      {announcement}
    </LiveRegion>
  )
}

export default LiveRegion
