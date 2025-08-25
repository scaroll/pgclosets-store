'use client'

interface PGLogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export function PGLogo({ className = '', size = 32, showText = true }: PGLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* PG Logo Icon */}
      <div 
        className="flex items-center justify-center rounded-md overflow-hidden"
        style={{ width: size, height: size }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 400 400" 
          className="w-full h-full"
          aria-label="PG Closets Logo"
        >
          {/* Navy background */}
          <rect width="400" height="400" fill="#3d4a7c"/>
          
          {/* House roof in sky blue */}
          <path 
            d="M80 180 L200 100 L320 180 L300 170 L200 120 L100 170 Z" 
            fill="#a8d0f0" 
          />
          
          {/* PG Letters in sky blue */}
          <g fill="#a8d0f0">
            {/* P Letter */}
            <path d="M120 180 L120 320 L160 320 L160 260 L220 260 C250 260 270 240 270 210 C270 180 250 160 220 160 L120 160 Z M160 200 L220 200 C230 200 235 205 235 210 C235 215 230 220 220 220 L160 220 Z"/>
            
            {/* G Letter */}
            <path d="M290 240 C290 285 255 320 210 320 C165 320 130 285 130 240 C130 195 165 160 210 160 C235 160 255 175 265 195 L230 210 C225 200 218 195 210 195 C185 195 170 215 170 240 C170 265 185 285 210 285 C230 285 245 275 250 260 L210 260 L210 230 L290 230 Z"/>
          </g>
        </svg>
      </div>
      
      {/* Company Text */}
      {showText && (
        <span className="font-extrabold text-pg-navy text-xl lg:text-2xl">
          PG Closets
        </span>
      )}
    </div>
  )
}