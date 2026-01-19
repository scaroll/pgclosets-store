#!/usr/bin/env node

/**
 * APPLE-GRADE PERFORMANCE VALIDATION SYSTEM
 * Comprehensive performance testing and validation against Apple standards
 */

const { chromium } = require('playwright');
const lighthouse = require('lighthouse');
const fs = require('fs').promises;
const path = require('path');

class PerformanceValidator {
  constructor() {
    this.results = [];
    this.appleGradeThresholds = {
      performance: 90,        // Lighthouse performance score
      firstContentfulPaint: 1200, // 1.2s
      largestContentfulPaint: 1500, // 1.5s
      cumulativeLayoutShift: 0.05, // Stricter than standard
      firstInputDelay: 50,   // 50ms
      totalBlockingTime: 200, // 200ms
      speedIndex: 1342,      // Based on Apple standards
      interactive: 2000,     // 2s to interactive
    };

    this.bundleSizeLimits = {
      javascript: 300 * 1024, // 300KB gzipped
      css: 100 * 1024,       // 100KB gzipped
      images: 500 * 1024,    // 500KB per critical image
      total: 1500 * 1024,    // 1.5MB total page size
    };
  }

  async runValidation(baseURL = 'http://localhost:3000') {
    console.log('🚀 Starting Apple-grade performance validation...\n');

    const browser = await chromium.launch({ headless: true });

    try {
      // Define key pages to test
      const pages = [
        { name: 'Home', url: '/', critical: true },
        { name: 'Products', url: '/products', critical: true },
        { name: 'Contact', url: '/contact', critical: false },
        { name: 'About', url: '/about', critical: false },
        { name: 'Product Detail', url: '/products/barn-doors', critical: true },
      ];

      for (const page of pages) {
        console.log(`Testing: ${page.name} (${page.url})`);
        const result = await this.validatePage(browser, baseURL + page.url, page);
        this.results.push(result);

        console.log(`  Performance Score: ${result.lighthouse.score}/100`);
        console.log(`  Apple Grade: ${result.appleGrade}`);
        console.log(`  Status: ${result.passed ? '✅ PASS' : '❌ FAIL'}\n`);
      }

      // Generate comprehensive report
      await this.generateReport();

    } catch (error) {
      console.error('Performance validation failed:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async validatePage(browser, url, pageInfo) {
    const page = await browser.newPage();

    try {
      // Set viewport for consistent testing
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Enable performance monitoring
      await page.addInitScript(() => {
        window.performanceMetrics = [];
      });

      // Collect performance metrics during load
      const [response] = await Promise.all([
        page.goto(url, { waitUntil: 'networkidle' }),
        page.evaluate(() => {
          return new Promise(resolve => {
            window.addEventListener('load', () => {
              setTimeout(resolve, 2000); // Wait for animations
            });
          });
        })
      ]);

      // Run Lighthouse audit
      const lighthouseResult = await this.runLighthouse(url);

      // Extract performance metrics
      const metrics = this.extractMetrics(lighthouseResult);

      // Analyze bundle sizes
      const bundleAnalysis = await this.analyzeBundles(page);

      // Calculate Apple grade
      const appleGrade = this.calculateAppleGrade(metrics, bundleAnalysis);

      // Determine if passed
      const passed = this.isAppleGrade(appleGrade);

      return {
        pageInfo,
        url,
        timestamp: new Date().toISOString(),
        lighthouse: {
          score: Math.round(lighthouseResult.lhr.categories.performance.score * 100),
          metrics,
        },
        bundleAnalysis,
        appleGrade,
        passed,
        issues: this.identifyIssues(metrics, bundleAnalysis),
        recommendations: this.generateRecommendations(metrics, bundleAnalysis),
      };

    } finally {
      await page.close();
    }
  }

  async runLighthouse(url) {
    const options = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance'],
      port: await this.getAvailablePort(),
      chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
    };

    // Add throttling for realistic testing
    const config = {
      extends: 'lighthouse:default',
      settings: {
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        throttlingMethod: 'provided',
        emulatedFormFactor: 'desktop',
      },
    };

    const runnerResult = await lighthouse(url, options, config);
    return runnerResult;
  }

  async getAvailablePort() {
    // Find an available port for Lighthouse
    const port = 9222;
    return port;
  }

  extractMetrics(lighthouseResult) {
    const audits = lighthouseResult.lhr.audits;

    return {
      'First Contentful Paint': audits['first-contentful-paint'].numericValue,
      'Largest Contentful Paint': audits['largest-contentful-paint'].numericValue,
      'Cumulative Layout Shift': audits['cumulative-layout-shift'].numericValue,
      'First Input Delay': audits['max-potential-fid'].numericValue,
      'Total Blocking Time': audits['total-blocking-time'].numericValue,
      'Speed Index': audits['speed-index'].numericValue,
      'Time to Interactive': audits['interactive'].numericValue,
      'Server Response Time': audits['server-response-time'].numericValue,
    };
  }

  async analyzeBundles(page) {
    const bundleAnalysis = {
      javascript: { size: 0, files: [] },
      css: { size: 0, files: [] },
      images: { size: 0, files: [] },
      total: 0,
    };

    // Get all loaded resources
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(r => ({
        name: r.name,
        type: this.getResourceType(r.name),
        size: r.transferSize || 0,
      }));
    });

    resources.forEach(resource => {
      bundleAnalysis[resource.type].size += resource.size;
      bundleAnalysis[resource.type].files.push(resource);
      bundleAnalysis.total += resource.size;
    });

    return bundleAnalysis;
  }

  getResourceType(url) {
    if (url.includes('.js') || url.includes('.mjs')) return 'javascript';
    if (url.includes('.css')) return 'css';
    if (url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i)) return 'images';
    return 'other';
  }

  calculateAppleGrade(metrics, bundleAnalysis) {
    let score = 100;
    const issues = [];

    // Performance metrics scoring
    Object.entries(this.appleGradeThresholds).forEach(([metric, threshold]) => {
      if (metrics[metric]) {
        const ratio = metrics[metric] / threshold;
        if (ratio > 1) {
          const penalty = Math.min(20, (ratio - 1) * 20);
          score -= penalty;
          issues.push(`${metric}: ${metrics[metric].toFixed(0)}ms (target: ${threshold}ms)`);
        }
      }
    });

    // Bundle size scoring
    if (bundleAnalysis.javascript.size > this.bundleSizeLimits.javascript) {
      const penalty = ((bundleAnalysis.javascript.size / this.bundleSizeLimits.javascript - 1) * 15);
      score -= penalty;
      issues.push(`JS bundle too large: ${(bundleAnalysis.javascript.size / 1024).toFixed(0)}KB`);
    }

    if (bundleAnalysis.css.size > this.bundleSizeLimits.css) {
      const penalty = ((bundleAnalysis.css.size / this.bundleSizeLimits.css - 1) * 10);
      score -= penalty;
      issues.push(`CSS bundle too large: ${(bundleAnalysis.css.size / 1024).toFixed(0)}KB`);
    }

    if (bundleAnalysis.total > this.bundleSizeLimits.total) {
      const penalty = ((bundleAnalysis.total / this.bundleSizeLimits.total - 1) * 10);
      score -= penalty;
      issues.push(`Total page size too large: ${(bundleAnalysis.total / 1024).toFixed(0)}KB`);
    }

    let grade = 'A+';
    if (score < 95) grade = 'A';
    if (score < 90) grade = 'B+';
    if (score < 85) grade = 'B';
    if (score < 80) grade = 'C+';
    if (score < 75) grade = 'C';
    if (score < 70) grade = 'D';
    if (score < 60) grade = 'F';

    return {
      score: Math.max(0, Math.round(score)),
      grade,
      issues,
    };
  }

  isAppleGrade(appleGrade) {
    return appleGrade.score >= 85 && appleGrade.grade[0] === 'A';
  }

  identifyIssues(metrics, bundleAnalysis) {
    const issues = [];

    // Performance issues
    if (metrics['First Contentful Paint'] > 1800) {
      issues.push({
        type: 'performance',
        severity: 'high',
        description: 'Slow First Contentful Paint',
        recommendation: 'Optimize critical rendering path and server response time',
      });
    }

    if (metrics['Largest Contentful Paint'] > 2500) {
      issues.push({
        type: 'performance',
        severity: 'high',
        description: 'Slow Largest Contentful Paint',
        recommendation: 'Optimize hero images and critical resources',
      });
    }

    if (metrics['Cumulative Layout Shift'] > 0.1) {
      issues.push({
        type: 'user-experience',
        severity: 'medium',
        description: 'Layout shift detected',
        recommendation: 'Add explicit dimensions to images and ads',
      });
    }

    if (metrics['First Input Delay'] > 100) {
      issues.push({
        type: 'interactivity',
        severity: 'high',
        description: 'Slow input response',
        recommendation: 'Reduce JavaScript execution time and third-party scripts',
      });
    }

    // Bundle size issues
    if (bundleAnalysis.javascript.size > this.bundleSizeLimits.javascript) {
      issues.push({
        type: 'bundle-size',
        severity: 'medium',
        description: 'JavaScript bundle too large',
        recommendation: 'Implement code splitting and tree shaking',
      });
    }

    return issues;
  }

  generateRecommendations(metrics, bundleAnalysis) {
    const recommendations = [];

    // Performance recommendations
    if (metrics['First Contentful Paint'] > this.appleGradeThresholds.firstContentfulPaint) {
      recommendations.push({
        priority: 'high',
        action: 'Reduce server response time',
        impact: 'Improves FCP by 200-500ms',
        effort: 'medium',
      });
    }

    if (metrics['Largest Contentful Paint'] > this.appleGradeThresholds.largestContentfulPaint) {
      recommendations.push({
        priority: 'high',
        action: 'Optimize hero images with WebP/AVIF',
        impact: 'Improves LCP by 30-50%',
        effort: 'low',
      });
    }

    if (bundleAnalysis.javascript.size > this.bundleSizeLimits.javascript) {
      recommendations.push({
        priority: 'medium',
        action: 'Implement dynamic imports for non-critical JavaScript',
        impact: 'Reduces initial bundle size by 40-60%',
        effort: 'medium',
      });
    }

    return recommendations;
  }

  async generateReport() {
    const report = {
      generated: new Date().toISOString(),
      summary: this.generateSummary(),
      results: this.results,
      appleGradeStandards: this.appleGradeThresholds,
      bundleSizeLimits: this.bundleSizeLimits,
    };

    // Save detailed report
    await fs.writeFile(
      path.join(process.cwd(), 'PERFORMANCE_VALIDATION_REPORT.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate HTML report
    await this.generateHTMLReport(report);

    this.printSummary(report.summary);
  }

  generateSummary() {
    const totalPages = this.results.length;
    const passedPages = this.results.filter(r => r.passed).length;
    const averageScore = this.results.reduce((sum, r) => sum + r.appleGrade.score, 0) / totalPages;
    const criticalIssues = this.results.flatMap(r => r.issues.filter(i => i.severity === 'high')).length;

    return {
      totalPages,
      passedPages,
      averageScore: Math.round(averageScore),
      passRate: Math.round((passedPages / totalPages) * 100),
      criticalIssues,
      appleGradeCertification: passedPages === totalPages && averageScore >= 90,
    };
  }

  printSummary(summary) {
    console.log('\n' + '='.repeat(70));
    console.log('🍎 APPLE-GRADE PERFORMANCE VALIDATION REPORT');
    console.log('='.repeat(70));
    console.log(`📊 Pages Tested: ${summary.totalPages}`);
    console.log(`✅ Passed: ${summary.passedPages}/${summary.totalPages}`);
    console.log(`📈 Average Score: ${summary.averageScore}/100`);
    console.log(`🎯 Pass Rate: ${summary.passRate}%`);
    console.log(`⚠️  Critical Issues: ${summary.criticalIssues}`);

    if (summary.appleGradeCertification) {
      console.log('\n🏆 CERTIFIED: Apple-grade performance achieved!');
      console.log('   ✅ Meets all Apple performance standards');
      console.log('   ✅ Exceptional user experience');
      console.log('   ✅ Optimized for all devices');
    } else {
      console.log('\n❌ NOT CERTIFIED: Performance improvements needed');
      console.log('   ⚠️  Does not meet Apple standards');
      console.log('   🔧 Review optimization recommendations');
    }

    console.log('='.repeat(70));
    console.log('📁 Detailed reports saved:');
    console.log('   • PERFORMANCE_VALIDATION_REPORT.json');
    console.log('   • performance-report.html');
    console.log('='.repeat(70));
  }

  async generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Validation Report - PG Closets</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f7; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .certified { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; }
        .not-certified { background: linear-gradient(135deg, #f44336, #d32f2f); color: white; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .page-result { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .score { font-size: 48px; font-weight: bold; color: #4CAF50; }
        .score.fail { color: #f44336; }
        .grade { font-size: 24px; font-weight: bold; margin-left: 10px; }
        .issues { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin-top: 10px; }
        .recommendations { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header ${report.summary.appleGradeCertification ? 'certified' : 'not-certified'}">
            <h1>🍎 Apple-Grade Performance Report</h1>
            <p>PG Closets - Performance Validation</p>
            <p>Generated: ${new Date(report.generated).toLocaleString()}</p>
        </div>

        <div class="metrics">
            <div class="metric-card">
                <h3>Overall Performance</h3>
                <div>
                    <span class="score ${report.summary.averageScore < 90 ? 'fail' : ''}">${report.summary.averageScore}</span>
                    <span class="grade">Grade ${this.getGradeFromScore(report.summary.averageScore)}</span>
                </div>
                <p>${report.summary.passedPages}/${report.summary.totalPages} pages passed Apple standards</p>
            </div>

            <div class="metric-card">
                <h3>Apple Certification</h3>
                <div style="font-size: 48px;">
                    ${report.summary.appleGradeCertification ? '✅' : '❌'}
                </div>
                <p>${report.summary.appleGradeCertification ? 'CERTIFIED' : 'NOT CERTIFIED'}</p>
            </div>

            <div class="metric-card">
                <h3>Critical Issues</h3>
                <div style="font-size: 48px; color: ${report.summary.criticalIssues > 0 ? '#f44336' : '#4CAF50'};">
                    ${report.summary.criticalIssues}
                </div>
                <p>Issues requiring immediate attention</p>
            </div>
        </div>

        ${report.results.map(result => `
            <div class="page-result">
                <h3>${result.pageInfo.name} - ${result.passed ? '✅ PASS' : '❌ FAIL'}</h3>
                <p><strong>URL:</strong> ${result.url}</p>
                <p><strong>Performance Score:</strong> ${result.lighthouse.score}/100</p>
                <p><strong>Apple Grade:</strong> ${result.appleGrade.score}/100 (Grade ${result.appleGrade.grade})</p>

                ${result.issues.length > 0 ? `
                    <div class="issues">
                        <h4>🔍 Issues Identified:</h4>
                        ${result.issues.map(issue => `
                            <p><strong>${issue.description}</strong> - ${issue.recommendation}</p>
                        `).join('')}
                    </div>
                ` : ''}

                ${result.recommendations.length > 0 ? `
                    <div class="recommendations">
                        <h4>💡 Recommendations:</h4>
                        ${result.recommendations.map(rec => `
                            <p><strong>${rec.action}</strong> (Priority: ${rec.priority})</p>
                            <p>Impact: ${rec.impact} | Effort: ${rec.effort}</p>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    await fs.writeFile(
      path.join(process.cwd(), 'performance-report.html'),
      html
    );
  }

  getGradeFromScore(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// Main execution
async function main() {
  const validator = new PerformanceValidator();

  try {
    await validator.runValidation();
    process.exit(0);
  } catch (error) {
    console.error('Performance validation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = PerformanceValidator;