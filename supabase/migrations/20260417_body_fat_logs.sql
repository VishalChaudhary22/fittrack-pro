-- 1. Add target BF% to user profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS body_fat_goal numeric(5,2);

-- 2. New body_fat_logs table
CREATE TABLE IF NOT EXISTS public.body_fat_logs (
  id          text        PRIMARY KEY,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        date        NOT NULL,
  percentage  numeric(5,2) NOT NULL CHECK (percentage >= 2 AND percentage <= 60),
  method      text        NOT NULL DEFAULT 'visual'
                          CHECK (method IN ('inbody','dexa','smart_scale','calipers','navy','visual')),
  notes       text,
  created_at  timestamptz DEFAULT now()
);

-- 3. Index for fast per-user queries ordered by date
CREATE INDEX IF NOT EXISTS body_fat_logs_user_date ON public.body_fat_logs(user_id, date DESC);

-- 4. RLS — users can only read/write their own entries
ALTER TABLE public.body_fat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "body_fat_logs: own data only"
  ON public.body_fat_logs FOR ALL
  USING (auth.uid() = user_id);
