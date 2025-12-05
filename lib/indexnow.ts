/**
 * IndexNow - Instant Indexing for Search Engines
 * Notifies search engines immediately when pages are created or updated
 */

const INDEXNOW_KEY = 'f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6';
const SITE_HOST = 'www.pgclosets.com';
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;

interface IndexNowResult {
  success: boolean;
  engine: string;
  status?: number;
  error?: string;
}

interface IndexNowSubmission {
  results: IndexNowResult[];
  urlsSubmitted: number;
  successCount: number;
  failedCount: number;
}

const SEARCH_ENGINES = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrl(url: string): Promise<IndexNowSubmission> {
  return submitUrls([url]);
}

/**
 * Submit multiple URLs to IndexNow (max 10,000 per request)
 */
export async function submitUrls(urls: string[]): Promise<IndexNowSubmission> {
  if (urls.length === 0) {
    return {
      results: [],
      urlsSubmitted: 0,
      successCount: 0,
      failedCount: 0,
    };
  }

  // Ensure all URLs are properly formatted
  const formattedUrls = urls.map((url) => {
    if (url.startsWith('http')) return url;
    return `https://${SITE_HOST}${url.startsWith('/') ? url : `/${url}`}`;
  });

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: formattedUrls.slice(0, 10000), // API limit
  };

  const results: IndexNowResult[] = [];

  // Submit to all search engines in parallel
  await Promise.all(
    SEARCH_ENGINES.map(async (engine) => {
      try {
        const response = await fetch(engine, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        results.push({
          success: response.ok || response.status === 202,
          engine: new URL(engine).hostname,
          status: response.status,
        });
      } catch (error) {
        results.push({
          success: false,
          engine: new URL(engine).hostname,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    })
  );

  const successCount = results.filter((r) => r.success).length;

  return {
    results,
    urlsSubmitted: formattedUrls.length,
    successCount,
    failedCount: results.length - successCount,
  };
}

/**
 * Get all important URLs from the sitemap for submission
 */
export async function getAllSitemapUrls(): Promise<string[]> {
  const urls: string[] = [
    '/',
    '/products',
    '/closets',
    '/about',
    '/contact',
    '/gallery',
    '/services',
    '/blog',
    '/quote',
    '/faq',
    // Product categories
    '/products/closet-doors',
    '/products/closet-systems',
    '/products/organizers',
    '/products/accessories',
    // Service pages
    '/services/custom-closets',
    '/services/walk-in-closets',
    '/services/reach-in-closets',
    '/services/wardrobe-systems',
    // Location pages
    '/locations/ottawa',
    '/locations/gatineau',
    '/locations/kanata',
    '/locations/orleans',
  ];

  return urls;
}

/**
 * Submit all important pages to IndexNow
 */
export async function submitAllPages(): Promise<IndexNowSubmission> {
  const urls = await getAllSitemapUrls();
  return submitUrls(urls);
}

export { INDEXNOW_KEY, SITE_HOST };
