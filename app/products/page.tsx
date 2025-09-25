'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { products, Product } from './products-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PgHeader from '@/components/PgHeader';
import PgFooter from '@/components/PgFooter';

const ProductCard = ({ product }: { product: Product }) => (
  <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
    <CardHeader className="p-0">
      <div className="relative h-64 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{objectFit: "cover"}}
        />
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
      <p className="mt-2 text-sm text-gray-600">{product.description}</p>
      <p className="mt-4 text-lg font-bold text-gray-800">${product.price.toFixed(2)}</p>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Button className="w-full">Add to Cart</Button>
    </CardFooter>
  </Card>
);

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('name-asc');

  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const [sortKey, sortDirection] = sortOrder.split('-');
    return [...filtered].sort((a, b) => {
      let valA, valB;
      if (sortKey === 'name') {
        valA = a.name;
        valB = b.name;
      } else { // price
        valA = a.price;
        valB = b.price;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchTerm, category, sortOrder]);

  return (
    <>
      <PgHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Our Products</h1>
          <p className="mt-4 text-lg text-gray-600">Explore our wide range of high-quality closet doors and hardware.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="md:col-span-1"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <PgFooter />
    </>
  );
};

export default ProductsPage;
