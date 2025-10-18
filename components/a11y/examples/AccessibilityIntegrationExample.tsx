'use client'

/**
 * Accessibility Integration Example
 *
 * This file demonstrates how to integrate all accessibility components
 * into a PG Closets page for WCAG 2.1 AAA compliance.
 */

import React, { useState } from 'react'
import {
  SkipLinks,
  ScreenReaderOnly,
  FocusTrap,
  LiveRegion,
  LoadingAnnouncer,
  KeyboardShortcuts,
  type KeyboardShortcut
} from '@/components/a11y'
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider'

export function AccessibilityIntegrationExample() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const { announceToScreenReader } = useAccessibility()

  // Define keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '/',
      description: 'Focus search',
      action: () => {
        document.getElementById('search')?.focus()
        announceToScreenReader('Search focused')
      },
      category: 'Navigation'
    },
    {
      key: 'm',
      modifiers: { ctrl: true },
      description: 'Open modal',
      action: () => {
        setIsModalOpen(true)
        announceToScreenReader('Modal opened')
      },
      category: 'Actions'
    },
    {
      key: 'h',
      description: 'Go to homepage',
      action: () => {
        window.location.href = '/'
      },
      category: 'Navigation'
    }
  ]

  // Example: Add to cart with accessibility announcements
  const handleAddToCart = async () => {
    setIsLoading(true)
    announceToScreenReader('Adding item to cart')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setCartMessage('Item added to cart successfully')
    announceToScreenReader('Item added to cart!')

    // Clear message after delay
    setTimeout(() => setCartMessage(null), 3000)
  }

  return (
    <>
      {/* Skip Links - First element for keyboard users */}
      <SkipLinks
        links={[
          { href: '#main', label: 'Skip to main content' },
          { href: '#navigation', label: 'Skip to navigation' },
          { href: '#products', label: 'Skip to products' },
          { href: '#footer', label: 'Skip to footer' }
        ]}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts shortcuts={shortcuts} enabled={true} showHelp={true} />

      {/* Navigation with proper ARIA */}
      <nav id="navigation" aria-label="Main navigation">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>

        {/* Search with keyboard shortcut hint */}
        <div className="search-container">
          <label htmlFor="search">
            <ScreenReaderOnly>Search products</ScreenReaderOnly>
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            aria-describedby="search-hint"
          />
          <span id="search-hint" className="text-xs text-muted-foreground">
            Press <kbd>/</kbd> to focus
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main">
        <h1>Product Page Example</h1>

        <section id="products" aria-labelledby="products-heading">
          {/* Visually hidden heading for screen readers */}
          <h2 id="products-heading">
            <ScreenReaderOnly>Product Details</ScreenReaderOnly>
          </h2>

          {/* Product Card */}
          <article>
            <img
              src="/products/closet.jpg"
              alt="White walk-in closet with custom shelving, LED lighting, and glass doors"
            />

            <h3>Premium Walk-In Closet</h3>

            <p>
              Luxury custom closet system with adjustable shelving and
              integrated lighting.
            </p>

            {/* Button with loading state and announcements */}
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              aria-busy={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <>
                  <span aria-hidden="true">Adding...</span>
                  <ScreenReaderOnly>
                    Adding item to cart, please wait
                  </ScreenReaderOnly>
                </>
              ) : (
                'Add to Cart'
              )}
            </button>

            {/* Loading announcer */}
            <LoadingAnnouncer
              loading={isLoading}
              loadingMessage="Adding item to cart..."
              completeMessage="Item added successfully"
            />

            {/* Success message live region */}
            <LiveRegion politeness="polite" clearAfter={3000}>
              {cartMessage}
            </LiveRegion>

            {/* Modal trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              aria-haspopup="dialog"
              className="btn-secondary"
            >
              View Details
              <ScreenReaderOnly> - Opens in modal dialog</ScreenReaderOnly>
            </button>
          </article>
        </section>

        {/* Accessible Data Table Example */}
        <section aria-labelledby="specs-heading">
          <h2 id="specs-heading">Product Specifications</h2>

          <table>
            <caption>
              <ScreenReaderOnly>
                Technical specifications for Premium Walk-In Closet
              </ScreenReaderOnly>
            </caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Dimensions</th>
                <td>10' × 12' × 8'</td>
              </tr>
              <tr>
                <th scope="row">Material</th>
                <td>Premium hardwood</td>
              </tr>
              <tr>
                <th scope="row">Warranty</th>
                <td>Lifetime</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Accessible Form Example */}
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading">Request a Quote</h2>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-field">
              <label htmlFor="name">
                Name
                <abbr title="required" aria-label="required">
                  *
                </abbr>
              </label>
              <input
                id="name"
                type="text"
                required
                aria-required="true"
                aria-describedby="name-hint"
                autoComplete="name"
              />
              <span id="name-hint" className="text-xs text-muted-foreground">
                Enter your full name
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="email">
                Email
                <abbr title="required" aria-label="required">
                  *
                </abbr>
              </label>
              <input
                id="email"
                type="email"
                required
                aria-required="true"
                aria-describedby="email-hint"
                autoComplete="email"
              />
              <span id="email-hint" className="text-xs text-muted-foreground">
                We'll never share your email
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                aria-describedby="message-hint"
              />
              <span id="message-hint" className="text-xs text-muted-foreground">
                Tell us about your project
              </span>
            </div>

            <button type="submit" className="btn-primary">
              Submit Request
            </button>
          </form>
        </section>
      </main>

      {/* Accessible Modal Dialog */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <FocusTrap
            active={isModalOpen}
            returnFocus={true}
            allowEscape={true}
            onEscape={() => setIsModalOpen(false)}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2 id="modal-title">Product Details</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close dialog"
                  className="btn-close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div id="modal-description" className="modal-body">
                <p>
                  Detailed information about the Premium Walk-In Closet system.
                </p>

                {/* Modal content here */}
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">Add to Cart</button>
              </div>
            </div>
          </FocusTrap>

          {/* Announce modal state changes */}
          <LiveRegion politeness="assertive">
            {isModalOpen ? 'Product details dialog opened' : null}
          </LiveRegion>
        </div>
      )}

      {/* Footer */}
      <footer id="footer" role="contentinfo">
        <p>&copy; 2025 PG Closets. All rights reserved.</p>

        {/* Accessibility statement link */}
        <nav aria-label="Footer navigation">
          <ul>
            <li>
              <a href="/accessibility">Accessibility Statement</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  )
}

/**
 * Usage Notes:
 *
 * 1. SkipLinks: Always first element for keyboard users
 * 2. ARIA Labels: Every section and landmark properly labeled
 * 3. ScreenReaderOnly: Hide visual decorations, add context
 * 4. LiveRegions: Announce dynamic changes
 * 5. FocusTrap: Trap focus in modals
 * 6. Keyboard Shortcuts: Provide power user features
 * 7. Loading States: Announce with aria-busy and live regions
 * 8. Form Labels: All inputs properly labeled and described
 * 9. Error Handling: Use aria-invalid and aria-describedby
 * 10. Focus Management: Return focus after modal closes
 */

export default AccessibilityIntegrationExample
