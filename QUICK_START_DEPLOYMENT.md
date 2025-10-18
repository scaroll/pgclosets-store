# PG Closets Upgrade - Quick Start Guide

## 🚀 Get Started in 30 Minutes

This guide gets you from zero to running the upgraded PG Closets site in 30 minutes.

---

## Prerequisites

- Node.js 18+ installed
- Git configured
- Code editor (VS Code recommended)
- Terminal access

---

## Step 1: Environment Setup (5 minutes)

### Install Dependencies
```bash
cd /Users/spencercarroll/pgclosets-store-main
npm install
```

### Create Environment File
Create `.env.local`:

```bash
# Required - Core
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Required - Database (get from Vercel dashboard)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# Optional - Can add later
RESEND_API_KEY=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_GTM_ID=
```

---

## Step 2: Design System Integration (10 minutes)

### Update Layout

Edit `/app/layout.tsx`:

```tsx
import '@/styles/luxury-typography.css'
import '@/styles/colors.css'
import '@/styles/interactions.css'
import { Cormorant_Garamond, Inter } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-inter">{children}</body>
    </html>
  )
}
```

### Update Tailwind Config

Edit `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        copper: {
          DEFAULT: '#B87333',
          light: '#D4A574',
          dark: '#8B5A2B',
        },
        charcoal: {
          DEFAULT: '#2C2C2C',
          light: '#4A4A4A',
          dark: '#1A1A1A',
        },
        cream: {
          DEFAULT: '#F5F3F0',
          light: '#FAF9F7',
          dark: '#E8E5E0',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
```

---

## Step 3: Test Your Setup (5 minutes)

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` - you should see:
- New typography (Cormorant headings, Inter body)
- New color scheme
- Smooth animations

### Verify TypeScript
```bash
npm run type-check
```

Should complete without critical errors.

---

## Step 4: Quick Wins (10 minutes)

### Add Premium Button Example

Edit your homepage (`/app/page.tsx` or `/app/HomePage.tsx`):

```tsx
import { PremiumButton } from '@/components/ui/PremiumButton'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-cormorant text-6xl font-bold text-charcoal mb-6">
        Transform Your Space with Premium Closet Doors
      </h1>

      <p className="text-xl text-charcoal-light mb-8 max-w-2xl">
        Ottawa's exclusive Renin dealer. Lifetime warranty. 2-week delivery.
      </p>

      <div className="flex gap-4">
        <PremiumButton
          variant="copper"
          size="lg"
          shimmer
          glow
          href="/quote/premium"
        >
          Request Free Consultation
        </PremiumButton>

        <PremiumButton
          variant="outline"
          size="lg"
          href="/collections/renin-barn-doors"
        >
          View Collection
        </PremiumButton>
      </div>
    </div>
  )
}
```

### Test It
Refresh browser - you should see:
- Premium copper button with shimmer effect
- Outlined secondary button
- Smooth hover animations
- Professional typography

---

## ✅ Success Checklist

At this point you should have:

- [x] Dev server running at localhost:3000
- [x] New fonts loading (Cormorant + Inter)
- [x] New color palette working
- [x] Premium button rendering with animations
- [x] TypeScript compiling without errors
- [x] Site looking noticeably more premium

---

## 🎯 Next Steps (Choose Your Priority)

### Option A: Immediate Visual Impact
**Time**: 2-3 hours
**Impact**: High

1. Integrate `PremiumHero` on homepage
2. Add premium navigation
3. Enhance product pages
4. Deploy to Vercel

**Follow**: `DEPLOYMENT_MASTER_PLAN.md` → Week 3

### Option B: Conversion Focus
**Time**: 3-4 hours
**Impact**: Very High

1. Deploy premium quote wizard
2. Set up email automation (welcome series)
3. Add loading states
4. Enable analytics tracking

**Follow**: `DEPLOYMENT_MASTER_PLAN.md` → Week 4

### Option C: Content & SEO
**Time**: 4-5 hours
**Impact**: Long-term High

1. Set up blog system
2. Publish first 3 blog posts
3. Implement schema markup
4. Create location pages

**Follow**: `DEPLOYMENT_MASTER_PLAN.md` → Week 5-6

### Option D: Systematic Full Integration
**Time**: 12 weeks
**Impact**: Maximum

Follow the complete `DEPLOYMENT_MASTER_PLAN.md` week by week for the full $1.5M+ Year 1 revenue impact.

---

## 📚 Key Documentation

**Start Here**:
- `DEPLOYMENT_MASTER_PLAN.md` - Complete 12-week plan
- `README.md` - Project overview

**By Topic**:
- `/docs/blog/` - Content strategy
- `/docs/email/` - Email marketing
- `/docs/social/` - Social media
- `/docs/forms/` - Form components
- `/docs/accessibility/` - WCAG AAA compliance
- `/docs/analytics/` - Tracking setup

**Quick References**:
- Look for `*_QUICK_START.md` files in `/docs/`
- Look for `*_SUMMARY.md` files for overviews

---

## 🆘 Troubleshooting

### Fonts Not Loading
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npm list typescript
```

### Styles Not Applying
```bash
# Rebuild Tailwind
npx tailwindcss -i ./app/globals.css -o ./app/output.css

# Check browser console for errors
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## 💡 Pro Tips

1. **Use Feature Flags**: Enable new features gradually via environment variables
   ```bash
   NEXT_PUBLIC_ENABLE_PREMIUM_HERO=true
   NEXT_PUBLIC_ENABLE_LIVE_CHAT=false
   ```

2. **Test in Production Mode**: Before deploying
   ```bash
   npm run build
   npm start
   ```

3. **Use Git Branches**: Create feature branches
   ```bash
   git checkout -b feature/premium-hero
   # Make changes
   git commit -m "feat: add premium hero section"
   ```

4. **Deploy to Preview**: Test on Vercel preview deployment
   ```bash
   vercel
   # Creates preview URL for testing
   ```

5. **Monitor Performance**: Check Lighthouse scores
   ```bash
   npm run lighthouse
   ```

---

## 🎉 You're Ready!

You now have:
- ✅ Development environment running
- ✅ Premium design system integrated
- ✅ First premium component working
- ✅ Clear path forward

**Choose your next priority above and start building!**

**Questions?** Check `DEPLOYMENT_MASTER_PLAN.md` or the `/docs/` folder.

**Need help?** All 50 agents' deliverables include comprehensive documentation.

---

**Good luck! You're about to launch something special.** 🚀
