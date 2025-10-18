/**
 * SEO Utilities - Central Export
 * All SEO functions and utilities in one place
 */

// Schema Generators
export {
  generateProductSchema,
  generateLocalBusinessSchema,
  generateFAQSchema,
  generateServiceSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateReviewSchema,
  generateNeighborhoodSchema,
  generateProductCollectionSchema,
  generateHowToSchema,
} from './schema-generator'

export type {
  ProductSchemaInput,
  FAQItem,
  ServiceSchemaInput,
  BreadcrumbItem,
  ReviewInput,
  HowToStep,
} from './schema-generator'

// Neighborhood Data
export {
  OTTAWA_NEIGHBORHOODS,
  getNeighborhood,
  getNeighborhoodNames,
  getNeighborhoodSlugs,
  getNearbyNeighborhoods,
} from './neighborhoods'

export type { Neighborhood } from './neighborhoods'

// Image SEO
export {
  generateProductAltText,
  generateRoomAltText,
  generateImageMetadata,
  generateImageSizes,
  generateImageSrcSet,
  optimizeImageUrl,
  validateImageSEO,
  generateImageObject,
  batchOptimizeImages,
  IMAGE_WIDTHS,
  IMAGE_QUALITY,
} from './image-seo'

export type {
  ImageMetadata,
  ImageValidation,
  ImageBatchInput,
} from './image-seo'

// Performance SEO
export {
  CORE_WEB_VITALS_THRESHOLDS,
  calculateRating,
  initCoreWebVitals,
  generatePerformanceRecommendations,
  reportWebVitals,
  checkPerformanceBudget,
} from './performance-seo'

export type {
  PerformanceMetric,
  PerformanceRecommendation,
  PerformanceBudget,
} from './performance-seo'

// Internal Linking
export {
  generateRelatedProductLinks,
  generateLocationServiceLinks,
  generateBreadcrumbs,
  generateFooterLinks,
  analyzeLinkEquity,
  generateContextualLinks,
} from './internal-linking'

export type {
  InternalLink,
  LinkRelationship,
  LinkEquity,
} from './internal-linking'

// Search Console Integration
export {
  analyzeSearchConsoleData,
  analyzeQueries,
  generateActionItems,
  analyzeIndexingIssues,
} from './search-console'

export type {
  SearchConsoleMetrics,
  PagePerformance,
  QueryAnalysis,
  SEOActionItem,
  IndexingStatus,
} from './search-console'

// Local Business Schemas (for layout.tsx)
export {
  generateLocalBusinessSchema as generateLocalBusinessSchemaForLayout,
  generateWebSiteSchema as generateWebSiteSchemaForLayout,
  generateOrganizationSchema as generateOrganizationSchemaForLayout,
} from './local-business-schema'
