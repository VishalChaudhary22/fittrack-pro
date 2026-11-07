// ─── QuestLoader — the Fighter loading screen ───────────────────────────────
// Design B (picked by Vishal 2026-11-07): the player's OWN selected fighter
// — useFighter() reads the device-local pick, never hard-coded to KAI —
// flexes and bobs beside a stepped SegBar while the flavour line rotates.
// Progress is indeterminate: the bar creeps to 12/14 and holds there; it
// never fakes a completion the app hasn't reached.
import { useEffect, useState } from 'react';
import { SegBar } from '../primitives';
import { FighterSprite, useFighter } from '../fighters';

const FLAVOURS = [
  'CHALKING HANDS…',
  'RACKING WEIGHTS…',
  'LOADING MUSCLES…',
  'QUEUING COMBOS…',
  'SHARPENING BLADES…',
  'FEEDING THE FIRE…',
];
const SEGMENTS = 14;
const CAP = 12; // hold at 12/14 (~86%) until the real load lands

function useLoaderState() {
  const [n, setN] = useState(0);
  const [fi, setFi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN(v => (v >= CAP ? v : v + 1)), 150);
    const f = setInterval(() => setFi(v => (v + 1) % FLAVOURS.length), 1500);
    return () => { clearInterval(t); clearInterval(f); };
  }, []);
  return { n, flavour: FLAVOURS[fi] };
}

export function QuestLoader() {
  const { fighter } = useFighter();
  const { n, flavour } = useLoaderState();
  return (
    <div style={{ width: 'min(320px, 84vw)' }} role="status" aria-label="Loading">
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <span className="q-bob" style={{ display: 'inline-flex' }}>
          <FighterSprite fighter={fighter} state="flex" size={96} />
        </span>
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 6 }}>
          <div className="q-ps" style={{ fontSize: 12 }}>
            Now Loading<span className="q-blink">…</span>
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 36, lineHeight: 1.1 }}>
            {Math.round((n / SEGMENTS) * 100)}%
          </div>
        </div>
      </div>
      <SegBar value={n / SEGMENTS} segments={SEGMENTS} style={{ marginTop: 16 }} />
      <div style={{ fontFamily: "'VT323', monospace", fontSize: 21, color: 'var(--q-dim)', letterSpacing: '0.06em', marginTop: 12, minHeight: 24 }}>
        {flavour}
      </div>
    </div>
  );
}

// Full-screen boot: shown while the app restores the session and pulls
// cloud data (App.jsx authLoading, Quest skin only).
export function QuestBootLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--q-canvas)', padding: 24,
    }}>
      <div className="q-ps" style={{ fontSize: 13, color: 'var(--q-dim)', marginBottom: 30, letterSpacing: '0.1em' }}>
        Kaaya Quest
      </div>
      <QuestLoader />
    </div>
  );
}

// Route fallback: a page chunk is on its way (routes.jsx SkinGate).
export function QuestRouteLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '55vh', padding: 24 }}>
      <QuestLoader />
    </div>
  );
}

// Mini: a short looping stepped bar for in-page waits (FORGE thinking).
export function QuestLoaderMini({ width = 132 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN(v => (v + 1) % 14), 130);
    return () => clearInterval(t);
  }, []);
  return (
    <SegBar
      value={n <= 10 ? n / 10 : 1}
      segments={10}
      style={{ width }}
    />
  );
}
