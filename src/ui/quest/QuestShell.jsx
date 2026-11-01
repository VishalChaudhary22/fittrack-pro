import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuestNav, QuestLabel } from './primitives';
import PixelSprite from './PixelSprite';
import { useLongPressSwitch } from '../../core/hooks/useDiscovery';
import { questSound } from './sound';

// ─── Quest shell navigation ──────────────────────────────────────────────────
// Mirrors VoltShellNav's structure and destinations (route parity is the
// contract): six main destinations in the bar, the rest behind MORE, and
// the same long-press quick-switch discovery gesture. Pages fall back
// Quest → Volt → V1 in SkinGate; the chrome is Quest's from Q-1.

const ITEMS = [
  { key: '/', label: 'Today', sprite: 'home' },
  { key: '/splits', label: 'Splits', sprite: 'grid' },
  { key: '/workout', label: 'Fight', sprite: 'dumbbell' },
  { key: '/diet', label: 'Diet', sprite: 'apple' },
  { key: '/muscle-map', label: 'Arena', sprite: 'trophy' },
  { key: '/profile', label: 'You', sprite: 'person' },
];

const MORE_KEY = '/__more';

const MORE_ITEMS = [
  { key: '/progress', label: 'Progress', sprite: 'chart' },
  { key: '/history', label: 'Quest Log', sprite: 'clock' },
  { key: '/weight-log', label: 'Weight Log', sprite: 'scale' },
  { key: '/measurements', label: 'Measurements', sprite: 'ruler' },
  { key: '/cycle', label: 'Cycle Tracker', sprite: 'moon' },
  { key: '/contact', label: 'Coaching', sprite: 'mail' },
];

export default function QuestShellNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const onMorePage = MORE_ITEMS.some((i) => pathname.startsWith(i.key));
  const active = onMorePage
    ? MORE_KEY
    : ITEMS.find((i) => (i.key === '/' ? pathname === '/' : pathname.startsWith(i.key)))?.key ?? '/';
  const lp = useLongPressSwitch();

  const navItems = [...ITEMS, { key: MORE_KEY, label: 'More', sprite: 'dots' }];

  return (
    <>
      <div
        style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 100 }}
        onPointerDown={lp.start}
        onPointerUp={lp.clear}
        onPointerLeave={lp.clear}
        onPointerCancel={lp.clear}
        onClickCapture={(e) => { if (lp.consume()) { e.preventDefault(); e.stopPropagation(); } }}
      >
        <QuestNav
          items={navItems}
          active={active}
          onNavigate={(key) => { questSound('tap'); if (key === MORE_KEY) setMoreOpen(true); else navigate(key); }}
        />
      </div>

      {moreOpen && (
        <div className="q-sheet-wrap" onClick={() => setMoreOpen(false)}>
          <div className="q-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="More pages">
            <QuestLabel tone="volt">More pages</QuestLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {MORE_ITEMS.map(({ key, label, sprite }) => {
                const isActive = pathname.startsWith(key);
                return (
                  <button
                    key={key}
                    type="button"
                    className={isActive ? 'q-sheet-row q-sheet-row--active' : 'q-sheet-row'}
                    onClick={() => { questSound('tap'); setMoreOpen(false); navigate(key); }}
                  >
                    <PixelSprite name={sprite} size={24} />
                    <span style={{ flex: 1 }}>{label}</span>
                    <PixelSprite name="chevR" size={12} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
