import { useEffect, useRef, useState } from 'react';
import { FRONT_MAP, BACK_MAP, BODY_W, BODY_H } from './bodyMapData';
import { FRONT_DARK, FRONT_LIGHT, BACK_DARK, BACK_LIGHT } from './bodyArt';

// ─── Kaaya Quest · pixel body map (plan §7.4) ────────────────────────────────
// The figure IS the reference artwork Vishal supplied (Gemini, 2026-11-01),
// extracted pixel-for-pixel and re-tinted live by training state:
// bodyArt.js holds per-view/per-theme WebP atlases — a fresh-tinted base
// figure, one patch per zone per state (today / week / recovering, built
// from the art's own luminance so its shading survives), and the art's
// original outline/groove layer drawn on top. This canvas renderer draws
// base → state patches → lines. Zone states come from the page:
//   today      trained today       → volt
//   recovering trained < 48h ago   → ember dither
//   week       trained in last 7d  → volt-dk
//   fresh      everything else     → panel tone
// The traced 48×84 runs (bodyMapData.js) remain as the tap targets, the
// today-pulse / selection overlay, and the fallback renderer if the atlas
// fails to load. `gender` is accepted for API compatibility; the supplied
// design is a single silhouette.

const ART = {
  front: { dark: FRONT_DARK, light: FRONT_LIGHT },
  back: { dark: BACK_DARK, light: BACK_LIGHT },
};

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

function RunsMap({ map, states, selectedKey }) {
  return (
    <>
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
          <g key={key} className={state === 'today' ? 'q-zone-pulse' : undefined}>
            <Rects runs={zone.fill} fill={fill} />
            {zone.shade && <Rects runs={zone.shade} fill="#000" opacity={0.18} />}
            {zone.shine && <Rects runs={zone.shine} fill="#FFF" opacity={0.18} />}
          </g>
        );
      })}
      <Rects runs={map.lines} fill="var(--q-border)" />
      {selectedKey && map.zones[selectedKey] && (
        <Rects runs={map.zones[selectedKey].fill} fill="var(--q-ink)" opacity={0.3} />
      )}
    </>
  );
}

function useHtmlTheme() {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

export default function PixelBodyMap({ side = 'front', states = {}, selectedKey, onSelect, width = 200 }) {
  const map = side === 'back' ? BACK_MAP : FRONT_MAP;
  const theme = useHtmlTheme();
  const art = ART[side][theme];
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  // The loaded atlas is keyed by side+theme and the canvas only ever draws
  // when the key matches the current view — a stale atlas must never pair
  // with another view's layout (that mismatch smears foreign patches).
  const artKey = `${side}:${theme}`;
  const [loadedKey, setLoadedKey] = useState(null);
  const artReady = loadedKey === artKey;
  const statesKey = JSON.stringify(states);
  // Bitmap matched to the display size x device pixel ratio, so the art is
  // resampled exactly once (drawImage) and never again by the browser —
  // a second resample is what produced moire banding on the bright zones.
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const bitmapW = Math.round(width * dpr);
  const bitmapH = Math.round(bitmapW * BODY_H / BODY_W);
  const pxf = bitmapW / BODY_W;

  useEffect(() => {
    let live = true;
    const img = new Image();
    img.onload = () => { if (live) { imgRef.current = { img, key: artKey }; setLoadedKey(artKey); } };
    img.onerror = () => { if (live) { imgRef.current = null; setLoadedKey(null); } };
    img.src = art.src;
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side, theme]);

  useEffect(() => {
    if (!artReady || !canvasRef.current || !imgRef.current || imgRef.current.key !== artKey) return;
    const ctx = canvasRef.current.getContext('2d');
    const img = imgRef.current.img;
    const { geo, layout } = art;
    const parsedStates = JSON.parse(statesKey);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, bitmapW, bitmapH);
    ctx.setTransform(pxf, 0, 0, pxf, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const drawPatch = (srcRect, dxArt, dyArt) => {
      const dx = geo.x + dxArt / geo.cw;
      const dy = geo.y + dyArt / geo.chh;
      ctx.drawImage(img, srcRect[0], srcRect[1], srcRect[2], srcRect[3], dx, dy, srcRect[2] / geo.cw, srcRect[3] / geo.chh);
    };
    drawPatch(layout.base, 0, 0);
    for (const [key, zone] of Object.entries(layout.zones)) {
      const state = parsedStates[key] || 'fresh';
      if (state === 'fresh') continue;
      const patch = zone.states[state];
      if (patch) drawPatch(patch, zone.dx, zone.dy);
    }
    if (layout.lines) drawPatch(layout.lines, 0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artReady, side, theme, statesKey, bitmapW]);

  const height = Math.round(width * BODY_H / BODY_W);

  return (
    <div style={{ position: 'relative', width, height }} role="img" aria-label={`Pixel body map, ${side} view`}>
      {artReady ? (
        <canvas
          ref={canvasRef}
          width={bitmapW}
          height={bitmapH}
          style={{ position: 'absolute', inset: 0, width, height, display: 'block' }}
        />
      ) : (
        <svg
          viewBox={`0 0 ${BODY_W} ${BODY_H}`}
          width={width}
          height={height}
          shapeRendering="crispEdges"
          style={{ position: 'absolute', inset: 0, display: 'block' }}
          aria-hidden="true"
        >
          <RunsMap map={map} states={states} selectedKey={selectedKey} />
        </svg>
      )}
      {/* overlay: today pulse, selection wash, tap targets */}
      <svg
        viewBox={`0 0 ${BODY_W} ${BODY_H}`}
        width={width}
        height={height}
        shapeRendering="crispEdges"
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      >
        {Object.entries(map.zones).map(([key, zone]) => {
          const state = states[key] || 'fresh';
          return (
            <g
              key={key}
              onClick={onSelect ? () => onSelect(key) : undefined}
              style={onSelect ? { cursor: 'pointer' } : undefined}
              className={artReady && state === 'today' ? 'q-zone-pulse' : undefined}
              role={onSelect ? 'button' : undefined}
              aria-label={onSelect ? `${key} details` : undefined}
            >
              {artReady && state === 'today' && <Rects runs={zone.fill} fill="var(--q-volt)" opacity={0.22} />}
              {artReady && selectedKey === key && <Rects runs={zone.fill} fill="var(--q-ink)" opacity={0.3} />}
              {/* transparent hit area keeps the group tappable over the canvas */}
              <Rects runs={zone.fill} fill="#FFF" opacity={0} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
