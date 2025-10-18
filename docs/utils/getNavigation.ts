import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface NavigationItem {
  slug: string;
  title: string;
  label?: string;
  icon?: string;
  keywords?: string;
  children?: NavigationItem[];
  order?: number;
}

interface MetaData {
  title?: string;
  order?: number;
  pages?: Record<string, number>;
}

/**
 * Sort navigation items consistently
 * Priority: files > directories, ordered items > unordered, alphabetical fallback
 */
function sortItems(items: NavigationItem[]): NavigationItem[] {
  return items.sort((a, b) => {
    const aIsCategory = !!a.children;
    const bIsCategory = !!b.children;

    // Prioritize files over directories
    if (!aIsCategory && bIsCategory) return -1;
    if (aIsCategory && !bIsCategory) return 1;

    // Prioritize ordered items
    const aHasOrder = typeof a.order === 'number';
    const bHasOrder = typeof b.order === 'number';

    if (aHasOrder && !bHasOrder) return -1;
    if (!aHasOrder && bHasOrder) return 1;

    if (aHasOrder && bHasOrder && a.order !== b.order) {
      return a.order! - b.order!;
    }

    // Alphabetical fallback
    return a.title.localeCompare(b.title);
  });
}

/**
 * Generate navigation structure from /docs/content directory
 */
export default function getNavigation(
  dirPath = path.join(process.cwd(), 'docs/content')
): NavigationItem[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  // Load directory meta.json if exists
  const dirMetaPath = path.join(dirPath, 'meta.json');
  let dirMeta: MetaData | null = null;

  try {
    if (fs.existsSync(dirMetaPath)) {
      const metaContent = fs.readFileSync(dirMetaPath, 'utf8');
      dirMeta = JSON.parse(metaContent);
    }
  } catch (error) {
    console.error(`Error reading directory meta.json in ${dirPath}:`, error);
  }

  const navigationItems = entries
    .map((entry) => {
      // Skip meta.json files
      if (entry.name === 'meta.json') {
        return null;
      }

      const fullPath = path.join(dirPath, entry.name);

      // Handle directories (categories)
      if (entry.isDirectory()) {
        const metaPath = path.join(fullPath, 'meta.json');
        let metaData: MetaData | null = null;

        try {
          if (fs.existsSync(metaPath)) {
            const metaContent = fs.readFileSync(metaPath, 'utf8');
            metaData = JSON.parse(metaContent);
          }
        } catch (error) {
          console.error(`Error reading meta.json in ${fullPath}:`, error);
        }

        // Recursively get children
        const children = getNavigation(fullPath);

        return {
          slug: entry.name,
          title: metaData?.title || entry.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          order: metaData?.order,
          children,
        };
      }

      // Handle MDX files
      if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        const filenameNoExt = entry.name.replace(/\.mdx$/, '');

        // Check for page order from directory meta
        let pageOrder: number | undefined;
        if (dirMeta?.pages?.[entry.name] !== undefined) {
          pageOrder = dirMeta.pages[entry.name];
        } else if (dirMeta?.pages?.[filenameNoExt] !== undefined) {
          pageOrder = dirMeta.pages[filenameNoExt];
        }

        // Calculate relative path from content directory
        const contentDir = path.join(process.cwd(), 'docs/content');
        const relativePath = path.relative(contentDir, fullPath);
        const normalizedPath = relativePath.replace(/\\/g, '/').replace(/\.mdx?$/, '');

        return {
          slug: normalizedPath,
          title: data.title || filenameNoExt.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          label: data.label,
          icon: data.icon,
          keywords: data.keywords,
          order: pageOrder !== undefined ? pageOrder : data.order,
        };
      }

      return null;
    })
    .filter(Boolean) as NavigationItem[];

  return sortItems(navigationItems);
}
