"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { SearchBar } from './SearchBar';
import { QuickViewModal } from './QuickViewModal';
import {
  ChevronDown,
  Grid3X3,
  Grid2X2,
  Filter,
  X
} from 'lucide-react';
import {
  colors,
  spacing,
  shadows,
  radius,
  animations,
  breakpoints
} from '@/lib/design-tokens';
import type { Product } from '@/types/product';

// Sort options
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

// Grid layout options
const GRID_LAYOUTS = {
  '2x2': { cols: 2, size: 'large' },
  '3x3': { cols: 3, size: 'medium' },
  '4x4': { cols: 4, size: 'small' },
};

interface ProductCatalogProps {
  initialProducts?: Product[];
  category?: string;
}

export default function ProductCatalog({
  initialProducts = [],
  category
}: ProductCatalogProps) {
  // State management
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [gridLayout, setGridLayout] = useState('3x3');
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: { min: 0, max: 5000 },
    styles: [] as string[],
    inStock: false,
    onSale: false,
  });

  // Load products on mount or category change
  useEffect(() => {
    loadProducts();
  }, [category]);

  // Apply filters and search whenever they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [products, filters, searchQuery, sortBy]);

  // Load products from API
  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Use sample data as fallback
      setProducts(generateSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.features.some(f => f.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Apply price filter
    result = result.filter(product =>
      product.price >= filters.priceRange.min * 100 &&
      product.price <= filters.priceRange.max * 100
    );

    // Apply style filter
    if (filters.styles.length > 0) {
      result = result.filter(product => {
        const productStyle = product.specifications?.style?.toLowerCase();
        return filters.styles.some(style =>
          productStyle?.includes(style.toLowerCase())
        );
      });
    }

    // Apply stock filter
    if (filters.inStock) {
      result = result.filter(product => product.inStock);
    }

    // Apply sale filter
    if (filters.onSale) {
      result = result.filter(product => product.salePrice !== undefined);
    }

    // Apply sorting
    result = sortProducts(result, sortBy);

    setFilteredProducts(result);
  };

  // Sort products
  const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-desc':
        return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || '').getTime();
          const dateB = new Date(b.createdAt || '').getTime();
          return dateB - dateA;
        });
      case 'popularity':
        return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'featured':
      default:
        return sorted.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }
  };

  // Handle quick view
  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  // Get grid columns based on layout
  const getGridColumns = () => {
    const layout = GRID_LAYOUTS[gridLayout as keyof typeof GRID_LAYOUTS];
    return {
      className: `grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${layout.cols} xl:grid-cols-${layout.cols === 2 ? 2 : layout.cols + 1}`,
      size: layout.size,
    };
  };

  const gridConfig = getGridColumns();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.gray[100] }}>
      {/* Header Section */}
      <div
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderColor: colors.gray[200],
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="py-4">
            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search products by name, category, or features..."
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex lg:hidden items-center gap-2 px-4 py-2 rounded-lg border"
                  style={{
                    borderColor: colors.gray[300],
                    color: colors.gray[700],
                  }}
                >
                  <Filter size={18} />
                  <span className="text-sm font-medium">Filters</span>
                </button>

                {/* Desktop Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg border"
                  style={{
                    borderColor: colors.gray[300],
                    color: colors.gray[700],
                    backgroundColor: showFilters ? colors.gray[100] : 'white',
                  }}
                >
                  <Filter size={18} />
                  <span className="text-sm font-medium">
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </span>
                </button>

                {/* Product Count */}
                <div className="text-sm" style={{ color: colors.gray[600] }}>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Grid Layout Toggle */}
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => setGridLayout('2x2')}
                    className={`p-2 rounded-lg ${gridLayout === '2x2' ? 'bg-gray-200' : ''}`}
                    style={{ color: colors.gray[700] }}
                  >
                    <Grid2X2 size={20} />
                  </button>
                  <button
                    onClick={() => setGridLayout('3x3')}
                    className={`p-2 rounded-lg ${gridLayout === '3x3' ? 'bg-gray-200' : ''}`}
                    style={{ color: colors.gray[700] }}
                  >
                    <Grid3X3 size={20} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 rounded-lg border text-sm font-medium cursor-pointer"
                    style={{
                      borderColor: colors.gray[300],
                      backgroundColor: 'white',
                      color: colors.gray[700],
                    }}
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    style={{ color: colors.gray[500] }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 280 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block flex-shrink-0"
              >
                <div className="sticky top-32">
                  <FilterSidebar
                    filters={filters}
                    onChange={setFilters}
                    productCount={filteredProducts.length}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              // Loading skeleton
              <div className={gridConfig.className}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                className={gridConfig.className}
                layout
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        product={product}
                        size={gridConfig.size as 'small' | 'medium' | 'large'}
                        onQuickView={() => handleQuickView(product)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              // No results
              <div className="text-center py-16">
                <div className="text-2xl font-medium mb-2" style={{ color: colors.gray[700] }}>
                  No products found
                </div>
                <p style={{ color: colors.gray[600] }}>
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
              style={{ boxShadow: shadows['2xl'] }}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4" style={{ borderColor: colors.gray[200] }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  productCount={filteredProducts.length}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={quickViewOpen}
        onClose={() => {
          setQuickViewOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

// Generate sample products for testing
function generateSampleProducts(): Product[] {
  const categories = ['barn-doors', 'bifold-doors', 'bypass-doors', 'pivot-doors', 'room-dividers', 'hardware', 'mirrors'];
  const styles = ['Modern', 'Traditional', 'Contemporary', 'Rustic', 'Industrial'];

  return Array.from({ length: 24 }, (_, i) => {
    const basePrice = Math.floor(Math.random() * 150000) + 30000;
    return {
      id: `product-${i + 1}`,
      name: `Premium ${categories[i % categories.length].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${i + 1}`,
      slug: `product-${i + 1}`,
      category: categories[i % categories.length] as any,
      price: basePrice,
      salePrice: i % 3 === 0 ? Math.floor(Math.random() * 100000) + 25000 : undefined,
      images: [`/api/placeholder/400/500`],
      description: `High-quality ${categories[i % categories.length].replace('-', ' ')} with premium finishes and hardware.`,
      features: [
        'Premium construction',
        'Easy installation',
        'Lifetime warranty',
        'Custom sizing available'
      ],
      specifications: {
        style: styles[i % styles.length],
        material: 'Solid wood core',
        width: '36"',
        height: '80"',
        thickness: '1.75"'
      },
      variants: [
        {
          id: `variant-${i + 1}-1`,
          title: 'Standard',
          sku: `SKU-${i + 1}-STD`,
          price: basePrice,
          inventory_quantity: Math.floor(Math.random() * 50) + 10
        }
      ],
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 100) + 10,
      inStock: i % 5 !== 0,
      isNew: i < 3,
      isFeatured: i % 4 === 0,
      popularity: Math.floor(Math.random() * 1000),
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    };
  });
}