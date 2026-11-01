// ─── Kaaya Quest · pixel body-map geometry (§7.4) ────────────────────────────
// Stepped orthogonal SVG paths on a 48×82 grid — design supplied by Vishal
// (nano-banana render + component, adopted 2026-11-01). Geometry is used
// exactly as supplied; only the taxonomy is folded into Kaaya's canonical
// MUSCLE_GROUPS keys so the app data maps mechanically:
//   his Anterior/Posterior Deltoids → shoulders      his Pecs → chest
//   his Obliques & Serratus         → abs (same zone) his Lats + Erector
//   Spinae                          → back (one zone) his front Traps → traps
// Every muscle path is drawn as a left/right pair; abs carries his six
// segmented blocks plus the oblique paths. Fills are state-driven by the
// component (Quest tokens), never hardcoded here.

export const BODY_W = 48;
export const BODY_H = 82;

const DELTS = [
  'M13,18 H18 V23 H16 V25 H12 V20 H13 Z',
  'M30,18 H35 V20 H36 V25 H32 V23 H30 Z',
];
const FOREARMS = [
  'M10,32 H15 V40 H14 V43 H10 V39 H11 V32 Z',
  'M33,32 H38 V39 H37 V43 H34 V40 H33 Z',
];
const ARM_UPPER = [
  'M12,25 H16 V32 H11 V26 H12 Z',
  'M32,25 H36 V26 H37 V32 H32 Z',
];
const CALVES = [
  'M16,60 H22 V74 H23 V77 H15 V75 H17 V68 H16 Z',
  'M26,60 H32 V68 H31 V75 H33 V77 H25 V74 H26 Z',
];

export const ZONE_PATHS = {
  front: {
    traps: [
      'M17,15 H22 V18 H16 V16 H17 Z',
      'M26,15 H31 V16 H32 V18 H26 Z',
    ],
    shoulders: DELTS,
    chest: [
      'M18,18 H24 V26 H19 V25 H18 Z',
      'M24,18 H30 V25 H29 V26 H24 Z',
    ],
    biceps: ARM_UPPER,
    forearms: FOREARMS,
    abs: [
      'M20,26 H24 V30 H20 Z',
      'M24,26 H28 V30 H24 Z',
      'M20,30 H24 V34 H20 Z',
      'M24,30 H28 V34 H24 Z',
      'M21,34 H24 V39 H21 Z',
      'M24,34 H27 V39 H24 Z',
      'M17,25 H20 V38 H18 V33 H17 Z',
      'M28,25 H31 V33 H30 V38 H28 Z',
    ],
    quads: [
      'M16,42 H23 V57 H21 V59 H17 V56 H15 V45 H16 Z',
      'M25,42 H32 V45 H33 V56 H31 V59 H27 V57 H25 Z',
    ],
    calves: CALVES,
  },
  back: {
    traps: [
      'M21,14 H24 V26 H22 V23 H18 V19 H16 V16 H21 Z',
      'M24,14 H27 V16 H32 V19 H30 V23 H26 V26 H24 Z',
    ],
    shoulders: DELTS,
    back: [
      'M17,23 H22 V35 H20 V38 H18 V32 H16 V25 H17 Z',
      'M26,23 H31 V25 H32 V32 H30 V38 H28 V35 H26 Z',
      'M22,26 H24 V40 H20 V38 H22 Z',
      'M24,26 H26 V38 H28 V40 H24 Z',
    ],
    triceps: ARM_UPPER,
    forearms: FOREARMS,
    glutes: [
      'M16,40 H24 V49 H17 V47 H16 Z',
      'M24,40 H32 V47 H31 V49 H24 Z',
    ],
    hamstrings: [
      'M16,49 H23 V59 H17 V56 H16 Z',
      'M25,49 H32 V56 H31 V59 H25 Z',
    ],
    calves: CALVES,
  },
};

// Non-interactive silhouette: head, neck, front pelvis, knee joints.
export const BASE_PATHS = {
  front: [
    'M21,4 H27 V5 H28 V12 H27 V13 H21 V12 H20 V5 H21 Z',
    'M22,13 H26 V16 H22 Z',
    'M18,39 H30 V42 H26 V44 H22 V42 H18 Z',
    'M17,58 H22 V60 H17 Z',
    'M26,58 H31 V60 H26 Z',
  ],
  back: [
    'M21,4 H27 V5 H28 V12 H27 V13 H21 V12 H20 V5 H21 Z',
    'M22,13 H26 V16 H22 Z',
    'M17,58 H22 V60 H17 Z',
    'M26,58 H31 V60 H26 Z',
  ],
};
