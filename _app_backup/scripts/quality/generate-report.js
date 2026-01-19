#!/usr/bin/env node

/**
 * Quality Report Generator for PG Closets
 * Generates comprehensive quality metrics report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function runCommand(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: silent ? 'pipe' : 'inherit' });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function generateReport() {
  log('\n📊 PG Closets - Quality Report Generator\n', 'cyan');
  log('═'.repeat(60), 'bright');

  const report = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // 1. TypeScript Type Check
  log('\n🔍 Running TypeScript type check...', 'yellow');
  const typeCheck = runCommand('npm run type-check', true);
  report.checks.typescript = {
    passed: typeCheck.success,
    message: typeCheck.success ? 'No type errors' : 'Type errors found',
  };
  log(typeCheck.success ? '✅ TypeScript: PASS' : '❌ TypeScript: FAIL', typeCheck.success ? 'green' : 'red');

  // 2. ESLint
  log('\n🔍 Running ESLint...', 'yellow');
  const eslint = runCommand('npm run lint', true);
  report.checks.eslint = {
    passed: eslint.success,
    message: eslint.success ? 'No linting errors' : 'Linting errors found',
  };
  log(eslint.success ? '✅ ESLint: PASS' : '❌ ESLint: FAIL', eslint.success ? 'green' : 'red');

  // 3. Prettier
  log('\n🔍 Checking code formatting...', 'yellow');
  const prettier = runCommand('npm run format:check', true);
  report.checks.prettier = {
    passed: prettier.success,
    message: prettier.success ? 'All files formatted' : 'Formatting issues found',
  };
  log(prettier.success ? '✅ Prettier: PASS' : '❌ Prettier: FAIL', prettier.success ? 'green' : 'red');

  // 4. Tests
  log('\n🔍 Running tests...', 'yellow');
  const tests = runCommand('npm test', true);
  report.checks.tests = {
    passed: tests.success,
    message: tests.success ? 'All tests passing' : 'Test failures found',
  };
  log(tests.success ? '✅ Tests: PASS' : '❌ Tests: FAIL', tests.success ? 'green' : 'red');

  // 5. Security Audit
  log('\n🔍 Running security audit...', 'yellow');
  const security = runCommand('npm audit --audit-level=moderate', true);
  report.checks.security = {
    passed: security.success,
    message: security.success ? 'No vulnerabilities' : 'Vulnerabilities found',
  };
  log(security.success ? '✅ Security: PASS' : '❌ Security: FAIL', security.success ? 'green' : 'red');

  // 6. Bundle Size Analysis
  log('\n🔍 Analyzing bundle size...', 'yellow');
  const hasBuild = fs.existsSync('.next');
  if (hasBuild) {
    try {
      const statsFile = '.next/build-manifest.json';
      if (fs.existsSync(statsFile)) {
        const stats = JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
        report.checks.bundleSize = {
          passed: true,
          message: 'Bundle analysis available',
          stats: { pages: Object.keys(stats.pages || {}).length },
        };
        log('✅ Bundle Size: Analyzed', 'green');
      }
    } catch (error) {
      report.checks.bundleSize = {
        passed: false,
        message: 'Error analyzing bundle',
      };
      log('⚠️  Bundle Size: Unable to analyze', 'yellow');
    }
  } else {
    report.checks.bundleSize = {
      passed: false,
      message: 'No build found - run npm run build first',
    };
    log('⚠️  Bundle Size: No build found', 'yellow');
  }

  // Calculate overall status
  const totalChecks = Object.keys(report.checks).length;
  const passedChecks = Object.values(report.checks).filter(check => check.passed).length;
  const passRate = (passedChecks / totalChecks) * 100;

  report.summary = {
    total: totalChecks,
    passed: passedChecks,
    failed: totalChecks - passedChecks,
    passRate: passRate.toFixed(1),
  };

  // Display summary
  log('\n═'.repeat(60), 'bright');
  log('\n📊 Summary', 'cyan');
  log(`Total Checks: ${totalChecks}`, 'bright');
  log(`Passed: ${passedChecks}`, 'green');
  log(`Failed: ${totalChecks - passedChecks}`, 'red');
  log(`Pass Rate: ${report.summary.passRate}%`, passRate === 100 ? 'green' : 'yellow');

  // Save report
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, `quality-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log(`\n💾 Report saved to: ${reportPath}`, 'cyan');

  // Final status
  log('\n═'.repeat(60), 'bright');
  if (passRate === 100) {
    log('\n🎉 All quality checks passed!', 'green');
  } else if (passRate >= 80) {
    log('\n⚠️  Most checks passed, but some issues need attention', 'yellow');
  } else {
    log('\n❌ Multiple quality checks failed - please address issues', 'red');
  }
  log('');

  return passRate === 100 ? 0 : 1;
}

// Run report
process.exit(generateReport());
