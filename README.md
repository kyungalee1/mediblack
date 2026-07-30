# MediBlack (메디블랙)

프리미엄 병원 동행 VIP 서비스 — 가입 없는 빠른 접수 PWA.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** + Framer Motion + Lucide
- **Supabase** (PostgreSQL + RLS)
- **PWA** via `@ducanh2912/next-pwa` + `app/manifest.ts`
- Deploy: **Vercel** (Free Tier)

## Getting started

```bash
npm install
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Project Settings → API 에서 URL / anon key를 `.env.local`에 복사

> Env가 없어도 개발 중에는 mock booking id로 성공 화면까지 진행됩니다.

## Booking funnel

1. 신청자 · 환자 정보  
2. 병원 · 질환 정보  
3. VIP 요금제 (3h / 5h / 8h)  
4. 확인 · 약관 동의 · 제출 → 성공 화면 + PWA 설치 유도

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 (`--webpack`, PWA 플러그인 호환) |
| `npm start` | 프로덕션 실행 |
| `npm run lint` | ESLint |

## Project structure

```
app/
  api/bookings/route.ts   # Supabase insert API
  layout.tsx / page.tsx / manifest.ts / globals.css
components/
  booking/                # Wizard steps + success
  pwa/InstallPrompt.tsx
  ui/                     # Button, Input, Chip…
lib/                      # supabase, types, plans, utils
supabase/schema.sql
public/icons/
```
