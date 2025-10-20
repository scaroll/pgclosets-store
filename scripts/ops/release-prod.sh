#!/usr/bin/env bash
set -euo pipefail

# Configuration
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-www.pgclosets.com}"
SECONDARY_DOMAIN="${SECONDARY_DOMAIN:-pgclosets.com}"
SITE_URL="${SITE_URL:-https://www.pgclosets.com}"

mode="${1:-full}"

deploy_and_alias() {
  echo "Building Next.js..." >&2
  npm run build >/dev/null 2>&1 || npm run build

  echo "Deploying to Vercel (prod)..." >&2
  # Capture deployment URL from vercel output
  DEPLOY_OUT=$(vercel --prod --yes || true)
  echo "$DEPLOY_OUT" | sed -n '1,120p' >&2
  DEPLOY_URL=$(echo "$DEPLOY_OUT" | grep -Eo 'https://[^ ]+\.vercel\.app' | tail -n1 || true)
  if [[ -z "$DEPLOY_URL" ]]; then
    echo "Could not detect deployment URL from Vercel output." >&2
    exit 1
  fi

  echo "Setting aliases..." >&2
  vercel alias set "$DEPLOY_URL" "$PRIMARY_DOMAIN"
  vercel alias set "$DEPLOY_URL" "$SECONDARY_DOMAIN"
}

verify() {
  echo "Verifying production deployment at $SITE_URL ..." >&2
  SITE_URL="$SITE_URL" node scripts/ops/verify-deploy.mjs
}

case "$mode" in
  full)
    deploy_and_alias
    verify
    ;;
  alias-only)
    # Expect VERCEL_DEPLOYMENT_URL in env
    if [[ -z "${VERCEL_DEPLOYMENT_URL:-}" ]]; then
      echo "Set VERCEL_DEPLOYMENT_URL to use alias-only mode." >&2
      exit 1
    fi
    vercel alias set "$VERCEL_DEPLOYMENT_URL" "$PRIMARY_DOMAIN"
    vercel alias set "$VERCEL_DEPLOYMENT_URL" "$SECONDARY_DOMAIN"
    ;;
  verify-only)
    verify
    ;;
  *)
    echo "Usage: $0 [full|alias-only|verify-only]" >&2
    exit 2
    ;;
esac

