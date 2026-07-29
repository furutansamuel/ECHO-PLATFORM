-- Phase 1 image storage: four public-read buckets, one per content type,
-- per the ECHO roadmap's "Recommended approach" section.
-- Migration: 20260718090000_create_storage_buckets.sql

-- ─── Buckets ────────────────────────────────────────────────────────
-- All four are public-read (images need to display in the app without
-- a signed-URL round trip) with write access restricted per-bucket below.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('report-images',  'report-images',  true, 5242880,  array['image/jpeg','image/png','image/webp']),
  ('article-images', 'article-images', true, 5242880,  array['image/jpeg','image/png','image/webp']),
  ('event-images',   'event-images',   true, 5242880,  array['image/jpeg','image/png','image/webp']),
  ('profile-images', 'profile-images', true, 2097152,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- ─── report-images ──────────────────────────────────────────────────
-- Any authenticated citizen can upload evidence for their own report.
-- Files are stored under `{user_id}/{filename}` so the folder name
-- itself is the ownership check.
drop policy if exists "Public can view report images" on storage.objects;
create policy "Public can view report images"
  on storage.objects for select
  using (bucket_id = 'report-images');

drop policy if exists "Authenticated users can upload report images" on storage.objects;
create policy "Authenticated users can upload report images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'report-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own report images" on storage.objects;
create policy "Users can delete own report images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'report-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─── article-images / event-images ─────────────────────────────────
-- Admin-only writes (these are CMS content, not user-generated), public
-- reads. Checks the real profiles.role column used everywhere else in
-- the app (protected-route.tsx, DashboardLayout.tsx admin nav).
drop policy if exists "Public can view article images" on storage.objects;
create policy "Public can view article images"
  on storage.objects for select
  using (bucket_id = 'article-images');

drop policy if exists "Admins can manage article images" on storage.objects;
create policy "Admins can manage article images"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'article-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  )
  with check (
    bucket_id = 'article-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  );

drop policy if exists "Public can view event images" on storage.objects;
create policy "Public can view event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

drop policy if exists "Admins can manage event images" on storage.objects;
create policy "Admins can manage event images"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'event-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  )
  with check (
    bucket_id = 'event-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrator'
    )
  );

-- ─── profile-images ─────────────────────────────────────────────────
-- Each user manages only their own avatar, stored under `{user_id}/...`.
drop policy if exists "Public can view profile images" on storage.objects;
create policy "Public can view profile images"
  on storage.objects for select
  using (bucket_id = 'profile-images');

drop policy if exists "Users can manage own profile image" on storage.objects;
create policy "Users can manage own profile image"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
