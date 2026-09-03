-- LOVE AI — configurare baze de date pentru profil și texte
-- Rulează o singură dată în Supabase LOVE AI > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  updated_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text,
  content text,
  is_secret boolean not null default false,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists love_ai_items_user_created_idx
  on public.items(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.items enable row level security;

drop policy if exists "love_ai_profiles_select_own" on public.profiles;
drop policy if exists "love_ai_profiles_insert_own" on public.profiles;
drop policy if exists "love_ai_profiles_update_own" on public.profiles;
drop policy if exists "love_ai_profiles_delete_own" on public.profiles;

create policy "love_ai_profiles_select_own"
on public.profiles for select to authenticated
using (id = auth.uid());

create policy "love_ai_profiles_insert_own"
on public.profiles for insert to authenticated
with check (id = auth.uid());

create policy "love_ai_profiles_update_own"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "love_ai_profiles_delete_own"
on public.profiles for delete to authenticated
using (id = auth.uid());

drop policy if exists "love_ai_items_select_own" on public.items;
drop policy if exists "love_ai_items_insert_own" on public.items;
drop policy if exists "love_ai_items_update_own" on public.items;
drop policy if exists "love_ai_items_delete_own" on public.items;

create policy "love_ai_items_select_own"
on public.items for select to authenticated
using (user_id = auth.uid());

create policy "love_ai_items_insert_own"
on public.items for insert to authenticated
with check (user_id = auth.uid());

create policy "love_ai_items_update_own"
on public.items for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "love_ai_items_delete_own"
on public.items for delete to authenticated
using (user_id = auth.uid());

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.items to authenticated;
