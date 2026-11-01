import { FRONT_MAP, BACK_MAP, BODY_W, BODY_H } from './bodyMapData';

// ─── Kaaya Quest · pixel body map (plan §7.4) ────────────────────────────────
// Renders the figure traced from the reference artwork Vishal supplied
// (bodyMapData.js, 48×84 cell grid): zone fills with brightness-derived
// shine/shade overlays, and the carved black outline/groove cells drawn as
// a top layer so muscles stay separated in every state. Zones are keyed
// to the canonical MUSCLE_GROUPS ids; states come from the page:
//   today      trained today       → volt fill + slow steps-pulse
//   recovering trained < 48h ago   → ember dither (checker pattern fill)
//   week       trained in last 7d  → volt-dk fill
//   fresh      everything else     → panel2
// Base silhouette (head, neck) uses the slot tone. The supplied design is
// a single silhouette, so `gender` is accepted for API compatibility and
// no longer switches the figure.

const STATE_FILLS = {
  today: 'var(--q-volt)',
  week: 'var(--q-volt-dk)',
  fresh: 'var(--q-panel2)',
};

const Rects = ({ runs, fill, opacity }) => (
  <>
    {runs.map((r, i) => (
      <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={fill} opacity={opacity} stroke="none" />
    ))}
  </>
);

export default function PixelBodyMap({ side = 'front', states = {}, selectedKey, onSelect, width = 200 }) {
  const map = side === 'back' ? BACK_MAP : FRONT_MAP;

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

      <Rects runs={map.base} fill="var(--q-slot)" />

      {Object.entries(map.zones).map(([key, zone]) => {
        const state = states[key] || 'fresh';
        const fill = state === 'recovering' ? 'url(#q-dither-pat)' : STATE_FILLS[state];
        return (
          <g
            key={key}
            onClick={onSelect ? () => onSelect(key) : undefined}
            style={onSelect ? { cursor: 'pointer' } : undefined}
            className={state === 'today' ? 'q-zone-pulse' : undefined}
            role={onSelect ? 'button' : undefined}
            aria-label={onSelect ? `${key} details` : undefined}
          >
            <Rects runs={zone.fill} fill={fill} />
            {zone.shade && <Rects runs={zone.shade} fill="#000" opacity={0.18} />}
            {zone.shine && <Rects runs={zone.shine} fill="#FFF" opacity={0.18} />}
          </g>
        );
      })}

      {/* carved outline + groove lines above every zone */}
      <Rects runs={map.lines} fill="var(--q-border)" />
      {selectedKey && map.zones[selectedKey] && (
        <Rects runs={map.zones[selectedKey].fill} fill="var(--q-ink)" opacity={0.3} />
      )}
    </svg>
  );
}
