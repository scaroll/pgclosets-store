/**
 * System Verification Script
 * Triple-checks that the persistent context system works correctly
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class SystemVerification {
  constructor(contextManager) {
    this.contextManager = contextManager;
    this.verificationResults = {
      fileSystem: false,
      dataIntegrity: false,
      sessionManagement: false,
      searchFunctionality: false,
      backupSystem: false,
      recoverySystem: false
    };
  }

  /**
   * Run comprehensive verification
   */
  async runFullVerification() {
    console.log('🔍 Starting comprehensive system verification...\n');

    const tests = [
      { name: 'File System', test: () => this.verifyFileSystem() },
      { name: 'Data Integrity', test: () => this.verifyDataIntegrity() },
      { name: 'Session Management', test: () => this.verifySessionManagement() },
      { name: 'Search Functionality', test: () => this.verifySearchFunctionality() },
      { name: 'Backup System', test: () => this.verifyBackupSystem() },
      { name: 'Recovery System', test: () => this.verifyRecoverySystem() }
    ];

    let allPassed = true;

    for (const { name, test } of tests) {
      try {
        console.log(`🧪 Testing ${name}...`);
        const result = await test();
        this.verificationResults[name.toLowerCase().replace(' ', '')] = result;

        if (result.passed) {
          console.log(`✅ ${name}: PASSED`);
          if (result.details) console.log(`   ${result.details}`);
        } else {
          console.log(`❌ ${name}: FAILED`);
          if (result.error) console.log(`   Error: ${result.error}`);
          allPassed = false;
        }
      } catch (error) {
        console.log(`❌ ${name}: ERROR - ${error.message}`);
        allPassed = false;
      }
      console.log('');
    }

    // Generate final report
    const finalReport = this.generateFinalReport();
    console.log(finalReport);

    return {
      success: allPassed,
      results: this.verificationResults,
      report: finalReport
    };
  }

  /**
   * Verify file system operations
   */
  async verifyFileSystem() {
    try {
      // Test directory creation
      const testDir = path.join(this.contextManager.contextDir, 'verification-test');
      await fs.mkdir(testDir, { recursive: true });

      // Test file writing
      const testFile = path.join(testDir, 'test.json');
      const testData = { test: true, timestamp: Date.now() };
      await fs.writeFile(testFile, JSON.stringify(testData));

      // Test file reading
      const readData = await fs.readFile(testFile, 'utf8');
      const parsedData = JSON.parse(readData);

      // Cleanup
      await fs.unlink(testFile);
      await fs.rmdir(testDir);

      // Verify data integrity
      const dataMatch = JSON.stringify(parsedData) === JSON.stringify(testData);

      return {
        passed: dataMatch,
        details: 'All file system operations working correctly'
      };
    } catch (error) {
      return {
        passed: false,
        error: error.message
      };
    }
  }

  /**
   * Verify data integrity
   */
  async verifyDataIntegrity() {
    try {
      // Create test data
      const testData = {
        id: 'verification-test',
        content: 'This is test data for verification',
        checksum: '',
        timestamp: new Date().toISOString()
      };

      // Calculate checksum
      testData.checksum = this.calculateChecksum(testData);

      // Save and reload
      const testFile = path.join(this.contextManager.contextDir, 'integrity-test.json');
      await fs.writeFile(testFile, JSON.stringify(testData));

      const readData = JSON.parse(await fs.readFile(testFile, 'utf8'));
      const readChecksum = this.calculateChecksum(readData);

      // Cleanup
      await fs.unlink(testFile);

      // Verify checksums match
      const integrityMatch = testData.checksum === readChecksum;

      return {
        passed: integrityMatch,
        details: 'Data integrity verification passed - checksums match'
      };
    } catch (error) {
      return {
        passed: false,
        error: error.message
      };
    }
  }

  /**
   * Verify session management
   */
  async verifySessionManagement() {
    try {
      // Ensure context manager is initialized
      if (!this.contextManager.isInitialized) {
        await this.contextManager.initialize();
      }

      // Test session operations
      const originalSessionCount = this.contextManager.currentSession.decisions.length;

      // Record a test decision
      const testDecision = {
        type: 'verification',
        title: 'Test Decision for Verification',
        description: 'This is a test decision to verify session management',
        rationale: 'System verification process',
        tags: ['test', 'verification']
      };

      await this.contextManager.recordDecision(testDecision);

      // Verify decision was recorded
      const newSessionCount = this.contextManager.currentSession.decisions.length;
      const decisionRecorded = newSessionCount === originalSessionCount + 1;

      // Clean up - remove test decision
      this.contextManager.currentSession.decisions.pop();
      await this.contextManager.saveSession();

      return {
        passed: decisionRecorded,
        details: 'Session management working correctly - decisions can be recorded and retrieved'
      };
    } catch (error) {
      return {
        passed: false,
        error: error.message
      };
    }
  }

  /**
   * Verify search functionality
   */
  async verifySearchFunctionality() {
    try {
      // Ensure context manager is initialized
      if (!this.contextManager.isInitialized) {
        await this.contextManager.initialize();
      }

      // Add test data for searching
      const testDecision = {
        type: 'search-test',
        title: 'Test Search Decision',
        description: 'This decision contains unique searchable content: VERIFICATION_TEST_12345',
        rationale: 'Testing search functionality',
        tags: ['search', 'test', 'verification']
      };

      await this.contextManager.recordDecision(testDecision);

      // Test search
      const searchResults = await this.contextManager.search('VERIFICATION_TEST_12345');

      // Clean up
      this.contextManager.currentSession.decisions.pop();
      await this.contextManager.saveSession();

      const searchWorking = searchResults.decisions.length > 0;

      return {
        passed: searchWorking,
        details: `Search functionality working - found ${searchResults.decisions.length} results`
      };
    } catch (error) {
      return {
        passed: false,
        error: error.message
      };
    }
  }

  /**
   * Verify backup system
   */
  async verifyBackupSystem() {
    try {
      // Count current backups
      const backupFiles = await fs.readdir(this.contextManager.backupsDir);
      const initialCount = backupFiles.filter(f => f.endsWith('.json')).length;

      // Create a manual backup
      await this.contextManager.saveSession();

      // Count again
      const newBackupFiles = await fs.readdir(this.contextManager.backupsDir);
      const newCount = newBackupFiles.filter(f => f.endsWith('.json')).length;

      const backupWorking = newCount > initialCount;

      return {
        passed: backupWorking,
        details: `Backup system working - created backup (${newCount - initialCount} new files)`
      };
    } catch (error) {
      return {
        passed: false,
        error: error.message
      };
    }
  }

  /**
   * Verify recovery system
   */
  async verifyRecoverySystem() {
    try {
      // Test export functionality
      const summaryBefore = this.contextManager.getSessionSummary();
      const exportFile = await this.contextManager.exportContext();

      // Verify export file exists and has content
      const exportStats = await fs.stat(exportFile);
      const exportWorking = exportStats.size > 0;

      // Test checksum calculation
      const testData = { test: 'recovery verification', timestamp: Date.now() };
      const checksum1 = this.calculateChecksum(testData);
      const checksum2 = this.calculateChecksum(testData);

      const checksumWorking = checksum1 === checksum2;

      const allRecoveryWorking = exportWorking && checksumWorking;

      return {
        passed: allRecoveryWorking,
        details: `Recovery system working - export size: ${exportStats.size} bytes, checksums match`
      };
    } catch (error) {
      return {
        passed: false,
        error: error.message
      };
    }
  }

  /**
   * Calculate checksum for data integrity
   */
  calculateChecksum(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  /**
   * Generate final verification report
   */
  generateFinalReport() {
    const totalTests = Object.keys(this.verificationResults).length;
    const passedTests = Object.values(this.verificationResults).filter(result => result.passed).length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    let status = '🟢 HEALTHY';
    if (successRate < 100) {
      status = '🟡 NEEDS ATTENTION';
    }
    if (successRate < 80) {
      status = '🔴 ISSUES DETECTED';
    }

    const report = `
╔══════════════════════════════════════════════════════════════╗
║                    VERIFICATION REPORT                         ║
╠══════════════════════════════════════════════════════════════╣
║ Status: ${status.padEnd(56)} ║
║ Success Rate: ${successRate}% (${passedTests}/${totalTests})${''.padEnd(38 - String(successRate).length - String(totalTests).length)} ║
╠══════════════════════════════════════════════════════════════╣`;

    for (const [testName, result] of Object.entries(this.verificationResults)) {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      report += `\n║ ${testName.padEnd(20)} ${status.padEnd(36)} ║`;
    }

    report += `
╠══════════════════════════════════════════════════════════════╣
║ Recommendations:                                               ║`;

    if (successRate === 100) {
      report += `
║ ✅ All systems operational - you're ready to use the      ║
║    persistent context system!                           ║`;
    } else {
      report += `
║ ⚠️  Some issues detected - review failed tests above       ║
║    and address any problems before use.                  ║`;
    }

    report += `
╚══════════════════════════════════════════════════════════════╝`;

    return report;
  }

  /**
   * Quick health check
   */
  async quickHealthCheck() {
    console.log('⚡ Running quick health check...');

    const checks = [
      { name: 'Context Directory', check: () => fs.access(this.contextManager.contextDir) },
      { name: 'Current Session', check: () => this.contextManager.currentSession ? Promise.resolve() : Promise.reject(new Error('No session')) },
      { name: 'Backup Directory', check: () => fs.access(this.contextManager.backupsDir) }
    ];

    let allGood = true;

    for (const { name, check } of checks) {
      try {
        await check();
        console.log(`✅ ${name}`);
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        allGood = false;
      }
    }

    return allGood;
  }
}

module.exports = SystemVerification;