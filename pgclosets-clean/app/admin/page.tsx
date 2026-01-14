'use client';

import { useState, useEffect } from 'react';
import { Download, RefreshCw, Database, BarChart3, Package, Tag, Eye } from 'lucide-react';

interface ProductStats {
  totalProducts: number;
  totalVariants: number;
  categories: number;
  tags: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
}

interface Product {
  id: string;
  title: string;
  product_type: string;
  variants: any[];
  status: string;
  tags: string[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getStats' })
      });
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products?limit=50');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCategories' })
      });
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getTags' })
      });
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const clearCache = async () => {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearCache' })
      });

      // Refresh data
      await Promise.all([fetchStats(), fetchProducts(), fetchCategories(), fetchTags()]);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const exportData = async (format: 'csv' | 'json', includeImages: boolean = true) => {
    setExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, includeImages })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') ||
                    `renin_products.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchCategories();
    fetchTags();
  }, []);

  return (
    <div className="container-apple py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-h1">Renin Product Administration</h1>
          <p className="text-body-l text-pg-gray">Manage and export Renin product catalog</p>
        </div>

        <div className="flex gap-2">
          <button onClick={clearCache} className="btn-secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Cache
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-apple p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-pg-gray">Total Products</h3>
              <Package className="h-5 w-5 text-pg-sky" />
            </div>
            <div className="text-3xl font-bold text-pg-navy">{stats.totalProducts}</div>
            <p className="text-sm text-pg-gray">
              {stats.totalVariants} variants total
            </p>
          </div>

          <div className="card-apple p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-pg-gray">Categories</h3>
              <BarChart3 className="h-5 w-5 text-pg-sky" />
            </div>
            <div className="text-3xl font-bold text-pg-navy">{stats.categories}</div>
            <p className="text-sm text-pg-gray">
              Different product types
            </p>
          </div>

          <div className="card-apple p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-pg-gray">Tags</h3>
              <Tag className="h-5 w-5 text-pg-sky" />
            </div>
            <div className="text-3xl font-bold text-pg-navy">{stats.tags}</div>
            <p className="text-sm text-pg-gray">
              Unique product tags
            </p>
          </div>

          <div className="card-apple p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-pg-gray">Avg. Price</h3>
              <Database className="h-5 w-5 text-pg-sky" />
            </div>
            <div className="text-3xl font-bold text-pg-navy">${stats.averagePrice.toFixed(0)} CAD</div>
            <p className="text-sm text-pg-gray">
              ${stats.priceRange.min} - ${stats.priceRange.max}
            </p>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="card-apple p-8">
        <div className="mb-6">
          <h2 className="text-h2 mb-2">Product Catalog</h2>
          <p className="text-body-m text-pg-gray">
            Recent products from the Renin catalog
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="space-y-4">
            {products.slice(0, 10).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-6 border border-pg-border rounded-xl hover:border-pg-sky transition-colors duration-200">
                <div className="flex-1">
                  <h3 className="font-semibold text-pg-navy">{product.title}</h3>
                  <p className="text-sm text-pg-gray">
                    {product.product_type} • {product.variants.length} variants
                  </p>
                  <div className="flex gap-2 mt-3">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="product-badge product-badge--category px-3 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                  <button className="btn-secondary p-2">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export Section */}
        <div className="mt-12 pt-8 border-t border-pg-border">
          <h3 className="text-h3 mb-6">Export Product Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pg-offwhite rounded-xl p-6">
              <h4 className="font-semibold text-pg-navy mb-2">CSV Export</h4>
              <p className="text-sm text-pg-gray mb-4">
                E-commerce ready format compatible with most platforms
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => exportData('csv', true)}
                  disabled={exporting}
                  className="btn-primary w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exporting ? 'Exporting...' : 'Export CSV with Images'}
                </button>
                <button
                  onClick={() => exportData('csv', false)}
                  disabled={exporting}
                  className="btn-secondary w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV without Images
                </button>
              </div>
            </div>

            <div className="bg-pg-offwhite rounded-xl p-6">
              <h4 className="font-semibold text-pg-navy mb-2">JSON Export</h4>
              <p className="text-sm text-pg-gray mb-4">
                Structured data format for APIs and custom integrations
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => exportData('json', true)}
                  disabled={exporting}
                  className="btn-primary w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exporting ? 'Exporting...' : 'Export JSON with Images'}
                </button>
                <button
                  onClick={() => exportData('json', false)}
                  disabled={exporting}
                  className="btn-secondary w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON without Images
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories and Tags */}
        <div className="mt-12 pt-8 border-t border-pg-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-h3 mb-4">Product Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div key={category} className="product-badge product-badge--category px-3 py-2 text-center">
                    {category}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-h3 mb-4">Product Tags</h3>
              <div className="grid grid-cols-3 gap-2">
                {tags.slice(0, 15).map((tag) => (
                  <div key={tag} className="product-badge product-badge--category px-2 py-1 text-xs text-center">
                    {tag}
                  </div>
                ))}
              </div>
              {tags.length > 15 && (
                <p className="text-sm text-pg-gray mt-4">
                  Showing first 15 of {tags.length} tags
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}