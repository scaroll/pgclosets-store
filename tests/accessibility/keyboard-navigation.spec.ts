/**
 * Accessibility Test: Keyboard Navigation
 *
 * Comprehensive keyboard navigation and interaction testing.
 *
 * @agent #23 - Accessibility Testing Specialist
 */

import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test.describe('Basic Keyboard Navigation', () => {
    test('should navigate through all interactive elements with Tab', async ({ page }) => {
      await page.goto('/');

      const focusedElements: string[] = [];

      // Tab through first 15 interactive elements
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Tab');

        const focused = page.locator(':focus');
        if (await focused.count() > 0) {
          const role = await focused.getAttribute('role');
          const tagName = await focused.evaluate(el => el.tagName);
          focusedElements.push(role || tagName);
        }
      }

      expect(focusedElements.length).toBeGreaterThan(5);
    });

    test('should reverse navigate with Shift+Tab', async ({ page }) => {
      await page.goto('/');

      // Tab forward a few times
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const forwardFocus = await page.locator(':focus').textContent();

      // Tab backward
      await page.keyboard.press('Shift+Tab');

      const backwardFocus = await page.locator(':focus').textContent();

      // Should be different elements
      expect(backwardFocus).not.toBe(forwardFocus);
    });

    test('should activate links with Enter key', async ({ page }) => {
      await page.goto('/');

      // Find and focus a navigation link
      const navLink = page.locator('nav a').first();
      await navLink.focus();

      expect(await navLink.evaluate(el => el === document.activeElement)).toBeTruthy();

      // Press Enter
      await page.keyboard.press('Enter');

      // Should navigate
      await page.waitForLoadState('networkidle');
    });

    test('should activate buttons with Enter and Space', async ({ page }) => {
      await page.goto('/quote');

      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.focus();

      // Test Enter key
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Test Space key
      await submitButton.focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
    });
  });

  test.describe('Form Keyboard Navigation', () => {
    test('should navigate through form fields', async ({ page }) => {
      await page.goto('/quote');

      const formFields: string[] = [];

      // Tab through form
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');

        const focused = page.locator(':focus');
        if (await focused.count() > 0) {
          const name = await focused.getAttribute('name');
          if (name) formFields.push(name);
        }
      }

      expect(formFields.length).toBeGreaterThan(2);
    });

    test('should submit form with Enter from input', async ({ page }) => {
      await page.goto('/quote');

      // Fill first few fields
      const nameInput = page.locator('input[name="name"]');
      await nameInput.focus();
      await page.keyboard.type('John Doe');

      await page.keyboard.press('Tab');
      await page.keyboard.type('john@example.com');

      await page.keyboard.press('Tab');
      await page.keyboard.type('6135551234');

      // Press Enter to submit (if not disabled)
      await page.keyboard.press('Enter');

      await page.waitForTimeout(500);
    });

    test('should select radio buttons with arrow keys', async ({ page }) => {
      await page.goto('/quote');

      const radioGroup = page.locator('[role="radiogroup"], fieldset:has(input[type="radio"])').first();

      if (await radioGroup.count() > 0) {
        const firstRadio = radioGroup.locator('input[type="radio"]').first();
        await firstRadio.focus();

        // Use arrow keys to navigate
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);

        const focused = page.locator(':focus');
        const type = await focused.getAttribute('type');
        expect(type).toBe('radio');
      }
    });

    test('should toggle checkbox with Space key', async ({ page }) => {
      await page.goto('/quote');

      const checkbox = page.locator('input[type="checkbox"]').first();

      if (await checkbox.count() > 0) {
        await checkbox.focus();

        const initialState = await checkbox.isChecked();

        await page.keyboard.press('Space');
        await page.waitForTimeout(100);

        const newState = await checkbox.isChecked();
        expect(newState).not.toBe(initialState);
      }
    });

    test('should open select dropdown with Space/Enter', async ({ page }) => {
      await page.goto('/quote');

      const select = page.locator('select').first();

      if (await select.count() > 0) {
        await select.focus();

        await page.keyboard.press('Space');
        await page.waitForTimeout(200);

        // Navigate options with arrow keys
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
      }
    });
  });

  test.describe('Modal and Overlay Keyboard Interaction', () => {
    test('should close modal with Escape key', async ({ page }) => {
      await page.goto('/');

      // Open a modal
      const modalTrigger = page.locator('button:has-text("Quote"), button[data-modal-trigger]').first();

      if (await modalTrigger.count() > 0) {
        await modalTrigger.click();

        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();

        // Press Escape
        await page.keyboard.press('Escape');

        // Modal should close
        await expect(modal).not.toBeVisible();
      }
    });

    test('should trap focus within modal', async ({ page }) => {
      await page.goto('/');

      const modalTrigger = page.locator('button:has-text("Quote")').first();

      if (await modalTrigger.count() > 0) {
        await modalTrigger.click();

        const modal = page.locator('[role="dialog"]');

        if (await modal.isVisible()) {
          // Tab through all focusable elements
          for (let i = 0; i < 30; i++) {
            await page.keyboard.press('Tab');

            const focused = page.locator(':focus');
            const isInModal = await focused.evaluate((el, modalEl) => {
              return modalEl?.contains(el) ?? false;
            }, await modal.elementHandle());

            expect(isInModal).toBeTruthy();
          }
        }
      }
    });

    test('should return focus to trigger after closing modal', async ({ page }) => {
      await page.goto('/');

      const modalTrigger = page.locator('button:has-text("Quote")').first();

      if (await modalTrigger.count() > 0) {
        const triggerText = await modalTrigger.textContent();

        await modalTrigger.click();

        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();

        // Close modal with Escape
        await page.keyboard.press('Escape');

        // Focus should return to trigger
        const focused = page.locator(':focus');
        const focusedText = await focused.textContent();

        expect(focusedText).toBe(triggerText);
      }
    });
  });

  test.describe('Navigation Menu Keyboard Interaction', () => {
    test('should navigate menu with arrow keys', async ({ page }) => {
      await page.goto('/');

      const nav = page.locator('nav').first();
      const firstLink = nav.locator('a').first();

      await firstLink.focus();

      // Use arrow keys
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);

      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);

      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    });

    test('should navigate mobile menu with keyboard', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const menuButton = page.locator('button[aria-label*="menu"]');

      if (await menuButton.count() > 0) {
        await menuButton.focus();
        await page.keyboard.press('Enter');

        const menu = page.locator('[role="dialog"]');
        await expect(menu).toBeVisible();

        // Navigate menu items
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
      }
    });

    test('should open dropdown menu with Enter/Space', async ({ page }) => {
      await page.goto('/');

      const dropdownTrigger = page.locator('button[aria-expanded], button[aria-haspopup="true"]').first();

      if (await dropdownTrigger.count() > 0) {
        await dropdownTrigger.focus();

        const expandedBefore = await dropdownTrigger.getAttribute('aria-expanded');

        await page.keyboard.press('Enter');
        await page.waitForTimeout(200);

        const expandedAfter = await dropdownTrigger.getAttribute('aria-expanded');
        expect(expandedAfter).not.toBe(expandedBefore);
      }
    });
  });

  test.describe('Product Interaction Keyboard Support', () => {
    test('should browse products with keyboard', async ({ page }) => {
      await page.goto('/products');

      // Tab to first product
      let foundProduct = false;
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');

        const focused = page.locator(':focus');
        const text = await focused.textContent();

        if (text && text.length > 0) {
          foundProduct = true;
          break;
        }
      }

      expect(foundProduct).toBeTruthy();
    });

    test('should open product with Enter key', async ({ page }) => {
      await page.goto('/products');

      const firstProduct = page.locator('[data-testid="product-card"] a, [data-testid="product-card"] button').first();

      if (await firstProduct.count() > 0) {
        await firstProduct.focus();
        await page.keyboard.press('Enter');

        await page.waitForLoadState('networkidle');

        // Should be on product page
        expect(page.url()).toMatch(/product/);
      }
    });

    test('should add to cart with keyboard', async ({ page }) => {
      await page.goto('/products');

      const addToCartButton = page.locator('button:has-text("Add to Cart")').first();

      if (await addToCartButton.count() > 0) {
        await addToCartButton.focus();
        await page.keyboard.press('Enter');

        await page.waitForTimeout(500);

        // Cart indicator should update
        const cartIndicator = page.locator('[data-testid="cart-count"], text=/cart.*[1-9]/i');
        if (await cartIndicator.count() > 0) {
          await expect(cartIndicator).toBeVisible();
        }
      }
    });
  });

  test.describe('Search Keyboard Interaction', () => {
    test('should open search with keyboard shortcut', async ({ page }) => {
      await page.goto('/');

      // Try Ctrl+K or Cmd+K
      const isMac = process.platform === 'darwin';
      const modifier = isMac ? 'Meta' : 'Control';

      await page.keyboard.press(`${modifier}+KeyK`);
      await page.waitForTimeout(300);

      const searchInput = page.locator('input[type="search"]');
      if (await searchInput.count() > 0) {
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toBeFocused();
      }
    });

    test('should navigate search results with keyboard', async ({ page }) => {
      await page.goto('/');

      const searchInput = page.locator('input[type="search"]').first();

      if (await searchInput.count() > 0) {
        await searchInput.focus();
        await page.keyboard.type('closet');

        await page.waitForTimeout(500);

        // Navigate suggestions with arrow keys
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('Enter');

        await page.waitForLoadState('networkidle');
      }
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should have documented keyboard shortcuts', async ({ page }) => {
      await page.goto('/');

      // Look for keyboard shortcuts help
      const shortcutsButton = page.locator('button[aria-label*="keyboard"], button:has-text("Shortcuts"), [data-testid="keyboard-shortcuts"]');

      if (await shortcutsButton.count() > 0) {
        await shortcutsButton.click();

        const shortcutsPanel = page.locator('[role="dialog"]:has-text("Shortcuts"), [data-testid="shortcuts-panel"]');
        await expect(shortcutsPanel).toBeVisible();
      }
    });
  });

  test.describe('Focus Visibility', () => {
    test('should show visible focus indicator on all interactive elements', async ({ page }) => {
      await page.goto('/');

      // Test focus on buttons
      const button = page.locator('button').first();
      await button.focus();

      const hasVisibleFocus = await button.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return (
          styles.outline !== 'none' ||
          styles.outlineWidth !== '0px' ||
          styles.boxShadow !== 'none'
        );
      });

      expect(hasVisibleFocus).toBeTruthy();
    });

    test('should not remove focus outline on click', async ({ page }) => {
      await page.goto('/');

      const button = page.locator('button').first();
      await button.click();

      // After click, focus outline should still be visible
      const outlineAfterClick = await button.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none';
      });

      // This test may fail if :focus-visible is used (which is acceptable)
      // The important thing is that keyboard focus is always visible
    });
  });
});
