/**
 * AGENT 9-10: Local SEO Agent - Ottawa Neighborhood Data
 * Ottawa neighborhood data for local SEO optimization
 */

export interface Neighborhood {
  slug: string
  name: string
  displayName: string
  description: string
  serviceHighlights: string[]
  population?: string
  demographics?: string
  popularAreas?: string[]
  keyFeatures: string[]
  testimonial?: {
    author: string
    text: string
    project: string
  }
  coordinates: {
    lat: number
    lng: number
  }
}

export const OTTAWA_NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: 'ottawa',
    name: 'Ottawa',
    displayName: 'Ottawa Downtown & Central',
    description: 'Premium custom closet doors and storage solutions for downtown Ottawa residents. Serving ByWard Market, Centretown, Glebe, and surrounding areas with professional installation.',
    serviceHighlights: [
      'Same-day consultations available',
      'Expert Renin product knowledge',
      'Professional installation team',
      'Lifetime warranty on all products'
    ],
    population: '1M+',
    demographics: 'Urban professionals, young families',
    popularAreas: ['ByWard Market', 'Centretown', 'The Glebe', 'Old Ottawa South', 'Sandy Hill'],
    keyFeatures: [
      'Historic home renovations',
      'Condo closet optimization',
      'Heritage property expertise',
      'Urban storage solutions'
    ],
    testimonial: {
      author: 'Sarah M., Centretown',
      text: 'Transformed our small condo closet into an organized masterpiece. The Renin bypass doors are stunning!',
      project: 'Custom Bypass Doors'
    },
    coordinates: { lat: 45.4215, lng: -75.6972 }
  },
  {
    slug: 'kanata',
    name: 'Kanata',
    displayName: 'Kanata & Stittsville',
    description: 'Custom closet solutions for Kanata and Stittsville families. Specializing in modern homes with walk-in closets, pantries, and garage organization.',
    serviceHighlights: [
      'New home builder partnerships',
      'Large walk-in closet specialists',
      'Modern design focus',
      '2-week installation guarantee'
    ],
    population: '100K+',
    demographics: 'Young families, tech professionals',
    popularAreas: ['Kanata Lakes', 'Beaverbrook', 'Morgan\'s Grant', 'Bridlewood', 'Stittsville'],
    keyFeatures: [
      'New construction expertise',
      'Smart home integration',
      'Family-friendly designs',
      'Garage organization systems'
    ],
    testimonial: {
      author: 'Mike T., Kanata Lakes',
      text: 'Perfect installation in our new build. The team worked seamlessly with our builder\'s schedule.',
      project: 'Master Bedroom Walk-in Closet'
    },
    coordinates: { lat: 45.3000, lng: -75.9000 }
  },
  // {
  //   slug: 'barrhaven',
  //   name: 'Barrhaven',
  //   displayName: 'Barrhaven & Riverside South',
  //   description: 'Family-focused closet and storage solutions for Barrhaven and Riverside South. Expert in maximizing space in modern suburban homes.',
  //   serviceHighlights: [
  //     'Family storage specialists',
  //     'Kids closet organization',
  //     'Mudroom solutions',
  //     'Flexible payment options'
  //   ],
  //   population: '90K+',
  //   demographics: 'Growing families, suburban lifestyle',
  //   popularAreas: ['Chapman Mills', 'Longfields', 'Half Moon Bay', 'Riverside South', 'Greenboro'],
  //   keyFeatures: [
  //     'Child-safe installations',
  //     'Mudroom organization',
  //     'Sports equipment storage',
  //     'Growing family solutions'
  //   ],
  //   testimonial: {
  //     author: 'Jennifer L., Chapman Mills',
  //     text: 'Our family of five finally has an organized home. The pantry makeover changed our mornings!',
  //     project: 'Pantry & Mudroom Organization'
  //   },
  //   coordinates: { lat: 45.2733, lng: -75.7344 }
  // },
  {
    slug: 'orleans',
    name: 'Orleans',
    displayName: 'Orleans & East Ottawa',
    description: 'Professional closet design and installation for Orleans, Blackburn Hamlet, and east Ottawa communities. Bilingual service available.',
    serviceHighlights: [
      'Bilingual consultation (EN/FR)',
      'East Ottawa specialists',
      'Quick response times',
      'Community-focused service'
    ],
    population: '110K+',
    demographics: 'Bilingual families, diverse communities',
    popularAreas: ['Avalon', 'Fallingbrook', 'Chapel Hill', 'Blackburn Hamlet', 'Cyrville'],
    keyFeatures: [
      'Bilingual team available',
      'Townhouse optimization',
      'Multi-generational homes',
      'Cultural design sensitivity'
    ],
    testimonial: {
      author: 'Marc D., Avalon',
      text: 'Service bilingue exceptionnel. Installation professionnelle de nos portes de placard Renin.',
      project: 'Bedroom Closet Doors'
    },
    coordinates: { lat: 45.4547, lng: -75.5012 }
  },
  {
    slug: 'nepean',
    name: 'Nepean',
    displayName: 'Nepean & Bells Corners',
    description: 'Custom storage solutions for Nepean, Bells Corners, and surrounding west Ottawa areas. Specializing in basement renovations and whole-home organization.',
    serviceHighlights: [
      'Basement renovation experts',
      'Whole-home consultations',
      'Mature neighborhood specialists',
      'Renovation coordination'
    ],
    population: '180K+',
    demographics: 'Established families, retirees',
    popularAreas: ['Bells Corners', 'Westboro', 'Crystal Beach', 'Merivale', 'Craig Henry'],
    keyFeatures: [
      'Renovation specialists',
      'Aging-in-place solutions',
      'Basement finishing',
      'Heritage home experience'
    ],
    testimonial: {
      author: 'Robert & Nancy K., Bells Corners',
      text: 'Renovated our 40-year-old home with beautiful modern closet systems. Excellent craftsmanship.',
      project: 'Whole Home Closet Renovation'
    },
    coordinates: { lat: 45.3500, lng: -75.7275 }
  },
  {
    slug: 'gloucester',
    name: 'Gloucester',
    displayName: 'Gloucester & South Keys',
    description: 'Affordable custom closet solutions for Gloucester, South Keys, and Hunt Club areas. Quality Renin products with professional installation.',
    serviceHighlights: [
      'Budget-friendly options',
      'Flexible scheduling',
      'Apartment & condo experts',
      'Value-focused service'
    ],
    population: '125K+',
    demographics: 'Diverse, value-conscious homeowners',
    popularAreas: ['South Keys', 'Hunt Club', 'Hawthorne Meadows', 'Gloucester Glen', 'Leitrim'],
    keyFeatures: [
      'Condo specialization',
      'Rental property solutions',
      'Cost-effective options',
      'Quick turnaround'
    ],
    testimonial: {
      author: 'Priya S., South Keys',
      text: 'Great value for professional service. My condo closet looks like it belongs in a luxury home!',
      project: 'Condo Closet Upgrade'
    },
    coordinates: { lat: 45.3800, lng: -75.6400 }
  },
  {
    slug: 'stittsville',
    name: 'Stittsville',
    displayName: 'Stittsville & Rural West',
    description: 'Custom closet and storage solutions for Stittsville, Munster, and rural west Ottawa properties. Acreage and estate home specialists.',
    serviceHighlights: [
      'Large home specialists',
      'Rural property experience',
      'Custom estate solutions',
      'Premium installations'
    ],
    population: '30K+',
    demographics: 'Rural lifestyle, acreage owners',
    popularAreas: ['Stittsville Main', 'Hazeldean', 'Glenn Cairn', 'Village Green', 'Rural West'],
    keyFeatures: [
      'Estate home experience',
      'Multiple closet projects',
      'Luxury finishes',
      'Acreage property access'
    ],
    testimonial: {
      author: 'David W., Rural Stittsville',
      text: 'Completed 8 closets in our country home. Professional team handled our large project perfectly.',
      project: 'Estate Home Organization'
    },
    coordinates: { lat: 45.2600, lng: -75.9200 }
  }
]

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return OTTAWA_NEIGHBORHOODS.find(n => n.slug === slug)
}

export function getNeighborhoodNames(): string[] {
  return OTTAWA_NEIGHBORHOODS.map(n => n.name)
}

export function getNeighborhoodSlugs(): string[] {
  return OTTAWA_NEIGHBORHOODS.map(n => n.slug)
}

/**
 * Get nearby neighborhoods for internal linking
 */
export function getNearbyNeighborhoods(slug: string, limit = 3): Neighborhood[] {
  const current = getNeighborhood(slug)
  if (!current) return []

  // Simple distance calculation (could be enhanced with actual geolocation)
  const others = OTTAWA_NEIGHBORHOODS.filter(n => n.slug !== slug)

  return others
    .map(n => ({
      neighborhood: n,
      distance: Math.sqrt(
        Math.pow(n.coordinates.lat - current.coordinates.lat, 2) +
        Math.pow(n.coordinates.lng - current.coordinates.lng, 2)
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(item => item.neighborhood)
}
