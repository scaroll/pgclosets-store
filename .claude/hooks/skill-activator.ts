#!/usr/bin/env npx ts-node
/**
 * Skill Auto-Activation Hook
 * Runs on UserPromptSubmit to analyze prompts and suggest relevant skills
 */

import * as fs from 'fs';
import * as path from 'path';

interface SkillRule {
  type: 'domain' | 'guardrail';
  enforcement: 'suggest' | 'warn' | 'block';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  promptTriggers: {
    keywords: string[];
    intentPatterns: string[];
  };
  fileTriggers: {
    pathPatterns: string[];
    contentPatterns: string[];
  };
}

interface SkillRulesConfig {
  version: string;
  skills: Record<string, SkillRule>;
  globalSettings: {
    maxActiveSkills: number;
    logActivations: boolean;
    cacheTimeout: number;
  };
}

interface HookInput {
  prompt: string;
  recentFiles?: string[];
  workingDirectory?: string;
}

function loadSkillRules(): SkillRulesConfig | null {
  const rulesPath = path.join(__dirname, '..', 'skill-rules.json');
  try {
    const content = fs.readFileSync(rulesPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load skill-rules.json:', error);
    return null;
  }
}

function matchesKeywords(prompt: string, keywords: string[]): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return keywords.some(keyword => lowerPrompt.includes(keyword.toLowerCase()));
}

function matchesPatterns(prompt: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(prompt);
    } catch {
      return false;
    }
  });
}

function matchesFilePaths(recentFiles: string[], pathPatterns: string[]): boolean {
  return recentFiles.some(file =>
    pathPatterns.some(pattern => {
      // Convert glob pattern to regex
      const regexPattern = pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\//g, '\\/');
      try {
        const regex = new RegExp(regexPattern);
        return regex.test(file);
      } catch {
        return false;
      }
    })
  );
}

function analyzePrompt(input: HookInput): string[] {
  const rules = loadSkillRules();
  if (!rules) return [];

  const matchedSkills: { name: string; score: number; priority: string }[] = [];

  for (const [skillName, skill] of Object.entries(rules.skills)) {
    let score = 0;

    // Check keyword matches
    if (matchesKeywords(input.prompt, skill.promptTriggers.keywords)) {
      score += 2;
    }

    // Check intent pattern matches
    if (matchesPatterns(input.prompt, skill.promptTriggers.intentPatterns)) {
      score += 3;
    }

    // Check file path matches if recent files provided
    if (input.recentFiles && input.recentFiles.length > 0) {
      if (matchesFilePaths(input.recentFiles, skill.fileTriggers.pathPatterns)) {
        score += 2;
      }
    }

    if (score > 0) {
      matchedSkills.push({ name: skillName, score, priority: skill.priority });
    }
  }

  // Sort by score and priority
  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  matchedSkills.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
           (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
  });

  // Return top skills up to max
  const maxSkills = rules.globalSettings.maxActiveSkills || 3;
  return matchedSkills.slice(0, maxSkills).map(s => s.name);
}

function formatSkillReminder(skills: string[], rules: SkillRulesConfig): string {
  if (skills.length === 0) return '';

  const lines = [
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🎯 SKILL ACTIVATION CHECK',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ''
  ];

  for (const skillName of skills) {
    const skill = rules.skills[skillName];
    if (skill) {
      const icon = skill.type === 'guardrail' ? '⚠️' : '📘';
      lines.push(`${icon} ${skillName}`);
      lines.push(`   ${skill.description}`);
      lines.push('');
    }
  }

  lines.push('💡 Consider using: /skill <name> to load guidelines');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  return lines.join('\n');
}

// Main execution
async function main() {
  try {
    // Read input from stdin (Claude Code passes hook data via stdin)
    let inputData = '';

    if (process.stdin.isTTY) {
      // Running in terminal for testing
      inputData = JSON.stringify({
        prompt: process.argv.slice(2).join(' ') || 'test prompt',
        recentFiles: []
      });
    } else {
      // Running as hook - read from stdin
      inputData = fs.readFileSync(0, 'utf-8');
    }

    const input: HookInput = JSON.parse(inputData);
    const rules = loadSkillRules();

    if (!rules) {
      process.exit(0);
    }

    const matchedSkills = analyzePrompt(input);

    if (matchedSkills.length > 0) {
      const reminder = formatSkillReminder(matchedSkills, rules);
      console.log(reminder);

      // Log activation if enabled
      if (rules.globalSettings.logActivations) {
        const logPath = path.join(__dirname, '..', 'logs', 'skill-activations.log');
        const logDir = path.dirname(logPath);

        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }

        const logEntry = `${new Date().toISOString()} | Skills: ${matchedSkills.join(', ')} | Prompt: ${input.prompt.substring(0, 100)}...\n`;
        fs.appendFileSync(logPath, logEntry);
      }
    }

    process.exit(0);
  } catch (error) {
    // Fail silently to not disrupt Claude Code
    console.error('Skill activator error:', error);
    process.exit(0);
  }
}

main();
