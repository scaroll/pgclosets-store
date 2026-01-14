'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ReninProduct } from '@/lib/renin-product-loader';
import { formatCADPrice, calculatePriceWithHST } from '@/lib/utils/price';
import ProductCard from './ProductCard';

interface ProductDetailsProps {
  product: ReninProduct;
  relatedProducts: ReninProduct[];
}

export default function ProductDetails({
  product,
  relatedProducts
}: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Get available variants with prices
  const availableVariants = useMemo(() => {
    return product.variants.filter(v => v.price > 0);
  }, [product.variants]);

  const currentVariant = availableVariants[selectedVariant] || availableVariants[0];

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!currentVariant) return { base: 0, withTax: 0, tax: 0 };

    const base = currentVariant.price * quantity;
    const withTax = calculatePriceWithHST(base);
    const tax = withTax - base;

    return { base, withTax, tax };
  }, [currentVariant, quantity]);

  // Check if product is featured or on sale
  const badges = useMemo(() => {
    const badges: Array<{ text: string; type: 'featured' | 'sale' | 'new' }> = [];

    if (product.tags.some(tag => tag.toLowerCase().includes('featured'))) {
      badges.push({ text: 'Featured', type: 'featured' });
    }

    if (product.tags.some(tag => tag.toLowerCase().includes('sale'))) {
      badges.push({ text: 'Sale', type: 'sale' });
    }

    if (product.tags.some(tag => tag.toLowerCase().includes('new'))) {
      badges.push({ text: 'New', type: 'new' });
    }

    return badges;
  }, [product.tags]);

  // Handle image selection
  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  // Handle variant selection
  const handleVariantSelect = useCallback((index: number) => {
    setSelectedVariant(index);
  }, []);

  // Handle quantity change
  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  }, []);

  // Extract specifications from product data
  const specifications = useMemo(() => {
    const specs: Array<{ label: string; value: string }> = [];

    specs.push({ label: 'Category', value: product.product_type || 'Closet Door' });

    if (currentVariant) {
      if (currentVariant.title && currentVariant.title !== 'Default Title') {
        specs.push({ label: 'Variant', value: currentVariant.title });
      }

      if (currentVariant.sku) {
        specs.push({ label: 'SKU', value: currentVariant.sku });
      }

      if (currentVariant.weight && currentVariant.weight > 0) {
        specs.push({ label: 'Weight', value: `${currentVariant.weight} kg` });
      }
    }

    // Add common door specifications
    if (product.product_type?.toLowerCase().includes('barn')) {
      specs.push({ label: 'Style', value: 'Barn Door' });
      specs.push({ label: 'Hardware', value: 'Track System Required' });
    } else if (product.product_type?.toLowerCase().includes('bypass')) {
      specs.push({ label: 'Style', value: 'Bypass Door' });
      specs.push({ label: 'Operation', value: 'Sliding' });
    } else if (product.product_type?.toLowerCase().includes('bifold')) {
      specs.push({ label: 'Style', value: 'Bifold Door' });
      specs.push({ label: 'Operation', value: 'Folding' });
    }

    return specs;
  }, [product, currentVariant]);

  return (
    <div className="container-apple section-apple">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-body-s text-pg-gray mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-pg-navy transition-colors">
          Home
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/products" className="hover:text-pg-navy transition-colors">
          Products
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-pg-dark">{product.title}</span>
      </nav>

      {/* Main Product Content */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square">
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="relative w-full h-full group overflow-hidden rounded-lg"
              aria-label="View full size image"
            >
              {product.images[selectedImageIndex] ? (
                <Image
                  src={product.images[selectedImageIndex].src}
                  alt={product.images[selectedImageIndex].alt || product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Image Zoom Indicator */}
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-pg-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </button>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {badges.map((badge, index) => (
                  <span
                    key={index}
                    className={`product-badge px-3 py-1 text-xs font-medium ${
                      badge.type === 'featured'
                        ? 'product-badge--featured'
                        : badge.type === 'sale'
                        ? 'product-badge--sale'
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-pg-navy shadow-medium'
                      : 'border-pg-border hover:border-pg-sky'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </button>
              ))}

              {/* More Images Indicator */}
              {product.images.length > 4 && (
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="relative aspect-square rounded overflow-hidden border-2 border-pg-border hover:border-pg-sky transition-all bg-gray-50 flex items-center justify-center"
                  aria-label={`View all ${product.images.length} images`}
                >
                  <div className="text-center">
                    <svg className="w-6 h-6 text-pg-gray mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs text-pg-gray">+{product.images.length - 3}</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-8">
          {/* Basic Info */}
          <div>
            <span className="product-badge product-badge--category px-3 py-1 text-xs mb-3 inline-block">
              {product.product_type || 'Closet Door'}
            </span>

            <h1 className="text-h1 mb-4">{product.title}</h1>

            {/* Price Display */}
            <div className="price-display mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="price-current text-2xl font-bold">
                  {formatCADPrice(pricing.base)}
                </span>
                {quantity > 1 && (
                  <span className="text-body-m text-pg-gray">
                    ({formatCADPrice(currentVariant?.price || 0)} each)
                  </span>
                )}
              </div>

              <div className="text-body-s text-pg-gray">
                <div>+ {formatCADPrice(pricing.tax)} HST</div>
                <div className="font-medium text-pg-dark">
                  Total: {formatCADPrice(pricing.withTax)}
                </div>
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div
                className="prose prose-sm max-w-none text-pg-gray"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
          </div>

          {/* Variant Selection */}
          {availableVariants.length > 1 && (
            <div>
              <h3 className="text-h3 mb-4">Options Available</h3>
              <div className="grid gap-3">
                {availableVariants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(index)}
                    className={`text-left p-4 border rounded-lg transition-all ${
                      selectedVariant === index
                        ? 'border-pg-navy bg-pg-offwhite'
                        : 'border-pg-border hover:border-pg-sky'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-pg-dark">
                          {variant.title !== 'Default Title' ? variant.title : 'Standard'}
                        </div>
                        {variant.sku && (
                          <div className="text-micro text-pg-gray">
                            SKU: {variant.sku}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-pg-dark">
                          {formatCADPrice(variant.price)}
                        </div>
                        {(variant.inventory_quantity || 0) > 0 ? (
                          <div className="text-micro text-green-600">In Stock</div>
                        ) : (
                          <div className="text-micro text-red-600">Contact for Availability</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-6">
            {/* Quantity Selector */}
            <div>
              <label className="block text-body-m font-semibold text-pg-dark mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-pg-border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-pg-offwhite disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-0 focus:ring-0 text-body-m font-semibold"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99}
                    className="p-3 hover:bg-pg-offwhite disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>

                <span className="text-body-s text-pg-gray">
                  {(currentVariant?.inventory_quantity || 0) > 0
                    ? `${currentVariant.inventory_quantity} available`
                    : 'Contact for availability'
                  }
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="btn-primary flex-1 py-4 font-semibold">
                Get Free Quote
              </button>
              <button className="btn-secondary px-6 py-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Contact Info */}
            <div className="p-4 bg-pg-offwhite rounded-lg">
              <h4 className="text-body-m font-semibold text-pg-dark mb-2">
                Need Help? Talk to Our Experts
              </h4>
              <p className="text-body-s text-pg-gray mb-3">
                Get personalized advice on sizing, installation, and customization options.
              </p>
              <button className="text-body-s text-pg-navy hover:text-pg-dark transition-colors font-medium">
                Schedule Consultation →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      {specifications.length > 0 && (
        <div className="mb-16">
          <h2 className="text-h2 mb-8">Specifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specifications.map((spec, index) => (
              <div key={index} className="border border-pg-border rounded-lg p-4">
                <dt className="text-body-s font-semibold text-pg-gray mb-1">
                  {spec.label}
                </dt>
                <dd className="text-body-m text-pg-dark">
                  {spec.value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-h2 mb-8">You Might Also Like</h2>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                viewMode="grid"
              />
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative aspect-square max-h-[80vh]">
                <Image
                  src={product.images[selectedImageIndex]?.src}
                  alt={product.images[selectedImageIndex]?.alt || product.title}
                  fill
                  className="object-contain"
                  sizes="80vw"
                />
              </div>

              {/* Modal Image Navigation */}
              {product.images.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        selectedImageIndex === index
                          ? 'bg-white'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}