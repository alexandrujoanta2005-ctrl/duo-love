-- =========================================================
-- DUO LOVE ❤️ - COD DE ACCES PERSONAL
-- Rulează TOT în Supabase -> SQL Editor
-- =========================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.user_access_pins (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  pin_hash text not null,

  enabled boolean not null
    default true,

  failed_attempts integer not null
    default 0,

  locked_until timestamptz,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now()
);

alter table public.user_access_pins
enable row level security;

-- Nu oferim acces direct la hash-ul PIN-ului.
revoke all
on table public.user_access_pins
from anon, authenticated;


-- =========================================================
-- EXISTĂ COD ACTIV?
-- =========================================================

create or replace function public.has_my_access_pin()
returns boolean
language sql
security definer
stable
set search_path = public, auth, extensions
as $$
  select exists (
    select 1
    from public.user_access_pins p
    where p.user_id = auth.uid()
      and p.enabled = true
  );
$$;


-- =========================================================
-- SETEAZĂ / SCHIMBĂ CODUL
-- =========================================================

create or replace function public.set_my_access_pin(
  pin_value text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  if auth.uid() is null then
    raise exception 'Trebuie să fii autentificat.';
  end if;

  if pin_value is null
     or pin_value !~ '^[0-9]{4,6}$' then
    raise exception 'Codul trebuie să conțină între 4 și 6 cifre.';
  end if;

  insert into public.user_access_pins (
    user_id,
    pin_hash,
    enabled,
    failed_attempts,
    locked_until,
    updated_at
  )
  values (
    auth.uid(),
    extensions.crypt(
      pin_value,
      extensions.gen_salt(
        'bf',
        10
      )
    ),
    true,
    0,
    null,
    now()
  )
  on conflict (user_id)
  do update
  set
    pin_hash =
      excluded.pin_hash,

    enabled =
      true,

    failed_attempts =
      0,

    locked_until =
      null,

    updated_at =
      now();

  return true;
end;
$$;


-- =========================================================
-- VERIFICĂ CODUL
-- Max. 5 încercări greșite, apoi pauză 1 minut.
-- =========================================================

create or replace function public.verify_my_access_pin(
  pin_value text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  row_data
    public.user_access_pins%rowtype;

  correct_pin boolean;
begin
  if auth.uid() is null then
    return false;
  end if;

  if pin_value is null
     or pin_value !~ '^[0-9]{4,6}$' then
    return false;
  end if;

  select *
  into row_data
  from public.user_access_pins
  where user_id = auth.uid()
    and enabled = true
  for update;

  if not found then
    return false;
  end if;

  if row_data.locked_until is not null
     and row_data.locked_until > now() then
    return false;
  end if;

  correct_pin :=
    row_data.pin_hash =
    extensions.crypt(
      pin_value,
      row_data.pin_hash
    );

  if correct_pin then

    update public.user_access_pins
    set
      failed_attempts = 0,
      locked_until = null,
      updated_at = now()
    where user_id = auth.uid();

    return true;

  end if;

  update public.user_access_pins
  set
    failed_attempts =
      case
        when failed_attempts >= 4
          then 0
        else failed_attempts + 1
      end,

    locked_until =
      case
        when failed_attempts >= 4
          then now() + interval '1 minute'
        else null
      end,

    updated_at =
      now()
  where user_id = auth.uid();

  return false;
end;
$$;


-- =========================================================
-- DEZACTIVEAZĂ CODUL
-- =========================================================

create or replace function public.disable_my_access_pin()
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  if auth.uid() is null then
    raise exception 'Trebuie să fii autentificat.';
  end if;

  update public.user_access_pins
  set
    enabled = false,
    failed_attempts = 0,
    locked_until = null,
    updated_at = now()
  where user_id = auth.uid();

  return true;
end;
$$;


-- =========================================================
-- PERMISIUNI RPC
-- =========================================================

revoke all
on function public.has_my_access_pin()
from public;

revoke all
on function public.set_my_access_pin(text)
from public;

revoke all
on function public.verify_my_access_pin(text)
from public;

revoke all
on function public.disable_my_access_pin()
from public;


grant execute
on function public.has_my_access_pin()
to authenticated;

grant execute
on function public.set_my_access_pin(text)
to authenticated;

grant execute
on function public.verify_my_access_pin(text)
to authenticated;

grant execute
on function public.disable_my_access_pin()
to authenticated;
