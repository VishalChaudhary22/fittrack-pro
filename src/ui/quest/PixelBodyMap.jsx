import { BODY_MAPS, BODY_W, BODY_H, CHAR_TO_MUSCLE, BASE_CHARS } from './bodyMapData';

// ─── Kaaya Quest · pixel body map (plan §7.4) ────────────────────────────────
// Renders the hand-drawn string maps from bodyMapData.js (34×69 cells,
// run-length merged into rects). Zones are keyed to the canonical
// MUSCLE_GROUPS ids. Zone states come from the page:
//   today      trained today       → volt fill + slow steps-pulse
//   recovering trained < 48h ago   → ember dither (checker pattern fill)
//   week       trained in last 7d  → volt-dk fill
//   fresh      everything else     → panel2
// Base body parts (head, obliques, pelvis, joints, hands/feet) use slot tone.

const STATE_FILLS = {
  today: 'var(--q-volt)',
  week: 'var(--q-volt-dk)',
  fresh: 'var(--q-panel2)',
};

// Parse a string map into per-key rect runs: { zones: Map(key → [rects]),
// base: [rects] } where rect = [x, y, w].
function parseMap(rows) {
  const zones = new Map();
  const base = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.') { x += 1; continue; }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w += 1;
      if (BASE_CHARS.has(ch)) {
        base.push([x, y, w]);
      } else {
        const key = CHAR_TO_MUSCLE[ch];
        if (key) {
          if (!zones.has(key)) zones.set(key, []);
          zones.get(key).push([x, y, w]);
        }
      }
      x += w;
    }
  });
  return { zones, base };
}

const PARSED = {};
for (const side of Object.keys(BODY_MAPS)) {
  PARSED[side] = {
    male: parseMap(BODY_MAPS[side].male),
    female: parseMap(BODY_MAPS[side].female),
  };
}

export default function PixelBodyMap({ side = 'front', gender, states = {}, selectedKey, onSelect, width = 184 }) {
  const { zones, base } = PARSED[side][gender === 'female' ? 'female' : 'male'];

  return (
    <svg
      viewBox={`0 0 ${BODY_W} ${BODY_H}`}
      width={width}
      height={Math.round(width * BODY_H / BODY_W)}
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

      {base.map(([x, y, w], i) => (
        <rect key={`b${i}`} x={x} y={y} width={w} height={1} fill="var(--q-slot)" />
      ))}

      {[...zones.entries()].map(([key, rects]) => {
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
            {rects.map(([x, y, w], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={1}
                fill={fill}
                stroke={selected ? 'var(--q-ink)' : 'none'}
                strokeWidth={selected ? 0.3 : 0}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
