#!/usr/bin/env bash
set -euo pipefail

TAG=${1:-v0.1.0}

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI 'gh' not found. Install it from https://cli.github.com/"
  exit 1
fi

if [ ! -d release ]; then
  echo "Release directory not found. Run 'npm run build:pkg' first to generate 'release/'."
  exit 1
fi

NOTES=release/RELEASE_NOTES.md
if [ ! -f "$NOTES" ]; then
  echo "Release notes not found: $NOTES"
  exit 1
fi

echo "Creating or updating release $TAG..."
if gh release create "$TAG" release/* -F "$NOTES" --title "ArisCode $TAG"; then
  echo "Release created: $TAG"
else
  echo "Release creation failed; attempting to upload assets to existing release..."
  gh release upload "$TAG" release/* --clobber
  echo "Assets uploaded to existing release $TAG"
fi

echo "Done. You can view the release at: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/$TAG"
