-- =========================================================
-- EMAILUL PARTENERULUI DIN ACELAȘI CUPLU
-- Rulează o singură dată în Supabase -> SQL Editor
-- =========================================================

create or replace function public.get_my_partner_email()
returns text
language sql
security definer
set search_path = public, auth
as $$
  select u.email::text
  from public.couple_members as me
  join public.couple_members as partner
    on partner.couple_id = me.couple_id
   and partner.user_id <> me.user_id
  join auth.users as u
    on u.id = partner.user_id
  where me.user_id = auth.uid()
  order by partner.joined_at asc
  limit 1;
$$;

revoke all
on function public.get_my_partner_email()
from public;

grant execute
on function public.get_my_partner_email()
to authenticated;
