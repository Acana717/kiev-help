# Повне очищення для Windows (зупиніть dev-сервер перед запуском)
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

foreach ($dir in @(".next", "node_modules")) {
  if (Test-Path $dir) {
    cmd /c "rmdir /s /q `"$dir`"" 2>$null
    if (Test-Path $dir) {
      Rename-Item $dir "$dir.bak_$(Get-Date -Format 'HHmmss')" -Force -ErrorAction SilentlyContinue
    }
  }
}

if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
Write-Host "OK: cache cleared"
