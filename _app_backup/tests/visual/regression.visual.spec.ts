import { test, expect } from '@playwright/test';

const VISUAL_TEST_PAGES = [
  { path: '/', name: 'homepage' },
  { path: '/store/products', name: 'products' },
  { path: '/store', name: 'store' },
];

test.describe('Visual Regression Tests', () => {
  for (const page of VISUAL_TEST_PAGES) {
    test(`Visual comparison - ${page.name}`, async ({ page: browser }) => {
      // Navigate to page
      await browser.goto(page.path);
      
      // Wait for page to be fully loaded
      await browser.waitForLoadState('networkidle');
      
      // Wait for fonts to load
      await browser.waitForTimeout(1000);
      
      // Take screenshot and compare
      await expect(browser).toHaveScreenshot(`${page.name}.png`, {
        fullPage: true,
        threshold: 0.2, // 20% tolerance for minor changes
        maxDiffPixelRatio: 0.005, // 0.5% maximum difference threshold
      });
    });
    
    test(`Mobile visual comparison - ${page.name}`, async ({ page: browser }) => {
      // Set mobile viewport
      await browser.setViewportSize({ width: 375, height: 667 });
      
      // Navigate to page
      await browser.goto(page.path);
      
      // Wait for page to be fully loaded
      await browser.waitForLoadState('networkidle');
      await browser.waitForTimeout(1000);
      
      // Take mobile screenshot
      await expect(browser).toHaveScreenshot(`${page.name}-mobile.png`, {
        fullPage: true,
        threshold: 0.2,
        maxDiffPixelRatio: 0.005,
      });
    });
  }
});

// Helper function to compare preview vs production URLs
export async function comparePreviewVsProd(
  previewUrl: string, 
  prodUrl: string, 
  paths: string[]
) {
  const { chromium } = require('@playwright/test');
  
  const results = [];
  
  for (const path of paths) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    
    // Take preview screenshot
    const previewPage = await context.newPage();
    await previewPage.goto(`${previewUrl}${path}`);
    await previewPage.waitForLoadState('networkidle');
    const previewScreenshot = await previewPage.screenshot({ fullPage: true });
    
    // Take production screenshot  
    const prodPage = await context.newPage();
    await prodPage.goto(`${prodUrl}${path}`);
    await prodPage.waitForLoadState('networkidle');
    const prodScreenshot = await prodPage.screenshot({ fullPage: true });
    
    await browser.close();
    
    // Calculate pixel difference (simplified)
    const isDifferent = Buffer.compare(previewScreenshot, prodScreenshot) !== 0;
    
    results.push({
      path,
      previewUrl: `${previewUrl}${path}`,
      prodUrl: `${prodUrl}${path}`,
      hasDifferences: isDifferent,
      diffPercentage: isDifferent ? 'Calculated' : 0,
    });
  }
  
  return results;
}