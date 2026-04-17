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
 * Fetch the current month's XP leaderboard for all users.
 * Returns an array sorted by total_xp descending.
 * Replaces MOCK_LEADERBOARD in MuscleMapPage.jsx.
 *
 * @returns {Promise<Array>}
 */
export const fetchLeaderboard = async () => {
  const month = getCurrentMonth();
  const { data, error } = await supabase
    .from('monthly_xp_cache')
    .select('*')
    .eq('month', month)
    .order('total_xp', { ascending: false })
    .limit(50); // top 50 is more than enough

  if (error || !data) {
    if (error) console.warn('[XPCache] Fetch failed:', error.message);
    return [];
  }
  if (data.length === 0) {
    console.log('[XPCache] monthly_xp_cache is empty for this month — no cached entries yet.');
    return [];
  }

  return data.map(row => ({
    id: row.user_id,
    name: row.display_name,
    initials: row.avatar,
    tier: row.tier_name,
    totalXP: row.total_xp,
    color: '#FFB59B', // will be overridden by tier color in MuscleMapPage
    muscleXP: {
      chest: row.chest_xp,
      back: row.back_xp,
      shoulders: row.shoulders_xp,
      biceps: row.biceps_xp,
      triceps: row.triceps_xp,
      traps: row.traps_xp,
      quads: row.quads_xp,
      hamstrings: row.hamstrings_xp,
      glutes: row.glutes_xp,
      calves: row.calves_xp,
      abs: row.abs_xp,
      forearms: row.forearms_xp,
    },
  }));
};
