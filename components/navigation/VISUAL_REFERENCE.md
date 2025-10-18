# Apple Navigation - Visual Reference

Visual guide to the AppleNavigation component design and interactions.

## Component Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ Utility Bar (Collapses on scroll)                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📞 (613) 555-1234  |  ✉️ info@pgclosets.com                 │ │
│ │                      Free Consultation • Ottawa & Area   →  │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ Main Navigation (Glass morphism when scrolled)                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [LOGO] PG CLOSETS   Home Products▼ Services▼ About Contact │ │
│ │         OTTAWA                               🔍 [Free Quote]│ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ (Progress indicator) ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬│
└─────────────────────────────────────────────────────────────────┘
```

## State Variations

### 1. Initial State (Top of Page)
```
┌─────────────────────────────────────────────────────┐
│ Dark Bar: Phone | Email | Free Consultation         │
├─────────────────────────────────────────────────────┤
│ White Background (Solid)                            │
│ LOGO | Navigation Items | Search | CTA              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 2. Scrolled State
```
┌─────────────────────────────────────────────────────┐
│ Glass Background (Blurred, Translucent)             │
│ LOGO | Navigation Items | Search | CTA              │
│ ▬▬▬▬▬▬▬▬▬ Progress Bar ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬         │
└─────────────────────────────────────────────────────┘
```

### 3. Scrolling Down (Header Hidden)
```
┌─────────────────────────────────────────────────────┐
│ (Header slides up, -100px transform)                │
│                                                      │
│ Content visible immediately below viewport          │
└─────────────────────────────────────────────────────┘
```

### 4. Scrolling Up (Header Shows)
```
┌─────────────────────────────────────────────────────┐
│ Glass Background (Slides down smoothly)             │
│ LOGO | Navigation Items | Search | CTA              │
│ ▬▬▬▬▬▬▬▬▬ Progress Bar ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬         │
└─────────────────────────────────────────────────────┘
```

## Mega Menu Layout

```
Desktop Mega Menu (Hover or Click)
┌─────────────────────────────────────────────────────────────┐
│ Products ▼                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ CLOSET       │  │ STORAGE      │  │ FEATURES     │     │
│  │ SYSTEMS      │  │ SOLUTIONS    │  │              │     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │ • Walk-In    │  │ • Pantry     │  │ • Accessories│     │
│  │ • Reach-In   │  │ • Garage     │  │ • Finishes   │     │
│  │ • Wardrobes  │  │ • Office     │  │ • Doors      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  Glass card with blur, shadow, and rounded corners          │
└─────────────────────────────────────────────────────────────┘
```

## Mobile Drawer Layout

```
Mobile Menu (Right Side Slide)
┌─────────────────────────────┐
│ LOGO    PG CLOSETS       ✕  │
├─────────────────────────────┤
│                              │
│ Home                         │
│                              │
│ Products                   ▼ │
│   └─ CLOSET SYSTEMS         │
│      • Walk-In              │
│      • Reach-In             │
│   └─ STORAGE SOLUTIONS      │
│      • Pantry               │
│                              │
│ Services                   ▼ │
│                              │
│ About                        │
│                              │
│ Contact                      │
│                              │
│ ┌─────────────────────────┐ │
│ │  Free Consultation      │ │
│ └─────────────────────────┘ │
│                              │
│ ─────────────────────────── │
│ 📞 (613) 555-1234           │
│ ✉️ info@pgclosets.com       │
│                              │
└─────────────────────────────┘
```

## Search Overlay Layout

```
Full-Screen Search (⌘K)
┌─────────────────────────────────────────────────────┐
│                                                  ✕   │
│                                                      │
│  🔍  Search for products, services...               │
│  _______________________________________________     │
│                                                      │
│  POPULAR SEARCHES                                   │
│  ┌──────────────┐ ┌──────────────┐                 │
│  │ Walk-in      │ │ Pantry       │                 │
│  │ closets      │ │ organization │                 │
│  └──────────────┘ └──────────────┘                 │
│  ┌──────────────┐ ┌──────────────┐                 │
│  │ Garage       │ │ Custom       │                 │
│  │ storage      │ │ wardrobes    │                 │
│  └──────────────┘ └──────────────┘                 │
│                                                      │
│                                                      │
│  Blurred white background (95% opacity)             │
└─────────────────────────────────────────────────────┘
```

## Color Palette

### Light Theme
```
Background Colors:
├─ Utility Bar:   #1D1D1F (Gray-900) → #2D2D31 (Gray-800)
├─ Header Solid:  #FFFFFF (White)
├─ Header Glass:  rgba(255, 255, 255, 0.92) + blur(40px)
├─ Backdrop:      rgba(0, 0, 0, 0.5) + blur(8px)
└─ Cards:         #FFFFFF with borders

Text Colors:
├─ Primary:       #000000 (Black)
├─ Secondary:     #6B7280 (Gray-500)
├─ Links:         #374151 (Gray-700) → #000000 (Black) hover
└─ Accent:        #F59E0B (Amber-400)

Interactive:
├─ CTA Button:    #000000 → #1F2937 hover
├─ Hover BG:      #F3F4F6 (Gray-50)
└─ Focus Ring:    2px solid #000000
```

## Typography

```
Font Families:
├─ Logo:          Inter, sans-serif (Bold, 0.2em tracking)
├─ Navigation:    Inter, sans-serif (Medium, 0.05em tracking)
├─ Headings:      Cormorant Garamond, serif
└─ Body:          Inter, sans-serif

Font Sizes:
├─ Logo:          16-18px (responsive)
├─ Nav Items:     14px
├─ Mega Menu:     12px (categories) / 14px (items)
├─ Mobile:        16-18px
└─ Search Input:  24px
```

## Spacing System

```
Vertical Rhythm:
├─ Utility Bar:   40px (h-10)
├─ Main Header:   64px (h-16) → 80px (h-20) on sm+
├─ Padding:       16px (p-4) → 24px (p-6) on sm+
└─ Gap:           8px (gap-2) → 12px (gap-3)

Horizontal Grid:
├─ Max Width:     1280px (max-w-7xl)
├─ Padding:       16px (px-4) mobile
│                 24px (px-6) tablet
│                 32px (px-8) desktop
└─ Gaps:          4px → 8px → 12px → 16px (responsive)
```

## Animation Timings

```
Transitions:
├─ Header Transform:    300ms cubic-bezier(0.4, 0, 0.2, 1)
├─ Mega Menu:           200ms ease-out
├─ Mobile Drawer:       Spring (damping: 25, stiffness: 200)
├─ Search Overlay:      200ms fade
├─ Progress Bar:        150ms linear
└─ Hover Effects:       200ms ease

Delays:
├─ Mega Menu Close:     200ms timeout
├─ Scroll Throttle:     16ms (60fps)
└─ Utility Bar:         0ms (instant on theme change)
```

## Breakpoints

```
Mobile First Approach:
├─ xs:  < 640px   (Mobile portrait)
├─ sm:  ≥ 640px   (Mobile landscape, small tablet)
├─ md:  ≥ 768px   (Tablet)
├─ lg:  ≥ 1024px  (Desktop, shows full navigation)
└─ xl:  ≥ 1280px  (Large desktop)

Navigation Changes:
├─ < lg:  Hamburger menu + mobile drawer
└─ ≥ lg:  Full navigation + mega menu
```

## Touch Targets

```
Minimum Touch Targets (44x44px):
├─ Mobile Menu Toggle:  44x44px
├─ Navigation Links:    44x44px (mobile)
├─ Search Button:       44x44px
├─ Close Buttons:       44x44px
└─ CTA Buttons:         48x44px minimum
```

## Z-Index Layers

```
Stacking Context:
├─ Base Content:        z-0
├─ Header:              z-50
├─ Mobile Drawer:       z-50 (same level as header)
├─ Search Overlay:      z-50 (same level as header)
├─ Backdrop:            z-40 (below overlays)
└─ Mega Menu:           Natural stacking (within header)
```

## Glass Morphism Effect

```
CSS Properties:
backdrop-filter: blur(40px) saturate(180%);
-webkit-backdrop-filter: blur(40px) saturate(180%);
background: rgba(255, 255, 255, 0.92);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);

Visual Effect:
┌─────────────────────────────────┐
│ ░░░░░░ Blurred ░░░░░░           │  ← Content behind
│ ░░ Background ░░░░              │     (blurred)
│ ░░░░░░░░░░░░░░░░░               │
├─────────────────────────────────┤
│ Clear Text and Elements         │  ← Navigation
│ [LOGO] Home Products...         │     (sharp)
└─────────────────────────────────┘
```

## Accessibility Features

```
Visual Indicators:
├─ Focus Ring:      2px solid outline, 4px offset
├─ Skip Link:       Hidden until focused
├─ Active State:    Underline animation
└─ Hover State:     Background color change

Screen Reader:
├─ ARIA Labels:     All interactive elements
├─ Role Attributes: navigation, menu, button
├─ Live Regions:    Search results
└─ Skip to Content: First focusable element

Keyboard:
├─ Tab Order:       Logical flow through navigation
├─ Escape:          Close overlays
├─ Enter/Space:     Activate buttons
└─ ⌘K / Ctrl+K:     Open search
```

## Performance Optimizations

```
Rendering:
├─ GPU Acceleration:     transform: translateZ(0)
├─ Will Change:          transform, opacity
├─ Passive Listeners:    scroll event
└─ RAF Throttling:       requestAnimationFrame

Loading:
├─ Code Splitting:       Lazy load search overlay
├─ Image Optimization:   Next.js Image component
├─ Font Loading:         Preload critical fonts
└─ CSS Extraction:       Critical CSS inline
```

---

## Quick Reference

### Component Props
```tsx
// AppleNavigation has no required props
<AppleNavigation />

// All configuration via NAVIGATION_ITEMS constant
```

### CSS Classes
```css
.glass-nav              /* Glass morphism header */
.glass-card             /* Glass morphism card */
.glass-backdrop         /* Blurred overlay */
.elevation-3            /* Shadow depth */
```

### State Management
```tsx
const [isScrolled, setIsScrolled]           // Header scrolled state
const [isScrollingUp, setIsScrollingUp]     // Scroll direction
const [isMobileOpen, setIsMobileOpen]       // Mobile drawer
const [isSearchOpen, setIsSearchOpen]       // Search overlay
const [activeMegaMenu, setActiveMegaMenu]   // Mega menu state
```

---

**For more details, see:**
- `APPLE_NAVIGATION.md` - Technical documentation
- `USAGE_GUIDE.md` - Implementation guide
- `/navigation-apple-demo` - Live demo
