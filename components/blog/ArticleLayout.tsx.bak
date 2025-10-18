/**
 * Article Layout Component
 * Main layout wrapper for blog articles with optimal reading experience
 */

'use client';

import React from 'react';
import type { ArticleMetadata } from '@/lib/blog/types';
import { ArticleHero } from './ArticleHero';
import { ArticleContent } from './ArticleContent';
import { ArticleSidebar } from './ArticleSidebar';
import { ShareButtons } from './ShareButtons';
import { RelatedArticles } from './RelatedArticles';
import { AuthorBio } from './AuthorBio';
import { BlogCTA } from './BlogCTA';
import { ReadingProgress } from './ReadingProgress';

interface ArticleLayoutProps {
  article: ArticleMetadata;
  children?: React.ReactNode;
}

export function ArticleLayout({ article, children }: ArticleLayoutProps) {
  return (
    <article className="relative">
      <ReadingProgress />

      <ArticleHero article={article} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <ArticleContent article={article}>
              {children}
            </ArticleContent>

            {/* Social Share Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <ShareButtons
                url={`https://pgclosets.com/blog/${article.slug}`}
                title={article.title}
              />
            </div>

            {/* Author Bio */}
            <div className="mt-12">
              <AuthorBio author={article.author} />
            </div>

            {/* Call to Action */}
            <div className="mt-12">
              <BlogCTA
                title="Ready to Transform Your Space?"
                description="Get a free consultation and quote for your custom closet door project."
                ctaText="Get Free Quote"
                ctaLink="/contact"
              />
            </div>

            {/* Related Articles */}
            {article.relatedArticles && article.relatedArticles.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
                <RelatedArticles articles={article.relatedArticles} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <ArticleSidebar
                article={article}
                tableOfContents={article.tableOfContents || []}
              />
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
