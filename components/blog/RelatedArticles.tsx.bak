/**
 * Related Articles Component
 * Display related content for engagement
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RelatedArticle } from '@/lib/blog/types';
import { formatDate } from '@/lib/blog/utils';
import { Clock, ArrowRight } from 'lucide-react';

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/blog/${article.slug}`}
          className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full capitalize">
                {article.category.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readingTime} min</span>
              </div>
            </div>

            <div className="mt-4 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              <span>Read More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
