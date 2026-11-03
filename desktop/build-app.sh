#!/usr/bin/env bash
# Build DevTools Hub.app (ad-hoc signed, arm64) from the Next.js static export.
# Usage: bash desktop/build-app.sh [--install]
#   --install  also copies the app to /Applications (replaces existing)
#
# Web (Vercel) builds are NOT affected: BUILD_TARGET=desktop is set only for
# the `next build` invocation inside this script.

set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
OG_ROUTE="app/api/og"
OUT_DIR="$ROOT/out"
BUILD_DIR="$ROOT/desktop/.build"
APP_NAME="DevTools Hub"
APP="$BUILD_DIR/$APP_NAME.app"
STAGING="$BUILD_DIR/staging"

command -v pnpm >/dev/null || { echo "ERROR: pnpm not found on PATH" >&2; exit 1; }
command -v swiftc >/dev/null || { echo "ERROR: swiftc not found (install Xcode CLT)" >&2; exit 1; }

echo "==> [1/6] App icon"
if [ ! -f desktop/AppIcon.icns ] || [ desktop/generate_icon.py -nt desktop/AppIcon.icns ]; then
  python3 desktop/generate_icon.py
fi

echo "==> [2/6] Static export (BUILD_TARGET=desktop)"
# app/api/og is an edge route (reads request params) and cannot be exported.
# Stash it for the duration of the desktop build; web builds keep it.
OG_STASHED=0
if [ -d "$OG_ROUTE" ]; then
  mv "$OG_ROUTE" "$ROOT/.og-route-stash"
  OG_STASHED=1
fi
restore_og() {
  if [ "$OG_STASHED" -eq 1 ] && [ -d "$ROOT/.og-route-stash" ]; then
    mv "$ROOT/.og-route-stash" "$OG_ROUTE"
  fi
}
trap restore_og EXIT

export BUILD_TARGET=desktop
export NEXT_PUBLIC_DESKTOP=1
export NEXT_TELEMETRY_DISABLED=1
pnpm build

# Sanity: confirm the export produced the pages we expect.
EXPECTED_PAGES=(
  index.html
  json-formatter/index.html
  jwt-debugger/index.html
  base64/index.html
  text-diff/index.html
  json-diff/index.html
  regex-tester/index.html
  uuid-generator/index.html
  hash-generator/index.html
  url-encoder/index.html
  cron-parser/index.html
)
for page in "${EXPECTED_PAGES[@]}"; do
  [ -f "$OUT_DIR/$page" ] || { echo "ERROR: export missing $page" >&2; exit 1; }
done
echo "    export OK ($(find "$OUT_DIR" -type f | wc -l | tr -d ' ') files)"

echo "==> [3/6] Compiling Swift shell"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
swiftc -O \
  -target arm64-apple-macosx14.0 \
  -parse-as-library \
  -o "$BUILD_DIR/DevToolsHub" \
  desktop/main.swift
codesign -f -s - "$BUILD_DIR/DevToolsHub"

echo "==> [4/6] Assembling .app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$BUILD_DIR/DevToolsHub" "$APP/Contents/MacOS/DevToolsHub"
cp desktop/Info.plist "$APP/Contents/Info.plist"
cp desktop/AppIcon.icns "$APP/Contents/Resources/AppIcon.icns"
ditto "$OUT_DIR" "$APP/Contents/Resources/app"

echo "==> [5/6] Ad-hoc code signature"
codesign -f -s - --deep "$APP"
codesign --verify --strict "$APP" && echo "    signature OK"

# Re-register with LaunchServices so the icon/binding is never stale when the
# app is rebuilt in place (LS caches the first registration for a path).
LSREG="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister"
if [ -x "$LSREG" ]; then
  "$LSREG" -f "$APP" >/dev/null 2>&1 || true
fi

echo "==> [6/6] Done"
echo "    $APP"

if [ "${1:-}" = "--install" ]; then
  # AppleScript-quit a running instance first (stale instance = old bundle).
  osascript -e 'tell application "DevTools Hub" to quit' >/dev/null 2>&1 || true
  sleep 1
  rm -rf "/Applications/$APP_NAME.app"
  ditto "$APP" "/Applications/$APP_NAME.app"
  touch "/Applications/$APP_NAME.app"
  echo "    installed -> /Applications/$APP_NAME.app"
fi
