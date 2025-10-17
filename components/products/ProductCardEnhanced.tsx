"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Zap,
  TrendingUp,
  Package
} from 'lucide-react';
import {
  colors,
  spacing,
  shadows,
  radius,
  typography,
  animations
} from '@/lib/design-tokens';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  onQuickView?: () => void;
  onAddToCart?: () => void;
}

export function ProductCard({
  product,
  size = 'medium',
  onQuickView,
  onAddToCart
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate discount percentage
  const discountPercentage = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  // Format price
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  // Get size-specific styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          imageHeight: 'h-48',
          titleSize: 'text-sm',
          priceSize: 'text-base',
          padding: 'p-3',
          iconSize: 16,
        };
      case 'large':
        return {
          imageHeight: 'h-96',
          titleSize: 'text-lg',
          priceSize: 'text-xl',
          padding: 'p-6',
          iconSize: 24,
        };
      default:
        return {
          imageHeight: 'h-64',
          titleSize: 'text-base',
          priceSize: 'text-lg',
          padding: 'p-4',
          iconSize: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <motion.div
      className="group relative bg-white rounded-xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: isHovered ? shadows.lg : shadows.md,
        borderRadius: radius.xl,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1"
          >
            <Zap size={12} />
            NEW
          </motion.div>
        )}
        {discountPercentage > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full"
          >
            -{discountPercentage}%
          </motion.div>
        )}
        {product.isFeatured && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full flex items-center gap-1"
          >
            <TrendingUp size={12} />
            HOT
          </motion.div>
        )}
      </div>

      {/* Wishlist Button */}
      <motion.button
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full"
        style={{
          boxShadow: shadows.sm,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
        }}
      >
        <Heart
          size={sizeStyles.iconSize}
          className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
        />
      </motion.button>

      {/* Image Container */}
      <div className={`relative ${sizeStyles.imageHeight} overflow-hidden bg-gray-100`}>
        <Image
          src={product.images[0] || '/api/placeholder/400/500'}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-100"
            style={{ boxShadow: shadows.lg }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.();
            }}
          >
            <Eye size={sizeStyles.iconSize} />
          </motion.button>
          <motion.button
            className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700"
            style={{ boxShadow: shadows.lg }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.15 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
          >
            <ShoppingCart size={sizeStyles.iconSize} />
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className={sizeStyles.padding}>
        {/* Category */}
        <div className="text-xs font-medium mb-1" style={{ color: colors.gray[500] }}>
          {product.category.replace('-', ' ').toUpperCase()}
        </div>

        {/* Title */}
        <h3
          className={`${sizeStyles.titleSize} font-semibold mb-2 line-clamp-2`}
          style={{ color: colors.gray[900] }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: colors.gray[600] }}>
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`${sizeStyles.priceSize} font-bold`}
            style={{ color: product.salePrice ? colors.semantic.error.DEFAULT : colors.gray[900] }}
          >
            {formatPrice(product.salePrice || product.price)}
          </span>
          {product.salePrice && (
            <span
              className="text-sm line-through"
              style={{ color: colors.gray[500] }}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <Package size={14} style={{ color: product.inStock ? colors.semantic.success.DEFAULT : colors.gray[400] }} />
          <span
            className="text-xs font-medium"
            style={{
              color: product.inStock ? colors.semantic.success.DEFAULT : colors.gray[500]
            }}
          >
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Quick Actions (visible on mobile) */}
        <div className="flex gap-2 mt-3 lg:hidden">
          <button
            className="flex-1 px-3 py-2 border rounded-lg text-xs font-medium"
            style={{
              borderColor: colors.gray[300],
              color: colors.gray[700],
            }}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.();
            }}
          >
            Quick View
          </button>
          <button
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}