-- monthly_xp_cache: public XP leaderboard data, refreshed after each workout
-- One row per user per month. Upserted on conflict.
create table public.monthly_xp_cache (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  month        text not null, -- Format: 'YYYY-MM' e.g. '2026-04'
  total_xp     integer not null default 0,
  chest_xp     integer default 0,
  back_xp      integer default 0,
  shoulders_xp integer default 0,
  biceps_xp    integer default 0,
  triceps_xp   integer default 0,
  traps_xp     integer default 0,
  quads_xp     integer default 0,
  hamstrings_xp integer default 0,
  glutes_xp    integer default 0,
  calves_xp    integer default 0,
  abs_xp       integer default 0,
  forearms_xp  integer default 0,
  display_name text,          -- snapshot of user's name at time of update
  avatar       text,          -- 2-char initials snapshot
  tier_name    text,          -- e.g. 'Gold II' — computed from total_xp at update time
  updated_at   timestamptz default now(),
  unique(user_id, month)
);

-- Public read — leaderboard is visible to all authenticated users
alter table public.monthly_xp_cache enable row level security;

create policy "Anyone authenticated can read XP cache"
  on public.monthly_xp_cache for select
  to authenticated
  using (true);

create policy "Users can only write their own XP cache"
  on public.monthly_xp_cache for insert
  with check (auth.uid() = user_id);

create policy "Users can only update their own XP cache"
  on public.monthly_xp_cache for update
  using (auth.uid() = user_id);
