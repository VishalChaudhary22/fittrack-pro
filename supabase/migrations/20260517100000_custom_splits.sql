-- Migration to add custom split tracking to user_splits
ALTER TABLE public.user_splits
ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS split_definition JSONB DEFAULT '{}'::jsonb;
