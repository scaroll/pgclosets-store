"use client";

import { useState, useEffect } from "react";
import { ReninProduct, reninProductLoader } from "@/lib/renin-product-loader";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";

interface ProductRelatedProps {
  product: ReninProduct;
  limit?: number;
}

interface RelatedProductGroup {
  title: string;
  products: ReninProduct[];
  reason: string;
}

export function ProductRelated({ product, limit = 8 }: ProductRelatedProps) {
  const [relatedGroups, setRelatedGroups] = useState<RelatedProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);

  // Number of products to show at once (responsive)
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    if (window.innerWidth < 1280) return 3;
    return 4;
  };

  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadRelatedProducts();
  }, [product]);

  const loadRelatedProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await reninProductLoader.loadProducts();
      const filteredProducts = allProducts.filter(p => p.id !== product.id);

      const groups: RelatedProductGroup[] = [];

      // Group 1: Same product type
      if (product.product_type) {
        const sameTypeProducts = filteredProducts
          .filter(p => p.product_type === product.product_type)
          .slice(0, limit);

        if (sameTypeProducts.length > 0) {
          groups.push({
            title: `More ${product.product_type}`,
            products: sameTypeProducts,
            reason: "Same category"
          });
        }
      }

      // Group 2: Same tags
      if (product.tags && product.tags.length > 0) {
        const sameTagProducts = filteredProducts
          .filter(p =>
            p.tags.some(tag => product.tags.includes(tag)) &&
            p.product_type !== product.product_type
          )
          .slice(0, limit);

        if (sameTagProducts.length > 0) {
          groups.push({
            title: "Similar Style",
            products: sameTagProducts,
            reason: "Shared characteristics"
          });
        }
      }

      // Group 3: Similar price range
      const currentPrice = product.variants?.[0]?.price || 0;
      if (currentPrice > 0) {
        const priceRange = currentPrice * 0.3; // 30% price tolerance
        const similarPriceProducts = filteredProducts
          .filter(p => {
            const productPrice = p.variants?.[0]?.price || 0;
            return productPrice > 0 &&
                   Math.abs(productPrice - currentPrice) <= priceRange &&
                   p.product_type !== product.product_type &&
                   !p.tags.some(tag => product.tags.includes(tag));
          })
          .slice(0, limit);

        if (similarPriceProducts.length > 0) {
          groups.push({
            title: "Similar Price Range",
            products: similarPriceProducts,
            reason: "Comparable pricing"
          });
        }
      }

      // Group 4: Complementary products (different categories that work well together)
      const complementaryTypes = getComplementaryTypes(product.product_type);
      if (complementaryTypes.length > 0) {
        const complementaryProducts = filteredProducts
          .filter(p => complementaryTypes.includes(p.product_type))
          .slice(0, limit);

        if (complementaryProducts.length > 0) {
          groups.push({
            title: "Complete Your Project",
            products: complementaryProducts,
            reason: "Works well together"
          });
        }
      }

      // Group 5: Popular products (if no other groups or to fill)
      if (groups.length < 2) {
        const popularProducts = filteredProducts
          .filter(p =>
            p.images.length > 0 &&
            p.variants.some(v => v.price > 0) &&
            !groups.some(group => group.products.some(gp => gp.id === p.id))
          )
          .sort((a, b) => {
            // Sort by availability and image count as popularity indicators
            const aScore = (a.variants?.reduce((sum, v) => sum + v.inventory_quantity, 0) || 0) + a.images.length;
            const bScore = (b.variants?.reduce((sum, v) => sum + v.inventory_quantity, 0) || 0) + b.images.length;
            return bScore - aScore;
          })
          .slice(0, limit);

        if (popularProducts.length > 0) {
          groups.push({
            title: "Popular Choices",
            products: popularProducts,
            reason: "Customer favorites"
          });
        }
      }

      setRelatedGroups(groups);
    } catch (error) {
      console.error('Error loading related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplementaryTypes = (productType: string): string[] => {
    const complementaryMap: Record<string, string[]> = {
      'Barn Doors': ['Hardware', 'Track Systems', 'Handles'],
      'Bypass Doors': ['Hardware', 'Track Systems', 'Handles'],
      'Bifold Doors': ['Hardware', 'Hinges', 'Handles'],
      'Pivot Doors': ['Hardware', 'Hinges', 'Handles'],
      'Hardware': ['Barn Doors', 'Bypass Doors', 'Bifold Doors'],
      'Track Systems': ['Barn Doors', 'Bypass Doors'],
      'Handles': ['Barn Doors', 'Bypass Doors', 'Bifold Doors', 'Pivot Doors'],
    };

    return complementaryMap[productType] || [];
  };

  const currentGroup = relatedGroups[selectedGroupIndex];
  const maxStartIndex = currentGroup ? Math.max(0, currentGroup.products.length - visibleCount) : 0;

  const handlePrevious = () => {
    setCurrentStartIndex(Math.max(0, currentStartIndex - visibleCount));
  };

  const handleNext = () => {
    setCurrentStartIndex(Math.min(maxStartIndex, currentStartIndex + visibleCount));
  };

  const shuffleProducts = () => {
    if (currentGroup) {
      const shuffled = [...currentGroup.products].sort(() => Math.random() - 0.5);
      const updatedGroups = [...relatedGroups];
      updatedGroups[selectedGroupIndex] = { ...currentGroup, products: shuffled };
      setRelatedGroups(updatedGroups);
      setCurrentStartIndex(0);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-slate-200 rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: visibleCount }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-square bg-slate-200 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedGroups.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-lg flex items-center justify-center">
          <Shuffle className="w-8 h-8" />
        </div>
        <p className="text-sm font-light">No related products found</p>
      </div>
    );
  }

  const visibleProducts = currentGroup?.products.slice(currentStartIndex, currentStartIndex + visibleCount) || [];

  return (
    <div className="space-y-6">
      {/* Header with group selector */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-light text-slate-900">
            {currentGroup?.title || "Related Products"}
          </h3>
          {currentGroup && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {currentGroup.reason}
              </Badge>
              <span className="text-xs text-slate-500 font-light">
                {currentGroup.products.length} products
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Group selector */}
          {relatedGroups.length > 1 && (
            <div className="flex gap-1">
              {relatedGroups.map((group, index) => (
                <Button
                  key={index}
                  variant={index === selectedGroupIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedGroupIndex(index);
                    setCurrentStartIndex(0);
                  }}
                  className="h-8 px-2 text-xs"
                >
                  {group.title.split(' ')[0]}
                </Button>
              ))}
            </div>
          )}

          {/* Shuffle button */}
          {currentGroup && currentGroup.products.length > visibleCount && (
            <Button
              variant="ghost"
              size="sm"
              onClick={shuffleProducts}
              className="h-8 px-2"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Products grid with navigation */}
      <div className="relative">
        {/* Navigation buttons */}
        {currentGroup && currentGroup.products.length > visibleCount && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg -ml-4"
              onClick={handlePrevious}
              disabled={currentStartIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg -mr-4"
              onClick={handleNext}
              disabled={currentStartIndex >= maxStartIndex}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      {currentGroup && currentGroup.products.length > visibleCount && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: Math.ceil(currentGroup.products.length / visibleCount) }).map((_, index) => {
            const isActive = Math.floor(currentStartIndex / visibleCount) === index;
            return (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive ? 'bg-slate-900' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                onClick={() => setCurrentStartIndex(index * visibleCount)}
              />
            );
          })}
        </div>
      )}

      {/* View all link */}
      {currentGroup && currentGroup.products.length > limit && (
        <div className="text-center pt-4">
          <Button variant="outline" size="sm">
            View All {currentGroup.title}
          </Button>
        </div>
      )}
    </div>
  );
}