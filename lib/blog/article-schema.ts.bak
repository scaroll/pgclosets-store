/**
 * SEO Schema Markup Generation for Blog Articles
 * Generates comprehensive JSON-LD structured data for optimal SEO
 */

import type { ArticleMetadata } from './types';

export interface ArticleSchemaProps {
  article: ArticleMetadata;
  siteUrl: string;
  organizationName: string;
  organizationLogo: string;
}

/**
 * Generate Article schema markup
 */
export function generateArticleSchema({
  article,
  siteUrl,
  organizationName,
  organizationLogo,
}: ArticleSchemaProps) {
  const articleUrl = `${siteUrl}/blog/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: {
      '@type': 'ImageObject',
      url: article.featuredImage.url,
      width: article.featuredImage.width,
      height: article.featuredImage.height,
      caption: article.featuredImage.caption,
    },
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
      image: article.author.image,
      ...(article.author.email && { email: article.author.email }),
    },
    publisher: {
      '@type': 'Organization',
      name: organizationName,
      logo: {
        '@type': 'ImageObject',
        url: organizationLogo,
      },
    },
    datePublished: article.publishedAt,
    ...(article.updatedAt && { dateModified: article.updatedAt }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
    wordCount: article.wordCount,
    timeRequired: `PT${article.readingTime}M`,
  };
}

/**
 * Generate BreadcrumbList schema markup
 */
export function generateBreadcrumbSchema({
  article,
  siteUrl,
}: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category,
        item: `${siteUrl}/blog/category/${article.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: `${siteUrl}/blog/${article.slug}`,
      },
    ],
  };
}

/**
 * Generate Organization schema markup for author credibility
 */
export function generateOrganizationSchema({
  organizationName,
  organizationLogo,
  siteUrl,
}: {
  organizationName: string;
  organizationLogo: string;
  siteUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organizationName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: organizationLogo,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-613-555-0100',
      contactType: 'Customer Service',
      areaServed: 'CA',
      availableLanguage: ['English', 'French'],
    },
    sameAs: [
      'https://www.facebook.com/pgclosets',
      'https://www.instagram.com/pgclosets',
      'https://www.linkedin.com/company/pgclosets',
    ],
  };
}

/**
 * Generate FAQ schema markup for articles with FAQ sections
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate HowTo schema markup for guide articles
 */
export function generateHowToSchema({
  name,
  description,
  totalTime,
  steps,
  tools,
  supplies,
}: {
  name: string;
  description: string;
  totalTime: string;
  steps: { name: string; text: string; image?: string }[];
  tools?: string[];
  supplies?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    ...(tools && tools.length > 0 && {
      tool: tools.map((tool) => ({ '@type': 'HowToTool', name: tool })),
    }),
    ...(supplies && supplies.length > 0 && {
      supply: supplies.map((supply) => ({
        '@type': 'HowToSupply',
        name: supply,
      })),
    }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image,
        },
      }),
    })),
  };
}

/**
 * Generate all schema markup for an article
 */
export function generateAllSchemas(props: ArticleSchemaProps) {
  return {
    article: generateArticleSchema(props),
    breadcrumb: generateBreadcrumbSchema(props),
    organization: generateOrganizationSchema({
      organizationName: props.organizationName,
      organizationLogo: props.organizationLogo,
      siteUrl: props.siteUrl,
    }),
  };
}

/**
 * Convert schema object to JSON-LD script tag
 */
export function schemaToScript(schema: Record<string, any>) {
  return {
    __html: JSON.stringify(schema),
  };
}
