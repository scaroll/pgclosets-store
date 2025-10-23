'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Heart,
  Eye,
  ArrowRight,
  Clock,
  Users,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  Award,
  MapPin
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

// Helper function to get appropriate product image with fallbacks
const getProductImage = (product: Product): string => {
  // Try to get the hero image first
  const heroImage = product.media.find(m => m.role === 'hero')?.url;
  if (heroImage) return heroImage;

  // Try first available image
  if (product.media.length > 0 && product.media[0].url) {
    return product.media[0].url;
  }

  // Use category-based fallbacks
  const category = product.category.toLowerCase();
  if (category.includes('barn')) return '/images/products/barn-door-main.jpg';
  if (category.includes('bifold')) return '/images/products/bifold-door-main.jpg';
  if (category.includes('bypass')) return '/images/products/bypass-door-lifestyle.jpg';
  if (category.includes('pivot')) return '/images/products/barn-door-main.jpg'; // Reuse for now
  if (category.includes('hardware')) return '/images/products/barn-door-hardware.jpg';
  if (category.includes('mirror')) return '/images/products/barn-door-lifestyle.jpg'; // Reuse for now

  // Final fallback
  return '/images/products/barn-door-main.jpg';
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [canadianMadeOnly, setCanadianMadeOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Advanced filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('pgclosets-wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem('pgclosets-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Extract unique filter options
  const filterOptions = useMemo(() => {
    const styles = new Set<string>();
    const materials = new Set<string>();
    const finishes = new Set<string>();

    products.forEach(product => {
      if (product.attributes.style) styles.add(product.attributes.style);
      if (product.attributes.material) materials.add(product.attributes.material);
      if (product.attributes.finish) finishes.add(product.attributes.finish);
    });

    return {
      styles: Array.from(styles),
      materials: Array.from(materials),
      finishes: Array.from(finishes)
    };
  }, [products]);

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
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Style filter
    if (selectedStyles.length > 0) {
      filtered = filtered.filter(p =>
        selectedStyles.includes(p.attributes.style)
      );
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(p =>
        selectedMaterials.includes(p.attributes.material)
      );
    }

    // Finish filter
    if (selectedFinishes.length > 0) {
      filtered = filtered.filter(p =>
        selectedFinishes.includes(p.attributes.finish)
      );
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

  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleToggleCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      } else {
        alert('You can compare up to 3 products at a time');
        return prev;
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 5000 });
    setSelectedStyles([]);
    setSelectedMaterials([]);
    setSelectedFinishes([]);
    setInStockOnly(false);
    setCanadianMadeOnly(false);
  };

  const ProductCard = ({ product }: { product: Product & { price: number; originalPrice: number; inStock: boolean; rating: number; reviews: number } }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const isInWishlist = wishlist.includes(product.id);
    const isInCompare = compareList.includes(product.id);

    // Calculate stock urgency
    const getStockUrgency = () => {
      if (!product.inStock) return { text: 'Out of Stock', color: 'bg-red-500', urgent: true };
      if (product.reviews > 50 && product.rating > 4.5) {
        return { text: 'High Demand', color: 'bg-orange-500', urgent: false };
      }
      return { text: 'In Stock', color: 'bg-green-500', urgent: false };
    };

    const stockUrgency = getStockUrgency();

    return (
      <Card
        variant="interactive"
        className={`group overflow-hidden ${viewMode === 'list' ? 'flex' : ''} relative transition-all duration-300 hover:shadow-xl`}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowQuickActions(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowQuickActions(false);
        }}
      >
        {/* Product Image */}
        <div className={`relative ${viewMode === 'list' ? 'w-48' : 'aspect-[4/3]'} bg-gray-50 overflow-hidden`}>
          <OptimizedImage
            src={getProductImage(product)}
            alt={product.media[0]?.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            onError={() => {
              // Fallback to generic image if specific product image fails
              console.warn('Product image failed to load, using fallback')
            }}
          />

          {/* Quick Actions Overlay */}
          <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${showQuickActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleWishlist(product.id)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleCompare(product.id)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <ArrowUpDown className={`h-4 w-4 ${isInCompare ? 'text-blue-600' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuickViewProduct(product)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Urgency Badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className={`${stockUrgency.color} text-white shadow-lg`}>
              {stockUrgency.text}
            </Badge>
            {product.isNew && (
              <Badge className="bg-blue-500 text-white">New</Badge>
            )}
            {product.badges.slice(0, 1).map((badge, index) => (
              <Badge
                key={index}
                className="bg-white/90 text-gray-900 backdrop-blur-sm"
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Quick View Overlay on Hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 transition-opacity duration-300">
              <div className="w-full">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setQuickViewProduct(product)}
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </Button>
              </div>
            </div>
          )}

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
              {product.originalPrice > product.price && (
                <Badge className="bg-red-100 text-red-800 text-xs">
                  Save ${product.originalPrice - product.price}
                </Badge>
              )}
            </div>

            {/* Bulk Pricing Indicator */}
            {product.reviews > 25 && (
              <div className="flex items-center gap-1 text-xs text-green-700 mb-2">
                <Users className="h-3 w-3" />
                <span>Trade pricing available</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
                className="flex-1 relative overflow-hidden group"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Get Free Quote
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <Link href={`/products/${product.slug}`}>
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>{product.attributes.warranty}yr Warranty</span>
              </div>
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
      <div className="bg-white border-b sticky top-16 z-30">
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

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
              {(selectedStyles.length > 0 || selectedMaterials.length > 0 || selectedFinishes.length > 0) && (
                <Badge className="ml-2 bg-blue-500 text-white">
                  {selectedStyles.length + selectedMaterials.length + selectedFinishes.length}
                </Badge>
              )}
            </Button>

            {/* Active Filters */}
            {(selectedStyles.length > 0 || selectedMaterials.length > 0 || selectedFinishes.length > 0 || inStockOnly || canadianMadeOnly || (priceRange.min > 0) || (priceRange.max < 5000)) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filters:</span>
                {selectedStyles.map(style => (
                  <Badge key={style} variant="secondary" className="flex items-center gap-1">
                    {style}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedStyles(prev => prev.filter(s => s !== style))} />
                  </Badge>
                ))}
                {selectedMaterials.map(material => (
                  <Badge key={material} variant="secondary" className="flex items-center gap-1">
                    {material}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedMaterials(prev => prev.filter(m => m !== material))} />
                  </Badge>
                ))}
                {selectedFinishes.map(finish => (
                  <Badge key={finish} variant="secondary" className="flex items-center gap-1">
                    {finish}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedFinishes(prev => prev.filter(f => f !== finish))} />
                  </Badge>
                ))}
                {inStockOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    In Stock
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
                  </Badge>
                )}
                {canadianMadeOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    🍁 Canadian Made
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setCanadianMadeOnly(false)} />
                  </Badge>
                )}
                {(priceRange.min > 0 || priceRange.max < 5000) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ${priceRange.min} - ${priceRange.max}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange({ min: 0, max: 5000 })} />
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <Slider
                      value={[priceRange.min, priceRange.max]}
                      onValueChange={(value) => setPriceRange({ min: value[0], max: value[1] })}
                      max={5000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange.min}</span>
                      <span>${priceRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Style Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Style</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filterOptions.styles.map(style => (
                      <label key={style} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedStyles.includes(style)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStyles(prev => [...prev, style]);
                            } else {
                              setSelectedStyles(prev => prev.filter(s => s !== style));
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Material Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Material</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filterOptions.materials.map(material => (
                      <label key={material} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedMaterials.includes(material)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMaterials(prev => [...prev, material]);
                            } else {
                              setSelectedMaterials(prev => prev.filter(m => m !== material));
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Additional</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={inStockOnly}
                        onCheckedChange={setInStockOnly}
                      />
                      <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={canadianMadeOnly}
                        onCheckedChange={setCanadianMadeOnly}
                      />
                      <span className="text-sm text-gray-700">🍁 Made in Canada</span>
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count & Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </p>
            {selectedStyles.length > 0 || selectedMaterials.length > 0 || selectedFinishes.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">with {selectedStyles.length + selectedMaterials.length + selectedFinishes.length} filter(s) applied</p>
            )}
          </div>

          {/* Compare Button */}
          {compareList.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Compare ({compareList.length})
            </Button>
          )}

          {/* Wishlist Link */}
          {wishlist.length > 0 && (
            <Button
              variant="ghost"
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              Wishlist ({wishlist.length})
            </Button>
          )}
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
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Premium Features Banner */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Need Professional Advice?</h3>
              <p className="opacity-90">Get a free consultation with our design experts and find the perfect solution for your space.</p>
            </div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Sparkles className="h-5 w-5 mr-2" />
              Free Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{quickViewProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="aspect-square relative">
                  <OptimizedImage
                    src={getProductImage(quickViewProduct)}
                    alt={quickViewProduct.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <p className="text-gray-600">{quickViewProduct.tagline}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">${quickViewProduct.price}</span>
                    {quickViewProduct.originalPrice > quickViewProduct.price && (
                      <span className="text-lg text-gray-500 line-through">${quickViewProduct.originalPrice}</span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{quickViewProduct.rating} ({quickViewProduct.reviews} reviews)</span>
                  </div>

                  {/* Features */}
                  {quickViewProduct.features && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        {quickViewProduct.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="primary"
                      onClick={() => handleAddToCart(quickViewProduct)}
                      disabled={!quickViewProduct.inStock}
                      className="flex-1"
                    >
                      Get Free Quote
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                    >
                      <Link href={`/products/${quickViewProduct.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Compare Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Products</DialogTitle>
          </DialogHeader>
          {compareList.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {compareList.map(productId => {
                const product = products.find(p => p.id === productId);
                if (!product) return null;
                return (
                  <Card key={productId}>
                    <div className="aspect-square relative">
                      <OptimizedImage
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-lg"
                        sizes="33vw"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-2xl font-bold mb-4">${product.price}</p>
                      <div className="space-y-2 text-sm">
                        <div><strong>Style:</strong> {product.attributes.style}</div>
                        <div><strong>Material:</strong> {product.attributes.material}</div>
                        <div><strong>Finish:</strong> {product.attributes.finish}</div>
                        <div><strong>Warranty:</strong> {product.attributes.warranty} years</div>
                        <div><strong>Rating:</strong> {product.rating} ⭐</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleCompare(productId)}
                        className="mt-4 text-red-600 hover:text-red-700 w-full"
                      >
                        Remove from Compare
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}