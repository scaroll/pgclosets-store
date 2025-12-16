// @ts-nocheck - Docs utility with relaxed types
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PageMetadata {
  title: string;
  summary?: string;
  updatedAt?: string;
  image?: string;
  keywords?: string;
  order?: number;
  icon?: string;
  label?: string;
}

export interface Page {
  slug: string;
  content: string;
  metadata: PageMetadata;
}

/**
 * Get all MDX pages from docs/content directory
 */
export function getPages(dirPath = path.join(process.cwd(), 'docs/content')): Page[] {
  const pages: Page[] = [];

  function readDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        readDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const contentDir = path.join(process.cwd(), 'docs/content');
        const relativePath = path.relative(contentDir, fullPath);
        const slug = relativePath.replace(/\\/g, '/').replace(/\.mdx?$/, '');

        pages.push({
          slug,
          content,
          metadata: {
            title: data.title || 'Untitled',
            summary: data.summary,
            updatedAt: data.updatedAt,
            image: data.image,
            keywords: data.keywords,
            order: data.order,
            icon: data.icon,
            label: data.label,
          },
        });
      }
    }
  }

  readDirectory(dirPath);
  return pages;
}

/**
 * Get a single page by slug
 */
export function getPageBySlug(slug: string): Page | null {
  const pages = getPages();
  return pages.find((page) => page.slug === slug) || null;
}

/**
 * Get adjacent pages (previous and next) for navigation
 */
export function getAdjacentPages(
  currentSlug: string,
  scope: 'section' | 'all' = 'all'
): { prevPage: Page | null; nextPage: Page | null } {
  const pages = getPages();
  const currentIndex = pages.findIndex((page) => page.slug === currentSlug);

  if (currentIndex === -1) {
    return { prevPage: null, nextPage: null };
  }

  let prevPage: Page | null = null;
  let nextPage: Page | null = null;

  if (scope === 'section') {
    const currentSection = currentSlug.split('/')[0];
    const sectionPages = pages.filter((page) => page.slug.startsWith(currentSection));
    const sectionIndex = sectionPages.findIndex((page) => page.slug === currentSlug);

    if (sectionIndex > 0) {
      prevPage = sectionPages[sectionIndex - 1];
    }
    if (sectionIndex < sectionPages.length - 1) {
      nextPage = sectionPages[sectionIndex + 1];
    }
  } else {
    if (currentIndex > 0) {
      prevPage = pages[currentIndex - 1];
    }
    if (currentIndex < pages.length - 1) {
      nextPage = pages[currentIndex + 1];
    }
  }

  return { prevPage, nextPage };
}

/**
 * Format date for display
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
