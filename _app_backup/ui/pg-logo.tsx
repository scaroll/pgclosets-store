import Image from "next/image"

interface PGLogoProps {
  width?: number
  height?: number
  className?: string
}

export function PGLogo({ width = 140, height = 28, className = "" }: PGLogoProps) {
  return (
    <Image
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-gWRuAb9DtmSyz78O9t7mEx53f8WrUG.jpeg"
      alt="PG Closets"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}
