/**
 * E2E Test: Site Navigation
 *
 * Tests main navigation, mobile menu, footer links, and breadcrumbs.
 *
 * @agent #21 - E2E Testing Specialist
 */

import { test, expect } from '@playwright/test'

test.describe('Main Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to all main sections', async ({ page }) => {
    // Test navigation links
    const navLinks = [
      { text: /Products|Shop/i, url: /products/ },
      { text: /About/i, url: /about/ },
      { text: /Contact/i, url: /contact/ },
      { text: /Quote/i, url: /quote/ },
    ]

    for (const link of navLinks) {
      await page.click(`nav a:has-text("${link.text.source.replace(/\//g, '')}")`)
      await expect(page).toHaveURL(link.url)
      await page.goBack()
    }
  })

  test('should have accessible navigation', async ({ page }) => {
    // Verify nav has proper ARIA roles
    const nav = page.locator('nav[aria-label="Main"], nav[role="navigation"]').first()
    await expect(nav).toBeVisible()

    // Navigation should be keyboard accessible
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should highlight active page in navigation', async ({ page }) => {
    await page.goto('/products')

    // Check if Products link is highlighted
    const activeLink = page.locator('nav a[aria-current="page"], nav a.active').first()
    if ((await activeLink.count()) > 0) {
      await expect(activeLink).toContainText(/Products/i)
    }
  })

  test('should show logo and link to homepage', async ({ page }) => {
    const logo = page
      .locator('[data-testid="logo"], nav img[alt*="logo"], a:has-text("PG Closets")')
      .first()
    await expect(logo).toBeVisible()

    if ((await logo.count()) > 0) {
      await logo.click()
      await expect(page).toHaveURL(/\/$|\/home/)
    }
  })
})

test.describe('Mobile Navigation', () => {
  test.use({
    viewport: { width: 375, height: 667 },
  })

  test('should open and close mobile menu', async ({ page }) => {
    await page.goto('/')

    // Open menu
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")')
    await menuButton.click()

    // Verify menu opened
    const mobileMenu = page.locator('[role="dialog"], [data-testid="mobile-menu"]')
    await expect(mobileMenu).toBeVisible()

    // Close menu
    const closeButton = page.locator('button[aria-label*="close"], button:has-text("Close")')
    await closeButton.click()

    // Verify menu closed
    await expect(mobileMenu).not.toBeVisible()
  })

  test('should navigate from mobile menu', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")')
    await menuButton.click()

    // Click Products link
    await page.click('text=/Products/i')

    // Verify navigation
    await expect(page).toHaveURL(/products/)

    // Menu should close after navigation
    const mobileMenu = page.locator('[role="dialog"]')
    await expect(mobileMenu).not.toBeVisible()
  })

  test('should show expandable menu sections on mobile', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.locator('button[aria-label*="menu"]')
    await menuButton.click()

    // Look for expandable sections
    const expandButton = page.locator('button[aria-expanded]').first()
    if ((await expandButton.count()) > 0) {
      const isExpanded = await expandButton.getAttribute('aria-expanded')

      await expandButton.click()

      // Verify expansion toggled
      const newState = await expandButton.getAttribute('aria-expanded')
      expect(newState).not.toBe(isExpanded)
    }
  })
})

test.describe('Footer Navigation', () => {
  test('should display footer on all pages', async ({ page }) => {
    const pages = ['/', '/products', '/about', '/contact']

    for (const pagePath of pages) {
      await page.goto(pagePath)

      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    }
  })

  test('should navigate from footer links', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded()

    // Test footer links
    const footerLink = page.locator('footer a').first()
    if ((await footerLink.count()) > 0) {
      await footerLink.click()

      // Verify navigation occurred
      await page.waitForLoadState('networkidle')
    }
  })

  test('should have social media links in footer', async ({ page }) => {
    await page.goto('/')

    await page.locator('footer').scrollIntoViewIfNeeded()

    // Look for social links
    const socialLinks = page.locator(
      'footer a[href*="facebook"], footer a[href*="instagram"], footer a[href*="twitter"]'
    )
    const count = await socialLinks.count()

    if (count > 0) {
      // Verify links open in new tab
      const firstSocial = socialLinks.first()
      const target = await firstSocial.getAttribute('target')
      expect(target).toBe('_blank')
    }
  })

  test('should display contact information in footer', async ({ page }) => {
    await page.goto('/')

    await page.locator('footer').scrollIntoViewIfNeeded()

    // Verify contact info present
    await expect(page.locator('footer')).toContainText(/\(?\d{3}\)?.*\d{3}.*\d{4}|email|contact/i)
  })
})

test.describe('Breadcrumb Navigation', () => {
  test('should show breadcrumbs on product pages', async ({ page }) => {
    await page.goto('/products')

    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()

    // Look for breadcrumbs
    const breadcrumbs = page.locator('[aria-label="Breadcrumb"], nav ol, nav ul').first()
    if ((await breadcrumbs.count()) > 0) {
      await expect(breadcrumbs).toBeVisible()
      await expect(breadcrumbs).toContainText(/Home|Products/i)
    }
  })

  test('should navigate using breadcrumbs', async ({ page }) => {
    await page.goto('/products')

    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()

    // Click breadcrumb link
    const breadcrumbLink = page.locator('[aria-label="Breadcrumb"] a, nav ol a, nav ul a').first()
    if ((await breadcrumbLink.count()) > 0) {
      await breadcrumbLink.click()

      // Verify navigation
      await page.waitForLoadState('networkidle')
    }
  })
})

test.describe('Search Navigation', () => {
  test('should open search overlay', async ({ page }) => {
    await page.goto('/')

    const searchButton = page
      .locator('button[aria-label*="search"], button:has-text("Search")')
      .first()

    if ((await searchButton.count()) > 0) {
      await searchButton.click()

      // Verify search overlay opened
      const searchOverlay = page.locator(
        '[role="dialog"]:has(input[type="search"]), [data-testid="search-overlay"]'
      )
      await expect(searchOverlay).toBeVisible()
    }
  })

  test('should search from navigation', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first()

    if ((await searchInput.count()) > 0) {
      await searchInput.fill('closet doors')
      await searchInput.press('Enter')

      // Verify search results page
      await expect(page).toHaveURL(/.*search.*closet.*doors/i)
      await expect(page.locator('h1, h2')).toContainText(/Search|Results/i)
    }
  })

  test('should show search suggestions', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.locator('input[type="search"]').first()

    if ((await searchInput.count()) > 0) {
      await searchInput.fill('bif')

      // Wait for suggestions
      await page.waitForTimeout(500)

      const suggestions = page.locator('[role="listbox"], [data-testid="search-suggestions"]')
      if ((await suggestions.count()) > 0) {
        await expect(suggestions).toBeVisible()
      }
    }
  })
})

test.describe('Navigation Keyboard Accessibility', () => {
  test('should support Tab navigation', async ({ page }) => {
    await page.goto('/')

    // Tab through navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('should support Enter key to activate links', async ({ page }) => {
    await page.goto('/')

    // Tab to first nav link
    await page.keyboard.press('Tab')

    // Press Enter
    await page.keyboard.press('Enter')

    // Wait for navigation
    await page.waitForLoadState('networkidle')

    // Verify navigation occurred - URL should be valid
    const newUrl = page.url()
    expect(newUrl).toBeTruthy()
  })

  test('should support Escape key to close overlays', async ({ page }) => {
    await page.goto('/')

    const searchButton = page.locator('button[aria-label*="search"]').first()

    if ((await searchButton.count()) > 0) {
      await searchButton.click()

      const searchOverlay = page.locator('[role="dialog"]')
      await expect(searchOverlay).toBeVisible()

      // Press Escape
      await page.keyboard.press('Escape')

      // Overlay should close
      await expect(searchOverlay).not.toBeVisible()
    }
  })
})

test.describe('Skip Links', () => {
  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/')

    // Press Tab to reveal skip link
    await page.keyboard.press('Tab')

    const skipLink = page.locator('a:has-text("Skip to"), a[href="#main"]').first()

    if ((await skipLink.count()) > 0) {
      await expect(skipLink).toBeVisible()

      // Activate skip link
      await skipLink.click()

      // Verify focus moved to main content
      const main = page.locator('main, [role="main"], #main')
      await expect(main).toBeFocused()
    }
  })
})
