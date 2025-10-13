import Image from 'next/image'

interface ImagePlaceholderProps {
  width?: number
  height?: number
  text?: string
  className?: string
  alt?: string
}

export function ImagePlaceholder({
  width = 400,
  height = 400,
  text = 'No Image',
  className = '',
  alt,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative flex items-center justify-center bg-gray-100 ${className}`}
      style={{ width, height }}
    >
      <Image
        src={`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#9ca3af">${text}</text>
        </svg>`)}`}
        alt={alt || text}
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  )
}