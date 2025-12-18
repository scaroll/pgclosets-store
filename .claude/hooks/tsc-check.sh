#!/bin/bash

# TSC Hook for Next.js single-repo projects
# Runs TypeScript type checking on modified TypeScript files

CLAUDE_PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
HOOK_INPUT=$(cat)
SESSION_ID="${session_id:-default}"
CACHE_DIR="$HOME/.claude/tsc-cache/$SESSION_ID"

# Create cache directory
mkdir -p "$CACHE_DIR"

# Extract tool name and input
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // ""')
TOOL_INPUT=$(echo "$HOOK_INPUT" | jq -r '.tool_input // {}')

# Only process file modification tools
case "$TOOL_NAME" in
    Write|Edit|MultiEdit)
        # Extract file paths
        if [ "$TOOL_NAME" = "MultiEdit" ]; then
            FILE_PATHS=$(echo "$TOOL_INPUT" | jq -r '.edits[].file_path // empty')
        else
            FILE_PATHS=$(echo "$TOOL_INPUT" | jq -r '.file_path // empty')
        fi

        # Check if any TypeScript files were modified
        TS_FILES=$(echo "$FILE_PATHS" | grep -E '\.(ts|tsx)$' || true)

        if [ -n "$TS_FILES" ]; then
            echo "TypeScript check running..." >&2

            # Run TypeScript check
            cd "$CLAUDE_PROJECT_DIR"

            # Use project's type-check script if available, otherwise use tsc directly
            if grep -q '"type-check"' package.json 2>/dev/null; then
                CHECK_OUTPUT=$(npm run type-check 2>&1) || true
            else
                CHECK_OUTPUT=$(npx tsc --noEmit 2>&1) || true
            fi

            # Check for TypeScript errors in output
            if echo "$CHECK_OUTPUT" | grep -q "error TS"; then
                ERROR_COUNT=$(echo "$CHECK_OUTPUT" | grep -c "error TS" || echo "0")

                # Save error information for debugging
                echo "$CHECK_OUTPUT" > "$CACHE_DIR/last-errors.txt"

                # Output to stderr for visibility
                {
                    echo ""
                    echo "TypeScript errors found: $ERROR_COUNT"
                    echo ""
                    echo "Error Preview:"
                    echo "$CHECK_OUTPUT" | grep "error TS" | head -10
                    echo ""
                    if [ "$ERROR_COUNT" -gt 10 ]; then
                        echo "... and $((ERROR_COUNT - 10)) more errors"
                    fi
                    echo ""
                    echo "Run 'npm run type-check' to see full output"
                } >&2

                # Exit with code 1 to make stderr visible
                exit 1
            else
                echo "TypeScript check passed" >&2
            fi
        fi
        ;;
esac

# Cleanup old cache directories (older than 7 days)
find "$HOME/.claude/tsc-cache" -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null || true

exit 0
