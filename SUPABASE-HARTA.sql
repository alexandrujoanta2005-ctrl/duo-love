-- =========================================================
-- DUO LOVE v61 - HARTA NOASTRĂ
-- Rulează o singură dată în Supabase > SQL Editor.
-- Nu păstrează istoric: există maximum un rând / utilizator.
-- =========================================================

create table if not exists public.couple_locations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  couple_id uuid not null,
  latitude double precision not null
    check (latitude between -90 and 90),
  longitude double precision not null
    check (longitude between -180 and 180),
  accuracy double precision,
  sharing boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists couple_locations_couple_id_idx
  on public.couple_locations(couple_id);

alter table public.couple_locations enable row level security;

drop policy if exists "couple_locations_select_same_couple"
  on public.couple_locations;

drop policy if exists "couple_locations_insert_own"
  on public.couple_locations;

drop policy if exists "couple_locations_update_own"
  on public.couple_locations;

drop policy if exists "couple_locations_delete_own"
  on public.couple_locations;

create policy "couple_locations_select_same_couple"
on public.couple_locations
for select
to authenticated
using (
  couple_id = my_couple_id()
);

create policy "couple_locations_insert_own"
on public.couple_locations
for insert
to authenticated
with check (
  user_id = auth.uid()
  and couple_id = my_couple_id()
);

create policy "couple_locations_update_own"
on public.couple_locations
for update
to authenticated
using (
  user_id = auth.uid()
)
with check (
  user_id = auth.uid()
  and couple_id = my_couple_id()
);

create policy "couple_locations_delete_own"
on public.couple_locations
for delete
to authenticated
using (
  user_id = auth.uid()
);

grant select, insert, update, delete
on public.couple_locations
to authenticated;
