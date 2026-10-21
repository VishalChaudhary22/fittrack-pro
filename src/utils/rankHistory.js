import { calcAllMuscleXP, getOverallRank } from '../data/muscleData';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * 'YYYY-MM-DD' → 'YYYY-MM'
 */
const monthKeyOf = (date) => String(date || '').slice(0, 7);

/**
 * 'YYYY-MM' → 'Feb 2026'
 */
export const formatMonthLabel = (monthKey) => {
  const [year, month] = String(monthKey || '').split('-');
  const index = Number(month) - 1;
  if (!year || index < 0 || index > 11) return monthKey || '';
  return `${MONTH_LABELS[index]} ${year}`;
};

/**
 * Build the per-month XP history for the Olympus "Rank History" timeline.
 *
 * Each month is scored with the same engine that drives the live leaderboard
 * (calcAllMuscleXP), so a historical month and the current month are always
 * measured on the same scale — including the consistency bonus, which
 * depends on the split that was active at the time.
 *
 * @param {Array} workoutLogs - All workout logs for the user
 * @param {Array} splits - The user's splits (needed for exercise→muscle mapping)
 * @param {string} userId
 * @param {object} [user] - The user profile, so the active split (which drives
 *   the consistency bonus) is the one the user actually trains on
 * @returns {Array<{ id: string, label: string, xp: number }>} Oldest month first
 */
export function buildMonthlyRankHistory(workoutLogs, splits, userId, user = null) {
  if (!userId || !Array.isArray(workoutLogs) || workoutLogs.length === 0) return [];

  const months = new Set();
  for (const log of workoutLogs) {
    if (log?.userId !== userId || !log?.date) continue;
    const key = monthKeyOf(log.date);
    if (/^\d{4}-\d{2}$/.test(key)) months.add(key);
  }

  return [...months]
    .sort()
    .map((month) => {
      const muscleXP = calcAllMuscleXP(workoutLogs, splits || [], user || userId, month);
      return {
        id: month,
        label: formatMonthLabel(month),
        xp: Math.round(getOverallRank(muscleXP).totalXP || 0),
      };
    });
}
