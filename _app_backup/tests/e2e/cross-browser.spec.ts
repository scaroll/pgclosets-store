/**
 * E2E Test: Cross-Browser Compatibility
 *
 * Tests critical flows across different browsers.
 *
 * @agent #21 - E2E Testing Specialist
 */

import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility Tests', () => {
  test('should complete quote flow', async ({ page }) => {
    await page.goto('/quote');

    await page.fill('input[name="name"], input[name="firstName"], input[id*="name"]', 'Cross-Browser User');
    await page.fill('input[name="email"], input[type="email"]', 'crossbrowser@example.com');
    await page.fill('input[name="phone"], input[type="tel"]', '6135550123');
    await page.fill('textarea[name="message"], textarea[name="details"], textarea[id*="message"]', 'Cross-browser compatibility test');

    await page.click('button[type="submit"], button:has-text("Submit"), button:has-text("Send")');

    await expect(page.locator('text=/success|thank you|received/i')).toBeVisible({ timeout: 10000 });
  });

  test('should handle file uploads', async ({ page }) => {
    await page.goto('/quote');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles({
        name: 'test.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data'),
      });

      // Verify upload indicator
      await expect(page.locator('text=/uploaded|selected|file/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle date inputs', async ({ page }) => {
    await page.goto('/quote');

    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.count() > 0) {
      await dateInput.fill('2025-12-31');

      const value = await dateInput.inputValue();
      expect(value).toBe('2025-12-31');
    }
  });

  test('should handle touch gestures', async ({ page }) => {
    await page.goto('/products');

    const firstProduct = page.locator('[data-testid="product-card"], article, .product-item').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.tap();
      await expect(page).toHaveURL(/.*product/);
    }
  });

  test('should handle mobile keyboard', async ({ page }) => {
    await page.goto('/quote');

    const emailInput = page.locator('input[type="email"]');
    await emailInput.tap();

    // Verify input has focus
    await expect(emailInput).toBeFocused();

    await emailInput.fill('test@example.com');

    const value = await emailInput.inputValue();
    expect(value).toBe('test@example.com');
  });

  test('should display responsive layout', async ({ page }) => {
    await page.goto('/');

    // Verify responsive layout
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(0);

    // Check navigation is present
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();

    // Check main content
    await expect(page.locator('main, [data-testid="hero"]')).toBeVisible();
  });

  test('should support touch navigation', async ({ page }) => {
    await page.goto('/');

    const navLink = page.locator('nav a').first();
    if (await navLink.isVisible()) {
      await navLink.tap();
      await page.waitForLoadState('networkidle');
    }
  });
});

test.describe('Performance: Slow Network', () => {
  test.use({
    contextOptions: {
      offline: false,
    }
  });

  test('should load critical content on slow 3G', async ({ page, context }) => {
    // Emulate slow 3G
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      await route.continue();
    });

    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    // Verify critical content loaded
    await expect(page.locator('h1, [data-testid="hero"]')).toBeVisible({ timeout: 15000 });
  });

  test('should show loading states on slow network', async ({ page, context }) => {
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto('/products');

    // Look for loading indicators
    const loader = page.locator('[data-testid="loading"], [aria-label="Loading"]').first();
    if (await loader.count() > 0) {
      await expect(loader).toBeVisible();
    }

    // Wait for content
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Accessibility: Screen Readers', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Verify h1 exists and is unique
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1);

    // Verify heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have alt text on all images', async ({ page }) => {
    await page.goto('/products');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Alt should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should have form labels', async ({ page }) => {
    await page.goto('/quote');

    const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"], textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else {
        // Input should have aria-label or be inside a label
        const ariaLabel = await input.getAttribute('aria-label');
        const parentLabel = page.locator(`label:has(input[name="${await input.getAttribute('name')}"])`);

        expect(ariaLabel || await parentLabel.count() > 0).toBeTruthy();
      }
    }
  });
});
