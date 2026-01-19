// @ts-nocheck - Test file with Product type issues
import { describe, expect, it } from 'vitest';
import { deriveSlug, type Product } from '@/components/products/QuickConfigureCard';

describe('deriveSlug', () => {
  const baseProduct: Product = {
    id: 'test-product',
    title: 'Industrial Metal Barn Door',
    slug: null,
    handle: null,
    price: 1000,
  };

  it('returns provided slug when valid', () => {
    const product: Product = { ...baseProduct, slug: 'industrial-metal-barn-door' };
    expect(deriveSlug(product)).toBe('industrial-metal-barn-door');
  });

  it('ignores literal "undefined" slug and derives from title', () => {
    const product: Product = { ...baseProduct, slug: 'undefined' };
    expect(deriveSlug(product)).toBe('industrial-metal-barn-door');
  });

  it('falls back to handle when slug missing', () => {
    const product: Product = { ...baseProduct, slug: null, handle: 'handle-slug' };
    expect(deriveSlug(product)).toBe('handle-slug');
  });

  it('returns null when neither slug, handle, nor title available', () => {
    const product = { ...baseProduct, title: '', slug: null, handle: null };
    expect(deriveSlug(product)).toBeNull();
  });
});
