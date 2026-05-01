Param(
  [string]$Tag = "v0.1.0"
)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI 'gh' not found. Install it from https://cli.github.com/"
  exit 1
}

if (-not (Test-Path -Path "release")) {
  Write-Error "Release directory not found. Run 'npm run build:pkg' first to generate 'release/'."
  exit 1
}

$notes = Join-Path (Get-Location) "release\RELEASE_NOTES.md"
if (-not (Test-Path -Path $notes)) {
  Write-Error "Release notes not found: $notes"
  exit 1
}

Write-Host "Creating or updating release $Tag..."
try {
  gh release create $Tag release/* -F $notes --title "ArisCode $Tag"
  Write-Host "Release created: $Tag"
} catch {
  Write-Host "Creation failed; uploading assets to existing release..."
  gh release upload $Tag release/* --clobber
  Write-Host "Assets uploaded to existing release $Tag"
}

Write-Host "Done. View release at: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/$Tag"
