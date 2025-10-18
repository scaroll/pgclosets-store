/**
 * Category Card Component
 * Visual category navigation for blog index
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { CategoryMetadata } from '@/lib/blog/types';
import {
  Palette,
  Wrench,
  Sparkles,
  Lightbulb,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

interface CategoryCardProps {
  category: CategoryMetadata;
}

const categoryIcons = {
  design: Palette,
  installation: Wrench,
  maintenance: Sparkles,
  inspiration: Lightbulb,
  'buying-guide': ShoppingCart,
  trends: TrendingUp,
};

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || Lightbulb;

  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className="group block bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-blue-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors capitalize">
            {category.name}
          </h3>
          <p className="text-gray-600 mb-3">{category.description}</p>
          <p className="text-sm text-gray-500">{category.count} articles</p>
        </div>
      </div>
    </Link>
  );
}
