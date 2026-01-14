"use client";

import { useState, useMemo } from 'react';
import { Grid, List, Search, SortAsc, SortDesc, Eye, Star, Package, DollarSign } from 'lucide-react';
import { SearchResult, SortOption, searchUtils } from '@/lib/search-utils';
import { ReninProduct } from '@/lib/renin-product-loader';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  className?: string;
  defaultView?: 'grid' | 'list';
  showViewToggle?: boolean;
  showSortControls?: boolean;
  onSortChange?: (sortBy: SortOption, sortOrder: 'asc' | 'desc') => void;
  currentSort?: {
    sortBy: SortOption;
    sortOrder: 'asc' | 'desc';
  };
}

type ViewMode = 'grid' | 'list';

export function SearchResults({
  results,
  query,
  isLoading = false,
  className,
  defaultView = 'grid',
  showViewToggle = true,
  showSortControls = true,
  onSortChange,
  currentSort = { sortBy: 'relevance', sortOrder: 'desc' },
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);

  // Memoized results for performance
  const displayResults = useMemo(() => results, [results]);

  // Get match indicator for search highlighting
  const getMatchIndicator = (result: SearchResult) => {
    if (!query || result.exactMatches.length === 0) return null;

    const matchTypes = result.exactMatches.map(field => {
      switch (field) {
        case 'title':
          return 'Title';
        case 'category':
          return 'Category';
        case 'tag':
          return 'Tag';
        case 'description':
          return 'Description';
        default:
          return field;
      }
    });

    return matchTypes.join(', ');
  };

  // Get relevance score display
  const getScoreDisplay = (score: number) => {
    if (score >= 8) return { label: 'Perfect Match', color: 'text-green-600 bg-green-50' };
    if (score >= 5) return { label: 'Good Match', color: 'text-blue-600 bg-blue-50' };
    if (score >= 2) return { label: 'Partial Match', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Weak Match', color: 'text-slate-600 bg-slate-50' };
  };

  // Handle sort change
  const handleSortChange = (sortBy: SortOption) => {
    if (!onSortChange) return;

    const newSortOrder = currentSort.sortBy === sortBy && currentSort.sortOrder === 'desc' ? 'asc' : 'desc';
    onSortChange(sortBy, newSortOrder);
  };

  // Product Card Component (Grid View)
  const ProductCard = ({ result }: { result: SearchResult }) => {
    const { product, score } = result;
    const priceRange = searchUtils.getProductPriceRange(product);
    const isInStock = searchUtils.isProductInStock(product);
    const matchIndicator = getMatchIndicator(result);
    const scoreDisplay = getScoreDisplay(score);

    return (
      <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden group">
        {/* Image */}
        <div className="aspect-square relative bg-slate-100 overflow-hidden">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-300" />
            </div>
          )}

          {/* Overlay indicators */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {query && score > 0 && (
              <div className={cn("px-2 py-1 rounded-full text-xs font-medium", scoreDisplay.color)}>
                {scoreDisplay.label}
              </div>
            )}
            {!isInStock && (
              <div className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                Out of Stock
              </div>
            )}
          </div>

          {/* Stock indicator */}
          <div className="absolute top-3 right-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isInStock ? "bg-green-500" : "bg-red-500"
            )} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Match indicator */}
          {matchIndicator && (
            <div className="mb-2 text-xs text-slate-500">
              Matches: {matchIndicator}
            </div>
          )}

          {/* Title */}
          <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
            {query ? (
              <span dangerouslySetInnerHTML={{
                __html: searchUtils.highlightText(product.title, query)
              }} />
            ) : (
              product.title
            )}
          </h3>

          {/* Category */}
          <div className="text-sm text-slate-600 mb-3">
            {query ? (
              <span dangerouslySetInnerHTML={{
                __html: searchUtils.highlightText(product.product_type, query)
              }} />
            ) : (
              product.product_type
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                >
                  {query ? (
                    <span dangerouslySetInnerHTML={{
                      __html: searchUtils.highlightText(tag, query)
                    }} />
                  ) : (
                    tag
                  )}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">
              {priceRange.min === priceRange.max ? (
                searchUtils.formatPrice(priceRange.min)
              ) : (
                `${searchUtils.formatPrice(priceRange.min)} - ${searchUtils.formatPrice(priceRange.max)}`
              )}
            </div>
            {query && score > 0 && (
              <div className="text-xs text-slate-500">
                Score: {score.toFixed(1)}
              </div>
            )}
          </div>

          {/* Variants count */}
          <div className="mt-2 text-sm text-slate-500">
            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </div>
    );
  };

  // Product List Item Component (List View)
  const ProductListItem = ({ result }: { result: SearchResult }) => {
    const { product, score } = result;
    const priceRange = searchUtils.getProductPriceRange(product);
    const isInStock = searchUtils.isProductInStock(product);
    const matchIndicator = getMatchIndicator(result);
    const scoreDisplay = getScoreDisplay(score);

    return (
      <div className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 rounded-lg overflow-hidden">
        <div className="p-4 flex gap-4">
          {/* Image */}
          <div className="w-24 h-24 relative bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt || product.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
            )}

            {/* Stock indicator */}
            <div className="absolute top-2 right-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isInStock ? "bg-green-500" : "bg-red-500"
              )} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Match and score indicators */}
                <div className="flex items-center gap-2 mb-1">
                  {query && score > 0 && (
                    <div className={cn("px-2 py-1 rounded-full text-xs font-medium", scoreDisplay.color)}>
                      {scoreDisplay.label}
                    </div>
                  )}
                  {!isInStock && (
                    <div className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-medium text-slate-900 mb-1 line-clamp-1">
                  {query ? (
                    <span dangerouslySetInnerHTML={{
                      __html: searchUtils.highlightText(product.title, query)
                    }} />
                  ) : (
                    product.title
                  )}
                </h3>

                {/* Category and match info */}
                <div className="text-sm text-slate-600 mb-2">
                  {query ? (
                    <span dangerouslySetInnerHTML={{
                      __html: searchUtils.highlightText(product.product_type, query)
                    }} />
                  ) : (
                    product.product_type
                  )}
                  {matchIndicator && (
                    <span className="text-slate-400 ml-2">• Matches: {matchIndicator}</span>
                  )}
                </div>

                {/* Description excerpt */}
                <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                  {query ? (
                    <span dangerouslySetInnerHTML={{
                      __html: searchUtils.highlightText(
                        product.description.slice(0, 150) + (product.description.length > 150 ? '...' : ''),
                        query
                      )
                    }} />
                  ) : (
                    `${product.description.slice(0, 150)}${product.description.length > 150 ? '...' : ''}`
                  )}
                </p>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 4).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                      >
                        {query ? (
                          <span dangerouslySetInnerHTML={{
                            __html: searchUtils.highlightText(tag, query)
                          }} />
                        ) : (
                          tag
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price and stats */}
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-semibold text-slate-900 mb-1">
                  {priceRange.min === priceRange.max ? (
                    searchUtils.formatPrice(priceRange.min)
                  ) : (
                    `${searchUtils.formatPrice(priceRange.min)} - ${searchUtils.formatPrice(priceRange.max)}`
                  )}
                </div>
                <div className="text-sm text-slate-500 mb-1">
                  {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                </div>
                {query && score > 0 && (
                  <div className="text-xs text-slate-400">
                    Score: {score.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600 font-light">Searching products...</p>
          </div>
        </div>
      </div>
    );
  }

  // No Results
  if (displayResults.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-light text-slate-900 mb-2">No Products Found</h3>
          <p className="text-slate-600 font-light mb-6">
            {query
              ? `No products match "${query}". Try different keywords or adjust your filters.`
              : "No products available with the current filters."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Results Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-slate-600">
          {displayResults.length} {displayResults.length === 1 ? 'result' : 'results'}
          {query && ` for "${query}"`}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Controls */}
          {showSortControls && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort:</span>
              <div className="flex gap-1">
                {[
                  { value: 'relevance', label: 'Relevance', icon: Star },
                  { value: 'price', label: 'Price', icon: DollarSign },
                  { value: 'name', label: 'Name', icon: SortAsc },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleSortChange(value as SortOption)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors",
                      currentSort.sortBy === value
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                    {currentSort.sortBy === value && (
                      currentSort.sortOrder === 'desc' ? (
                        <SortDesc className="w-3 h-3" />
                      ) : (
                        <SortAsc className="w-3 h-3" />
                      )
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'grid'
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'list'
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayResults.map((result) => (
            <ProductCard key={result.product.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayResults.map((result) => (
            <ProductListItem key={result.product.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}