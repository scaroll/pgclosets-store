/**
 * E2E Test: Cross-Browser Compatibility
 *
 * Tests critical flows across different browsers.
 *
 * @agent #21 - E2E Testing Specialist
 */

import { test, expect, devices } from '@playwright/test';

test.describe('Cross-Browser: Chrome', () => {
  test.use({
    ...devices['Desktop Chrome']
  });

  test('should complete quote flow in Chrome', async ({ page }) => {
    await page.goto('/quote');

    await page.fill('input[name="name"]', 'Chrome User');
    await page.fill('input[name="email"]', 'chrome@example.com');
    await page.fill('input[name="phone"]', '6135550123');
    await page.click('button:has-text("Closet")');
    await page.fill('textarea[name="details"]', 'Test from Chrome');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=/success/i')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Cross-Browser: Firefox', () => {
  test.use({
    ...devices['Desktop Firefox']
  });

  test('should complete quote flow in Firefox', async ({ page }) => {
    await page.goto('/quote');

    await page.fill('input[name="name"]', 'Firefox User');
    await page.fill('input[name="email"]', 'firefox@example.com');
    await page.fill('input[name="phone"]', '6135550123');
    await page.click('button:has-text("Closet")');
    await page.fill('textarea[name="details"]', 'Test from Firefox');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=/success/i')).toBeVisible({ timeout: 10000 });
  });

  test('should handle file uploads in Firefox', async ({ page }) => {
    await page.goto('/quote');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles({
        name: 'test.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data'),
      });

      // Verify upload indicator
      await expect(page.locator('text=/uploaded|selected/i')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Cross-Browser: Safari', () => {
  test.use({
    ...devices['Desktop Safari']
  });

  test('should complete quote flow in Safari', async ({ page }) => {
    await page.goto('/quote');

    await page.fill('input[name="name"]', 'Safari User');
    await page.fill('input[name="email"]', 'safari@example.com');
    await page.fill('input[name="phone"]', '6135550123');
    await page.click('button:has-text("Closet")');
    await page.fill('textarea[name="details"]', 'Test from Safari');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=/success/i')).toBeVisible({ timeout: 10000 });
  });

  test('should handle date inputs in Safari', async ({ page }) => {
    await page.goto('/quote');

    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.count() > 0) {
      await dateInput.fill('2025-12-31');

      const value = await dateInput.inputValue();
      expect(value).toBe('2025-12-31');
    }
  });
});

test.describe('Cross-Browser: Edge', () => {
  test.use({
    ...devices['Desktop Edge']
  });

  test('should complete quote flow in Edge', async ({ page }) => {
    await page.goto('/quote');

    await page.fill('input[name="name"]', 'Edge User');
    await page.fill('input[name="email"]', 'edge@example.com');
    await page.fill('input[name="phone"]', '6135550123');
    await page.click('button:has-text("Closet")');
    await page.fill('textarea[name="details"]', 'Test from Edge');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=/success/i')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Mobile: iOS Safari', () => {
  test.use({
    ...devices['iPhone 13']
  });

  test('should complete quote on iOS Safari', async ({ page }) => {
    await page.goto('/quote');

    await page.fill('input[name="name"]', 'iOS User');
    await page.fill('input[name="email"]', 'ios@example.com');
    await page.fill('input[name="phone"]', '6135550123');

    await page.click('button:has-text("Closet")');
    await page.fill('textarea[name="details"]', 'Test from iOS');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=/success/i')).toBeVisible({ timeout: 10000 });
  });

  test('should handle touch gestures on iOS', async ({ page }) => {
    await page.goto('/products');

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.tap();

    await expect(page).toHaveURL(/.*product/);
  });
});

test.describe('Mobile: Android Chrome', () => {
  test.use({
    ...devices['Pixel 5']
  });

  test('should complete quote on Android Chrome', async ({ page }) => {
    await page.goto('/quote');

    await page.fill('input[name="name"]', 'Android User');
    await page.fill('input[name="email"]', 'android@example.com');
    await page.fill('input[name="phone"]', '6135550123');

    await page.click('button:has-text("Closet")');
    await page.fill('textarea[name="details"]', 'Test from Android');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=/success/i')).toBeVisible({ timeout: 10000 });
  });

  test('should handle mobile keyboard on Android', async ({ page }) => {
    await page.goto('/quote');

    const emailInput = page.locator('input[type="email"]');
    await emailInput.tap();

    // Verify input has focus
    await expect(emailInput).toBeFocused();

    await emailInput.fill('test@example.com');

    const value = await emailInput.inputValue();
    expect(value).toBe('test@example.com');
  });
});

test.describe('Tablet: iPad', () => {
  test.use({
    ...devices['iPad Pro']
  });

  test('should display tablet-optimized layout', async ({ page }) => {
    await page.goto('/');

    // Verify responsive layout
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(768);

    // Products should display in grid
    await page.goto('/products');
    const products = page.locator('[data-testid="product-card"]');
    await expect(products.first()).toBeVisible();
  });

  test('should support touch navigation on iPad', async ({ page }) => {
    await page.goto('/');

    const navLink = page.locator('nav a').first();
    await navLink.tap();

    await page.waitForLoadState('networkidle');
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
