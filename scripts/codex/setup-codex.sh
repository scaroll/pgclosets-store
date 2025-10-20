#!/usr/bin/env bash
set -euo pipefail

CFG_DIR="${HOME}/.codex"
CFG_FILE="${CFG_DIR}/config.toml"
SAMPLE_FILE=".codex/config.sample.toml"

echo "==> Codex CLI local configuration"
echo "This script will scaffold ~/.codex/config.toml using env variables."
echo "It will NOT store your API key; export it via your shell profile."

read -r -p "Provider name (e.g., openai or myprovider) [myprovider]: " PROVIDER
PROVIDER=${PROVIDER:-myprovider}

read -r -p "Base URL (e.g., https://api.myprovider.com/v1) [https://api.myprovider.com/v1]: " BASE_URL
BASE_URL=${BASE_URL:-https://api.myprovider.com/v1}

read -r -p "Default model (e.g., glm-4.6) [glm-4.6]: " MODEL
MODEL=${MODEL:-glm-4.6}

mkdir -p "$CFG_DIR"

if [[ -f "$SAMPLE_FILE" ]]; then
  # Render sample with provided values but keep API key referenced via env var
  sed -e "s|__PROVIDER__|${PROVIDER}|g" \
      -e "s|__BASE_URL__|${BASE_URL}|g" \
      -e "s|__DEFAULT_MODEL__|${MODEL}|g" \
      "$SAMPLE_FILE" > "$CFG_FILE"
else
  cat > "$CFG_FILE" <<EOF
[core]
default_provider = "${PROVIDER}"
default_model = "${MODEL}"

[provider.${PROVIDER}]
api_key = "\${MYPROVIDER_API_KEY}"
base_url = "${BASE_URL}"
default_model = "${MODEL}"
EOF
fi

chmod 600 "$CFG_FILE" || true

cat <<EONOTE

Done. Wrote: $CFG_FILE

Export your API key in your shell profile (do NOT paste it into files):
  export MYPROVIDER_API_KEY="<your-key>"

Test the CLI (after installing it):
  codex --provider ${PROVIDER} --model ${MODEL}

Tip: Add to package.json scripts for quick launch, e.g.:
  "codex:provider": "codex --provider ${PROVIDER} --model ${MODEL}"

EONOTE

