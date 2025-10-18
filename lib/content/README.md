# PG Closets Content Library

Complete content library for PG Closets website featuring elegant, professional copy throughout all sections.

## Overview

This content library provides structured, reusable content for the entire PG Closets website. All copy maintains an **elegant, sophisticated tone without pretense**—professional but approachable, confident without arrogance.

## Content Files

### 📄 `homepage-content.ts`
Complete homepage copy including:
- Hero section messaging
- Value proposition
- Featured product collections
- Process overview (5 steps)
- Social proof and statistics
- Multiple call-to-action sections

**Key Sections:**
- `hero` - Headline, subheadline, CTAs
- `introduction` - Brand positioning
- `valueProposition` - Why choose PG Closets (4 pillars)
- `featuredProducts` - Collection highlights
- `processOverview` - Customer journey (5 phases)
- `socialProof` - Stats and testimonials
- `callToAction` - Primary and secondary CTAs

### 📄 `product-descriptions.ts`
Comprehensive product category descriptions:

**Categories:**
- **Barn Doors** - Modern, rustic, transitional styles
- **Closet Systems** - Shelving, hanging, drawers, accessories
- **Bifold Doors** - Wood, composite, glass options
- **Hardware & Accessories** - Track systems, handles, finishes

**Features:**
- Detailed benefits and ideal applications
- Style variations with characteristics
- Material options with advantages
- SEO-optimized descriptions
- Template functions for dynamic content

### 📄 `about-content.ts`
Company story and values:
- Brand narrative and journey
- Historical milestones (2010-2025)
- Core values (Quality, Service, Local Focus, Improvement)
- Team structure and expertise
- Competitive differentiators
- Customer commitments

### 📄 `installation-guide.ts`
Complete installation process documentation:

**5 Installation Phases:**
1. **Initial Consultation** (45-60 min)
2. **Proposal & Planning** (1-2 days)
3. **Pre-Installation** (1-2 weeks)
4. **Installation Day** (4-8 hours)
5. **Post-Installation** (Ongoing)

Each phase includes:
- Duration estimates
- Detailed steps
- Preparation requirements
- What to expect

Plus:
- Installation FAQ (8 questions)
- Preparation checklists
- Warranty information
- Support resources

### 📄 `faq-content.ts`
Comprehensive FAQ organized into 7 categories:

1. **Quote Process** (5 questions)
2. **Consultation** (5 questions)
3. **Timeline & Installation** (5 questions)
4. **Payment & Pricing** (5 questions)
5. **Warranty & Service** (5 questions)
6. **Service Areas** (4 questions)
7. **Products & Materials** (5 questions)
8. **Why Choose PG Closets** (5 questions)

**Total: 40+ detailed Q&A pairs**

### 📄 `index.ts`
Central export file with:
- All content exports
- Type exports
- Common reusable content
- Usage documentation
- Implementation examples
- SEO guidelines

## Usage Examples

### Basic Import

```typescript
import { homepageContent } from '@/lib/content'

// Use in component
<h1>{homepageContent.hero.headline}</h1>
<p>{homepageContent.hero.subheadline}</p>
```

### Product Category

```typescript
import { productCategories } from '@/lib/content'

const { barnDoors } = productCategories

<section>
  <h2>{barnDoors.categoryName}</h2>
  <p className="tagline">{barnDoors.tagline}</p>
  <p>{barnDoors.overview}</p>

  <h3>Benefits</h3>
  <ul>
    {barnDoors.benefits.map(benefit => (
      <li key={benefit}>{benefit}</li>
    ))}
  </ul>
</section>
```

### About Page Values

```typescript
import { aboutContent } from '@/lib/content'

{aboutContent.values.core.map(value => (
  <div key={value.title} className="value-card">
    <span className="icon">{value.icon}</span>
    <h3>{value.title}</h3>
    <p>{value.description}</p>
    <ul>
      {value.principles.map(principle => (
        <li key={principle}>{principle}</li>
      ))}
    </ul>
  </div>
))}
```

### Installation Process

```typescript
import { installationGuide } from '@/lib/content'

{installationGuide.process.phases.map(phase => (
  <section key={phase.phase}>
    <div className="phase-number">{phase.phase}</div>
    <h2>{phase.title}</h2>
    <p className="duration">{phase.duration}</p>
    <p>{phase.description}</p>

    {phase.steps.map(step => (
      <div key={step.name}>
        <h4>{step.name}</h4>
        <p>{step.details}</p>
      </div>
    ))}
  </section>
))}
```

### FAQ Component

```typescript
import { faqContent } from '@/lib/content'

{faqContent.categories.map(category => (
  <section key={category.id}>
    <h2>{category.name}</h2>
    <p className="description">{category.description}</p>

    {category.questions.map(q => (
      <details key={q.id}>
        <summary>{q.question}</summary>
        <p>{q.answer}</p>
      </details>
    ))}
  </section>
))}
```

### Common Content

```typescript
import { commonContent } from '@/lib/content'

// Business information
<a href={`tel:${commonContent.business.phoneRaw}`}>
  {commonContent.business.phone}
</a>

// Service areas
<ul>
  {commonContent.serviceAreas.map(area => (
    <li key={area}>{area}</li>
  ))}
</ul>

// Key features
{commonContent.features.map(feature => (
  <li key={feature}>{feature}</li>
))}
```

## Tone & Style Guidelines

### ✅ Do

- **Be clear and direct** - "Transform your space with premium closet solutions"
- **Show expertise confidently** - "Our certified installers ensure precision"
- **Focus on customer benefits** - "Maximize space while maintaining clean aesthetics"
- **Use refined language** - "Thoughtfully designed" vs "Really nice"
- **Be transparent** - "We require 50% deposit" not "Some payment upfront"

### ❌ Don't

- **Use excessive adjectives** - Avoid "absolutely stunning amazing incredible"
- **Sound exclusive or elitist** - No "For discerning clients only"
- **Be overly casual** - Avoid "Hey there!" or "Awesome!"
- **Use pressure tactics** - No "Limited time only!" or "Act now!"
- **Include clichés** - Skip "best in class" and "cutting-edge"

## Content Principles

### 1. Elegant Without Pretense
- Sophisticated vocabulary, accessible tone
- Quality emphasized, not price or exclusivity
- Professional without being stuffy

### 2. Customer-Centric
- Benefits before features
- Address concerns proactively
- Focus on outcomes and value

### 3. Transparent & Honest
- Clear processes and timelines
- Upfront pricing information
- No hidden agendas

### 4. Locally Rooted
- Ottawa-specific references
- Community commitment
- Family business authenticity

### 5. Quality-Focused
- Craftsmanship emphasized
- Materials and durability highlighted
- Long-term value communicated

## SEO Optimization

All content includes:

- **Primary Keywords:** closet doors Ottawa, barn doors, closet systems
- **Location Keywords:** Ottawa, Kanata, Nepean, Orleans, Barrhaven
- **Brand Keywords:** PG Closets, Renin dealer
- **Service Keywords:** installation, consultation, custom closets
- **Long-tail Keywords:** premium closet solutions Ottawa, professional closet installation

### Keyword Integration
- Natural placement in headings and body text
- Location mentions in relevant contexts
- Service descriptions with keyword variations
- FAQ questions target search queries

## Accessibility Features

- **Clear Headings:** Logical hierarchy for screen readers
- **Concise Paragraphs:** Easy scanning and comprehension
- **Bulleted Lists:** Improved readability
- **Plain Language:** No unnecessary jargon
- **Descriptive Links:** "Schedule consultation" vs "Click here"

## Content Maintenance

### Update Schedule

| Content Type | Update Frequency | Responsibility |
|--------------|------------------|----------------|
| Statistics (installations, satisfaction) | Quarterly | Marketing Team |
| Pricing references | As needed | Sales Team |
| Service areas | When expanded | Operations |
| Product offerings | When updated | Product Team |
| Contact information | Immediately | All Teams |

### Version Control

- **Major updates:** Increment version number
- **Minor edits:** Document in commit message
- **A/B tests:** Create separate content variations
- **Translations:** Maintain parallel structure

## File Structure

```
lib/content/
├── README.md (this file)
├── index.ts (central exports)
├── homepage-content.ts
├── product-descriptions.ts
├── about-content.ts
├── installation-guide.ts
└── faq-content.ts
```

## TypeScript Support

All content is fully typed for IDE autocomplete and type safety:

```typescript
import type {
  HomepageContent,
  ProductCategories,
  AboutContent,
  InstallationGuide,
  FAQContent
} from '@/lib/content'
```

## Best Practices

1. **Import what you need** - Don't import entire objects when you only need one section
2. **Use types** - Leverage TypeScript types for autocomplete and validation
3. **Map over arrays** - Utilize the structured data with `.map()` for dynamic rendering
4. **Stay consistent** - Use content library across all pages for brand voice consistency
5. **Don't edit inline** - Update content files, not component strings

## Common Patterns

### Hero Section
```typescript
const { hero } = homepageContent
return (
  <section>
    <h1>{hero.headline}</h1>
    <p>{hero.subheadline}</p>
    <Button>{hero.ctaPrimary}</Button>
  </section>
)
```

### Feature Grid
```typescript
{valueProposition.sections.map(section => (
  <div key={section.title}>
    <span>{section.icon}</span>
    <h3>{section.title}</h3>
    <p>{section.description}</p>
  </div>
))}
```

### Process Steps
```typescript
{processOverview.steps.map(step => (
  <div key={step.number}>
    <span>{step.number}</span>
    <h3>{step.title}</h3>
    <p>{step.description}</p>
  </div>
))}
```

## Support

For questions or content updates:
- **Email:** info@pgclosets.com
- **Phone:** (613) 422-5800

---

**Version:** 1.0.0
**Last Updated:** October 4, 2025
**Maintained by:** PG Closets Marketing Team
