-- MediBlack: 이동수단 컬럼만 추가 (최소 실행용)
-- Supabase SQL Editor에서 이 파일 전체 Run

alter table public.bookings
  add column if not exists transport_method text;

comment on column public.bookings.transport_method is
  '택시 | 대중교통/자차 | 기타(택시비 보호자·환자 결제)';
