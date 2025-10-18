#!/bin/bash

# Script to fix Button href issues by converting to asChild with Link

files=(
  "components/store/cart-drawer.tsx"
  "components/store/hero-section.tsx"
  "blog/page.tsx"
  "blog/[slug]/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    # Add Link import if not present
    if ! grep -q "import.*Link.*from.*next/link" "$file"; then
      # Add after first import line
      sed -i '' '1,/^import / s|^\(import .*\)$|\1\nimport Link from "next/link"|' "$file"
    fi
  fi
done

echo "Script completed. Please manually fix Button href instances to use asChild pattern."
