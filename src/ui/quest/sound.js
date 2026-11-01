// ─── Kaaya Quest · sound engine (plan §6.3) ──────────────────────────────────
// A tiny WebAudio square-wave synth — no audio assets. DEFAULT: OFF. The
// only switch is Profile → SOUND FX (device-local, localStorage). The first
// enable is a user tap, which also satisfies browser autoplay rules.
// Events: tap (nav/primary), set (set complete), pr (arpeggio), xp (rising
// tick), levelup (jingle), error (low buzz). Fixed low volume. Volt and
// Original never call this — sound is a Quest trait. Every export is a
// no-op when disabled or when WebAudio is unavailable.

const LS_KEY = 'kaaya-quest-sound';
const EVENT_KEY = 'kaaya:sound-changed';
const VOLUME = 0.08;

export function soundEnabled() {
  try { return localStorage.getItem(LS_KEY) === 'on'; } catch { return false; }
}

export function setSoundEnabled(on) {
  try { localStorage.setItem(LS_KEY, on ? 'on' : 'off'); } catch { /* private mode */ }
  try { window.dispatchEvent(new CustomEvent(EVENT_KEY)); } catch { /* ignore */ }
}

export function onSoundChanged(fn) {
  window.addEventListener(EVENT_KEY, fn);
  window.addEventListener('storage', fn);
  return () => {
    window.removeEventListener(EVENT_KEY, fn);
    window.removeEventListener('storage', fn);
  };
}

let ctx = null;
function audio() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) { try { ctx = new AC(); } catch { return null; } }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(ac, freq, startAt, dur, type = 'square') {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  gain.gain.setValueAtTime(VOLUME, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(startAt);
  osc.stop(startAt + dur + 0.02);
}

function seq(notes, step = 0.07, dur = 0.09, type = 'square') {
  if (!soundEnabled()) return;
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + 0.01;
  notes.forEach((f, i) => tone(ac, f, t0 + i * step, dur, type));
}

export function questSound(event) {
  try {
    switch (event) {
      case 'tap': seq([200], 0, 0.05); break;
      case 'set': seq([880, 1320], 0.06, 0.09); break;
      case 'pr': seq([660, 880, 1100, 1320], 0.07, 0.1); break;
      case 'xp': {
        if (!soundEnabled()) return;
        const ac = audio();
        if (!ac) return;
        const t0 = ac.currentTime + 0.01;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, t0);
        osc.frequency.exponentialRampToValueAtTime(1200, t0 + 0.12);
        gain.gain.setValueAtTime(VOLUME, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.13);
        osc.connect(gain).connect(ac.destination);
        osc.start(t0);
        osc.stop(t0 + 0.15);
        break;
      }
      case 'levelup': seq([523, 659, 784, 1047, 784, 1047], 0.08, 0.11); break;
      case 'error': seq([110], 0, 0.18, 'sawtooth'); break;
      default: break;
    }
  } catch { /* sound must never break the app */ }
}
