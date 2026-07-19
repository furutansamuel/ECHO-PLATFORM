-- FAQ Manager — FAQ.tsx currently renders a hardcoded static array with
-- no admin control at all. This creates the real table.
-- Migration: 20260719080000_create_faqs.sql

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 3 and 300),
  answer text not null check (char_length(answer) between 3 and 3000),
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faqs_display_order_idx on public.faqs(display_order);

alter table public.faqs enable row level security;

-- Public can only see visible FAQs — draft/hidden ones stay admin-only.
create policy "Anyone can view visible FAQs"
  on public.faqs for select
  using (is_visible = true);

create policy "Admins can view all FAQs"
  on public.faqs for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );

create policy "Admins can create FAQs"
  on public.faqs for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );

create policy "Admins can update FAQs"
  on public.faqs for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );

create policy "Admins can delete FAQs"
  on public.faqs for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator')
  );

create trigger set_faqs_updated_at
  before update on public.faqs
  for each row execute function public.handle_updated_at();
