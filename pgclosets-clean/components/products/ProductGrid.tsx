'use client';

import { motion } from 'framer-motion';
import { ReninProduct } from '@/lib/renin-product-loader';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: ReninProduct[];
  viewMode: 'grid' | 'list';
  isLoading?: boolean;
}

export default function ProductGrid({
  products,
  viewMode = 'grid',
  isLoading = false
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton viewMode={viewMode} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={
        viewMode === 'grid'
          ? 'product-grid'
          : 'space-y-6'
      }
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          className={viewMode === 'list' ? 'w-full' : ''}
        >
          <ProductCard
            product={product}
            viewMode={viewMode}
            priority={index < 4} // Load first 4 images with priority
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Loading skeleton for product grid
function ProductGridSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  const skeletonCount = viewMode === 'grid' ? 12 : 8;

  return (
    <div className={
      viewMode === 'grid'
        ? 'product-grid'
        : 'space-y-6'
    }>
      {[...Array(skeletonCount)].map((_, i) => (
        <div
          key={i}
          className={
            viewMode === 'grid'
              ? 'card-apple p-4'
              : 'card-apple p-6 flex gap-6'
          }
        >
          {viewMode === 'grid' ? (
            // Grid skeleton
            <>
              <div className="aspect-square bg-gray-200 shimmer rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 shimmer rounded"></div>
                <div className="h-3 bg-gray-200 shimmer rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 shimmer rounded w-1/2 mt-4"></div>
              </div>
            </>
          ) : (
            // List skeleton
            <>
              <div className="w-48 aspect-square bg-gray-200 shimmer rounded flex-shrink-0"></div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 shimmer rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 shimmer rounded w-1/2"></div>
                </div>
                <div className="h-16 bg-gray-200 shimmer rounded"></div>
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-gray-200 shimmer rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 shimmer rounded w-32"></div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}