# Content Quality Search Commands
**Quick reference for finding content issues**

---

## Find Placeholder Phone Numbers

```bash
# All 555 placeholder numbers
grep -r "555-\|555)" --include="*.tsx" --include="*.ts" /Users/spencercarroll/pgclosets-store-main/

# Specific patterns
grep -r "(613) 555\|(416) 555" --include="*.tsx" --include="*.ts" .

# With line numbers and context
grep -rn "555" --include="*.tsx" --include="*.ts" . | grep -v "node_modules\|test"
```

---

## Find Example/Test Email Addresses

```bash
# All example.com emails
grep -r "@example\.com" --include="*.tsx" --include="*.ts" .

# Exclude test files
grep -r "@example\.com" --include="*.tsx" --include="*.ts" . | grep -v "__test__\|\.test\.\|\.spec\."

# Find john@example.com specifically
grep -r "john@example\.com" --include="*.tsx" .
```

---

## Find Placeholder Text

```bash
# TBD, TODO, FIXME
grep -ri "tbd\|todo\|fixme" --include="*.tsx" --include="*.ts" --include="*.md" .

# Lorem Ipsum
grep -ri "lorem ipsum\|placeholder" --include="*.tsx" --include="*.ts" .

# Coming Soon
grep -ri "coming soon" --include="*.tsx" --include="*.ts" .
```

---

## Find Pages Without Metadata

```bash
# Find all page.tsx files
find ./app -name "page.tsx" -type f

# Find pages without metadata
find ./app -name "page.tsx" -type f -exec grep -L "metadata" {} \;

# Count pages with metadata
grep -r "metadata.*Metadata" --include="page.tsx" ./app | wc -l
```

---

## Find Images Without Alt Text

```bash
# Find img tags without alt
grep -r "<img" --include="*.tsx" . | grep -v "alt="

# Find Image components without alt
grep -r "<Image" --include="*.tsx" . | grep -v "alt="

# Find empty alt attributes
grep -r 'alt=""' --include="*.tsx" .
```

---

## Find Missing Product Data

```bash
# Products without images
grep -r "image.*null\|image.*undefined" --include="*.json" --include="*.ts" ./data

# Price TBD
grep -r "Price TBD\|TBD" --include="*.ts" ./lib

# Missing descriptions
grep -r "description.*null\|description.*undefined" --include="*.json" ./data
```

---

## Find Brand Name Inconsistencies

```bash
# All variations of brand name
grep -ri "pg closet\|pgcloset\|pg-closet" --include="*.tsx" --include="*.ts" .

# Should be "PG Closets" in content
grep -r "pg closet[^s]" --include="*.tsx" .
```

---

## Check Contact Information

```bash
# Find all phone number patterns
grep -r "([0-9]\{3\}) [0-9]\{3\}-[0-9]\{4\}\|[0-9]\{3\}-[0-9]\{3\}-[0-9]\{4\}" --include="*.tsx" .

# Find email addresses
grep -r "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]\{2,\}" --include="*.tsx" .

# Find addresses (more manual)
grep -ri "ottawa\|ontario\|canada" --include="*.tsx" . | grep -i "address\|location\|street"
```

---

## SEO Content Checks

```bash
# Find all H1 tags
grep -r "<h1" --include="*.tsx" ./app

# Find meta descriptions
grep -r "description:" --include="*.tsx" ./app

# Find title tags
grep -r "title:" --include="*.tsx" ./app

# Check for duplicate titles
grep -rh "title:" --include="*.tsx" ./app | sort | uniq -d
```

---

## Product Content Audit

```bash
# All product references
grep -r "Product\|product" --include="*.tsx" ./app/products

# Product descriptions
grep -r "description" --include="*.json" ./data/products.json

# Product images
grep -r "image\|images" --include="*.json" ./data/products.json

# Product pricing
grep -r "price\|Price" --include="*.json" ./data/products.json
```

---

## Comprehensive Content Scan

```bash
# Everything that might need review
grep -ri "todo\|fixme\|tbd\|placeholder\|example\|test@\|555-\|lorem" \
  --include="*.tsx" \
  --include="*.ts" \
  --include="*.md" \
  . | grep -v "node_modules\|\.test\.\|\.spec\.\|__test__"
```

---

## File Counts

```bash
# Total TSX files
find . -name "*.tsx" -type f | wc -l

# Total page files
find ./app -name "page.tsx" -type f | wc -l

# Total component files
find ./components -name "*.tsx" -type f | wc -l

# Total content files
find ./lib/content -name "*.ts" -type f | wc -l
```

---

## Content Library Check

```bash
# What's in content library
ls -la /Users/spencercarroll/pgclosets-store-main/lib/content/

# Check content exports
grep -r "export" ./lib/content/

# Find content library usage
grep -r "from '@/lib/content'" --include="*.tsx" .
```

---

## Navigation & Links

```bash
# Find all Link components
grep -r "<Link" --include="*.tsx" .

# Find all href attributes
grep -r 'href=' --include="*.tsx" . | head -20

# Find broken internal links (manual review needed)
grep -r 'href="/[^"]*"' --include="*.tsx" .
```

---

## Forms & Inputs

```bash
# All form elements
grep -r "<form\|<Form" --include="*.tsx" .

# All input placeholders
grep -r "placeholder=" --include="*.tsx" .

# Required fields
grep -r "required" --include="*.tsx" ./components/forms
```

---

## Verification After Fixes

```bash
# Should return 0 results after fixes:

# No 555 numbers
grep -r "555-\|555)" --include="*.tsx" --include="*.ts" . | grep -v "test\|spec"

# No example.com emails (except tests)
grep -r "@example\.com" --include="*.tsx" . | grep -v "test\|spec"

# No TBD
grep -ri "tbd" --include="*.ts" --include="*.tsx" . | grep -v "test"

# No Lorem Ipsum
grep -ri "lorem ipsum" --include="*.tsx" .
```

---

## Export Results to File

```bash
# Save search results for review
grep -r "555-\|555)" --include="*.tsx" --include="*.ts" . > placeholder-phones.txt

grep -r "@example\.com" --include="*.tsx" --include="*.ts" . > example-emails.txt

find ./app -name "page.tsx" -type f -exec grep -L "metadata" {} \; > pages-without-metadata.txt
```

---

## Replace Commands (Use with Caution!)

```bash
# Global replace (DRY RUN FIRST with -n flag)
find . -name "*.tsx" -type f -exec sed -i.bak 's/(613) 555-1234/REAL_NUMBER_HERE/g' {} \;

# Review what would change (without changing)
find . -name "*.tsx" -type f -exec grep -l "(613) 555-1234" {} \;

# After replacing, check backup files
find . -name "*.bak" -type f
```

---

## VS Code Search Patterns

If using VS Code:

**Find Placeholder Phones:**
```
(613|416) 555-[0-9]{4}
```

**Find Example Emails:**
```
\w+@example\.com
```

**Find Missing Alt:**
```
<(img|Image)[^>]*(?!alt=)[^>]*>
```

---

## Quick Stats

```bash
# Content quality snapshot
echo "=== Content Quality Stats ==="
echo "Total pages: $(find ./app -name 'page.tsx' | wc -l)"
echo "Pages with metadata: $(grep -r 'metadata.*Metadata' --include='page.tsx' ./app | wc -l)"
echo "Placeholder phones: $(grep -r '555-' --include='*.tsx' . | grep -v test | wc -l)"
echo "Example emails: $(grep -r '@example.com' --include='*.tsx' . | grep -v test | wc -l)"
echo "TBD references: $(grep -ri 'tbd' --include='*.ts' --include='*.tsx' . | grep -v test | wc -l)"
```

---

**Pro Tips:**

1. **Always review results** before bulk changes
2. **Make backups** before global find-replace
3. **Exclude test files** from production content searches
4. **Use -n flag** for line numbers when debugging
5. **Pipe to grep -v** to exclude directories: `| grep -v "node_modules"`
6. **Save results to file** for complex searches: `> results.txt`
7. **Use git diff** to review changes before committing

---

**Last Updated:** 2025-10-04
**Quick Reference for:** Content Quality Team
