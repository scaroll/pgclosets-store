const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class ImageAuditAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      url: 'https://www.pgclosets.com',
      summary: {
        totalImages: 0,
        brokenImages: 0,
        missingAltText: 0,
        slowLoadingImages: 0,
        httpErrors: 0,
        consoleErrors: []
      },
      issues: [],
      recommendations: [],
      performanceMetrics: {},
      accessibilityIssues: []
    };
    this.consoleMessages = [];
  }

  async analyzeSite() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Setup console monitoring
    this.setupConsoleMonitoring(page);
    
    // Setup network monitoring for image requests
    const imageRequests = [];
    page.on('response', async (response) => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      if (contentType.includes('image/') || this.isImageUrl(url)) {
        const status = response.status();
        const loadTime = Date.now() - response.request().timing().requestStart;
        
        imageRequests.push({
          url,
          status,
          loadTime,
          contentType,
          size: response.headers()['content-length'] || 'unknown'
        });
        
        if (status >= 400) {
          this.results.issues.push({
            type: 'HTTP_ERROR',
            severity: 'HIGH',
            url,
            status,
            message: `Image returned HTTP ${status} error`
          });
          this.results.summary.httpErrors++;
        }
      }
    });

    try {
      console.log('🌐 Loading PG Closets website...');
      await page.goto('https://www.pgclosets.com', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      console.log('⏱️  Waiting for page to fully load...');
      await page.waitForTimeout(3000);
      
      // Analyze all images on the page
      await this.analyzeImages(page);
      
      // Check Next.js image optimization
      await this.checkNextJsImageOptimization(page);
      
      // Test image loading performance
      await this.testImagePerformance(page, imageRequests);
      
      // Check for lazy loading
      await this.checkLazyLoading(page);
      
      // Scroll through page to trigger lazy loading
      await this.scrollThroughPage(page);
      
      // Re-analyze after scrolling
      await this.analyzeImages(page, 'after-scroll');
      
      // Generate final report
      this.generateRecommendations();
      
    } catch (error) {
      console.error('Error during analysis:', error);
      this.results.issues.push({
        type: 'SCRIPT_ERROR',
        severity: 'HIGH',
        message: `Analysis script error: ${error.message}`
      });
    } finally {
      await browser.close();
    }
    
    return this.results;
  }

  setupConsoleMonitoring(page) {
    page.on('console', (msg) => {
      const text = msg.text();
      this.consoleMessages.push({
        type: msg.type(),
        text,
        timestamp: new Date().toISOString()
      });
      
      if (text.includes('Failed to load resource') || 
          text.includes('404') || 
          text.includes('image') ||
          text.includes('Image') ||
          msg.type() === 'error') {
        this.results.summary.consoleErrors.push({
          type: msg.type(),
          message: text,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  async analyzeImages(page, phase = 'initial') {
    console.log(`🔍 Analyzing images (${phase})...`);
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((img, index) => ({
        index,
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.offsetWidth,
        displayHeight: img.offsetHeight,
        loading: img.loading,
        className: img.className,
        complete: img.complete,
        crossOrigin: img.crossOrigin,
        sizes: img.sizes,
        srcset: img.srcset,
        hasDataSrc: !!img.dataset.src,
        isNextJsImage: img.className.includes('next-image') || img.tagName === 'IMAGE',
        isVisible: img.offsetWidth > 0 && img.offsetHeight > 0,
        rect: img.getBoundingClientRect()
      }));
    });
    
    if (phase === 'initial') {
      this.results.summary.totalImages = images.length;
    }
    
    console.log(`Found ${images.length} images`);
    
    for (const img of images) {
      // Check for broken images
      if (!img.complete || img.naturalWidth === 0) {
        this.results.issues.push({
          type: 'BROKEN_IMAGE',
          severity: 'HIGH',
          url: img.src,
          message: `Image failed to load properly`,
          details: {
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          }
        });
        this.results.summary.brokenImages++;
      }
      
      // Check for missing alt text
      if (!img.alt || img.alt.trim() === '') {
        this.results.accessibilityIssues.push({
          type: 'MISSING_ALT_TEXT',
          severity: 'MEDIUM',
          url: img.src,
          message: 'Image is missing alt text for accessibility'
        });
        this.results.summary.missingAltText++;
      }
      
      // Check for placeholder/fallback images
      if (img.src.includes('placeholder') || 
          img.src.includes('fallback') ||
          img.src.includes('data:image') ||
          img.src.includes('blank.') ||
          img.className.includes('placeholder')) {
        this.results.issues.push({
          type: 'PLACEHOLDER_IMAGE',
          severity: 'MEDIUM',
          url: img.src,
          message: 'Image appears to be a placeholder or fallback'
        });
      }
      
      // Check for Next.js image optimization issues
      if (img.isNextJsImage && !img.sizes) {
        this.results.issues.push({
          type: 'NEXTJS_OPTIMIZATION',
          severity: 'MEDIUM',
          url: img.src,
          message: 'Next.js Image component missing sizes attribute for optimization'
        });
      }
      
      // Check for lazy loading issues
      if (!img.loading && img.rect.top > window.innerHeight) {
        this.results.issues.push({
          type: 'LAZY_LOADING',
          severity: 'LOW',
          url: img.src,
          message: 'Image below fold not using lazy loading'
        });
      }
    }
  }

  async checkNextJsImageOptimization(page) {
    console.log('🖼️  Checking Next.js image optimization...');
    
    const nextImages = await page.evaluate(() => {
      // Check for Next.js Image components
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => 
        img.src.includes('/_next/image') ||
        img.className.includes('next-image') ||
        img.hasAttribute('data-nimg')
      ).map(img => ({
        src: img.src,
        srcset: img.srcset,
        sizes: img.sizes,
        loading: img.loading,
        className: img.className,
        hasOptimization: img.src.includes('/_next/image')
      }));
    });
    
    console.log(`Found ${nextImages.length} Next.js optimized images`);
    
    if (nextImages.length === 0) {
      this.results.issues.push({
        type: 'NEXTJS_OPTIMIZATION',
        severity: 'HIGH',
        message: 'No Next.js image optimization detected - images may not be optimized for performance'
      });
    }
    
    // Check if regular img tags are used instead of Next.js Image
    const regularImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => 
        !img.src.includes('/_next/image') &&
        !img.className.includes('next-image') &&
        !img.hasAttribute('data-nimg')
      ).length;
    });
    
    if (regularImages > 0) {
      this.results.issues.push({
        type: 'NEXTJS_OPTIMIZATION',
        severity: 'MEDIUM',
        message: `${regularImages} images not using Next.js Image optimization`
      });
    }
  }

  async testImagePerformance(page, imageRequests) {
    console.log('⚡ Testing image loading performance...');
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      
      const imageResources = resources.filter(resource => 
        resource.initiatorType === 'img' || 
        resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)
      );
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        imageCount: imageResources.length,
        imageMetrics: imageResources.map(resource => ({
          url: resource.name,
          duration: resource.duration,
          size: resource.transferSize,
          startTime: resource.startTime
        }))
      };
    });
    
    this.results.performanceMetrics = performanceMetrics;
    
    // Identify slow loading images
    const slowImages = performanceMetrics.imageMetrics.filter(img => img.duration > 3000);
    this.results.summary.slowLoadingImages = slowImages.length;
    
    slowImages.forEach(img => {
      this.results.issues.push({
        type: 'SLOW_LOADING',
        severity: 'MEDIUM',
        url: img.url,
        message: `Image took ${Math.round(img.duration)}ms to load (slow)`
      });
    });
  }

  async checkLazyLoading(page) {
    console.log('🔄 Checking lazy loading implementation...');
    
    const lazyLoadingStatus = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const stats = {
        total: images.length,
        withLazyLoading: 0,
        withEagerLoading: 0,
        withoutLoadingAttr: 0,
        belowFold: 0
      };
      
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        const isBelowFold = rect.top > window.innerHeight;
        
        if (isBelowFold) stats.belowFold++;
        
        if (img.loading === 'lazy') {
          stats.withLazyLoading++;
        } else if (img.loading === 'eager') {
          stats.withEagerLoading++;
        } else {
          stats.withoutLoadingAttr++;
        }
      });
      
      return stats;
    });
    
    console.log('Lazy loading stats:', lazyLoadingStatus);
    
    if (lazyLoadingStatus.belowFold > lazyLoadingStatus.withLazyLoading) {
      this.results.issues.push({
        type: 'LAZY_LOADING',
        severity: 'MEDIUM',
        message: `${lazyLoadingStatus.belowFold - lazyLoadingStatus.withLazyLoading} images below fold not using lazy loading`
      });
    }
  }

  async scrollThroughPage(page) {
    console.log('📜 Scrolling through page to trigger lazy loading...');
    
    await page.evaluate(async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < 5; i++) {
        window.scrollBy(0, window.innerHeight);
        await delay(1000);
      }
      
      // Scroll back to top
      window.scrollTo(0, 0);
      await delay(1000);
    });
  }

  isImageUrl(url) {
    return /\.(jpg|jpeg|png|gif|svg|webp|avif)(\?.*)?$/i.test(url);
  }

  generateRecommendations() {
    console.log('📝 Generating recommendations...');
    
    const recommendations = [];
    
    // HTTP Error recommendations
    if (this.results.summary.httpErrors > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Broken Images',
        issue: `${this.results.summary.httpErrors} images returning HTTP errors`,
        solution: 'Check image URLs and ensure all image files exist on the server. Update or remove broken image references.',
        implementation: 'Run image audit to identify specific broken URLs and either fix the paths or replace with working images.'
      });
    }
    
    // Missing alt text recommendations
    if (this.results.summary.missingAltText > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Accessibility',
        issue: `${this.results.summary.missingAltText} images missing alt text`,
        solution: 'Add descriptive alt text to all images for accessibility compliance.',
        implementation: 'Review each image and add meaningful alt attributes that describe the image content and purpose.'
      });
    }
    
    // Performance recommendations
    if (this.results.summary.slowLoadingImages > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Performance',
        issue: `${this.results.summary.slowLoadingImages} images loading slowly`,
        solution: 'Optimize image sizes and implement proper lazy loading.',
        implementation: 'Compress images, use Next.js Image component with proper sizing, and ensure lazy loading for below-fold images.'
      });
    }
    
    // Next.js optimization recommendations
    const nextJsIssues = this.results.issues.filter(issue => issue.type === 'NEXTJS_OPTIMIZATION');
    if (nextJsIssues.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Optimization',
        issue: 'Images not using Next.js optimization',
        solution: 'Convert regular img tags to Next.js Image components for automatic optimization.',
        implementation: 'Replace <img> tags with <Image> from next/image and configure proper sizes attributes.'
      });
    }
    
    this.results.recommendations = recommendations;
  }

  async saveReport() {
    const reportPath = path.join(__dirname, 'image-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate HTML report
    const htmlReport = this.generateHtmlReport();
    const htmlReportPath = path.join(__dirname, 'image-audit-report.html');
    fs.writeFileSync(htmlReportPath, htmlReport);
    
    console.log(`📊 Reports saved:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   HTML: ${htmlReportPath}`);
    
    return { jsonReport: reportPath, htmlReport: htmlReportPath };
  }

  generateHtmlReport() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PG Closets - Image Audit Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: var(--color-bg-secondary); }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007acc; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #007acc; }
        .metric-label { color: #666; margin-top: 5px; }
        .issue { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 10px 0; }
        .issue.high { background: #f8d7da; border-left-color: #dc3545; }
        .issue.medium { background: #fff3cd; border-left-color: #ffc107; }
        .issue.low { background: #d1ecf1; border-left-color: #17a2b8; }
        .recommendation { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 10px 0; }
        .severity { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
        .severity.HIGH { background: #dc3545; color: white; }
        .severity.MEDIUM { background: #ffc107; color: black; }
        .severity.LOW { background: #17a2b8; color: white; }
        code { background: #f1f3f4; padding: 2px 4px; border-radius: 3px; font-size: 0.9em; }
        .url { word-break: break-all; font-family: monospace; font-size: 0.9em; color: #666; }
        .timestamp { color: #666; font-size: 0.9em; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖼️ PG Closets Image Audit Report</h1>
        <div class="timestamp">Generated: ${this.results.timestamp}</div>
        <div class="timestamp">URL: ${this.results.url}</div>
        
        <h2>📊 Summary</h2>
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${this.results.summary.totalImages}</div>
                <div class="metric-label">Total Images</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.results.summary.brokenImages}</div>
                <div class="metric-label">Broken Images</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.results.summary.httpErrors}</div>
                <div class="metric-label">HTTP Errors</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.results.summary.missingAltText}</div>
                <div class="metric-label">Missing Alt Text</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.results.summary.slowLoadingImages}</div>
                <div class="metric-label">Slow Loading</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.results.summary.consoleErrors.length}</div>
                <div class="metric-label">Console Errors</div>
            </div>
        </div>
        
        <h2>🚨 Issues Found</h2>
        ${this.results.issues.map(issue => `
            <div class="issue ${issue.severity.toLowerCase()}">
                <span class="severity ${issue.severity}">${issue.severity}</span>
                <strong>${issue.type}</strong>
                <p>${issue.message}</p>
                ${issue.url ? `<div class="url">${issue.url}</div>` : ''}
                ${issue.details ? `<pre>${JSON.stringify(issue.details, null, 2)}</pre>` : ''}
            </div>
        `).join('')}
        
        <h2>♿ Accessibility Issues</h2>
        ${this.results.accessibilityIssues.map(issue => `
            <div class="issue ${issue.severity.toLowerCase()}">
                <span class="severity ${issue.severity}">${issue.severity}</span>
                <strong>${issue.type}</strong>
                <p>${issue.message}</p>
                <div class="url">${issue.url}</div>
            </div>
        `).join('')}
        
        <h2>🔧 Recommendations</h2>
        ${this.results.recommendations.map(rec => `
            <div class="recommendation">
                <span class="severity ${rec.priority}">${rec.priority}</span>
                <strong>${rec.category}: ${rec.issue}</strong>
                <p><strong>Solution:</strong> ${rec.solution}</p>
                <p><strong>Implementation:</strong> ${rec.implementation}</p>
            </div>
        `).join('')}
        
        <h2>⚡ Performance Metrics</h2>
        ${this.results.performanceMetrics.domContentLoaded ? `
            <p><strong>DOM Content Loaded:</strong> ${Math.round(this.results.performanceMetrics.domContentLoaded)}ms</p>
            <p><strong>Page Load Complete:</strong> ${Math.round(this.results.performanceMetrics.loadComplete)}ms</p>
            <p><strong>Image Resources Found:</strong> ${this.results.performanceMetrics.imageCount}</p>
        ` : '<p>Performance metrics not available</p>'}
        
        <h2>💾 Console Errors</h2>
        ${this.results.summary.consoleErrors.map(error => `
            <div class="issue">
                <strong>${error.type.toUpperCase()}</strong>
                <p>${error.message}</p>
                <div class="timestamp">${error.timestamp}</div>
            </div>
        `).join('')}
    </div>
</body>
</html>
    `;
  }
}

// Run the audit
async function runImageAudit() {
  console.log('🔍 Starting PG Closets image audit...');
  
  const analyzer = new ImageAuditAnalyzer();
  const results = await analyzer.analyzeSite();
  const reportPaths = await analyzer.saveReport();
  
  console.log('\n📊 AUDIT COMPLETE!');
  console.log(`Total Images: ${results.summary.totalImages}`);
  console.log(`Broken Images: ${results.summary.brokenImages}`);
  console.log(`HTTP Errors: ${results.summary.httpErrors}`);
  console.log(`Missing Alt Text: ${results.summary.missingAltText}`);
  console.log(`Slow Loading: ${results.summary.slowLoadingImages}`);
  console.log(`Console Errors: ${results.summary.consoleErrors.length}`);
  console.log(`\nReports generated at:`);
  console.log(`  ${reportPaths.htmlReport}`);
  console.log(`  ${reportPaths.jsonReport}`);
  
  return results;
}

// Export for module use
module.exports = { ImageAuditAnalyzer, runImageAudit };

// Run if called directly
if (require.main === module) {
  runImageAudit().catch(console.error);
}