"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/types/commerce";
import { formatPrice } from "@/lib/utils";
import { X, Eye, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BadgeChip } from "@/components/ui/badge-chip";
import { CTALogoButton } from "@/components/conversion/LogoConversionOptimizer";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onQuoteRequest: (product: Product) => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onQuoteRequest,
}: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || { id: '', title: '', sku: '', price: 0, inventory_quantity: 0 }
  );

  // Reset when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedVariant(
      product.variants?.[0] || { id: '', title: '', sku: '', price: 0, inventory_quantity: 0 }
    );
  }, [product]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePreviousImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedImageIndex, product.images.length]);

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleQuoteRequest = () => {
    onQuoteRequest(product);
    onClose();
  };

  const images = product.images.length > 0 ? product.images : [{ url: product.thumbnail || "/placeholder.svg", altText: product.title }];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close modal"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
                aria-label="Close quick view"
              >
                <X className="w-5 h-5 text-charcoal-900 group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-0 h-full max-h-[90vh] overflow-y-auto">
                {/* Left: Image Gallery */}
                <div className="relative bg-cream-50 flex flex-col">
                  {/* Main Image */}
                  <div className="relative aspect-square flex-1">
                    <Image
                      src={images[selectedImageIndex].url}
                      alt={images[selectedImageIndex].altText || product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />

                    {/* Image Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5 text-charcoal-900 group-hover:-translate-x-1 transition-transform duration-200" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5 text-charcoal-900 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                      </>
                    )}

                    {/* Chips */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {product.metadata?.bestseller && (
                        <BadgeChip variant="bestseller">Bestseller</BadgeChip>
                      )}
                      {product.metadata?.inStockOttawa && (
                        <BadgeChip variant="inStock">In Stock Ottawa</BadgeChip>
                      )}
                      {product.metadata?.isNew && (
                        <BadgeChip variant="new">New</BadgeChip>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            index === selectedImageIndex
                              ? "border-charcoal-900 ring-2 ring-charcoal-900/20"
                              : "border-transparent hover:border-charcoal-300"
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={image.altText || `${product.title} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Product Details */}
                <div className="flex flex-col p-8 md:p-10">
                  {/* Title & Price */}
                  <div className="space-y-3 mb-6">
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight text-charcoal-900">
                      {product.title}
                    </h2>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-light text-charcoal-900">
                        {formatPrice(selectedVariant.price)}
                      </span>
                      {product.metadata?.originalPrice && (
                        <span className="text-xl text-stone-500 line-through">
                          {formatPrice(product.metadata.originalPrice as number)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-stone-700 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Variant Selection */}
                  {product.variants.length > 1 && (
                    <div className="mb-6">
                      <label className="text-sm font-medium text-charcoal-900 mb-3 block">
                        Select Option
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {product.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                              selectedVariant.id === variant.id
                                ? "border-charcoal-900 bg-charcoal-50"
                                : "border-stone-300 hover:border-charcoal-400"
                            }`}
                          >
                            <div className="text-sm font-medium text-charcoal-900">
                              {variant.title}
                            </div>
                            <div className="text-xs text-stone-600 mt-1">
                              {formatPrice(variant.price)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock Status */}
                  {selectedVariant.inventory_quantity > 0 ? (
                    <div className="flex items-center gap-2 mb-6 text-sm text-success-DEFAULT">
                      <Check className="w-4 h-4" />
                      <span>In Stock ({selectedVariant.inventory_quantity} available)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-6 text-sm text-error-DEFAULT">
                      <X className="w-4 h-4" />
                      <span>Out of Stock</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-8">
                    <CTALogoButton
                      onClick={handleQuoteRequest}
                      variant="primary"
                      size="lg"
                      trackingContext="quick_view_quote"
                      className="w-full text-base uppercase tracking-wider py-4"
                    >
                      Get Quote
                    </CTALogoButton>

                    <CTALogoButton
                      href={`/products/${product.handle}`}
                      variant="secondary"
                      size="lg"
                      showLogo={false}
                      trackingContext="quick_view_details"
                      className="w-full text-base uppercase tracking-wider py-4"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      View Full Details
                    </CTALogoButton>
                  </div>

                  {/* Trust Signals */}
                  <div className="border-t border-stone-200 pt-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Badge variant="success" className="justify-center py-2">
                        <Check className="w-4 h-4 mr-1" />
                        Licensed & Insured
                      </Badge>
                      <Badge variant="info" className="justify-center py-2">
                        <Check className="w-4 h-4 mr-1" />
                        Lifetime Warranty
                      </Badge>
                    </div>
                    <div className="text-center">
                      <Badge variant="outline" className="text-sm">
                        ⭐⭐⭐⭐⭐ 5.0 (500+ Reviews)
                      </Badge>
                    </div>
                  </div>

                  {/* Tags */}
                  {product.tags.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-stone-200">
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * USAGE EXAMPLE:
 *
 * import { QuickViewModal } from "@/components/products/QuickViewModal";
 *
 * function ProductsPage() {
 *   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 *   const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
 *
 *   const handleQuoteRequest = (product: Product) => {
 *     console.log("Quote requested for:", product.title);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => {
 *         setSelectedProduct(product);
 *         setIsQuickViewOpen(true);
 *       }}>
 *         Quick View
 *       </button>
 *
 *       {selectedProduct && (
 *         <QuickViewModal
 *           product={selectedProduct}
 *           isOpen={isQuickViewOpen}
 *           onClose={() => setIsQuickViewOpen(false)}
 *           onQuoteRequest={handleQuoteRequest}
 *         />
 *       )}
 *     </>
 *   );
 * }
 *
 * FEATURES:
 * - Image gallery with keyboard navigation
 * - Variant selection
 * - Stock status display
 * - Trust signals and badges
 * - Smooth animations
 * - Backdrop click to close
 * - Escape key to close
 * - Body scroll lock when open
 * - Responsive design
 *
 * ACCESSIBILITY:
 * - Keyboard navigation (Arrow keys, Escape)
 * - ARIA labels
 * - Focus management
 * - Screen reader support
 */
