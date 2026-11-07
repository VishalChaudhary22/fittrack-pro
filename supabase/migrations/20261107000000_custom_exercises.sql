-- Manual exercises (Workout → Swap → "Add exercise manually").
-- User-created exercises are stored per user and sync across devices via
-- this column, mirroring swap_registry (see 20260517100002_swap_registry.sql).
-- Run in the Supabase SQL editor; the app works from localStorage until
-- this column exists, but cross-device sync needs it.
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS custom_exercises JSONB DEFAULT '[]'::jsonb;
