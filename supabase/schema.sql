-- MediBlack: bookings table
-- Run this in the Supabase SQL Editor (새 프로젝트)

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_number text not null unique,
  applicant_name text not null,
  applicant_phone text not null,
  relationship text not null,
  patient_name text not null,
  patient_gender text,
  patient_age text,
  patient_phone text,
  hospital_name text not null,
  department text,
  appointment_date date not null,
  appointment_time text,
  medical_condition text,
  transport_method text,
  special_requests text,
  doctor_questions text,
  selected_plan text not null,
  price integer not null,
  status text not null default 'PENDING'
);

alter table public.bookings enable row level security;

create policy "Allow anonymous insert"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow select by id"
  on public.bookings
  for select
  to anon, authenticated
  using (true);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_appointment_date_idx on public.bookings (appointment_date);
create index if not exists bookings_booking_number_idx on public.bookings (booking_number);
