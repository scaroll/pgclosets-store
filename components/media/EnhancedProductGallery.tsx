"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OptimizedImage } from "@/ui/optimized-image"
import { cn } from "@/lib/utils"

interface ProductImage {
  id: string
  url: string
  alt: string
  type: 'primary' | 'gallery' | 'technical' | 'lifestyle' | '360' | 'ar-model'
  order: number
  dimensions: { width: number; height: number }
  variants?: ImageVariant[]
}

interface ImageVariant {
  format: 'webp' | 'avif' | 'jpg' | 'png'
  size: 'thumbnail' | 'medium' | 'large' | 'xl'
  url: string
  width: number
  height: number
}

interface EnhancedProductGalleryProps {
  product: {
    id: string
    name: string
    category: string
  }
  images: ProductImage[]
  enableZoom?: boolean
  enable360?: boolean
  enableAR?: boolean
  showThumbnails?: boolean
  autoplay?: boolean
  className?: string
}

interface ZoomState {
  isZoomed: boolean
  level: number
  position: { x: number; y: number }
}

export function EnhancedProductGallery({
  product,
  images,
  enableZoom = true,
  enable360 = false,
  enableAR = false,
  showThumbnails = true,
  autoplay = false,
  className
}: EnhancedProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoomState, setZoomState] = useState<ZoomState>({
    isZoomed: false,
    level: 1,
    position: { x: 0, y: 0 }
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [is360Mode, setIs360Mode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const mainImageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentImage = images[currentImageIndex]
  const has360Images = images.some(img => img.type === '360')
  const hasARModel = images.some(img => img.type === 'ar-model')

  // Preload adjacent images for smooth navigation
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index < 0 || index >= images.length || loadedImages.has(index)) return

      const img = new Image()
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(index))
      }
      img.src = images[index].url
    }

    // Preload current and adjacent images
    preloadImage(currentImageIndex)
    preloadImage(currentImageIndex - 1)
    preloadImage(currentImageIndex + 1)
  }, [currentImageIndex, images, loadedImages])

  // Auto-rotation for 360° mode
  useEffect(() => {
    if (!is360Mode || !autoplay) return

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length)
    }, 150) // 6.67 FPS for smooth rotation

    return () => clearInterval(interval)
  }, [is360Mode, autoplay, images.length])

  const handleImageNavigation = useCallback((direction: 'prev' | 'next') => {
    if (is360Mode) return // Let auto-rotation handle this

    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % images.length
      } else {
        return prev === 0 ? images.length - 1 : prev - 1
      }
    })
  }, [images.length, is360Mode])

  const handleZoom = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || is360Mode) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setZoomState(prev => ({
      isZoomed: !prev.isZoomed,
      level: prev.isZoomed ? 1 : 2.5,
      position: { x, y }
    }))
  }, [enableZoom, is360Mode])

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomState.isZoomed) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setZoomState(prev => ({
      ...prev,
      position: { x, y }
    }))
  }, [zoomState.isZoomed])

  const toggle360Mode = useCallback(() => {
    setIs360Mode(prev => !prev)
    setZoomState({ isZoomed: false, level: 1, position: { x: 0, y: 0 } })
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            handleImageNavigation('prev')
            break
          case 'ArrowRight':
            event.preventDefault()
            handleImageNavigation('next')
            break
          case 'Escape':
            event.preventDefault()
            setIsFullscreen(false)
            break
          case ' ':
            event.preventDefault()
            setIs360Mode(prev => !prev)
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, handleImageNavigation])

  const MainImageViewer = () => (
    <div
      ref={mainImageRef}
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer group",
        enableZoom && "cursor-zoom-in",
        zoomState.isZoomed && "cursor-zoom-out",
        className
      )}
      onClick={handleZoom}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setZoomState(prev => ({ ...prev, isZoomed: false, level: 1 }))}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={currentImage?.url || "/placeholder.svg"}
            alt={currentImage?.alt || product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              zoomState.isZoomed && "scale-250"
            )}
            style={
              zoomState.isZoomed
                ? {
                    transformOrigin: `${zoomState.position.x}% ${zoomState.position.y}%`,
                  }
                : undefined
            }
            priority={currentImageIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {images.length > 1 && !is360Mode && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              handleImageNavigation('prev')
            }}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              handleImageNavigation('next')
            }}
          >
            <ChevronRightIcon />
          </Button>
        </>
      )}

      {/* Image counter */}
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
        {currentImageIndex + 1} / {images.length}
      </div>

      {/* Gallery controls */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        {has360Images && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              toggle360Mode()
            }}
            className={cn(is360Mode && "bg-primary text-primary-foreground")}
          >
            <Rotate3DIcon className="w-4 h-4" />
            {is360Mode ? "Exit 360°" : "360° View"}
          </Button>
        )}

        {enableAR && hasARModel && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Implement AR viewer
            }}
          >
            <CubeIcon className="w-4 h-4" />
            AR View
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            toggleFullscreen()
          }}
        >
          <ExpandIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* 360° mode indicator */}
      {is360Mode && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          <Rotate3DIcon className="w-4 h-4 animate-spin" />
          360° Mode
          {autoplay && <Badge variant="outline" className="text-xs">Auto</Badge>}
        </div>
      )}

      {/* Zoom indicator */}
      {enableZoom && !is360Mode && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <ZoomInIcon className="w-3 h-3" />
            Click to zoom
          </div>
        </div>
      )}
    </div>
  )

  const ThumbnailStrip = () => (
    showThumbnails && images.length > 1 && (
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all hover:border-primary/50",
              currentImageIndex === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-muted hover:border-muted-foreground/20"
            )}
          >
            <OptimizedImage
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="64px"
            />
            {image.type === '360' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Rotate3DIcon className="w-4 h-4 text-white" />
              </div>
            )}
            {loadedImages.has(index) && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    )
  )

  const FullscreenModal = () => (
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative w-full h-full max-w-7xl max-h-screen p-4">
            <div
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={currentImage?.url || "/placeholder.svg"}
                alt={currentImage?.alt || product.name}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setIsFullscreen(false)}
            >
              <XIcon />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={() => handleImageNavigation('prev')}
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => handleImageNavigation('next')}
                >
                  <ChevronRightIcon />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div ref={containerRef} className="space-y-4">
      <MainImageViewer />
      <ThumbnailStrip />
      <FullscreenModal />
    </div>
  )
}

// Icon components
const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const ZoomInIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
  </svg>
)

const Rotate3DIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const CubeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const ExpandIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
)

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)