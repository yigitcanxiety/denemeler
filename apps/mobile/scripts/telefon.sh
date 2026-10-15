#!/bin/zsh
# Logs in to Expo (if needed) and starts the dev server for Expo Go on a phone.
cd "$(dirname "$0")/.." || exit 1
corepack pnpm exec expo whoami >/dev/null 2>&1 || corepack pnpm exec expo login || exit 1
corepack pnpm exec expo start --go
