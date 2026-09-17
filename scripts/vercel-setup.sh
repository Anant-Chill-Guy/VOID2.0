#!/usr/bin/env bash
#
# One-time Vercel setup for this repo.
#
#   npm run vercel:setup              link, push env vars, create the schema, deploy
#   npm run vercel:setup -- --skip-deploy
#
# The backend env vars are read out of server/.env and pushed straight into the
# Vercel project. No value is ever echoed to the terminal or passed on a command
# line, so nothing sensitive lands in your shell history or scrollback.
#
# Requires: `npx vercel login` to have been run once, OR the CLI will prompt.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/server/.env"

# Only DATABASE_URL / ADMIN_PASSWORD / AUTH_SECRET are required by the server
# (see server/src/config.js). FRONTEND_ORIGIN is optional — the deployed
# frontend calls the API same-origin, so CORS never comes into play there.
REQUIRED_VARS=(DATABASE_URL ADMIN_PASSWORD AUTH_SECRET)
OPTIONAL_VARS=(FRONTEND_ORIGIN)
TARGETS=(production preview development)

SKIP_DEPLOY=0
[[ "${1:-}" == "--skip-deploy" ]] && SKIP_DEPLOY=1

# Local install if present, otherwise fetch. Pinned to whatever `vercel@latest`
# resolves to at run time; the CLI is deliberately not a package.json dependency
# so every Vercel build does not reinstall it.
if command -v vercel >/dev/null 2>&1; then
  VERCEL=(vercel)
else
  VERCEL=(npx --yes vercel@latest)
fi

step() { printf '\n\033[1m%s\033[0m\n' "$1"; }
fail() { printf '\nError: %s\n' "$1" >&2; exit 1; }

# Reads one KEY=value out of the env file without sourcing it — the file holds
# passwords that may contain characters a shell would try to interpret.
read_env() {
  local key="$1" line
  line="$(grep -E "^[[:space:]]*${key}=" "$ENV_FILE" | tail -n 1 || true)"
  [[ -n "$line" ]] || return 1
  line="${line#*=}"
  line="${line%$'\r'}"
  case "$line" in
    \"*\") line="${line#\"}"; line="${line%\"}" ;;
    \'*\') line="${line#\'}"; line="${line%\'}" ;;
  esac
  printf '%s' "$line"
}

step "Checking server/.env"
[[ -f "$ENV_FILE" ]] || fail "server/.env not found. Copy server/.env.example to server/.env and fill it in."
for name in "${REQUIRED_VARS[@]}"; do
  value="$(read_env "$name" || true)"
  [[ -n "$value" ]] || fail "server/.env is missing $name."
done
echo "  all required variables present"

step "Checking the Vercel CLI"
if ! "${VERCEL[@]}" whoami >/dev/null 2>&1; then
  fail "Not logged in. Run 'npx vercel login' first, then re-run this script."
fi
echo "  logged in as $("${VERCEL[@]}" whoami 2>/dev/null)"

step "Linking the Vercel project"
if [[ -f "$ROOT/.vercel/project.json" ]]; then
  echo "  already linked (.vercel/project.json)"
else
  echo "  no .vercel/project.json yet — the CLI will ask which project to link."
  (cd "$ROOT" && "${VERCEL[@]}" link)
fi

step "Pushing environment variables"
for target in "${TARGETS[@]}"; do
  for name in "${REQUIRED_VARS[@]}" "${OPTIONAL_VARS[@]}"; do
    value="$(read_env "$name" || true)"
    if [[ -z "$value" ]]; then
      echo "  skipped $name ($target) — not set in server/.env"
      continue
    fi
    # Removed first so re-running the script is idempotent rather than an error.
    "${VERCEL[@]}" env rm "$name" "$target" -y >/dev/null 2>&1 || true
    printf '%s' "$value" | "${VERCEL[@]}" env add "$name" "$target" >/dev/null
    echo "  set $name ($target)"
  done
done

step "Applying the Neon schema"
# Idempotent: setup.js is all CREATE ... IF NOT EXISTS.
(cd "$ROOT" && node server/src/setup.js)

if [[ "$SKIP_DEPLOY" == "1" ]]; then
  step "Done (deploy skipped)"
  echo "  run 'npx vercel --prod' when you are ready."
  exit 0
fi

step "Deploying to production"
(cd "$ROOT" && "${VERCEL[@]}" --prod)

step "Done"
cat <<'EOF'
  Check the deployment:
    curl -s https://<your-deployment>/api/registrations | jq length
    curl -s -o /dev/null -w '%{http_code}\n' -X POST https://<your-deployment>/api/register \
      -H 'content-type: application/json' -d '{}'      # expect 422

  Optional: Vercel Functions default to iad1 (Washington DC) while this Neon
  project lives in aws-us-east-2 (Ohio). Setting the project's Function Region
  to cle1 (Cleveland) in Settings -> Functions cuts that round trip.
EOF
