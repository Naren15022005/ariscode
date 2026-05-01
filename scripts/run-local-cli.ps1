Param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Command = @('dev','status')
)

# Ejecuta los binarios locales en release/ para pruebas rápidas.
$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$cmdStr = if ($Command) { $Command -join ' ' } else { 'dev status' }

$winBin = Join-Path $repoRoot 'release\index-win.exe'
$linuxBin = Join-Path $repoRoot 'release\index-linux'

Write-Host "Comando: $cmdStr"

if (Test-Path $winBin) {
    Write-Host "Ejecutando binario Windows: $winBin $cmdStr"
    try {
        & $winBin @Command
    } catch {
        Write-Host "Error al ejecutar binario Windows:\n$_" -ForegroundColor Red
    }
} else {
    Write-Host "Binario Windows no encontrado en $winBin" -ForegroundColor Yellow
}

if (Get-Command wsl -ErrorAction SilentlyContinue) {
    # Convertir ruta Windows a ruta WSL (/mnt/c/...)
    $drive = $repoRoot.Substring(0,1).ToLower()
    $rest = $repoRoot.Substring(2) -replace '\\','/'
    $wslRepo = "/mnt/$drive$rest"
    $wslBin = "$wslRepo/release/index-linux"
    Write-Host "Intentando ejecutar binario Linux en WSL: $wslBin $cmdStr"
    try {
        wsl bash -lc "chmod +x '$wslBin' 2>/dev/null || true; '$wslBin' $cmdStr"
    } catch {
        Write-Host "Error al ejecutar binario Linux en WSL: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "WSL no disponible. Instala WSL para ejecutar el binario Linux." -ForegroundColor Yellow
}
