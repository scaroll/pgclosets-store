'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Screen Reader Status Component
 * WCAG 2.1 AAA - Status Messages (4.1.3)
 *
 * Announces status updates to screen readers
 */

interface SRStatusProps {
  message: string | null
  politeness?: 'polite' | 'assertive'
  clearAfter?: number
  role?: 'status' | 'alert'
}

export function SRStatus({
  message,
  politeness = 'polite',
  clearAfter = 3000,
  role = 'status'
}: SRStatusProps) {
  const [displayMessage, setDisplayMessage] = useState(message)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (message) {
      setDisplayMessage(message)

      if (clearAfter > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          setDisplayMessage(null)
        }, clearAfter)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [message, clearAfter])

  return (
    <div
      role={role}
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {displayMessage}
    </div>
  )
}

export default SRStatus
