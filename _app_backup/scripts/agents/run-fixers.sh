#!/bin/bash
set -euo pipefail
LOGFILE="$(pwd)/scripts/agents/fixers-run.log"
echo "Run fixers: $(date)" > "$LOGFILE"

echo "Running mixed mismatch fixer..." | tee -a "$LOGFILE"
node scripts/agents/fix-mixed-mismatched-links.js 2>&1 | tee -a "$LOGFILE" || true

echo "Running unused caught errors fixer..." | tee -a "$LOGFILE"
node scripts/agents/fix-unused-caught-errors.js 2>&1 | tee -a "$LOGFILE" || true

echo "Running remove unused Link imports..." | tee -a "$LOGFILE"
node scripts/agents/remove-unused-link-imports.js 2>&1 | tee -a "$LOGFILE" || true

echo "Running eslint..." | tee -a "$LOGFILE"
npx eslint --ext .ts,.tsx,.js,.jsx . 2>&1 | tee -a "$LOGFILE" || true

echo "Running tsc --noEmit..." | tee -a "$LOGFILE"
npx tsc --noEmit 2>&1 | tee -a "$LOGFILE" || true

echo "Done: $(date)" | tee -a "$LOGFILE"

echo "Log written to $LOGFILE"
