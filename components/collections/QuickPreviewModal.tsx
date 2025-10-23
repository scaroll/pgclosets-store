"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  X,
  Heart,
  Share2,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  RotateCw,
  ShoppingCart,
  Calculator,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  image?: string;
  featured_image?: string;
  price?: number;
  configurator_data?: any;
  slug?: string;
  handle?: string;
}

interface QuickPreviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onNavigate?: (productId: string) => void;
}

export default function QuickPreviewModal({
  product,
  isOpen,
  onClose,
  products,
  onNavigate
}: QuickPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!product) return null;

  const currentIndex = products.findIndex(p => p.id === product.id);
  const previousProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  const handlePrevious = () => {
    if (previousProduct && onNavigate) {
      onNavigate(previousProduct.id);
      setCurrentImageIndex(0);
    }
  };

  const handleNext = () => {
    if (nextProduct && onNavigate) {
      onNavigate(nextProduct.id);
      setCurrentImageIndex(0);
    }
  };

  const safeSlug = product.slug || product.handle;
  const productUrl = safeSlug ? `/simple-products/${safeSlug}` : '#';

  // Mock additional images
  const productImages = [
    product.featured_image || product.image,
    // Add more images if available
  ].filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full p-0 bg-white rounded-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex flex-col lg:flex-row h-[90vh] max-h-[900px]">
          {/* Image Section */}
          <div className="lg:w-3/5 relative bg-gray-100">
            {/* Main Image */}
            <div className="relative h-full">
              {productImages[currentImageIndex] && (
                <Image
                  src={productImages[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              )}

              {/* Image Navigation */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentImageIndex
                          ? "bg-teal-600 w-8"
                          : "bg-white/60 hover:bg-white/80"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={cn(
                      "w-4 h-4",
                      isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                    )}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <Share2 className="w-4 h-4 text-gray-700" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </Button>
              </div>

              {/* Product Navigation */}
              {(previousProduct || nextProduct) && (
                <>
                  {previousProduct && (
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                      <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                  )}
                  {nextProduct && (
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                      <ArrowRight className="w-6 h-6 text-gray-700" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:w-2/5 flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-8">
              {/* Product Title */}
              <div className="mb-6">
                <Badge className="bg-teal-100 text-teal-800 mb-3">In Stock</Badge>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                {product.price && (
                  <div className="text-2xl font-semibold text-gray-900">
                    ${(product.price / 100).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Key Features */}
              <Card className="p-6 mb-6 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Premium construction materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Easy installation system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Manufacturer warranty included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Multiple finish options available</span>
                  </li>
                </ul>
              </Card>

              {/* Specifications */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Material</div>
                    <div className="font-medium">Premium Steel</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Warranty</div>
                    <div className="font-medium">Limited Lifetime</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Installation</div>
                    <div className="font-medium">Professional Required</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Lead Time</div>
                    <div className="font-medium">2-3 Weeks</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience the perfect blend of functionality and elegance with this premium door solution.
                  Designed with modern aesthetics and practical functionality in mind, it offers exceptional
                  performance while enhancing your interior design.
                </p>
              </div>

              {/* Finishes */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Available Finishes</h3>
                <div className="flex flex-wrap gap-2">
                  {['Matte White', 'Matte Black', 'Brushed Nickel', 'Bronze', 'Chrome'].map((finish) => (
                    <Badge key={finish} variant="outline" className="border-gray-300 text-gray-700">
                      {finish}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="space-y-3">
                {product.configurator_data ? (
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-6" asChild>
                    <a href="/instant-estimate">
                      <Calculator className="w-5 h-5 mr-2" />
                      Configure & Price
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-6" asChild>
                    <a href={productUrl}>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      View Product Details
                    </a>
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="py-4" asChild>
                    <a href={`/contact?product=${product.id}`}>
                      Get Quote
                    </a>
                  </Button>
                  <Button variant="outline" className="py-4" asChild>
                    <a href={productUrl}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Full Details
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}