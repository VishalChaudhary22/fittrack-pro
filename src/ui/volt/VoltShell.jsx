import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, Target, Salad, Trophy, User,
  MoreHorizontal, TrendingUp, Clock, Scale, Ruler, Mail, CalendarHeart, ChevronRight,
} from 'lucide-react';
import { VoltNav, VoltLabel } from './primitives';
import { VoltSheet } from './shared/VoltShared';
import { useLongPressSwitch } from '../../core/hooks/useDiscovery';

// ─── Volt shell navigation ───────────────────────────────────────────────────
// Replaces the V1 Sidebar + BottomNav whenever the Volt skin is active.
// Main bar mirrors V1's mobile destinations (Home, Splits, Tracker, Diet,
// Olympus League) plus Profile. A "More" button opens a Volt sheet with the
// remaining pages — Analytics, History, Weight Log, Measurements, Cycle
// Tracker, Coaching — mirroring V1's mobile More sheet (which Volt launched
// without; the pages existed but had no way in).

const ITEMS = [
  { key: '/', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { key: '/splits', label: 'Splits', icon: <Dumbbell size={20} /> },
  { key: '/workout', label: 'Tracker', icon: <Target size={20} /> },
  { key: '/diet', label: 'Diet', icon: <Salad size={20} /> },
  { key: '/muscle-map', label: 'Olympus League', icon: <Trophy size={20} /> },
  { key: '/profile', label: 'Profile', icon: <User size={20} /> },
];

const MORE_KEY = '/__more';

const MORE_ITEMS = [
  { key: '/progress', label: 'Analytics', Icon: TrendingUp },
  { key: '/history', label: 'History', Icon: Clock },
  { key: '/weight-log', label: 'Weight Log', Icon: Scale },
  { key: '/measurements', label: 'Measurements', Icon: Ruler },
  { key: '/cycle', label: 'Cycle Tracker', Icon: CalendarHeart },
  { key: '/contact', label: 'Coaching', Icon: Mail },
];

export default function VoltShellNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const onMorePage = MORE_ITEMS.some((i) => pathname.startsWith(i.key));
  const active = onMorePage
    ? MORE_KEY
    : ITEMS.find((i) => (i.key === '/' ? pathname === '/' : pathname.startsWith(i.key)))?.key ?? '/';
  // Long-press the nav bar → quick-switch sheet (V-8 discovery); the click
  // that follows a long-press is swallowed so it doesn't also navigate.
  const lp = useLongPressSwitch();

  const navItems = [...ITEMS, { key: MORE_KEY, label: 'More', icon: <MoreHorizontal size={20} /> }];

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
        <VoltNav
          items={navItems}
          active={active}
          onNavigate={(key) => { if (key === MORE_KEY) setMoreOpen(true); else navigate(key); }}
        />
      </div>

      {moreOpen && (
        <VoltSheet onClose={() => setMoreOpen(false)}>
          <VoltLabel volt>More pages</VoltLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {MORE_ITEMS.map(({ key, label, Icon }) => {
              const isActive = pathname.startsWith(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setMoreOpen(false); navigate(key); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                    minHeight: 56, padding: '8px 14px 8px 8px', textAlign: 'left',
                    background: isActive ? 'var(--v-volt)' : 'var(--v-panel)',
                    color: isActive ? '#141416' : 'var(--v-ink)',
                    border: '2px solid var(--v-edge)', borderRadius: 16, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{
                    width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--v-edge)', borderRadius: 12,
                    background: isActive ? '#141416' : 'var(--v-volt)', color: isActive ? 'var(--v-volt)' : '#141416',
                  }}>
                    <Icon size={19} />
                  </span>
                  <span style={{ flex: 1, fontSize: 15.5, fontWeight: 700 }}>{label}</span>
                  <ChevronRight size={18} style={{ opacity: 0.55, flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        </VoltSheet>
      )}
    </>
  );
}
