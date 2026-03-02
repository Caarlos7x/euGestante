# Script para rodar a busca do UI/UX Pro Max usando o Python instalado
# A skill foi clonada em skills/ (repo nextlevelbuilder/ui-ux-pro-max-skill)
#
# Uso (na raiz do projeto euGestante-v1):
#   .\run-design-system-search.ps1
#
# Se o python nao for encontrado, rode antes (ou feche e abra o Cursor):
#   $env:Path = [Environment]::GetEnvironmentVariable("Path","User") + ";" + [Environment]::GetEnvironmentVariable("Path","Machine")

$pythonExe = "python"
$scriptDir = "skills\src\ui-ux-pro-max\scripts"
$scriptPath = "skills\src\ui-ux-pro-max\scripts\search.py"

# Garantir PATH com Python (para quando o script e chamado de um terminal novo)
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -like "*Python\Python312*") {
    $env:Path = $userPath + ";" + [Environment]::GetEnvironmentVariable("Path", "Machine")
}

if (-not (Test-Path $scriptPath)) {
    Write-Host "Script nao encontrado: $scriptPath" -ForegroundColor Red
    Write-Host "A pasta skills/ deve existir (git clone do repo ui-ux-pro-max-skill)." -ForegroundColor Yellow
    exit 1
}

Push-Location $scriptDir
try {
    & $pythonExe search.py "healthcare pregnancy maternal wellness app dashboard" --design-system -p "euGestante" -f markdown
} finally {
    Pop-Location
}
