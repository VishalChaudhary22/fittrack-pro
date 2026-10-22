-- Kaaya Fit: profile settings that were being written to the client but had
-- no column to land in.
--
--  * water_goal            — the daily water target read by DashboardPage and
--                            DietPage. It was read as user.waterGoal but never
--                            mapped from the profile row, so it always fell
--                            back to the hardcoded 3000 ml default.
--  * use_estimated_tdee    — the "Adaptive TDEE" ON/OFF switch. It was only
--                            stored in localStorage, so the preference was
--                            lost on another device and the write that
--                            DietPage issued was silently dropped by
--                            updateProfile's key map.
--  * manual_tdee_override  — the manual TDEE baseline. It was written under
--                            the name `manualTDEE`, which never matched the
--                            `manualTDEEOverride` the read path expects.
--  * diet_type             — the selected diet plan. The DietPage selector
--                            and the ProfilePage form both read it, but the
--                            ProfilePage save payload never included it.

alter table public.user_profiles
  add column if not exists water_goal integer default 3000,
  add column if not exists use_estimated_tdee boolean default false,
  add column if not exists manual_tdee_override integer,
  add column if not exists diet_type text;
