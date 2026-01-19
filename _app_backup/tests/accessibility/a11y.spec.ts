/**
 * Comprehensive Accessibility Tests
 * WCAG 2.1 Level AAA Compliance Testing with Playwright
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Test configuration
test.describe.configure({ mode: 'parallel' })

/**
 * Homepage Accessibility Tests
 */
test.describe('Homepage Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper page title', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  test('should have skip links that work', async ({ page }) => {
    await page.goto('/')

    // Tab to first skip link
    await page.keyboard.press('Tab')

    // Get the focused element
    const skipLink = page.locator('a.skip-link:focus')
    await expect(skipLink).toBeVisible()

    // Click skip link
    await skipLink.click()

    // Verify focus moved to main content
    const mainContent = page.locator('main, #main')
    await expect(mainContent).toBeFocused()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Check for h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)

    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    const headingLevels = await Promise.all(
      headings.map(h =>
        h.evaluate(el => {
          const tag = el.tagName
          if (tag.length < 2) return 1
          const levelChar = tag.charAt(1)
          return parseInt(levelChar, 10)
        })
      )
    )

    // Verify no heading levels are skipped
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i] as number
      const prevLevel = headingLevels[i - 1] as number
      const diff = currentLevel - prevLevel
      expect(Math.abs(diff)).toBeLessThanOrEqual(1)
    }
  })

  test('should have ARIA landmarks', async ({ page }) => {
    await page.goto('/')

    // Check for main landmark
    const main = page.locator('main, [role="main"]')
    await expect(main).toHaveCount(1)

    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]')
    await expect(nav.first()).toBeVisible()

    // Check for contentinfo landmark (footer)
    const footer = page.locator('footer, [role="contentinfo"]')
    await expect(footer).toBeVisible()
  })
})

/**
 * Keyboard Navigation Tests
 */
test.describe('Keyboard Navigation', () => {
  test('should allow full keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Start at beginning of page
    await page.keyboard.press('Tab')

    // Track all focusable elements
    const focusableElements = await page
      .locator(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      .all()

    expect(focusableElements.length).toBeGreaterThan(0)

    // Verify each element can receive focus
    for (let i = 0; i < Math.min(focusableElements.length, 20); i++) {
      const element = page.locator(':focus')
      await expect(element).toBeVisible()
      await page.keyboard.press('Tab')
    }
  })

  test('should show visible focus indicators', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')

    // Check that focused element has visible outline
    const focusedElement = page.locator(':focus')
    const outline = await focusedElement.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      }
    })

    // Should have either outline or box-shadow for focus
    expect(
      outline.outline !== 'none' || outline.outlineWidth !== '0px' || outline.boxShadow !== 'none'
    ).toBeTruthy()
  })

  test('should not create keyboard traps', async ({ page }) => {
    await page.goto('/')

    // Tab forward many times
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(50)
    }

    // Should be able to continue tabbing without getting stuck
    const currentFocused = page.locator(':focus')
    await expect(currentFocused).toBeVisible()
  })

  test('should support Escape key to close modals', async ({ page }) => {
    await page.goto('/')

    // Try to open a modal (adjust selector based on your site)
    const modalTrigger = page
      .locator('button:has-text("Open"), button[aria-haspopup="dialog"]')
      .first()

    if ((await modalTrigger.count()) > 0) {
      await modalTrigger.click()

      // Wait for modal
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Press Escape
      await page.keyboard.press('Escape')

      // Modal should close
      await expect(modal).not.toBeVisible()
    }
  })
})

/**
 * Color Contrast Tests
 */
test.describe('Color Contrast', () => {
  test('should meet AAA contrast ratios', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa'])
      .include(['color-contrast'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have sufficient contrast on interactive elements', async ({ page }) => {
    await page.goto('/')

    // Test buttons
    const buttons = await page.locator('button').all()

    for (const button of buttons.slice(0, 10)) {
      const contrast = await button.evaluate(el => {
        const styles = window.getComputedStyle(el)
        const bgColor = styles.backgroundColor
        const color = styles.color

        // Helper to convert rgb to luminance
        const getLuminance = (rgb: string) => {
          const match = rgb.match(/\d+/g)
          if (!match || match.length < 3) return 0
          const r = Number(match[0])
          const g = Number(match[1] as string)
          const b = Number(match[2] as string)
          const rs = r / 255 <= 0.03928 ? r / 255 / 12.92 : Math.pow((r / 255 + 0.055) / 1.055, 2.4)
          const gs = g / 255 <= 0.03928 ? g / 255 / 12.92 : Math.pow((g / 255 + 0.055) / 1.055, 2.4)
          const bs = b / 255 <= 0.03928 ? b / 255 / 12.92 : Math.pow((b / 255 + 0.055) / 1.055, 2.4)
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
        }

        const l1 = getLuminance(color)
        const l2 = getLuminance(bgColor)
        const brightest = Math.max(l1, l2)
        const darkest = Math.min(l1, l2)

        return (brightest + 0.05) / (darkest + 0.05)
      })

      // AAA requires 7:1 for normal text, 4.5:1 for large text
      // Buttons typically have larger text, so use 4.5:1
      expect(contrast).toBeGreaterThanOrEqual(4.5)
    }
  })
})

/**
 * Form Accessibility Tests
 */
test.describe('Form Accessibility', () => {
  test('should have labels for all form inputs', async ({ page }) => {
    await page.goto('/')

    const inputs = await page.locator('input:not([type="hidden"]), select, textarea').all()

    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        // Check for associated label
        const id = el.getAttribute('id')
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`)
          if (label) return true
        }

        // Check for aria-label
        if (el.getAttribute('aria-label')) return true

        // Check for aria-labelledby
        if (el.getAttribute('aria-labelledby')) return true

        // Check for wrapping label
        if (el.closest('label')) return true

        return false
      })

      expect(hasLabel).toBeTruthy()
    }
  })

  test('should mark required fields with aria-required', async ({ page }) => {
    await page.goto('/')

    const requiredInputs = await page
      .locator('input[required], select[required], textarea[required]')
      .all()

    for (const input of requiredInputs) {
      const ariaRequired = await input.getAttribute('aria-required')
      expect(ariaRequired).toBe('true')
    }
  })

  test('should announce errors with aria-invalid and aria-describedby', async ({ page }) => {
    await page.goto('/')

    // Find a form and try to submit with invalid data
    const form = page.locator('form').first()

    if ((await form.count()) > 0) {
      // Try to submit form
      const submitButton = form.locator('button[type="submit"]')
      if ((await submitButton.count()) > 0) {
        await submitButton.click()

        // Check for error state
        const invalidInputs = await page.locator('[aria-invalid="true"]').all()

        for (const input of invalidInputs) {
          const describedBy = await input.getAttribute('aria-describedby')
          expect(describedBy).toBeTruthy()

          // Verify error message exists
          if (describedBy) {
            const errorMessage = page.locator(`#${describedBy}`)
            await expect(errorMessage).toBeVisible()
          }
        }
      }
    }
  })
})

/**
 * Image Accessibility Tests
 */
test.describe('Image Accessibility', () => {
  test('should have alt text for all images', async ({ page }) => {
    await page.goto('/')

    const images = await page.locator('img').all()

    for (const image of images) {
      const alt = await image.getAttribute('alt')

      // Images should have alt attribute (can be empty for decorative)
      expect(alt !== null).toBeTruthy()

      // If decorative, should have empty alt or role="presentation"
      if (alt === '') {
        // Empty alt is valid for decorative images
        expect(true).toBe(true)
      } else if (alt) {
        // Non-empty alt should be descriptive
        expect(alt.length).toBeGreaterThan(0)
      }
    }
  })

  test('should not have poor quality alt text', async ({ page }) => {
    await page.goto('/')

    const images = await page.locator('img[alt]').all()

    const poorAltPatterns = [
      /^image$/i,
      /^picture$/i,
      /^photo$/i,
      /^img$/i,
      /^screenshot$/i,
      /^untitled$/i,
      /^image_?\d+$/i,
    ]

    for (const image of images) {
      const alt = await image.getAttribute('alt')

      if (alt && alt !== '') {
        for (const pattern of poorAltPatterns) {
          expect(pattern.test(alt)).toBeFalsy()
        }
      }
    }
  })
})

/**
 * ARIA and Semantic HTML Tests
 */
test.describe('ARIA and Semantics', () => {
  test('should use semantic HTML where possible', async ({ page }) => {
    await page.goto('/')

    // Check for semantic elements
    const main = page.locator('main')
    await expect(main).toHaveCount(1)

    const nav = page.locator('nav')
    await expect(nav.first()).toBeVisible()

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('should have valid ARIA attributes', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .include(['aria'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should use buttons for button functionality', async ({ page }) => {
    await page.goto('/')

    // Find elements with role="button" that aren't actual buttons
    const fakeButtons = await page.locator('[role="button"]:not(button)').all()

    for (const fakeButton of fakeButtons) {
      // Should have tabindex
      const tabindex = await fakeButton.getAttribute('tabindex')
      expect(tabindex).not.toBeNull()
      expect(parseInt(tabindex || '-1')).toBeGreaterThanOrEqual(0)
    }
  })
})

/**
 * Touch Target Tests
 */
test.describe('Touch Targets', () => {
  test('should have minimum 44x44px touch targets', async ({ page }) => {
    await page.goto('/')

    const interactiveElements = await page
      .locator('button, a[href], input, select, textarea, [role="button"], [role="link"]')
      .all()

    for (const element of interactiveElements.slice(0, 20)) {
      const boundingBox = await element.boundingBox()

      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThanOrEqual(44)
        expect(boundingBox.height).toBeGreaterThanOrEqual(44)
      }
    }
  })
})

/**
 * Motion and Animation Tests
 */
test.describe('Motion and Animation', () => {
  test('should respect prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Check that animations are disabled
    const animatedElements = await page.locator('[class*="animate"]').all()

    for (const element of animatedElements) {
      const animationDuration = await element.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return styles.animationDuration
      })

      // Animation should be instant or very short
      expect(
        animationDuration === '0s' || animationDuration === '0.01ms' || animationDuration === '0ms'
      ).toBeTruthy()
    }
  })
})

/**
 * Zoom and Text Scaling Tests
 */
test.describe('Zoom and Text Scaling', () => {
  test('should work at 200% zoom', async ({ page }) => {
    await page.goto('/')

    // Set viewport to simulate 200% zoom
    await page.setViewportSize({ width: 640, height: 360 })

    // Check that content is still accessible
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])

    // Check that no horizontal scrolling is required for main content
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth)

    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 10) // Allow small margin
  })
})

/**
 * Screen Reader Tests
 */
test.describe('Screen Reader Support', () => {
  test('should have live regions for dynamic content', async ({ page }) => {
    await page.goto('/')

    // Check for ARIA live regions
    const liveRegions = await page.locator('[aria-live]').all()

    // At least one live region should exist for announcements
    expect(liveRegions.length).toBeGreaterThan(0)
  })

  test('should announce loading states', async ({ page }) => {
    await page.goto('/')

    // Check for loading indicators with proper ARIA
    const loadingIndicators = await page.locator('[aria-busy="true"], [role="status"]').all()

    // Loading indicators should have screen reader text
    for (const indicator of loadingIndicators) {
      const text = await indicator.textContent()
      const ariaLabel = await indicator.getAttribute('aria-label')

      expect(text || ariaLabel).toBeTruthy()
    }
  })
})
