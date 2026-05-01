Param()
Set-StrictMode -Version Latest

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

Write-Host "E2E root: $root"

Write-Host "1) Build"
npm run build

Write-Host "2) Run tests"
npm test

Write-Host "3) Status via node"
node dist/index.js dev status

if (Test-Path ".\release\index-win.exe") {
  Write-Host "4) Windows binary status"
  .\release\index-win.exe dev status
}

Write-Host "Verifying checksums..."
$checksumFile = Join-Path $root "release\checksums.txt"
if (-Not (Test-Path $checksumFile)) {
  Write-Host "No checksums file found at: $checksumFile" -ForegroundColor Yellow
  exit 0
}

$lines = Get-Content $checksumFile
$ok = $true
foreach ($line in $lines) {
  if ($line -match '^\s*([0-9A-Fa-f]{64})\s+(.+)$') {
    $expected = $matches[1].ToLower()
    $file = $matches[2].Trim()
    $filePath = Join-Path $root "release\$file"
    if (-Not (Test-Path $filePath)) {
      Write-Host "  MISSING: $file" -ForegroundColor Yellow
      $ok = $false
      continue
    }
    $actual = (Get-FileHash $filePath -Algorithm SHA256).Hash.ToLower()
    if ($actual -eq $expected) {
      Write-Host "  OK: $file"
    } else {
      Write-Host "  MISMATCH: $file" -ForegroundColor Red
      Write-Host "    expected: $expected"
      Write-Host "    actual:   $actual"
      $ok = $false
    }
  }
}

if ($ok) { Write-Host "Checksums OK" -ForegroundColor Green; exit 0 } else { Write-Host "Checksums FAILED" -ForegroundColor Red; exit 2 }
