#!/usr/bin/env npx ts-node
/**
 * Build Checker Hook
 * Runs on Stop event to check for TypeScript errors after file edits
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface EditLogEntry {
  file: string;
  timestamp: string;
  operation: 'edit' | 'write' | 'create';
}

interface BuildResult {
  success: boolean;
  errorCount: number;
  errors: string[];
}

const EDIT_LOG_PATH = path.join(__dirname, '..', 'logs', 'file-edits.log');
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function getRecentEdits(): EditLogEntry[] {
  try {
    if (!fs.existsSync(EDIT_LOG_PATH)) {
      return [];
    }

    const content = fs.readFileSync(EDIT_LOG_PATH, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    // Get edits from last 5 minutes
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    return lines
      .map(line => {
        try {
          return JSON.parse(line) as EditLogEntry;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is EditLogEntry => {
        if (!entry) return false;
        const entryTime = new Date(entry.timestamp).getTime();
        return entryTime > fiveMinutesAgo;
      });
  } catch {
    return [];
  }
}

function clearEditLog(): void {
  try {
    if (fs.existsSync(EDIT_LOG_PATH)) {
      fs.writeFileSync(EDIT_LOG_PATH, '');
    }
  } catch {
    // Ignore errors
  }
}

function runTypeCheck(): BuildResult {
  try {
    execSync('npx tsc --noEmit 2>&1', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      timeout: 60000
    });

    return { success: true, errorCount: 0, errors: [] };
  } catch (error: any) {
    const output = error.stdout || error.message || '';
    const errorLines = output
      .split('\n')
      .filter((line: string) => line.includes('error TS') || line.includes(': error:'))
      .slice(0, 10); // Limit to 10 errors

    const errorCount = (output.match(/error TS/g) || []).length;

    return {
      success: false,
      errorCount,
      errors: errorLines
    };
  }
}

function formatBuildReport(result: BuildResult, editedFiles: string[]): string {
  const lines = [
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🔨 BUILD CHECK RESULTS',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ''
  ];

  if (editedFiles.length > 0) {
    lines.push(`📝 Files edited: ${editedFiles.length}`);
    editedFiles.slice(0, 5).forEach(file => {
      lines.push(`   • ${path.relative(PROJECT_ROOT, file)}`);
    });
    if (editedFiles.length > 5) {
      lines.push(`   ... and ${editedFiles.length - 5} more`);
    }
    lines.push('');
  }

  if (result.success) {
    lines.push('✅ TypeScript: No errors found');
  } else {
    lines.push(`❌ TypeScript: ${result.errorCount} error(s) found`);
    lines.push('');

    if (result.errorCount < 5) {
      lines.push('Errors:');
      result.errors.forEach(error => {
        lines.push(`   ${error}`);
      });
    } else {
      lines.push(`⚠️  ${result.errorCount} errors detected.`);
      lines.push('   Consider using: /build-and-fix to resolve all errors');
      lines.push('');
      lines.push('First few errors:');
      result.errors.slice(0, 3).forEach(error => {
        lines.push(`   ${error}`);
      });
    }
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return lines.join('\n');
}

async function main() {
  try {
    const recentEdits = getRecentEdits();

    // Only run if there were recent edits
    if (recentEdits.length === 0) {
      process.exit(0);
    }

    const editedFiles = [...new Set(recentEdits.map(e => e.file))];

    // Check if any TypeScript files were edited
    const hasTypescriptEdits = editedFiles.some(
      file => file.endsWith('.ts') || file.endsWith('.tsx')
    );

    if (!hasTypescriptEdits) {
      process.exit(0);
    }

    console.log('\n⏳ Running TypeScript check...\n');

    const result = runTypeCheck();
    const report = formatBuildReport(result, editedFiles);

    console.log(report);

    // Clear the edit log after checking
    clearEditLog();

    process.exit(0);
  } catch (error) {
    console.error('Build checker error:', error);
    process.exit(0);
  }
}

main();
