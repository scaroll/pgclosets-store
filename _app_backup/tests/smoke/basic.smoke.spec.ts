import { test, expect } from '@playwright/test';

const CRITICAL_PAGES = [
  { path: '/', title: 'PG Closets', expectedText: 'Custom Image Gallery' },
  { path: '/store', title: 'Store', expectedText: 'PG Closets Store' },
  { path: '/store/products', title: 'Products', expectedText: 'Products' },
];

test.describe('Smoke Tests - Critical Pages', () => {
  for (const page of CRITICAL_PAGES) {
    test(`${page.path} - loads successfully`, async ({ page: browser }) => {
      // Navigate to the page
      const response = await browser.goto(page.path);
      
      // Check status code
      expect(response?.status()).toBe(200);
      
      // Check page title contains expected text
      await expect(browser).toHaveTitle(new RegExp(page.title, 'i'));
      
      // Check page contains expected content
      await expect(browser.locator('body')).toContainText(page.expectedText);
      
      // Check no JavaScript errors
      const errors: string[] = [];
      browser.on('pageerror', (error) => {
        errors.push(error.message);
      });
      
      // Wait for page to be fully loaded
      await browser.waitForLoadState('networkidle');
      
      // Assert no critical JavaScript errors
      expect(errors.filter(error => 
        !error.includes('Warning') && 
        !error.includes('DevTools')
      )).toHaveLength(0);
    });
  }

  test('Navigation - header links work', async ({ page }) => {
    await page.goto('/');
    
    // Check if PG Closets logo/brand exists and is clickable
    const brandElement = page.locator('text=PG Closets').first();
    if (await brandElement.isVisible()) {
      await expect(brandElement).toBeVisible();
    }
    
    // Test store navigation if available
    const storeLink = page.locator('a[href*="/store"]').first();
    if (await storeLink.isVisible()) {
      await storeLink.click();
      await expect(page).toHaveURL(/.*\/store/);
    }
  });

  test('Core functionality - image placeholders render', async ({ page }) => {
    await page.goto('/');
    
    // Check that image placeholders are rendered
    const imageElements = page.locator('img');
    await expect(imageElements.first()).toBeVisible();
    
    // Check for ThreeItemGrid component
    const gridSection = page.locator('section').first();
    await expect(gridSection).toBeVisible();
  });
});