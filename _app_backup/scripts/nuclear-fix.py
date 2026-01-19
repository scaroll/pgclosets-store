#!/usr/bin/env python3
"""
Nuclear option: Fix all syntax errors aggressively
"""
import re
from pathlib import Path
from typing import List

BASE_DIR = Path("/Users/spencercarroll/pgclosets-store-main")

def find_all_ts_files() -> List[Path]:
    """Find all TS/TSX files"""
    files = []
    for pattern in ["**/*.ts", "**/*.tsx"]:
        files.extend(BASE_DIR.glob(pattern))
    return [f for f in files if "node_modules" not in str(f) and ".next" not in str(f)]

def fix_commented_console_logs(content: str) -> str:
    """Remove all commented console.log and their dangling objects"""

    # Pattern 1: // console.log(...) with object literal
    # Remove from // console.log to the closing );
    pattern1 = r'// console\.log\([^;]*?(\{[^}]*?\})\s*\)'
    content = re.sub(pattern1, '', content, flags=re.DOTALL)

    # Pattern 2: Dangling object literals after comments
    # Find lines that are just object properties
    lines = content.split('\n')
    fixed_lines = []
    skip_next = False
    in_dangling_object = False

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Check if this is a commented console.log
        if '// console.log' in line:
            # Skip this and check if next lines are dangling
            in_dangling_object = True
            continue

        # Check if we're in a dangling object
        if in_dangling_object:
            # Is this an object property line?
            if re.match(r'^\s*\w+:\s*', stripped) or stripped in ['{', '}', '});', '},', '}):']:
                # Skip it
                continue
            else:
                # End of dangling object
                in_dangling_object = False
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)

    return '\n'.join(fixed_lines)

def fix_unused_imports(content: str) -> str:
    """Remove unused imports"""
    # This is complex - skip for now
    return content

def fix_file(filepath: Path) -> bool:
    """Fix a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original = f.read()

        content = fix_commented_console_logs(original)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")
        return False

def main():
    print("🚀 Nuclear fix: Removing all broken console.log statements...")

    files = find_all_ts_files()
    print(f"📁 Processing {len(files)} files...")

    fixed = 0
    for filepath in files:
        if fix_file(filepath):
            fixed += 1
            print(f"✅ Fixed: {filepath.relative_to(BASE_DIR)}")

    print(f"\n✨ Fixed {fixed} files")

if __name__ == "__main__":
    main()
