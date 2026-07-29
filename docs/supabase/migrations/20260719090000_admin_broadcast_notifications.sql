-- Notifications Manager. The notifications table already existed but
-- only service_role could insert into it — meaning no admin using the
-- normal client could actually send one. This adds a single controlled
-- entry point: a SECURITY DEFINER function that checks the caller is an
-- administrator internally, then fans out one row per matching user in
-- a single INSERT ... SELECT (efficient even for hundreds of users,
-- and avoids opening broad INSERT access on the table itself).
-- Migration: 20260719090000_admin_broadcast_notifications.sql

create or replace function public.send_broadcast_notification(
  target_role text, -- 'everyone' | 'citizen' | 'volunteer' | 'administrator'
  notif_title text,
  notif_message text,
  notif_type text default 'alert'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  sent_count integer;
begin
  if not exists (
    select 1 from public.profiles where id = auth.uid() and role = 'administrator'
  ) then
    raise exception 'Only administrators can send broadcast notifications.';
  end if;

  if notif_type not in ('report', 'ai', 'alert', 'event', 'reward') then
    raise exception 'Invalid notification type: %', notif_type;
  end if;

  insert into public.notifications (user_id, title, message, type)
  select id, notif_title, notif_message, notif_type
  from public.profiles
  where target_role = 'everyone' or role = target_role;

  get diagnostics sent_count = row_count;
  return sent_count;
end;
$$;

grant execute on function public.send_broadcast_notification(text, text, text, text) to authenticated;
