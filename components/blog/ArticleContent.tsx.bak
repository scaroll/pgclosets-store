/**
 * Article Content Component
 * Typography-optimized content wrapper with proper styling
 */

'use client';

import React from 'react';
import type { ArticleMetadata } from '@/lib/blog/types';

interface ArticleContentProps {
  article: ArticleMetadata;
  children?: React.ReactNode;
}

export function ArticleContent({ article, children }: ArticleContentProps) {
  return (
    <div className="prose prose-lg prose-gray max-w-none
      prose-headings:font-bold prose-headings:text-gray-900
      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900 prose-strong:font-semibold
      prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
      prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
      prose-li:mb-2 prose-li:text-gray-700
      prose-blockquote:border-l-4 prose-blockquote:border-blue-600
      prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600
      prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1
      prose-code:rounded prose-code:text-sm prose-code:text-gray-800
      prose-pre:bg-gray-900 prose-pre:text-gray-100
      prose-img:rounded-lg prose-img:shadow-lg"
    >
      {children || <div dangerouslySetInnerHTML={{ __html: article.content }} />}
    </div>
  );
}
