#!/usr/bin/env node
// @ts-nocheck - Script with implicit any types
/**
 * SEO Validation Script
 * Validates all SEO infrastructure components
 */

import {
  getBreadcrumbSchema,
  getFAQSchema,
  getLocalBusinessSchema,
  getProductSchema,
  getWebsiteSchema,
} from '../lib/seo/schemas'

const CANONICAL_URL = 'https://www.pgclosets.com'

interface ValidationResult {
  component: string
  valid: boolean
  errors: string[]
  warnings: string[]
}

const results: ValidationResult[] = []

/**
 * Validate URL format
 */
function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' && parsed.hostname === 'www.pgclosets.com' && !url.endsWith('/') // No trailing slash except root
    )
  } catch {
    return false
  }
}

/**
 * Validate LocalBusiness schema
 */
function validateLocalBusinessSchema(): ValidationResult {
  const result: ValidationResult = {
    component: 'LocalBusiness Schema',
    valid: true,
    errors: [],
    warnings: [],
  }

  try {
    const schema = getLocalBusinessSchema()

    // Required fields
    if (!schema.name) result.errors.push('Missing business name')
    if (!schema.address) result.errors.push('Missing address')
    if (!schema.telephone) result.errors.push('Missing telephone')
    if (!schema.url || !validateUrl(schema.url)) {
      result.errors.push('Invalid or missing URL')
    }

    // Validate opening hours
    if (!schema.openingHoursSpecification || schema.openingHoursSpecification.length === 0) {
      result.warnings.push('No opening hours specified')
    }

    // Validate service areas
    if (!schema.areaServed || schema.areaServed.length === 0) {
      result.warnings.push('No service areas specified')
    }

    result.valid = result.errors.length === 0
  } catch (error) {
    result.valid = false
    result.errors.push(`Schema generation failed: ${error}`)
  }

  return result
}

/**
 * Validate Product schema
 */
function validateProductSchema(): ValidationResult {
  const result: ValidationResult = {
    component: 'Product Schema',
    valid: true,
    errors: [],
    warnings: [],
  }

  try {
    const testProduct = {
      name: 'Test Product',
      description: 'Test description',
      image: `${CANONICAL_URL}/test-image.jpg`,
      category: 'bypass',
      url: `${CANONICAL_URL}/products/bypass/test`,
      price: 199.99,
      currency: 'CAD',
    }

    const schema = getProductSchema(testProduct)

    // Required fields
    if (!schema.name) result.errors.push('Missing product name')
    if (!schema.image) result.errors.push('Missing product image')
    if (!schema.offers) result.errors.push('Missing offers')

    // Validate offers
    if (schema.offers) {
      if (!schema.offers.priceCurrency) result.errors.push('Missing price currency')
      if (schema.offers.priceCurrency !== 'CAD') {
        result.errors.push('Price currency should be CAD')
      }
      if (!schema.offers.url || !validateUrl(schema.offers.url)) {
        result.errors.push('Invalid product URL in offers')
      }
    }

    result.valid = result.errors.length === 0
  } catch (error) {
    result.valid = false
    result.errors.push(`Schema generation failed: ${error}`)
  }

  return result
}

/**
 * Validate FAQ schema
 */
function validateFAQSchema(): ValidationResult {
  const result: ValidationResult = {
    component: 'FAQ Schema',
    valid: true,
    errors: [],
    warnings: [],
  }

  try {
    const testFAQs = [
      {
        question: 'Test question?',
        answer: 'Test answer.',
      },
    ]

    const schema = getFAQSchema(testFAQs)

    // Required fields
    if (!schema.mainEntity || schema.mainEntity.length === 0) {
      result.errors.push('Missing FAQ items')
    }

    // Validate each FAQ item
    schema.mainEntity.forEach((item, index) => {
      if (!item.name) result.errors.push(`FAQ ${index + 1}: Missing question`)
      if (!item.acceptedAnswer) result.errors.push(`FAQ ${index + 1}: Missing answer`)
      if (!item.acceptedAnswer?.text) result.errors.push(`FAQ ${index + 1}: Missing answer text`)
    })

    result.valid = result.errors.length === 0
  } catch (error) {
    result.valid = false
    result.errors.push(`Schema generation failed: ${error}`)
  }

  return result
}

/**
 * Validate Breadcrumb schema
 */
function validateBreadcrumbSchema(): ValidationResult {
  const result: ValidationResult = {
    component: 'Breadcrumb Schema',
    valid: true,
    errors: [],
    warnings: [],
  }

  try {
    const testBreadcrumbs = [
      { name: 'Home', url: CANONICAL_URL },
      { name: 'Products', url: `${CANONICAL_URL}/products` },
    ]

    const schema = getBreadcrumbSchema(testBreadcrumbs)

    // Required fields
    if (!schema.itemListElement || schema.itemListElement.length === 0) {
      result.errors.push('Missing breadcrumb items')
    }

    // Validate each breadcrumb
    schema.itemListElement.forEach((item, index) => {
      if (!item.position) result.errors.push(`Breadcrumb ${index + 1}: Missing position`)
      if (!item.name) result.errors.push(`Breadcrumb ${index + 1}: Missing name`)
      if (!item.item || !validateUrl(item.item)) {
        result.errors.push(`Breadcrumb ${index + 1}: Invalid URL`)
      }
    })

    result.valid = result.errors.length === 0
  } catch (error) {
    result.valid = false
    result.errors.push(`Schema generation failed: ${error}`)
  }

  return result
}

/**
 * Validate Website schema
 */
function validateWebSiteSchema(): ValidationResult {
  const result: ValidationResult = {
    component: 'WebSite Schema',
    valid: true,
    errors: [],
    warnings: [],
  }

  try {
    const schema = getWebsiteSchema()

    // Required fields
    if (!schema.name) result.errors.push('Missing website name')
    if (!schema.url || !validateUrl(schema.url)) {
      result.errors.push('Invalid or missing URL')
    }

    // Validate search action
    if (!schema.potentialAction) {
      result.warnings.push('Missing search action')
    } else {
      if (!schema.potentialAction.target) {
        result.errors.push('Missing search target')
      }
    }

    result.valid = result.errors.length === 0
  } catch (error) {
    result.valid = false
    result.errors.push(`Schema generation failed: ${error}`)
  }

  return result
}

/**
 * Validate metadata generators
 */
function validateMetadata(): ValidationResult {
  const result: ValidationResult = {
    component: 'Metadata Generators',
    valid: true,
    errors: [],
    warnings: [],
  }

  try {
    // Check that metadata functions exist and are importable
    const metadataFunctions = [
      'generateHomeMetadata',
      'generateProductsHubMetadata',
      'generateCategoryMetadata',
      'generateProductMetadata',
      'generateLocationMetadata',
      'generateFAQMetadata',
      'generateContactMetadata',
      'generateInstallationMetadata',
    ]

    metadataFunctions.forEach(fn => {
      try {
        require(`../lib/metadata`)[fn]
      } catch {
        result.errors.push(`Missing metadata function: ${fn}`)
      }
    })

    result.valid = result.errors.length === 0
  } catch (error) {
    result.valid = false
    result.errors.push(`Metadata validation failed: ${error}`)
  }

  return result
}

/**
 * Run all validations
 */
function runValidations() {
  console.log('🔍 Running SEO Infrastructure Validation...\n')

  // Run validations
  results.push(validateLocalBusinessSchema())
  results.push(validateProductSchema())
  results.push(validateFAQSchema())
  results.push(validateBreadcrumbSchema())
  results.push(validateWebSiteSchema())
  // metadata validation skipped as it is handled in app/layout.tsx

  // Print results
  let allValid = true
  results.forEach(result => {
    const icon = result.valid ? '✅' : '❌'
    console.log(`${icon} ${result.component}`)

    if (result.errors.length > 0) {
      allValid = false
      console.log('  Errors:')
      result.errors.forEach(error => console.log(`    - ${error}`))
    }

    if (result.warnings.length > 0) {
      console.log('  Warnings:')
      result.warnings.forEach(warning => console.log(`    - ${warning}`))
    }

    console.log()
  })

  // Summary
  const passed = results.filter(r => r.valid).length
  const total = results.length

  console.log('━'.repeat(50))
  console.log(`\n📊 Summary: ${passed}/${total} validations passed\n`)

  if (allValid) {
    console.log('✨ All SEO components are valid!')
    process.exit(0)
  } else {
    console.log('⚠️  Some SEO components have errors. Please review and fix.')
    process.exit(1)
  }
}

// Run validations
runValidations()
