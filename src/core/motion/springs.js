import { useEffect, useRef, useState } from 'react';

// ─── Spring engine — Remotion spring() semantics ─────────────────────────────
// A damped harmonic oscillator, evaluated analytically (the same model
// Remotion's spring() exposes: stiffness / damping / mass). Progress runs
// 0 → 1; configs with damping ratio < 1 overshoot, ≥ 1 never do.
//
//   ω0 = √(k/m)          ζ = c / (2√(k·m))
//   ζ<1: x(t) = 1 − e^(−ζω0·t) · (cos(ωd·t) + (ζω0/ωd)·sin(ωd·t)), ωd = ω0√(1−ζ²)
//   ζ=1: x(t) = 1 − e^(−ω0·t) · (1 + ω0·t)
//   ζ>1: x(t) = 1 − (r2·e^(r1·t) − r1·e^(r2·t)) / (r2 − r1),
//        r1 = −ω0(ζ − √(ζ²−1)), r2 = −ω0(ζ + √(ζ²−1))
//
// Presets (Kaaya Volt plan §7):
// SPRING_DATA is tuned to exactly ζ = 1.0 (critical damping, c = 2√(k·m)):
// zero overshoot is guaranteed by construction and it settles in ≈0.9s.
// The plan's draft figure (damping 200) gives ζ ≈ 8.5 under this physics —
// a ~10s tail on numeric counters — so the intent-preserving value is 24.
export const SPRING_DATA = { stiffness: 140, damping: 24, mass: 1 };  // rings, counters — zero overshoot
export const SPRING_UI = { stiffness: 180, damping: 26, mass: 1 };    // bars, chart draws, entrances
export const SPRING_PLAY = { stiffness: 160, damping: 14, mass: 1 };  // celebrations ONLY (PR, rank-up)

// Emil curves (Kaaya Volt plan §7) for CSS/inline transitions:
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';   // UI transitions, ≤300ms
export const EASE_DRAWER = 'cubic-bezier(0.32, 0.72, 0, 1)'; // sheets / drawers

export function springProgress(config, tSeconds) {
  const { stiffness: k, damping: c, mass: m } = config;
  if (tSeconds <= 0) return 0;
  const w0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(k * m));
  if (Math.abs(zeta - 1) < 1e-4) {
    return 1 - Math.exp(-w0 * tSeconds) * (1 + w0 * tSeconds);
  }
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const env = Math.exp(-zeta * w0 * tSeconds);
    return 1 - env * (Math.cos(wd * tSeconds) + ((zeta * w0) / wd) * Math.sin(wd * tSeconds));
  }
  const s = Math.sqrt(zeta * zeta - 1);
  const r1 = -w0 * (zeta - s);
  const r2 = -w0 * (zeta + s);
  return 1 - (r2 * Math.exp(r1 * tSeconds) - r1 * Math.exp(r2 * tSeconds)) / (r2 - r1);
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// How long a spring takes to settle within 0.2% of its target, in seconds
// (Remotion's measureSpring idea — sampled once, then used as the driver's
// duration so overshooting springs are never cut at a zero-crossing).
export function measureSpringDuration(config) {
  const STEP = 1 / 240;
  let lastOutside = 0;
  for (let t = 0; t <= 6; t += STEP) {
    if (Math.abs(springProgress(config, t) - 1) > 0.002) lastOutside = t;
  }
  return Math.min(lastOutside + STEP, 6);
}

// Drive a value from → to with a spring on requestAnimationFrame.
// onUpdate receives the interpolated value each frame; returns a cancel fn.
// Reduced motion: spatial movement is skipped — the value lands instantly
// (components keep their own 150ms opacity fades, per plan §7).
export function animateSpring({ from = 0, to = 1, config = SPRING_UI, onUpdate, onComplete }) {
  if (prefersReducedMotion() || from === to) {
    onUpdate?.(to);
    onComplete?.();
    return () => {};
  }
  let raf = 0;
  const start = performance.now();
  const range = to - from;
  const duration = measureSpringDuration(config);
  const tick = (now) => {
    const t = (now - start) / 1000;
    if (t >= duration) {
      onUpdate?.(to);
      onComplete?.();
      return;
    }
    onUpdate?.(from + range * springProgress(config, t));
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// React helper: a number that springs toward `target` whenever it changes.
// Used for count-ups (readiness score, XP) and animated readouts. Mounts at
// `target` by default (no entrance re-animation); pass `initial` (e.g. 0)
// when a one-time entrance count-up is wanted, as in the Lab.
export function useSpringNumber(target, config = SPRING_DATA, initial = target) {
  const [value, setValue] = useState(initial);
  const currentRef = useRef(initial);

  useEffect(() => {
    if (currentRef.current === target) return undefined; // already there
    const cancel = animateSpring({
      from: currentRef.current,
      to: target,
      config,
      onUpdate: (v) => {
        currentRef.current = v;
        setValue(v);
      },
    });
    return cancel;
  }, [target, config]);

  return value;
}
