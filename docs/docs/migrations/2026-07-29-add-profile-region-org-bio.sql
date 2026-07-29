-- Run this in the Supabase SQL editor.
-- Fixes: profiles.region, profiles.organization and profiles.bio were
-- already being read by the frontend (ProfilePage.tsx, use-auth.tsx's
-- UserProfile type) but no migration ever created these columns, so
-- they silently never populated for any real user. profiles.phone was
-- already a real column (see docs/echo-supabase-sync.sql) but is added
-- here too with `if not exists` for safety on databases that predate it.

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists region text;
alter table public.profiles add column if not exists organization text;
alter table public.profiles add column if not exists bio text;

comment on column public.profiles.region is 'Citizen-entered community/ward, shown as a badge on ProfilePage and used in the ECHO Pulse dashboard hero.';
comment on column public.profiles.organization is 'Optional citizen-entered organization/affiliation.';
comment on column public.profiles.bio is 'Citizen-entered short bio, shown on ProfilePage in place of the previous auto-generated placeholder text.';
