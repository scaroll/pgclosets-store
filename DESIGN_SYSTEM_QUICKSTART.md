# Design System Quick Start Guide

**Get started with the PG Closets luxury design system in 5 minutes**

---

## 🚀 Quick Setup

### 1. Import Design System CSS

In your main layout file (`app/layout.tsx` or similar):

```tsx
import '@/styles/design-system.css';
```

### 2. Import Components

```tsx
import {
  Container,
  Section,
  Display,
  H1,
  Body,
  Button,
  Card,
  Grid
} from '@/components/ui/design-system';
```

---

## 💡 Common Patterns

### Hero Section

```tsx
<Section size="lg" className="ds-bg-pearl">
  <Container>
    <Display className="text-center">
      Transform Your Space
    </Display>
    <Body className="text-center max-w-2xl mx-auto mt-6">
      Custom closet systems designed for how you live
    </Body>
    <div className="flex justify-center gap-4 mt-8">
      <Button variant="primary" size="lg">
        Request Quote
      </Button>
      <Button variant="secondary" size="lg">
        View Gallery
      </Button>
    </div>
  </Container>
</Section>
```

### Product Grid

```tsx
<Section>
  <Container>
    <Grid columns={3}>
      {products.map(product => (
        <Card key={product.id}>
          <CardImage>
            <img src={product.image} alt={product.name} />
          </CardImage>
          <CardContent>
            <h3 className="ds-h4">{product.name}</h3>
            <p className="ds-body">{product.description}</p>
          </CardContent>
        </Card>
      ))}
    </Grid>
  </Container>
</Section>
```

### Contact Form

```tsx
<form className="space-y-6">
  <FormField label="Name" htmlFor="name" required>
    <Input id="name" type="text" placeholder="Your name" />
  </FormField>

  <FormField label="Email" htmlFor="email" required>
    <Input id="email" type="email" placeholder="your@email.com" />
  </FormField>

  <FormField label="Message" htmlFor="message">
    <Textarea id="message" rows={6} />
  </FormField>

  <Button variant="primary" size="lg" type="submit" className="w-full">
    Send Message
  </Button>
</form>
```

---

## 🎨 Design Tokens

### Colors

Use these Tailwind classes:

```tsx
<div className="bg-charcoal text-white">Dark background</div>
<div className="bg-pearl text-slate">Light background</div>
<div className="text-gold">Gold accent text</div>
```

Or use CSS classes:

```tsx
<div className="ds-bg-charcoal">Dark</div>
<div className="ds-text-gold">Gold text</div>
```

### Typography

```tsx
<Display>Display Text</Display>
<H1>Main Heading</H1>
<H2>Section Heading</H2>
<Body>Paragraph text</Body>
<Caption>Small label</Caption>
```

### Spacing

```tsx
<Section size="sm">Small spacing</Section>
<Section size="md">Medium spacing (default)</Section>
<Section size="lg">Large spacing</Section>
```

---

## ✨ Animations

Add entrance animations:

```tsx
<div className="ds-animate-fade-in">Fades in</div>
<div className="ds-animate-slide-up">Slides up</div>
<div className="ds-animate-scale-in">Scales in</div>

{/* With stagger delays */}
<div className="ds-animate-fade-in">First</div>
<div className="ds-animate-fade-in ds-delay-200">Second</div>
<div className="ds-animate-fade-in ds-delay-400">Third</div>
```

---

## 📱 Responsive Grid

```tsx
{/* 4 columns → 2 → 1 */}
<Grid columns={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>

{/* 3 columns → 2 → 1 */}
<Grid columns={3}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

---

## 🎯 Best Practices

### DO
✅ Use design system components
✅ Follow spacing system (8px grid)
✅ Use semantic HTML elements
✅ Test accessibility with keyboard
✅ Respect reduced motion preferences

### DON'T
❌ Override design tokens without reason
❌ Use arbitrary spacing values
❌ Ignore accessibility guidelines
❌ Create custom components before checking library

---

## 📚 Full Documentation

- **Complete Guide:** `/DESIGN_SYSTEM.md`
- **Brand Guidelines:** `/BRAND_GUIDELINES.md`
- **Component Source:** `/components/ui/design-system/`
- **CSS Tokens:** `/styles/design-system.css`

---

## 🆘 Need Help?

**Component not working?**
- Check import path: `@/components/ui/design-system`
- Verify design-system.css is imported
- Check TypeScript types

**Styling issues?**
- Ensure Tailwind config includes luxury colors
- Check CSS specificity conflicts
- Use browser DevTools to inspect

**Questions?**
- Review `/DESIGN_SYSTEM.md` for detailed docs
- Check `/DIVISION_7_DESIGN_SYSTEM.md` for examples
- Contact: design@pgclosets.com

---

**Happy building!** 🎨✨
