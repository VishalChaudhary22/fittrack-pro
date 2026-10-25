import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Target, Salad, Trophy, User } from 'lucide-react';
import { VoltNav } from './primitives';

// ─── Volt shell navigation (V-3) ─────────────────────────────────────────────
// Replaces the V1 Sidebar + BottomNav whenever the Volt skin is active.
// Mirrors V1's mobile main destinations (Home, Splits, Tracker, Diet,
// Olympus League) plus Profile, which carries the design toggle and must
// always be reachable. Remaining routes stay reachable from page content
// until their Volt twins land (V-6); a full Volt "More" sheet joins then.

const ITEMS = [
  { key: '/', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { key: '/splits', label: 'Splits', icon: <Dumbbell size={20} /> },
  { key: '/workout', label: 'Tracker', icon: <Target size={20} /> },
  { key: '/diet', label: 'Diet', icon: <Salad size={20} /> },
  { key: '/muscle-map', label: 'Olympus League', icon: <Trophy size={20} /> },
  { key: '/profile', label: 'Profile', icon: <User size={20} /> },
];

export default function VoltShellNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = ITEMS.find((i) => (i.key === '/' ? pathname === '/' : pathname.startsWith(i.key)))?.key ?? '/';

  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 100 }}>
      <VoltNav items={ITEMS} active={active} onNavigate={(key) => navigate(key)} />
    </div>
  );
}
