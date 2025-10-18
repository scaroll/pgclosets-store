#!/usr/bin/env node

/**
 * SEO AGENT #7: SEO Validation Script
 * Validates all SEO implementations before deployment
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 PG Closets SEO Validation Suite')
console.log('=' .repeat(50))
console.log('')

let totalChecks = 0
let passedChecks = 0
let warnings = []
let errors = []

function check(name, condition, severity = 'error') {
  totalChecks++
  const passed = typeof condition === 'function' ? condition() : condition

  if (passed) {
    passedChecks++
    console.log(`✅ ${name}`)
  } else {
    console.log(`${severity === 'error' ? '❌' : '⚠️'} ${name}`)
    if (severity === 'error') {
      errors.push(name)
    } else {
      warnings.push(name)
    }
  }
}

console.log('📁 FILE STRUCTURE CHECKS')
console.log('-'.repeat(50))

check(
  'Sitemap file exists',
  () => fs.existsSync(path.join(__dirname, '../sitemap.ts'))
)

check(
  'Robots.txt exists',
  () => fs.existsSync(path.join(__dirname, '../robots.txt'))
)

check(
  'SEO Dashboard component exists',
  () => fs.existsSync(path.join(__dirname, '../components/seo/SEODashboard.tsx'))
)

check(
  'Metadata helpers exist',
  () => fs.existsSync(path.join(__dirname, '../lib/seo/metadata-helpers.ts'))
)

check(
  'FAQ schema data exists',
  () => fs.existsSync(path.join(__dirname, '../lib/seo/faq-schema-data.ts'))
)

check(
  'Schema generator exists',
  () => fs.existsSync(path.join(__dirname, '../lib/seo/schema-generator.ts'))
)

check(
  'Business config exists',
  () => fs.existsSync(path.join(__dirname, '../lib/business-config.ts'))
)

console.log('')
console.log('🤖 ROBOTS.TXT VALIDATION')
console.log('-'.repeat(50))

const robotsPath = path.join(__dirname, '../robots.txt')
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8')

  check(
    'Robots.txt allows root',
    () => robotsContent.includes('Allow: /')
  )

  check(
    'Robots.txt disallows admin',
    () => robotsContent.includes('Disallow: /admin/')
  )

  check(
    'Robots.txt disallows API',
    () => robotsContent.includes('Disallow: /api/')
  )

  check(
    'Sitemap URL present',
    () => robotsContent.includes('Sitemap: https://www.pgclosets.com/sitemap.xml')
  )

  check(
    'Googlebot specific rules',
    () => robotsContent.includes('User-agent: Googlebot')
  )

  check(
    'Image crawling allowed',
    () => robotsContent.includes('Allow: /images/')
  )
}

console.log('')
console.log('🗺️  SITEMAP VALIDATION')
console.log('-'.repeat(50))

const sitemapPath = path.join(__dirname, '../sitemap.ts')
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')

  check(
    'Sitemap imports BUSINESS_INFO',
    () => sitemapContent.includes('BUSINESS_INFO')
  )

  check(
    'Homepage priority 1.0',
    () => sitemapContent.includes('priority: 1.0')
  )

  check(
    'Collections included',
    () => sitemapContent.includes('renin-barn-doors') && sitemapContent.includes('renin-bypass-doors')
  )

  check(
    'Location pages included',
    () => sitemapContent.includes('kanata') && sitemapContent.includes('barrhaven')
  )

  check(
    'ChangeFrequency set',
    () => sitemapContent.includes('changeFrequency')
  )

  check(
    'Sitemap exports 40+ URLs',
    () => {
      // Count URL entries (rough estimate)
      const urlMatches = sitemapContent.match(/url: /g)
      return urlMatches && urlMatches.length >= 40
    },
    'warning'
  )
}

console.log('')
console.log('📊 SCHEMA VALIDATION')
console.log('-'.repeat(50))

const schemaPath = path.join(__dirname, '../lib/seo/schema-generator.ts')
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

  check(
    'Product schema generator exists',
    () => schemaContent.includes('generateProductSchema')
  )

  check(
    'LocalBusiness schema exists',
    () => schemaContent.includes('generateLocalBusinessSchema')
  )

  check(
    'FAQ schema generator exists',
    () => schemaContent.includes('generateFAQSchema')
  )

  check(
    'Breadcrumb schema exists',
    () => schemaContent.includes('generateBreadcrumbSchema')
  )

  check(
    'Service schema exists',
    () => schemaContent.includes('generateServiceSchema')
  )

  check(
    'Schema uses @context',
    () => schemaContent.includes('@context')
  )

  check(
    'Schema uses @type',
    () => schemaContent.includes('@type')
  )
}

console.log('')
console.log('❓ FAQ CONTENT VALIDATION')
console.log('-'.repeat(50))

const faqPath = path.join(__dirname, '../lib/seo/faq-schema-data.ts')
if (fs.existsSync(faqPath)) {
  const faqContent = fs.readFileSync(faqPath, 'utf-8')

  check(
    'General FAQ exists',
    () => faqContent.includes('GENERAL_FAQ')
  )

  check(
    'Barn door FAQ exists',
    () => faqContent.includes('BARN_DOOR_FAQ')
  )

  check(
    'Bypass door FAQ exists',
    () => faqContent.includes('BYPASS_DOOR_FAQ')
  )

  check(
    'Installation FAQ exists',
    () => faqContent.includes('INSTALLATION_FAQ')
  )

  check(
    'Location-specific FAQ exists',
    () => faqContent.includes('KANATA_FAQ')
  )

  check(
    'FAQ has 8+ general questions',
    () => {
      const matches = faqContent.match(/question:/g)
      return matches && matches.length >= 8
    }
  )
}

console.log('')
console.log('🏢 BUSINESS CONFIG VALIDATION')
console.log('-'.repeat(50))

const configPath = path.join(__dirname, '../lib/business-config.ts')
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf-8')

  check(
    'Business name defined',
    () => configContent.includes('name:') && configContent.includes('PG Closets')
  )

  check(
    'Email defined',
    () => configContent.includes('email:')
  )

  check(
    'Address defined',
    () => configContent.includes('address:') && configContent.includes('Ottawa')
  )

  check(
    'Coordinates defined',
    () => configContent.includes('coordinates:') && configContent.includes('latitude')
  )

  check(
    'Service areas defined',
    () => configContent.includes('serviceAreas:') && configContent.includes('Kanata')
  )

  check(
    'URLs defined',
    () => configContent.includes('urls:') && configContent.includes('pgclosets.com')
  )

  check(
    'Schema helpers exported',
    () => configContent.includes('getSchemaAddress') && configContent.includes('getSchemaGeo')
  )
}

console.log('')
console.log('🎨 COMPONENT VALIDATION')
console.log('-'.repeat(50))

const dashboardPath = path.join(__dirname, '../components/seo/SEODashboard.tsx')
if (fs.existsSync(dashboardPath)) {
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8')

  check(
    'SEO Dashboard is client component',
    () => dashboardContent.includes('"use client"')
  )

  check(
    'Dashboard checks meta tags',
    () => dashboardContent.includes('metaTagsComplete')
  )

  check(
    'Dashboard checks schema',
    () => dashboardContent.includes('schemaValid')
  )

  check(
    'Dashboard checks canonical',
    () => dashboardContent.includes('canonicalPresent')
  )

  check(
    'Dashboard checks hreflang',
    () => dashboardContent.includes('hreflangPresent')
  )

  check(
    'Dashboard checks images',
    () => dashboardContent.includes('imageAltTags')
  )

  check(
    'Dashboard calculates score',
    () => dashboardContent.includes('setScore')
  )

  check(
    'Dashboard only shows in dev',
    () => dashboardContent.includes('process.env.NODE_ENV')
  )
}

console.log('')
console.log('📝 METADATA HELPERS VALIDATION')
console.log('-'.repeat(50))

const metadataPath = path.join(__dirname, '../lib/seo/metadata-helpers.ts')
if (fs.existsSync(metadataPath)) {
  const metadataContent = fs.readFileSync(metadataPath, 'utf-8')

  check(
    'generatePageMetadata exists',
    () => metadataContent.includes('export function generatePageMetadata')
  )

  check(
    'generateCollectionMetadata exists',
    () => metadataContent.includes('export function generateCollectionMetadata')
  )

  check(
    'generateLocationMetadata exists',
    () => metadataContent.includes('export function generateLocationMetadata')
  )

  check(
    'generateReninLocationMetadata exists',
    () => metadataContent.includes('export function generateReninLocationMetadata')
  )

  check(
    'Includes hreflang support',
    () => metadataContent.includes('hreflang') || metadataContent.includes('languages')
  )

  check(
    'Includes canonical support',
    () => metadataContent.includes('canonical')
  )

  check(
    'Includes OpenGraph support',
    () => metadataContent.includes('openGraph')
  )

  check(
    'Ottawa keywords defined',
    () => metadataContent.includes('OTTAWA_SEO_KEYWORDS')
  )

  check(
    'Metadata validation function exists',
    () => metadataContent.includes('validateMetadata')
  )
}

console.log('')
console.log('=' .repeat(50))
console.log('📊 VALIDATION SUMMARY')
console.log('=' .repeat(50))

console.log(`Total Checks: ${totalChecks}`)
console.log(`✅ Passed: ${passedChecks}`)
console.log(`❌ Failed: ${errors.length}`)
console.log(`⚠️  Warnings: ${warnings.length}`)

const passRate = ((passedChecks / totalChecks) * 100).toFixed(1)
console.log(`Pass Rate: ${passRate}%`)

if (errors.length > 0) {
  console.log('')
  console.log('❌ CRITICAL ERRORS:')
  errors.forEach(error => console.log(`   - ${error}`))
}

if (warnings.length > 0) {
  console.log('')
  console.log('⚠️  WARNINGS:')
  warnings.forEach(warning => console.log(`   - ${warning}`))
}

console.log('')
console.log('=' .repeat(50))

if (errors.length === 0) {
  console.log('✅ SEO VALIDATION PASSED!')
  console.log('')
  console.log('🎉 All critical SEO components are in place.')
  console.log('🚀 Ready for deployment!')
  console.log('')
  console.log('Next steps:')
  console.log('  1. npm run build')
  console.log('  2. Test on staging')
  console.log('  3. Deploy to production')
  console.log('  4. Submit sitemap to Google Search Console')
  console.log('  5. Monitor rankings in GSC')
  console.log('')
  process.exit(0)
} else {
  console.log('❌ SEO VALIDATION FAILED!')
  console.log('')
  console.log(`${errors.length} critical error(s) must be fixed before deployment.`)
  console.log('')
  console.log('Please review the errors above and make necessary fixes.')
  console.log('')
  process.exit(1)
}
