-- bookings ↔ managers 배정 (운영·리포트용)
-- 선행: schema.sql (bookings) + migration_managers.sql (managers)

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

create policy "Allow select assignments"
  on public.booking_assignments
  for select
  to anon, authenticated
  using (true);

create policy "Allow insert assignments"
  on public.booking_assignments
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow update assignments"
  on public.booking_assignments
  for update
  to anon, authenticated
  using (true);

create index if not exists booking_assignments_booking_idx
  on public.booking_assignments (booking_id);
create index if not exists booking_assignments_manager_idx
  on public.booking_assignments (manager_id);
create index if not exists booking_assignments_status_idx
  on public.booking_assignments (status);
