create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'teacher')),
  grade text not null check (grade in ('10', '11', '12', 'university', 'other')),
  referral_source text not null check (referral_source in ('school', 'friend', 'social', 'search', 'other')),
  onboarding_completed_at timestamptz not null default now()
);

create table public.lab_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lab_key text not null check (lab_key in ('chemistry_titration', 'biology_onion_epidermis', 'chemistry_intro')),
  practice_completed boolean not null default false,
  exam_completed boolean not null default false,
  best_exam_score integer check (best_exam_score between 0 and 100),
  latest_completed_at timestamptz,
  primary key (user_id, lab_key)
);

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.lab_progress to authenticated;

alter table public.profiles enable row level security;
alter table public.lab_progress enable row level security;

create policy "Own profile read" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Own profile insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Own profile update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Own progress read" on public.lab_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own progress insert" on public.lab_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own progress update" on public.lab_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create function public.record_lab_progress(p_lab_key text, p_mode text, p_score integer default null)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if (select auth.uid()) is null or p_lab_key not in ('chemistry_titration', 'biology_onion_epidermis', 'chemistry_intro')
    or p_mode not in ('latihan', 'ujian') or (p_mode = 'ujian' and (p_score is null or p_score not between 0 and 100))
    or (p_mode = 'latihan' and p_score is not null) then
    raise exception 'Invalid progress input';
  end if;
  insert into public.lab_progress (user_id, lab_key, practice_completed, exam_completed, best_exam_score, latest_completed_at)
  values ((select auth.uid()), p_lab_key, p_mode = 'latihan', p_mode = 'ujian', p_score, now())
  on conflict (user_id, lab_key) do update set
    practice_completed = public.lab_progress.practice_completed or excluded.practice_completed,
    exam_completed = public.lab_progress.exam_completed or excluded.exam_completed,
    best_exam_score = greatest(public.lab_progress.best_exam_score, excluded.best_exam_score),
    latest_completed_at = now();
end;
$$;
revoke all on function public.record_lab_progress(text, text, integer) from public;
grant execute on function public.record_lab_progress(text, text, integer) to authenticated;
