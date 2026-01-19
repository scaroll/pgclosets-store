/**
 * Verification Script - Automated verification and validation
 * Ensures system reliability and data integrity
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

class VerificationScript {
  constructor(baseDir) {
    this.baseDir = baseDir || path.join(__dirname, '..');
    this.verificationResults = [];
    this.systemHealth = {
      status: 'unknown',
      issues: [],
      recommendations: []
    };
  }

  /**
   * Run complete verification suite
   */
  async runCompleteVerification() {
    console.log('🔍 Starting complete system verification...');

    const verificationSteps = [
      'verifyFileStructure',
      'verifyDependencies',
      'verifyConfiguration',
      'verifyDataIntegrity',
      'verifyPermissions',
      'verifyPerformance',
      'verifySecurity',
      'verifyFunctionality'
    ];

    const results = {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      steps: {}
    };

    for (const step of verificationSteps) {
      console.log(`\n📋 Running ${step}...`);

      try {
        const stepResult = await this[step]();
        results.steps[step] = stepResult;
        results.totalChecks += stepResult.totalChecks;
        results.passedChecks += stepResult.passedChecks;
        results.failedChecks += stepResult.failedChecks;

        console.log(`${stepResult.passedChecks}/${stepResult.totalChecks} checks passed ✅`);

        if (stepResult.issues.length > 0) {
          console.log(`⚠️  ${stepResult.issues.length} issue(s) found`);
        }
      } catch (error) {
        console.error(`❌ Verification step ${step} failed:`, error.message);
        results.steps[step] = {
          error: error.message,
          totalChecks: 0,
          passedChecks: 0,
          failedChecks: 1,
          issues: [error.message]
        };
        results.totalChecks++;
        results.failedChecks++;
      }
    }

    // Calculate overall health
    this.calculateSystemHealth(results);

    console.log('\n📊 Verification Summary:');
    console.log(`Total Checks: ${results.totalChecks}`);
    console.log(`Passed: ${results.passedChecks} ✅`);
    console.log(`Failed: ${results.failedChecks} ❌`);
    console.log(`Success Rate: ${((results.passedChecks / results.totalChecks) * 100).toFixed(2)}%`);
    console.log(`System Health: ${this.systemHealth.status.toUpperCase()}`);

    if (this.systemHealth.issues.length > 0) {
      console.log('\n⚠️  Issues Found:');
      this.systemHealth.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }

    if (this.systemHealth.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.systemHealth.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }

    return {
      results,
      systemHealth: this.systemHealth
    };
  }

  /**
   * Verify file structure
   */
  async verifyFileStructure() {
    const requiredFiles = [
      'SKILL.md',
      'index.js',
      'package.json',
      'README.md'
    ];

    const requiredDirectories = [
      'core',
      'cli',
      'utils',
      'tests',
      'docs'
    ];

    const requiredCoreFiles = [
      'core/StorageEngine.js',
      'core/ContextManager.js',
      'core/SessionManager.js',
      'core/ErrorRecoverySystem.js',
      'core/StateManager.js'
    ];

    const results = {
      totalChecks: requiredFiles.length + requiredDirectories.length + requiredCoreFiles.length,
      passedChecks: 0,
      failedChecks: 0,
      issues: []
    };

    // Check required files
    for (const file of requiredFiles) {
      try {
        await fs.access(path.join(this.baseDir, file));
        results.passedChecks++;
      } catch (error) {
        results.failedChecks++;
        results.issues.push(`Missing required file: ${file}`);
      }
    }

    // Check required directories
    for (const dir of requiredDirectories) {
      try {
        const stat = await fs.stat(path.join(this.baseDir, dir));
        if (stat.isDirectory()) {
          results.passedChecks++;
        } else {
          results.failedChecks++;
          results.issues.push(`Path exists but is not directory: ${dir}`);
        }
      } catch (error) {
        results.failedChecks++;
        results.issues.push(`Missing required directory: ${dir}`);
      }
    }

    // Check required core files
    for (const file of requiredCoreFiles) {
      try {
        await fs.access(path.join(this.baseDir, file));
        results.passedChecks++;
      } catch (error) {
        results.failedChecks++;
        results.issues.push(`Missing required core file: ${file}`);
      }
    }

    return results;
  }

  /**
   * Verify dependencies
   */
  async verifyDependencies() {
    const results = {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      issues: []
    };

    try {
      // Check package.json
      const packagePath = path.join(this.baseDir, 'package.json');
      const packageData = JSON.parse(await fs.readFile(packagePath, 'utf8'));

      if (!packageData.dependencies) {
        results.issues.push('No dependencies defined in package.json');
      } else {
        const dependencies = Object.keys(packageData.dependencies);
        results.totalChecks += dependencies.length;

        for (const dep of dependencies) {
          try {
            require.resolve(dep);
            results.passedChecks++;
          } catch (error) {
            results.failedChecks++;
            results.issues.push(`Missing dependency: ${dep}`);
          }
        }
      }

      // Check if modules are properly installed
      try {
        await fs.access(path.join(this.baseDir, 'node_modules'));
        results.totalChecks++;
        results.passedChecks++;
      } catch (error) {
        results.totalChecks++;
        results.failedChecks++;
        results.issues.push('node_modules directory not found - run npm install');
      }

    } catch (error) {
      results.issues.push(`Dependency verification failed: ${error.message}`);
      results.totalChecks++;
      results.failedChecks++;
    }

    return results;
  }

  /**
   * Verify configuration
   */
  async verifyConfiguration() {
    const results = {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      issues: []
    };

    try {
      // Check if configuration files exist
      const configFiles = [
        '.claude-work/config/settings.json',
        '.claude-work/config/ignore-rules.json'
      ];

      results.totalChecks += configFiles.length;

      for (const configFile of configFiles) {
        const fullPath = path.join(this.baseDir, configFile);
        try {
          await fs.access(fullPath);
          results.passedChecks++;

          // Verify JSON syntax
          const configData = JSON.parse(await fs.readFile(fullPath, 'utf8'));
          if (!configData || typeof configData !== 'object') {
            results.failedChecks++;
            results.issues.push(`Invalid JSON in ${configFile}`);
          }
        } catch (error) {
          results.failedChecks++;
          results.issues.push(`Configuration file missing or invalid: ${configFile}`);
        }
      }

      // Verify default configuration structure
      results.totalChecks++;
      const defaultConfig = {
        autoSave: { enabled: true, interval: 30000 },
        backup: { enabled: true, frequency: 'hourly' },
        session: { timeout: 1800000, autoResume: true },
        context: { retentionDays: 30 }
      };

      try {
        const settingsPath = path.join(this.baseDir, '.claude-work/config/settings.json');
        const settings = JSON.parse(await fs.readFile(settingsPath, 'utf8'));

        let configValid = true;
        for (const [key, value] of Object.entries(defaultConfig)) {
          if (!settings[key]) {
            configValid = false;
            results.issues.push(`Missing configuration section: ${key}`);
          }
        }

        if (configValid) {
          results.passedChecks++;
        } else {
          results.failedChecks++;
        }
      } catch (error) {
        results.failedChecks++;
        results.issues.push('Default configuration validation failed');
      }

    } catch (error) {
      results.issues.push(`Configuration verification failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Verify data integrity
   */
  async verifyDataIntegrity() {
    const results = {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      issues: []
    };

    try {
      const workDir = path.join(this.baseDir, '.claude-work');

      // Check if work directory exists
      try {
        await fs.access(workDir);
        results.passedChecks++;
      } catch (error) {
        results.failedChecks++;
        results.issues.push('Work directory not found - run initialization');
        return results;
      }

      results.totalChecks++;

      // Verify storage directories
      const storageDirs = ['sessions', 'context', 'backups', 'config'];
      results.totalChecks += storageDirs.length;

      for (const dir of storageDirs) {
        try {
          await fs.access(path.join(workDir, dir));
          results.passedChecks++;
        } catch (error) {
          results.failedChecks++;
          results.issues.push(`Storage directory missing: ${dir}`);
        }
      }

      // Verify JSON files integrity
      const dataDirs = [
        path.join(workDir, 'sessions/session-history'),
        path.join(workDir, 'context/context-snapshots'),
        path.join(workDir, 'backups/manual')
      ];

      for (const dir of dataDirs) {
        try {
          const files = await fs.readdir(dir);
          results.totalChecks += Math.min(files.length, 5); // Check up to 5 files per directory

          for (let i = 0; i < Math.min(files.length, 5); i++) {
            const file = files[i];
            const filePath = path.join(dir, file);

            try {
              const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
              if (data && typeof data === 'object') {
                results.passedChecks++;
              } else {
                results.failedChecks++;
                results.issues.push(`Invalid data file: ${file}`);
              }
            } catch (error) {
              results.failedChecks++;
              results.issues.push(`Corrupted data file: ${file}`);
            }
          }
        } catch (error) {
          // Directory doesn't exist or can't be read
        }
      }

    } catch (error) {
      results.issues.push(`Data integrity verification failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Verify file permissions
   */
  async verifyPermissions() {
    const results = {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      issues: []
    };

    const criticalPaths = [
      '.claude-work',
      '.claude-work/config',
      '.claude-work/sessions',
      '.claude-work/context',
      '.claude-work/backups'
    ];

    results.totalChecks += criticalPaths.length;

    for (const relPath of criticalPaths) {
      const fullPath = path.join(this.baseDir, relPath);
      try {
        await fs.access(fullPath, fs.constants.R_OK | fs.constants.W_OK);
        results.passedChecks++;
      } catch (error) {
        results.failedChecks++;
        results.issues.push(`Permission denied for: ${relPath}`);
      }
    }

    return results;
  }

  /**
   * Verify performance
   */
  async verifyPerformance() {
    const results = {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      issues: [],
      metrics: {}
    };

    try {
      // Test storage performance
      const StorageEngine = require('../core/StorageEngine');
      const testDir = path.join(this.baseDir, 'temp', 'performance-test');
      const storage = new StorageEngine(testDir);

      const startTime = Date.now();
      await storage.initialize();
      const initTime = Date.now() - startTime;

      results.metrics.initializationTime = initTime;
      results.totalChecks++;

      if (initTime > 5000) { // 5 seconds
        results.failedChecks++;
        results.issues.push(`Slow initialization: ${initTime}ms`);
      } else {
        results.passedChecks++;
      }

      // Test read/write performance
      const testData = { test: 'performance', data: 'x'.repeat(1000) };
      const testFile = path.join(testDir, 'perf-test.json');

      const writeStart = Date.now();
      await storage.writeJsonFile(testFile, testData);
      const writeTime = Date.now() - writeStart;

      const readStart = Date.now();
      await storage.readJsonFile(testFile);
      const readTime = Date.now() - readStart;

      results.metrics.writeTime = writeTime;
      results.metrics.readTime = readTime;
      results.totalChecks += 2;

      if (writeTime > 100) { // 100ms
        results.failedChecks++;
        results.issues.push(`Slow write performance: ${writeTime}ms`);
      } else {
        results.passedChecks++;
      }

      if (readTime > 50) { // 50ms
        results.failedChecks++;
        results.issues.push(`Slow read performance: ${readTime}ms`);
      } else {
        results.passedChecks++;
      }

      // Cleanup
      await fs.rmdir(testDir, { recursive: true });

    } catch (error) {
      results.issues.push(`Performance verification failed: ${error.message}`);
      results.totalChecks++;
      results.failedChecks++;
    }

    return results;
  }

  /**
   * Verify security
   */
  async verifySecurity() {
    const results = {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      issues: []
    };

    try {
      // Check for sensitive data exposure
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /token/i,
        /key.*=.*['"]/i,
        /api[_-]?key/i
      ];

      const filesToCheck = [
        'index.js',
        'core/StorageEngine.js',
        'core/ContextManager.js',
        'cli/CLIInterface.js'
      ];

      results.totalChecks += filesToCheck.length;

      for (const file of filesToCheck) {
        try {
          const filePath = path.join(this.baseDir, file);
          const content = await fs.readFile(filePath, 'utf8');

          let hasSensitiveData = false;
          for (const pattern of sensitivePatterns) {
            if (pattern.test(content)) {
              hasSensitiveData = true;
              break;
            }
          }

          if (hasSensitiveData) {
            results.failedChecks++;
            results.issues.push(`Potential sensitive data in ${file}`);
          } else {
            results.passedChecks++;
          }
        } catch (error) {
          results.failedChecks++;
          results.issues.push(`Could not check ${file} for security issues`);
        }
      }

      // Check file permissions for sensitive files
      const sensitiveFiles = [
        '.claude-work/config/settings.json'
      ];

      results.totalChecks += sensitiveFiles.length;

      for (const file of sensitiveFiles) {
        try {
          const filePath = path.join(this.baseDir, file);
          const stat = await fs.stat(filePath);

          // Check if file is readable by others (security risk)
          const mode = stat.mode;
          if (mode & 0o004) { // Others readable
            results.failedChecks++;
            results.issues.push(`Sensitive file readable by others: ${file}`);
          } else {
            results.passedChecks++;
          }
        } catch (error) {
          results.failedChecks++;
          // File doesn't exist, which is fine for this check
        }
      }

    } catch (error) {
      results.issues.push(`Security verification failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Verify functionality
   */
  async verifyFunctionality() {
    const results = {
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      issues: []
    };

    try {
      // Test core functionality
      const WebDeveloperWorkSkill = require('../index.js');
      const testDir = path.join(this.baseDir, 'temp', 'functionality-test');

      const skill = new WebDeveloperWorkSkill(testDir);

      // Test initialization
      results.totalChecks++;
      try {
        await skill.initialize();
        results.passedChecks++;
      } catch (error) {
        results.failedChecks++;
        results.issues.push(`Initialization failed: ${error.message}`);
        return results;
      }

      // Test session management
      results.totalChecks++;
      try {
        const session = await skill.startSession('Verification Test Session');
        if (session && session.id) {
          results.passedChecks++;

          // Test context management
          results.totalChecks++;
          try {
            await skill.updateContext({
              files: [{ path: '/test.js', content: 'test' }],
              commands: [{ command: 'test', result: 'success' }]
            });
            results.passedChecks++;

            // Test context save
            results.totalChecks++;
            const savedContext = await skill.saveContext();
            if (savedContext) {
              results.passedChecks++;
            } else {
              results.failedChecks++;
              results.issues.push('Context save failed');
            }
          } catch (error) {
            results.failedChecks++;
            results.issues.push(`Context management failed: ${error.message}`);
          }

          // Test session end
          results.totalChecks++;
          const endedSession = await skill.endSession();
          if (endedSession) {
            results.passedChecks++;
          } else {
            results.failedChecks++;
            results.issues.push('Session end failed');
          }
        } else {
          results.failedChecks++;
          results.issues.push('Session creation failed');
        }
      } catch (error) {
        results.failedChecks++;
        results.issues.push(`Session management failed: ${error.message}`);
      }

      // Test backup functionality
      results.totalChecks++;
      try {
        const backup = await skill.createBackup('verification', 'Test backup');
        if (backup && backup.id) {
          results.passedChecks++;
        } else {
          results.failedChecks++;
          results.issues.push('Backup creation failed');
        }
      } catch (error) {
        results.failedChecks++;
        results.issues.push(`Backup functionality failed: ${error.message}`);
      }

      // Cleanup
      await skill.destroy();
      await fs.rmdir(testDir, { recursive: true });

    } catch (error) {
      results.issues.push(`Functionality verification failed: ${error.message}`);
      results.totalChecks++;
      results.failedChecks++;
    }

    return results;
  }

  /**
   * Calculate overall system health
   */
  calculateSystemHealth(results) {
    const successRate = results.passedChecks / results.totalChecks;

    if (successRate >= 0.95) {
      this.systemHealth.status = 'excellent';
    } else if (successRate >= 0.85) {
      this.systemHealth.status = 'good';
    } else if (successRate >= 0.70) {
      this.systemHealth.status = 'warning';
    } else {
      this.systemHealth.status = 'critical';
    }

    // Collect all issues
    this.systemHealth.issues = [];
    for (const [stepName, stepResult] of Object.entries(results.steps)) {
      if (stepResult.issues) {
        this.systemHealth.issues.push(...stepResult.issues);
      }
    }

    // Generate recommendations
    this.systemHealth.recommendations = this.generateRecommendations(results);
  }

  generateRecommendations(results) {
    const recommendations = [];

    // Check for common issues
    const allIssues = this.systemHealth.issues;

    if (allIssues.some(issue => issue.includes('Missing'))) {
      recommendations.push('Run initialization to create missing files and directories');
    }

    if (allIssues.some(issue => issue.includes('Permission'))) {
      recommendations.push('Check and fix file permissions for .claude-work directory');
    }

    if (allIssues.some(issue => issue.includes('Corrupted'))) {
      recommendations.push('Run repair operations to fix corrupted data files');
    }

    if (allIssues.some(issue => issue.includes('Slow'))) {
      recommendations.push('Consider optimizing system performance or upgrading hardware');
    }

    if (allIssues.some(issue => issue.includes('Dependency'))) {
      recommendations.push('Run npm install to install missing dependencies');
    }

    // General recommendations based on success rate
    const successRate = results.passedChecks / results.totalChecks;

    if (successRate < 0.85) {
      recommendations.push('Address critical issues before using the system in production');
    }

    if (successRate >= 0.95) {
      recommendations.push('System is healthy and ready for production use');
    }

    return recommendations;
  }

  /**
   * Generate verification report
   */
  async generateVerificationReport(verificationResults) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks: verificationResults.results.totalChecks,
        passedChecks: verificationResults.results.passedChecks,
        failedChecks: verificationResults.results.failedChecks,
        successRate: ((verificationResults.results.passedChecks / verificationResults.results.totalChecks) * 100).toFixed(2)
      },
      systemHealth: verificationResults.systemHealth,
      detailedResults: verificationResults.results.steps,
      recommendations: verificationResults.systemHealth.recommendations,
      nextSteps: this.generateNextSteps(verificationResults.systemHealth)
    };

    const reportPath = path.join(this.baseDir, 'verification-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n📄 Verification report generated: ${reportPath}`);
    return report;
  }

  generateNextSteps(systemHealth) {
    const steps = [];

    switch (systemHealth.status) {
      case 'excellent':
        steps.push('✅ System is fully operational');
        steps.push('🚀 Ready for production deployment');
        steps.push('📊 Continue monitoring system performance');
        break;

      case 'good':
        steps.push('✅ System is operational with minor issues');
        steps.push('🔧 Address recommended improvements');
        steps.push('📈 Monitor system health regularly');
        break;

      case 'warning':
        steps.push('⚠️  System has significant issues');
        steps.push('🛠️  Address critical issues before production use');
        steps.push('🔄 Run verification again after fixes');
        break;

      case 'critical':
        steps.push('🚨 System has critical issues');
        steps.push('🆘  Immediate attention required');
        steps.push('🔄 Consider system reinitialization');
        break;
    }

    return steps;
  }
}

module.exports = VerificationScript;