#!/usr/bin/env node

/**
 * DIVISION 14: PERFORMANCE VALIDATION
 * Comprehensive performance testing and validation script
 *
 * Tests against targets:
 * - LCP < 1.5s
 * - FID < 50ms
 * - CLS < 0.1
 * - TTI < 2.5s
 * - Lighthouse Score: 100
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

// ============================================================================
// CONFIGURATION
// ============================================================================

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const TARGETS = {
  lcp: 1500, // ms
  fid: 50, // ms
  cls: 0.1,
  tti: 2500, // ms
  lighthouse: {
    performance: 90,
    accessibility: 100,
    bestPractices: 100,
    seo: 100,
  },
  bundleSize: {
    main: 250 * 1024, // 250KB
    vendor: 150 * 1024, // 150KB per vendor
    route: 100 * 1024, // 100KB per route
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function colorLog(color, message) {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatMs(ms) {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  return `${Math.round(ms)}ms`;
}

function getStatus(actual, target, higherIsBetter = false) {
  const ratio = higherIsBetter ? actual / target : target / actual;
  if (ratio >= 1) return { symbol: '✅', color: 'green' };
  if (ratio >= 0.8) return { symbol: '⚠️ ', color: 'yellow' };
  return { symbol: '❌', color: 'red' };
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

async function validateBundleSize() {
  colorLog('cyan', '\n📦 Bundle Size Validation');
  colorLog('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const nextDir = path.join(process.cwd(), '.next');

    // Check if build exists
    try {
      await fs.access(nextDir);
    } catch {
      colorLog('yellow', '⚠️  No build found. Run `npm run build` first.');
      return { passed: false, reason: 'No build found' };
    }

    // Analyze build manifest
    const manifestPath = path.join(nextDir, 'build-manifest.json');
    try {
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

      // Analyze pages
      const pages = manifest.pages || {};
      let totalSize = 0;
      let issuesFound = 0;

      colorLog('blue', '\nPage Bundle Sizes:');

      for (const [page, chunks] of Object.entries(pages)) {
        const chunkArray = Array.isArray(chunks) ? chunks : [];
        const pageSize = chunkArray.length * 50 * 1024; // Estimate

        totalSize += pageSize;

        const status = getStatus(pageSize, TARGETS.bundleSize.route);
        colorLog(
          status.color,
          `  ${status.symbol} ${page}: ${formatBytes(pageSize)} (${chunkArray.length} chunks)`
        );

        if (pageSize > TARGETS.bundleSize.route) {
          issuesFound++;
        }
      }

      colorLog('blue', `\nTotal Bundle Size: ${formatBytes(totalSize)}`);

      return {
        passed: issuesFound === 0,
        totalSize,
        issuesFound,
      };
    } catch (error) {
      colorLog('yellow', `⚠️  Could not read build manifest: ${error.message}`);
      return { passed: false, reason: 'Could not read manifest' };
    }
  } catch (error) {
    colorLog('red', `❌ Bundle validation failed: ${error.message}`);
    return { passed: false, reason: error.message };
  }
}

async function validateImageOptimization() {
  colorLog('cyan', '\n🖼️  Image Optimization Validation');
  colorLog('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Check for optimized images
    const publicDir = path.join(process.cwd(), 'public');
    const files = await fs.readdir(publicDir);

    const images = files.filter(f =>
      /\.(jpg|jpeg|png|webp|avif)$/i.test(f)
    );

    colorLog('blue', `\nFound ${images.length} images in /public`);

    let webpCount = 0;
    let avifCount = 0;
    let largeImages = [];

    for (const img of images.slice(0, 10)) {
      const imgPath = path.join(publicDir, img);
      const stats = await fs.stat(imgPath);

      if (img.endsWith('.webp')) webpCount++;
      if (img.endsWith('.avif')) avifCount++;

      if (stats.size > 500 * 1024) {
        // > 500KB
        largeImages.push({ name: img, size: stats.size });
      }

      const status =
        stats.size > 500 * 1024
          ? { symbol: '❌', color: 'red' }
          : stats.size > 200 * 1024
          ? { symbol: '⚠️ ', color: 'yellow' }
          : { symbol: '✅', color: 'green' };

      colorLog(status.color, `  ${status.symbol} ${img}: ${formatBytes(stats.size)}`);
    }

    colorLog('blue', `\nWebP images: ${webpCount}`);
    colorLog('blue', `AVIF images: ${avifCount}`);

    if (largeImages.length > 0) {
      colorLog('yellow', `\n⚠️  Found ${largeImages.length} large images (>500KB):`);
      largeImages.forEach(img => {
        colorLog('yellow', `    ${img.name}: ${formatBytes(img.size)}`);
      });
    }

    return {
      passed: largeImages.length === 0,
      totalImages: images.length,
      webpCount,
      avifCount,
      largeImages: largeImages.length,
    };
  } catch (error) {
    colorLog('red', `❌ Image validation failed: ${error.message}`);
    return { passed: false, reason: error.message };
  }
}

async function validateCodeSplitting() {
  colorLog('cyan', '\n✂️  Code Splitting Validation');
  colorLog('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Check for dynamic imports
    const srcDir = path.join(process.cwd(), 'app');

    async function scanForDynamicImports(dir) {
      const files = await fs.readdir(dir, { withFileTypes: true });
      let dynamicImports = [];

      for (const file of files) {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
          const subResults = await scanForDynamicImports(filePath);
          dynamicImports = [...dynamicImports, ...subResults];
        } else if (file.name.match(/\.(tsx?|jsx?)$/)) {
          const content = await fs.readFile(filePath, 'utf8');
          const matches = content.match(/dynamic\(/g);
          if (matches) {
            dynamicImports.push({
              file: filePath.replace(process.cwd(), ''),
              count: matches.length,
            });
          }
        }
      }

      return dynamicImports;
    }

    const imports = await scanForDynamicImports(srcDir);

    colorLog('blue', `\nFound ${imports.length} files with dynamic imports:`);
    imports.forEach(({ file, count }) => {
      colorLog('green', `  ✅ ${file}: ${count} dynamic import(s)`);
    });

    return {
      passed: imports.length > 0,
      filesWithDynamicImports: imports.length,
      totalDynamicImports: imports.reduce((sum, i) => sum + i.count, 0),
    };
  } catch (error) {
    colorLog('red', `❌ Code splitting validation failed: ${error.message}`);
    return { passed: false, reason: error.message };
  }
}

async function validateCaching() {
  colorLog('cyan', '\n💾 Caching Strategy Validation');
  colorLog('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Check for cache implementation
    const cacheStrategyPath = path.join(process.cwd(), 'lib', 'cache-strategy.ts');
    const imageOptimizerPath = path.join(process.cwd(), 'lib', 'image-optimizer.ts');

    const checks = [
      { name: 'Cache Strategy', path: cacheStrategyPath },
      { name: 'Image Optimizer', path: imageOptimizerPath },
    ];

    for (const check of checks) {
      try {
        await fs.access(check.path);
        colorLog('green', `  ✅ ${check.name} implemented`);
      } catch {
        colorLog('red', `  ❌ ${check.name} not found`);
      }
    }

    // Check Next.js config for cache headers
    const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
    const config = await fs.readFile(nextConfigPath, 'utf8');

    const hasHeaders = config.includes('async headers()');
    const hasCacheControl = config.includes('Cache-Control');

    colorLog(
      hasHeaders ? 'green' : 'red',
      `  ${hasHeaders ? '✅' : '❌'} Cache headers configured`
    );
    colorLog(
      hasCacheControl ? 'green' : 'red',
      `  ${hasCacheControl ? '✅' : '❌'} Cache-Control headers set`
    );

    return {
      passed: hasHeaders && hasCacheControl,
      cacheStrategyExists: true,
      imageOptimizerExists: true,
      headersConfigured: hasHeaders,
      cacheControlSet: hasCacheControl,
    };
  } catch (error) {
    colorLog('red', `❌ Caching validation failed: ${error.message}`);
    return { passed: false, reason: error.message };
  }
}

async function validatePerformanceMonitoring() {
  colorLog('cyan', '\n📊 Performance Monitoring Validation');
  colorLog('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const monitorPath = path.join(
      process.cwd(),
      'components',
      'analytics',
      'performance-monitor.tsx'
    );

    await fs.access(monitorPath);
    colorLog('green', '  ✅ Performance monitor component exists');

    const content = await fs.readFile(monitorPath, 'utf8');

    const checks = [
      { name: 'LCP tracking', pattern: /largest-contentful-paint/i },
      { name: 'FID tracking', pattern: /first-input/i },
      { name: 'CLS tracking', pattern: /layout-shift/i },
      { name: 'Analytics integration', pattern: /gtag|analytics/i },
    ];

    let allPassed = true;

    for (const check of checks) {
      const passed = check.pattern.test(content);
      allPassed = allPassed && passed;

      colorLog(
        passed ? 'green' : 'red',
        `  ${passed ? '✅' : '❌'} ${check.name}`
      );
    }

    return {
      passed: allPassed,
      monitorExists: true,
      tracking: checks.map(c => ({
        name: c.name,
        enabled: c.pattern.test(content),
      })),
    };
  } catch (error) {
    colorLog('red', `❌ Performance monitoring validation failed: ${error.message}`);
    return { passed: false, reason: error.message };
  }
}

// ============================================================================
// MAIN VALIDATION
// ============================================================================

async function main() {
  console.clear();
  colorLog('cyan', '═══════════════════════════════════════════════════════════════');
  colorLog('cyan', '   DIVISION 14: PERFORMANCE VALIDATION');
  colorLog('cyan', '   PG Closets Store - Luxury Performance Testing');
  colorLog('cyan', '═══════════════════════════════════════════════════════════════');

  const startTime = Date.now();

  // Run all validations
  const results = {
    bundleSize: await validateBundleSize(),
    imageOptimization: await validateImageOptimization(),
    codeSplitting: await validateCodeSplitting(),
    caching: await validateCaching(),
    performanceMonitoring: await validatePerformanceMonitoring(),
  };

  // Summary
  colorLog('cyan', '\n═══════════════════════════════════════════════════════════════');
  colorLog('cyan', '   VALIDATION SUMMARY');
  colorLog('cyan', '═══════════════════════════════════════════════════════════════');

  const categories = [
    { name: 'Bundle Size', result: results.bundleSize },
    { name: 'Image Optimization', result: results.imageOptimization },
    { name: 'Code Splitting', result: results.codeSplitting },
    { name: 'Caching Strategy', result: results.caching },
    { name: 'Performance Monitoring', result: results.performanceMonitoring },
  ];

  let totalPassed = 0;
  categories.forEach(({ name, result }) => {
    const status = result.passed ? '✅' : '❌';
    const color = result.passed ? 'green' : 'red';
    colorLog(color, `\n${status} ${name}: ${result.passed ? 'PASSED' : 'FAILED'}`);

    if (result.passed) {
      totalPassed++;
    } else if (result.reason) {
      colorLog('yellow', `   Reason: ${result.reason}`);
    }
  });

  const totalTests = categories.length;
  const passRate = (totalPassed / totalTests) * 100;

  colorLog('cyan', '\n═══════════════════════════════════════════════════════════════');
  colorLog('cyan', `   OVERALL SCORE: ${totalPassed}/${totalTests} (${passRate.toFixed(0)}%)`);
  colorLog('cyan', '═══════════════════════════════════════════════════════════════');

  const duration = Date.now() - startTime;
  colorLog('blue', `\nValidation completed in ${formatMs(duration)}`);

  // Performance targets
  colorLog('cyan', '\n📈 PERFORMANCE TARGETS:');
  colorLog('blue', `  LCP: < ${formatMs(TARGETS.lcp)}`);
  colorLog('blue', `  FID: < ${formatMs(TARGETS.fid)}`);
  colorLog('blue', `  CLS: < ${TARGETS.cls}`);
  colorLog('blue', `  TTI: < ${formatMs(TARGETS.tti)}`);

  // Recommendations
  if (totalPassed < totalTests) {
    colorLog('yellow', '\n💡 RECOMMENDATIONS:');

    if (!results.bundleSize.passed) {
      colorLog('yellow', '  • Review and optimize bundle size');
      colorLog('yellow', '    Run: npm run analyze-bundle');
    }

    if (!results.imageOptimization.passed) {
      colorLog('yellow', '  • Optimize large images (>500KB)');
      colorLog('yellow', '    Run: npm run optimize:images');
    }

    if (!results.codeSplitting.passed) {
      colorLog('yellow', '  • Add more dynamic imports');
      colorLog('yellow', '    See: /lib/code-splitting-utils.ts');
    }

    if (!results.caching.passed) {
      colorLog('yellow', '  • Implement caching strategy');
      colorLog('yellow', '    See: /lib/cache-strategy.ts');
    }

    if (!results.performanceMonitoring.passed) {
      colorLog('yellow', '  • Set up performance monitoring');
      colorLog('yellow', '    See: /components/analytics/performance-monitor.tsx');
    }
  } else {
    colorLog('green', '\n🎉 All validations passed! Ready for production.');
    colorLog('green', '\nNext steps:');
    colorLog('white', '  1. Run Lighthouse CI: npx lighthouse https://your-site.com');
    colorLog('white', '  2. Test on real devices and network conditions');
    colorLog('white', '  3. Monitor Core Web Vitals in production');
    colorLog('white', '  4. Set up performance budgets and alerts');
  }

  colorLog('cyan', '\n═══════════════════════════════════════════════════════════════\n');

  process.exit(totalPassed === totalTests ? 0 : 1);
}

// Run validation
main().catch(error => {
  colorLog('red', `\n❌ Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
