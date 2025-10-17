# Quick Guide: Adding a New Location

This guide shows you how to add a new location page in under 10 minutes.

## Step 1: Add Location Data

Edit `/lib/locations.ts` and add your new location to the `locations` object:

```typescript
export const locations: Record<string, LocationData> = {
  // ... existing locations ...

  'your-location': {
    slug: 'your-location',                    // URL slug (lowercase, hyphenated)
    name: 'Your Location',                    // Display name
    region: 'Region Name',                    // Geographic region
    population: '50,000+',                    // Population count
    description: 'Brief description of the area and its characteristics...',
    heroImage: '/images/locations/your-location-hero.jpg',
    coordinates: {
      lat: 45.0000,                          // GPS latitude
      lng: -75.0000                          // GPS longitude
    },
    serviceAreas: [
      'Neighborhood 1',
      'Neighborhood 2',
      'Neighborhood 3',
      // Add 8-12 neighborhoods
    ],
    stats: {
      homesServed: 100,                      // Total homes served
      yearsServing: 5,                       // Years in business here
      rating: 4.9,                           // Average rating (0-5)
      responseTime: '24 hours'               // Typical response time
    },
    testimonials: [
      {
        name: 'Customer Name',
        location: 'Neighborhood Name',
        rating: 5,
        text: 'The testimonial text goes here...',
        date: '2024-09-15'
      },
      // Add 2-3 testimonials
    ],
    projects: [
      {
        id: 'yourlocation-1',
        title: 'Project Title',
        description: 'Brief project description',
        beforeImage: '/images/projects/yourlocation-1-before.jpg',
        afterImage: '/images/projects/yourlocation-1-after.jpg',
        doorType: 'barn',                    // barn | bypass | bifold | pivot | room-divider
        neighborhood: 'Neighborhood Name'
      },
      // Add 2-3 projects
    ],
    nearby: ['ottawa', 'kanata'],           // Nearby location slugs
    seo: {
      title: 'Closet Doors Your Location | Premium Service | PG Closets',
      description: 'Premium closet door installation in Your Location. Serving [neighborhoods]. Free quote and professional installation.',
      keywords: [
        'closet doors Your Location',
        'barn doors Your Location',
        'bypass doors Your Location',
        'bifold doors Your Location',
        'professional installation Your Location',
        // Add 5-10 local keywords
      ]
    }
  }
};
```

## Step 2: Add Images

Add images to `/public/images/`:

```bash
# Hero image (16:9 ratio, 1920x1080px recommended)
/public/images/locations/your-location-hero.jpg

# Project images (4:3 ratio, 1200x900px recommended)
/public/images/projects/yourlocation-1-before.jpg
/public/images/projects/yourlocation-1-after.jpg
/public/images/projects/yourlocation-2-before.jpg
/public/images/projects/yourlocation-2-after.jpg
```

## Step 3: Build and Test

```bash
# Build the site
npm run build

# Start the production server
npm start

# Visit your new page
http://localhost:3000/your-location
```

## Step 4: Verify SEO

1. **View source** and check:
   - [ ] Unique title tag
   - [ ] Unique meta description
   - [ ] Local Business schema in <script> tag
   - [ ] Breadcrumb schema in <script> tag

2. **Test schema markup:**
   - Visit: https://validator.schema.org/
   - Enter URL: `https://yourdomain.com/your-location`
   - Fix any validation errors

3. **Test rich results:**
   - Visit: https://search.google.com/test/rich-results
   - Enter URL and test
   - Verify Local Business markup appears

## Step 5: Deploy

```bash
# Commit changes
git add .
git commit -m "Add [Your Location] location page"
git push

# Deploy (Vercel auto-deploys on push to main)
```

## Content Guidelines

### Location Description
- 1-2 sentences
- Mention key characteristics
- Include demographics if relevant
- Highlight what makes it unique

### Service Areas
- List 8-12 major neighborhoods
- Use official neighborhood names
- Order by popularity or alphabetically
- Include both old and new areas

### Testimonials
- Use real customer feedback
- Keep to 2-3 sentences
- Include specific details
- Vary the types of projects mentioned
- Ensure location matches neighborhood list

### Projects
- Show variety of door types
- Include before AND after photos
- Write descriptive titles
- Mention specific neighborhoods
- Keep descriptions brief (1 sentence)

### SEO Keywords
- Include location name in each keyword
- Add neighborhood-specific keywords
- Include service types (barn doors, bypass, etc.)
- Add surrounding area keywords
- Include common search terms

## Quick Stats Reference

### Population
Find at: [Statistics Canada](https://www12.statcan.gc.ca/)
Format: "50,000+" (rounded up, always positive)

### Coordinates
Find at: [Google Maps](https://maps.google.com)
- Right-click location → "What's here?"
- Use 4 decimal places: `45.4215, -75.6972`

### Homes Served
Based on:
- Years in business x average jobs per year
- Should feel realistic for the area size
- Larger cities = more homes served

### Years Serving
- When you first served a customer in this area
- Round to whole numbers
- Be honest and verifiable

### Response Time
Options:
- "Same day" - for priority areas
- "24 hours" - for standard areas
- "48 hours" - for distant/new areas

## Common Mistakes to Avoid

❌ **Don't:**
- Copy-paste descriptions from other locations
- Use generic stock photos
- Make up testimonials
- Exaggerate statistics
- Forget to add to `nearby` array
- Use relative image paths
- Skip schema markup testing

✅ **Do:**
- Write unique content for each location
- Use real local photos
- Get permission for testimonials
- Be honest with stats
- Cross-link nearby locations
- Use absolute image paths
- Test everything before deploying

## Template Checklist

Before deploying a new location:

- [ ] Location data added to `/lib/locations.ts`
- [ ] Slug is lowercase and hyphenated
- [ ] All required fields filled
- [ ] 8-12 service areas listed
- [ ] 2-3 testimonials added
- [ ] 2-3 projects with images
- [ ] Nearby locations linked
- [ ] SEO title unique
- [ ] SEO description unique
- [ ] 5-10 keywords added
- [ ] Hero image uploaded (1920x1080)
- [ ] Project images uploaded (1200x900)
- [ ] Images optimized (< 500KB each)
- [ ] GPS coordinates verified
- [ ] Population accurate
- [ ] Stats realistic
- [ ] Build completes successfully
- [ ] Page loads without errors
- [ ] Stats animation works
- [ ] Gallery opens correctly
- [ ] Nearby links work
- [ ] Schema markup validates
- [ ] Mobile responsive
- [ ] CTAs work
- [ ] Ready to deploy!

## Need Help?

**Documentation:**
- `/components/locations/README.md` - Full component docs
- `/LOCATION_PAGES_DELIVERY.md` - Complete delivery summary

**Example:**
Look at `/lib/locations.ts` → `ottawa` for a complete example

**Testing:**
```bash
# Type check
npx tsc --noEmit app/[location]/page.tsx

# Lint
npm run lint

# Build
npm run build
```

---

**Last Updated:** October 2024
**Time to Add New Location:** ~10 minutes
**Difficulty:** Easy
