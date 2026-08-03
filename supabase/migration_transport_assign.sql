-- 이동수단 컬럼 + 배정 테이블 보강
-- 선행: schema.sql (bookings), migration_managers.sql (managers)

-- 1) 보호자 접수: 이동수단
alter table public.bookings
  add column if not exists transport_method text;

comment on column public.bookings.transport_method is
  '택시 | 대중교통/자차 | 기타(택시비 보호자·환자 결제)';

-- 2) bookings ↔ managers 배정 (없으면 생성)
create table if not exists public.booking_assignments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  manager_id uuid not null references public.managers (id) on delete restrict,
  assigned_at timestamptz not null default now(),
  status text not null default 'ASSIGNED',
  -- ASSIGNED | IN_PROGRESS | COMPLETED | CANCELLED
  report_summary text,
  report_sent_at timestamptz,
  unique (booking_id, manager_id)
);

alter table public.booking_assignments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'booking_assignments' and policyname = 'Allow select assignments'
  ) then
    create policy "Allow select assignments"
      on public.booking_assignments for select
      to anon, authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'booking_assignments' and policyname = 'Allow insert assignments'
  ) then
    create policy "Allow insert assignments"
      on public.booking_assignments for insert
      to anon, authenticated with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'booking_assignments' and policyname = 'Allow update assignments'
  ) then
    create policy "Allow update assignments"
      on public.booking_assignments for update
      to anon, authenticated using (true);
  end if;
end $$;

create index if not exists booking_assignments_booking_idx
  on public.booking_assignments (booking_id);
create index if not exists booking_assignments_manager_idx
  on public.booking_assignments (manager_id);
create index if not exists booking_assignments_status_idx
  on public.booking_assignments (status);

-- 활성 배정은 예약당 1건만 (ASSIGNED / IN_PROGRESS)
create unique index if not exists booking_assignments_one_active_per_booking
  on public.booking_assignments (booking_id)
  where status in ('ASSIGNED', 'IN_PROGRESS');
