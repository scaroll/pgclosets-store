# UI Component Library

Complete UI component system following Apple's design language with TypeScript, dark mode, and full accessibility support.

## Components

### 1. Badge Component

Status indicators and labels with multiple variants.

**Features:**
- 6 semantic variants (default, success, warning, error, info, premium)
- 3 size options (sm, md, lg)
- Optional status dot
- Icon support
- Dark mode optimized
- Accessible labels

**Usage:**
```tsx
import { Badge } from '@/components/ui';

// Basic badge
<Badge variant="success">Active</Badge>

// With status dot
<Badge variant="success" showDot>Online</Badge>

// With icon
<Badge variant="premium" icon={<Star className="h-3 w-3" />}>
  Premium
</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Preset components
<Badge.Success>Success</Badge.Success>
<Badge.Warning>Warning</Badge.Warning>
<Badge.Error>Error</Badge.Error>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium'
- `size`: 'sm' | 'md' | 'lg'
- `showDot`: boolean
- `icon`: React.ReactNode
- `aria-label`: string

---

### 2. Modal/Dialog Component

Glass morphism modal with Radix UI and Framer Motion animations.

**Features:**
- Radix UI Dialog primitives
- Glass morphism backdrop with blur
- Smooth animations (fade + scale)
- 5 size options
- Keyboard support (Esc to close)
- Focus trap
- Dark mode optimized

**Usage:**
```tsx
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from '@/components/ui';

<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalTrigger asChild>
    <button>Open Modal</button>
  </ModalTrigger>
  <ModalContent size="md">
    <ModalHeader>
      <ModalTitle>Confirm Action</ModalTitle>
      <ModalDescription>
        Are you sure you want to proceed?
      </ModalDescription>
    </ModalHeader>
    <ModalBody>
      <p>Additional content here</p>
    </ModalBody>
    <ModalFooter>
      <button onClick={() => setIsOpen(false)}>Cancel</button>
      <button onClick={handleConfirm}>Confirm</button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `hideCloseButton`: boolean

---

### 3. Dropdown Component

Animated dropdown menu with Radix UI.

**Features:**
- Radix UI DropdownMenu primitives
- Smooth animations
- Keyboard navigation (arrows, enter, space)
- Nested submenus
- Checkbox and radio items
- Icons and shortcuts
- Destructive actions styling
- Dark mode support

**Usage:**
```tsx
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  DropdownCheckboxItem,
} from '@/components/ui';

<Dropdown>
  <DropdownTrigger>Open Menu</DropdownTrigger>
  <DropdownContent>
    <DropdownLabel>My Account</DropdownLabel>
    <DropdownSeparator />

    <DropdownItem icon={<User />}>Profile</DropdownItem>
    <DropdownItem icon={<Settings />} shortcut="⌘S">
      Settings
    </DropdownItem>

    <DropdownSeparator />

    <DropdownCheckboxItem
      checked={notifications}
      onCheckedChange={setNotifications}
    >
      Notifications
    </DropdownCheckboxItem>

    <DropdownSeparator />

    <DropdownItem destructive icon={<LogOut />}>
      Logout
    </DropdownItem>
  </DropdownContent>
</Dropdown>
```

**Item Props:**
- `icon`: React.ReactNode
- `shortcut`: string
- `destructive`: boolean (red styling for dangerous actions)

---

### 4. Tabs Component

Apple-style tab navigation with animations.

**Features:**
- Radix UI Tabs primitives
- 3 visual variants (line, pills, enclosed)
- Animated active indicator
- Keyboard navigation (arrow keys, home, end)
- Badge support
- Icon support
- Dark mode optimized
- Accessible (ARIA)

**Usage:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

// Line tabs (default Apple style)
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview" variant="line">
      Overview
    </TabsTrigger>
    <TabsTrigger value="analytics" variant="line" badge="3">
      Analytics
    </TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
</Tabs>

// Pills tabs (iOS style)
<Tabs defaultValue="day">
  <TabsList variant="pills">
    <TabsTrigger value="day" variant="pills">Day</TabsTrigger>
    <TabsTrigger value="week" variant="pills">Week</TabsTrigger>
    <TabsTrigger value="month" variant="pills">Month</TabsTrigger>
  </TabsList>
  <TabsContent value="day">Daily stats</TabsContent>
</Tabs>

// Enclosed tabs (macOS style)
<Tabs defaultValue="all">
  <TabsList variant="enclosed">
    <TabsTrigger value="all" variant="enclosed">All</TabsTrigger>
    <TabsTrigger value="active" variant="enclosed">Active</TabsTrigger>
  </TabsList>
  <TabsContent value="all">All items</TabsContent>
</Tabs>
```

**Props:**
- `variant`: 'line' | 'pills' | 'enclosed'
- `icon`: React.ReactNode
- `badge`: number | string
- `animated`: boolean (enable fade animations)

---

### 5. Tooltip Component

Subtle tooltips with dark mode support.

**Features:**
- Radix UI Tooltip primitives
- 4 visual variants
- 3 size options
- Smooth animations
- Configurable delay
- Multiple placement options
- Arrow indicator
- Dark mode optimized
- Accessible (ARIA)

**Usage:**
```tsx
import {
  SimpleTooltip,
  KeyboardTooltip,
  RichTooltip,
  TooltipProvider,
} from '@/components/ui';

// Wrap your app with TooltipProvider
<TooltipProvider>
  {/* Simple tooltip */}
  <SimpleTooltip content="Click to edit">
    <button>Edit</button>
  </SimpleTooltip>

  {/* Keyboard shortcut tooltip */}
  <KeyboardTooltip keys={['⌘', 'K']} description="Quick search">
    <button>Search</button>
  </KeyboardTooltip>

  {/* Rich tooltip with title and description */}
  <RichTooltip
    title="Premium Feature"
    description="Upgrade to access advanced analytics"
    icon={<Sparkles />}
  >
    <button>Analytics</button>
  </RichTooltip>
</TooltipProvider>
```

**Props:**
- `variant`: 'default' | 'dark' | 'light' | 'premium'
- `size`: 'sm' | 'md' | 'lg'
- `showArrow`: boolean
- `side`: 'top' | 'right' | 'bottom' | 'left'
- `align`: 'start' | 'center' | 'end'
- `delayDuration`: number (milliseconds)

---

## Design Tokens

All components use Apple's design tokens from `tailwind.config.ts`:

### Colors
- **Apple Gray Scale**: `apple-gray-{50-950}` - Professional foundation
- **Apple Blue**: `apple-blue-{400-600}` - Primary actions
- **Apple Dark Mode**: `apple-dark-{bg|text|border}` - OLED optimized
- **Semantic Colors**: `success`, `warning`, `error`, `info`
- **Brand Colors**: `woodgrain`, `metal`, `storage`, `door`, `premium`

### Typography
- **Font Families**: `sf-display`, `sf-text`, `display`, `body`, `mono`
- **Apple Type Scale**: `apple-{11|13|15|17|21|28|34|48|64|80}`

### Spacing
- **Apple 4px Scale**: `apple-{xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl}`

### Shadows
- **Apple Shadows**: `apple-{sm|md|lg|xl}`, `floating`, `elevated`, `modal`

### Borders
- **Apple Radius**: `apple`, `apple-sm`, `apple-lg`

### Z-Index
- `dropdown`: 1000
- `modal-backdrop`: 1040
- `modal`: 1050
- `tooltip`: 1070

---

## Accessibility

All components follow WCAG 2.1 Level AA standards:

✅ **Keyboard Navigation**
- All interactive elements are keyboard accessible
- Logical tab order
- Escape key to close modals/dropdowns

✅ **Screen Reader Support**
- Proper ARIA labels and roles
- Semantic HTML elements
- Live region announcements

✅ **Focus Management**
- Visible focus indicators
- Focus trap in modals
- Focus restoration

✅ **Color Contrast**
- AAA contrast ratios for text
- AA contrast for interactive elements
- Dark mode optimized

✅ **Motion Preferences**
- Respects `prefers-reduced-motion`
- Disable animations via props

---

## Dark Mode

All components automatically support dark mode via `next-themes`:

```tsx
// In your app layout
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system">
  <YourApp />
</ThemeProvider>
```

Components use Tailwind's `dark:` variant for dark mode styles.

---

## Performance

### Optimization Features
- **Tree-shaking**: Import only what you need
- **Code splitting**: Lazy load components
- **Framer Motion**: Optimized animations
- **Radix UI**: Lightweight primitives

### Bundle Size (gzipped)
- Badge: ~2 KB
- Modal: ~8 KB (includes Radix Dialog + Framer Motion)
- Dropdown: ~9 KB (includes Radix DropdownMenu)
- Tabs: ~7 KB (includes Radix Tabs)
- Tooltip: ~6 KB (includes Radix Tooltip)

---

## Testing

### Unit Tests (Vitest)
```bash
npm run test
```

### Accessibility Tests
```bash
npm run test:a11y
```

### Visual Tests (Storybook)
```bash
npm run storybook
```

---

## Migration Guide

### From shadcn/ui
Components are compatible with shadcn/ui. Simply replace imports:

```tsx
// Before
import { Badge } from '@/components/ui/badge';

// After
import { Badge } from '@/components/ui';
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Contributing

When adding new components:

1. Follow Apple design language
2. Include TypeScript types
3. Support dark mode
4. Add accessibility features
5. Write comprehensive JSDoc comments
6. Include usage examples
7. Test on all screen sizes

---

## License

MIT License - Use freely in your projects

---

## Credits

Built with:
- [Radix UI](https://radix-ui.com) - Accessible primitives
- [Framer Motion](https://framer.com/motion) - Animations
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide React](https://lucide.dev) - Icons
- [class-variance-authority](https://cva.style) - Component variants
