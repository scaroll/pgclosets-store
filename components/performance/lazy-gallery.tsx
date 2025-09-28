'use client'

"use client";

import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { useLazyLoading } from '@/hooks/use-lazy-loading';

// Lazy load the gallery component
const ReninProductGallery = dynamic(
  () => import('@/components/gallery/renin-product-gallery'),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }
);

interface LazyGalleryProps {
  productId: string;
  productName: string;
  images: any[];
  technicalSpecs?: any[];
  relatedProducts?: any[];
  config?: any;
  className?: string;
}

const LazyGallery = memo(function LazyGallery({
  productId,
  productName,
  images,
  technicalSpecs,
  relatedProducts,
  config,
  className
}: LazyGalleryProps) {
  const { ref, shouldLoad } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '200px'
  });

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <ReninProductGallery
          productId={productId}
          productName={productName}
          images={images}
          technicalSpecs={technicalSpecs}
          relatedProducts={relatedProducts}
          config={config}
        />
      ) : (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default LazyGallery;