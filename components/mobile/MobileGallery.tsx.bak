'use client';

/**
 * Mobile-Optimized Gallery Component
 * Features swipe navigation, pinch-to-zoom, and touch-optimized controls
 *
 * @module components/mobile/MobileGallery
 * @agent Agent #15 - Mobile Experience & PWA
 */

import React, { useState, useRef, useCallback } from 'react';
import { OptimizedImage } from '../ui/optimized-image';
import { cn } from '@/lib/utils';
import { useGestures, HapticFeedback } from '@/lib/mobile/gestures';

export interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface MobileGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  className?: string;
  showThumbnails?: boolean;
  showCounter?: boolean;
  enableZoom?: boolean;
  onClose?: () => void;
}

export function MobileGallery({
  images,
  initialIndex = 0,
  className,
  showThumbnails = true,
  showCounter = true,
  enableZoom = true,
  onClose,
}: MobileGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Handle swipe to navigate between images
  const handleSwipe = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down', distance: number) => {
      if (isZoomed) return; // Don't swipe when zoomed

      if (direction === 'left' && currentIndex < images.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        HapticFeedback.trigger('light');
      } else if (direction === 'right' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        HapticFeedback.trigger('light');
      } else if (direction === 'down' && onClose) {
        // Swipe down to close
        if (distance > 100) {
          HapticFeedback.trigger('medium');
          onClose();
        }
      }
    },
    [currentIndex, images.length, isZoomed, onClose]
  );

  // Handle pinch-to-zoom
  const handlePinch = useCallback(
    (newScale: number, direction: 'in' | 'out') => {
      if (!enableZoom) return;

      const clampedScale = Math.max(1, Math.min(newScale * scale, 4));
      setScale(clampedScale);
      setIsZoomed(clampedScale > 1);

      if (clampedScale === 1) {
        setTranslateX(0);
        setTranslateY(0);
      }

      if (clampedScale > 1) {
        HapticFeedback.trigger('light');
      }
    },
    [scale, enableZoom]
  );

  // Handle double-tap to zoom
  const handleDoubleTap = useCallback(
    (point: { x: number; y: number }) => {
      if (!enableZoom) return;

      if (isZoomed) {
        // Reset zoom
        setScale(1);
        setTranslateX(0);
        setTranslateY(0);
        setIsZoomed(false);
      } else {
        // Zoom in to 2x
        setScale(2);
        setIsZoomed(true);

        // Calculate translate to center on tap point
        if (imageRef.current && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const relativeX = point.x - containerRect.left;
          const relativeY = point.y - containerRect.top;

          const centerX = containerRect.width / 2;
          const centerY = containerRect.height / 2;

          setTranslateX((centerX - relativeX) * 0.5);
          setTranslateY((centerY - relativeY) * 0.5);
        }
      }

      HapticFeedback.trigger('medium');
    },
    [isZoomed, enableZoom]
  );

  // Handle pan when zoomed
  const handlePan = useCallback(
    (delta: { x: number; y: number }) => {
      if (!isZoomed) return;

      setTranslateX((prev) => {
        const maxTranslate = (scale - 1) * 150;
        return Math.max(-maxTranslate, Math.min(maxTranslate, prev + delta.x * 0.5));
      });

      setTranslateY((prev) => {
        const maxTranslate = (scale - 1) * 150;
        return Math.max(-maxTranslate, Math.min(maxTranslate, prev + delta.y * 0.5));
      });
    },
    [isZoomed, scale]
  );

  // Setup gesture detection
  useGestures(
    imageRef,
    {
      onSwipe: handleSwipe,
      onPinch: handlePinch,
      onDoubleTap: handleDoubleTap,
      onPan: handlePan,
    },
    {
      swipeThreshold: 50,
      swipeVelocity: 0.3,
      enableHaptics: true,
    }
  );

  // Navigate to specific image
  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    setIsZoomed(false);
    HapticFeedback.trigger('light');
  };

  const currentImage = images[currentIndex];

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-50 bg-black flex flex-col touch-none',
        className
      )}
    >
      {/* Header with counter and close button */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        {showCounter && (
          <div className="text-white font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-lg bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close gallery"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Main image container */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={imageRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          <OptimizedImage
            src={currentImage.src}
            alt={currentImage.alt}
            width={currentImage.width || 1200}
            height={currentImage.height || 1200}
            className="max-w-full max-h-full object-contain"
            priority={currentIndex === initialIndex}
            sizes="100vw"
            quality={90}
            draggable={false}
          />
        </div>

        {/* Navigation arrows (only show when not zoomed) */}
        {!isZoomed && images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={() => goToImage(currentIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors min-w-[52px] min-h-[52px] flex items-center justify-center"
                aria-label="Previous image"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {currentIndex < images.length - 1 && (
              <button
                onClick={() => goToImage(currentIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors min-w-[52px] min-h-[52px] flex items-center justify-center"
                aria-label="Next image"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </>
        )}

        {/* Zoom indicator */}
        {enableZoom && isZoomed && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
            {Math.round(scale * 100)}%
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all snap-center',
                  currentIndex === index
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
                aria-label={`View image ${index + 1}`}
              >
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  sizes="64px"
                  quality={60}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gesture hint for first-time users */}
      {enableZoom && scale === 1 && currentIndex === initialIndex && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm text-center animate-fade-in pointer-events-none">
          Double tap to zoom • Pinch to zoom • Swipe to navigate
        </div>
      )}
    </div>
  );
}

/**
 * Utility component for triggering the gallery
 */
export interface GalleryTriggerProps {
  images: GalleryImage[];
  triggerIndex?: number;
  children: React.ReactNode;
  className?: string;
}

export function GalleryTrigger({
  images,
  triggerIndex = 0,
  children,
  className,
}: GalleryTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn('cursor-pointer', className)}
        type="button"
      >
        {children}
      </button>

      {isOpen && (
        <MobileGallery
          images={images}
          initialIndex={triggerIndex}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
