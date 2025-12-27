import { cn } from '@/lib/utils'
import React from 'react'

interface ImagePlaceholderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number
  height?: number
}

export function ImagePlaceholder({
  className,
  alt = 'Placeholder',
  width = 300,
  height = 200,
  ...props
}: ImagePlaceholderProps) {
  // Use a simple SVG placeholder data URI or standard placeholder service
  const placeholderSrc = `data:image/svg+xml;charset=UTF-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23666666'%3E${encodeURIComponent(alt)}%3C/text%3E%3C/svg%3E`

  return (
    <div className={cn('overflow-hidden bg-muted', className)}>
      <img
        src={placeholderSrc}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover"
        {...props}
      />
    </div>
  )
}
