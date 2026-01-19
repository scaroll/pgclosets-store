#!/usr/bin/env node

/**
 * Comprehensive Brand Color Refactor
 * Replaces all hardcoded brand colors with CSS variables
 * Handles Tailwind bracket notation and inline styles
 */

const fs = require('fs');
const path = require('path');
const { globby } = require('globby');
const pc = require('picocolors');

console.log(pc.blue('🎨 Refactoring all brand colors to CSS variables...\n'));

// Brand color mappings
const colorReplacements = [
  // Primary brand color #1B4A9C
  {
    pattern: /#1B4A9C/gi,
    replacement: 'var(--color-primary)',
    name: 'Primary Blue (#1B4A9C)'
  },
  // Secondary brand color #9BC4E2
  {
    pattern: /#9BC4E2/gi,
    replacement: 'var(--color-secondary)',
    name: 'Secondary Blue (#9BC4E2)'
  },
  // Accent color #4A5F8A
  {
    pattern: /#4A5F8A/gi,
    replacement: 'var(--color-accent)',
    name: 'Accent Blue (#4A5F8A)'
  },
  // Darker variant #153A7E
  {
    pattern: /#153A7E/gi,
    replacement: 'var(--color-primary)',
    name: 'Dark Blue (#153A7E → Primary)'
  },
  // Text muted #6B7280
  {
    pattern: /#6B7280/gi,
    replacement: 'var(--color-text-muted)',
    name: 'Muted Gray (#6B7280)'
  },
  // Border color #E0E0E0
  {
    pattern: /#E0E0E0/gi,
    replacement: 'var(--color-border-default)',
    name: 'Border Gray (#E0E0E0)'
  },
  // Background secondary #F5F5F5
  {
    pattern: /#F5F5F5/gi,
    replacement: 'var(--color-bg-secondary)',
    name: 'Light Gray Background (#F5F5F5)'
  },
  // Common text colors
  {
    pattern: /#2C3E50/gi,
    replacement: 'var(--color-text-primary)',
    name: 'Dark Text (#2C3E50)'
  }
];

async function refactorFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    let replacementCount = 0;

    for (const { pattern, replacement } of colorReplacements) {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        replacementCount += matches.length;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(pc.green(`✓ ${path.relative(process.cwd(), filePath)}`), pc.gray(`(${replacementCount} replacements)`));
      return replacementCount;
    } else {
      return 0;
    }
  } catch (error) {
    console.error(pc.red(`✗ ${filePath}:`), error.message);
    return 0;
  }
}

async function main() {
  // Find all relevant files
  const files = await globby([
    'app/**/*.{tsx,ts,jsx,js}',
    'components/**/*.{tsx,ts,jsx,js}',
    'lib/**/*.{tsx,ts,jsx,js}',
    'services/**/*.{tsx,ts,jsx,js}',
    '*.{tsx,ts,jsx,js}'
  ], {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**']
  });

  console.log(pc.cyan(`Processing ${files.length} files...\n`));

  let totalReplacements = 0;
  let filesModified = 0;

  for (const file of files) {
    const replacements = await refactorFile(file);
    if (replacements > 0) {
      totalReplacements += replacements;
      filesModified++;
    }
  }

  console.log(pc.green(`\n✨ Refactoring complete!`));
  console.log(pc.gray(`Files modified: ${filesModified}`));
  console.log(pc.gray(`Total replacements: ${totalReplacements}`));

  if (totalReplacements === 0) {
    console.log(pc.yellow('\n⚠️  No brand colors found to replace.'));
  } else {
    console.log(pc.cyan('\nNext steps:'));
    console.log(pc.gray('  1. Review changes: git diff'));
    console.log(pc.gray('  2. Test the application: npm run dev'));
    console.log(pc.gray('  3. Commit: git add . && git commit -m "Refactor brand colors to design tokens"'));
  }
}

main().catch(error => {
  console.error(pc.red('Fatal error:'), error);
  process.exit(1);
});
