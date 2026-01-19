const { chromium } = require('playwright')

async function runAccessibilityAudit() {
  console.log('🔍 Starting Comprehensive Accessibility Audit for PG Closets\n')

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const context = await browser.newContext()
  const page = await context.newPage()

  // Test URLs
  const urls = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About Page' },
    { path: '/contact', name: 'Contact Page' },
    { path: '/products', name: 'Products Page' },
  ]

  const results = {
    passed: [],
    warnings: [],
    errors: [],
    mobileIssues: [],
    accessibilityViolations: [],
  }

  for (const { path, name } of urls) {
    try {
      console.log(`\n📱 Testing ${name}: http://localhost:3004${path}`)

      await page.goto(`http://localhost:3004${path}`, {
        waitUntil: 'networkidle',
        timeout: 15000,
      })

      await page.waitForTimeout(2000)

      // 1. Manual Accessibility Testing (without axe-core)
      console.log('  • Running accessibility checks...')

      const accessibilityChecks = await page.evaluate(() => {
        const issues = []

        // Check for missing alt text
        const images = document.querySelectorAll('img')
        images.forEach((img, index) => {
          if (!img.alt && img.src) {
            issues.push({
              type: 'missing-alt',
              element: 'img',
              src: img.src.substring(0, 50),
              index: index,
            })
          }
        })

        // Check for proper heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        let lastLevel = 0
        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName.substring(1))
          if (lastLevel > 0 && level > lastLevel + 1) {
            issues.push({
              type: 'heading-skip',
              element: heading.tagName,
              text: heading.textContent.substring(0, 30),
              index: index,
            })
          }
          lastLevel = level
        })

        // Check for form labels
        const inputs = document.querySelectorAll('input, textarea, select')
        inputs.forEach((input, index) => {
          const hasLabel =
            document.querySelector(`label[for="${input.id}"]`) ||
            input.getAttribute('aria-label') ||
            input.getAttribute('aria-labelledby') ||
            input.closest('label')
          if (!hasLabel && input.type !== 'hidden') {
            issues.push({
              type: 'missing-label',
              element: input.tagName,
              type: input.type || 'text',
              index: index,
            })
          }
        })

        // Check for buttons without accessible names
        const buttons = document.querySelectorAll('button')
        buttons.forEach((button, index) => {
          const hasName =
            button.textContent.trim() ||
            button.getAttribute('aria-label') ||
            button.getAttribute('aria-labelledby') ||
            button.getAttribute('title')
          if (!hasName) {
            issues.push({
              type: 'button-no-name',
              element: 'button',
              index: index,
            })
          }
        })

        // Check for proper landmark elements
        const hasMain = document.querySelector('main, [role="main"]')
        const hasNav = document.querySelector('nav, [role="navigation"]')
        const hasHeader = document.querySelector('header, [role="banner"]')
        const hasFooter = document.querySelector('footer, [role="contentinfo"]')

        if (!hasMain) {
          issues.push({
            type: 'missing-landmark',
            element: 'main',
            desc: 'Missing main landmark',
          })
        }
        if (!hasNav) {
          issues.push({
            type: 'missing-landmark',
            element: 'nav',
            desc: 'Missing navigation landmark',
          })
        }

        return issues
      })

      if (accessibilityChecks.length > 0) {
        console.log(`  ⚠️  Found ${accessibilityChecks.length} accessibility issues`)
        results.accessibilityViolations.push({
          page: name,
          violations: accessibilityChecks,
        })
      } else {
        console.log('  ✅ No accessibility violations found')
        results.passed.push(`${name}: Basic accessibility compliance`)
      }

      // 2. Mobile Responsiveness Tests
      const viewports = [
        { name: 'Mobile (iPhone SE)', width: 375, height: 667 },
        { name: 'Mobile (iPhone 12)', width: 390, height: 844 },
        { name: 'Tablet (iPad)', width: 768, height: 1024 },
      ]

      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.waitForTimeout(1000)

        // Check for horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          const body = document.body
          const html = document.documentElement
          return body.scrollWidth > window.innerWidth || html.scrollWidth > window.innerWidth
        })

        if (hasHorizontalScroll) {
          results.mobileIssues.push({
            page: name,
            viewport: viewport.name,
            issue: 'Horizontal scroll detected',
            severity: 'high',
          })
          console.log(`    ⚠️  ${viewport.name}: Horizontal scroll detected`)
        }

        // Check touch target sizes (WCAG 2.1 AA: 44x44px minimum)
        const smallTouchTargets = await page.evaluate(() => {
          const interactiveElements = document.querySelectorAll(
            'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])'
          )
          const smallTargets = []

          interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect()
            const computedStyle = window.getComputedStyle(element)

            // Skip hidden elements
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
              return
            }

            const width = Math.round(rect.width)
            const height = Math.round(rect.height)

            if (width < 44 || height < 44) {
              smallTargets.push({
                tag: element.tagName,
                selector: generateSelector(element),
                text: element.textContent?.substring(0, 30),
                width,
                height,
                type: element.type || 'N/A',
              })
            }
          })

          return smallTargets

          function generateSelector(element) {
            if (element.id) return `#${element.id}`
            if (element.className) return `.${element.className.split(' ').join('.')}`
            return element.tagName.toLowerCase()
          }
        })

        if (smallTouchTargets.length > 0) {
          results.mobileIssues.push({
            page: name,
            viewport: viewport.name,
            issue: 'Small touch targets',
            targets: smallTouchTargets.slice(0, 5), // Limit to first 5
            severity: 'medium',
          })
          console.log(`    ⚠️  ${viewport.name}: ${smallTouchTargets.length} small touch targets`)
        }

        // Check font sizes on mobile
        const smallFonts = await page.evaluate(() => {
          const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, span, a, button'
          )
          const smallTextElements = []

          textElements.forEach(element => {
            const style = window.getComputedStyle(element)
            const fontSize = parseFloat(style.fontSize)

            if (fontSize < 16 && element.textContent.trim().length > 0) {
              smallTextElements.push({
                tag: element.tagName,
                text: element.textContent.substring(0, 30),
                fontSize: `${fontSize}px`,
              })
            }
          })

          return smallTextElements
        })

        if (smallFonts.length > 0) {
          results.mobileIssues.push({
            page: name,
            viewport: viewport.name,
            issue: 'Font size below 16px',
            elements: smallFonts.slice(0, 3),
            severity: 'low',
          })
        }
      }

      // 3. Keyboard Navigation Test
      console.log('  • Testing keyboard navigation...')
      await page.keyboard.press('Tab')
      await page.waitForTimeout(500)

      const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement
        if (focused) {
          const style = window.getComputedStyle(focused)
          return {
            tag: focused.tagName,
            hasFocusStyle:
              style.outline !== 'none' ||
              style.boxShadow !== 'none' ||
              style.border.includes('2px') ||
              style.border.includes('3px'),
            tabIndex: focused.tabIndex,
          }
        }
        return null
      })

      if (focusedElement && !focusedElement.hasFocusStyle) {
        results.warnings.push({
          page: name,
          issue: 'Keyboard focus may not be visible',
          element: focusedElement.tag,
        })
      }

      // 4. Color Contrast Check
      console.log('  • Checking color contrast...')
      const contrastIssues = await page.evaluate(() => {
        const elements = document.querySelectorAll('*')
        const issues = []

        elements.forEach(element => {
          const style = window.getComputedStyle(element)
          const color = style.color
          const backgroundColor = style.backgroundColor

          if (
            color &&
            backgroundColor &&
            color !== 'rgba(0, 0, 0, 0)' &&
            backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            element.textContent.trim().length > 0
          ) {
            // This is a simplified check - real contrast calculation would require color parsing
            if (color === backgroundColor) {
              issues.push({
                element: element.tagName,
                text: element.textContent.substring(0, 30),
                issue: 'Text and background colors are the same',
              })
            }
          }
        })

        return issues
      })

      if (contrastIssues.length > 0) {
        results.errors.push({
          page: name,
          issue: 'Color contrast problems',
          details: contrastIssues,
        })
      }

      // 5. Alt Text Check for Images
      const imageIssues = await page.evaluate(() => {
        const images = document.querySelectorAll('img')
        const missingAlts = []
        const decorativeWithoutAlt = []

        images.forEach(img => {
          if (!img.alt && img.src) {
            missingAlts.push({
              src: img.src.substring(0, 50),
              role: img.role || 'img',
            })
          }

          if (img.alt === '' && img.role !== 'presentation') {
            decorativeWithoutAlt.push({
              src: img.src.substring(0, 50),
              needsRole: true,
            })
          }
        })

        return { missingAlts, decorativeWithoutAlt }
      })

      if (imageIssues.missingAlts.length > 0) {
        results.errors.push({
          page: name,
          issue: 'Missing alt text on images',
          count: imageIssues.missingAlts.length,
          details: imageIssues.missingAlts,
        })
      }

      console.log(`  ✅ Completed ${name} audit`)
    } catch (error) {
      console.error(`  ❌ Error auditing ${name}:`, error.message)
      results.errors.push({
        page: name,
        issue: 'Audit failed',
        error: error.message,
      })
    }
  }

  await browser.close()

  // Generate Report
  console.log('\n\n📊 ACCESSIBILITY AUDIT REPORT')
  console.log('='.repeat(50))

  console.log('\n✅ PASSES:')
  if (results.passed.length > 0) {
    results.passed.forEach(pass => console.log(`  • ${pass}`))
  } else {
    console.log('  No critical passes found')
  }

  console.log('\n⚠️  WARNINGS:')
  if (results.warnings.length > 0) {
    results.warnings.forEach(warning => {
      console.log(`  • ${warning.page}: ${warning.issue}`)
    })
  } else {
    console.log('  No warnings')
  }

  console.log('\n🚨 ERRORS:')
  if (results.errors.length > 0) {
    results.errors.forEach(error => {
      console.log(`  • ${error.page}: ${error.issue}`)
      if (error.details) {
        console.log(`    Details: ${JSON.stringify(error.details, null, 6)}`)
      }
    })
  } else {
    console.log('  No critical errors')
  }

  console.log('\n📱 MOBILE RESPONSIVENESS ISSUES:')
  if (results.mobileIssues.length > 0) {
    const groupedIssues = {}
    results.mobileIssues.forEach(issue => {
      const key = `${issue.issue} (${issue.viewport})`
      if (!groupedIssues[key]) {
        groupedIssues[key] = []
      }
      groupedIssues[key].push(issue.page)
    })

    Object.entries(groupedIssues).forEach(([issue, pages]) => {
      console.log(`  • ${issue}: ${pages.join(', ')}`)
    })
  } else {
    console.log('  No mobile responsiveness issues detected')
  }

  console.log('\n♿ ACCESSIBILITY VIOLATIONS (AXE Core):')
  if (results.accessibilityViolations.length > 0) {
    results.accessibilityViolations.forEach(pageResult => {
      console.log(`\n  ${pageResult.page}:`)
      pageResult.violations.forEach((violation, index) => {
        console.log(
          `    ${index + 1}. ${(violation.impact || 'UNKNOWN').toUpperCase()} - ${violation.help}`
        )
        console.log(`       ${violation.description}`)
        if (violation.nodes && violation.nodes.length > 0) {
          console.log(`       Affected elements: ${violation.nodes.length}`)
        }
      })
    })
  } else {
    console.log('  No accessibility violations detected')
  }

  // Priority Fixes
  console.log('\n\n🎯 PRIORITY FIXES RECOMMENDED:')
  console.log('='.repeat(50))

  const priorityFixes = []

  // Collect high priority fixes
  results.errors.forEach(error => {
    priorityFixes.push({
      priority: 'HIGH',
      page: error.page,
      issue: error.issue,
      fix: getFixRecommendation(error.issue),
    })
  })

  results.accessibilityViolations.forEach(pageResult => {
    pageResult.violations.forEach(violation => {
      const priority = getPriorityForViolation(violation.type)
      if (priority === 'HIGH' || priority === 'MEDIUM') {
        priorityFixes.push({
          priority: priority,
          page: pageResult.page,
          issue: getViolationDescription(violation),
          fix: getViolationFix(violation.type),
        })
      }
    })
  })

  results.mobileIssues.forEach(issue => {
    if (issue.severity === 'high') {
      priorityFixes.push({
        priority: 'HIGH',
        page: issue.page,
        issue: issue.issue,
        fix: 'Fix horizontal scroll by adjusting responsive design or using proper media queries',
      })
    } else if (issue.severity === 'medium') {
      priorityFixes.push({
        priority: 'MEDIUM',
        page: issue.page,
        issue: issue.issue,
        fix: 'Increase touch target size to minimum 44x44px',
      })
    }
  })

  // Sort by priority
  priorityFixes.sort((a, b) => {
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999)
  })

  priorityFixes.slice(0, 10).forEach((fix, index) => {
    console.log(`\n${index + 1}. [${fix.priority}] ${fix.page}`)
    console.log(`   Issue: ${fix.issue}`)
    console.log(`   Fix: ${fix.fix}`)
  })

  return results
}

function getFixRecommendation(issue) {
  const fixes = {
    'Missing alt text on images':
      'Add descriptive alt text to all meaningful images. Use alt="" for decorative images with role="presentation"',
    'Color contrast problems':
      'Ensure text has sufficient color contrast (4.5:1 for normal text, 3:1 for large text)',
    'Audit failed': 'Fix page loading errors and re-run audit',
  }
  return fixes[issue] || 'Review and fix the identified issue'
}

function getPriorityForViolation(type) {
  const priorities = {
    'missing-alt': 'HIGH',
    'missing-label': 'HIGH',
    'button-no-name': 'HIGH',
    'missing-landmark': 'MEDIUM',
    'heading-skip': 'LOW',
  }
  return priorities[type] || 'MEDIUM'
}

function getViolationDescription(violation) {
  const descriptions = {
    'missing-alt': `Missing alt text on image (${violation.src}...)`,
    'missing-label': `Form input missing label (${violation.type})`,
    'button-no-name': 'Button without accessible name',
    'missing-landmark': `Missing landmark: ${violation.desc}`,
    'heading-skip': `Heading level skipped: ${violation.element} after previous heading`,
  }
  return descriptions[violation.type] || `Accessibility issue: ${violation.type}`
}

function getViolationFix(type) {
  const fixes = {
    'missing-alt': 'Add descriptive alt text to images. Use alt="" for decorative images',
    'missing-label': 'Add proper labels to form inputs using <label> tags or aria-label',
    'button-no-name': 'Add text content or aria-label to buttons',
    'missing-landmark': 'Add appropriate landmark elements (main, nav, header, footer)',
    'heading-skip': 'Use proper heading hierarchy without skipping levels',
  }
  return fixes[type] || 'Review accessibility guidelines for this issue'
}

// Run the audit
runAccessibilityAudit().catch(console.error)
