# MediBlack 로컬 환경 빠른 설정
# 사용법: .\scripts\setup-local.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host ""
Write-Host "=== MediBlack 로컬 설정 ===" -ForegroundColor Cyan

if (-not (Test-Path ".\node_modules")) {
  Write-Host "[1/3] npm install 중..." -ForegroundColor Yellow
  npm install
} else {
  Write-Host "[1/3] node_modules 이미 있음 — 건너뜀" -ForegroundColor Green
}

if (-not (Test-Path ".\.env.local")) {
  Copy-Item ".\.env.local.example" ".\.env.local"
  Write-Host "[2/3] .env.local 생성됨" -ForegroundColor Green
  Write-Host ""
  Write-Host "  아직 Supabase 키가 비어 있습니다." -ForegroundColor Yellow
  Write-Host "  1) https://supabase.com/dashboard 에서 프로젝트 생성" -ForegroundColor Yellow
  Write-Host "  2) supabase/schema.sql 실행" -ForegroundColor Yellow
  Write-Host "  3) .env.local 에 URL / anon key 붙여넣기" -ForegroundColor Yellow
  Write-Host "  (키가 없어도 npm run dev 로 UI 테스트는 가능합니다)" -ForegroundColor DarkYellow
  Write-Host ""
  $open = Read-Host "지금 .env.local 을 여시겠습니까? (y/N)"
  if ($open -eq "y" -or $open -eq "Y") {
    notepad .\.env.local
  }
} else {
  Write-Host "[2/3] .env.local 이미 있음" -ForegroundColor Green
}

Write-Host "[3/3] 개발 서버 시작: http://localhost:3000" -ForegroundColor Green
Write-Host "종료하려면 Ctrl+C" -ForegroundColor DarkGray
Write-Host ""
npm run dev
