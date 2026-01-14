import { ReninProduct } from "@/lib/renin-product-loader";
import { ProductCard } from "./product-card";
import { memo } from "react";

interface ProductGridProps {
  products: ReninProduct[];
  loading?: boolean;
}

// Loading skeleton component matching design language
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-slate-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-slate-200"></div>
          <div className="p-6 space-y-4">
            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const ProductGrid = memo(function ProductGrid({ products, loading = false }: ProductGridProps) {
  // Show loading skeleton
  if (loading) {
    return <ProductGridSkeleton />;
  }

  // Show empty state with design language
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-slate-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-light text-slate-900 mb-2">No Products Found</h3>
        <p className="text-slate-600 font-light">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});