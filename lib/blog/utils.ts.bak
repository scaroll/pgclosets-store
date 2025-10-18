/**
 * Blog Utility Functions
 * Helper functions for blog content management
 */

import type { ArticleMetadata, ArticleListItem, TableOfContentsItem } from './types';

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Calculate word count from content
 */
export function calculateWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).trim()  }...`;
}

/**
 * Generate table of contents from content
 */
export function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    headings.push({
      id,
      text,
      level,
    });
  }

  return buildTOCHierarchy(headings);
}

/**
 * Build hierarchical table of contents structure
 */
function buildTOCHierarchy(items: TableOfContentsItem[]): TableOfContentsItem[] {
  const root: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];

  items.forEach((item) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }

    stack.push(item);
  });

  return root;
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format relative date (e.g., "2 days ago")
 */
export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Sort articles by date (newest first)
 */
export function sortArticlesByDate(articles: ArticleListItem[]): ArticleListItem[] {
  return [...articles].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

/**
 * Filter articles by category
 */
export function filterByCategory(
  articles: ArticleListItem[],
  category: string
): ArticleListItem[] {
  return articles.filter((article) => article.category === category);
}

/**
 * Filter articles by tag
 */
export function filterByTag(articles: ArticleListItem[], tag: string): ArticleListItem[] {
  return articles.filter((article) => article.tags.includes(tag));
}

/**
 * Search articles by query
 */
export function searchArticles(articles: ArticleListItem[], query: string): ArticleListItem[] {
  const lowerQuery = query.toLowerCase();
  return articles.filter((article) => {
    return (
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get unique tags from articles
 */
export function getUniqueTags(articles: ArticleListItem[]): string[] {
  const tags = new Set<string>();
  articles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validate article metadata
 */
export function validateArticle(article: Partial<ArticleMetadata>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!article.title || article.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!article.slug || article.slug.trim().length === 0) {
    errors.push('Slug is required');
  }

  if (!article.content || article.content.trim().length < 1200) {
    errors.push('Content must be at least 1,200 words for SEO ranking potential');
  }

  if (!article.excerpt || article.excerpt.trim().length === 0) {
    errors.push('Excerpt is required');
  }

  if (!article.category) {
    errors.push('Category is required');
  }

  if (!article.tags || article.tags.length === 0) {
    errors.push('At least one tag is required');
  }

  if (!article.author) {
    errors.push('Author is required');
  }

  if (!article.featuredImage) {
    errors.push('Featured image is required');
  }

  if (!article.seo || !article.seo.title || !article.seo.description) {
    errors.push('SEO metadata (title and description) is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate Flesch Reading Ease score
 */
export function calculateReadingEase(content: string): number {
  const plainText = content.replace(/<[^>]*>/g, '');
  const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = plainText.trim().split(/\s+/);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  return Math.max(0, Math.min(100, score));
}

/**
 * Count syllables in a word (simplified)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  const vowels = 'aeiouy';
  let count = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }

  // Adjust for silent 'e' at the end
  if (word.endsWith('e')) {
    count--;
  }

  return Math.max(1, count);
}
