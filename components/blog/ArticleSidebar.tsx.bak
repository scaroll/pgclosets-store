/**
 * Article Sidebar Component
 * Table of contents, related posts, and CTA
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { ArticleMetadata, TableOfContentsItem } from '@/lib/blog/types';
import { BookOpen, ArrowRight } from 'lucide-react';

interface ArticleSidebarProps {
  article: ArticleMetadata;
  tableOfContents: TableOfContentsItem[];
}

export function ArticleSidebar({ article, tableOfContents }: ArticleSidebarProps) {
  const [activeId, setActiveId] = React.useState<string>('');

  // Track scroll position and update active TOC item
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    // Observe all heading elements
    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  return (
    <div className="space-y-8">
      {/* Table of Contents */}
      {tableOfContents.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">Table of Contents</h3>
          </div>

          <nav>
            <ul className="space-y-2">
              {tableOfContents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block py-2 px-3 rounded transition-colors ${
                      activeId === item.id
                        ? 'bg-blue-100 text-blue-900 font-semibold'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                  >
                    {item.text}
                  </a>

                  {item.children && item.children.length > 0 && (
                    <ul className="mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={`#${child.id}`}
                            className={`block py-1 px-3 rounded text-sm transition-colors ${
                              activeId === child.id
                                ? 'bg-blue-100 text-blue-900 font-semibold'
                                : 'text-gray-600 hover:bg-gray-200'
                            }`}
                            style={{ paddingLeft: `${(child.level - 1) * 12 + 12}px` }}
                          >
                            {child.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Quick CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h3 className="font-bold text-xl mb-3">Need Expert Help?</h3>
        <p className="text-blue-100 mb-4">
          Get a free consultation for your custom closet door project.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Get Free Quote
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
