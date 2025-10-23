'use client';

import { useState } from 'react';
import ProductFilter from "@/components/collections/ProductFilter";
import { QuickConfigureCard } from "@/components/products/QuickConfigureCard";

interface BifoldProductsClientProps {
  bifoldDoors: any[];
  filters: any[];
}

export default function BifoldProductsClient({ bifoldDoors, filters }: BifoldProductsClientProps) {
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <ProductFilter
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bifoldDoors.map((product) => (
            <QuickConfigureCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}