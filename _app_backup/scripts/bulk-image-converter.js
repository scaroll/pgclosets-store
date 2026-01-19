#!/usr/bin/env node

/**
 * Bulk Image Converter for Next.js
 * Automatically converts <img> tags to Next.js <Image> components
 */

const fs = require('fs')
const path = require('path')

console.log('🔄 Starting bulk image conversion...\n')

function convertImageTags(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  let modified = false
  
  // Check if Image component is already imported
  const hasImageImport = content.includes('import Image from "next/image"') || 
                        content.includes('import { Image }')
  
  // Find all img tags
  const imgMatches = content.match(/<img[^>]*>/g)
  
  if (!imgMatches) {
    return false // No img tags found
  }
  
  console.log(`📷 Converting ${imgMatches.length} images in ${filePath}`)
  
  let newContent = content
  
  // Add Image import if not present
  if (!hasImageImport) {
    // Find the first import statement
    const importMatch = newContent.match(/^import\s+.*$/m)
    if (importMatch) {
      newContent = newContent.replace(importMatch[0], `import Image from "next/image"\n${importMatch[0]}`)
      modified = true
    } else {
      // Add at the beginning of the file (after "use client" if present)
      if (newContent.startsWith('"use client"')) {
        newContent = newContent.replace('"use client"', '"use client"\n\nimport Image from "next/image"')
      } else {
        newContent = `import Image from "next/image"\n${newContent}`
      }
      modified = true
    }
  }
  
  // Convert each img tag
  imgMatches.forEach(imgTag => {
    // Extract attributes from img tag
    const srcMatch = imgTag.match(/src=["']([^"']*)["']/)
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/)
    const classMatch = imgTag.match(/className=["']([^"']*)["']/)
    
    if (!srcMatch) return // Skip if no src
    
    const src = srcMatch[1]
    const alt = altMatch ? altMatch[1] : ''
    const className = classMatch ? classMatch[1] : ''
    
    // Determine if this should be priority (likely above fold)
    const isPriority = imgTag.includes('hero') || 
                      imgTag.includes('banner') || 
                      imgTag.includes('loading="eager"') ||
                      className.includes('hero')
    
    // Create Next.js Image component
    const imageComponent = `<Image
      src={${JSON.stringify(src)}}
      alt={${JSON.stringify(alt)}}
      fill
      className={${JSON.stringify(className.replace(/w-full|h-full/, '').trim() || 'object-cover')}}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      ${isPriority ? 'priority={true}' : 'loading="lazy"'}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAABBQEBAQEBAQAAAAAAAAAEAQIDBQAGByETIv/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEQMSkf/aAAwDAQACEQMRAD8A0+yeuwiG+4lk5Y3N5YhZFpnelduG0cR7w3Pz0SudECH/2Q=="
    />`
    
    // Replace the img tag and ensure parent div has 'relative' class
    let replacement = imgTag.replace(/^<img/, imageComponent)
    
    // Check if parent div needs 'relative' class
    const imgIndex = newContent.indexOf(imgTag)
    const beforeImg = newContent.substring(0, imgIndex)
    const divMatch = beforeImg.match(/<div[^>]*>(?!.*<\/div>).*$/)
    
    if (divMatch) {
      const divTag = divMatch[0]
      const hasRelative = divTag.includes('relative')
      
      if (!hasRelative) {
        const newDivTag = divTag.replace(/className=["']([^"']*)["']/, (match, classes) => {
          return `className="${classes} relative"`
        }) || divTag.replace('<div', '<div className="relative"')
        
        newContent = newContent.replace(divTag, newDivTag)
      }
    }
    
    newContent = newContent.replace(imgTag, imageComponent)
    modified = true
  })
  
  if (modified) {
    fs.writeFileSync(filePath, newContent)
    return true
  }
  
  return false
}

function processDirectory(directory) {
  let totalConverted = 0
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath)
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        if (convertImageTags(filePath)) {
          totalConverted++
        }
      }
    }
  }
  
  scanDirectory(directory)
  return totalConverted
}

// Process main directories
const appConverted = processDirectory('./app')
const componentsConverted = processDirectory('./components')

const totalConverted = appConverted + componentsConverted

console.log(`\n✅ Conversion complete!`)
console.log(`📊 Files converted: ${totalConverted}`)
console.log(`\n💡 Next steps:`)
console.log(`• Review converted files for any layout issues`)
console.log(`• Test image loading and performance`)
console.log(`• Adjust sizes prop based on actual layout needs`)
console.log(`• Run build to ensure no TypeScript/import errors`)

process.exit(0)