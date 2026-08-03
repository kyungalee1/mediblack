# MediBlack (메디블랙)

프리미엄 병원 동행 VIP 서비스 — 가입 없는 빠른 접수 PWA.  
하위 경로 **`/manager`** 에서 동행 Manager 지원도 같은 앱·같은 GitHub / Vercel / Supabase로 관리합니다.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** + Framer Motion + Lucide
- **Supabase** (PostgreSQL + RLS)
- **PWA** via `@ducanh2912/next-pwa` + `app/manifest.ts`
- Deploy: **Vercel** (Free Tier) — 단일 프로젝트

## Getting started

```bash
npm install
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

- 보호자 접수: [http://localhost:3000](http://localhost:3000)
- 동행 Manager 지원: [http://localhost:3000/manager](http://localhost:3000/manager)

### Supabase setup

1. Create a free project at [supabase.com](https://supabase.com) (또는 기존 MediBlack 프로젝트 사용)
2. SQL Editor에서 순서대로 실행:
   - `supabase/schema.sql` — bookings
   - `supabase/migration_managers.sql` — managers
   - (선택) `supabase/migration_assignments.sql` — 배정·리포트 연결
3. Project Settings → API 에서 URL / anon key를 `.env.local`에 복사

> Env가 없어도 개발 중에는 mock id로 성공 화면까지 진행됩니다.

## Funnels

**보호자 접수 (`/`)**  
1. 신청자 · 환자 → 2. 병원 · 질환 → 3. VIP 요금제 → 4. 제출

**동행 Manager (`/manager`)**  
1. 인적사항 → 2. 자격·경력 → 3. 활동 조건 → 4. 제출

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
  page.tsx                 # 보호자 접수
  manager/page.tsx         # 동행 Manager 지원
  api/bookings/route.ts
  api/managers/route.ts
components/
  booking/                 # 보호자 위자드
  manager/                 # 매니저 지원 위자드
  pwa/  ui/
lib/                       # supabase, types, manager, plans, utils
supabase/
  schema.sql
  migration_managers.sql
  migration_assignments.sql

```
