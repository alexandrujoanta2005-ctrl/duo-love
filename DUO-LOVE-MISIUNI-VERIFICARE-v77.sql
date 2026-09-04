-- =============================================================
-- DUO LOVE v77 · MISIUNI VERIFICATE ÎNAINTE DE XP
--
-- Ce face:
-- 1) Prima persoană marchează misiunea ca făcută.
-- 2) A doua persoană din cuplu confirmă.
-- 3) Abia după 2 confirmări se apelează funcția existentă
--    claim_daily_mission(...) și se acordă XP.
--
-- Pentru SOLO:
--   persoana care a făcut misiunea -> trimite la verificare
--   partenerul -> confirmă
--
-- Pentru ÎMPREUNĂ:
--   ambii parteneri confirmă că au făcut misiunea.
--
-- Nu șterge XP-ul existent și nu modifică login-ul/cuplurile.
-- =============================================================

begin;

create table if not exists public.couple_mission_verifications (
  couple_id uuid not null,
  mission_id text not null,
  mission_date date not null default current_date,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (couple_id, mission_id, mission_date, user_id)
);

create index if not exists couple_mission_verifications_lookup_idx
  on public.couple_mission_verifications(couple_id, mission_date, mission_id);

alter table public.couple_mission_verifications enable row level security;

drop policy if exists "mission_verifications_select_same_couple"
  on public.couple_mission_verifications;

create policy "mission_verifications_select_same_couple"
on public.couple_mission_verifications
for select
to authenticated
using (
  couple_id = public.my_couple_id()
);

revoke insert, update, delete
on public.couple_mission_verifications
from authenticated;

grant select
on public.couple_mission_verifications
to authenticated;


-- -------------------------------------------------------------
-- STATUS VERIFICĂRI
-- -------------------------------------------------------------
create or replace function public.get_daily_mission_verification_status()
returns table (
  mission_id text,
  confirmations integer,
  required_confirmations integer,
  my_confirmed boolean,
  other_confirmed boolean,
  verified boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with ctx as (
    select
      auth.uid() as uid,
      public.my_couple_id() as couple_id
  ),
  member_count as (
    select
      c.couple_id,
      greatest(
        1,
        least(
          2,
          count(cm.user_id)::integer
        )
      ) as required_confirmations
    from ctx c
    left join public.couple_members cm
      on cm.couple_id = c.couple_id
    group by c.couple_id
  ),
  verification_counts as (
    select
      v.mission_id,
      count(distinct v.user_id)::integer as confirmations,
      bool_or(v.user_id = c.uid) as my_confirmed
    from public.couple_mission_verifications v
    cross join ctx c
    where v.couple_id = c.couple_id
      and v.mission_date = current_date
    group by v.mission_id
  )
  select
    mc.id::text as mission_id,
    coalesce(vc.confirmations, 0)::integer as confirmations,
    coalesce(m.required_confirmations, 1)::integer as required_confirmations,
    coalesce(vc.my_confirmed, false) as my_confirmed,
    (
      coalesce(vc.confirmations, 0) > 0
      and not coalesce(vc.my_confirmed, false)
    ) as other_confirmed,
    (
      coalesce(vc.confirmations, 0)
      >= coalesce(m.required_confirmations, 1)
    ) as verified
  from public.mission_catalog mc
  cross join ctx c
  left join member_count m
    on m.couple_id = c.couple_id
  left join verification_counts vc
    on vc.mission_id = mc.id::text
  where c.uid is not null
    and c.couple_id is not null;
$$;

grant execute
on function public.get_daily_mission_verification_status()
to authenticated;


-- -------------------------------------------------------------
-- TRIMITE / CONFIRMĂ MISIUNEA
-- -------------------------------------------------------------
create or replace function public.submit_daily_mission_verification(
  p_mission_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_couple_id uuid;
  v_member_count integer := 0;
  v_required integer := 2;
  v_confirmations integer := 0;
  v_claim jsonb := '{}'::jsonb;
  v_exists boolean := false;
begin
  if v_uid is null then
    return jsonb_build_object(
      'success', false,
      'message', 'Trebuie să fii conectat.'
    );
  end if;

  v_couple_id := public.my_couple_id();

  if v_couple_id is null then
    return jsonb_build_object(
      'success', false,
      'message', 'Conectează partenerul înainte de verificarea misiunilor.'
    );
  end if;

  select exists(
    select 1
    from public.mission_catalog mc
    where mc.id::text = p_mission_id
  )
  into v_exists;

  if not v_exists then
    return jsonb_build_object(
      'success', false,
      'message', 'Misiunea nu există în catalog.'
    );
  end if;

  select count(*)::integer
  into v_member_count
  from public.couple_members
  where couple_id = v_couple_id;

  v_required :=
    case
      when v_member_count >= 2 then 2
      else 1
    end;

  insert into public.couple_mission_verifications (
    couple_id,
    mission_id,
    mission_date,
    user_id
  )
  values (
    v_couple_id,
    p_mission_id,
    current_date,
    v_uid
  )
  on conflict do nothing;

  select count(distinct user_id)::integer
  into v_confirmations
  from public.couple_mission_verifications
  where couple_id = v_couple_id
    and mission_id = p_mission_id
    and mission_date = current_date;

  if v_confirmations < v_required then
    return jsonb_build_object(
      'success', true,
      'verified', false,
      'awarded', false,
      'confirmations', v_confirmations,
      'required_confirmations', v_required,
      'message',
        case
          when v_required = 2
            then 'Misiunea a fost trimisă la verificare. Așteaptă confirmarea partenerului.'
          else 'Misiunea a fost confirmată.'
        end
    );
  end if;

  -- Apelează funcția XP existentă doar după verificare.
  begin
    execute
      'select to_jsonb(x)
         from public.claim_daily_mission($1::uuid) x
        limit 1'
    into v_claim
    using p_mission_id;
  exception
    when undefined_function then
      execute
        'select to_jsonb(x)
           from public.claim_daily_mission($1::text) x
          limit 1'
      into v_claim
      using p_mission_id;
  end;

  return
    coalesce(v_claim, '{}'::jsonb)
    || jsonb_build_object(
      'success', true,
      'verified', true,
      'confirmations', v_confirmations,
      'required_confirmations', v_required,
      'message',
        coalesce(
          v_claim->>'message',
          'Misiunea a fost verificată de amândoi.'
        )
    );

exception
  when others then
    return jsonb_build_object(
      'success', false,
      'message', sqlerrm
    );
end;
$$;

grant execute
on function public.submit_daily_mission_verification(text)
to authenticated;

commit;

-- -------------------------------------------------------------
-- TEST RAPID
-- -------------------------------------------------------------
select
  'v77 instalat' as status,
  to_regclass('public.couple_mission_verifications') is not null as tabela_ok,
  to_regprocedure('public.get_daily_mission_verification_status()') is not null as status_rpc_ok,
  to_regprocedure('public.submit_daily_mission_verification(text)') is not null as submit_rpc_ok;
