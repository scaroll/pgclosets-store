/**
 * Blog System Type Definitions
 * Comprehensive type system for PG Closets blog content
 */

export type ArticleCategory =
  | 'design'
  | 'installation'
  | 'maintenance'
  | 'inspiration'
  | 'buying-guide'
  | 'trends';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export type BuyerJourneyStage = 'awareness' | 'consideration' | 'decision';

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface ArticleImage {
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  credit?: string;
}

export interface ArticleSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: ArticleImage;
  noIndex?: boolean;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface RelatedArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  featuredImage: ArticleImage;
  publishedAt: string;
  readingTime: number;
}

export interface ArticleMetadata {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  author: Author;
  featuredImage: ArticleImage;
  publishedAt: string;
  updatedAt?: string;
  status: ArticleStatus;
  buyerJourneyStage: BuyerJourneyStage;
  readingTime: number;
  wordCount: number;
  seo: ArticleSEO;
  relatedArticles?: RelatedArticle[];
  tableOfContents?: TableOfContentsItem[];
  schemaMarkup?: Record<string, any>;
}

export interface ArticleListItem {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  tags: string[];
  author: Author;
  featuredImage: ArticleImage;
  publishedAt: string;
  readingTime: number;
  buyerJourneyStage: BuyerJourneyStage;
}

export interface CategoryMetadata {
  slug: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface TagMetadata {
  slug: string;
  name: string;
  count: number;
}

export interface BlogAnalytics {
  articleSlug: string;
  views: number;
  averageTimeOnPage: number;
  bounceRate: number;
  socialShares: {
    facebook: number;
    twitter: number;
    linkedin: number;
    email: number;
  };
  conversionRate: number;
  backlinks: number;
  keywordRankings: {
    keyword: string;
    position: number;
    searchVolume: number;
  }[];
}

export interface ContentTemplate {
  name: string;
  description: string;
  structure: string[];
  seoChecklist: string[];
  exampleArticles: string[];
  minWordCount: number;
  recommendedElements: string[];
}
