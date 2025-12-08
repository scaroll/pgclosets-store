#!/usr/bin/env npx ts-node
/**
 * Error Handling Reminder Hook
 * Runs on Stop event to remind about error handling best practices
 * Non-blocking - just provides gentle reminders
 */

import * as fs from 'fs';
import * as path from 'path';

interface EditLogEntry {
  file: string;
  timestamp: string;
  operation: string;
}

const EDIT_LOG_PATH = path.join(__dirname, '..', 'logs', 'file-edits.log');
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

interface RiskPattern {
  pattern: RegExp;
  description: string;
  reminder: string;
}

const RISK_PATTERNS: RiskPattern[] = [
  {
    pattern: /catch\s*\([^)]*\)\s*\{/g,
    description: 'try-catch blocks',
    reminder: 'Did you add proper error logging in catch blocks?'
  },
  {
    pattern: /async\s+function|async\s*\(/g,
    description: 'async functions',
    reminder: 'Are async operations wrapped in try-catch with error handling?'
  },
  {
    pattern: /prisma\.\w+\.(findMany|findUnique|create|update|delete)/g,
    description: 'Prisma database operations',
    reminder: 'Are Prisma operations wrapped in error handling?'
  },
  {
    pattern: /fetch\s*\(/g,
    description: 'fetch calls',
    reminder: 'Is proper error handling in place for network failures?'
  },
  {
    pattern: /stripe\./gi,
    description: 'Stripe operations',
    reminder: 'Are Stripe errors being caught and logged properly?'
  },
  {
    pattern: /NextResponse\.json\(/g,
    description: 'API responses',
    reminder: 'Are all error cases returning proper HTTP status codes?'
  }
];

function getRecentEdits(): string[] {
  try {
    if (!fs.existsSync(EDIT_LOG_PATH)) {
      return [];
    }

    const content = fs.readFileSync(EDIT_LOG_PATH, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    // Get edits from last 5 minutes
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    const files = lines
      .map(line => {
        try {
          const entry = JSON.parse(line) as EditLogEntry;
          const entryTime = new Date(entry.timestamp).getTime();
          if (entryTime > fiveMinutesAgo) {
            return entry.file;
          }
        } catch {
          return null;
        }
        return null;
      })
      .filter((file): file is string => file !== null);

    return [...new Set(files)];
  } catch {
    return [];
  }
}

function analyzeFileForRisks(filePath: string): RiskPattern[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const foundRisks: RiskPattern[] = [];

    for (const risk of RISK_PATTERNS) {
      if (risk.pattern.test(content)) {
        foundRisks.push(risk);
        // Reset regex lastIndex
        risk.pattern.lastIndex = 0;
      }
    }

    return foundRisks;
  } catch {
    return [];
  }
}

function categorizeFiles(files: string[]): { backend: string[]; frontend: string[] } {
  const backend: string[] = [];
  const frontend: string[] = [];

  for (const file of files) {
    if (file.includes('/api/') || file.includes('/lib/') || file.endsWith('.ts')) {
      backend.push(file);
    }
    if (file.endsWith('.tsx') || file.includes('/components/') || file.includes('/app/')) {
      frontend.push(file);
    }
  }

  return { backend, frontend };
}

function formatReminder(
  backendFiles: string[],
  frontendFiles: string[],
  allRisks: Map<string, RiskPattern[]>
): string | null {
  // Only show reminder if there are risky patterns
  if (allRisks.size === 0) {
    return null;
  }

  const lines = [
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '📋 ERROR HANDLING SELF-CHECK',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ''
  ];

  if (backendFiles.length > 0) {
    lines.push('⚠️  Backend Changes Detected');
    lines.push(`   ${backendFiles.length} file(s) edited`);
    lines.push('');

    // Collect unique reminders for backend
    const backendReminders = new Set<string>();
    for (const file of backendFiles) {
      const risks = allRisks.get(file) || [];
      risks.forEach(r => backendReminders.add(r.reminder));
    }

    backendReminders.forEach(reminder => {
      lines.push(`   ❓ ${reminder}`);
    });

    lines.push('');
    lines.push('   💡 Backend Best Practice:');
    lines.push('      - All errors should be properly logged');
    lines.push('      - API routes should return appropriate status codes');
    lines.push('      - Database operations should have error handling');
  }

  if (frontendFiles.length > 0) {
    if (backendFiles.length > 0) lines.push('');
    lines.push('⚠️  Frontend Changes Detected');
    lines.push(`   ${frontendFiles.length} file(s) edited`);
    lines.push('');

    // Collect unique reminders for frontend
    const frontendReminders = new Set<string>();
    for (const file of frontendFiles) {
      const risks = allRisks.get(file) || [];
      risks.forEach(r => frontendReminders.add(r.reminder));
    }

    frontendReminders.forEach(reminder => {
      lines.push(`   ❓ ${reminder}`);
    });

    lines.push('');
    lines.push('   💡 Frontend Best Practice:');
    lines.push('      - Use error boundaries for component errors');
    lines.push('      - Handle loading and error states in data fetching');
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return lines.join('\n');
}

async function main() {
  try {
    const recentFiles = getRecentEdits();

    if (recentFiles.length === 0) {
      process.exit(0);
    }

    const { backend, frontend } = categorizeFiles(recentFiles);

    // Analyze files for risky patterns
    const allRisks = new Map<string, RiskPattern[]>();

    for (const file of recentFiles) {
      const risks = analyzeFileForRisks(file);
      if (risks.length > 0) {
        allRisks.set(file, risks);
      }
    }

    const reminder = formatReminder(backend, frontend, allRisks);

    if (reminder) {
      console.log(reminder);
    }

    process.exit(0);
  } catch (error) {
    // Fail silently
    process.exit(0);
  }
}

main();
