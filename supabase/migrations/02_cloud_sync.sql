-- Phase Auth-2: Cloud Sync Tables

-- 1. workout_logs: replaces fittrack_workoutLogs
create table public.workout_logs (
  id              text primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  split_id        text,
  day_id          text,
  day_name        text,
  date            date not null,
  notes           text,
  duration_minutes integer,
  exercises       jsonb not null default '[]',
  created_at      timestamptz default now()
);

alter table public.workout_logs enable row level security;
create policy "workout_logs: own data only" on public.workout_logs for all using (auth.uid() = user_id);

-- 2. health_logs: replaces fittrack_healthLogs (weight log)
create table public.health_logs (
  id        text primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  date      date not null,
  weight    numeric(5,1),
  notes     text,
  created_at timestamptz default now()
);

alter table public.health_logs enable row level security;
create policy "health_logs: own data only" on public.health_logs for all using (auth.uid() = user_id);

-- 3. food_logs: replaces fittrack_foodLog
create table public.food_logs (
  id             text primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  date           date not null,
  meal_type      text,
  food_id        text,
  food_name      text,
  serving_id     text,
  serving_label  text,
  grams          numeric(7,2),
  quantity       numeric(5,2),
  calories       numeric(7,1),
  protein        numeric(6,1),
  carbs          numeric(6,1),
  fat            numeric(6,1),
  fiber          numeric(6,1),
  source_type    text default 'database',
  created_at     timestamptz default now()
);

alter table public.food_logs enable row level security;
create policy "food_logs: own data only" on public.food_logs for all using (auth.uid() = user_id);

-- 4. measurements: replaces fittrack_measurements
create table public.measurements (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  chest       numeric(5,1),
  waist       numeric(5,1),
  hips        numeric(5,1),
  bicep       numeric(5,1),
  thigh       numeric(5,1),
  neck        numeric(5,1),
  created_at  timestamptz default now()
);

alter table public.measurements enable row level security;
create policy "measurements: own data only" on public.measurements for all using (auth.uid() = user_id);

-- 5. user_splits: replaces fittrack_splits (user's custom splits)
create table public.user_splits (
  id        text primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  data      jsonb not null,  -- full split object stored as JSON
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_splits enable row level security;
create policy "user_splits: own data only" on public.user_splits for all using (auth.uid() = user_id);

-- 6. readiness_logs: replaces fittrack_readinessLog
create table public.readiness_logs (
  id                 text primary key,
  user_id            uuid not null references auth.users(id) on delete cascade,
  date               date not null,
  sleep_hours        numeric(3,1),
  energy_level       integer,
  soreness_level     integer,
  stress_level       integer,
  score              integer,
  objective_score    integer,
  check_in_complete  boolean default false,
  created_at         timestamptz default now()
);

alter table public.readiness_logs enable row level security;
create policy "readiness_logs: own data only" on public.readiness_logs for all using (auth.uid() = user_id);
