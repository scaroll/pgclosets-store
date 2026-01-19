# Quick Start Guide - PG Closets Documentation System

**Get started with the new documentation system in 5 minutes!**

## Viewing Documentation

```bash
# Start development server
npm run dev

# Open browser
http://localhost:3000/docs
```

You'll see:
- Documentation homepage with category cards
- Sidebar navigation on the left
- Clean, Apple-inspired interface

## Adding Your First Page

### 1. Create an MDX File

```bash
# Choose a category: products, design-system, guides, or api
touch docs/content/products/my-product.mdx
```

### 2. Add Frontmatter

```mdx
---
title: "My Product Name"
summary: "Brief description for this product"
updatedAt: "2025-01-16"
keywords: "product, feature, guide"
---

# My Product Name

Your content here in **Markdown**!

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

Step-by-step guide...
```

### 3. View Your Page

```bash
# Restart dev server if needed
npm run dev

# Navigate to:
http://localhost:3000/docs/products/my-product
```

**That's it!** Your page automatically appears in the sidebar navigation.

## Using Special Components

### Callout Boxes

```mdx
<Callout type="info">
💡 This is helpful information
</Callout>

<Callout type="warning">
⚠️ This is a warning
</Callout>

<Callout type="success">
✅ This is a success message
</Callout>

<Callout type="error">
❌ This is an error message
</Callout>
```

### Card Container

```mdx
<Card>
### Inside a Card

Content inside a styled card with shadow and border.
</Card>
```

## Custom Page Order

Want to control the order pages appear in navigation?

Create or edit `meta.json` in your category folder:

```json
{
  "title": "Products",
  "pages": {
    "overview": 1,
    "my-product": 2,
    "another-product": 3
  }
}
```

## Frontmatter Options

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ Yes | Page title | "Installation Guide" |
| `summary` | ❌ No | Short description | "Step-by-step installation" |
| `updatedAt` | ✅ Yes | Update date | "2025-01-16" |
| `keywords` | ❌ No | SEO keywords | "install, setup, guide" |
| `order` | ❌ No | Custom sort | `1` |
| `image` | ❌ No | Cover image | "/images/cover.jpg" |

## File Structure

```
docs/content/
├── getting-started.mdx          # Top-level pages
├── products/
│   ├── meta.json               # Category config
│   ├── overview.mdx            # Pages in category
│   └── my-product.mdx
├── design-system/
│   ├── meta.json
│   └── tokens.mdx
├── guides/
│   ├── meta.json
│   └── installation.mdx
└── api/
    └── meta.json
```

## Common Tasks

### Adding a New Category

1. Create folder in `docs/content/`
2. Add `meta.json`:
   ```json
   {
     "title": "Category Name",
     "order": 5
   }
   ```
3. Add MDX files

### Adding Images

```mdx
---
title: "My Page"
image: "/images/my-image.jpg"
---

# Content

Or inline:
![Alt text](/images/inline.jpg)
```

### Linking Between Pages

```mdx
See [Installation Guide](/docs/guides/installation) for details.

Or relative:
Check out [another page](./another-page)
```

## Markdown Reference

### Headings

```mdx
# H1 - Page Title
## H2 - Section
### H3 - Subsection
#### H4 - Detail
```

### Emphasis

```mdx
**Bold text**
*Italic text*
~~Strikethrough~~
`inline code`
```

### Lists

```mdx
- Unordered list
- Another item
  - Nested item

1. Ordered list
2. Second item
3. Third item
```

### Code Blocks

````mdx
```typescript
const example = "code";
```
````

### Tables

```mdx
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### Blockquotes

```mdx
> This is a quote
> It can span multiple lines
```

## Tips & Tricks

### Pro Tip 1: Copy Existing Pages
Start by copying an existing page and modifying it.

### Pro Tip 2: Use VSCode
Install MDX extension for syntax highlighting:
- `MDX` by unified

### Pro Tip 3: Preview While Writing
Keep the dev server running and refresh to see changes.

### Pro Tip 4: Check Other Pages
Look at existing pages for formatting ideas:
- `docs/content/products/renin-overview.mdx`
- `docs/content/design-system/tokens.mdx`
- `docs/content/guides/installation.mdx`

## Troubleshooting

### Page Not Showing Up?

1. Check filename ends with `.mdx`
2. Check frontmatter syntax (YAML format)
3. Restart dev server: `Ctrl+C` then `npm run dev`

### Navigation Not Updating?

1. Check `meta.json` for syntax errors
2. Restart dev server
3. Clear browser cache

### Styles Look Wrong?

1. Check you're using design tokens
2. Verify component names (Callout, Card)
3. Check MDX syntax is correct

## Need Help?

📖 **Full Guide**: `/docs/MDX_DOCUMENTATION_GUIDE.md`
📧 **Questions**: Ask the development team
🐛 **Issues**: Create a GitHub issue

## Next Steps

1. ✅ Read this quick start
2. ✅ View existing documentation pages
3. ✅ Create your first page
4. ✅ Experiment with components
5. ✅ Share with the team

---

**Happy documenting!** 📝

Remember: Keep it simple, keep it clear, keep it useful.
