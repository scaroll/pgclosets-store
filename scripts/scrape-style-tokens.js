#!/usr/bin/env node

/**
 * Style Token Scraper
 * Scrapes live pgclosets.com to extract design tokens (colors, fonts, spacing)
 * Generates design-tokens/tokens.json and styles/tokens.css
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

// Parse command line arguments
const args = process.argv.slice(2);
const urlsIndex = args.indexOf('--urls');
const urls = urlsIndex >= 0 ? args.slice(urlsIndex + 1) : ['https://pgclosets.com'];

console.log(pc.blue('🎨 Scraping design tokens from live site...'));
console.log(pc.gray(`URLs: ${urls.join(', ')}\n`));

async function scrapeStyleTokens() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const tokens = {
    colors: new Set(),
    fonts: new Set(),
    backgrounds: new Set(),
    textColors: new Set(),
    borderColors: new Set(),
  };

  try {
    for (const url of urls) {
      console.log(pc.cyan(`Scraping ${url}...`));
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract computed styles from all visible elements
      const styles = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const extracted = {
          colors: [],
          fonts: [],
          backgrounds: [],
          textColors: [],
          borderColors: []
        };

        elements.forEach(el => {
          const computed = window.getComputedStyle(el);

          // Extract colors
          const color = computed.color;
          const bgColor = computed.backgroundColor;
          const borderColor = computed.borderColor;

          if (color && color !== 'rgba(0, 0, 0, 0)') extracted.textColors.push(color);
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') extracted.backgrounds.push(bgColor);
          if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') extracted.borderColors.push(borderColor);

          // Extract fonts
          const fontFamily = computed.fontFamily;
          if (fontFamily) extracted.fonts.push(fontFamily);
        });

        return extracted;
      });

      // Merge into sets
      styles.textColors.forEach(c => tokens.textColors.add(c));
      styles.backgrounds.forEach(c => tokens.backgrounds.add(c));
      styles.borderColors.forEach(c => tokens.borderColors.add(c));
      styles.fonts.forEach(f => tokens.fonts.add(f));

      await page.close();
    }

    await browser.close();

    // Convert RGB to hex
    const rgbToHex = (rgb) => {
      const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
      if (!match) return rgb;
      const [, r, g, b] = match;
      return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    };

    // Process colors
    const processedColors = {
      primary: [],
      backgrounds: [],
      text: [],
      borders: []
    };

    Array.from(tokens.textColors).forEach(c => {
      const hex = rgbToHex(c);
      if (!processedColors.text.includes(hex)) processedColors.text.push(hex);
    });

    Array.from(tokens.backgrounds).forEach(c => {
      const hex = rgbToHex(c);
      if (!processedColors.backgrounds.includes(hex)) processedColors.backgrounds.push(hex);
    });

    Array.from(tokens.borderColors).forEach(c => {
      const hex = rgbToHex(c);
      if (!processedColors.borders.includes(hex)) processedColors.borders.push(hex);
    });

    // Determine primary/secondary from most common colors
    const colorCounts = {};
    [...processedColors.text, ...processedColors.backgrounds].forEach(c => {
      colorCounts[c] = (colorCounts[c] || 0) + 1;
    });

    const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
    processedColors.primary = sorted.slice(0, 3).map(([color]) => color);

    // Generate tokens.json
    const tokensJson = {
      "$schema": "https://tr.designtokens.org/format/",
      "meta": {
        "name": "PG Closets Design System (Auto-Generated)",
        "version": "2.0.0",
        "description": "Scraped from live site on " + new Date().toISOString(),
        "source": urls
      },
      "color": {
        "primary": {
          "value": processedColors.primary[0] || "#000000",
          "type": "color",
          "description": "Primary brand color (most common)"
        },
        "secondary": {
          "value": processedColors.primary[1] || "#ffffff",
          "type": "color",
          "description": "Secondary brand color"
        },
        "accent": {
          "value": processedColors.primary[2] || "#1a1a1a",
          "type": "color",
          "description": "Accent color"
        },
        "text": {
          "primary": {
            "value": processedColors.text[0] || "#000000",
            "type": "color"
          },
          "secondary": {
            "value": processedColors.text[1] || "#1e293b",
            "type": "color"
          },
          "muted": {
            "value": processedColors.text[2] || "#64748b",
            "type": "color"
          }
        },
        "background": {
          "primary": {
            "value": processedColors.backgrounds[0] || "#ffffff",
            "type": "color"
          },
          "secondary": {
            "value": processedColors.backgrounds[1] || "#fafafa",
            "type": "color"
          }
        },
        "border": {
          "default": {
            "value": processedColors.borders[0] || "#e2e8f0",
            "type": "color"
          },
          "subtle": {
            "value": "rgba(0, 0, 0, 0.1)",
            "type": "color"
          }
        }
      },
      "typography": {
        "fontFamily": {
          "value": Array.from(tokens.fonts)[0] || "system-ui, sans-serif",
          "type": "fontFamily"
        }
      }
    };

    // Write tokens.json
    const tokensDir = path.join(process.cwd(), 'design-tokens');
    if (!fs.existsSync(tokensDir)) {
      fs.mkdirSync(tokensDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(tokensDir, 'tokens.json'),
      JSON.stringify(tokensJson, null, 2)
    );

    // Generate tokens.css
    const css = `/**
 * Design Tokens - Auto-generated from live site
 * Generated: ${new Date().toISOString()}
 * Sources: ${urls.join(', ')}
 */

:root {
  /* Colors */
  --color-primary: ${tokensJson.color.primary.value};
  --color-secondary: ${tokensJson.color.secondary.value};
  --color-accent: ${tokensJson.color.accent.value};

  /* Text Colors */
  --color-text-primary: ${tokensJson.color.text.primary.value};
  --color-text-secondary: ${tokensJson.color.text.secondary.value};
  --color-text-muted: ${tokensJson.color.text.muted.value};

  /* Background Colors */
  --color-bg-primary: ${tokensJson.color.background.primary.value};
  --color-bg-secondary: ${tokensJson.color.background.secondary.value};

  /* Border Colors */
  --color-border-default: ${tokensJson.color.border.default.value};
  --color-border-subtle: ${tokensJson.color.border.subtle.value};

  /* Typography */
  --font-family: ${tokensJson.typography.fontFamily.value};
}
`;

    const stylesDir = path.join(process.cwd(), 'styles');
    if (!fs.existsSync(stylesDir)) {
      fs.mkdirSync(stylesDir, { recursive: true });
    }
    fs.writeFileSync(path.join(stylesDir, 'tokens.css'), css);

    console.log(pc.green('\n✓ Tokens generated successfully!'));
    console.log(pc.gray('  → design-tokens/tokens.json'));
    console.log(pc.gray('  → styles/tokens.css'));
    console.log(pc.yellow('\nNext steps:'));
    console.log(pc.gray('  1. Import styles/tokens.css in your global CSS'));
    console.log(pc.gray('  2. Run: node scripts/refactor-to-tokens.js --src ./src ./components'));

  } catch (error) {
    console.error(pc.red('Error scraping tokens:'), error);
    await browser.close();
    process.exit(1);
  }
}

scrapeStyleTokens();
