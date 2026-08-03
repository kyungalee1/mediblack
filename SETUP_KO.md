# MediBlack 실행 · 배포 가이드 (최소 설정)

**GitHub 저장소(이미 생성·푸시 완료):** https://github.com/kyungalee1/mediblack

이 문서는 **직접 해야 할 일만** 남겨 두었습니다.

---

## A. 지금 바로 내 PC에서 실행 (1분, DB 없이 가능)

터미널에서 프로젝트 폴더로 이동한 뒤:

```powershell
cd C:\Users\10124\Desktop\mediBlack
npm install
npm run dev
```

브라우저에서 엽니다.

- 보호자 접수: **http://localhost:3000**
- 동행 Manager 지원: **http://localhost:3000/manager**

- Supabase를 아직 안 연결해도 **접수/지원 → 성공 화면**까지 동작합니다 (개발용 mock).
- 실제 DB 저장은 아래 B단계를 하면 됩니다.

중단: 터미널에서 `Ctrl + C`

---

## B. Supabase 연결 (최초 1회, 약 5분)

### 1) 프로젝트 만들기
1. https://supabase.com/dashboard 접속 후 로그인 (GitHub 로그인 권장)
2. **New project** 클릭
3. 이름: `mediblack` / 지역: `Northeast Asia (Seoul)` 또는 가까운 지역
4. DB 비밀번호를 **안전한 곳에 저장**하고 Create

### 2) 테이블 만들기
1. 왼쪽 **SQL** → **New query**
2. **새 프로젝트면** `supabase/schema.sql` 전체 실행  
   **이미 bookings만 있으면** 필요 시 `supabase/migration_booking_number.sql` 실행
3. **동행 Manager 지원용**으로 `supabase/migration_managers.sql` 실행 (필수)
4. **이동수단·매니저 배정**용으로 `supabase/migration_transport_assign.sql` 실행 (필수)
5. (구버전) 배정만: `supabase/migration_assignments.sql` — 4번으로 대체 가능
6. SQL 내용 **전체 복사 → 붙여넣기 → Run**

### 3) API 키 복사
1. **Project Settings** (톱니바퀴) → **API**
2. 아래 두 값을 복사합니다.
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4) 로컬 환경변수 파일 만들기
프로젝트 폴더에서:

```powershell
copy .env.local.example .env.local
notepad .env.local
```

예시:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

저장 후 `npm run dev`를 **다시** 실행하세요.

---

## B-2. 관리자 대시보드 (`/admin`)

1. `.env.local` (및 Vercel Environment Variables)에 추가:
   ```env
   ADMIN_PASSWORD=원하는비밀번호
   ```
2. (권장) Supabase **service_role** 키도 서버에만 추가:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. service_role 없이 anon만 쓸 경우 SQL Editor에서  
   `supabase/migration_admin_update.sql` 실행 (상태 변경 UPDATE 허용)
4. 접속: `http://localhost:3000/admin` 또는 `https://(배포주소)/admin`
5. 메뉴: 대시보드 · 보호자 접수 · 동행 Manager

---

## C. Vercel 배포 (최초 1회, 약 3분)

GitHub에 코드가 올라가 있으면:

1. https://vercel.com/new 접속 (GitHub로 로그인)
2. **Import** 에서 `mediblack` (또는 안내된 리포지토리) 선택
3. **Environment Variables**에 B-3의 두 값 + `ADMIN_PASSWORD` (+ 선택 `SUPABASE_SERVICE_ROLE_KEY`) 추가
4. **Deploy** 클릭

배포가 끝나면 `https://….vercel.app` 주소가 생깁니다.  
이후 GitHub에 push하면 **자동 재배포**됩니다.

### 홈 화면에 앱 2개 설치 (MediBlack + 동행 Manager)
같은 사이트라도 **다른 화면에서** 각각 추가해야 아이콘이 두 개로 생깁니다.

| 앱 | 열 주소 | 홈 화면 이름 | 아이콘 |
|----|---------|--------------|--------|
| 보호자 접수 | `/` | MediBlack | 금색 마크 |
| 동행 Manager | `/manager` | 동행Manager | 청록 하트 |

- iPhone: 각 주소에서 Safari **공유 → 홈 화면에 추가**
- Android: 각 주소에서 Chrome **앱 설치 / 홈 화면에 추가**
- 이미 하나만 설치돼 있으면 지운 뒤, `/` 와 `/manager` 를 **따로** 다시 추가하세요

### `/manager` 가 404일 때
1. Vercel → **Deployments** 에서 최신 배포가 **Ready(초록)** 인지 확인  
2. 해당 배포 커밋에 `manager` / `partner` 가 포함됐는지 확인  
3. 배포가 실패(Error)면 Build 로그를 열고, Build Command가 `npm run build` 인지 확인  
4. 모바일에서 **시크릿/프라이빗** 으로 `…/manager` 또는 `…/partner` 접속 (옛 PWA 캐시 우회)  
5. 그래도 안 되면 해당 배포에서 **Promote to Production**

---

## D. 체크리스트

| 단계 | 해야 할 일 | 완료 기준 |
|------|------------|-----------|
| 로컬 실행 | `npm run dev` | localhost에서 폼이 보임 |
| Supabase | 프로젝트 + SQL(`bookings`+`managers`) + `.env.local` | `/` 접수 → `bookings`, `/manager` → `managers` |
| Vercel | 기존 mediblack 프로젝트에 push (추가 Import 불필요) | `https://….vercel.app` 및 `/manager` 동작 |
| PWA | 폰 Safari/Chrome에서 사이트 열기 | “홈 화면에 추가” 가능 |

---

## 자주 묻는 문제

**Q. 접수가 실패해요**  
→ `.env.local` 값이 맞는지, SQL을 실행했는지 확인. 개발 서버를 재시작했는지 확인.

**Q. Vercel에서는 되고 로컬만 안 돼요**  
→ 로컬 `.env.local`이 없거나 오타. Vercel env와 동일하게 맞추세요.

**Q. PWA 설치 버튼이 안 보여요**  
→ Chrome(안드로이드)는 HTTPS(또는 localhost)에서만 설치 프롬프트가 뜹니다. iOS는 Safari 공유 → 홈 화면에 추가를 사용하세요.
