-- Admin access to all reports + before/after resolution photos.
-- Migration: 20260718091500_admin_reports_access.sql

-- ─── Admin RLS policies ─────────────────────────────────────────────
-- Existing policies only let a citizen see their own reports, or ones
-- explicitly marked share_with_community. Without this, an admin could
-- not see (let alone verify/resolve/delete) any report a citizen chose
-- to keep private — which defeats the purpose of an admin reports queue.
drop policy if exists "Admins can view all reports" on public.hazard_reports;
create policy "Admins can view all reports"
  on public.hazard_reports
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  );

drop policy if exists "Admins can update all reports" on public.hazard_reports;
create policy "Admins can update all reports"
  on public.hazard_reports
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  );

drop policy if exists "Admins can delete all reports" on public.hazard_reports;
create policy "Admins can delete all reports"
  on public.hazard_reports
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  );

-- ─── Before & After resolution photos ───────────────────────────────
-- "images" (already on the table) serves as the "before" evidence the
-- citizen submitted. This adds a matching "after" set an admin attaches
-- when marking a report Resolved, per the roadmap's Reports checklist.
alter table public.hazard_reports
  add column if not exists resolution_images jsonb not null default '[]'::jsonb,
  add column if not exists resolution_notes text;

comment on column public.hazard_reports.resolution_images is 'Admin-attached "after" photos showing the hazard resolved.';

-- ─── Admin upload of resolution ("after") photos ────────────────────
-- The existing report-images INSERT policy only allows a user to write
-- under their own {auth.uid()} folder. Admins attaching before/after
-- resolution photos need to write into the bucket regardless of folder.
drop policy if exists "Admins can upload any report image" on storage.objects;
create policy "Admins can upload any report image"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'report-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  );
