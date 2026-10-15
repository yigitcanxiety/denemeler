#!/bin/zsh
# iOS cloud build + TestFlight upload. EAS asks for the Apple ID login once and then creates
# the bundle id, certificates and the App Store Connect app record itself.
cd "$(dirname "$0")/.." || exit 1
corepack pnpm dlx eas-cli@latest build --platform ios --profile production --auto-submit
