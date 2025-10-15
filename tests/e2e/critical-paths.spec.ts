/**
 * E2E Critical Path Tests
 * Tests for critical user journeys that must always work
 */

import { test, expect } from '@playwright/test'

test.describe('Critical User Paths - Quote Request', () => {
  test('should complete full quote request journey', async ({ page }) => {
    // Step 1: Navigate to homepage
    await page.goto('/')
    await expect(page).toHaveTitle(/PG Closets/i)

    // Step 2: Navigate to quote page
    const quoteButton = page.locator('a:has-text("Get a Quote"), a[href*="quote"]').first()
    await quoteButton.click()
    await expect(page).toHaveURL(/.*quote/)

    // Step 3: Fill out quote form
    await page.fill('input[name="firstName"], input[id*="first"]', 'John')
    await page.fill('input[name="lastName"], input[id*="last"]', 'Doe')
    await page.fill('input[name="email"], input[type="email"]', 'john.doe@example.com')
    await page.fill('input[name="phone"], input[type="tel"]', '613-555-0123')

    // Select project type
    await page.selectOption('select[name="projectType"], select[id*="project"]', 'closet-renovation')

    // Fill project description
    await page.fill('textarea[name="projectDescription"], textarea[id*="description"]',
      'I need custom closet doors for my master bedroom. Looking for modern sliding doors.')

    // Select budget range
    await page.selectOption('select[name="budgetRange"], select[id*="budget"]', '$1000-$2500')

    // Select timeline
    await page.selectOption('select[name="timeline"], select[id*="timeline"]', 'Within 3 months')

    // Step 4: Submit form
    const submitButton = page.locator('button[type="submit"]:has-text("Submit"), button:has-text("Get Quote")')
    await submitButton.click()

    // Step 5: Verify success
    await expect(page.locator('text=/thank you|success|received/i')).toBeVisible({ timeout: 10000 })

    // Check for confirmation message
    await expect(page.locator('text=/contact you|be in touch|shortly/i')).toBeVisible()
  })

  test('should show validation errors for invalid quote submission', async ({ page }) => {
    await page.goto('/quote')

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Check for validation errors
    await expect(page.locator('text=/required|please enter/i').first()).toBeVisible()
  })

  test('should validate email format in quote form', async ({ page }) => {
    await page.goto('/quote')

    // Enter invalid email
    await page.fill('input[type="email"]', 'invalid-email')
    await page.click('button[type="submit"]')

    // Check for email validation error
    await expect(page.locator('text=/valid email|email format/i')).toBeVisible()
  })
})

test.describe('Critical User Paths - Product Browsing', () => {
  test('should browse products from homepage to detail page', async ({ page }) => {
    // Step 1: Start at homepage
    await page.goto('/')

    // Step 2: Navigate to products
    const productsLink = page.locator('a:has-text("Products"), a[href*="product"]').first()
    await productsLink.click()
    await expect(page).toHaveURL(/.*product/)

    // Step 3: Wait for products to load
    await page.waitForSelector('img, [data-testid="product-card"]', { timeout: 10000 })

    // Step 4: Click on first product
    const firstProduct = page.locator('[data-testid="product-card"], article, .product-item').first()
    if (await firstProduct.isVisible()) {
      await firstProduct.click()

      // Step 5: Verify product detail page
      await expect(page).toHaveURL(/.*product.*\/.+/)
      await expect(page.locator('h1')).toBeVisible()

      // Check for product information
      await expect(page.locator('text=/price|\$/i')).toBeVisible()
    }
  })

  test('should search for products', async ({ page }) => {
    await page.goto('/')

    // Find and use search
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('sliding door')
      await searchInput.press('Enter')

      // Verify search results
      await expect(page).toHaveURL(/.*search/)
      await expect(page.locator('text=/results|found/i')).toBeVisible()
    }
  })

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products')

    // Find category filter
    const categoryFilter = page.locator('select[name="category"], button:has-text("Category")')
    if (await categoryFilter.isVisible()) {
      if ((await categoryFilter.getAttribute('type')) !== 'select') {
        await categoryFilter.click()
        await page.click('text=/sliding doors/i')
      } else {
        await categoryFilter.selectOption({ label: /sliding/i })
      }

      // Verify filter applied
      await expect(page).toHaveURL(/.*category.*sliding/)
    }
  })
})

test.describe('Critical User Paths - Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact')

    // Fill contact form
    await page.fill('input[name="name"]', 'Jane Smith')
    await page.fill('input[name="email"]', 'jane@example.com')
    await page.fill('input[name="phone"]', '613-555-0199')
    await page.fill('textarea[name="message"]', 'I have a question about your products.')

    // Submit
    await page.click('button[type="submit"]')

    // Verify success
    await expect(page.locator('text=/thank you|success|sent/i')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Critical User Paths - Navigation', () => {
  test('should navigate through main menu', async ({ page }) => {
    await page.goto('/')

    // Test main navigation links
    const navLinks = [
      { text: 'Products', url: /product/ },
      { text: 'About', url: /about/ },
      { text: 'Contact', url: /contact/ },
    ]

    for (const link of navLinks) {
      const navLink = page.locator(`nav a:has-text("${link.text}")`).first()
      if (await navLink.isVisible()) {
        await navLink.click()
        await expect(page).toHaveURL(link.url)

        // Go back to home
        await page.goto('/')
      }
    }
  })

  test('should navigate using footer links', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Test footer links
    const footerLink = page.locator('footer a').first()
    if (await footerLink.isVisible()) {
      const href = await footerLink.getAttribute('href')
      if (href && !href.startsWith('#')) {
        await footerLink.click()
        await expect(page).not.toHaveURL('/')
      }
    }
  })
})

test.describe('Critical User Paths - Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE

  test('should work on mobile - quote flow', async ({ page }) => {
    await page.goto('/')

    // Open mobile menu if needed
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")')
    if (await menuButton.isVisible()) {
      await menuButton.click()
    }

    // Navigate to quote page
    const quoteLink = page.locator('a:has-text("Get a Quote"), a[href*="quote"]').first()
    await quoteLink.click()
    await expect(page).toHaveURL(/.*quote/)

    // Form should be visible and usable
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })

  test('should have mobile-friendly navigation', async ({ page }) => {
    await page.goto('/')

    // Check for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")')
    if (await menuButton.isVisible()) {
      await menuButton.click()

      // Menu should open
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible()
    }
  })
})

test.describe('Critical User Paths - Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)

    // First contentful paint should happen quickly
    const performanceTimings = await page.evaluate(() => {
      const perfEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        responseStart: perfEntries.responseStart,
        domContentLoaded: perfEntries.domContentLoadedEventEnd,
      }
    })

    expect(performanceTimings.responseStart).toBeLessThan(2000)
  })
})

test.describe('Critical User Paths - Error Handling', () => {
  test('should show 404 page for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345')

    expect(response?.status()).toBe(404)
    await expect(page.locator('text=/404|not found/i')).toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline
    await context.setOffline(true)

    try {
      await page.goto('/', { waitUntil: 'commit', timeout: 5000 })
    } catch (error) {
      // Expected to fail
    }

    // Go back online
    await context.setOffline(false)
    await page.goto('/')

    // Should recover
    await expect(page).toHaveTitle(/PG Closets/i)
  })
})

test.describe('Critical User Paths - SEO and Meta', () => {
  test('should have proper meta tags on key pages', async ({ page }) => {
    const pages = ['/', '/products', '/contact']

    for (const url of pages) {
      await page.goto(url)

      // Check title
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(0)
      expect(title.length).toBeLessThan(60)

      // Check meta description
      const description = await page.getAttribute('meta[name="description"]', 'content')
      expect(description).toBeTruthy()
      if (description) {
        expect(description.length).toBeGreaterThan(50)
        expect(description.length).toBeLessThan(160)
      }
    }
  })
})
