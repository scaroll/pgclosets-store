"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ReninProduct } from "@/lib/renin-product-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, X, Play, Pause } from "lucide-react";

interface ProductGalleryProps {
  product: ReninProduct;
  selectedVariantId?: string;
}

export function ProductGallery({ product, selectedVariantId }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  // Get images for the product, prioritizing variant-specific images
  const getProductImages = () => {
    const productImages = product.images || [];

    // If a variant is selected and has an image, show it first
    if (selectedVariantId) {
      const variant = product.variants?.find(v => v.id === selectedVariantId);
      if (variant?.image) {
        const variantImage = { ...variant.image, position: 0 };
        const otherImages = productImages.filter(img => img.src !== variant.image?.src);
        return [variantImage, ...otherImages];
      }
    }

    return productImages;
  };

  const images = getProductImages();

  useEffect(() => {
    setImageLoadingStates(new Array(images.length).fill(true));
  }, [images.length]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setSelectedImageIndex(prev => (prev + 1) % images.length);
      }, 3000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, images.length]);

  const handleImageLoad = (index: number) => {
    setImageLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const handlePrevious = () => {
    setSelectedImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => (prev + 1) % images.length);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !zoomRef.current) return;

    const rect = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (!images.length) {
    return (
      <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-slate-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-light">No images available</p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedImageIndex];

  return (
    <div className="space-y-4">
      {/* Main image display */}
      <div className="relative group">
        <div
          ref={zoomRef}
          className={`relative aspect-square bg-slate-50 rounded-lg overflow-hidden cursor-${isZoomed ? 'zoom-out' : 'zoom-in'}`}
          onClick={handleZoomToggle}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomPosition({ x: 50, y: 50 })}
        >
          {/* Loading shimmer */}
          {imageLoadingStates[selectedImageIndex] && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
          )}

          {/* Main image */}
          <Image
            src={currentImage.src}
            alt={currentImage.alt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover transition-all duration-300 ${
              isZoomed
                ? 'scale-200 cursor-zoom-out'
                : 'group-hover:scale-105 cursor-zoom-in'
            } ${imageLoadingStates[selectedImageIndex] ? 'opacity-0' : 'opacity-100'}`}
            style={isZoomed ? {
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            } : {}}
            onLoad={() => handleImageLoad(selectedImageIndex)}
            priority={selectedImageIndex === 0}
          />

          {/* Zoom overlay */}
          {isZoomed && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                className="bg-white/90 hover:bg-white"
              >
                <X className="w-4 h-4 mr-2" />
                Close Zoom
              </Button>
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && !isZoomed && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Controls overlay */}
          {!isZoomed && (
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomToggle();
                }}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoPlay();
                  }}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              )}
            </div>
          )}

          {/* Image counter */}
          {images.length > 1 && !isZoomed && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm font-light">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                index === selectedImageIndex
                  ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              {/* Loading state for thumbnail */}
              {imageLoadingStates[index] && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
              )}

              <Image
                src={image.src}
                alt={image.alt || `${product.title} - Image ${index + 1}`}
                fill
                sizes="64px"
                className={`object-cover transition-opacity ${
                  imageLoadingStates[index] ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => handleImageLoad(index)}
              />

              {/* Active indicator */}
              {index === selectedImageIndex && (
                <div className="absolute inset-0 bg-slate-900/10" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {isAutoPlaying && images.length > 1 && (
        <div className="flex items-center justify-center gap-2 text-slate-600 text-sm font-light">
          <Play className="w-3 h-3" />
          <span>Auto-playing slideshow</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAutoPlay}
            className="h-auto p-1 text-xs underline"
          >
            Stop
          </Button>
        </div>
      )}
    </div>
  );
}