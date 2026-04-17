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
 * Fetch the leaderboard by merging ALL registered users with their cached XP.
 *
 * Strategy:
 * 1. Fetch every row from `user_profiles` (the source of truth for who exists)
 * 2. Fetch this month's `monthly_xp_cache` entries
 * 3. Merge: users with cache entries get their XP; users without get 0 XP
 *
 * This guarantees every registered user appears on every user's leaderboard.
 *
 * @returns {Promise<Array>}
 */
export const fetchLeaderboard = async () => {
  const month = getCurrentMonth();

  // 1. Fetch all registered users
  const { data: users, error: usersErr } = await supabase
    .from('user_profiles')
    .select('id, name, avatar');

  if (usersErr || !users) {
    console.warn('[XPCache] Failed to fetch user_profiles:', usersErr?.message);
    return [];
  }

  // 2. Fetch this month's XP cache entries
  const { data: xpRows, error: xpErr } = await supabase
    .from('monthly_xp_cache')
    .select('*')
    .eq('month', month);

  if (xpErr) console.warn('[XPCache] Failed to fetch monthly_xp_cache:', xpErr.message);

  // Index cache entries by user_id for O(1) lookup
  const xpMap = new Map();
  if (xpRows) {
    for (const row of xpRows) {
      xpMap.set(row.user_id, row);
    }
  }

  const ZERO_MUSCLES = {
    chest: 0, back: 0, shoulders: 0, biceps: 0, triceps: 0, traps: 0,
    quads: 0, hamstrings: 0, glutes: 0, calves: 0, abs: 0, forearms: 0,
  };

  // 3. Merge: every registered user gets a leaderboard entry
  return users.map(u => {
    const cached = xpMap.get(u.id);
    return {
      id: u.id,
      name: cached?.display_name || u.name || 'Athlete',
      initials: cached?.avatar || u.avatar || (u.name || 'U').slice(0, 2).toUpperCase(),
      tier: cached?.tier_name || 'Untrained',
      totalXP: cached?.total_xp || 0,
      color: '#FFB59B',
      muscleXP: cached ? {
        chest: cached.chest_xp, back: cached.back_xp, shoulders: cached.shoulders_xp,
        biceps: cached.biceps_xp, triceps: cached.triceps_xp, traps: cached.traps_xp,
        quads: cached.quads_xp, hamstrings: cached.hamstrings_xp, glutes: cached.glutes_xp,
        calves: cached.calves_xp, abs: cached.abs_xp, forearms: cached.forearms_xp,
      } : { ...ZERO_MUSCLES },
    };
  }).sort((a, b) => b.totalXP - a.totalXP);
};
