"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Maximize2,
  Grid3X3,
  Eye,
  Ruler,
  Star,
  Facebook,
  Twitter,
  Mail,
  Link,
  Play,
  Pause,
  RotateCw
} from 'lucide-react';
import type {
  GalleryImage,
  GalleryView,
  TechnicalSpec,
  RelatedProduct,
  LightboxState,
  GalleryConfig,
  ShareOptions,
  ZoomState,
  ViewportDimensions
} from '@/types/gallery';

interface ReninProductGalleryProps {
  productId: string;
  productName: string;
  images: GalleryImage[];
  views?: GalleryView[];
  technicalSpecs?: TechnicalSpec[];
  relatedProducts?: RelatedProduct[];
  config?: Partial<GalleryConfig>;
  className?: string;
}

export default function ReninProductGallery({
  productId,
  productName,
  images,
  views = [],
  technicalSpecs = [],
  relatedProducts = [],
  config = {},
  className = ''
}: ReninProductGalleryProps) {
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    currentImageIndex: 0,
    images,
    showSpecs: false,
    zoomLevel: 1,
    panPosition: { x: 0, y: 0 }
  });

  const [selectedView, setSelectedView] = useState<string>(views[0]?.id || 'all');
  const [autoPlay, setAutoPlay] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedImageForShare, setSelectedImageForShare] = useState<GalleryImage | null>(null);

  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    x: 0,
    y: 0,
    isDragging: false
  });

  const [viewport, setViewport] = useState<ViewportDimensions>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  const lightboxRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const galleryConfig: GalleryConfig = {
    showThumbnails: true,
    autoPlay: false,
    autoPlayInterval: 3000,
    enableZoom: true,
    maxZoom: 3,
    showSpecs: true,
    enableDownload: true,
    enableShare: true,
    relatedProductsCount: 4,
    ...config
  };

  // Update viewport dimensions
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && lightbox.isOpen && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setLightbox(prev => ({
          ...prev,
          currentImageIndex: (prev.currentImageIndex + 1) % images.length
        }));
      }, galleryConfig.autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, lightbox.isOpen, images.length, galleryConfig.autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.isOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          previousImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen]);

  const filteredImages = selectedView === 'all'
    ? images
    : views.find(v => v.id === selectedView)?.images || images;

  const openLightbox = useCallback((imageIndex: number) => {
    setLightbox({
      isOpen: true,
      currentImageIndex: imageIndex,
      images: filteredImages,
      showSpecs: false,
      zoomLevel: 1,
      panPosition: { x: 0, y: 0 }
    });
    setZoom({ scale: 1, x: 0, y: 0, isDragging: false });
  }, [filteredImages]);

  const closeLightbox = useCallback(() => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
    setZoom({ scale: 1, x: 0, y: 0, isDragging: false });
    setAutoPlay(false);
  }, []);

  const previousImage = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      currentImageIndex: prev.currentImageIndex === 0
        ? prev.images.length - 1
        : prev.currentImageIndex - 1
    }));
    resetZoom();
  }, []);

  const nextImage = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      currentImageIndex: (prev.currentImageIndex + 1) % prev.images.length
    }));
    resetZoom();
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, galleryConfig.maxZoom)
    }));
  }, [galleryConfig.maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 1)
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom({ scale: 1, x: 0, y: 0, isDragging: false });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom.scale > 1) {
      dragStart.current = { x: e.clientX - zoom.x, y: e.clientY - zoom.y };
      setZoom(prev => ({ ...prev, isDragging: true }));
    }
  }, [zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (zoom.isDragging && dragStart.current) {
      setZoom(prev => ({
        ...prev,
        x: e.clientX - dragStart.current!.x,
        y: e.clientY - dragStart.current!.y
      }));
    }
  }, [zoom.isDragging]);

  const handleMouseUp = useCallback(() => {
    setZoom(prev => ({ ...prev, isDragging: false }));
    dragStart.current = null;
  }, []);

  const downloadImage = useCallback((image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = image.highRes;
    link.download = `${productName}-${image.alt}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [productName]);

  const shareImage = useCallback((platform: ShareOptions['platform'], image: GalleryImage) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this ${productName} image`;

    const shareActions: Record<ShareOptions['platform'], () => void> = {
      email: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`;
      },
      facebook: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
      },
      twitter: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
      },
      pinterest: () => {
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(image.src)}&description=${encodeURIComponent(shareText)}`);
      },
      whatsapp: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`);
      },
      'copy-link': () => {
        navigator.clipboard.writeText(shareUrl);
      }
    };

    shareActions[platform]?.();
    setShareDialogOpen(false);
  }, [productName]);

  const currentImage = lightbox.images[lightbox.currentImageIndex];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* View Selector */}
      {views.length > 0 && (
        <Tabs value={selectedView} onValueChange={setSelectedView}>
          <TabsList className="grid w-full grid-cols-auto">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              All Views
            </TabsTrigger>
            {views.map((view) => (
              <TabsTrigger key={view.id} value={view.id} className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {view.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Main Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {filteredImages.map((image, index) => (
          <Card key={image.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all">
            <div className="relative aspect-square">
              <Image
                src={image.thumbnail}
                alt={image.alt}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                onClick={() => openLightbox(index)}
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  {galleryConfig.enableDownload && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  {galleryConfig.enableShare && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageForShare(image);
                        setShareDialogOpen(true);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Image Info */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}

              {/* File Size Badge */}
              {image.fileSize && (
                <Badge className="absolute top-2 right-2">
                  {(image.fileSize / 1024 / 1024).toFixed(1)}MB
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Technical Specifications */}
      {technicalSpecs.length > 0 && galleryConfig.showSpecs && (
        <Card className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <Ruler className="w-4 h-4 md:w-5 md:h-5" />
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {technicalSpecs.map((category, index) => (
              <div key={index}>
                <h4 className="font-medium text-lg mb-3">{category.category}</h4>
                <div className="space-y-2">
                  {category.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{spec.label}:</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <Card className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Related Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {relatedProducts.slice(0, galleryConfig.relatedProductsCount).map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-all">
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1 group-hover:text-pg-navy transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                  {product.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">{product.rating}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Lightbox */}
      <Dialog open={lightbox.isOpen} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full bg-black">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center justify-between p-4">
                <div className="text-white">
                  <h3 className="font-semibold">{currentImage?.alt}</h3>
                  <p className="text-sm opacity-75">
                    {lightbox.currentImageIndex + 1} of {lightbox.images.length}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Auto-play toggle */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setAutoPlay(!autoPlay)}
                    className="text-white hover:bg-white/20"
                  >
                    {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>

                  {/* Zoom controls */}
                  {galleryConfig.enableZoom && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={zoomOut}
                        disabled={zoom.scale <= 1}
                        className="text-white hover:bg-white/20"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-white text-sm px-2">
                        {Math.round(zoom.scale * 100)}%
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={zoomIn}
                        disabled={zoom.scale >= galleryConfig.maxZoom}
                        className="text-white hover:bg-white/20"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetZoom}
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {/* Download */}
                  {galleryConfig.enableDownload && currentImage && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadImage(currentImage)}
                      className="text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Share */}
                  {galleryConfig.enableShare && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedImageForShare(currentImage);
                        setShareDialogOpen(true);
                      }}
                      className="text-white hover:bg-white/20"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Specs toggle */}
                  {technicalSpecs.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setLightbox(prev => ({ ...prev, showSpecs: !prev.showSpecs }))}
                      className="text-white hover:bg-white/20"
                    >
                      <Ruler className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={closeLightbox}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div
              className="w-full h-full flex items-center justify-center cursor-move"
              ref={lightboxRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {currentImage && (
                <div
                  className="relative transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom.scale}) translate(${zoom.x}px, ${zoom.y}px)`,
                    cursor: zoom.scale > 1 ? (zoom.isDragging ? 'grabbing' : 'grab') : 'default'
                  }}
                >
                  <Image
                    src={currentImage.src}
                    alt={currentImage.alt}
                    width={currentImage.width}
                    height={currentImage.height}
                    className="max-w-full max-h-full object-contain"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {lightbox.images.length > 1 && (
              <>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Thumbnails */}
            {showThumbnails && lightbox.images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent">
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {lightbox.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setLightbox(prev => ({ ...prev, currentImageIndex: index }))}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                        index === lightbox.currentImageIndex
                          ? 'border-white'
                          : 'border-transparent hover:border-white/50'
                      }`}
                    >
                      <Image
                        src={image.thumbnail}
                        alt={image.alt}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specs Overlay */}
            {lightbox.showSpecs && technicalSpecs.length > 0 && (
              <div className="absolute top-20 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                <h4 className="font-semibold mb-3">Specifications</h4>
                <div className="space-y-3">
                  {technicalSpecs.map((category, index) => (
                    <div key={index}>
                      <h5 className="font-medium text-sm">{category.category}</h5>
                      <div className="space-y-1 text-xs">
                        {category.specs.map((spec, specIndex) => (
                          <div key={specIndex} className="flex justify-between">
                            <span className="text-gray-600">{spec.label}:</span>
                            <span>{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Image</DialogTitle>
          </DialogHeader>
          {selectedImageForShare && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedImageForShare.thumbnail}
                  alt={selectedImageForShare.alt}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
                <div>
                  <p className="font-medium">{selectedImageForShare.alt}</p>
                  <p className="text-sm text-gray-500">{productName}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => shareImage('email', selectedImageForShare)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button
                  onClick={() => shareImage('facebook', selectedImageForShare)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  onClick={() => shareImage('twitter', selectedImageForShare)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  onClick={() => shareImage('copy-link', selectedImageForShare)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Link className="w-4 h-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}