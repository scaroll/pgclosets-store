'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Filter,
  X,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  ChevronDown,
  Grid3X3,
  List,
  Heart
} from 'lucide-react';
import productsData from '@/data/renin-products.json';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

// Type definitions based on the actual data structure
interface ProductVariant {
  sku: string;
  name: string;
  priceCAD: number;
  installAddonCAD: number;
  availability: string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  weight: number;
  finish?: string;
  glazing?: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  category: string;
  subcategory: string;
  attributes: {
    type: string;
    style: string;
    frame: string;
    finish: string;
    material?: string;
    madeInCanada: boolean;
    warranty: string;
  };
  media: Array<{
    url: string;
    alt: string;
    role: string;
    width: number;
    height: number;
  }>;
  variants: ProductVariant[];
  badges: string[];
  features: string[];
  specifications: {
    warranty: string;
    madeIn: string;
  };
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

// Category configuration
const CATEGORIES = [
  { value: 'all', label: 'All Products', icon: Grid3X3 },
  { value: 'barn-doors', label: 'Barn Doors', icon: Grid3X3 },
  { value: 'bifold-doors', label: 'Bifold Doors', icon: Grid3X3 },
  { value: 'bypass-doors', label: 'Bypass Doors', icon: Grid3X3 },
  { value: 'pivot-doors', label: 'Pivot Doors', icon: Grid3X3 },
  { value: 'hardware', label: 'Hardware', icon: Grid3X3 },
  { value: 'mirrors', label: 'Mirrors', icon: Grid3X3 },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const BADGE_CONFIG = {
  'Best Seller': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
  'New Arrival': { variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
  'Made in Canada': { variant: 'default' as const, color: 'bg-red-100 text-red-800' },
  'Premium': { variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
  'Popular': { variant: 'default' as const, color: 'bg-orange-100 text-orange-800' },
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [canadianMadeOnly, setCanadianMadeOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Parse products data
  const products = useMemo(() => {
    return productsData.map(item => ({
      ...item,
      price: Math.min(...item.variants.map(v => v.priceCAD)),
      originalPrice: item.variants[0]?.priceCAD || 0,
      inStock: item.variants.some(v => v.availability === 'InStock'),
      rating: 4.5 + Math.random() * 0.5, // Simulated rating
      reviews: Math.floor(Math.random() * 100) + 10,
    })) as (Product & { price: number; originalPrice: number; inStock: boolean; rating: number; reviews: number })[];
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.features?.some((f: string) => f.toLowerCase().includes(query)) ||
        p.badges.some((b: string) => b.toLowerCase().includes(query))
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= parseInt(priceRange.max));
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Canadian made filter
    if (canadianMadeOnly) {
      filtered = filtered.filter(p => p.specifications.madeIn === 'Canada' || p.attributes.madeInCanada);
    }

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => {
          const aScore = (a.isBestSeller ? 3 : 0) + (a.isFeatured ? 2 : 0) + (a.isNew ? 1 : 0);
          const bScore = (b.isBestSeller ? 3 : 0) + (b.isFeatured ? 2 : 0) + (b.isNew ? 1 : 0);
          return bScore - aScore;
        });
    }

    return sorted;
  }, [products, selectedCategory, searchQuery, priceRange, inStockOnly, canadianMadeOnly, sortBy]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    if (inStockOnly) params.set('inStock', 'true');
    if (canadianMadeOnly) params.set('canadianMade', 'true');

    const queryString = params.toString();
    const newUrl = queryString ? `/products?${queryString}` : '/products';
    router.push(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, sortBy, priceRange, inStockOnly, canadianMadeOnly, router]);

  // Debounced URL update
  const debouncedUpdateURL = useMemo(
    () => setTimeout(updateURL, 300),
    [updateURL]
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddToCart = (product: Product & { price: number }) => {
    // Add to cart logic here
    console.log('Added to cart:', product.id);
  };

  const ProductCard = ({ product }: { product: Product & { price: number; originalPrice: number; inStock: boolean; rating: number; reviews: number } }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    return (
      <Card
        variant="interactive"
        className={`group overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className={`relative ${viewMode === 'list' ? 'w-48' : 'aspect-[4/3]'} bg-gray-50 overflow-hidden`}>
          <OptimizedImage
            src={product.media[0]?.url || '/images/placeholder.jpg'}
            alt={product.media[0]?.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-blue-500 text-white">New</Badge>
            )}
            {product.badges.map((badge, index) => (
              <Badge
                key={index}
                className={BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG]?.color || 'bg-gray-100 text-gray-800'}
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-black px-3 py-1 rounded-md text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`flex-1 p-4 ${viewMode === 'list' ? 'flex' : 'flex flex-col'}`}>
          <div className={viewMode === 'list' ? 'flex-1' : ''}>
            {/* Brand & Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">{product.category.replace('-', ' ')}</span>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            {/* Tagline */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.tagline}</p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-3">
              {product.specifications.madeIn === 'Canada' && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="text-xs">🍁</span>
                  <span>Made in Canada</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Shield className="h-3 w-3" />
                <span>{product.attributes.warranty} years</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Truck className="h-3 w-3" />
                <span>Free Shipping</span>
              </div>
            </div>
          </div>

          {/* Price & Actions */}
          <div className={`${viewMode === 'list' ? 'ml-4' : 'mt-auto'}`}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products, styles, finishes..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 h-12"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map(category => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="text-sm"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(priceRange.min || priceRange.max || inStockOnly || canadianMadeOnly) && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">Filters:</span>
                {priceRange.min && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Min: ${priceRange.min}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange(prev => ({ ...prev, min: '' }))}
                    />
                  </Badge>
                )}
                {priceRange.max && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Max: ${priceRange.max}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange(prev => ({ ...prev, max: '' }))}
                    />
                  </Badge>
                )}
                {inStockOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    In Stock Only
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setInStockOnly(false)}
                    />
                  </Badge>
                )}
                {canadianMadeOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    🍁 Made in Canada
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setCanadianMadeOnly(false)}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Price Range:</span>
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-24 h-8"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-24 h-8"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canadianMadeOnly}
                  onChange={(e) => setCanadianMadeOnly(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">🍁 Made in Canada</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange({ min: '', max: '' });
                setInStockOnly(false);
                setCanadianMadeOnly(false);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}