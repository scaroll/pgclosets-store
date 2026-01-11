export interface Service {
  id: string // slug
  title: string
  description: string
  features: string[]
  image: string
}

export const SAMPLE_SERVICES: Service[] = [
  {
    id: 'custom-closets',
    title: 'Custom Walk-In Closets',
    description:
      'Transform your daily routine with a masterfully designed walk-in closet. Our custom solutions maximize space while adding value and style to your home.',
    features: [
      'Custom islands with storage',
      'Integrated lighting systems',
      'Adjustable shelving',
      'Valet rods and tie racks',
    ],
    image: '/services/walk-in.jpg',
  },
  {
    id: 'reach-in-closets',
    title: 'Reach-In Closets',
    description:
      'Maximize every inch of your reach-in closet with our smart efficient designs. Perfect for bedrooms, hallways, and guest rooms.',
    features: [
      'Double hanging rods',
      'Shoe storage solutions',
      'Soft-close drawers',
      'Corner shelves',
    ],
    image: '/services/reach-in.jpg',
  },
  {
    id: 'pantries',
    title: 'Kitchen Pantries',
    description:
      'Keep your kitchen organized and efficient with a custom pantry system. Everything visible and within reach.',
    features: ['Pull-out baskets', 'Wine racks', 'Spice organizers', 'Heavy-duty shelving'],
    image: '/services/pantry.jpg',
  },
  {
    id: 'home-office',
    title: 'Home Office Units',
    description:
      'Create a productive workspace tailored to your needs. Custom desks, cabinets, and shelving for the ultimate home office.',
    features: ['Integrated cable management', 'Filing drawers', 'Bookshelves', 'Custom lighting'],
    image: '/services/office.jpg',
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return SAMPLE_SERVICES.find(s => s.id === slug)
}
