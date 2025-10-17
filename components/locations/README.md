# Location Pages System

Dynamic location pages with local SEO optimization for PG Closets.

## Overview

The location pages system provides a reusable template for creating location-specific landing pages with:
- Local SEO optimization
- Dynamic content personalization
- Interactive service area maps
- Animated statistics counters
- Local project galleries
- Testimonials from local customers
- Nearby location cross-linking

## Architecture

### Data Structure (`/lib/locations.ts`)

```typescript
interface LocationData {
  slug: string;              // URL slug (e.g., 'ottawa', 'kanata')
  name: string;              // Display name
  region: string;            // Geographic region
  population: string;        // Population count
  description: string;       // Location description
  heroImage: string;         // Hero image path
  coordinates: { lat, lng }; // GPS coordinates
  serviceAreas: string[];    // Neighborhoods served
  stats: {                   // Local statistics
    homesServed: number;
    yearsServing: number;
    rating: number;
    responseTime: string;
  };
  testimonials: Testimonial[]; // Local testimonials
  projects: Project[];         // Local project gallery
  nearby: string[];            // Nearby location slugs
  seo: {                       // SEO metadata
    title: string;
    description: string;
    keywords: string[];
  };
}
```

### Components

#### LocationStats
**File:** `/components/locations/LocationStats.tsx`

Animated statistics counter with scroll-triggered animations.

**Features:**
- Intersection Observer for scroll detection
- Smooth number counting animations
- Trust badges (Official Dealer, Warranty, Licensed & Insured)
- Mobile responsive

**Props:**
```typescript
{
  homesServed: number;
  yearsServing: number;
  rating: number;
  responseTime: string;
}
```

#### ServiceMap
**File:** `/components/locations/ServiceMap.tsx`

Interactive service area visualization.

**Features:**
- Visual map placeholder (ready for Google Maps API integration)
- Clickable neighborhood list with hover effects
- Service radius indicator
- CTA for areas not listed

**Props:**
```typescript
{
  currentLocation: string;
  serviceAreas: string[];
  coordinates: { lat: number; lng: number };
}
```

#### LocalGallery
**File:** `/components/locations/LocalGallery.tsx`

Before/after project gallery with filtering.

**Features:**
- Filter by door type (all, barn, bypass, bifold, pivot, room-divider)
- Lightbox modal for full-size viewing
- Before/after comparison toggle
- Neighborhood tags
- Mobile responsive grid

**Props:**
```typescript
{
  projects: Project[];
  locationName: string;
}
```

### Dynamic Page Template

**File:** `/app/[location]/page.tsx`

Main location page template that:
- Generates static params for all locations
- Creates unique metadata per location
- Includes Local Business and Breadcrumb schema markup
- Renders all location components dynamically

## Current Locations

1. **Ottawa** - Capital city, downtown focus
2. **Kanata** - Tech hub, modern homes
3. **Barrhaven** - Family-friendly suburban
4. **Nepean** - Diverse established community
5. **Orleans** - Growing, new construction

## Adding New Locations

1. **Add location data** to `/lib/locations.ts`:

```typescript
newlocation: {
  slug: 'new-location',
  name: 'New Location',
  region: 'Region Name',
  population: '50,000+',
  description: 'Description of the area...',
  heroImage: '/images/locations/new-location-hero.jpg',
  coordinates: { lat: 45.0000, lng: -75.0000 },
  serviceAreas: [
    'Neighborhood 1',
    'Neighborhood 2',
    // ...
  ],
  stats: {
    homesServed: 100,
    yearsServing: 5,
    rating: 4.9,
    responseTime: '24 hours'
  },
  testimonials: [
    {
      name: 'Customer Name',
      location: 'Neighborhood',
      rating: 5,
      text: 'Testimonial text...',
      date: '2024-09-15'
    }
  ],
  projects: [
    {
      id: 'newlocation-1',
      title: 'Project Title',
      description: 'Project description',
      beforeImage: '/images/projects/newlocation-1-before.jpg',
      afterImage: '/images/projects/newlocation-1-after.jpg',
      doorType: 'barn',
      neighborhood: 'Neighborhood'
    }
  ],
  nearby: ['ottawa', 'kanata'],
  seo: {
    title: 'SEO Title | PG Closets',
    description: 'SEO description...',
    keywords: ['keyword1', 'keyword2']
  }
}
```

2. **Add images** to `/public/images/`:
   - `/public/images/locations/new-location-hero.jpg`
   - `/public/images/projects/newlocation-1-before.jpg`
   - `/public/images/projects/newlocation-1-after.jpg`

3. **Build** - Next.js will automatically generate the static page

## SEO Features

### Schema Markup
- Local Business schema with:
  - Business name and description
  - Address and geo coordinates
  - Service types
  - Price range
  - Aggregate ratings
  - Area served (25km radius)
- Breadcrumb navigation schema

### Metadata
- Unique title and description per location
- Location-specific keywords
- OpenGraph tags for social sharing
- Canonical URLs
- Robot indexing directives

### On-Page Optimization
- H1 with location name
- Location-specific content
- NAP consistency (Name, Address, Phone)
- Internal linking to nearby locations
- Breadcrumb navigation
- Local testimonials and projects

## Performance

### Static Generation
- All location pages pre-rendered at build time
- Fast page loads
- SEO-friendly

### Optimizations
- Intersection Observer for scroll animations
- Lazy loading for images (Next.js Image)
- Efficient re-renders with React hooks
- Mobile-first responsive design

## Mobile Responsiveness

All components are mobile-first:
- Grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Font sizes: `text-xl md:text-2xl lg:text-3xl`
- Spacing: Responsive padding and margins
- Touch-friendly buttons (44px minimum)
- Swipeable galleries

## Future Enhancements

### Planned Features
1. **Google Maps Integration**
   - Replace placeholder with interactive map
   - Show actual service areas
   - Pins for completed projects
   - Directions to business

2. **Real-time Stats**
   - Connect to CRM for actual homes served
   - Pull live reviews/ratings
   - Dynamic response time based on availability

3. **Dynamic Content**
   - Seasonal promotions per location
   - Local events integration
   - Weather-based messaging

4. **A/B Testing**
   - Test different hero images
   - Optimize CTA placement
   - Test testimonial display

5. **Analytics Integration**
   - Track conversions per location
   - Heat maps for user interaction
   - Funnel analysis

## Design Tokens

Uses the PG Closets design system (`/lib/design-tokens.ts`):
- **Colors:** brand.navy, brand.charcoal, gray scale
- **Typography:** Cormorant (display), Inter (body)
- **Spacing:** 8px base grid
- **Shadows:** Subtle, Apple-inspired
- **Animations:** Smooth, 250ms default
- **Radius:** 12px (lg), 16px (xl), 24px (2xl)

## Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML (nav, section, article)
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Alt text for all images
- Sufficient color contrast
- Responsive text sizing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 14+)
- Mobile Chrome (latest)

## Testing Checklist

- [ ] All locations load correctly
- [ ] Dynamic content populates
- [ ] Stats animation triggers on scroll
- [ ] Gallery lightbox works
- [ ] Filters function properly
- [ ] Maps display correctly
- [ ] Links to nearby locations work
- [ ] Schema markup validates
- [ ] Mobile responsive at all breakpoints
- [ ] Accessibility audit passes
- [ ] SEO metadata unique per location
- [ ] Images load and display properly

## Maintenance

### Regular Updates
1. Update testimonials quarterly
2. Add new project photos monthly
3. Refresh stats annually
4. Review and update keywords seasonally
5. Check schema markup for changes

### Monitoring
- Google Search Console for SEO performance
- Google Analytics for traffic patterns
- Core Web Vitals for performance
- User feedback for UX improvements

---

**Last Updated:** October 2024
**Version:** 1.0.0
**Maintainer:** PG Closets Development Team
