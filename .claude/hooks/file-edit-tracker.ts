#!/usr/bin/env npx ts-node
/**
 * File Edit Tracker Hook
 * Runs on PostToolUse to log all file edits
 * Used by build-checker to know which files were modified
 */

import * as fs from 'fs';
import * as path from 'path';

interface ToolUseInput {
  toolName: string;
  toolInput: {
    file_path?: string;
    filePath?: string;
    path?: string;
  };
  toolResult?: any;
}

const LOG_DIR = path.join(__dirname, '..', 'logs');
const EDIT_LOG_PATH = path.join(LOG_DIR, 'file-edits.log');

function ensureLogDir(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function getFilePath(input: ToolUseInput): string | null {
  const { toolInput } = input;
  return toolInput.file_path || toolInput.filePath || toolInput.path || null;
}

function isEditTool(toolName: string): boolean {
  const editTools = ['Edit', 'Write', 'MultiEdit', 'NotebookEdit'];
  return editTools.includes(toolName);
}

function logEdit(filePath: string, operation: string): void {
  ensureLogDir();

  const entry = {
    file: filePath,
    timestamp: new Date().toISOString(),
    operation
  };

  fs.appendFileSync(EDIT_LOG_PATH, JSON.stringify(entry) + '\n');
}

async function main() {
  try {
    // Read input from stdin
    let inputData = '';

    if (process.stdin.isTTY) {
      // Testing mode
      console.log('File edit tracker - no input in TTY mode');
      process.exit(0);
    }

    inputData = fs.readFileSync(0, 'utf-8');
    const input: ToolUseInput = JSON.parse(inputData);

    if (isEditTool(input.toolName)) {
      const filePath = getFilePath(input);
      if (filePath) {
        const operation = input.toolName.toLowerCase().replace('multi', '');
        logEdit(filePath, operation);
      }
    }

    process.exit(0);
  } catch (error) {
    // Fail silently
    process.exit(0);
  }
}

main();
