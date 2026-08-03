# Vercel CLI 배포 헬퍼 (회사망 self-signed SSL 우회)
# 사용: powershell -ExecutionPolicy Bypass -File .\scripts\vercel-prod.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

# 회사 프록시/SSL 검사 시 필요. 공용망에서는 제거해도 됩니다.
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

Write-Host ""
Write-Host "1) 브라우저 로그인 안내가 나오면 링크를 열어 Vercel(GitHub) 계정으로 승인하세요." -ForegroundColor Cyan
Write-Host "2) 로그인 후 Production 배포가 진행됩니다." -ForegroundColor Cyan
Write-Host ""

npx vercel login
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npx vercel --prod --yes
exit $LASTEXITCODE
