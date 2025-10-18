/**
 * Article Hero Component
 * Featured image with title overlay and metadata
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/blog/utils';
import type { ArticleMetadata } from '@/lib/blog/types';
import { Clock, Calendar, User, Tag } from 'lucide-react';

interface ArticleHeroProps {
  article: ArticleMetadata;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px]">
      {/* Featured Image */}
      <div className="absolute inset-0">
        <Image
          src={article.featuredImage.url}
          alt={article.featuredImage.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
        <div className="max-w-4xl">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold capitalize">
              <Tag className="w-4 h-4 mr-2" />
              {article.category.replace('-', ' ')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{article.author.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{article.readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
