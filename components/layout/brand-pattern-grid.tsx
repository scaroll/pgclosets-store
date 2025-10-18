import { cn } from "@/lib/utils"

interface BrandPatternGridProps {
  className?: string
}

export function BrandPatternGrid({ className }: BrandPatternGridProps) {
  return (
    <div className={cn("pointer-events-none select-none", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="brand-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3" />
            <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.2" />
            <rect x="0" y="0" width="1" height="20" fill="currentColor" opacity="0.1" />
            <rect x="0" y="0" width="20" height="1" fill="currentColor" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brand-grid)" />
      </svg>
    </div>
  )
}

export default BrandPatternGrid
