"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, X, Play, Volume2, VolumeX } from "lucide-react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface MediaItem {
  id: string
  type: 'image' | 'video' | '360view' | 'ar_model'
  url: string
  thumbnail?: string
  alt: string
  caption?: string
  metadata?: {
    dimensions?: { width: number; height: number }
    fileSize?: number
    format?: string
  }
}

export interface GalleryConfig {
  enableZoom: boolean
  enableFullscreen: boolean
  enable360View: boolean
  enableArView: boolean
  autoplay: boolean
  thumbnailCount: number
}

interface EnhancedProductGalleryProps {
  media: MediaItem[]
  productName: string
  config?: Partial<GalleryConfig>
  onMediaChange?: (index: number) => void
  className?: string
}

const defaultConfig: GalleryConfig = {
  enableZoom: true,
  enableFullscreen: true,
  enable360View: true,
  enableArView: true,
  autoplay: false,
  thumbnailCount: 6
}

export function EnhancedProductGallery({
  media,
  productName,
  config: userConfig = {},
  onMediaChange,
  className
}: EnhancedProductGalleryProps) {
  const config = { ...defaultConfig, ...userConfig }
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const mainImageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentMedia = media[currentIndex] || media[0]

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? media.length - 1 : prev - 1))
    setIsZoomed(false)
    setZoomLevel(1)
  }, [media.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev === media.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
    setZoomLevel(1)
  }, [media.length])

  const handleMediaChange = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsZoomed(false)
    setZoomLevel(1)
    onMediaChange?.(index)
  }, [onMediaChange])

  const handleZoomIn = useCallback(() => {
    if (!config.enableZoom) return
    setZoomLevel(prev => Math.min(prev * 1.5, 4))
    setIsZoomed(true)
  }, [config.enableZoom])

  const handleZoomOut = useCallback(() => {
    if (!config.enableZoom) return
    setZoomLevel(prev => {
      const newLevel = prev / 1.5
      if (newLevel <= 1) {
        setIsZoomed(false)
        return 1
      }
      return newLevel
    })
  }, [config.enableZoom])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isZoomed || !mainImageRef.current) return

    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }, [isZoomed])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return

    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y

    // Horizontal swipe detection
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }

    setTouchStart(null)
  }, [touchStart, goToNext, goToPrevious])

  const handleDoubleClick = useCallback(() => {
    if (!config.enableZoom) return
    if (isZoomed) {
      setIsZoomed(false)
      setZoomLevel(1)
    } else {
      setZoomLevel(2.5)
      setIsZoomed(true)
    }
  }, [config.enableZoom, isZoomed])

  const toggleFullscreen = useCallback(() => {
    if (!config.enableFullscreen) return
    setIsFullscreen(prev => !prev)
  }, [config.enableFullscreen])

  const handleVideoToggle = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false)
        if (isZoomed) {
          setIsZoomed(false)
          setZoomLevel(1)
        }
      }
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, isFullscreen, isZoomed, handleZoomIn, handleZoomOut, toggleFullscreen])

  const renderMainMedia = () => {
    const commonProps = {
      className: cn(
        "w-full h-full object-cover transition-transform duration-300 cursor-zoom-in",
        isZoomed && "cursor-zoom-out"
      ),
      style: isZoomed ? {
        transform: `scale(${zoomLevel})`,
        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
      } : {},
      onDoubleClick: handleDoubleClick,
      onMouseMove: handleMouseMove,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    }

    switch (currentMedia?.type) {
      case 'video':
        return (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={currentMedia.url}
              className="w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex gap-2 pointer-events-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleVideoToggle}
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  <Play className={cn("w-4 h-4", isPlaying && "hidden")} />
                  {isPlaying && "Pause"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleMute}
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        )

      case '360view':
        return (
          <div className="relative w-full h-full">
            <OptimizedImage
              src={currentMedia.url}
              alt={currentMedia.alt}
              fill
              {...commonProps}
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
              360° View - Drag to rotate
            </div>
          </div>
        )

      default:
        return (
          <OptimizedImage
            src={currentMedia?.url || '/placeholder.svg'}
            alt={currentMedia?.alt || productName}
            fill
            {...commonProps}
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
            priority={currentIndex === 0}
          />
        )
    }
  }

  const FullscreenModal = () => (
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <div className="relative w-full h-full max-w-7xl max-h-screen p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>

            <div className="w-full h-full relative" onClick={(e) => e.stopPropagation()}>
              {renderMainMedia()}
            </div>

            {/* Fullscreen Navigation */}
            {media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Media Display */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
          <div ref={mainImageRef} className="w-full h-full relative">
            {renderMainMedia()}
          </div>

          {/* Media Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute top-4 right-4 flex gap-2">
              {config.enableZoom && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleZoomIn}
                    className="bg-white/90 hover:bg-white"
                    disabled={zoomLevel >= 4}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleZoomOut}
                    className="bg-white/90 hover:bg-white"
                    disabled={zoomLevel <= 1}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </>
              )}

              {config.enableFullscreen && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="bg-white/90 hover:bg-white"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Media Counter */}
          {media.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {currentIndex + 1} / {media.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {media.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {media.slice(0, config.thumbnailCount).map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleMediaChange(index)}
                className={cn(
                  "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                  currentIndex === index
                    ? "border-pg-sky shadow-lg ring-2 ring-pg-sky/20"
                    : "border-transparent hover:border-gray-300"
                )}
                aria-label={`View ${item.alt || `image ${index + 1}`}`}
              >
                <OptimizedImage
                  src={item.thumbnail || item.url}
                  alt={item.alt || `${productName} view ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  sizes="80px"
                  quality={80}
                />

                {/* Media Type Indicator */}
                {item.type !== 'image' && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {item.type === 'video' && <Play className="w-4 h-4 text-white" />}
                    {item.type === '360view' && <span className="text-white text-xs font-bold">360°</span>}
                  </div>
                )}
              </button>
            ))}

            {media.length > config.thumbnailCount && (
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-xs">
                +{media.length - config.thumbnailCount}
              </div>
            )}
          </div>
        )}

        {/* Media Caption */}
        {currentMedia?.caption && (
          <p className="text-sm text-gray-600 text-center italic">
            {currentMedia.caption}
          </p>
        )}
      </div>

      <FullscreenModal />
    </>
  )
}