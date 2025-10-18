/**
 * Internal Linking System
 * Automatic link suggestions and SEO optimization
 */

import type { ArticleMetadata, ArticleListItem } from './types';

/**
 * Calculate relevance score between two articles
 */
function calculateRelevanceScore(article1: ArticleListItem, article2: ArticleListItem): number {
  let score = 0;

  // Same category = +50 points
  if (article1.category === article2.category) {
    score += 50;
  }

  // Shared tags = +10 points per tag
  const sharedTags = article1.tags.filter((tag) => article2.tags.includes(tag));
  score += sharedTags.length * 10;

  // Same buyer journey stage = +20 points
  if (article1.buyerJourneyStage === article2.buyerJourneyStage) {
    score += 20;
  }

  return score;
}

/**
 * Get related articles based on tags, category, and buyer journey
 */
export function getRelatedArticles(
  currentArticle: ArticleListItem,
  allArticles: ArticleListItem[],
  limit: number = 3
): ArticleListItem[] {
  const scoredArticles = allArticles
    .filter((article) => article.slug !== currentArticle.slug)
    .map((article) => ({
      article,
      score: calculateRelevanceScore(currentArticle, article),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredArticles.map((item) => item.article);
}

/**
 * Generate contextual link suggestions based on article content
 */
export interface LinkSuggestion {
  keyword: string;
  targetSlug: string;
  targetTitle: string;
  relevanceScore: number;
}

export function generateLinkSuggestions(
  content: string,
  allArticles: ArticleListItem[],
  currentSlug: string
): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];

  allArticles
    .filter((article) => article.slug !== currentSlug)
    .forEach((article) => {
      // Check if article title appears in content
      const titleOccurrences = countOccurrences(content, article.title);
      if (titleOccurrences > 0) {
        suggestions.push({
          keyword: article.title,
          targetSlug: article.slug,
          targetTitle: article.title,
          relevanceScore: titleOccurrences * 10,
        });
      }

      // Check if article tags appear in content
      article.tags.forEach((tag) => {
        const tagOccurrences = countOccurrences(content, tag);
        if (tagOccurrences > 0) {
          suggestions.push({
            keyword: tag,
            targetSlug: article.slug,
            targetTitle: article.title,
            relevanceScore: tagOccurrences * 5,
          });
        }
      });
    });

  // Sort by relevance and remove duplicates
  return suggestions
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .filter(
      (suggestion, index, self) =>
        index === self.findIndex((s) => s.targetSlug === suggestion.targetSlug)
    )
    .slice(0, 10);
}

/**
 * Count occurrences of a phrase in content (case-insensitive)
 */
function countOccurrences(content: string, phrase: string): number {
  const regex = new RegExp(phrase, 'gi');
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Detect orphan pages (articles with no internal links)
 */
export function detectOrphanPages(allArticles: ArticleMetadata[]): string[] {
  const linkedSlugs = new Set<string>();

  allArticles.forEach((article) => {
    // Extract internal links from content
    const linkRegex = /href="\/blog\/([^"]+)"/g;
    let match;
    while ((match = linkRegex.exec(article.content)) !== null) {
      linkedSlugs.add(match[1]);
    }

    // Add related articles
    article.relatedArticles?.forEach((related) => {
      linkedSlugs.add(related.slug);
    });
  });

  // Find articles with no incoming links
  return allArticles
    .filter((article) => !linkedSlugs.has(article.slug))
    .map((article) => article.slug);
}

/**
 * Calculate link equity distribution
 */
export interface LinkEquity {
  slug: string;
  incomingLinks: number;
  outgoingLinks: number;
  equityScore: number;
}

export function calculateLinkEquity(allArticles: ArticleMetadata[]): LinkEquity[] {
  const linkCounts = new Map<string, { incoming: number; outgoing: number }>();

  // Initialize counts
  allArticles.forEach((article) => {
    linkCounts.set(article.slug, { incoming: 0, outgoing: 0 });
  });

  // Count links
  allArticles.forEach((article) => {
    const linkRegex = /href="\/blog\/([^"]+)"/g;
    let match;
    while ((match = linkRegex.exec(article.content)) !== null) {
      const targetSlug = match[1];
      const counts = linkCounts.get(article.slug);
      const targetCounts = linkCounts.get(targetSlug);

      if (counts) counts.outgoing++;
      if (targetCounts) targetCounts.incoming++;
    }

    // Count related article links
    article.relatedArticles?.forEach((related) => {
      const counts = linkCounts.get(article.slug);
      const targetCounts = linkCounts.get(related.slug);

      if (counts) counts.outgoing++;
      if (targetCounts) targetCounts.incoming++;
    });
  });

  // Calculate equity scores
  return Array.from(linkCounts.entries()).map(([slug, counts]) => ({
    slug,
    incomingLinks: counts.incoming,
    outgoingLinks: counts.outgoing,
    equityScore: counts.incoming * 2 + counts.outgoing,
  })).sort((a, b) => b.equityScore - a.equityScore);
}

/**
 * Generate hub-and-spoke content structure
 */
export interface HubArticle {
  pillarSlug: string;
  clusterSlugs: string[];
  completeness: number; // 0-100
}

export function generateHubStructure(
  allArticles: ArticleListItem[]
): HubArticle[] {
  const hubs: HubArticle[] = [];

  // Group articles by category (pillar)
  const categoriesMap = new Map<string, ArticleListItem[]>();

  allArticles.forEach((article) => {
    const existing = categoriesMap.get(article.category) || [];
    categoriesMap.set(article.category, [...existing, article]);
  });

  // Create hub structures
  categoriesMap.forEach((articles, category) => {
    // Find comprehensive article as pillar (longest content)
    const pillar = articles.reduce((longest, current) =>
      (current.excerpt.length > longest.excerpt.length) ? current : longest
    );

    const clusterSlugs = articles
      .filter((a) => a.slug !== pillar.slug)
      .map((a) => a.slug);

    hubs.push({
      pillarSlug: pillar.slug,
      clusterSlugs,
      completeness: (clusterSlugs.length / 10) * 100, // Aim for 10 cluster articles
    });
  });

  return hubs;
}

/**
 * Suggest internal links to add to an article
 */
export function suggestInternalLinks(
  article: ArticleMetadata,
  allArticles: ArticleListItem[],
  maxSuggestions: number = 5
): LinkSuggestion[] {
  // Generate suggestions based on content
  const suggestions = generateLinkSuggestions(
    article.content,
    allArticles,
    article.slug
  );

  // Filter out already existing links
  const existingLinks = new Set<string>();
  const linkRegex = /href="\/blog\/([^"]+)"/g;
  let match;
  while ((match = linkRegex.exec(article.content)) !== null) {
    existingLinks.add(match[1]);
  }

  return suggestions
    .filter((suggestion) => !existingLinks.has(suggestion.targetSlug))
    .slice(0, maxSuggestions);
}
