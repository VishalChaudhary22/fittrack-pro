// ─── Workout session services ────────────────────────────────────────────────
// Audio feedback + active-session persistence for the Workout screen,
// extracted from the V1 WorkoutPage (Kaaya Volt V-1) into core/services so
// the page, its sub-components and useWorkoutSession share one source.
// ─── AUDIO & PERSISTENCE HELPERS ────────────────────────────────────────────────
let _audioCtx = null;
export function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

export function playRestCompleteChime() {
  try {
    const ctx = getAudioCtx();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch {
    // silently fail
  }
}

export function vibrateRestComplete() {
  if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
}

const ACTIVE_SESSION_KEY = 'fittrack_activeWorkoutSession';
export const REST_TIMER_KEY = 'fittrack_activeRestTimer';
export const REST_TIMER_POS_KEY = 'fittrack_activeRestTimerPos';
export const SESSION_STALE_MS = 8 * 60 * 60 * 1000;
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function persistActiveSession(session) {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
      ...session,
      lastUpdated: Date.now(),
    }));
  } catch { /* best effort */ }
}

export function clearPersistedSession() {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export function loadPersistedSession(currentUserId) {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.userId && parsed.userId !== currentUserId) return null;
    if (Date.now() - parsed.lastUpdated > SESSION_MAX_AGE_MS) {
      clearPersistedSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// Migration cleanup - run once on script load
sessionStorage.removeItem('fittrack_active_workout');
sessionStorage.removeItem('fittrack_session_start');

// Shared scroll-position cache for the workout tracker view.
export const workoutPageCache = { trackerScroll: 0 };
