import { supabase } from '../lib/supabaseClient';
import { calcAllMuscleXP, getOverallRank } from '../data/muscleData';

/**
 * Returns the current month string in 'YYYY-MM' format using local time.
 * Matches the date partitioning logic used in calcAllMuscleXP's startOfMonth.
 */
export const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Compute the current user's monthly XP from their workout logs,
 * then upsert into monthly_xp_cache.
 *
 * Called after every workout finish. Non-blocking (fire-and-forget).
 * Keeps the cache warm so future leaderboard fetches are faster.
 *
 * @param {{ workoutLogs, splits, user }} appState
 * @returns {Promise<void>}
 */
export const syncUserXPToCache = async ({ workoutLogs, splits, user }) => {
  if (!user?.id) return;

  try {
    const muscleXP = calcAllMuscleXP(workoutLogs, splits, user.id);
    const overall = getOverallRank(muscleXP);
    const month = getCurrentMonth();

    const payload = {
      user_id: user.id,
      month,
      total_xp: overall.totalXP || 0,
      chest_xp: Math.round(muscleXP.chest || 0),
      back_xp: Math.round(muscleXP.back || 0),
      shoulders_xp: Math.round(muscleXP.shoulders || 0),
      biceps_xp: Math.round(muscleXP.biceps || 0),
      triceps_xp: Math.round(muscleXP.triceps || 0),
      traps_xp: Math.round(muscleXP.traps || 0),
      quads_xp: Math.round(muscleXP.quads || 0),
      hamstrings_xp: Math.round(muscleXP.hamstrings || 0),
      glutes_xp: Math.round(muscleXP.glutes || 0),
      calves_xp: Math.round(muscleXP.calves || 0),
      abs_xp: Math.round(muscleXP.abs || 0),
      forearms_xp: Math.round(muscleXP.forearms || 0),
      display_name: user.name || 'Athlete',
      avatar: user.avatar || user.name?.slice(0, 2).toUpperCase() || '??',
      tier_name: overall.name || 'Untrained',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('monthly_xp_cache')
      .upsert(payload, { onConflict: 'user_id,month' });

    if (error) {
      console.warn('[XPCache] Upsert failed:', error.message);
    } else {
      console.log('[XPCache] ✅ XP synced for', user.name, '→', overall.totalXP, 'total XP');
    }
  } catch (err) {
    // Non-fatal — leaderboard shows stale data, not a crash
    console.warn('[XPCache] Error during XP sync:', err);
  }
};

/**
 * Fetch the leaderboard by computing XP from actual workout_logs in Supabase.
 *
 * Architecture:
 * 1. Fetch ALL registered users from `user_profiles`
 * 2. Fetch ALL `workout_logs` for the current month (RLS allows public read)
 * 3. Compute XP for each user client-side using `calcAllMuscleXP`
 *
 * This is the source of truth — every user's real XP is computed from their
 * actual workout data in the cloud DB. No cache dependency. If User A logs a
 * workout, User B sees the updated XP immediately on their next page load.
 *
 * @param {Array} splits - the splits array (needed for exercise→muscle mapping)
 * @returns {Promise<Array>}
 */
export const fetchLeaderboard = async (splits, targetMonth) => {
  // 1. Fetch all registered users
  const { data: users, error: usersErr } = await supabase
    .from('user_profiles')
    .select('id, name, avatar');

  if (usersErr || !users) {
    console.warn('[Leaderboard] Failed to fetch user_profiles:', usersErr?.message);
    return [];
  }

  // 2. Fetch workout_logs for the target month (defaults to current month)
  let monthStart, monthEnd;
  if (targetMonth) {
    const [yr, mo] = targetMonth.split('-').map(Number);
    monthStart = `${yr}-${String(mo).padStart(2, '0')}-01`;
    const lastDay = new Date(yr, mo, 0).getDate();
    monthEnd = `${yr}-${String(mo).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  } else {
    const som = new Date();
    som.setDate(1);
    som.setHours(0, 0, 0, 0);
    monthStart = som.toISOString().split('T')[0];
    monthEnd = null;
  }

  let logsQuery = supabase
    .from('workout_logs')
    .select('id, user_id, split_id, day_id, day_name, date, exercises, duration_minutes')
    .gte('date', monthStart);
  if (monthEnd) logsQuery = logsQuery.lte('date', monthEnd);

  const { data: allLogs, error: logsErr } = await logsQuery;

  if (logsErr) {
    console.warn('[Leaderboard] Failed to fetch workout_logs:', logsErr.message);
  }

  const logs = allLogs || [];
  console.log(`[Leaderboard] Fetched ${users.length} users, ${logs.length} workout logs this month`);

  // 3. Compute XP for each user from their actual cloud workout data
  return users.map(u => {
    // Map Supabase rows to the format calcAllMuscleXP expects
    const userLogs = logs
      .filter(l => l.user_id === u.id)
      .map(l => ({
        ...l,
        userId: l.user_id,
        splitId: l.split_id,
        dayId: l.day_id,
        dayName: l.day_name,
        durationMinutes: l.duration_minutes,
      }));

    const muscleXP = calcAllMuscleXP(userLogs, splits, u.id, targetMonth);
    const overall = getOverallRank(muscleXP);

    return {
      id: u.id,
      name: u.name || 'Athlete',
      initials: u.avatar || (u.name || 'U').slice(0, 2).toUpperCase(),
      tier: overall.name,
      totalXP: overall.totalXP,
      color: '#FFB59B',
      muscleXP,
    };
  }).sort((a, b) => b.totalXP - a.totalXP);
};
