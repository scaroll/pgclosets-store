"use client"

import { ProductCard } from "./product-card";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: any[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
      >
        <div className="max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">No products found</p>
          <p className="text-gray-600">
            Try adjusting your filters or search terms to find what you're looking for
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-4 bg-gray-200 rounded mb-5 w-2/3" />
        <div className="h-10 bg-gray-200 rounded mb-3" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
