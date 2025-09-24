import { useState } from "react"

interface PGLogoProps {
  width?: number
  height?: number
  className?: string
  withWordmark?: boolean
}

// Renders a local brand image if present at /brand/pg-logo.png,
// otherwise falls back to an inline SVG mark.
export function PGLogo({ width = 140, height = 28, className = "", withWordmark = true }: PGLogoProps) {
  const [error, setError] = useState(false)

  if (!error) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/brand/pg-logo.png"
        width={width}
        height={height}
        alt="PG Closets"
        className={className}
        onError={() => setError(true)}
      />
    )
  }

  return (
    <svg
      viewBox="0 0 140 28"
      width={width}
      height={height}
      className={className}
      aria-label="PG Closets"
      role="img"
    >
      <defs>
        <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="28" height="28" rx="6" fill="url(#pgGrad)" />
      <text x="14" y="19" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="700" fill="#fff">
        PG
      </text>
      {withWordmark && (
        <text x="36" y="19" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="300" fill="#0f172a" letterSpacing="1">
          PG CLOSETS
        </text>
      )}
    </svg>
  )
}
