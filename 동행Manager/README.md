# 동행 Manager — MediBlack Partner App

MediBlack(메디블랙) 프리미엄 병원 동행 서비스의 **매니저 지원·온보딩 PWA**입니다.  
보호자 접수 앱(MediBlack)과 같은 Supabase 프로젝트를 공유하며, 승인된 매니저를 `booking_assignments`로 접수 건에 연결할 수 있습니다.

## Features

- 가입 없는 4단계 지원 퍼널 (인적사항 → 자격·경력 → 활동 조건 → 확인·제출)
- 요양보호사 / 간호조무사 / 간호사 등 업무 관련 자격 선택
- 지원번호(`DM-YYMMDD-XXXXXX`) 발급 및 성공 화면 + PWA 설치 유도
- MediBlack `bookings` ↔ `managers` 배정 테이블 스키마 포함

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 · Framer Motion · Lucide
- Supabase (PostgreSQL + RLS)
- `@ducanh2912/next-pwa`

## Quick Start

앱 실제 경로:

`C:\Users\10124\Desktop\mediBlack\동행Manager`

Cursor에서 이 폴더를 워크스페이스로 열었다면 **이미 해당 경로에 있습니다.**  
`cd 동행Manager` 를 다시 실행하지 마세요. (하위에 같은 이름 폴더가 없어 오류가 납니다.)

```powershell
# Desktop에서 시작할 때
cd C:\Users\10124\Desktop\mediBlack\동행Manager

# 또는 mediBlack 폴더 안에서
cd .\동행Manager

# 이미 동행Manager 안이라면 바로:
npm install
copy .env.example .env.local
# .env.local 에 MediBlack과 동일한 Supabase URL / ANON KEY 입력
npm run icons
npm run dev -- -p 3001
```

브라우저: [http://localhost:3001](http://localhost:3001)

> MediBlack(`npm run dev`)이 3000을 쓰면 매니저 앱은 **3001**을 권장합니다.

## Supabase Setup

1. 이 앱의 `supabase/schema.sql` 을 실행 → `managers` 테이블 생성
2. MediBlack `../supabase/schema.sql` 로 `bookings` 가 있다면
3. `supabase/migration_assignments.sql` 실행 → `booking_assignments` (배정·리포트 연결)

## Project Structure

```
동행Manager/
├── app/
│   ├── api/managers/route.ts   # 지원 제출 API
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.ts
│   └── page.tsx
├── components/
│   ├── apply/                  # 4-step wizard
│   ├── pwa/InstallPrompt.tsx
│   └── ui/
├── lib/
│   ├── certifications.ts
│   ├── supabase.ts
│   ├── types.ts
│   └── utils.ts
└── supabase/schema.sql
```

## MediBlack 연결 흐름

```
[보호자] MediBlack 접수 → bookings (PENDING)
                              ↓
[운영] 승인된 managers 매칭 → booking_assignments
                              ↓
[매니저] 동행 수행 → report_summary → 보호자 리포트
```

현재 앱은 **매니저 지원 접수**까지 구현되어 있습니다.  
배정 대시보드·리포트 작성 UI는 다음 단계로 확장할 수 있습니다.

## Deploy (Vercel)

1. GitHub에 `동행Manager` 를 푸시(또는 monorepo root 지정)
2. Vercel 프로젝트 생성 → Root Directory: `동행Manager`
3. Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Build: `npm run build` (webpack — next-pwa)

## License

Private — MediBlack
