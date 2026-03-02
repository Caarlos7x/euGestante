# Adiciona Python 3.12 ao PATH do usuario (permanente)
# Execute como: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\add-python-to-path.ps1
# Depois FECHE O CURSOR POR COMPLETO e abra de novo (nao basta abrir novo terminal).

$pythonDir = "$env:LOCALAPPDATA\Programs\Python\Python312"
$scriptsDir = "$env:LOCALAPPDATA\Programs\Python\Python312\Scripts"

if (-not (Test-Path "$pythonDir\python.exe")) {
    Write-Host "Python nao encontrado em: $pythonDir" -ForegroundColor Red
    Write-Host "Se instalou em outro lugar, edite este script e altere pythonDir." -ForegroundColor Yellow
    exit 1
}

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
# Remove entradas antigas do Python312 se existirem (evita duplicata)
$entries = $userPath -split ';' | Where-Object { $_ -and $_ -notlike "*Python\Python312*" }
$newPath = "$pythonDir;$scriptsDir;" + ($entries -join ';')
[Environment]::SetEnvironmentVariable("Path", $newPath, "User")

Write-Host "PATH do usuario atualizado. Python foi colocado no inicio." -ForegroundColor Green
Write-Host "  $pythonDir"
Write-Host "  $scriptsDir"
Write-Host ""
Write-Host "IMPORTANTE: O Cursor so carrega o PATH quando INICIA." -ForegroundColor Yellow
Write-Host "Voce precisa FECHAR O CURSOR POR COMPLETO (File > Exit ou fechar a janela)" -ForegroundColor Yellow
Write-Host "e abrir o Cursor de novo. So abrir novo terminal nao basta." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para usar python NESTE terminal agora, rode:" -ForegroundColor Cyan
Write-Host '  $env:Path = [Environment]::GetEnvironmentVariable("Path","User") + ";" + [Environment]::GetEnvironmentVariable("Path","Machine")' -ForegroundColor White
Write-Host "  python --version" -ForegroundColor White
