#!/usr/bin/env npx tsx
/**
 * Renin Media Download Script
 *
 * Downloads all product images from Renin.com to local storage
 *
 * Usage:
 *   npx tsx scripts/download-renin-media.ts           # Download missing images
 *   npx tsx scripts/download-renin-media.ts --force   # Re-download all images
 *   npx tsx scripts/download-renin-media.ts --dry-run # Preview without downloading
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

interface ReninProductImage {
  url: string
  altText: string
}

interface ReninProduct {
  id: string
  title: string
  thumbnail: string
  images: ReninProductImage[]
}

interface DownloadResult {
  url: string
  localPath: string
  success: boolean
  error?: string
  skipped?: boolean
}

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'renin-products')
const DATA_PATH = path.join(process.cwd(), 'data', 'transformed-renin-products.json')

/**
 * Extract all unique image URLs from product data
 */
function extractImageUrls(): string[] {
  const rawData = fs.readFileSync(DATA_PATH, 'utf-8')
  const data = JSON.parse(rawData) as { products: ReninProduct[] }

  const urls = new Set<string>()

  for (const product of data.products) {
    // Add thumbnail
    if (product.thumbnail) {
      urls.add(product.thumbnail)
    }

    // Add all product images
    for (const img of product.images) {
      if (img.url) {
        urls.add(img.url)
      }
    }
  }

  return Array.from(urls)
}

/**
 * Generate local filename from URL
 */
function urlToFilename(url: string): string {
  const urlPath = new URL(url).pathname
  const filename = path.basename(urlPath)
  // Clean up filename
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_')
}

/**
 * Check if file already exists locally
 */
function fileExists(localPath: string): boolean {
  return fs.existsSync(localPath)
}

/**
 * Download a single image
 */
function downloadImage(url: string, localPath: string): Promise<DownloadResult> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http

    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          downloadImage(redirectUrl, localPath).then(resolve)
          return
        }
      }

      if (response.statusCode !== 200) {
        resolve({
          url,
          localPath,
          success: false,
          error: `HTTP ${response.statusCode}`,
        })
        return
      }

      const dir = path.dirname(localPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      const fileStream = fs.createWriteStream(localPath)
      response.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        resolve({
          url,
          localPath,
          success: true,
        })
      })

      fileStream.on('error', (err) => {
        fs.unlink(localPath, () => {}) // Delete partial file
        resolve({
          url,
          localPath,
          success: false,
          error: err.message,
        })
      })
    })

    request.on('error', (err) => {
      resolve({
        url,
        localPath,
        success: false,
        error: err.message,
      })
    })

    request.on('timeout', () => {
      request.destroy()
      resolve({
        url,
        localPath,
        success: false,
        error: 'Timeout',
      })
    })
  })
}

/**
 * Download images with concurrency limit
 */
async function downloadWithConcurrency(
  urls: string[],
  concurrency: number,
  force: boolean,
  dryRun: boolean
): Promise<DownloadResult[]> {
  const results: DownloadResult[] = []
  let completed = 0

  const downloadOne = async (url: string): Promise<DownloadResult> => {
    const filename = urlToFilename(url)
    const localPath = path.join(IMAGES_DIR, filename)

    // Check if already exists
    if (!force && fileExists(localPath)) {
      completed++
      process.stdout.write(`\r⏭️  Skipped: ${completed}/${urls.length} (${filename} exists)`)
      return { url, localPath, success: true, skipped: true }
    }

    if (dryRun) {
      completed++
      process.stdout.write(`\r📋 Would download: ${completed}/${urls.length}`)
      return { url, localPath, success: true, skipped: true }
    }

    const result = await downloadImage(url, localPath)
    completed++

    if (result.success) {
      process.stdout.write(`\r✅ Downloaded: ${completed}/${urls.length}`)
    } else {
      process.stdout.write(`\r❌ Failed: ${completed}/${urls.length} (${result.error})`)
    }

    return result
  }

  // Process in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(downloadOne))
    results.push(...batchResults)
  }

  console.log('') // New line after progress
  return results
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const dryRun = args.includes('--dry-run')

  console.log('🖼️  Renin Media Download')
  console.log('=======================')
  console.log('')

  // Extract all image URLs
  console.log('📋 Extracting image URLs from product data...')
  const urls = extractImageUrls()
  console.log(`   Found ${urls.length} unique images`)
  console.log('')

  // Ensure directory exists
  if (!dryRun && !fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
    console.log(`📁 Created directory: ${IMAGES_DIR}`)
  }

  // Check existing files
  let existingCount = 0
  if (fs.existsSync(IMAGES_DIR)) {
    existingCount = fs.readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).length
  }
  console.log(`📊 Existing images in directory: ${existingCount}`)
  console.log('')

  if (dryRun) {
    console.log('📋 DRY RUN MODE - No files will be downloaded')
    console.log('')
    console.log('First 10 images that would be downloaded:')
    urls.slice(0, 10).forEach((url, i) => {
      const filename = urlToFilename(url)
      const exists = fileExists(path.join(IMAGES_DIR, filename))
      console.log(`  ${i + 1}. ${filename} ${exists ? '(exists)' : '(new)'}`)
    })
    if (urls.length > 10) {
      console.log(`  ... and ${urls.length - 10} more`)
    }
    return
  }

  console.log(`⏳ Downloading ${urls.length} images (concurrency: 5)...`)
  console.log(`   Options: force=${force}`)
  console.log('')

  const results = await downloadWithConcurrency(urls, 5, force, dryRun)

  // Summary
  const successful = results.filter(r => r.success && !r.skipped).length
  const skipped = results.filter(r => r.skipped).length
  const failed = results.filter(r => !r.success).length

  console.log('')
  console.log('📊 Summary:')
  console.log(`   ✅ Downloaded: ${successful}`)
  console.log(`   ⏭️  Skipped (existing): ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)

  if (failed > 0) {
    console.log('')
    console.log('Failed downloads:')
    results.filter(r => !r.success).slice(0, 10).forEach(r => {
      console.log(`   - ${urlToFilename(r.url)}: ${r.error}`)
    })
    if (failed > 10) {
      console.log(`   ... and ${failed - 10} more`)
    }
  }

  // Update media inventory
  const inventoryPath = path.join(process.cwd(), 'data', 'renin-media-inventory.json')
  const inventory = {
    lastUpdated: new Date().toISOString(),
    totalImages: urls.length,
    downloaded: successful + skipped,
    failed,
    directory: IMAGES_DIR,
    files: results.filter(r => r.success).map(r => ({
      url: r.url,
      localPath: r.localPath,
      filename: path.basename(r.localPath),
    })),
  }
  fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2))
  console.log('')
  console.log(`📝 Updated inventory: ${inventoryPath}`)
}

main().catch(console.error)
