#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "E2E: root=$ROOT_DIR"

echo "1) Build"
npm run build

echo "2) Run unit tests"
npm test

echo "3) Status via node dist"
node dist/index.js dev status

if [ -f release/index-linux ]; then
  echo "4) Linux binary status"
  chmod +x release/index-linux || true
  ./release/index-linux dev status || { echo "linux binary failed"; exit 1; }
fi

if [ -f release/index-win.exe ]; then
  echo "5) Windows binary present (hash):"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum release/index-win.exe || true
  else
    echo "sha256sum not available"
  fi
fi

if command -v sha256sum >/dev/null 2>&1; then
  echo "Verifying checksums (filtered)..."
  grep -E '^[A-Fa-f0-9]{64}' release/checksums.txt > /tmp/checksums-filtered.txt || true
  if [ -s /tmp/checksums-filtered.txt ]; then
    sha256sum -c /tmp/checksums-filtered.txt || { echo "Checksum verification failed"; exit 1; }
  else
    echo "No valid checksum lines to verify"
  fi
else
  echo "No sha256sum available; skipping checksum verification."
fi

echo "E2E OK"
