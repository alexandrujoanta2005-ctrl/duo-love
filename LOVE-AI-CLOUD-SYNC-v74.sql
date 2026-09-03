-- LOVE AI v74 — sincronizare cont completă
-- Rulează o singură dată în proiectul Supabase LOVE AI:
-- qcoprkunssrogmygntzz
-- Supabase > SQL Editor > New query > Run

-- Starea aplicației: profil local, texte, istoric, setări, chat și muzică.
create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "love_ai_app_state_select_own" on public.app_state;
drop policy if exists "love_ai_app_state_insert_own" on public.app_state;
drop policy if exists "love_ai_app_state_update_own" on public.app_state;
drop policy if exists "love_ai_app_state_delete_own" on public.app_state;

create policy "love_ai_app_state_select_own"
on public.app_state for select to authenticated
using (user_id = auth.uid());

create policy "love_ai_app_state_insert_own"
on public.app_state for insert to authenticated
with check (user_id = auth.uid());

create policy "love_ai_app_state_update_own"
on public.app_state for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "love_ai_app_state_delete_own"
on public.app_state for delete to authenticated
using (user_id = auth.uid());

grant select, insert, update, delete on public.app_state to authenticated;

-- Metadatele pozelor. Fișierele sunt ținute separat în Supabase Storage.
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  is_secret boolean not null default false,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists love_ai_photos_user_created_idx
  on public.photos(user_id, created_at desc);

alter table public.photos enable row level security;

drop policy if exists "love_ai_photos_select_own" on public.photos;
drop policy if exists "love_ai_photos_insert_own" on public.photos;
drop policy if exists "love_ai_photos_update_own" on public.photos;
drop policy if exists "love_ai_photos_delete_own" on public.photos;

create policy "love_ai_photos_select_own"
on public.photos for select to authenticated
using (user_id = auth.uid());

create policy "love_ai_photos_insert_own"
on public.photos for insert to authenticated
with check (user_id = auth.uid());

create policy "love_ai_photos_update_own"
on public.photos for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "love_ai_photos_delete_own"
on public.photos for delete to authenticated
using (user_id = auth.uid());

grant select, insert, update, delete on public.photos to authenticated;

-- Bucket privat pentru pozele LOVE AI.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'love-ai-photos',
  'love-ai-photos',
  false,
  8388608,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Fiecare utilizator poate vedea/modifica doar fișierele din folderul său UUID/...
drop policy if exists "love_ai_storage_select_own" on storage.objects;
drop policy if exists "love_ai_storage_insert_own" on storage.objects;
drop policy if exists "love_ai_storage_update_own" on storage.objects;
drop policy if exists "love_ai_storage_delete_own" on storage.objects;

create policy "love_ai_storage_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'love-ai-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "love_ai_storage_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'love-ai-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "love_ai_storage_update_own"
on storage.objects for update to authenticated
using (
  bucket_id = 'love-ai-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'love-ai-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "love_ai_storage_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'love-ai-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
