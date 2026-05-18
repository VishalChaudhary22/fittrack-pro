export const OVERALL_XPS = [
  { name: 'Untrained', minXP: 0 },
  { name: 'Bronze I', minXP: 2000 },
  { name: 'Bronze II', minXP: 5000 },
  { name: 'Bronze III', minXP: 10000 },
  { name: 'Silver I', minXP: 20000 },
  { name: 'Silver II', minXP: 35000 },
  { name: 'Silver III', minXP: 50000 },
  { name: 'Gold I', minXP: 70000 },
  { name: 'Gold II', minXP: 95000 },
  { name: 'Gold III', minXP: 125000 },
  { name: 'Platinum', minXP: 160000 },
  { name: 'Diamond', minXP: 200000 },
  { name: 'Master', minXP: 250000 },
  { name: 'Legend', minXP: 320000 }
];

export function getRankData(totalXP: number) {
  let rank = OVERALL_XPS[0];
  for (const tier of OVERALL_XPS) {
    if (totalXP >= tier.minXP) rank = tier;
    else break;
  }
  const idx = OVERALL_XPS.indexOf(rank);
  const next = OVERALL_XPS[idx + 1] || rank;
  const nextXP = next.minXP;

  let progressPct = 100;
  let xpToGo = 0;
  let nextTierName = rank.name;

  if (nextXP > rank.minXP) {
    const range = nextXP - rank.minXP;
    const current = totalXP - rank.minXP;
    progressPct = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
    xpToGo = nextXP - totalXP;
    nextTierName = next.name;
  }
  return { tier: rank.name, xp: totalXP, nextXp: nextXP, progressPct, xpToGo, nextTierName };
}

export const C = {
  surface: "#131315", surfaceLowest: "#0e0e10", surfaceLow: "#1b1b1d",
  surfaceContainer: "#201f21", surfaceHigh: "#2a2a2c", surfaceHighest: "#353437",
  onSurface: "#e5e1e4", onSurfaceVariant: "#e3bfb3",
  primary: "#ffb59b", primaryContainer: "#f85f1b", onPrimary: "#5b1a00",
};

export const DIGEST_TIME_ZONE = "Asia/Kolkata";
export const MUSCLE_KEYS = [
  "chest", "back", "shoulders", "biceps", "triceps", "traps",
  "quads", "hamstrings", "glutes", "calves", "abs", "forearms",
];
export const MUSCLE_LABELS: Record<string, string> = {
  chest: "Chest", back: "Back", shoulders: "Shoulders", biceps: "Biceps", triceps: "Triceps",
  traps: "Traps", quads: "Quads", hamstrings: "Hamstrings", glutes: "Glutes", calves: "Calves",
  abs: "Abs", forearms: "Forearms", general: "General"
};
const DISPLAY_TO_ID: Record<string, string> = {
  chest: "chest", pecs: "chest", pectorals: "chest", "upper chest": "chest",
  back: "back", lats: "back", lat: "back", "lower back": "back",
  shoulders: "shoulders", shoulder: "shoulders", delts: "shoulders", "rear delts": "shoulders",
  biceps: "biceps", bicep: "biceps",
  triceps: "triceps", tricep: "triceps",
  quads: "quads", quad: "quads", quadriceps: "quads", legs: "quads", adductors: "quads",
  hamstrings: "hamstrings", hamstring: "hamstrings", hams: "hamstrings",
  glutes: "glutes", glute: "glutes", abductors: "glutes",
  calves: "calves", calf: "calves",
  abs: "abs", core: "abs", obliques: "abs",
  traps: "traps", trapezius: "traps",
  forearms: "forearms", forearm: "forearms",
};

export type WorkoutSet = { reps?: number | string | null; weight?: number | string | null; };
export type WorkoutExercise = { name?: string | null; muscle?: string | null; primaryMuscle?: string | null; secondaryMuscles?: string[] | null; sets?: WorkoutSet[] | null; };
export type WorkoutRow = { date?: string | null; day_name?: string | null; dayName?: string | null; duration_minutes?: number | null; durationMinutes?: number | null; exercises?: WorkoutExercise[] | null; };
export type LiftSummary = { name: string; day: string; summary: string; bodyPart: string; volume: number; score: number; date: string; };

export function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[ch];
  });
}

export function toNumber(value: unknown) {
  const parsed = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getDatePartsInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day") };
}

export function utcDateFromISO(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function isoFromUTCDate(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function addDays(dateIso: string, days: number) {
  const date = utcDateFromISO(dateIso);
  date.setUTCDate(date.getUTCDate() + days);
  return isoFromUTCDate(date);
}

export function normalizeDate(value: unknown) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export function isDateInRange(value: unknown, startDate: string, endDate: string) {
  const date = normalizeDate(value);
  return date >= startDate && date <= endDate;
}

export function formatWeekday(dateIso: string) {
  if (!dateIso) return "";
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(utcDateFromISO(dateIso));
}

export function formatWeekRange(startDate: string, endDate: string) {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const start = utcDateFromISO(startDate);
  const end = utcDateFromISO(endDate);
  return `${monthNames[start.getUTCMonth()]} ${start.getUTCDate()} - ${monthNames[end.getUTCMonth()]} ${end.getUTCDate()}, ${end.getUTCFullYear()}`;
}

export function getPreviousWeekWindow(today: Date, timeZone = DIGEST_TIME_ZONE) {
  const { year, month, day } = getDatePartsInTimeZone(today, timeZone);
  const localToday = new Date(Date.UTC(year, month - 1, day));
  const daysSinceMonday = (localToday.getUTCDay() + 6) % 7;
  const end = new Date(localToday);
  end.setUTCDate(localToday.getUTCDate() - daysSinceMonday - 1);
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - 6);

  const startDate = isoFromUTCDate(start);
  const endDate = isoFromUTCDate(end);
  return { startDate, endDate, weekRange: formatWeekRange(startDate, endDate) };
}

export function getCurrentMonthWindow(today: Date, timeZone = DIGEST_TIME_ZONE) {
  const { year, month } = getDatePartsInTimeZone(today, timeZone);
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = isoFromUTCDate(new Date(Date.UTC(year, month, 0)));
  return { month: `${year}-${String(month).padStart(2, "0")}`, startDate, endDate };
}

export function normalizeMuscle(value: unknown) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const firstPart = raw.split("/")[0].trim().toLowerCase();
  const compact = firstPart.replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  return DISPLAY_TO_ID[compact] || (MUSCLE_KEYS.includes(compact) ? compact : null);
}

export function inferMuscleFromExerciseName(name: unknown) {
  const n = String(name ?? "").toLowerCase();
  if (!n) return null;
  if (/tricep|pushdown|extension/.test(n)) return "triceps";
  if (/bicep|curl|preacher/.test(n)) return "biceps";
  if (/shoulder|lateral|overhead press|delt|face pull/.test(n)) return "shoulders";
  if (/row|pulldown|pull-up|chin-up|deadlift|lat/.test(n)) return "back";
  if (/bench|chest|pec|fly|push-up/.test(n)) return "chest";
  if (/squat|leg press|leg extension|lunge|quad/.test(n)) return "quads";
  if (/hamstring|leg curl|romanian/.test(n)) return "hamstrings";
  if (/glute|hip thrust|abductor/.test(n)) return "glutes";
  if (/calf|calves/.test(n)) return "calves";
  if (/ab|core|plank|crunch|oblique/.test(n)) return "abs";
  if (/forearm|wrist/.test(n)) return "forearms";
  return null;
}

export function getMusclesFromExercise(ex: WorkoutExercise) {
  const primary = normalizeMuscle(ex.primaryMuscle) || normalizeMuscle(ex.muscle) || inferMuscleFromExerciseName(ex.name);
  let secondary = Array.isArray(ex.secondaryMuscles)
    ? ex.secondaryMuscles.map(normalizeMuscle).filter(Boolean) as string[]
    : [];
  if (secondary.length === 0 && ex.muscle && String(ex.muscle).includes("/")) {
    secondary = String(ex.muscle).split("/").slice(1).map(normalizeMuscle).filter(Boolean) as string[];
  }
  return { primary, secondary: secondary.filter((m) => m !== primary) };
}

export function formatLiftDay(workout: WorkoutRow, bodyPart: string, dateIso: string) {
  const dayName = workout.day_name || workout.dayName || "";
  return [MUSCLE_LABELS[bodyPart] || bodyPart, dayName, formatWeekday(dateIso)].filter(Boolean).join(" · ");
}

export function collectLiftCandidates(workouts: WorkoutRow[]): LiftSummary[] {
  const candidates: LiftSummary[] = [];
  workouts.forEach((workout) => {
    const dateIso = normalizeDate(workout.date);
    workout.exercises?.forEach((ex) => {
      const { primary } = getMusclesFromExercise(ex);
      const bodyPart = primary || "general";
      ex.sets?.forEach((set) => {
        const weight = toNumber(set.weight);
        const reps = toNumber(set.reps);
        if (weight <= 0 || reps <= 0) return;
        const volume = weight * reps;
        const score = weight * (1 + reps / 30); // 1RM estimate
        candidates.push({
          name: ex.name || "Exercise",
          bodyPart,
          day: formatLiftDay(workout, bodyPart, dateIso),
          summary: `${weight.toLocaleString("en-US", { maximumFractionDigits: 1 })} kg x ${reps.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
          volume,
          score,
          date: dateIso,
        });
      });
    });
  });
  return candidates;
}

export function calculateWorkoutXP(workouts: WorkoutRow[]) {
  const xp = Object.fromEntries(MUSCLE_KEYS.map((key) => [key, 0])) as Record<string, number>;
  workouts.forEach((log) => {
    log.exercises?.forEach((ex) => {
      const { primary, secondary } = getMusclesFromExercise(ex);
      if (!primary && secondary.length === 0) return;
      let exXP = 0;
      let completedSets = 0;
      let totalWeight = 0;
      ex.sets?.forEach((set) => {
        const reps = toNumber(set.reps);
        const weight = toNumber(set.weight);
        if (reps > 0) {
          completedSets++;
          totalWeight += weight;
          exXP += reps * Math.max(weight, 1);
        }
      });
      const avgWeight = completedSets > 0 ? totalWeight / completedSets : 0;
      const qualityBonus = completedSets >= 3 && (avgWeight >= 20 || avgWeight === 0) ? 1.15 : 1;
      exXP *= qualityBonus;
      if (primary && xp[primary] !== undefined) xp[primary] += exXP;
      secondary.forEach((muscle) => {
        if (xp[muscle] !== undefined) xp[muscle] += exXP * 0.3;
      });
    });
  });
  return xp;
}

export function getWeeklyStats(workouts: WorkoutRow[]) {
  let volumeKg = 0;
  let durationMinutes = 0;
  const muscles = new Set<string>();
  workouts.forEach((workout) => {
    durationMinutes += toNumber(workout.duration_minutes ?? workout.durationMinutes);
    workout.exercises?.forEach((ex) => {
      const { primary, secondary } = getMusclesFromExercise(ex);
      if (primary) muscles.add(primary);
      secondary.forEach((muscle) => muscles.add(muscle));
      ex.sets?.forEach((set) => {
        volumeKg += toNumber(set.weight) * toNumber(set.reps);
      });
    });
  });
  return { volumeKg: Math.round(volumeKg), durationMinutes: Math.round(durationMinutes), trainedMuscles: muscles.size };
}

export function formatDuration(totalMinutes: number) {
  if (!totalMinutes) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function getTopLiftsForWeek(workouts: WorkoutRow[], limit: number = 4) {
  // 1. Calculate XP per body part for these workouts
  const xp = calculateWorkoutXP(workouts);
  // 2. Rank body parts by XP descending
  const sortedBodyParts = Object.entries(xp)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
  
  // 3. For each selected body part, find the single best lift (highest 1RM score, tie breaker volume)
  const candidates = collectLiftCandidates(workouts);
  const bestLifts: LiftSummary[] = [];

  for (const bp of sortedBodyParts) {
    const bpLifts = candidates.filter(c => c.bodyPart === bp);
    if (bpLifts.length > 0) {
      bpLifts.sort((a, b) => b.score - a.score || b.volume - a.volume);
      bestLifts.push(bpLifts[0]);
    }
  }

  return bestLifts;
}

export function getTopLiftsAllTime(allWorkouts: WorkoutRow[], cacheBodyPartsXp: Record<string, number>, limit: number = 4) {
  let sortedBodyParts: string[] = [];

  // Use cache first
  const cacheEntries = Object.entries(cacheBodyPartsXp).filter(e => e[1] > 0);
  if (cacheEntries.length > 0) {
    sortedBodyParts = cacheEntries.sort((a, b) => b[1] - a[1]).slice(0, limit).map(e => e[0]);
  } else {
    // Fallback to computing from all available logs
    const xp = calculateWorkoutXP(allWorkouts);
    sortedBodyParts = Object.entries(xp)
      .filter(([_, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(entry => entry[0]);
  }

  const candidates = collectLiftCandidates(allWorkouts);
  const bestLifts: LiftSummary[] = [];

  for (const bp of sortedBodyParts) {
    const bpLifts = candidates.filter(c => c.bodyPart === bp);
    if (bpLifts.length > 0) {
      bpLifts.sort((a, b) => b.score - a.score || b.volume - a.volume);
      bestLifts.push(bpLifts[0]);
    }
  }

  return bestLifts;
}

export function getConsistencyProtocolHtml(workoutDates: string[], weekStartDate: string, weekEndDate: string, containerBg = C.surfaceLow) {
  const uniqueDates = new Set(workoutDates.map(normalizeDate).filter(Boolean));
  const daysTrained = Array.from(uniqueDates).filter((date) => date >= weekStartDate && date <= weekEndDate).length;
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const bubblesHtml = [];
  
  for (let i = 0; i < 7; i++) {
    const dStr = addDays(weekStartDate, i);
    const d = utcDateFromISO(dStr);
    const isChecked = uniqueDates.has(dStr);
    const dayLabel = days[d.getUTCDay()];
    let bubble;
    if (isChecked) {
      bubble = `<div style="width:36px;height:36px;border-radius:18px;background-color:${C.primaryContainer};background:linear-gradient(135deg,${C.primary},${C.primaryContainer});margin:0 auto;line-height:36px;color:${C.onPrimary};font-size:14px;box-shadow:0 0 10px rgba(248,95,27,0.3);">✓</div>`;
    } else {
      bubble = `<div style="width:36px;height:36px;border-radius:18px;background-color:${C.surfaceLowest};background:${C.surfaceLowest};margin:0 auto;"></div>`;
    }
    bubblesHtml.push(`
      <td style="width:14.28%;">
        <div style="font-family:'Be Vietnam Pro',sans-serif;font-size:10px;font-weight:700;color:${isChecked ? C.primaryContainer : C.onSurfaceVariant};margin-bottom:8px;">${dayLabel}</div>
        ${bubble}
      </td>
    `);
  }
  return `
    <!-- Consistency Protocol -->
    <div style="padding:24px;background-color:${containerBg};background:${containerBg};border-radius:24px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.03);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
        <td>
          <div style="font-family:'Be Vietnam Pro',sans-serif;font-size:11px;font-weight:700;color:${C.onSurfaceVariant};letter-spacing:0.16em;text-transform:uppercase;">Consistency Protocol</div>
        </td>
        <td style="text-align:right;">
          <div style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:900;color:${C.primary};letter-spacing:-0.02em;">${daysTrained} DAYS</div>
        </td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="text-align:center;"><tr>
        ${bubblesHtml.join('')}
      </tr></table>
    </div>
  `;
}
