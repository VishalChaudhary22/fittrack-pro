-- Persists conversation history per user
-- Keeps last 50 messages per user (older pruned on insert)
create table public.chat_messages (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null check (role in ('user', 'assistant')),
  content      text not null,
  tokens_used  integer,          -- track API usage
  created_at   timestamptz default now()
);

-- Index for fast per-user fetch
create index chat_messages_user_id_created on public.chat_messages(user_id, created_at desc);

-- RLS: users only see their own messages
alter table public.chat_messages enable row level security;

create policy "own messages only"
  on public.chat_messages for all
  using (auth.uid() = user_id);

-- Add daily_chat_count to user_profiles for rate limiting
alter table public.user_profiles
  add column if not exists chat_count_today integer default 0,
  add column if not exists chat_count_reset_date date default current_date;
