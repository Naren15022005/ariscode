Param(
    [switch]$Yes
)

if (-not $Yes) {
    Write-Host "Este script restaura los archivos en 'release/' al estado de HEAD (punteros LFS)." -ForegroundColor Yellow
    Write-Host "Ejecuta con -Yes para confirmar (ej: .\restore-release-pointers.ps1 -Yes)" -ForegroundColor Yellow
    exit 0
}

Write-Host "Restaurando archivos en release/ al estado HEAD (punteros LFS)..."
git restore --source=HEAD --staged release/* 2>$null
git restore --source=HEAD release/* 2>$null
Write-Host "Hecho. Revisa con 'git status'."
