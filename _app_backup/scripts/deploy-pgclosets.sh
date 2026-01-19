#!/usr/bin/env bash
set -euo pipefail

echo "🔎 Pre-deployment validation…"
test -f package.json
jq -re '.scripts.build' package.json >/dev/null
test -f templates/prod/.vercel/project.json
test -f templates/prod/public/robots.txt
test -f templates/prod/public/sitemap.xml

echo "♻️  Restoring production configs…"
mkdir -p .vercel
cp -f templates/prod/.vercel/project.json .vercel/project.json
cp -f templates/prod/public/robots.txt public/robots.txt
cp -f templates/prod/public/sitemap.xml public/sitemap.xml
grep -q "pgclosets.com" public/robots.txt
grep -q "pgclosets.com" public/sitemap.xml

echo "🏗️  Building Next.js…"
npm run build

echo "🚢 Deploying to Vercel production…"
: "${VERCEL_TOKEN:?Set VERCEL_TOKEN in your env}"
: "${VERCEL_ORG_ID:=team_Xzht85INUsoW05STx9DMMyLX}"
: "${VERCEL_PROJECT_ID:=prj_ySW3kS1J66EbmuWRC6q6QN3gww6w}"

npx --yes vercel@latest pull --yes --environment=production \
  --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID"

npx --yes vercel@latest deploy --prod --confirm \
  --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID"

echo "✅ Done."