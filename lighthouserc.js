/**
 * Lighthouse CI Configuration
 *
 * Performance budget and quality gates for PG Closets v2.
 * Runs automated Lighthouse audits in CI/CD pipeline.
 */

module.exports = {
  ci: {
    collect: {
      // Number of runs to perform for each URL
      numberOfRuns: 3,

      // URLs to audit
      url: [
        'http://localhost:3000',                         // Homepage
        'http://localhost:3000/products',                // Products Hub
        'http://localhost:3000/products/bypass',         // Bypass Doors PLP
        'http://localhost:3000/products/bifold',         // Bifold Doors PLP
        'http://localhost:3000/contact',                 // Contact Page
        'http://localhost:3000/about',                   // About Page
        // Add specific PDPs after catalog is populated
        // 'http://localhost:3000/products/bypass/[slug]',
      ],

      // Lighthouse settings
      settings: {
        preset: 'desktop',

        // Additional settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },

        // Form factor
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },

      // Mobile audit configuration
      settingsMobile: {
        preset: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638,
          cpuSlowdownMultiplier: 4,
        },
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false,
        },
      },

      // Start server automatically
      startServerCommand: 'npm run build && npm run start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
    },

    assert: {
      // Use recommended preset as baseline
      preset: 'lighthouse:recommended',

      // Custom assertions based on PG Closets v2 requirements
      assertions: {
        // Core Web Vitals - Desktop
        'largest-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'interaction-to-next-paint': ['error', { maxNumericValue: 200 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'speed-index': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],

        // Performance score
        'categories:performance': ['error', { minScore: 0.9 }],

        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': 'error',
        'heading-order': 'warn',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
        'tap-targets': 'warn',

        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'errors-in-console': 'warn',
        'image-aspect-ratio': 'warn',
        'image-size-responsive': 'warn',
        'no-vulnerable-libraries': 'error',
        'uses-http2': 'warn',
        'uses-passive-event-listeners': 'warn',

        // SEO
        'categories:seo': ['error', { minScore: 0.95 }],
        'canonical': 'error',
        'document-title': 'error',
        'hreflang': 'off', // Not using multi-language
        'meta-description': 'error',
        'robots-txt': 'warn',
        'structured-data': 'warn',

        // Resource optimization
        'modern-image-formats': 'warn',
        'offscreen-images': 'warn',
        'render-blocking-resources': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'uses-optimized-images': 'warn',
        'uses-text-compression': 'error',
        'uses-webp-images': 'warn',

        // Network optimization
        'efficient-animated-content': 'warn',
        'server-response-time': ['warn', { maxNumericValue: 600 }],
        'redirects': 'warn',
        'uses-rel-preconnect': 'warn',

        // Bundle size
        'bootup-time': ['warn', { maxNumericValue: 3000 }],
        'mainthread-work-breakdown': ['warn', { maxNumericValue: 4000 }],
        'total-byte-weight': ['warn', { maxNumericValue: 1500000 }],

        // Disable overly strict checks for lead-gen site
        'maskable-icon': 'off',
        'themed-omnibox': 'off',
        'installable-manifest': 'off',
        'apple-touch-icon': 'off',
        'splash-screen': 'off',
      },
    },

    upload: {
      // Upload results to Lighthouse CI server (temporary public storage for now)
      target: 'temporary-public-storage',

      // Or use LHCI server if available
      // target: 'lhci',
      // serverBaseUrl: process.env.LHCI_SERVER_URL,
      // token: process.env.LHCI_TOKEN,
    },

    // Server configuration (if using LHCI server)
    server: {
      // port: 9001,
      // storage: {
      //   storageMethod: 'sql',
      //   sqlDialect: 'postgres',
      //   sqlConnectionUrl: process.env.DATABASE_URL,
      // },
    },
  },
}
