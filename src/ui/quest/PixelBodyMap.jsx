import { ZONE_PATHS, BASE_PATHS, BODY_W, BODY_H } from './bodyMapData';

// ─── Kaaya Quest · pixel body map (plan §7.4) ────────────────────────────────
// Renders the stepped-path figure from bodyMapData.js (48×82 grid, design
// supplied by Vishal 2026-11-01): every muscle outlined in black, abs in
// six segmented blocks. Zones are keyed to the canonical MUSCLE_GROUPS ids;
// states come from the page:
//   today      trained today       → volt fill + slow steps-pulse
//   recovering trained < 48h ago   → ember dither (checker pattern fill)
//   week       trained in last 7d  → volt-dk fill
//   fresh      everything else     → panel2
// Base silhouette (head, neck, pelvis, knees) uses the slot tone. The
// supplied design is a single silhouette, so `gender` is accepted for API
// compatibility and no longer switches the figure.

const STATE_FILLS = {
  today: 'var(--q-volt)',
  week: 'var(--q-volt-dk)',
  fresh: 'var(--q-panel2)',
};

export default function PixelBodyMap({ side = 'front', states = {}, selectedKey, onSelect, width = 200 }) {
  const zones = ZONE_PATHS[side];
  const base = BASE_PATHS[side];

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

      <g fill="var(--q-slot)" stroke="var(--q-border)" strokeWidth="0.8">
        {base.map((d, i) => <path key={i} d={d} />)}
      </g>

      {Object.entries(zones).map(([key, paths]) => {
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
            stroke={selected ? 'var(--q-ink)' : 'var(--q-border)'}
            strokeWidth={selected ? 1.2 : 0.85}
          >
            {paths.map((d, i) => <path key={i} d={d} fill={fill} />)}
          </g>
        );
      })}
    </svg>
  );
}
