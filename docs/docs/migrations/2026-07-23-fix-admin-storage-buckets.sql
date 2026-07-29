-- Run this in the Supabase SQL editor.
--
-- src/lib/storage-upload.ts (used by AdminKnowledgeEditorPage,
-- AdminEventEditorPage, AdminReportsPage, and profile-picture upload)
-- uploads to buckets 'report-images', 'article-images', 'event-images',
-- and 'profile-images' — none of which exist in the project yet. Only
-- 'report-evidence' and 'avatars' were ever created, so every one of
-- these uploads currently fails with the same
-- "new row violates row-level security policy" error as the citizen
-- report image upload did.
--
-- This creates the missing buckets with the folder-ownership pattern
-- storage-upload.ts already assumes (folder = auth.uid()).

insert into storage.buckets (id, name, public)
values
  ('report-images', 'report-images', true),
  ('article-images', 'article-images', true),
  ('event-images', 'event-images', true),
  ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read app images" on storage.objects;
create policy "Public read app images" on storage.objects
  for select using (bucket_id in ('report-images','article-images','event-images','profile-images'));

drop policy if exists "Auth upload app images" on storage.objects;
create policy "Auth upload app images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('report-images','article-images','event-images','profile-images')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owner delete app images" on storage.objects;
create policy "Owner delete app images" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('report-images','article-images','event-images','profile-images')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- NOTE: admins uploading article/event images need to pass their own
-- auth.uid() as the `folder` argument to uploadImage()/uploadImages()
-- (already the documented contract in storage-upload.ts) — if any
-- call site passes a hardcoded or empty folder instead, that upload
-- will still fail this policy's foldername check.
