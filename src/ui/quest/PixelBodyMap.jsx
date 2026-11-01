// ─── Kaaya Quest · pixel body map (plan §7.4) ────────────────────────────────
// A hand-drawn pixel mannequin on a 26×52 grid, front + back, male + female
// silhouettes. Zones are keyed to the canonical MUSCLE_GROUPS ids, so hook
// data maps mechanically. Zone states come from the page:
//   today      trained today       → volt fill + slow steps-pulse
//   recovering trained < 48h ago   → ember dither (checker pattern fill)
//   week       trained in last 7d  → volt-dk fill
//   fresh      everything else     → panel2
// Non-zone body parts (head, hands, feet, joints) render in the slot tone.

const BASE_PARTS = [
  [10, 0, 6, 5],   // head
  [11, 5, 4, 2],   // neck
  [3, 17, 3, 1], [20, 17, 3, 1],   // elbows
  [2, 24, 3, 3], [21, 24, 3, 3],   // hands
  [7, 48, 5, 3], [14, 48, 5, 3],   // feet
];

const FRONT_BASE = [
  [8, 22, 10, 3],  // waist / hips
  [7, 37, 5, 2], [14, 37, 5, 2],   // knees
];
const BACK_BASE = [
  [7, 38, 5, 1], [14, 38, 5, 1],   // knees
];

const ZONES = {
  front: {
    shoulders: [[4, 6, 4, 5], [18, 6, 4, 5]],
    chest: [[8, 6, 10, 7]],
    biceps: [[3, 11, 3, 6], [20, 11, 3, 6]],
    forearms: [[2, 18, 3, 6], [21, 18, 3, 6]],
    abs: [[8, 13, 10, 9]],
    quads: [[7, 25, 5, 12], [14, 25, 5, 12]],
    calves: [[8, 39, 3, 9], [15, 39, 3, 9]],
  },
  back: {
    traps: [[9, 5, 8, 1], [8, 6, 10, 4]],
    shoulders: [[4, 6, 4, 5], [18, 6, 4, 5]],
    back: [[8, 10, 10, 12]],
    triceps: [[3, 11, 3, 6], [20, 11, 3, 6]],
    forearms: [[2, 18, 3, 6], [21, 18, 3, 6]],
    glutes: [[7, 22, 6, 5], [13, 22, 6, 5]],
    hamstrings: [[7, 27, 5, 11], [14, 27, 5, 11]],
    calves: [[7, 39, 4, 9], [15, 39, 4, 9]],
  },
};

const FEMALE_OVERRIDES = {
  front: {
    shoulders: [[5, 6, 3, 5], [18, 6, 3, 5]],
    chest: [[9, 6, 8, 7]],
    abs: [[9, 13, 8, 9]],
  },
  back: {
    traps: [[9, 6, 8, 4]],
    glutes: [[6, 22, 7, 5], [13, 22, 7, 5]],
  },
};
const FEMALE_BASE_FRONT = [
  [9, 22, 8, 3],
  [7, 37, 5, 2], [14, 37, 5, 2],
];

const STATE_FILLS = {
  today: 'var(--q-volt)',
  week: 'var(--q-volt-dk)',
  fresh: 'var(--q-panel2)',
};

export default function PixelBodyMap({ side = 'front', gender, states = {}, selectedKey, onSelect, width = 168 }) {
  const female = gender === 'female';
  const zones = {
    ...ZONES[side],
    ...(female ? FEMALE_OVERRIDES[side] : {}),
  };
  const baseParts = [
    ...BASE_PARTS,
    ...(side === 'front' ? (female ? FEMALE_BASE_FRONT : FRONT_BASE) : BACK_BASE),
  ];

  return (
    <svg
      viewBox="0 0 26 52"
      width={width}
      height={width * 2}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Pixel body map, ${side} view`}
      style={{ display: 'block' }}
    >
      <defs>
        <pattern id="q-dither-pat" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill="var(--q-panel2)" />
          <rect width="1" height="1" fill="var(--q-ember)" />
          <rect x="1" y="1" width="1" height="1" fill="var(--q-ember)" />
        </pattern>
      </defs>

      {baseParts.map(([x, y, w, h], i) => (
        <rect key={`b${i}`} x={x} y={y} width={w} height={h} fill="var(--q-slot)" />
      ))}

      {Object.entries(zones).map(([key, rects]) => {
        const state = states[key] || 'fresh';
        const fill = state === 'recovering' ? 'url(#q-dither-pat)' : STATE_FILLS[state];
        const selected = key === selectedKey;
        return (
          <g
            key={key}
            onClick={onSelect ? () => onSelect(key) : undefined}
            style={onSelect ? { cursor: 'pointer' } : undefined}
            className={state === 'today' ? 'q-zone-pulse' : undefined}
            role={onSelect ? 'button' : undefined}
            aria-label={onSelect ? `${key} details` : undefined}
          >
            {rects.map(([x, y, w, h], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={h}
                fill={fill}
                stroke={selected ? 'var(--q-ink)' : 'none'}
                strokeWidth={selected ? 0.35 : 0}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
