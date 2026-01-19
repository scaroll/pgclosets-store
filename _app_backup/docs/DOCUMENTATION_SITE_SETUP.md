# Documentation Site Setup Guide

> **How to deploy a beautiful, searchable documentation site for PG Closets**

## 🎯 Overview

This guide will help you set up a production-ready documentation site using either **Docusaurus** or **Nextra** (both are excellent choices for React/Next.js projects).

## 🆚 Technology Comparison

| Feature | Docusaurus | Nextra | Recommendation |
|---------|------------|--------|----------------|
| **Framework** | React | Next.js | Nextra (matches stack) |
| **Setup Time** | 10 minutes | 5 minutes | ✅ Nextra |
| **Search** | Algolia DocSearch | Built-in + Algolia | ✅ Nextra |
| **Customization** | Good | Excellent | ✅ Nextra |
| **Performance** | Fast | Very Fast | ✅ Nextra |
| **Learning Curve** | Easy | Very Easy | ✅ Nextra |
| **Community** | Large | Growing | Docusaurus |
| **Deployment** | Easy | Very Easy | ✅ Nextra |

**Recommendation**: Use **Nextra** since you're already using Next.js and it will integrate seamlessly with your existing stack.

---

## 🚀 Option 1: Nextra (Recommended)

### Why Nextra?

- ✅ Built on Next.js (same as main app)
- ✅ Extremely fast and lightweight
- ✅ Amazing developer experience
- ✅ Beautiful default theme
- ✅ Built-in full-text search
- ✅ MDX support (React in Markdown)
- ✅ Easy deployment to Vercel
- ✅ Excellent TypeScript support

### Installation

```bash
# In your project root
npm install nextra nextra-theme-docs

# Or in a separate docs directory
mkdir docs-site && cd docs-site
npm init -y
npm install next react react-dom nextra nextra-theme-docs
```

### Configuration

**1. Create `pages` directory:**

```bash
mkdir -p pages
```

**2. Create `pages/_meta.json`:**

```json
{
  "index": "Introduction",
  "getting-started": "Getting Started",
  "developer-guides": "Developer Guides",
  "architecture": "Architecture",
  "api": "API Reference",
  "components": "Components"
}
```

**3. Create `next.config.js`:**

```javascript
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})

module.exports = withNextra({
  // Your Next.js config
})
```

**4. Create `theme.config.jsx`:**

```jsx
export default {
  logo: <span>PG Closets Documentation</span>,
  project: {
    link: 'https://github.com/pgclosets/store',
  },
  docsRepositoryBase: 'https://github.com/pgclosets/store/tree/main/docs',
  footer: {
    text: `© ${new Date().getFullYear()} PG Closets. All rights reserved.`,
  },
  search: {
    placeholder: 'Search documentation...',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    float: true,
    title: 'On This Page',
  },
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – PG Closets Docs',
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="PG Closets Documentation" />
      <meta property="og:description" content="Complete developer and user documentation for PG Closets" />
    </>
  ),
}
```

### Move Documentation

**Option A: Copy existing docs**

```bash
# Copy all markdown files to pages directory
cp -r docs/. pages/

# Organize into subdirectories
mkdir -p pages/developer-guides
mkdir -p pages/architecture
mkdir -p pages/api
mkdir -p pages/components
```

**Option B: Symlink existing docs**

```bash
# Symlink to keep docs in one place
ln -s ../docs pages/docs
```

### Start Development Server

```bash
npm run dev
# Opens at http://localhost:3000
```

### Deploy to Vercel

```bash
# Connect to Vercel
vercel link

# Deploy
vercel --prod
```

**Or via GitHub:**

1. Push to GitHub
2. Import in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Deploy!

### Custom Domain

```bash
# Add custom domain in Vercel
vercel domains add docs.pgclosets.com
```

---

## 🔷 Option 2: Docusaurus

### Installation

```bash
# Create new Docusaurus site
npx create-docusaurus@latest docs-site classic

cd docs-site
```

### Configuration

**Edit `docusaurus.config.js`:**

```javascript
module.exports = {
  title: 'PG Closets Documentation',
  tagline: 'Complete guide to PG Closets development',
  url: 'https://docs.pgclosets.com',
  baseUrl: '/',

  // GitHub config
  organizationName: 'pgclosets',
  projectName: 'store',

  themeConfig: {
    navbar: {
      title: 'PG Closets',
      logo: {
        alt: 'PG Closets Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/pgclosets/store',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/pgclosets/store',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PG Closets.`,
    },

    // Algolia Search
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'pgclosets',
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/pgclosets/store/tree/main/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

### Move Documentation

```bash
# Copy markdown files
cp -r ../docs/. ./docs/

# Update frontmatter in each file
# Add to top of each .md file:
---
id: filename
title: Document Title
sidebar_label: Sidebar Label
---
```

### Start Development

```bash
npm run start
# Opens at http://localhost:3000
```

### Deploy

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to GitHub Pages
npm run deploy
```

---

## 🔍 Search Setup (Algolia DocSearch)

### Why Algolia DocSearch?

- ✅ Free for open-source projects
- ✅ Fast, typo-tolerant search
- ✅ Beautiful UI
- ✅ Easy integration
- ✅ Automatic indexing

### Setup Process

**1. Apply for DocSearch:**

Visit: https://docsearch.algolia.com/apply/

Fill out form with:
- Website URL
- Email
- Documentation URL
- GitHub repository

**2. Receive Credentials:**

Algolia will send you:
- Application ID
- Search-only API Key
- Index Name

**3. Add to Configuration:**

**Nextra** (`theme.config.jsx`):

```jsx
export default {
  // ... other config
  search: {
    component: () => null, // We'll use Algolia's widget
  },
  head: (
    <>
      {/* Algolia DocSearch CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"
      />
    </>
  ),
}
```

Then add Algolia script to `pages/_app.js`:

```jsx
import '@docsearch/css';
import { useEffect } from 'react';
import docsearch from '@docsearch/js';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    docsearch({
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'pgclosets',
      container: '#docsearch',
    });
  }, []);

  return <Component {...pageProps} />;
}
```

**Docusaurus**:

Already configured in `docusaurus.config.js` (see above).

---

## 🎨 Customization

### Brand Colors

**Nextra** (`globals.css`):

```css
:root {
  --nextra-primary-hue: 210;
  --nextra-primary-saturation: 100%;
  --nextra-primary-lightness: 50%;
}
```

**Docusaurus** (`custom.css`):

```css
:root {
  --ifm-color-primary: #0066cc;
  --ifm-color-primary-dark: #0059b3;
  --ifm-color-primary-darker: #004d99;
}
```

### Logo

Add logo to `public/` directory and reference in config.

### Custom Components

Both frameworks support custom React components in MDX:

```mdx
import { CustomComponent } from '../components/CustomComponent'

# My Doc

<CustomComponent prop="value" />
```

---

## 📊 Analytics Integration

### Google Analytics

**Nextra**:

```jsx
// pages/_app.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: url,
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `,
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
```

**Docusaurus**:

Add to `docusaurus.config.js`:

```javascript
module.exports = {
  // ...
  themeConfig: {
    gtag: {
      trackingID: 'GA_MEASUREMENT_ID',
      anonymizeIP: true,
    },
  },
}
```

---

## 🚀 Performance Optimization

### Image Optimization

**Nextra**: Use Next.js Image component

```jsx
import Image from 'next/image'

<Image src="/screenshot.png" width={800} height={600} alt="Screenshot" />
```

**Docusaurus**: Use optimized image plugin

```bash
npm install @docusaurus/plugin-ideal-image
```

### Code Splitting

Both frameworks automatically code-split pages.

### CDN Caching

Deploy to Vercel for automatic edge caching.

---

## 📱 Mobile Optimization

Both frameworks are mobile-responsive by default. Test on:

- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)

### Responsive Tables

Use responsive table wrappers:

```mdx
<div className="overflow-x-auto">

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data     | Data     | Data     |

</div>
```

---

## ✅ Launch Checklist

### Pre-Launch

- [ ] All documentation migrated
- [ ] Navigation structure finalized
- [ ] Search configured and tested
- [ ] Analytics integrated
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Mobile responsive verified
- [ ] All links tested
- [ ] Spell check completed
- [ ] Code examples tested

### Launch

- [ ] Deploy to production
- [ ] Test production site
- [ ] Submit sitemap to search engines
- [ ] Apply for Algolia DocSearch
- [ ] Announce to team
- [ ] Update README with docs link

### Post-Launch

- [ ] Monitor analytics
- [ ] Gather user feedback
- [ ] Fix broken links
- [ ] Update outdated content
- [ ] Add new documentation as needed

---

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Search Not Working

1. Verify Algolia credentials
2. Check index exists in Algolia dashboard
3. Test with Algolia crawler
4. Clear browser cache

### Slow Performance

1. Optimize images
2. Enable CDN caching
3. Check bundle size
4. Remove unused dependencies

---

## 📚 Resources

### Nextra

- [Nextra Docs](https://nextra.site)
- [Nextra GitHub](https://github.com/shuding/nextra)
- [Examples](https://nextra.site/showcase)

### Docusaurus

- [Docusaurus Docs](https://docusaurus.io)
- [Docusaurus GitHub](https://github.com/facebook/docusaurus)
- [Examples](https://docusaurus.io/showcase)

### Algolia DocSearch

- [DocSearch](https://docsearch.algolia.com)
- [Apply](https://docsearch.algolia.com/apply)
- [Configuration](https://docsearch.algolia.com/docs/docsearch-program)

---

## 🎯 Recommended Approach

**For PG Closets**, I recommend:

1. **Use Nextra** - Seamless integration with existing Next.js stack
2. **Deploy to Vercel** - Same platform as main app, automatic deployments
3. **Custom subdomain** - `docs.pgclosets.com`
4. **Algolia DocSearch** - Professional search experience
5. **Incremental migration** - Start with core docs, add more over time

**Estimated Setup Time**: 2-4 hours for complete documentation site

---

For questions or help with setup, contact the documentation team or create an issue.
