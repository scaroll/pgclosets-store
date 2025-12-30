#!/usr/bin/env node

/**
 * Cleanup Console Statements
 * Removes console.log and console.debug while preserving console.error and console.warn
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const SOURCE_DIRS = ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.ts'];
const DRY_RUN = process.argv.includes('--dry-run');

let stats = {
  filesProcessed: 0,
  consoleLogRemoved: 0,
  consoleDebugRemoved: 0,
  consoleErrorKept: 0,
  consoleWarnKept: 0,
};

function cleanConsoleStatements(content) {
  let newContent = content;
  let logCount = 0;
  let debugCount = 0;

  // Remove console.log() calls (single line)
  newContent = newContent.replace(/^\s*console\.log\(.*\);?\s*\n?/gm, () => {
    logCount++;
    return '';
  });

  // Remove console.debug() calls (single line)
  newContent = newContent.replace(/^\s*console\.debug\(.*\);?\s*\n?/gm, () => {
    debugCount++;
    return '';
  });

  // Remove inline console.log (within lines)
  newContent = newContent.replace(/console\.log\([^)]*\);?\s*/g, () => {
    logCount++;
    return '';
  });

  // Remove inline console.debug (within lines)
  newContent = newContent.replace(/console\.debug\([^)]*\);?\s*/g, () => {
    debugCount++;
    return '';
  });

  // Count preserved statements
  const errorMatches = content.match(/console\.error/g);
  const warnMatches = content.match(/console\.warn/g);

  return { content: newContent, logCount, debugCount, errorCount: errorMatches?.length || 0, warnCount: warnMatches?.length || 0 };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    const { content: newContent, logCount, debugCount, errorCount, warnCount } = cleanConsoleStatements(content);

    stats.consoleLogRemoved += logCount;
    stats.consoleDebugRemoved += debugCount;
    stats.consoleErrorKept += errorCount;
    stats.consoleWarnKept += warnCount;

    if (newContent !== originalContent) {
      stats.filesProcessed++;
      if (DRY_RUN) {
        console.log(`[DRY RUN] Would clean: ${filePath}`);
        console.log(`  - Removed ${logCount} console.log()`);
        console.log(`  - Removed ${debugCount} console.debug()`);
      } else {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Cleaned: ${filePath}`);
        console.log(`  - Removed ${logCount} console.log()`);
        console.log(`  - Removed ${debugCount} console.debug()`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Main execution
console.log('🧹 Cleaning up console statements...\n');

for (const pattern of SOURCE_DIRS) {
  const files = globSync(pattern, { ignore: ['node_modules/**', '.next/**', 'dist/**'] });
  files.forEach(processFile);
}

console.log('\n📊 Summary:');
console.log(`  Files processed: ${stats.filesProcessed}`);
console.log(`  console.log removed: ${stats.consoleLogRemoved}`);
console.log(`  console.debug removed: ${stats.consoleDebugRemoved}`);
console.log(`  console.error preserved: ${stats.consoleErrorKept}`);
console.log(`  console.warn preserved: ${stats.consoleWarnKept}`);
console.log(`  Total removed: ${stats.consoleLogRemoved + stats.consoleDebugRemoved}`);

if (DRY_RUN) {
  console.log('\n⚠️  DRY RUN MODE - No files were modified');
  console.log('Run without --dry-run to apply changes');
}
