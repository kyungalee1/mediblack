-- 이미 bookings 테이블이 있는 경우 이 스크립트만 실행하세요.
-- Supabase SQL Editor에서 Run

alter table public.bookings
  add column if not exists booking_number text;

alter table public.bookings
  add column if not exists doctor_questions text;

-- 기존 row에 임시 번호 부여 후 NOT NULL / UNIQUE 적용
update public.bookings
set booking_number = 'MB-LEGACY-' || substr(replace(id::text, '-', ''), 1, 8)
where booking_number is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'bookings_booking_number_key'
  ) then
    alter table public.bookings
      add constraint bookings_booking_number_key unique (booking_number);
  end if;
end $$;

alter table public.bookings
  alter column booking_number set not null;

create index if not exists bookings_booking_number_idx
  on public.bookings (booking_number);
