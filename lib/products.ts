export interface Product {
  id: string
  name: string
  category: string
  price: number
  style: string
  color: string
  features: string[]
  description: string
  images?: string[]
}

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'barn-1',
    name: 'Modern Farmhouse Barn Door',
    category: 'barn-doors',
    price: 899,
    style: 'modern',
    color: 'rustic wood',
    features: ['solid wood core', 'pre-drilled', 'reversible', 'lifetime warranty'],
    description: 'Beautiful modern farmhouse style barn door with rustic wood finish',
    images: ['/products/barn-1.jpg'],
  },
  {
    id: 'barn-2',
    name: 'Glass Panel Contemporary Barn Door',
    category: 'barn-doors',
    price: 1299,
    style: 'contemporary',
    color: 'frosted glass',
    features: ['tempered glass', 'aluminum frame', 'soft-close', 'modern design'],
    description: 'Sleek contemporary barn door with frosted glass panels',
    images: ['/products/barn-2.jpg'],
  },
  {
    id: 'bifold-1',
    name: 'Classic White Bifold Closet Door',
    category: 'bifold-doors',
    price: 349,
    style: 'traditional',
    color: 'white',
    features: ['pre-finished', 'easy installation', 'smooth operation', 'space-saving'],
    description: 'Traditional white bifold door perfect for closets',
    images: ['/products/bifold-1.jpg'],
  },
  {
    id: 'bifold-2',
    name: 'Louvered Pine Bifold Door',
    category: 'bifold-doors',
    price: 449,
    style: 'traditional',
    color: 'natural pine',
    features: ['natural wood', 'louvered design', 'unfinished', 'ventilation'],
    description: 'Louvered pine bifold door for ventilation and classic style',
    images: ['/products/bifold-2.jpg'],
  },
  {
    id: 'bypass-1',
    name: 'Mirror Bypass Closet Doors',
    category: 'bypass-doors',
    price: 799,
    style: 'modern',
    color: 'mirror',
    features: ['full-length mirrors', 'smooth gliding', 'space enhancement', 'easy maintenance'],
    description: 'Full-length mirror bypass doors that make your space feel larger',
    images: ['/products/bypass-1.jpg'],
  },
  {
    id: 'bypass-2',
    name: 'Frosted Glass Bypass Doors',
    category: 'bypass-doors',
    price: 949,
    style: 'contemporary',
    color: 'frosted glass',
    features: ['frosted glass', 'aluminum frame', 'quiet operation', 'modern aesthetic'],
    description: 'Elegant frosted glass bypass doors for privacy with light transmission',
    images: ['/products/bypass-2.jpg'],
  },
  {
    id: 'hardware-1',
    name: 'Black Barn Door Hardware Kit',
    category: 'hardware',
    price: 199,
    style: 'industrial',
    color: 'black',
    features: ['heavy-duty steel', 'quiet operation', 'complete kit', 'easy installation'],
    description: 'Complete barn door hardware kit in matte black finish',
    images: ['/products/hardware-1.jpg'],
  },
  {
    id: 'mirror-1',
    name: 'Full Length Wall Mirror',
    category: 'mirrors',
    price: 299,
    style: 'classic',
    color: 'clear',
    features: ['beveled edges', 'shatter-resistant', 'wall-mounted', 'distortion-free'],
    description: 'Elegant full-length wall mirror with beveled edges',
    images: ['/products/mirror-1.jpg'],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return SAMPLE_PRODUCTS.find(p => p.id === slug)
}

export function getAllProducts(): Product[] {
  return SAMPLE_PRODUCTS
}
