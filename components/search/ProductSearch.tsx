'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  url: string;
}

// Mock product data - replace with actual API call
const mockProducts: SearchResult[] = [
  {
    id: '1',
    title: 'Modern Barn Door',
    description: 'Sliding barn door with modern design',
    price: 'From $599',
    image: '/images/products/barn-door-1.jpg',
    category: 'Barn Doors',
    url: '/products/modern-barn-door'
  },
  {
    id: '2',
    title: 'Classic Bifold Closet Door',
    description: 'Space-saving bifold design',
    price: 'From $399',
    image: '/images/products/bifold-1.jpg',
    category: 'Closet Doors',
    url: '/products/classic-bifold'
  },
  {
    id: '3',
    title: 'French Door System',
    description: 'Elegant French door with glass panels',
    price: 'From $899',
    image: '/images/products/french-door-1.jpg',
    category: 'Interior Doors',
    url: '/products/french-door-system'
  },
  {
    id: '4',
    title: 'Room Divider Screen',
    description: 'Flexible room divider solution',
    price: 'From $799',
    image: '/images/products/divider-1.jpg',
    category: 'Room Dividers',
    url: '/products/room-divider-screen'
  },
  {
    id: '5',
    title: 'Closet Organization System',
    description: 'Complete closet organization solution',
    price: 'Custom Quote',
    image: '/images/products/closet-system-1.jpg',
    category: 'Closet Systems',
    url: '/products/closet-organization-system'
  }
];

interface ProductSearchProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  embedded?: boolean;
}

export function ProductSearch({ isOpen = false, onOpenChange, embedded = false }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced search function
  const performSearch = useCallback((query: string, category: string | null) => {
    if (query.length < 2 && !category) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    setTimeout(() => {
      let filtered = mockProducts;

      if (query) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (category) {
        filtered = filtered.filter(product => product.category === category);
      }

      setResults(filtered);
      setIsSearching(false);

      // Save to recent searches
      if (query && query.length > 2) {
        const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      }
    }, 300);
  }, [recentSearches]);

  // Handle search input change
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, performSearch]);

  const categories = ['Barn Doors', 'Closet Doors', 'Interior Doors', 'Room Dividers', 'Closet Systems'];

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSelectedCategory(null);
  };

  const searchContent = (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search products, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All Products
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Recent Searches */}
      {!searchQuery && recentSearches.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSearchQuery(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearching ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {results.map(result => (
            <Link key={result.id} href={result.url}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <div className="bg-gray-100 rounded w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">Image</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{result.title}</h4>
                          <p className="text-sm text-muted-foreground">{result.description}</p>
                          <Badge variant="secondary" className="mt-1">
                            {result.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{result.price}</p>
                          <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : searchQuery.length >= 2 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms</p>
        </div>
      ) : null}

      {/* Popular Products */}
      {!searchQuery && !selectedCategory && (
        <div>
          <h3 className="text-sm font-medium mb-2">Popular Products</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/products/barn-doors">
              <Card className="hover:shadow transition-shadow cursor-pointer">
                <CardContent className="p-3 text-center">
                  <p className="text-sm">Barn Doors</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products/closet-systems">
              <Card className="hover:shadow transition-shadow cursor-pointer">
                <CardContent className="p-3 text-center">
                  <p className="text-sm">Closet Systems</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products/interior-doors">
              <Card className="hover:shadow transition-shadow cursor-pointer">
                <CardContent className="p-3 text-center">
                  <p className="text-sm">Interior Doors</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products/hardware">
              <Card className="hover:shadow transition-shadow cursor-pointer">
                <CardContent className="p-3 text-center">
                  <p className="text-sm">Hardware</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return <div className="w-full">{searchContent}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        {searchContent}
      </DialogContent>
    </Dialog>
  );
}

// Search trigger button component
export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Keyboard shortcut (Cmd/Ctrl + K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative justify-start text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span>Search products...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <ProductSearch isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}