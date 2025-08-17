import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  onError?: () => void
}

export function ImagePlaceholder({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  priority = false,
  fill = false,
  sizes,
  onError
}: ImagePlaceholderProps) {
  // Default placeholder SVG that looks like a JPG file icon
  const placeholderSrc = `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="200" height="240" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Document background -->
      <rect x="20" y="20" width="140" height="180" rx="8" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="2"/>
      <!-- Folded corner -->
      <path d="M140 20 L160 40 L140 40 Z" fill="#E5E7EB"/>
      <line x1="140" y1="20" x2="140" y2="40" stroke="#D1D5DB" stroke-width="2"/>
      <line x1="140" y1="40" x2="160" y2="40" stroke="#D1D5DB" stroke-width="2"/>
      
      <!-- Image icon -->
      <rect x="40" y="60" width="100" height="70" rx="4" fill="#E5E7EB" stroke="#9CA3AF"/>
      <circle cx="60" cy="80" r="8" fill="#9CA3AF"/>
      <path d="M50 110 L70 95 L90 105 L130 85 L130 120 L50 120 Z" fill="#9CA3AF"/>
      
      <!-- JPG text -->
      <text x="100" y="165" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" 
            font-size="24" font-weight="600" fill="#9CA3AF">JPG</text>
      
      <!-- File name area -->
      <rect x="40" y="175" width="100" height="2" fill="#D1D5DB"/>
    </svg>
  `).toString('base64')}`

  if (!src) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg", className)}>
        <Image
          src={placeholderSrc}
          alt={alt}
          width={width}
          height={height}
          className="opacity-60"
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={onError}
    />
  )
}