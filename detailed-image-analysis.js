const { chromium } = require('playwright');

async function detailedImageAnalysis() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const networkLogs = [];
  const imageAnalysis = {
    networkFailures: [],
    missingFiles: [],
    serverErrors: [],
    imageLoadResults: []
  };
  
  // Monitor all network requests
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    const contentType = response.headers()['content-type'] || '';
    
    networkLogs.push({
      url,
      status,
      contentType,
      method: response.request().method(),
      timestamp: new Date().toISOString()
    });
    
    // Focus on image requests
    if (contentType.includes('image/') || url.includes('/_next/image') || url.match(/\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i)) {
      console.log(`🖼️  Image Request: ${status} - ${url}`);
      
      if (status >= 400) {
        imageAnalysis.networkFailures.push({
          url,
          status,
          contentType,
          error: status === 404 ? 'File Not Found' : `HTTP ${status} Error`
        });
      }
    }
  });
  
  // Monitor console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  try {
    console.log('🌐 Loading PG Closets website...');
    await page.goto('https://www.pgclosets.com', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for images to load
    await page.waitForTimeout(5000);
    
    // Get detailed image analysis
    const imageDetails = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map((img, index) => {
        const rect = img.getBoundingClientRect();
        return {
          index,
          src: img.src,
          originalSrc: img.getAttribute('src'),
          alt: img.alt,
          className: img.className,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight,
          complete: img.complete,
          loading: img.loading,
          sizes: img.sizes,
          srcset: img.srcset,
          isVisible: rect.width > 0 && rect.height > 0,
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          },
          parentElement: img.parentElement?.tagName,
          hasDataNimg: img.hasAttribute('data-nimg'),
          dataOriginal: img.getAttribute('data-original-src') || img.getAttribute('data-src'),
          computedStyle: window.getComputedStyle(img),
          isNextJsImage: img.src.includes('/_next/image')
        };
      });
    });
    
    console.log(`\n📊 Found ${imageDetails.length} images on the page`);
    
    // Analyze each image
    for (const img of imageDetails) {
      console.log(`\n🔍 Analyzing Image ${img.index + 1}:`);
      console.log(`   URL: ${img.src}`);
      console.log(`   Alt Text: "${img.alt}"`);
      console.log(`   Natural Size: ${img.naturalWidth}x${img.naturalHeight}`);
      console.log(`   Display Size: ${img.displayWidth}x${img.displayHeight}`);
      console.log(`   Complete: ${img.complete}`);
      console.log(`   Loading: ${img.loading}`);
      console.log(`   Next.js Image: ${img.isNextJsImage}`);
      
      // Check if image is broken
      if (!img.complete || img.naturalWidth === 0) {
        console.log(`   ❌ BROKEN: Image failed to load`);
        
        // Try to fetch the image directly to see what error we get
        try {
          const response = await page.evaluate(async (url) => {
            const response = await fetch(url);
            return {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries())
            };
          }, img.src);
          
          console.log(`   Direct fetch result: ${response.status} ${response.statusText}`);
          
          imageAnalysis.imageLoadResults.push({
            originalUrl: img.src,
            fetchStatus: response.status,
            fetchStatusText: response.statusText,
            naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
            issue: 'broken_image'
          });
          
        } catch (fetchError) {
          console.log(`   Direct fetch failed: ${fetchError.message}`);
        }
      } else {
        console.log(`   ✅ LOADED: Image loaded successfully`);
      }
    }
    
    // Test specific image URLs that we know are problematic
    const problematicUrls = [
      '/images/arcat/renin_176732_hd.jpg',
      '/images/arcat/renin_205750_hd.jpg',
      '/images/arcat/renin_205729_hd.jpg',
      '/images/arcat/renin_199063_hd.jpg'
    ];
    
    console.log(`\n🔍 Testing problematic image paths directly...`);
    
    for (const path of problematicUrls) {
      const fullUrl = `https://www.pgclosets.com${path}`;
      console.log(`\nTesting: ${fullUrl}`);
      
      try {
        const response = await page.evaluate(async (url) => {
          try {
            const response = await fetch(url);
            return {
              status: response.status,
              statusText: response.statusText,
              ok: response.ok,
              headers: Object.fromEntries(response.headers.entries())
            };
          } catch (error) {
            return {
              error: error.message,
              status: 'FETCH_ERROR'
            };
          }
        }, fullUrl);
        
        console.log(`Result: ${response.status} ${response.statusText || ''}`);
        if (response.error) {
          console.log(`Error: ${response.error}`);
        }
        
        if (!response.ok) {
          imageAnalysis.missingFiles.push({
            path,
            fullUrl,
            status: response.status,
            statusText: response.statusText
          });
        }
      } catch (error) {
        console.log(`Failed to test ${fullUrl}: ${error.message}`);
      }
    }
    
    // Check if the images directory exists and what's in it
    console.log(`\n📁 Checking images directory structure...`);
    
    const directoryCheck = await page.evaluate(async () => {
      const pathsToCheck = [
        '/images/',
        '/images/arcat/',
        '/public/images/',
        '/public/images/arcat/'
      ];
      
      const results = [];
      
      for (const path of pathsToCheck) {
        try {
          const response = await fetch(`https://www.pgclosets.com${path}`);
          results.push({
            path,
            status: response.status,
            statusText: response.statusText,
            accessible: response.ok
          });
        } catch (error) {
          results.push({
            path,
            error: error.message,
            accessible: false
          });
        }
      }
      
      return results;
    });
    
    console.log('Directory accessibility:');
    directoryCheck.forEach(result => {
      console.log(`   ${result.path}: ${result.status || 'ERROR'} ${result.statusText || result.error || ''}`);
    });
    
  } catch (error) {
    console.error('Analysis failed:', error);
  } finally {
    await browser.close();
  }
  
  // Generate final analysis report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalNetworkRequests: networkLogs.length,
      imageNetworkFailures: imageAnalysis.networkFailures.length,
      missingFiles: imageAnalysis.missingFiles.length,
      imageLoadResults: imageAnalysis.imageLoadResults.length
    },
    networkFailures: imageAnalysis.networkFailures,
    missingFiles: imageAnalysis.missingFiles,
    imageLoadResults: imageAnalysis.imageLoadResults,
    directoryCheck,
    networkLogs: networkLogs.filter(log => 
      log.contentType.includes('image/') || 
      log.url.includes('/_next/image') || 
      log.url.match(/\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i)
    )
  };
  
  console.log('\n📊 DETAILED ANALYSIS COMPLETE');
  console.log(`Network Failures: ${report.summary.imageNetworkFailures}`);
  console.log(`Missing Files: ${report.summary.missingFiles}`);
  console.log(`Image Load Issues: ${report.summary.imageLoadResults}`);
  
  return report;
}

// Run the analysis
detailedImageAnalysis().catch(console.error);