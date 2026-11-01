import { useCallback, useEffect, useState } from 'react';

// ─── Kaaya Quest fighter roster (plan §5.6) ──────────────────────────────────
// Original pixel fighters in the arcade spirit — our sprites, our names.
// Each fighter has an idle and a flex grid; the sleepy state derives from
// idle (eyes close) plus the floating Z the readiness card adds. Grids use
// palette characters resolved per fighter below ('o' is the shared sprite
// outline; 'e' is used ONLY for eyes so sleepy can close them).
//
// Selection storage: the profile avatar field stores an image URL
// (user_profiles.avatar_url), not an id — so the fighter choice is
// device-local (localStorage), like the theme fallback. Default: KAI.

export const FIGHTERS = [
  {
    id: 'kai', name: 'KAI', title: 'THE KARATEKA', unlock: { type: 'starter' },
    pal: { o: '#12121a', h: '#2b2b33', r: '#ff3355', s: '#f2c79b', e: '#12121a', w: '#f2f0e6' },
    idle: [
      '....oooooo....',
      '...ohhhhhho...',
      '...orrrrrro...',
      '...osssssso.r.',
      '...osesseso...',
      '....ssssss....',
      '..owwwwwwwwo.r',
      '..owwwwwwwwo..',
      '.owwwwsswwwo..',
      '.owwwsssswwo..',
      '.owwwwwwwwo...',
      'sorrrrrrrro...',
      '..owwwwwwwwo..',
      '..owww..wwwo..',
      '..oww....wwo..',
      '..oww....wwo..',
      '..sss....sss..',
    ],
    flex: [
      '....oooooo....',
      '...ohhhhhho...',
      '...orrrrrro...',
      '...osssssso.r.',
      '...osesseso...',
      '....ssssss....',
      '.sswwwwwwwwss.',
      '.sowwwwwwwwos.',
      '.owwwwsswwwo..',
      '.owwwsssswwo..',
      '.owwwwwwwwo...',
      'sorrrrrrrro...',
      '..owwwwwwwwo..',
      '..owww..wwwo..',
      '..oww....wwo..',
      '..oww....wwo..',
      '..sss....sss..',
    ],
  },
  {
    id: 'bruno', name: 'BRUNO', title: 'THE BRAWLER', unlock: { type: 'starter' },
    pal: { o: '#12121a', h: '#1d150e', s: '#8d5a33', S: '#6f4525', e: '#12121a', w: '#f2f0e6', r: '#e5484d', b: '#2e4bff', f: '#12121a' },
    idle: [
      '....oooooo....',
      '...osssssso...',
      '...osssssso...',
      '...oSSSSSSo...',
      '...oSeSSeSo...',
      '....hhhhhh....',
      '..sswwwwwwss..',
      '.ssswwwwwwsss.',
      '.ss.wwwwww.ss.',
      '.rr.wwwwww.rr.',
      '.rr..bbbb..rr.',
      '..s..bbbb..s..',
      '.....bbbb.....',
      '....bb..bb....',
      '....bb..bb....',
      '....ff..ff....',
      '...ffff.ffff..',
    ],
    flex: [
      '....oooooo....',
      '...osssssso...',
      '...osssssso...',
      '...oSSSSSSo...',
      '...oSeSSeSo...',
      '....hhhhhh....',
      'rrsswwwwwwssrr',
      'rr.swwwwwws.rr',
      '....wwwwww....',
      '....wwwwww....',
      '.....bbbb.....',
      '.....bbbb.....',
      '.....bbbb.....',
      '....bb..bb....',
      '....bb..bb....',
      '....ff..ff....',
      '...ffff.ffff..',
    ],
  },
  {
    id: 'lina', name: 'LINA', title: 'THE SPEEDSTER', unlock: { type: 'starter' },
    pal: { o: '#12121a', h: '#191920', s: '#c68863', e: '#12121a', m: '#f85f1b', v: '#c9f158' },
    idle: [
      '.oo..oooo..oo.',
      '.hho.ohhhhohh.',
      '..hhohhhhhoh..',
      '...hossssoh...',
      '...hosessoh...',
      '....hssssh....',
      '....hsssh.....',
      '..ssmmmmmmss..',
      '..s.mmmmmm.s..',
      '....mmmmmm....',
      '....oooooo....',
      '....oooooo....',
      '....ss..ss....',
      '....ss..ss....',
      '....ss..ss....',
      '....ss..ss....',
      '...vvv..vvv...',
    ],
    flex: [
      '.oo..oooo..oo.',
      '.hho.ohhhhohh.',
      '..hhohhhhhoh..',
      '...hossssoh...',
      '...hosessoh...',
      '....hssssh....',
      '....hsssh.....',
      'ss..mmmmmm..ss',
      '.ss.mmmmmm.ss.',
      '....mmmmmm....',
      '....oooooo....',
      '....oooooo....',
      '....ss..ss....',
      '....ss..ss....',
      '....ss..ss....',
      '....ss..ss....',
      '...vvv..vvv...',
    ],
  },
  {
    id: 'goro', name: 'GORO', title: 'THE GRAPPLER', unlock: { type: 'level', level: 10 },
    pal: { o: '#12121a', h: '#191920', s: '#e8b08a', S: '#c98f66', e: '#12121a', b: '#26263a' },
    idle: [
      '.......oo.......',
      '......ohho......',
      '....oooooooo....',
      '...osssssssso...',
      '...osssssssso...',
      '...osesssesso...',
      '....ssssssss....',
      '..ssssssssssss..',
      '.ssSSssssssSSss.',
      '.ssSSssssssSSss.',
      '..ssssssssssss..',
      '...bbbbbbbbbb...',
      '...bbbbbbbbbb...',
      '...sss....sss...',
      '...sss....sss...',
      '..ssss....ssss..',
      '..oooo....oooo..',
    ],
    flex: [
      '.......oo.......',
      '......ohho......',
      '....oooooooo....',
      '...osssssssso...',
      '...osssssssso...',
      '...osesssesso...',
      '....ssssssss....',
      'ssssssssssssssss',
      'ss.ssSSssSSss.ss',
      '....ssssssss....',
      '..ssssssssssss..',
      '...bbbbbbbbbb...',
      '...bbbbbbbbbb...',
      '...sss....sss...',
      '...sss....sss...',
      '..ssss....ssss..',
      '..oooo....oooo..',
    ],
  },
  {
    id: 'viper', name: 'VIPER', title: 'THE WILDCARD', unlock: { type: 'level', level: 20 },
    pal: { o: '#12121a', p: '#b967ff', s: '#6e4426', e: '#12121a', g: '#ffc627', j: '#3a4a6b' },
    idle: [
      '......pp......',
      '......pp......',
      '....ooppoo....',
      '...osssssso...',
      '...osesseso...',
      '....ssssss....',
      '..ppoooooop...',
      '..ppogooopp.s.',
      '..ppooooopp...',
      '..ppooooopp...',
      '.s.pooooop..s.',
      '.s..jjjjjj..s.',
      '....jjjjjj....',
      '....jj..jj....',
      '....jj..jj....',
      '....jj..jj....',
      '...ooo..ooo...',
    ],
    flex: [
      '......pp......',
      '......pp......',
      '....ooppoo....',
      '...osssssso...',
      '...osesseso...',
      '....ssssss....',
      'ss.poooooop.ss',
      '.ss.ogooopp.s.',
      '..ppooooopp...',
      '..ppooooopp...',
      '...pooooop....',
      '....jjjjjj....',
      '....jjjjjj....',
      '....jj..jj....',
      '....jj..jj....',
      '....jj..jj....',
      '...ooo..ooo...',
    ],
  },
  {
    id: 'sensei', name: 'SENSEI', title: 'THE MASTER', unlock: { type: 'tier', tier: 'DEMIGOD' },
    pal: { o: '#12121a', y: '#c9c9c9', s: '#d9a066', e: '#12121a', d: '#5b6b8c', g: '#ffc627' },
    idle: [
      '....oooooo....',
      '...oyssssyo...',
      '...oysessyo...',
      '...oyssssyo...',
      '....oyyyyo....',
      '.....yyyy.....',
      '..dddyyyyddd..',
      '..dddyyyyddd..',
      '..dddddddddd..',
      '..dddddddddd..',
      '..ddggggggdd..',
      '..dddddddddd..',
      '..dddddddddd..',
      '..dddddddddd..',
      '..dddddddddd..',
      '...dddddddd...',
      '...ss....ss...',
    ],
    flex: [
      '....oooooo....',
      '...oyssssyo...',
      '...oysessyo...',
      '...oyssssyo...',
      '....oyyyyo....',
      '.....yyyy.....',
      '..dddyyyyddds.',
      '..dddyyyydddss',
      '..dddddddddd..',
      '..dddddddddd..',
      '..ddggggggdd..',
      '..dddddddddd..',
      '..dddddddddd..',
      '..dddddddddd..',
      '..dddddddddd..',
      '...dddddddd...',
      '...ss....ss...',
    ],
  },
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

// Renders one fighter. state: 'idle' | 'flex' | 'sleepy' (sleepy = idle
// with the eyes closed; the card adds the floating Z).
export function FighterSprite({ fighter = 'kai', state = 'idle', size = 96, style }) {
  const f = FIGHTER_BY_ID[fighter] ?? FIGHTERS[0];
  let grid = state === 'flex' ? f.flex : f.idle;
  if (state === 'sleepy') grid = grid.map((row) => row.replaceAll('e', 's'));
  const rows = grid.length;
  const cols = Math.max(...grid.map((r) => r.length));
  const rects = [];
  grid.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === '.' || ch === ' ') return;
      const fill = f.pal[ch];
      if (!fill) return;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} />);
    });
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
