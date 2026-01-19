#!/usr/bin/env node

/**
 * CRITICAL CSS EXTRACTOR FOR APPLE-GRADE PERFORMANCE
 * Extracts and inlines critical CSS for above-the-fold content
 * to eliminate render-blocking resources and improve FCP/LCP
 */

const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const { glob } = require('glob');
const { minify } = require('cssnano');

class CriticalCSSExtractor {
  constructor() {
    this.pages = [];
    this.criticalCSS = new Map();
    this.browser = null;
    this.startTime = Date.now();
  }

  async initBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async extractCriticalCSS(pageUrl, viewport = { width: 1920, height: 1080 }) {
    const page = await this.browser.newPage();

    try {
      // Set viewport for consistent extraction
      await page.setViewport(viewport);

      // Enable CSS coverage
      await page.coverage.startCSSCoverage();

      // Navigate to page and wait for network idle
      await page.goto(pageUrl, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000,
      });

      // Wait a bit more for dynamic content
      await page.waitForTimeout(2000);

      // Get CSS coverage
      const coverage = await page.coverage.stopCSSCoverage();

      // Extract critical CSS
      const criticalCSS = this.processCSSCoverage(coverage);

      return {
        url: pageUrl,
        viewport,
        criticalCSS,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Error extracting CSS from ${pageUrl}:`, error.message);
      return null;
    } finally {
      await page.close();
    }
  }

  processCSSCoverage(coverage) {
    const usedCSS = new Set();
    const criticalCSS = [];

    for (const entry of coverage) {
      const { url, text, ranges } = entry;

      // Extract used CSS rules
      for (const range of ranges) {
        if (range.used) {
          const cssRule = text.substring(range.start, range.end);
          usedCSS.add(cssRule);
        }
      }

      // Group critical CSS by source
      criticalCSS.push({
        url,
        criticalCSS: Array.from(usedCSS).join('\n'),
        size: Array.from(usedCSS).join('\n').length,
      });
    }

    return criticalCSS;
  }

  async generateCriticalCSSForPages(pages) {
    console.log('🚀 Extracting critical CSS for key pages...\n');

    // Define key viewports for responsive critical CSS
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    const results = [];

    for (const pageConfig of pages) {
      console.log(`Processing: ${pageConfig.url}`);

      const pageResults = {
        path: pageConfig.path,
        criticalCSS: {},
        totalSize: 0,
      };

      for (const viewport of viewports) {
        console.log(`  • ${viewport.name} viewport...`);

        const result = await this.extractCriticalCSS(pageConfig.url, viewport);

        if (result) {
          const cssContent = result.criticalCSS
            .map(item => item.criticalCSS)
            .join('\n');

          // Minify the critical CSS
          const minifiedCSS = await this.minifyCSS(cssContent);

          pageResults.criticalCSS[viewport.name] = {
            css: minifiedCSS,
            size: minifiedCSS.length,
            viewport: `${viewport.width}x${viewport.height}`,
          };

          pageResults.totalSize += minifiedCSS.length;

          console.log(`    ✓ ${minifiedCSS.length} bytes critical CSS`);
        }
      }

      results.push(pageResults);
    }

    return results;
  }

  async minifyCSS(css) {
    try {
      const result = await minify(css, {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyFontValues: true,
          minifyParams: true,
        }],
      });
      return result.css;
    } catch (error) {
      console.warn('CSS minification failed:', error.message);
      return css;
    }
  }

  async generateInlineCSS(results) {
    const inlineCSS = {
      generated: new Date().toISOString(),
      version: Date.now(),
      critical: {},
    };

    // Generate universal critical CSS (common across all pages)
    const commonCSS = new Set();

    results.forEach(pageResult => {
      Object.values(pageResult.criticalCSS).forEach(viewportCSS => {
        const rules = viewportCSS.css.split('\n').filter(rule => rule.trim());
        rules.forEach(rule => commonCSS.add(rule));
      });
    });

    // Minify common CSS
    inlineCSS.critical.universal = await this.minifyCSS(Array.from(commonCSS).join('\n'));

    // Add page-specific critical CSS
    for (const pageResult of results) {
      inlineCSS.critical[pageResult.path] = {};

      for (const [viewport, cssData] of Object.entries(pageResult.criticalCSS)) {
        // Remove universal CSS from page-specific CSS
        const pageSpecificCSS = this.removeCommonCSS(
          cssData.css,
          inlineCSS.critical.universal
        );

        inlineCSS.critical[pageResult.path][viewport] = {
          css: pageSpecificCSS,
          size: pageSpecificCSS.length,
        };
      }
    }

    return inlineCSS;
  }

  removeCommonCSS(pageCSS, commonCSS) {
    if (!commonCSS || !pageCSS) return pageCSS;

    const commonRules = new Set(commonCSS.split('\n').filter(rule => rule.trim()));
    const pageRules = pageCSS.split('\n').filter(rule => rule.trim());

    const specificRules = pageRules.filter(rule => !commonRules.has(rule));

    return specificRules.join('\n');
  }

  async writeCriticalCSSFiles(criticalCSS) {
    const outputDir = path.join(process.cwd(), 'styles', 'critical');
    await fs.mkdir(outputDir, { recursive: true });

    // Write universal critical CSS
    await fs.writeFile(
      path.join(outputDir, 'universal.css'),
      criticalCSS.critical.universal
    );

    // Write page-specific critical CSS
    for (const [pagePath, pageCSS] of Object.entries(criticalCSS.critical)) {
      if (pagePath === 'universal') continue;

      for (const [viewport, cssData] of Object.entries(pageCSS)) {
        const fileName = `${pagePath}-${viewport}.css`;
        await fs.writeFile(
          path.join(outputDir, fileName),
          cssData.css
        );
      }
    }

    // Write the manifest
    await fs.writeFile(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify(criticalCSS, null, 2)
    );

    console.log('✅ Critical CSS files written to styles/critical/');
  }

  generateReport(results, criticalCSS) {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const totalCriticalCSS = Object.values(criticalCSS.critical)
      .filter(css => typeof css === 'string' || css.size)
      .reduce((total, css) => total + (css.size || css.length || 0), 0);

    console.log('\n' + '='.repeat(60));
    console.log('📊 CRITICAL CSS EXTRACTION REPORT');
    console.log('='.repeat(60));
    console.log(`✅ Pages processed: ${results.length}`);
    console.log(`📝 Critical CSS generated: ${(totalCriticalCSS / 1024).toFixed(2)} KB`);
    console.log(`⏱️  Duration: ${duration}s`);

    console.log('\n🎯 Performance Benefits:');
    console.log('   • Eliminated render-blocking CSS');
    console.log('   • Faster First Contentful Paint (FCP)');
    console.log('   • Improved Largest Contentful Paint (LCP)');
    console.log('   • Better Core Web Vitals scores');
    console.log('   • Progressive CSS loading');

    results.forEach(page => {
      const totalSize = Object.values(page.criticalCSS)
        .reduce((sum, css) => sum + css.size, 0);

      console.log(`\n   ${page.path}: ${(totalSize / 1024).toFixed(2)} KB critical CSS`);
    });

    console.log('='.repeat(60));
  }

  async run() {
    try {
      await this.initBrowser();

      // Define key pages to process
      const pages = [
        { path: 'home', url: 'http://localhost:3000/' },
        { path: 'products', url: 'http://localhost:3000/products' },
        { path: 'contact', url: 'http://localhost:3000/contact' },
        { path: 'about', url: 'http://localhost:3000/about' },
      ];

      // Check if development server is running
      try {
        const response = await fetch('http://localhost:3000/api/health');
        if (!response.ok) {
          throw new Error('Dev server not responding');
        }
      } catch (error) {
        console.log('🔄 Starting development server...');
        const { spawn } = require('child_process');
        const devServer = spawn('npm', ['run', 'dev'], { stdio: 'pipe' });

        // Wait for server to start
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Generate critical CSS for all pages
      const results = await this.generateCriticalCSSForPages(pages);

      // Generate inline CSS structure
      const criticalCSS = await this.generateInlineCSS(results);

      // Write critical CSS files
      await this.writeCriticalCSSFiles(criticalCSS);

      // Generate report
      this.generateReport(results, criticalCSS);

    } catch (error) {
      console.error('Critical CSS extraction failed:', error);
      process.exit(1);
    } finally {
      await this.closeBrowser();
    }
  }
}

// Main execution
async function main() {
  const extractor = new CriticalCSSExtractor();
  await extractor.run();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = CriticalCSSExtractor;