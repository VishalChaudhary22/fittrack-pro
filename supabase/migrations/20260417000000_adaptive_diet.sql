-- Smart Diet Auto-Adjustment: custom override columns
-- Run this in your Supabase SQL Editor

alter table public.user_profiles
  add column if not exists last_kcal_suggestion_date date,
  add column if not exists custom_goal_kcal integer,
  add column if not exists custom_protein_g integer;

-- custom_goal_kcal: null = use computed TDEE-based value; integer = user-accepted override
-- custom_protein_g: null = use formula-based; integer = accepted override
-- last_kcal_suggestion_date: tracks when the last adaptive suggestion was shown/accepted
