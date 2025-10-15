/**
 * Performance Test: Core Web Vitals
 *
 * Tests Core Web Vitals metrics (LCP, FID, CLS, TTFB, INP).
 *
 * @agent #24 - Performance Testing Specialist
 */

import { test, expect } from '@playwright/test';

test.describe('Core Web Vitals', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance metrics collection
    await page.coverage.startJSCoverage();
    await page.coverage.startCSSCoverage();
  });

  test.afterEach(async ({ page }) => {
    await page.coverage.stopJSCoverage();
    await page.coverage.stopCSSCoverage();
  });

  test.describe('Largest Contentful Paint (LCP)', () => {
    test('should have LCP under 2.5 seconds on homepage', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/', { waitUntil: 'networkidle' });

      // Get LCP from Performance API
      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            resolve(lastEntry.renderTime || lastEntry.loadTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        });
      });

      console.log(`LCP: ${lcp}ms`);
      expect(lcp).toBeLessThan(2500);
    });

    test('should have LCP under 2.5 seconds on products page', async ({ page }) => {
      await page.goto('/products', { waitUntil: 'networkidle' });

      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            resolve(lastEntry.renderTime || lastEntry.loadTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          setTimeout(() => resolve(0), 5000);
        });
      });

      console.log(`Products LCP: ${lcp}ms`);
      expect(lcp).toBeLessThan(2500);
    });
  });

  test.describe('Cumulative Layout Shift (CLS)', () => {
    test('should have CLS under 0.1 on homepage', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Scroll page to trigger lazy-loaded content
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });

      await page.waitForTimeout(1000);

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            resolve(clsValue);
          }).observe({ entryTypes: ['layout-shift'] });

          setTimeout(() => resolve(clsValue), 2000);
        });
      });

      console.log(`CLS: ${cls}`);
      expect(cls).toBeLessThan(0.1);
    });

    test('should not cause layout shift when loading images', async ({ page }) => {
      await page.goto('/products');

      const initialCLS = await page.evaluate(() => {
        let clsValue = 0;

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });

        return clsValue;
      });

      // Wait for images to load
      await page.waitForLoadState('networkidle');

      const finalCLS = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            resolve(clsValue);
          }).observe({ entryTypes: ['layout-shift'] });

          setTimeout(() => resolve(clsValue), 1000);
        });
      });

      console.log(`Image Loading CLS: ${finalCLS}`);
      expect(finalCLS).toBeLessThan(0.1);
    });
  });

  test.describe('First Input Delay (FID) / Interaction to Next Paint (INP)', () => {
    test('should have fast interaction response on homepage', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Click a button and measure response time
      const button = page.locator('button, a').first();

      if (await button.count() > 0) {
        const startTime = Date.now();

        await button.click();

        const endTime = Date.now();
        const interactionTime = endTime - startTime;

        console.log(`Interaction time: ${interactionTime}ms`);
        expect(interactionTime).toBeLessThan(100);
      }
    });

    test('should have responsive form interactions', async ({ page }) => {
      await page.goto('/quote');

      const input = page.locator('input').first();

      const startTime = Date.now();

      await input.focus();
      await input.type('Test');

      const endTime = Date.now();
      const typingDelay = endTime - startTime;

      console.log(`Typing delay: ${typingDelay}ms`);
      expect(typingDelay).toBeLessThan(200);
    });
  });

  test.describe('Time to First Byte (TTFB)', () => {
    test('should have TTFB under 600ms on homepage', async ({ page }) => {
      const response = await page.goto('/', { waitUntil: 'commit' });

      const ttfb = await page.evaluate(() => {
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return navTiming.responseStart - navTiming.requestStart;
      });

      console.log(`TTFB: ${ttfb}ms`);
      expect(ttfb).toBeLessThan(600);
    });

    test('should have fast API response times', async ({ page }) => {
      await page.goto('/products');

      const apiCalls = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return resources
          .filter(r => r.name.includes('/api/'))
          .map(r => ({
            url: r.name,
            duration: r.duration,
            ttfb: r.responseStart - r.requestStart
          }));
      });

      for (const apiCall of apiCalls) {
        console.log(`API ${apiCall.url}: TTFB ${apiCall.ttfb}ms, Total ${apiCall.duration}ms`);
        expect(apiCall.ttfb).toBeLessThan(1000);
      }
    });
  });

  test.describe('Resource Loading Performance', () => {
    test('should load critical resources quickly', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const resources = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return resources.map(r => ({
          name: r.name,
          duration: r.duration,
          size: r.transferSize,
          type: r.initiatorType
        }));
      });

      // Critical CSS should load fast
      const cssResources = resources.filter(r => r.type === 'css' || r.name.endsWith('.css'));
      for (const css of cssResources) {
        console.log(`CSS ${css.name}: ${css.duration}ms`);
        expect(css.duration).toBeLessThan(1000);
      }

      // Critical JS should load fast
      const jsResources = resources.filter(r => r.type === 'script' || r.name.endsWith('.js'));
      for (const js of jsResources.slice(0, 3)) {
        console.log(`JS ${js.name}: ${js.duration}ms`);
        expect(js.duration).toBeLessThan(2000);
      }
    });

    test('should use image optimization', async ({ page }) => {
      await page.goto('/products');

      const images = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.map(img => ({
          src: img.src,
          loading: img.loading,
          width: img.naturalWidth,
          height: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight
        }));
      });

      // Images should use lazy loading
      const lazyImages = images.filter(img => img.loading === 'lazy');
      console.log(`Lazy loaded images: ${lazyImages.length}/${images.length}`);

      // Below-fold images should be lazy loaded
      expect(lazyImages.length).toBeGreaterThan(0);

      // Images should be properly sized
      for (const img of images.slice(0, 5)) {
        const oversized = img.width > img.displayWidth * 2 || img.height > img.displayHeight * 2;
        if (oversized) {
          console.warn(`Oversized image: ${img.src}`);
        }
      }
    });

    test('should use efficient caching', async ({ page }) => {
      await page.goto('/');

      // Get initial resources
      const firstLoad = await page.evaluate(() => {
        return performance.getEntriesByType('resource').length;
      });

      // Reload page
      await page.reload();

      // Get cached resources
      const secondLoad = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return resources.filter(r => r.transferSize === 0).length;
      });

      console.log(`Cached resources: ${secondLoad}/${firstLoad}`);

      // Should have cached some resources
      expect(secondLoad).toBeGreaterThan(0);
    });
  });

  test.describe('Bundle Size', () => {
    test('should have reasonable JavaScript bundle size', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const jsSize = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const jsResources = resources.filter(r => r.name.endsWith('.js'));

        return jsResources.reduce((total, r) => total + r.transferSize, 0);
      });

      const jsSizeKB = jsSize / 1024;
      console.log(`Total JS size: ${jsSizeKB.toFixed(2)} KB`);

      // Total JS should be under 500KB (compressed)
      expect(jsSizeKB).toBeLessThan(500);
    });

    test('should have reasonable CSS bundle size', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const cssSize = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const cssResources = resources.filter(r => r.name.endsWith('.css'));

        return cssResources.reduce((total, r) => total + r.transferSize, 0);
      });

      const cssSizeKB = cssSize / 1024;
      console.log(`Total CSS size: ${cssSizeKB.toFixed(2)} KB`);

      // Total CSS should be under 100KB (compressed)
      expect(cssSizeKB).toBeLessThan(100);
    });
  });

  test.describe('Runtime Performance', () => {
    test('should have low memory usage', async ({ page }) => {
      await page.goto('/');

      const metrics = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory;
        }
        return null;
      });

      if (metrics) {
        const usedMB = metrics.usedJSHeapSize / 1024 / 1024;
        console.log(`Memory used: ${usedMB.toFixed(2)} MB`);

        // Should use less than 50MB
        expect(usedMB).toBeLessThan(50);
      }
    });

    test('should not have long tasks blocking main thread', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const longTasks = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let count = 0;

          new PerformanceObserver((list) => {
            count += list.getEntries().length;
          }).observe({ entryTypes: ['longtask'] });

          setTimeout(() => resolve(count), 5000);
        });
      });

      console.log(`Long tasks: ${longTasks}`);

      // Should have minimal long tasks
      expect(longTasks).toBeLessThan(5);
    });
  });
});
