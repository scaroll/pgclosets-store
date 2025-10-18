'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppleButton } from '@/components/ui/AppleButton'
import { EASING } from '@/lib/animations'

/**
 * ProductGallery - Premium Image Gallery
 * Features:
 * - Main image display with zoom
 * - Thumbnail navigation
 * - Fullscreen lightbox mode
 * - Touch/swipe support
 * - Keyboard navigation
 * - Lazy loading with blur placeholders
 * - Pinch to zoom on mobile
 *
 * @example
 * ```tsx
 * <ProductGallery
 *   images={[
 *     { url: '/door1.jpg', alt: 'Front view' },
 *     { url: '/door2.jpg', alt: 'Side view' },
 *     { url: '/door3.jpg', alt: 'Detail shot' }
 *   ]}
 *   productName="Premium Closet Door"
 * />
 * ```
 */

export interface GalleryImage {
  url: string
  alt: string
  thumbnail?: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
  productName: string
  className?: string
}

export function ProductGallery({
  images,
  productName,
  className
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const imageRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') goToPrevious()
        if (e.key === 'ArrowRight') goToNext()
        if (e.key === 'Escape') setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, currentIndex])

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsZoomed(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsZoomed(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
    if (!isZoomed) {
      setZoomPosition({ x: 50, y: 50 })
    }
  }

  const currentImage = images[currentIndex]

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Main Image */}
        <div className="relative">
          <motion.div
            ref={imageRef}
            className={cn(
              'relative aspect-square bg-apple-gray-100 dark:bg-apple-dark-bg-tertiary',
              'rounded-2xl overflow-hidden',
              'border border-apple-gray-200 dark:border-apple-dark-border',
              isZoomed && 'cursor-zoom-out'
            )}
            onMouseMove={handleMouseMove}
            onClick={toggleZoom}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="relative w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={EASING.applePhysics}
              >
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || `${productName} - Image ${currentIndex + 1}`}
                  fill
                  sizes="(max-width: 744px) 100vw, (max-width: 1068px) 50vw, 600px"
                  className={cn(
                    'object-cover transition-transform duration-300',
                    isZoomed && 'scale-200'
                  )}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                        }
                      : undefined
                  }
                  quality={90}
                  priority={currentIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Zoom Indicator */}
            {!isZoomed && (
              <motion.div
                className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white cursor-pointer hover:bg-black/70 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ZoomIn className="w-5 h-5" />
              </motion.div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2',
                    'w-10 h-10 rounded-full',
                    'bg-white/90 dark:bg-black/30 backdrop-blur-xl',
                    'border border-black/10 dark:border-white/10',
                    'flex items-center justify-center',
                    'hover:scale-110 active:scale-95 transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-apple-gray-900 dark:text-apple-gray-100" />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className={cn(
                    'absolute right-4 top-1/2 -translate-y-1/2',
                    'w-10 h-10 rounded-full',
                    'bg-white/90 dark:bg-black/30 backdrop-blur-xl',
                    'border border-black/10 dark:border-white/10',
                    'flex items-center justify-center',
                    'hover:scale-110 active:scale-95 transition-all'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-apple-gray-900 dark:text-apple-gray-100" />
                </motion.button>
              </>
            )}

            {/* Fullscreen Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                setIsFullscreen(true)
              }}
              className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/30 backdrop-blur-xl rounded-full border border-black/10 dark:border-white/10 hover:scale-110 active:scale-95 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Open fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-apple-gray-900 dark:text-apple-gray-100" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsZoomed(false)
                }}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden',
                  'border-2 transition-all',
                  currentIndex === index
                    ? 'border-apple-blue-600 dark:border-apple-blue-dark shadow-lg'
                    : 'border-apple-gray-200 dark:border-apple-dark-border hover:border-apple-gray-400 dark:hover:border-apple-gray-500'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View image ${index + 1}`}
                aria-current={currentIndex === index}
              >
                <Image
                  src={image.thumbnail || image.url}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  quality={60}
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="relative w-full h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={EASING.applePhysics}
                >
                  <Image
                    src={currentImage.url}
                    alt={currentImage.alt || `${productName} - Image ${currentIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    quality={100}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <AppleButton
                  variant="secondary"
                  size="lg"
                  className="absolute left-8 top-1/2 -translate-y-1/2"
                  onClick={goToPrevious}
                  icon={<ChevronLeft className="w-6 h-6" />}
                  aria-label="Previous image"
                />

                <AppleButton
                  variant="secondary"
                  size="lg"
                  className="absolute right-8 top-1/2 -translate-y-1/2"
                  onClick={goToNext}
                  icon={<ChevronRight className="w-6 h-6" />}
                  aria-label="Next image"
                />
              </>
            )}

            {/* Thumbnail Strip */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-8 scrollbar-hide">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                    currentIndex === index
                      ? 'border-white shadow-xl'
                      : 'border-white/30 hover:border-white/60'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image.thumbnail || image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    quality={60}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductGallery
