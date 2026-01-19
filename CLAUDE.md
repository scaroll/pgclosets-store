# PG Closets Website Rebuild

## Project Overview
Apple-inspired luxury closet door e-commerce site for pgclosets.com
Ottawa-based custom closet door manufacturer, 15+ years in business

## Tech Stack
- Next.js 16.1 (App Router, Cache Components, View Transitions)
- React 19.2
- Tailwind CSS 4.1 (CSS-first config, no tailwind.config.js)
- Motion 12.27+ (formerly Framer Motion)
- Vercel deployment (existing)

## Bash Commands
- `npm run dev`: Start dev server (Turbopack)
- `npm run build`: Production build
- `npm run lint`: Run linter
- `npx @next/codemod@canary upgrade latest`: Upgrade Next.js

## Code Style
- Use TypeScript for all components
- Use CSS-first Tailwind via @theme directive in globals.css
- Use `"use cache"` directive for cacheable pages
- Use View Transitions for page navigation
- Motion imports: `import { motion } from "motion/react"`
- Prefer Server Components; mark client components explicitly
- Use semantic HTML5 elements
- Maximum 80 chars line length for readability

## Design Principles (IMPORTANT)
- Apple-level minimalism: less is more
- Typography as hero: SF Pro Display or Inter
- Massive whitespace: 120px+ section padding
- No carousels, no pop-ups, no chat widgets
- Single accent color only
- No exclamation points in copy
- Confidence is quiet: avoid superlatives (best, premier, finest)

## File Structure
```
app/
├── layout.tsx          # Root with ViewTransition
├── page.tsx            # Homepage scroll experience
├── globals.css         # Tailwind v4 @theme config
├── collection/page.tsx # Product grid
├── product/[slug]/page.tsx # Detail (use cache)
├── atelier/page.tsx    # About
├── contact/page.tsx    # Minimal form
└── not-found.tsx       # 404
components/
├── ui/                 # Primitives
├── sections/           # Page sections
└── layout/             # Header, Footer
lib/
├── products.ts         # Product data/fetching
└── animations.ts       # Motion variants
public/
└── images/             # Product photography
```

## Testing
- Run `npm run build` to verify no build errors
- Check Lighthouse score targets: 95+ overall
- Verify View Transitions work on navigation
- Test mobile responsive at 375px, 768px, 1024px

## Git Workflow
- Branch naming: feature/[name], fix/[name]
- Commit messages: imperative mood, max 50 chars subject
- Squash commits before merge

## Current Products
- Continental ($459) - Entry-level elegance
- Provincial ($549) - Classic craftsmanship
- Gatsby ($799) - Art deco inspired
- Euro ($899) - Contemporary minimalism

## Design Tokens
- Primary: #1D1D1F (near-black text)
- Secondary: #86868B (medium gray)
- Accent: #B4946C (warm gold)
- Surface: #FAFAFA (soft white)
- Pure White: #FFFFFF

## Animation Philosophy
- Subtle, purposeful motion only
- Scroll-triggered reveals (fade + translate)
- View Transitions for navigation
- No particle effects or excessive animation
- Magnetic cursor on CTAs (optional)
