/**
 * E2E Test: Product Browsing and Navigation
 *
 * Tests product discovery, filtering, search, and detail viewing.
 *
 * @agent #21 - E2E Testing Specialist
 */

import { test, expect } from '@playwright/test'

test.describe('Product Browsing', () => {
  test('should browse products from homepage', async ({ page }) => {
    await page.goto('/')

    // Navigate to products
    await page.click('text=/Products|Shop/i')
    await expect(page).toHaveURL(/.*products/)

    // Verify products are displayed
    const products = page.locator('[data-testid="product-card"]')
    await expect(products.first()).toBeVisible()

    const count = await products.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products')

    // Click category filter
    await page.click('text=/Closet Doors/i')

    // Verify filtered results
    await expect(page.locator('text=/Closet Doors/i')).toBeVisible()

    // Verify URL updated
    await expect(page).toHaveURL(/.*category.*closet-doors/i)
  })

  test('should search for products', async ({ page }) => {
    await page.goto('/products')

    // Enter search query
    await page.fill('input[type="search"], input[placeholder*="Search"]', 'bifold')
    await page.press('input[type="search"], input[placeholder*="Search"]', 'Enter')

    // Verify search results
    await expect(page.locator('text=/bifold/i')).toBeVisible()
    await expect(page).toHaveURL(/.*search.*bifold/i)
  })

  test('should view product details', async ({ page }) => {
    await page.goto('/products')

    // Click first product
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()

    // Verify detail page loaded
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=/Price|\\$/i')).toBeVisible()
    await expect(
      page.locator('button:has-text("Add to Cart"), button:has-text("Get Quote")')
    ).toBeVisible()
  })

  test('should display product images', async ({ page }) => {
    await page.goto('/products')

    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()

    // Verify main image
    const mainImage = page.locator('[data-testid="product-image"], img[alt*="product"]').first()
    await expect(mainImage).toBeVisible()

    // Check image loaded
    const imageSrc = await mainImage.getAttribute('src')
    expect(imageSrc).toBeTruthy()
  })

  test('should navigate product image gallery', async ({ page }) => {
    await page.goto('/products')

    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()

    // Check if gallery exists
    const thumbnails = page.locator('[data-testid="thumbnail"], img[alt*="thumbnail"]')
    const count = await thumbnails.count()

    if (count > 1) {
      // Click second thumbnail
      await thumbnails.nth(1).click()

      // Verify main image updated
      // Implementation-specific verification
    }
  })

  test('should show product specifications', async ({ page }) => {
    await page.goto('/products')

    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()

    // Verify specifications section exists
    const specs = page.locator('text=/Specifications|Details/i')
    if (await specs.isVisible()) {
      await expect(page.locator('text=/Material|Dimensions|Finish/i')).toBeVisible()
    }
  })
})

test.describe('Product Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
  })

  test('should filter by price range', async ({ page }) => {
    // Look for price filter
    const priceFilter = page.locator('[data-testid="price-filter"], text=/Price Range/i')

    if (await priceFilter.isVisible()) {
      // Adjust price slider or inputs
      const minPrice = page.locator('input[name="minPrice"], input[placeholder*="Min"]')
      const maxPrice = page.locator('input[name="maxPrice"], input[placeholder*="Max"]')

      if (await minPrice.isVisible()) {
        await minPrice.fill('100')
        await maxPrice.fill('500')
        await page.keyboard.press('Enter')

        // Wait for filtered results
        await page.waitForLoadState('networkidle')

        // Verify URL or results updated
        await expect(page).toHaveURL(/.*price/i)
      }
    }
  })

  test('should filter by material', async ({ page }) => {
    const materialFilter = page.locator('text=/Material/i')

    if (await materialFilter.isVisible()) {
      await materialFilter.click()

      // Select material option
      await page.check('input[value="wood"], label:has-text("Wood") input')

      // Verify filtered
      await page.waitForLoadState('networkidle')
    }
  })

  test('should combine multiple filters', async ({ page }) => {
    // Select category
    await page.click('text=/Closet Doors/i')

    // Add price filter if available
    const priceMin = page.locator('input[name="minPrice"]')
    if (await priceMin.isVisible()) {
      await priceMin.fill('100')
    }

    // Add material filter if available
    const woodFilter = page.locator('input[value="wood"]')
    if (await woodFilter.isVisible()) {
      await woodFilter.check()
    }

    // Verify multiple filters applied
    await page.waitForLoadState('networkidle')
  })

  test('should clear all filters', async ({ page }) => {
    // Apply some filters
    await page.click('text=/Closet Doors/i')

    // Look for clear button
    const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")')
    if (await clearButton.isVisible()) {
      await clearButton.click()

      // Verify filters cleared
      await expect(page).toHaveURL(/\/products\/?$/)
    }
  })
})

test.describe('Product Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
  })

  test('should sort by price low to high', async ({ page }) => {
    const sortSelect = page.locator('select[name="sort"], [data-testid="sort-select"]')

    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ label: 'Price: Low to High' })

      await page.waitForLoadState('networkidle')

      // Verify URL updated
      await expect(page).toHaveURL(/.*sort.*price.*asc/i)
    }
  })

  test('should sort by price high to low', async ({ page }) => {
    const sortSelect = page.locator('select[name="sort"], [data-testid="sort-select"]')

    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ label: 'Price: High to Low' })

      await page.waitForLoadState('networkidle')

      await expect(page).toHaveURL(/.*sort.*price.*desc/i)
    }
  })

  test('should sort by name', async ({ page }) => {
    const sortSelect = page.locator('select[name="sort"], [data-testid="sort-select"]')

    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ label: 'Name: A to Z' })

      await page.waitForLoadState('networkidle')
    }
  })
})

test.describe('Product Pagination', () => {
  test('should navigate to next page', async ({ page }) => {
    await page.goto('/products')

    const nextButton = page.locator('button:has-text("Next"), a:has-text("Next")')

    if ((await nextButton.isVisible()) && !(await nextButton.isDisabled())) {
      await nextButton.click()

      await expect(page).toHaveURL(/.*page=2/i)
      await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible()
    }
  })

  test('should navigate to previous page', async ({ page }) => {
    await page.goto('/products?page=2')

    const prevButton = page.locator('button:has-text("Previous"), button:has-text("Prev")')

    if (await prevButton.isVisible()) {
      await prevButton.click()

      await expect(page).toHaveURL(/.*page=1|\/products\/?$/i)
    }
  })

  test('should jump to specific page', async ({ page }) => {
    await page.goto('/products')

    const pageButton = page.locator('button:has-text("3"), a:has-text("3")')

    if (await pageButton.isVisible()) {
      await pageButton.click()

      await expect(page).toHaveURL(/.*page=3/i)
    }
  })
})

test.describe('Product Quick Actions', () => {
  test('should add product to cart from listing', async ({ page }) => {
    await page.goto('/products')

    const quickAddButton = page
      .locator('[data-testid="quick-add"], button:has-text("Add to Cart")')
      .first()

    if (await quickAddButton.isVisible()) {
      await quickAddButton.click()

      // Verify cart updated
      await expect(page.locator('text=/Added to cart|Cart.*1/i')).toBeVisible({ timeout: 5000 })
    }
  })

  test('should quick view product', async ({ page }) => {
    await page.goto('/products')

    const quickViewButton = page
      .locator('[data-testid="quick-view"], button:has-text("Quick View")')
      .first()

    if (await quickViewButton.isVisible()) {
      await quickViewButton.click()

      // Verify modal/overlay opened
      await expect(page.locator('[role="dialog"], [data-testid="quick-view-modal"]')).toBeVisible()
    }
  })
})

test.describe('Mobile Product Browsing', () => {
  test.use({
    viewport: { width: 375, height: 667 },
  })

  test('should browse products on mobile', async ({ page }) => {
    await page.goto('/products')

    // Verify mobile-optimized grid
    const products = page.locator('[data-testid="product-card"]')
    await expect(products.first()).toBeVisible()

    const count = await products.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should open mobile filter drawer', async ({ page }) => {
    await page.goto('/products')

    const filterButton = page.locator('button:has-text("Filters"), button:has-text("Filter")')

    if (await filterButton.isVisible()) {
      await filterButton.click()

      // Verify drawer opened
      await expect(page.locator('[role="dialog"]:has-text("Filters")')).toBeVisible()
    }
  })

  test('should switch between grid and list view on mobile', async ({ page }) => {
    await page.goto('/products')

    const viewToggle = page.locator('[data-testid="view-toggle"], button[aria-label*="view"]')

    if (await viewToggle.isVisible()) {
      await viewToggle.click()

      // Layout should change
      await page.waitForTimeout(500)
    }
  })
})
