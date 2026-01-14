"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { ReninProduct } from "@/lib/renin-product-loader";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductsHero } from "@/components/products/products-hero";

const ProductsClient = memo(function ProductsClient() {
  const [products, setProducts] = useState<ReninProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ReninProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`Failed to load products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.products || []);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.products?.map((p: ReninProduct) => p.product_type) || [])
        );
        setCategories(uniqueCategories);

        setError(null);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on category and search
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.product_type.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    setFilteredProducts(filtered);
  }, [products, activeCategory, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-light">Loading our collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-light text-slate-900 mb-2">Unable to Load Products</h2>
          <p className="text-slate-600 font-light mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-900 text-white px-6 py-2 font-light hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductsHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalProducts={filteredProducts.length}
        />

        <ProductGrid products={filteredProducts} loading={loading} />
      </div>
    </>
  );
});

export default ProductsClient;