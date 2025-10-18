#!/usr/bin/env node

/**
 * Refactor to Tokens
 * Replaces raw hex colors with CSS variable references
 */

const fs = require('fs');
const path = require('path');
const { globby } = require('globby');
const pc = require('picocolors');

// Parse command line arguments
const args = process.argv.slice(2);
const srcIndex = args.indexOf('--src');
const srcDirs = srcIndex >= 0 ? args.slice(srcIndex + 1) : ['./src', './components', './app'];

console.log(pc.blue('🔄 Refactoring raw hex colors to CSS variables...'));
console.log(pc.gray(`Directories: ${srcDirs.join(', ')}\n`));

// Load design tokens
const tokensPath = path.join(process.cwd(), 'design-tokens', 'tokens.json');
if (!fs.existsSync(tokensPath)) {
  console.error(pc.red('❌ design-tokens/tokens.json not found!'));
  console.log(pc.yellow('Run: node scripts/scrape-style-tokens.js first'));
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

// Build color mapping
const colorMap = {};

function addColorMapping(value, varName) {
  if (value && typeof value === 'string' && value.startsWith('#')) {
    colorMap[value.toLowerCase()] = varName;
  }
}

// Map all colors from tokens
addColorMapping(tokens.color.primary.value, 'var(--color-primary)');
addColorMapping(tokens.color.secondary.value, 'var(--color-secondary)');
addColorMapping(tokens.color.accent.value, 'var(--color-accent)');
addColorMapping(tokens.color.text.primary.value, 'var(--color-text-primary)');
addColorMapping(tokens.color.text.secondary.value, 'var(--color-text-secondary)');
addColorMapping(tokens.color.text.muted.value, 'var(--color-text-muted)');
addColorMapping(tokens.color.background.primary.value, 'var(--color-bg-primary)');
addColorMapping(tokens.color.background.secondary.value, 'var(--color-bg-secondary)');
addColorMapping(tokens.color.border.default.value, 'var(--color-border-default)');

// Add common color variations
colorMap['#000000'] = 'var(--color-primary)';
colorMap['#000'] = 'var(--color-primary)';
colorMap['#ffffff'] = 'var(--color-secondary)';
colorMap['#fff'] = 'var(--color-secondary)';

async function refactorFiles() {
  try {
    // Find all files
    const patterns = srcDirs.flatMap(dir => [
      `${dir}/**/*.tsx`,
      `${dir}/**/*.ts`,
      `${dir}/**/*.jsx`,
      `${dir}/**/*.js`,
      `${dir}/**/*.css`
    ]);

    const files = await globby(patterns, {
      ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**']
    });

    console.log(pc.cyan(`Found ${files.length} files to process\n`));

    let totalReplacements = 0;
    let filesModified = 0;

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf-8');
      let modified = false;
      let fileReplacements = 0;

      // Replace hex colors
      for (const [hex, cssVar] of Object.entries(colorMap)) {
        const regex = new RegExp(`(['"\`\\s:])${hex}(?=['"\\s;}])`, 'gi');
        const matches = content.match(regex);

        if (matches) {
          content = content.replace(regex, `$1${cssVar}`);
          fileReplacements += matches.length;
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(file, content);
        filesModified++;
        totalReplacements += fileReplacements;
        console.log(pc.green(`✓ ${path.relative(process.cwd(), file)} (${fileReplacements} replacements)`));
      }
    }

    console.log(pc.green(`\n✅ Refactoring complete!`));
    console.log(pc.gray(`  Files modified: ${filesModified}`));
    console.log(pc.gray(`  Total replacements: ${totalReplacements}`));

    if (totalReplacements === 0) {
      console.log(pc.yellow('\n⚠️  No raw hex colors found to replace.'));
      console.log(pc.gray('  This might mean:'));
      console.log(pc.gray('  1. Colors are already using variables'));
      console.log(pc.gray('  2. The tokens don\'t match existing colors'));
      console.log(pc.gray('  3. The source directories are incorrect'));
    }

  } catch (error) {
    console.error(pc.red('Error refactoring files:'), error);
    process.exit(1);
  }
}

refactorFiles();
