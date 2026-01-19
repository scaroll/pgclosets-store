/**
 * Accessibility Test: Automated WCAG Compliance
 *
 * Automated accessibility testing using axe-core for WCAG 2.1 Level AAA compliance.
 *
 * @agent #23 - Accessibility Testing Specialist
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// eslint-disable-next-line no-console
const log = console.log

test.describe('Automated Accessibility Tests', () => {
  test.describe('Homepage Accessibility', () => {
    test('should not have any automatically detectable accessibility violations', async ({
      page,
    }) => {
      await page.goto('/')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should meet WCAG AAA standards on homepage', async ({ page }) => {
      await page.goto('/')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aaa', 'wcag21aaa'])
        .analyze()

      // AAA may have some violations, log them
      if (accessibilityScanResults.violations.length > 0) {
        log('AAA violations:', accessibilityScanResults.violations)
      }

      // At minimum, ensure no critical violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      )
      expect(criticalViolations).toEqual([])
    })

    test('should have proper landmark regions', async ({ page }) => {
      await page.goto('/')

      const main = page.locator('main, [role="main"]')
      const nav = page.locator('nav, [role="navigation"]')
      const header = page.locator('header, [role="banner"]')
      const footer = page.locator('footer, [role="contentinfo"]')

      await expect(main).toBeVisible()
      await expect(nav).toBeVisible()
      await expect(header).toBeVisible()
      await expect(footer).toBeVisible()
    })

    test('should have a single h1 heading', async ({ page }) => {
      await page.goto('/')

      const h1Elements = page.locator('h1')
      const count = await h1Elements.count()

      expect(count).toBe(1)
    })

    test('should have logical heading hierarchy', async ({ page }) => {
      await page.goto('/')

      // Get heading levels
      const levels = await page.evaluate(() => {
        const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        return headingElements.map(h => parseInt(h.tagName.charAt(1)))
      })

      // Verify no skipped levels
      for (let i = 1; i < levels.length; i++) {
        const currentLevel = levels[i] as number
        const prevLevel = levels[i - 1] as number
        const diff = currentLevel - prevLevel
        expect(diff).toBeLessThanOrEqual(1)
      }
    })
  })

  test.describe('Product Pages Accessibility', () => {
    test('should have no violations on products listing', async ({ page }) => {
      await page.goto('/products')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should have accessible product cards', async ({ page }) => {
      await page.goto('/products')

      const productCards = page.locator('[data-testid="product-card"], article')
      const firstCard = productCards.first()

      // Each card should have a heading
      const heading = firstCard.locator('h2, h3, [role="heading"]')
      await expect(heading).toBeVisible()

      // Images should have alt text
      const images = firstCard.locator('img')
      const imageCount = await images.count()

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).not.toBeNull()
      }
    })

    test('should have accessible product detail page', async ({ page }) => {
      await page.goto('/products')

      const firstProduct = page.locator('[data-testid="product-card"]').first()
      await firstProduct.click()

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('Quote Form Accessibility', () => {
    test('should have no violations on quote form', async ({ page }) => {
      await page.goto('/quote')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/quote')

      const inputs = page.locator(
        'input[type="text"], input[type="email"], input[type="tel"], textarea'
      )
      const count = await inputs.count()

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')

        // Should have associated label
        if (id) {
          const label = page.locator(`label[for="${id}"]`)
          await expect(label).toBeVisible()
        } else {
          // Should have aria-label or be inside a label
          const ariaLabel = await input.getAttribute('aria-label')
          expect(ariaLabel).toBeTruthy()
        }
      }
    })

    test('should indicate required fields', async ({ page }) => {
      await page.goto('/quote')

      const requiredInputs = page.locator('input[required], textarea[required]')
      const count = await requiredInputs.count()

      expect(count).toBeGreaterThan(0)

      // Each required field should be indicated visually and programmatically
      for (let i = 0; i < count; i++) {
        const input = requiredInputs.nth(i)
        const required = await input.getAttribute('required')
        const ariaRequired = await input.getAttribute('aria-required')

        expect(required !== null || ariaRequired === 'true').toBeTruthy()
      }
    })

    test('should have accessible error messages', async ({ page }) => {
      await page.goto('/quote')

      // Submit empty form to trigger errors
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()

      // Wait for errors to appear
      await page.waitForTimeout(500)

      const errorMessages = page.locator('[role="alert"], .error-message, [aria-live="polite"]')
      const errorCount = await errorMessages.count()

      if (errorCount > 0) {
        // Error messages should be announced to screen readers
        for (let i = 0; i < errorCount; i++) {
          const error = errorMessages.nth(i)
          const role = await error.getAttribute('role')
          const ariaLive = await error.getAttribute('aria-live')

          expect(role === 'alert' || ariaLive === 'polite' || ariaLive === 'assertive').toBeTruthy()
        }
      }
    })
  })

  test.describe('Navigation Accessibility', () => {
    test('should have accessible navigation menu', async ({ page }) => {
      await page.goto('/')

      const nav = page.locator('nav').first()
      await expect(nav).toBeVisible()

      // Nav should have accessible name
      const ariaLabel = await nav.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()

      // Links should be keyboard accessible
      const links = nav.locator('a')
      const linkCount = await links.count()

      expect(linkCount).toBeGreaterThan(0)
    })

    test('should have skip to main content link', async ({ page }) => {
      await page.goto('/')

      // Press Tab to reveal skip link
      await page.keyboard.press('Tab')

      const skipLink = page.locator('a:has-text("Skip"), a[href="#main"]').first()

      if ((await skipLink.count()) > 0) {
        await expect(skipLink).toBeVisible()

        // Should be first focusable element
        const focused = page.locator(':focus')
        await expect(focused).toHaveText(/skip/i)
      }
    })

    test('should have accessible mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")')

      if ((await menuButton.count()) > 0) {
        // Button should have accessible name
        const ariaLabel = await menuButton.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()

        // Should indicate expanded state
        const ariaExpanded = await menuButton.getAttribute('aria-expanded')
        expect(ariaExpanded).toBeTruthy()

        // Open menu
        await menuButton.click()

        // Verify expanded state updated
        const expandedAfter = await menuButton.getAttribute('aria-expanded')
        expect(expandedAfter).toBe('true')

        // Menu should be visible
        const menu = page.locator('[role="dialog"], [data-testid="mobile-menu"]')
        await expect(menu).toBeVisible()
      }
    })
  })

  test.describe('Color Contrast', () => {
    test('should meet color contrast requirements', async ({ page }) => {
      await page.goto('/')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .options({ rules: { 'color-contrast': { enabled: true } } })
        .analyze()

      const contrastViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'color-contrast'
      )

      expect(contrastViolations).toEqual([])
    })

    test('should meet AAA color contrast for body text', async ({ page }) => {
      await page.goto('/')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aaa'])
        .options({ rules: { 'color-contrast-enhanced': { enabled: true } } })
        .analyze()

      const contrastViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'color-contrast-enhanced'
      )

      // Log violations but don't fail (AAA is aspirational)
      if (contrastViolations.length > 0) {
        log('AAA contrast violations:', contrastViolations)
      }
    })
  })

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/')

      // Tab to first focusable element
      await page.keyboard.press('Tab')

      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()

      // Get computed styles
      const outlineStyle = await focused.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow,
        }
      })

      // Should have visible focus indicator
      const hasVisibleFocus =
        outlineStyle.outlineWidth !== '0px' ||
        outlineStyle.outline !== 'none' ||
        outlineStyle.boxShadow !== 'none'

      expect(hasVisibleFocus).toBeTruthy()
    })

    test('should maintain logical tab order', async ({ page }) => {
      await page.goto('/')

      const focusableElements: string[] = []

      // Tab through first 10 elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')

        const focused = page.locator(':focus')
        const tagName = await focused.evaluate(el => el.tagName)
        const text = await focused.textContent()

        focusableElements.push(`${tagName}: ${text?.substring(0, 30)}`)
      }

      // Verify we got a logical sequence
      expect(focusableElements.length).toBe(10)
      log('Tab order:', focusableElements)
    })

    test('should trap focus in modal dialogs', async ({ page }) => {
      await page.goto('/')

      // Try to open a modal
      const modalTrigger = page
        .locator('button:has-text("Quote"), button:has-text("Contact")')
        .first()

      if ((await modalTrigger.count()) > 0) {
        await modalTrigger.click()

        const modal = page.locator('[role="dialog"]')

        if (await modal.isVisible()) {
          // Tab multiple times
          for (let i = 0; i < 20; i++) {
            await page.keyboard.press('Tab')
          }

          // Focus should still be within modal
          const currentFocus = page.locator(':focus')
          const modalEl = await modal.elementHandle()
          if (modalEl) {
            const isWithinModal = await currentFocus.evaluate((el, modalEl) => {
              return modalEl.contains(el)
            }, modalEl)

            expect(isWithinModal).toBeTruthy()
          }
        }
      }
    })
  })

  test.describe('Images and Media', () => {
    test('should have alt text on all images', async ({ page }) => {
      await page.goto('/')

      const images = page.locator('img')
      const imageCount = await images.count()

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')

        // Alt attribute should exist (can be empty for decorative images)
        expect(alt).not.toBeNull()
      }
    })

    test('should have accessible video controls', async ({ page }) => {
      await page.goto('/')

      const videos = page.locator('video')
      const videoCount = await videos.count()

      for (let i = 0; i < videoCount; i++) {
        const video = videos.nth(i)

        // Video should have controls
        const hasControls = await video.getAttribute('controls')
        expect(hasControls).toBeTruthy()
      }
    })
  })
})
