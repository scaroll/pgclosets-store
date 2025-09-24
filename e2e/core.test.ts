import { test, expect } from '@playwright/test'

test.describe('E-commerce Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('homepage loads and displays products', async ({ page }) => {
    await expect(page).toHaveTitle(/PG Closets/)
    await expect(page.locator('h1')).toContainText('Custom Closet Solutions')
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible()
  })

  test('product details page shows correct information', async ({ page }) => {
    await page.click('[data-testid="product-card"]:first-child')
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible()
    await expect(page.locator('[data-testid="add-to-cart"]')).toBeEnabled()
  })

  test('cart functionality works correctly', async ({ page }) => {
    // Add item to cart
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('[data-testid="add-to-cart"]')
    
    // Open cart
    await page.click('[data-testid="cart-icon"]')
    
    // Verify cart contents
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()
  })

  test('checkout process works', async ({ page }) => {
    // Add item and go to checkout
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('[data-testid="add-to-cart"]')
    await page.click('[data-testid="cart-icon"]')
    await page.click('[data-testid="checkout-button"]')
    
    // Fill checkout form
    await page.fill('[data-testid="checkout-email"]', 'test@example.com')
    await page.fill('[data-testid="checkout-name"]', 'Test User')
    await page.fill('[data-testid="checkout-address"]', '123 Test St')
    
    // Submit order
    await page.click('[data-testid="place-order"]')
    
    // Verify success
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible()
  })
})

test.describe('User Account Management', () => {
  test('user can register', async ({ page }) => {
    await page.goto('/register')
    await page.fill('[data-testid="register-email"]', 'newuser@example.com')
    await page.fill('[data-testid="register-password"]', 'Password123!')
    await page.click('[data-testid="register-submit"]')
    await expect(page.locator('[data-testid="account-welcome"]')).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="login-email"]', 'test@example.com')
    await page.fill('[data-testid="login-password"]', 'Password123!')
    await page.click('[data-testid="login-submit"]')
    await expect(page.locator('[data-testid="account-menu"]')).toBeVisible()
  })
})

test.describe('Product Search and Filtering', () => {
  test('search functionality works', async ({ page }) => {
    await page.goto('/products')
    await page.fill('[data-testid="search-input"]', 'closet')
    await page.press('[data-testid="search-input"]', 'Enter')
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
  })

  test('filters can be applied', async ({ page }) => {
    await page.goto('/products')
    await page.click('[data-testid="filter-category"]')
    await page.click('[data-testid="filter-option"]:first-child')
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
  })

  test('product grid adjusts to screen size', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/products')
    await expect(page.locator('[data-testid="product-grid"]')).toHaveClass(/grid-cols-4/)

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[data-testid="product-grid"]')).toHaveClass(/grid-cols-1/)
  })
})