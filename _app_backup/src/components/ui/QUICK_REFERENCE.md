# UI Components Quick Reference

## Installation

All dependencies already installed. Just import and use.

## Import Pattern

```tsx
import { Badge, Modal, Dropdown, Tabs, Tooltip } from '@/components/ui';
```

## Badge

```tsx
// Basic
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>

// With dot
<Badge variant="success" showDot>Online</Badge>

// With icon
<Badge icon={<Star />}>Premium</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>

// Presets
<Badge.Success>Success</Badge.Success>
<Badge.Error>Error</Badge.Error>
```

**Variants:** default | success | warning | error | info | premium
**Sizes:** sm | md | lg

---

## Modal

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
    <button>Open</button>
  </ModalTrigger>
  <ModalContent size="md">
    <ModalHeader>
      <ModalTitle>Title</ModalTitle>
      <ModalDescription>Description</ModalDescription>
    </ModalHeader>
    <ModalBody>
      <p>Content</p>
    </ModalBody>
    <ModalFooter>
      <button>Cancel</button>
      <button>Confirm</button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

**Sizes:** sm | md | lg | xl | full
**Keyboard:** Esc to close

---

## Dropdown

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
  <DropdownTrigger>Menu</DropdownTrigger>
  <DropdownContent>
    <DropdownLabel>Section</DropdownLabel>
    <DropdownItem icon={<User />}>Profile</DropdownItem>
    <DropdownItem icon={<Settings />} shortcut="⌘S">
      Settings
    </DropdownItem>
    <DropdownSeparator />
    <DropdownCheckboxItem checked={value}>
      Option
    </DropdownCheckboxItem>
    <DropdownSeparator />
    <DropdownItem destructive>Delete</DropdownItem>
  </DropdownContent>
</Dropdown>
```

**Features:** icons, shortcuts, checkbox/radio, nested menus
**Keyboard:** Arrow keys, Enter, Space

---

## Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

// Line tabs (default)
<Tabs defaultValue="tab1">
  <TabsList variant="line">
    <TabsTrigger value="tab1" variant="line">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2" variant="line" badge="3">
      Tab 2
    </TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>

// Pills tabs
<TabsList variant="pills">
  <TabsTrigger variant="pills">...</TabsTrigger>
</TabsList>

// Enclosed tabs
<TabsList variant="enclosed">
  <TabsTrigger variant="enclosed">...</TabsTrigger>
</TabsList>
```

**Variants:** line | pills | enclosed
**Features:** badges, icons, animations
**Keyboard:** Arrow keys, Home, End

---

## Tooltip

```tsx
import {
  SimpleTooltip,
  KeyboardTooltip,
  RichTooltip,
  TooltipProvider,
} from '@/components/ui';

// Wrap app with provider
<TooltipProvider>
  <App />
</TooltipProvider>

// Simple tooltip
<SimpleTooltip content="Help text">
  <button>Hover me</button>
</SimpleTooltip>

// Keyboard shortcut
<KeyboardTooltip keys={['⌘', 'K']} description="Search">
  <button>Search</button>
</KeyboardTooltip>

// Rich tooltip
<RichTooltip
  title="Premium Feature"
  description="Upgrade to access this"
  icon={<Star />}
>
  <button>Premium</button>
</RichTooltip>
```

**Variants:** default | dark | light | premium
**Sizes:** sm | md | lg
**Sides:** top | right | bottom | left

---

## Dark Mode

All components automatically support dark mode. No configuration needed.

```tsx
// Components automatically detect and adapt to theme
<Badge variant="success">Always looks great</Badge>
```

---

## Accessibility

All components are:
- ✅ Keyboard accessible
- ✅ Screen reader friendly
- ✅ WCAG 2.1 Level AA compliant
- ✅ Focus managed
- ✅ ARIA labeled

---

## Design Tokens

Components use these Tailwind classes from config:

### Colors
```
apple-gray-{50-950}
apple-blue-{400-600}
apple-dark-{bg|text|border}
success-{50-900}
warning-{50-900}
error-{50-900}
info-{50-900}
```

### Typography
```
text-apple-{11|13|15|17|21|28|34|48|64|80}
font-sf-display
font-sf-text
```

### Spacing
```
apple-{xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl}
```

### Shadows
```
shadow-apple-{sm|md|lg|xl}
shadow-floating
shadow-elevated
shadow-modal
```

### Radius
```
rounded-apple
rounded-apple-sm
rounded-apple-lg
```

---

## Common Patterns

### Confirmation Modal
```tsx
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Delete</ModalTitle>
      <ModalDescription>This cannot be undone</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <button onClick={() => setIsOpen(false)}>Cancel</button>
      <button onClick={handleDelete} className="bg-error-600">
        Delete
      </button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### User Menu Dropdown
```tsx
<Dropdown>
  <DropdownTrigger>
    <Avatar />
  </DropdownTrigger>
  <DropdownContent>
    <DropdownLabel>{user.name}</DropdownLabel>
    <DropdownSeparator />
    <DropdownItem icon={<User />}>Profile</DropdownItem>
    <DropdownItem icon={<Settings />}>Settings</DropdownItem>
    <DropdownSeparator />
    <DropdownItem destructive icon={<LogOut />}>
      Logout
    </DropdownItem>
  </DropdownContent>
</Dropdown>
```

### Status Badge
```tsx
<Badge
  variant={status === 'active' ? 'success' : 'error'}
  showDot
>
  {status}
</Badge>
```

---

## Performance Tips

1. **Tree-shaking:** Import only what you need
2. **Lazy load:** Use dynamic imports for modals
3. **Memoize:** Use React.memo for frequently re-rendered components
4. **Animations:** Disable with `prefers-reduced-motion`

---

## Troubleshooting

### Tooltip not showing?
Make sure you wrapped your app with `<TooltipProvider>`

### Modal backdrop not blurring?
Check that `backdrop-blur-apple` class is in Tailwind config

### Dark mode not working?
Ensure `next-themes` ThemeProvider is set up with `attribute="class"`

### Type errors?
Run `npm run type-check` to see all TypeScript errors

---

## Support

- **Documentation:** `/src/components/ui/README.md`
- **Examples:** `/src/components/ui/ui-showcase.tsx`
- **Source:** `/src/components/ui/*.tsx`

---

**Pro Tip:** Use the `ui-showcase.tsx` component as a visual reference and testing ground for all components.
