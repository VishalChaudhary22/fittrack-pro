import { useCallback, useEffect, useState } from 'react';
import { FIGHTER_ART } from './fighterArt';

// ─── Kaaya Quest fighter roster (plan §5.6) ──────────────────────────────────
// Original fighters in the arcade spirit — our roster, our names. The
// artwork (Q-12) is extracted pixel-for-pixel from the Gemini sprite sheets
// Vishal supplied on 2026-11-02 — one sheet per fighter with three real
// poses (idle / flex / sleepy) — and lives in fighterArt.js as palette +
// symbol grids on a shared 56-row canvas, feet on one baseline. It replaced
// the hand-drawn 14×17 grids from Q-1.
//
// Selection storage: the profile avatar field stores an image URL
// (user_profiles.avatar_url), not an id — so the fighter choice is
// device-local (localStorage), like the theme fallback. Default: KAI.

export const FIGHTERS = [
  { id: 'kai', name: 'KAI', title: 'THE KARATEKA', unlock: { type: 'starter' } },
  { id: 'bruno', name: 'BRUNO', title: 'THE BRAWLER', unlock: { type: 'starter' } },
  { id: 'lina', name: 'LINA', title: 'THE SPEEDSTER', unlock: { type: 'starter' } },
  { id: 'goro', name: 'GORO', title: 'THE GRAPPLER', unlock: { type: 'level', level: 10 } },
  { id: 'viper', name: 'VIPER', title: 'THE WILDCARD', unlock: { type: 'level', level: 20 } },
  { id: 'sensei', name: 'SENSEI', title: 'THE MASTER', unlock: { type: 'tier', tier: 'DEMIGOD' } },
];

export const FIGHTER_BY_ID = Object.fromEntries(FIGHTERS.map((f) => [f.id, f]));

export function isUnlocked(fighter, { level = 1, tier = null } = {}) {
  const u = fighter.unlock;
  if (u.type === 'starter') return true;
  if (u.type === 'level') return level >= u.level;
  if (u.type === 'tier') return tier === u.tier;
  return false;
}

export function unlockLabel(fighter) {
  const u = fighter.unlock;
  if (u.type === 'starter') return 'STARTER';
  if (u.type === 'level') return `LVL ${u.level}`;
  return u.tier;
}

// Renders one fighter. state: 'idle' | 'flex' | 'sleepy' — each state is a
// real extracted pose (sleepy is its own artwork; the readiness card adds
// the floating Z). Rects are run-merged per row to keep the node count low.
export function FighterSprite({ fighter = 'kai', state = 'idle', size = 96, style }) {
  const f = FIGHTER_BY_ID[fighter] ?? FIGHTERS[0];
  const art = FIGHTER_ART[f.id] ?? FIGHTER_ART.kai;
  const grid = art[state] ?? art.idle;
  const rows = grid.length;
  const cols = Math.max(...grid.map((r) => r.length));
  const rects = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.') { x += 1; continue; }
      let end = x + 1;
      while (end < row.length && row[end] === ch) end += 1;
      const fill = art.pal[ch];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x + 0.02} height={1.02} fill={fill} />);
      x = end;
    }
  });
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={size}
      height={Math.round((size * rows) / cols)}
      style={{ display: 'block', flexShrink: 0, ...style }}
      shapeRendering="crispEdges"
      aria-label={`${f.name}, ${f.title.toLowerCase()}`}
      role="img"
    >
      {rects}
    </svg>
  );
}

// ─── Selection (device-local; see header note) ───────────────────────────────

const LS_KEY = 'kaaya-quest-fighter';
const EVENT = 'kaaya:fighter-changed';

export function readFighter() {
  try {
    const v = localStorage.getItem(LS_KEY);
    return FIGHTER_BY_ID[v] ? v : 'kai';
  } catch {
    return 'kai';
  }
}

export function useFighter() {
  const [fighter, setFighterState] = useState(readFighter);

  useEffect(() => {
    const sync = () => setFighterState(readFighter());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setFighter = useCallback((id) => {
    if (!FIGHTER_BY_ID[id]) return;
    try { localStorage.setItem(LS_KEY, id); } catch { /* private mode */ }
    setFighterState(id);
    window.dispatchEvent(new CustomEvent(EVENT));
  }, []);

  return { fighter, setFighter };
}
