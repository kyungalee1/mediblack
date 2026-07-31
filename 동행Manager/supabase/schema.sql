-- 동행 Manager App: managers (지원 신청)
-- MediBlack과 동일한 Supabase 프로젝트에서 실행하세요.
-- bookings 연결 배정은 migration_assignments.sql 을 이어서 실행합니다.

create extension if not exists "pgcrypto";

create table if not exists public.managers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  application_number text not null unique,

  -- 인적사항
  full_name text not null,
  phone text not null,
  email text,
  birth_year text,
  gender text,
  region text not null,

  -- 자격·경력
  certifications text[] not null default '{}',
  other_certification text,
  experience_years text,
  specialty_areas text[] not null default '{}',
  languages text[] not null default '{}',

  -- 활동 가능 조건
  available_days text[] not null default '{}',
  preferred_hospitals text,
  intro text,
  motivation text,

  -- 동의·상태
  agree_privacy boolean not null default false,
  agree_terms boolean not null default false,
  status text not null default 'PENDING',
  -- PENDING | REVIEWING | APPROVED | REJECTED | INACTIVE
  notes text
);

alter table public.managers enable row level security;

create policy "Allow anonymous manager insert"
  on public.managers
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow select managers"
  on public.managers
  for select
  to anon, authenticated
  using (true);

create index if not exists managers_created_at_idx on public.managers (created_at desc);
create index if not exists managers_status_idx on public.managers (status);
create index if not exists managers_application_number_idx on public.managers (application_number);
create index if not exists managers_phone_idx on public.managers (phone);
