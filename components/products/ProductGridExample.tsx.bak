"use client";

/**
 * AGENT 8: PRODUCT GRID EXAMPLE
 * Complete implementation showing all features
 */

import { useState, useEffect } from "react";
import { ProductGridResponsive } from "./ProductGridResponsive";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import type { Product } from "@/types/commerce";

export function ProductGridExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Handle quote request
  const handleQuoteRequest = (product: Product) => {
    console.log("Quote requested for:", product.title);

    // Example: Add to quote basket
    const existingQuotes = JSON.parse(localStorage.getItem("quoteBasket") || "[]");
    const newQuote = {
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("quoteBasket", JSON.stringify([...existingQuotes, newQuote]));

    // Show success message (you can use toast notification)
    alert(`${product.title} added to quote basket!`);
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="max-w-[1440px] mx-auto px-6 py-12 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-apple-48 md:text-apple-64 font-light text-apple-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-apple-17 text-apple-gray-600 max-w-apple-text mx-auto">
            Explore our complete collection of premium closet doors and sliding door systems.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          /* Product Grid */
          <ProductGridResponsive
            products={products}
            onQuoteRequest={handleQuoteRequest}
            enableLazyLoading={true}
            enableQuickView={true}
          />
        ) : (
          /* Empty State */
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-apple-gray-100 mb-6">
              <svg className="w-10 h-10 text-apple-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-apple-28 font-light text-apple-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-apple-17 text-apple-gray-600">
              Check back soon for new products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * USAGE IN PAGE:
 *
 * // app/products/page.tsx
 * import { ProductGridExample } from "@/components/products/ProductGridExample";
 *
 * export default function ProductsPage() {
 *   return <ProductGridExample />;
 * }
 */

/**
 * ADVANCED USAGE WITH FILTERING:
 */
export function ProductGridWithFilters() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products");
        const data = await response.json();
        setAllProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = allProducts;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.collection?.handle === selectedCategory
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [allProducts, selectedCategory, searchQuery]);

  const handleQuoteRequest = (product: Product) => {
    console.log("Quote requested for:", product.title);
  };

  // Get unique categories
  const categories = Array.from(
    new Set(
      allProducts
        .map((p) => p.collection?.handle)
        .filter((h): h is string => !!h)
    )
  );

  return (
    <div className="w-full">
      <div className="max-w-[1440px] mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-apple-48 md:text-apple-64 font-light text-apple-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-apple-17 text-apple-gray-600 max-w-apple-text mx-auto">
            {filteredProducts.length} products available
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Search */}
          <div className="max-w-md mx-auto">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-apple-gray-300 rounded-apple
                         focus:outline-none focus:ring-2 focus:ring-apple-blue-500
                         text-apple-17"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full text-apple-15 font-medium transition-all
                ${
                  selectedCategory === "all"
                    ? "bg-apple-gray-900 text-white"
                    : "bg-apple-gray-100 text-apple-gray-900 hover:bg-apple-gray-200"
                }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-apple-15 font-medium transition-all
                  ${
                    selectedCategory === category
                      ? "bg-apple-gray-900 text-white"
                      : "bg-apple-gray-100 text-apple-gray-900 hover:bg-apple-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGridResponsive
            products={filteredProducts}
            onQuoteRequest={handleQuoteRequest}
            enableLazyLoading={true}
            enableQuickView={true}
          />
        )}
      </div>
    </div>
  );
}
