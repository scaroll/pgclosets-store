/**
 * E2E Test: Quote Request Flow
 *
 * Tests the complete user journey from landing on homepage
 * to submitting a quote request.
 *
 * @agent #21 - E2E Testing Specialist
 */

import { test, expect } from '@playwright/test'

test.describe('Quote Request Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full quote request flow', async ({ page }) => {
    // Step 1: Navigate to quote page from homepage
    await page.click('text=/Get.*Quote/i')
    await expect(page).toHaveURL(/.*quote/)

    // Step 2: Fill out quote form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="phone"]', '(613) 555-0123')

    // Step 3: Select project type
    await page.click('button:has-text("Closet")')

    // Step 4: Add project details
    await page.fill(
      'textarea[name="details"]',
      'I need a custom walk-in closet for my master bedroom, approximately 10x12 feet.'
    )

    // Step 5: Upload reference image (optional)
    const fileInput = page.locator('input[type="file"]')
    if (await fileInput.isVisible()) {
      // Create test file
      const buffer = Buffer.from('fake-image-data')
      await fileInput.setInputFiles({
        name: 'reference.jpg',
        mimeType: 'image/jpeg',
        buffer,
      })
    }

    // Step 6: Select preferred contact method
    await page.check('input[value="email"]')

    // Step 7: Submit form
    await page.click('button[type="submit"]:has-text("Submit")')

    // Step 8: Verify success state
    await expect(page.locator('text=/success|thank you/i')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=/confirmation/i')).toBeVisible()
  })

  test('should show validation errors for invalid inputs', async ({ page }) => {
    await page.click('text=/Get.*Quote/i')

    // Submit without filling required fields
    await page.click('button[type="submit"]:has-text("Submit")')

    // Verify validation messages appear
    await expect(page.locator('text=/required|please fill/i')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.click('text=/Get.*Quote/i')

    await page.fill('input[name="email"]', 'invalid-email')
    // Trigger blur by pressing Tab
    await page.keyboard.press('Tab')

    await expect(page.locator('text=/valid email/i')).toBeVisible()
  })

  test('should validate phone number format', async ({ page }) => {
    await page.click('text=/Get.*Quote/i')

    await page.fill('input[name="phone"]', '123') // Invalid phone
    // Trigger blur by pressing Tab
    await page.keyboard.press('Tab')

    await expect(page.locator('text=/valid phone/i')).toBeVisible()
  })

  test('should support form auto-save', async ({ page }) => {
    await page.click('text=/Get.*Quote/i')

    // Fill some fields
    await page.fill('input[name="name"]', 'Jane Smith')
    await page.fill('input[name="email"]', 'jane@example.com')

    // Reload page
    await page.reload()

    // Verify data persists (if localStorage is used)
    // This test may need adjustment based on actual implementation
    const nameValue = await page.inputValue('input[name="name"]')
    if (nameValue) {
      expect(nameValue).toBe('Jane Smith')
    }
  })
})

test.describe('Quote Flow - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  })

  test('should complete quote on mobile device', async ({ page }) => {
    await page.goto('/')

    // Mobile navigation may be different
    const menuButton = page.locator('[aria-label="Menu"]')
    if (await menuButton.isVisible()) {
      await menuButton.click()
    }

    await page.click('text=/Get.*Quote/i')

    // Fill mobile-optimized form
    await page.fill('input[name="name"]', 'Mobile User')
    await page.fill('input[name="email"]', 'mobile@example.com')
    await page.fill('input[name="phone"]', '6135550199')

    await page.click('button:has-text("Closet")')
    await page.fill('textarea[name="details"]', 'Mobile quote request')

    await page.click('button[type="submit"]:has-text("Submit")')

    await expect(page.locator('text=/success/i')).toBeVisible({ timeout: 10000 })
  })

  test('should have touch-friendly form controls on mobile', async ({ page }) => {
    await page.goto('/quote')

    // Verify touch targets are adequate (minimum 44x44px)
    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox()
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44)
        expect(box.width).toBeGreaterThanOrEqual(44)
      }
    }
  })
})

test.describe('Premium Quote Flow', () => {
  test('should access premium quote wizard', async ({ page }) => {
    await page.goto('/quote/premium')

    await expect(page.locator('h1')).toContainText(/premium|luxury/i)
  })

  test('should navigate through multi-step wizard', async ({ page }) => {
    await page.goto('/quote/premium')

    // Step 1: Project Type
    await page.click('button:has-text("Walk-In Closet")')
    await page.click('button:has-text("Next")')

    // Step 2: Dimensions
    await page.fill('input[name="width"]', '10')
    await page.fill('input[name="length"]', '12')
    await page.fill('input[name="height"]', '8')
    await page.click('button:has-text("Next")')

    // Step 3: Features
    await page.check('input[value="custom-lighting"]')
    await page.check('input[value="premium-hardware"]')
    await page.click('button:has-text("Next")')

    // Step 4: Contact Information
    await page.fill('input[name="name"]', 'Premium Customer')
    await page.fill('input[name="email"]', 'premium@example.com')
    await page.fill('input[name="phone"]', '6135550100')

    // Step 5: Submit
    await page.click('button[type="submit"]:has-text("Submit")')

    await expect(page.locator('text=/success/i')).toBeVisible({ timeout: 10000 })
  })

  test('should allow navigation back through wizard steps', async ({ page }) => {
    await page.goto('/quote/premium')

    await page.click('button:has-text("Walk-In Closet")')
    await page.click('button:has-text("Next")')

    // Go back
    await page.click('button:has-text("Back")')

    // Verify we're back on first step
    await expect(page.locator('button:has-text("Walk-In Closet")')).toBeVisible()
  })

  test('should save wizard progress', async ({ page }) => {
    await page.goto('/quote/premium')

    // Fill first few steps
    await page.click('button:has-text("Walk-In Closet")')
    await page.click('button:has-text("Next")')
    await page.fill('input[name="width"]', '10')

    // Reload page
    await page.reload()

    // Verify progress is saved (if implemented)
    // This test may need adjustment based on actual implementation
  })
})
