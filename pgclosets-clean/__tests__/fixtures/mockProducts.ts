import { ReninProduct } from '@/lib/renin-product-loader'

export const mockProduct: ReninProduct = {
  id: 'test-product-1',
  sku: 'TEST-001',
  handle: 'test-barn-door',
  title: 'Test Barn Door',
  description: 'A beautiful test barn door for testing purposes. Features premium materials and modern design.',
  vendor: 'Renin',
  product_type: 'Barn Door',
  tags: ['barn door', 'modern', 'premium'],
  status: 'active',
  options: [
    {
      name: 'Size',
      values: ['32"', '36"', '42"']
    },
    {
      name: 'Finish',
      values: ['Natural', 'Dark Oak', 'White']
    }
  ],
  variants: [
    {
      id: 'variant-1',
      sku: 'TEST-001-32-NAT',
      title: '32" / Natural',
      price: 599.99,
      compare_at_price: 699.99,
      weight: 25.5,
      inventory_quantity: 10,
      requires_shipping: true,
      taxable: true,
      option1: '32"',
      option2: 'Natural',
      image: {
        src: '/test-images/barn-door-natural.jpg',
        alt: 'Test Barn Door in Natural finish'
      }
    },
    {
      id: 'variant-2',
      sku: 'TEST-001-36-NAT',
      title: '36" / Natural',
      price: 649.99,
      compare_at_price: 749.99,
      weight: 28.0,
      inventory_quantity: 8,
      requires_shipping: true,
      taxable: true,
      option1: '36"',
      option2: 'Natural'
    }
  ],
  images: [
    {
      src: '/test-images/barn-door-main.jpg',
      alt: 'Test Barn Door main image',
      position: 1
    },
    {
      src: '/test-images/barn-door-detail.jpg',
      alt: 'Test Barn Door detail view',
      position: 2
    }
  ],
  metafields: [
    {
      namespace: 'custom',
      key: 'material',
      value: 'Engineered Wood',
      type: 'single_line_text_field'
    },
    {
      namespace: 'custom',
      key: 'warranty',
      value: '5 years',
      type: 'single_line_text_field'
    }
  ],
  seo: {
    title: 'Test Barn Door | Premium Quality | PG Closets',
    description: 'Shop our premium test barn door. Perfect for modern homes in Ottawa. Free consultation available.'
  }
}

export const mockProductWithoutImages: ReninProduct = {
  ...mockProduct,
  id: 'test-product-2',
  sku: 'TEST-002',
  handle: 'test-product-no-images',
  title: 'Test Product No Images',
  images: [],
  variants: [
    {
      ...mockProduct.variants[0],
      id: 'variant-no-image',
      sku: 'TEST-002-32-NAT',
      image: undefined
    }
  ]
}

export const mockProductOnSale: ReninProduct = {
  ...mockProduct,
  id: 'test-product-3',
  sku: 'TEST-003',
  handle: 'test-product-on-sale',
  title: 'Test Product On Sale',
  variants: [
    {
      ...mockProduct.variants[0],
      id: 'variant-sale',
      sku: 'TEST-003-32-NAT',
      price: 399.99,
      compare_at_price: 599.99,
    }
  ]
}

export const mockProductContactForPrice: ReninProduct = {
  ...mockProduct,
  id: 'test-product-4',
  sku: 'TEST-004',
  handle: 'test-product-contact-price',
  title: 'Test Product Contact Price',
  variants: [
    {
      ...mockProduct.variants[0],
      id: 'variant-contact',
      sku: 'TEST-004-32-NAT',
      price: 0,
      compare_at_price: 0,
    }
  ]
}

export const mockProducts: ReninProduct[] = [
  mockProduct,
  mockProductWithoutImages,
  mockProductOnSale,
  mockProductContactForPrice
]

export const mockApiResponse = {
  products: mockProducts,
  pagination: {
    total: 4,
    limit: 20,
    offset: 0,
    hasMore: false
  },
  stats: {
    totalProducts: 4,
    totalTypes: 2,
    totalTags: 5,
    averagePrice: 412.49
  }
}

export const mockSingleProductApiResponse = {
  product: mockProduct
}