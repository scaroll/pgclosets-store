/**
 * Location Data Structure for PG Closets
 * Dynamic location pages with local SEO optimization
 */

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  date?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  doorType: 'barn' | 'bypass' | 'bifold' | 'pivot' | 'room-divider';
  neighborhood: string;
}

export interface LocationData {
  slug: string;
  name: string;
  region: string;
  population: string;
  description: string;
  heroImage: string;
  coordinates: { lat: number; lng: number };
  serviceAreas: string[];
  stats: {
    homesServed: number;
    yearsServing: number;
    rating: number;
    responseTime: string;
  };
  testimonials: Testimonial[];
  projects: Project[];
  nearby: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const locations: Record<string, LocationData> = {
  ottawa: {
    slug: 'ottawa',
    name: 'Ottawa',
    region: 'National Capital Region',
    population: '1,000,000+',
    description: 'Canada\'s capital city, known for its vibrant cultural scene, historic architecture, and diverse neighborhoods ranging from heritage homes to modern condos.',
    heroImage: '/images/locations/ottawa-hero.jpg',
    coordinates: { lat: 45.4215, lng: -75.6972 },
    serviceAreas: [
      'Downtown Ottawa',
      'Centretown',
      'Byward Market',
      'The Glebe',
      'Westboro',
      'Old Ottawa South',
      'New Edinburgh',
      'Sandy Hill',
      'Hintonburg',
      'Little Italy',
      'Rockcliffe Park',
      'Alta Vista'
    ],
    stats: {
      homesServed: 450,
      yearsServing: 8,
      rating: 4.9,
      responseTime: 'Same day'
    },
    testimonials: [
      {
        name: 'Sarah M.',
        location: 'Centretown',
        rating: 5,
        text: 'Exceptional service from start to finish. The team was professional, punctual, and the installation in our Centretown home looks absolutely stunning. Highly recommend!',
        date: '2024-09-15'
      },
      {
        name: 'Michael K.',
        location: 'The Glebe',
        rating: 5,
        text: 'We needed custom barn doors for our Glebe heritage home. PG Closets delivered exactly what we wanted while respecting our home\'s character. Perfect fit!',
        date: '2024-08-22'
      },
      {
        name: 'Jennifer L.',
        location: 'Downtown Ottawa',
        rating: 5,
        text: 'Great experience with PG Closets. They helped us maximize storage in our downtown condo with space-saving bypass doors. Quality workmanship and fair pricing.',
        date: '2024-09-01'
      }
    ],
    projects: [
      {
        id: 'ottawa-1',
        title: 'Heritage Home Barn Door',
        description: 'Custom barn door installation in Centretown heritage home',
        beforeImage: '/images/projects/ottawa-1-before.jpg',
        afterImage: '/images/projects/ottawa-1-after.jpg',
        doorType: 'barn',
        neighborhood: 'Centretown'
      },
      {
        id: 'ottawa-2',
        title: 'Modern Condo Bypass',
        description: 'Space-saving bypass doors for downtown condo',
        beforeImage: '/images/projects/ottawa-2-before.jpg',
        afterImage: '/images/projects/ottawa-2-after.jpg',
        doorType: 'bypass',
        neighborhood: 'Downtown'
      },
      {
        id: 'ottawa-3',
        title: 'Glebe Room Divider',
        description: 'Elegant room divider installation in The Glebe',
        beforeImage: '/images/projects/ottawa-3-before.jpg',
        afterImage: '/images/projects/ottawa-3-after.jpg',
        doorType: 'room-divider',
        neighborhood: 'The Glebe'
      }
    ],
    nearby: ['kanata', 'barrhaven', 'nepean', 'orleans'],
    seo: {
      title: 'Closet Doors Ottawa | Premium Installation | PG Closets',
      description: 'Premium closet door installation in Ottawa. Official Renin dealer serving downtown Ottawa, Centretown, Byward Market, and surrounding areas. Free online quote and transparent pricing.',
      keywords: [
        'closet doors Ottawa',
        'barn doors Ottawa',
        'bypass doors Ottawa',
        'bifold doors Ottawa',
        'professional installation Ottawa',
        'Renin dealer Ottawa',
        'custom closet Ottawa',
        'closet renovation Ottawa',
        'heritage home closets Ottawa',
        'downtown Ottawa closet doors'
      ]
    }
  },

  kanata: {
    slug: 'kanata',
    name: 'Kanata',
    region: 'West Ottawa',
    population: '90,000+',
    description: 'Ottawa\'s tech hub with modern homes and established neighborhoods. Known for family-friendly communities, excellent schools, and contemporary architecture.',
    heroImage: '/images/locations/kanata-hero.jpg',
    coordinates: { lat: 45.3000, lng: -75.9000 },
    serviceAreas: [
      'Kanata North',
      'Kanata South',
      'Beaverbrook',
      'Bridlewood',
      'Katimavik-Hazeldean',
      'Morgan\'s Grant',
      'Glen Cairn',
      'Marchwood-Lakeside',
      'Kanata Lakes',
      'Signature',
      'Arcadia'
    ],
    stats: {
      homesServed: 320,
      yearsServing: 7,
      rating: 4.9,
      responseTime: '24 hours'
    },
    testimonials: [
      {
        name: 'David P.',
        location: 'Kanata North',
        rating: 5,
        text: 'Perfect installation in our new build. The team understood exactly what we needed for our modern home. The bypass doors are sleek and functional.',
        date: '2024-09-10'
      },
      {
        name: 'Amanda S.',
        location: 'Bridlewood',
        rating: 5,
        text: 'We wanted to update our master bedroom closet with barn doors. PG Closets made the process seamless. Love the result!',
        date: '2024-08-28'
      },
      {
        name: 'Robert C.',
        location: 'Kanata Lakes',
        rating: 5,
        text: 'Outstanding service. They arrived on time, worked efficiently, and left our home spotless. The doors look amazing!',
        date: '2024-09-05'
      }
    ],
    projects: [
      {
        id: 'kanata-1',
        title: 'Modern Home Bypass System',
        description: 'Contemporary bypass doors in Kanata Lakes new build',
        beforeImage: '/images/projects/kanata-1-before.jpg',
        afterImage: '/images/projects/kanata-1-after.jpg',
        doorType: 'bypass',
        neighborhood: 'Kanata Lakes'
      },
      {
        id: 'kanata-2',
        title: 'Master Bedroom Barn Door',
        description: 'Elegant barn door for Bridlewood master suite',
        beforeImage: '/images/projects/kanata-2-before.jpg',
        afterImage: '/images/projects/kanata-2-after.jpg',
        doorType: 'barn',
        neighborhood: 'Bridlewood'
      }
    ],
    nearby: ['ottawa', 'nepean'],
    seo: {
      title: 'Closet Doors Kanata | Modern Home Solutions | PG Closets',
      description: 'Premium closet door installation in Kanata. Serving Kanata North, South, Bridlewood, and all Kanata neighborhoods. Official Renin dealer with expert installation.',
      keywords: [
        'closet doors Kanata',
        'barn doors Kanata',
        'bypass doors Kanata',
        'Kanata closet installation',
        'modern home closets Kanata',
        'Kanata North closet doors',
        'Bridlewood closet doors',
        'Kanata Lakes closets'
      ]
    }
  },

  barrhaven: {
    slug: 'barrhaven',
    name: 'Barrhaven',
    region: 'South Ottawa',
    population: '80,000+',
    description: 'Family-oriented suburban community with a mix of established and new developments. Known for excellent schools, parks, and modern family homes.',
    heroImage: '/images/locations/barrhaven-hero.jpg',
    coordinates: { lat: 45.2733, lng: -75.7350 },
    serviceAreas: [
      'Barrhaven Centre',
      'Half Moon Bay',
      'Chapman Mills',
      'Longfields',
      'Stonebridge',
      'Davidson Heights',
      'Strandherd',
      'Jockvale',
      'Fallowfield',
      'Riverside South'
    ],
    stats: {
      homesServed: 290,
      yearsServing: 6,
      rating: 4.9,
      responseTime: '24 hours'
    },
    testimonials: [
      {
        name: 'Lisa T.',
        location: 'Half Moon Bay',
        rating: 5,
        text: 'Transformed our kids\' bedrooms with beautiful bifold doors. The quality is excellent and the installation was quick and professional.',
        date: '2024-09-12'
      },
      {
        name: 'James W.',
        location: 'Chapman Mills',
        rating: 5,
        text: 'We upgraded all our closet doors to the Renin collection. PG Closets handled everything perfectly. Very happy with the results.',
        date: '2024-08-30'
      },
      {
        name: 'Catherine B.',
        location: 'Longfields',
        rating: 5,
        text: 'Professional team that really cares about quality. Our new barn door is the focal point of our master bedroom. Highly recommend!',
        date: '2024-09-08'
      }
    ],
    projects: [
      {
        id: 'barrhaven-1',
        title: 'Family Home Closet Upgrade',
        description: 'Complete closet door refresh in Half Moon Bay',
        beforeImage: '/images/projects/barrhaven-1-before.jpg',
        afterImage: '/images/projects/barrhaven-1-after.jpg',
        doorType: 'bifold',
        neighborhood: 'Half Moon Bay'
      },
      {
        id: 'barrhaven-2',
        title: 'Master Suite Barn Door',
        description: 'Premium barn door installation in Chapman Mills',
        beforeImage: '/images/projects/barrhaven-2-before.jpg',
        afterImage: '/images/projects/barrhaven-2-after.jpg',
        doorType: 'barn',
        neighborhood: 'Chapman Mills'
      }
    ],
    nearby: ['nepean', 'ottawa'],
    seo: {
      title: 'Closet Doors Barrhaven | Family Home Solutions | PG Closets',
      description: 'Premium closet door installation in Barrhaven. Serving Half Moon Bay, Chapman Mills, Longfields, and all Barrhaven communities. Expert family home solutions.',
      keywords: [
        'closet doors Barrhaven',
        'barn doors Barrhaven',
        'family home closets Barrhaven',
        'Half Moon Bay closet doors',
        'Chapman Mills closets',
        'Longfields closet installation',
        'Barrhaven home renovation'
      ]
    }
  },

  nepean: {
    slug: 'nepean',
    name: 'Nepean',
    region: 'West Ottawa',
    population: '180,000+',
    description: 'Diverse and established community with mix of residential, commercial, and green spaces. One of Ottawa\'s largest suburbs with varied housing stock.',
    heroImage: '/images/locations/nepean-hero.jpg',
    coordinates: { lat: 45.3167, lng: -75.7267 },
    serviceAreas: [
      'Bells Corners',
      'Merivale',
      'Centrepointe',
      'Craig Henry',
      'Qualicum',
      'Woodroffe',
      'Crystal Beach',
      'Bayshore',
      'Fisher Glen',
      'Pinecrest'
    ],
    stats: {
      homesServed: 380,
      yearsServing: 8,
      rating: 4.9,
      responseTime: 'Same day'
    },
    testimonials: [
      {
        name: 'Patricia G.',
        location: 'Bells Corners',
        rating: 5,
        text: 'We\'ve lived in our home for 30 years and decided it was time to update. PG Closets gave our bedrooms a fresh, modern look. Couldn\'t be happier!',
        date: '2024-09-14'
      },
      {
        name: 'Andrew M.',
        location: 'Merivale',
        rating: 5,
        text: 'Excellent service and quality products. The team helped us choose the perfect doors for our split-level home. Great attention to detail.',
        date: '2024-08-25'
      },
      {
        name: 'Stephanie R.',
        location: 'Centrepointe',
        rating: 5,
        text: 'From quote to installation, everything was smooth and professional. The bypass doors solved our small space challenge perfectly.',
        date: '2024-09-03'
      }
    ],
    projects: [
      {
        id: 'nepean-1',
        title: 'Established Home Refresh',
        description: 'Complete closet modernization in Bells Corners',
        beforeImage: '/images/projects/nepean-1-before.jpg',
        afterImage: '/images/projects/nepean-1-after.jpg',
        doorType: 'bypass',
        neighborhood: 'Bells Corners'
      },
      {
        id: 'nepean-2',
        title: 'Split-Level Solution',
        description: 'Custom doors for unique Merivale home layout',
        beforeImage: '/images/projects/nepean-2-before.jpg',
        afterImage: '/images/projects/nepean-2-after.jpg',
        doorType: 'barn',
        neighborhood: 'Merivale'
      }
    ],
    nearby: ['kanata', 'ottawa', 'barrhaven'],
    seo: {
      title: 'Closet Doors Nepean | Established Community Expert | PG Closets',
      description: 'Premium closet door installation in Nepean. Serving Bells Corners, Merivale, Centrepointe, and all Nepean neighborhoods. 8 years serving the community.',
      keywords: [
        'closet doors Nepean',
        'barn doors Nepean',
        'Bells Corners closet doors',
        'Merivale closets',
        'Centrepointe closet installation',
        'Nepean home renovation',
        'established home closets Nepean'
      ]
    }
  },

  orleans: {
    slug: 'orleans',
    name: 'Orleans',
    region: 'East Ottawa',
    population: '110,000+',
    description: 'Fast-growing community in east Ottawa with predominantly new construction. Known for young families, excellent amenities, and modern homes.',
    heroImage: '/images/locations/orleans-hero.jpg',
    coordinates: { lat: 45.4833, lng: -75.5000 },
    serviceAreas: [
      'Avalon',
      'Blackburn Hamlet',
      'Chapel Hill',
      'Convent Glen',
      'Fallingbrook',
      'Gardenway',
      'Orleans Wood',
      'Queenswood Heights',
      'Sheppards Bush',
      'Avalon-Notting Gate'
    ],
    stats: {
      homesServed: 260,
      yearsServing: 5,
      rating: 4.9,
      responseTime: '24 hours'
    },
    testimonials: [
      {
        name: 'Michelle D.',
        location: 'Avalon',
        rating: 5,
        text: 'Just moved into our new build and wanted to upgrade from builder-grade doors. PG Closets transformed our master closet with beautiful barn doors.',
        date: '2024-09-11'
      },
      {
        name: 'Kevin L.',
        location: 'Chapel Hill',
        rating: 5,
        text: 'Great experience working with PG Closets. They understood exactly what works for new construction and delivered flawless installation.',
        date: '2024-08-27'
      },
      {
        name: 'Emily P.',
        location: 'Convent Glen',
        rating: 5,
        text: 'We wanted something special for our kids\' rooms. The team helped us pick perfect colors and styles. Kids love their new closet doors!',
        date: '2024-09-06'
      }
    ],
    projects: [
      {
        id: 'orleans-1',
        title: 'New Build Upgrade',
        description: 'Premium door upgrade in Avalon new construction',
        beforeImage: '/images/projects/orleans-1-before.jpg',
        afterImage: '/images/projects/orleans-1-after.jpg',
        doorType: 'barn',
        neighborhood: 'Avalon'
      },
      {
        id: 'orleans-2',
        title: 'Young Family Home',
        description: 'Colorful bifold doors for Chapel Hill family',
        beforeImage: '/images/projects/orleans-2-before.jpg',
        afterImage: '/images/projects/orleans-2-after.jpg',
        doorType: 'bifold',
        neighborhood: 'Chapel Hill'
      }
    ],
    nearby: ['ottawa'],
    seo: {
      title: 'Closet Doors Orleans | New Home Specialist | PG Closets',
      description: 'Premium closet door installation in Orleans. Serving Avalon, Chapel Hill, Convent Glen, and all Orleans communities. Expert new construction upgrades.',
      keywords: [
        'closet doors Orleans',
        'barn doors Orleans',
        'new build closets Orleans',
        'Avalon closet doors',
        'Chapel Hill closets',
        'Convent Glen closet installation',
        'Orleans home upgrades'
      ]
    }
  }
};

export function getLocation(slug: string): LocationData | undefined {
  return locations[slug];
}

export function getAllLocationSlugs(): string[] {
  return Object.keys(locations);
}

export function getNearbyLocations(slug: string): LocationData[] {
  const location = locations[slug];
  if (!location) return [];

  return location.nearby
    .map(nearbySlug => locations[nearbySlug])
    .filter(Boolean);
}
