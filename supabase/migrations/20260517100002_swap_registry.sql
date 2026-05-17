-- Migration to add swap_registry to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS swap_registry JSONB DEFAULT '{}'::jsonb;
