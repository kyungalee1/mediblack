-- Admin dashboard: allow status updates (anon key path)
-- Prefer SUPABASE_SERVICE_ROLE_KEY on the server instead of relying on these policies.
-- Safe to run if policies already exist (drop + recreate).

drop policy if exists "Allow update bookings" on public.bookings;
create policy "Allow update bookings"
  on public.bookings
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Allow update managers" on public.managers;
create policy "Allow update managers"
  on public.managers
  for update
  to anon, authenticated
  using (true)
  with check (true);
