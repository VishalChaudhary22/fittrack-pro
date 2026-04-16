-- =========================================================================
-- RLS POLICIES: Enable public read access for leaderboard feature
-- (Temporarily commented out to bypass Supabase db push conflict - already applied)
-- =========================================================================

/*
-- 1. user_profiles: Allow all authenticated users to read any profile
--    (needed so the leaderboard can show all registered players)
CREATE POLICY "user_profiles: public read for leaderboard"
  ON public.user_profiles FOR SELECT
  USING (true);

-- 2. workout_logs: Allow all authenticated users to read exercises field
--    for XP calculation across all users on the leaderboard.
--    Note: the existing "own data only" policy covers INSERT/UPDATE/DELETE,
--    so we only need to add a SELECT policy.
CREATE POLICY "workout_logs: public read for leaderboard"
  ON public.workout_logs FOR SELECT
  USING (true);
*/
