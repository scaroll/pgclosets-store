#!/usr/bin/env node
/**
 * Code Polishing Script
 * Automatically fixes common code quality issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Starting code polishing...\n');

// 1. Remove unused imports using ESLint fix
console.log('📦 Removing unused imports...');
try {
  execSync('npx eslint --fix --rule "unused-imports/no-unused-imports: error" --ext .ts,.tsx,.js,.jsx .', {
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  console.log('✓ Unused imports cleaned\n');
} catch (error) {
  console.log('⚠ Some files could not be auto-fixed\n');
}

// 2. Format code with Prettier
console.log('✨ Formatting code with Prettier...');
try {
  execSync('npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"', {
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  console.log('✓ Code formatted\n');
} catch (error) {
  console.log('⚠ Some files could not be formatted\n');
}

// 3. Optimize imports order
console.log('📑 Organizing imports...');
try {
  execSync('npx organize-imports-cli "**/*.{ts,tsx}"', {
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  console.log('✓ Imports organized\n');
} catch (error) {
  console.log('ℹ organize-imports-cli not installed, skipping\n');
}

console.log('✅ Code polishing complete!');
console.log('\nNext steps:');
console.log('  1. Review changes: git diff');
console.log('  2. Run build: npm run build');
console.log('  3. Run tests: npm test');
