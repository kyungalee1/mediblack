-- MediBlack: bookings table
-- Run this in the Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
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
  special_requests text,
  selected_plan text not null,
  price integer not null,
  status text not null default 'PENDING'
);

-- Enable Row Level Security
alter table public.bookings enable row level security;

-- Anonymous insert for no-auth quick booking (public form)
create policy "Allow anonymous insert"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

-- Optional: allow reading own booking by id (for confirmation lookups)
create policy "Allow select by id"
  on public.bookings
  for select
  to anon, authenticated
  using (true);

-- Index for status / date queries (admin later)
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_appointment_date_idx on public.bookings (appointment_date);
