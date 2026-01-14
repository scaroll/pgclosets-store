#!/usr/bin/env node

/**
 * Bundle Analysis Script for PG Closets Store
 *
 * This script analyzes the Next.js bundle and provides insights on:
 * - Bundle size by route
 * - Largest dependencies
 * - Code splitting effectiveness
 * - Performance recommendations
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

function colorLog(color, message) {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`)
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzeNextBuild() {
  colorLog('cyan', '🔍 Analyzing Next.js Bundle...')

  try {
    // Run Next.js build with bundle analyzer
    process.env.ANALYZE = 'true'
    execSync('npm run build', { stdio: 'inherit' })

    // Check if .next directory exists
    const nextDir = path.join(process.cwd(), '.next')
    if (!fs.existsSync(nextDir)) {
      colorLog('red', '❌ .next directory not found. Build may have failed.')
      return
    }

    const buildManifest = path.join(nextDir, 'build-manifest.json')
    if (fs.existsSync(buildManifest)) {
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'))
      analyzeBuildManifest(manifest)
    }

    const serverBuildTrace = path.join(nextDir, 'trace')
    if (fs.existsSync(serverBuildTrace)) {
      analyzeServerBuild(serverBuildTrace)
    }

    colorLog('green', '✅ Bundle analysis complete!')
    colorLog('yellow', '📊 Check the generated bundle analyzer report for detailed insights.')

  } catch (error) {
    colorLog('red', `❌ Bundle analysis failed: ${error.message}`)
  }
}

function analyzeBuildManifest(manifest) {
  colorLog('blue', '\n📦 Build Manifest Analysis:')

  // Analyze pages and their chunks
  const pages = manifest.pages || {}
  const sortedPages = Object.entries(pages).map(([page, chunks]) => ({
    page,
    chunks: Array.isArray(chunks) ? chunks : [],
    chunkCount: Array.isArray(chunks) ? chunks.length : 0
  })).sort((a, b) => b.chunkCount - a.chunkCount)

  console.log('\nPages with most chunks (potential for optimization):')
  sortedPages.slice(0, 10).forEach(({ page, chunkCount }) => {
    const color = chunkCount > 10 ? 'red' : chunkCount > 5 ? 'yellow' : 'green'
    colorLog(color, `  ${page}: ${chunkCount} chunks`)
  })

  // Analyze CSS files
  const cssFiles = manifest.sortedPages?.filter(file => file.endsWith('.css')) || []
  if (cssFiles.length > 0) {
    console.log('\n🎨 CSS Files:')
    cssFiles.forEach(file => {
      colorLog('magenta', `  ${file}`)
    })
  }
}

function analyzeServerBuild(traceDir) {
  colorLog('blue', '\n🖥️  Server Build Analysis:')

  try {
    const files = fs.readdirSync(traceDir, { withFileTypes: true })
    const serverFiles = files.filter(file => file.isFile() && file.name.endsWith('.js'))

    if (serverFiles.length > 0) {
      console.log(`Found ${serverFiles.length} server-side files`)

      // Calculate total size
      let totalSize = 0
      const fileSizes = []

      serverFiles.forEach(file => {
        const filePath = path.join(traceDir, file.name)
        const stats = fs.statSync(filePath)
        totalSize += stats.size
        fileSizes.push({
          name: file.name,
          size: stats.size
        })
      })

      colorLog('cyan', `Total server bundle size: ${formatBytes(totalSize)}`)

      // Show largest files
      fileSizes.sort((a, b) => b.size - a.size)
      console.log('\nLargest server files:')
      fileSizes.slice(0, 5).forEach(file => {
        colorLog('white', `  ${file.name}: ${formatBytes(file.size)}`)
      })
    }
  } catch (error) {
    colorLog('yellow', `⚠️  Could not analyze server build: ${error.message}`)
  }
}

function generatePerformanceReport() {
  colorLog('cyan', '\n📈 Performance Recommendations:')

  const recommendations = [
    {
      category: 'Images',
      items: [
        'Use Next.js Image component with proper sizing',
        'Implement lazy loading for below-the-fold images',
        'Use WebP/AVIF formats for better compression',
        'Add proper alt text for accessibility'
      ]
    },
    {
      category: 'Code Splitting',
      items: [
        'Use dynamic imports for large components',
        'Implement route-based code splitting',
        'Split vendor bundles from application code',
        'Use React.lazy() for component-level splitting'
      ]
    },
    {
      category: 'CSS Optimization',
      items: [
        'Purge unused Tailwind CSS classes',
        'Use CSS-in-JS for component-specific styles',
        'Minimize critical CSS for above-the-fold content',
        'Use CSS containment for layout stability'
      ]
    },
    {
      category: 'JavaScript',
      items: [
        'Remove unused dependencies',
        'Use tree shaking for ES modules',
        'Implement proper error boundaries',
        'Optimize third-party scripts loading'
      ]
    },
    {
      category: 'Caching',
      items: [
        'Implement proper cache headers',
        'Use SWR for data fetching and caching',
        'Enable static generation where possible',
        'Use incremental static regeneration'
      ]
    }
  ]

  recommendations.forEach(({ category, items }) => {
    colorLog('yellow', `\n${category}:`)
    items.forEach(item => {
      console.log(`  • ${item}`)
    })
  })
}

function checkDependencies() {
  colorLog('cyan', '\n📋 Dependency Analysis:')

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

    const heavyDependencies = [
      'moment',
      'lodash',
      '@material-ui',
      'antd',
      'bootstrap'
    ]

    const foundHeavy = heavyDependencies.filter(dep =>
      Object.keys(dependencies).some(key => key.includes(dep))
    )

    if (foundHeavy.length > 0) {
      colorLog('yellow', '⚠️  Heavy dependencies detected:')
      foundHeavy.forEach(dep => {
        colorLog('yellow', `  • ${dep} - consider lighter alternatives`)
      })
    } else {
      colorLog('green', '✅ No heavy dependencies detected')
    }

    // Check for unused dependencies (basic check)
    colorLog('blue', '\n📦 Total Dependencies:')
    console.log(`  Production: ${Object.keys(packageJson.dependencies || {}).length}`)
    console.log(`  Development: ${Object.keys(packageJson.devDependencies || {}).length}`)

  } catch (error) {
    colorLog('red', `❌ Could not analyze dependencies: ${error.message}`)
  }
}

function main() {
  colorLog('cyan', '🚀 PG Closets Store - Bundle Analyzer')
  colorLog('cyan', '=====================================\n')

  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    colorLog('red', '❌ package.json not found. Please run this script from the project root.')
    process.exit(1)
  }

  checkDependencies()
  analyzeNextBuild()
  generatePerformanceReport()

  colorLog('green', '\n🎉 Analysis complete!')
  colorLog('cyan', '\nNext steps:')
  console.log('  1. Review the bundle analyzer report (opens in browser)')
  console.log('  2. Implement the performance recommendations')
  console.log('  3. Run lighthouse audit for Core Web Vitals')
  console.log('  4. Test on different devices and network conditions')
}

// Run the analysis
main()