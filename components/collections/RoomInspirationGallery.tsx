"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Expand, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomImage {
  id: string;
  url: string;
  title: string;
  room: string;
  style: string;
  products: string[];
  description?: string;
}

interface RoomInspirationGalleryProps {
  images: RoomImage[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function RoomInspirationGallery({
  images,
  title = "Room Inspiration Gallery",
  subtitle = "Discover how our doors transform real spaces",
  className
}: RoomInspirationGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<RoomImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setSelectedImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setSelectedImage(images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]);
  };

  const toggleLike = (imageId: string) => {
    setLikedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  return (
    <section className={cn("py-16 md:py-24 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Dialog key={image.id}>
              <DialogTrigger asChild>
                <div
                  className={cn(
                    "group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer",
                    "transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  )}
                  onClick={() => {
                    setSelectedImage(image);
                    setCurrentIndex(index);
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(image.id);
                      }}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4",
                          likedImages.has(image.id) ? "fill-red-500 text-red-500" : "text-gray-700"
                        )}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                    >
                      <Share2 className="w-4 h-4 text-gray-700" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                    >
                      <Expand className="w-4 h-4 text-gray-700" />
                    </Button>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {image.room}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {image.style}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-0">
                <div className="relative">
                  {/* Image */}
                  <div className="relative aspect-video">
                    <Image
                      src={selectedImage?.url || image.url}
                      alt={selectedImage?.title || image.title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>

                  {/* Navigation */}
                  {images.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                        onClick={handlePrevious}
                      >
                        <ArrowLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                        onClick={handleNext}
                      >
                        <ArrowRight className="w-6 h-6" />
                      </Button>
                    </>
                  )}

                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                      onClick={() => selectedImage && toggleLike(selectedImage.id)}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5",
                          selectedImage && likedImages.has(selectedImage.id)
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        )}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </Button>
                  </div>

                  {/* Info Panel */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent text-white">
                    <h2 className="text-2xl font-bold mb-2">{selectedImage?.title || image.title}</h2>
                    {selectedImage?.description && (
                      <p className="text-white/80 mb-4 max-w-2xl">{selectedImage.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {selectedImage?.room || image.room}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {selectedImage?.style || image.style}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-white/60">Products used:</span>
                      {(selectedImage?.products || image.products).map((product, index) => (
                        <Badge key={index} variant="outline" className="border-white/30 text-white">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 text-lg"
          >
            View More Inspiration
          </Button>
        </div>
      </div>
    </section>
  );
}