#!/usr/bin/env node

/**
 * Image Optimization Validation Script
 * Validates that all images meet performance standards
 *
 * Usage: node scripts/validate-image-optimization.js
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

// Validation rules
const RULES = {
  maxFileSize: 100 * 1024, // 100KB
  maxHeroSize: 150 * 1024, // 150KB for hero images
  requiredFormats: ['avif', 'webp'],
  minQuality: 75,
  maxOriginalSize: 2560, // Max width in pixels
};

// Results tracking
const results = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  warnings: 0,
  errors: [],
  warnings: [],
  summary: {}
};

/**
 * Load image manifest
 */
async function loadManifest() {
  try {
    const manifestPath = path.join(process.cwd(), 'public/image-manifest.json');
    const content = await fs.readFile(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load image manifest: ${error.message}`);
  }
}

/**
 * Validate file size
 */
function validateFileSize(imagePath, variants) {
  results.totalChecks++;

  const issues = [];
  let passed = true;

  // Check each variant
  for (const [format, sizes] of Object.entries(variants)) {
    for (const [size, info] of Object.entries(sizes)) {
      const maxSize = imagePath.includes('hero') ? RULES.maxHeroSize : RULES.maxFileSize;

      if (info.size > maxSize) {
        passed = false;
        issues.push(
          `${format}/${size}: ${(info.size / 1024).toFixed(1)}KB exceeds ${(maxSize / 1024).toFixed(0)}KB`
        );
      }
    }
  }

  if (passed) {
    results.passedChecks++;
  } else {
    results.failedChecks++;
    results.errors.push({
      image: imagePath,
      check: 'File Size',
      issues
    });
  }

  return passed;
}

/**
 * Validate required formats
 */
function validateFormats(imagePath, variants) {
  results.totalChecks++;

  const availableFormats = Object.keys(variants);
  const missingFormats = RULES.requiredFormats.filter(
    format => !availableFormats.includes(format)
  );

  if (missingFormats.length === 0) {
    results.passedChecks++;
    return true;
  } else {
    results.failedChecks++;
    results.errors.push({
      image: imagePath,
      check: 'Required Formats',
      issues: [`Missing formats: ${missingFormats.join(', ')}`]
    });
    return false;
  }
}

/**
 * Validate blur placeholder
 */
function validateBlurPlaceholder(imagePath, blurDataURL) {
  results.totalChecks++;

  if (!blurDataURL || !blurDataURL.startsWith('data:image/jpeg;base64,')) {
    results.failedChecks++;
    results.errors.push({
      image: imagePath,
      check: 'Blur Placeholder',
      issues: ['Missing or invalid blur data URL']
    });
    return false;
  }

  // Check base64 length (should be small)
  const base64Length = blurDataURL.split(',')[1].length;
  if (base64Length > 1000) {
    results.warnings.push({
      image: imagePath,
      check: 'Blur Placeholder',
      issues: [`Base64 too large: ${base64Length} chars (should be <1000)`]
    });
  }

  results.passedChecks++;
  return true;
}

/**
 * Validate aspect ratio
 */
function validateAspectRatio(imagePath, aspectRatio) {
  results.totalChecks++;

  const ratio = parseFloat(aspectRatio);

  // Check for reasonable aspect ratios (0.5 to 3.0)
  if (ratio < 0.5 || ratio > 3.0) {
    results.warnings.push({
      image: imagePath,
      check: 'Aspect Ratio',
      issues: [`Unusual aspect ratio: ${ratio.toFixed(2)} (may cause layout issues)`]
    });
  }

  results.passedChecks++;
  return true;
}

/**
 * Validate responsive variants
 */
function validateResponsiveVariants(imagePath, variants) {
  results.totalChecks++;

  const expectedSizes = ['thumbnail', 'small', 'medium', 'large'];
  const issues = [];
  let passed = true;

  for (const format of RULES.requiredFormats) {
    if (!variants[format]) continue;

    const availableSizes = Object.keys(variants[format]);
    const missingSizes = expectedSizes.filter(size => !availableSizes.includes(size));

    if (missingSizes.length > 0) {
      passed = false;
      issues.push(`${format}: missing sizes [${missingSizes.join(', ')}]`);
    }
  }

  if (passed) {
    results.passedChecks++;
  } else {
    results.failedChecks++;
    results.errors.push({
      image: imagePath,
      check: 'Responsive Variants',
      issues
    });
  }

  return passed;
}

/**
 * Check for source files
 */
async function validateSourceFiles(manifest) {
  results.totalChecks++;

  const missingFiles = [];

  for (const [imagePath, data] of Object.entries(manifest)) {
    const fullPath = path.join(process.cwd(), imagePath);
    try {
      await fs.access(fullPath);
    } catch {
      missingFiles.push(imagePath);
    }
  }

  if (missingFiles.length === 0) {
    results.passedChecks++;
    return true;
  } else {
    results.failedChecks++;
    results.errors.push({
      image: 'Multiple',
      check: 'Source Files',
      issues: [`${missingFiles.length} source files missing`]
    });
    return false;
  }
}

/**
 * Check for unused optimized images
 */
async function checkUnusedOptimized() {
  const optimizedImages = await glob('public/optimized/**/*.{avif,webp,jpg,jpeg}');
  const manifest = await loadManifest();

  const manifestImages = new Set();
  for (const data of Object.values(manifest)) {
    for (const formats of Object.values(data.variants)) {
      for (const variant of Object.values(formats)) {
        manifestImages.add(variant.path);
      }
    }
  }

  const unused = optimizedImages.filter(img => {
    const relativePath = path.relative(process.cwd(), img);
    return !manifestImages.has(relativePath);
  });

  if (unused.length > 0) {
    results.warnings.push({
      image: 'Multiple',
      check: 'Unused Files',
      issues: [`${unused.length} optimized files not in manifest (orphaned)`]
    });
  }
}

/**
 * Generate validation report
 */
function generateReport() {
  console.log('\n');
  console.log('='.repeat(60));
  console.log('🔍 IMAGE OPTIMIZATION VALIDATION REPORT');
  console.log('='.repeat(60));
  console.log();

  // Summary
  const passRate = ((results.passedChecks / results.totalChecks) * 100).toFixed(1);
  console.log('📊 SUMMARY:');
  console.log(`   Total Checks: ${results.totalChecks}`);
  console.log(`   ✅ Passed: ${results.passedChecks} (${passRate}%)`);
  console.log(`   ❌ Failed: ${results.failedChecks}`);
  console.log(`   ⚠️  Warnings: ${results.warnings.length}`);
  console.log();

  // Errors
  if (results.errors.length > 0) {
    console.log('❌ ERRORS:');
    results.errors.forEach((error, i) => {
      console.log(`\n   ${i + 1}. ${error.image}`);
      console.log(`      Check: ${error.check}`);
      error.issues.forEach(issue => {
        console.log(`      • ${issue}`);
      });
    });
    console.log();
  }

  // Warnings
  if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    results.warnings.forEach((warning, i) => {
      console.log(`\n   ${i + 1}. ${warning.image}`);
      console.log(`      Check: ${warning.check}`);
      warning.issues.forEach(issue => {
        console.log(`      • ${issue}`);
      });
    });
    console.log();
  }

  console.log('='.repeat(60));
  console.log();

  // Overall result
  if (results.failedChecks === 0) {
    console.log('🎉 VALIDATION PASSED');
    console.log('   All images meet performance standards!');
    console.log();
    console.log('✅ Ready for production deployment');
    return true;
  } else {
    console.log('❌ VALIDATION FAILED');
    console.log(`   ${results.failedChecks} checks failed`);
    console.log();
    console.log('📋 NEXT STEPS:');
    console.log('   1. Review errors above');
    console.log('   2. Re-run optimization with adjusted settings');
    console.log('   3. Run validation again: npm run image:validate');
    return false;
  }
}

/**
 * Main validation process
 */
async function main() {
  console.log('🔍 Starting image optimization validation...\n');

  try {
    // Load manifest
    const manifest = await loadManifest();
    const imageCount = Object.keys(manifest).length;
    console.log(`📸 Validating ${imageCount} images...\n`);

    // Run validations
    let totalImages = 0;
    for (const [imagePath, data] of Object.entries(manifest)) {
      totalImages++;
      process.stdout.write(`\r  Processing: ${totalImages}/${imageCount}`);

      validateFileSize(imagePath, data.variants);
      validateFormats(imagePath, data.variants);
      validateBlurPlaceholder(imagePath, data.blurDataURL);
      validateAspectRatio(imagePath, data.aspectRatio);
      validateResponsiveVariants(imagePath, data.variants);
    }

    console.log('\n');

    // Additional checks
    await validateSourceFiles(manifest);
    await checkUnusedOptimized();

    // Generate report
    const passed = generateReport();

    process.exit(passed ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateFileSize, validateFormats };
