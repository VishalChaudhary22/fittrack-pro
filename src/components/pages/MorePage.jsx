import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Screen, Sec, LedgerRow, Action, TLink } from '../shared/Margin';

const LINKS = [
  { path: '/splits', label: 'Splits', sub: 'Your training week' },
  { path: '/progress', label: 'Analytics', sub: 'Per-exercise performance' },
  { path: '/history', label: 'History', sub: 'Every session logged' },
  { path: '/muscle-map', label: 'Olympus League', sub: 'Monthly strength ranking' },
  { path: '/measurements', label: 'Measurements', sub: 'Physique over time' },
  { path: '/weight-log', label: 'Weight log', sub: 'Every weigh-in' },
  { path: '/cycle', label: 'Cycle', sub: 'Training around your cycle' },
  { path: '/contact', label: 'Coaching', sub: 'Work with Vishal' },
];

export default function MorePage() {
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme } = useApp();

  return (
    <Screen
      kicker="More"
      right={<span className="kicker" style={{ color: 'var(--bone)' }}>{user?.name?.split(' ')[0]}</span>}
    >
      <Sec n="01" label="Account" right={user?.isAdmin ? 'admin' : 'member'}>
        <LedgerRow k="Signed in as" v={user?.name || '—'} />
        <LedgerRow
          k="Theme"
          v={theme === 'dark' ? 'Dark' : 'Light'}
          onClick={toggleTheme}
          style={{ cursor: 'pointer' }}
        />
        <Action onClick={() => navigate('/profile')}>Profile &amp; goals</Action>
      </Sec>

      <Sec n="02" label="Training">
        {LINKS.slice(0, 4).map((l) => (
          <LedgerRow
            key={l.path}
            k={l.label}
            v="→"
            tone="sm"
            onClick={() => navigate(l.path)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </Sec>

      <Sec n="03" label="Body">
        {LINKS.slice(4, 7).map((l) => (
          <LedgerRow
            key={l.path}
            k={l.label}
            v="→"
            tone="sm"
            onClick={() => navigate(l.path)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </Sec>

      <Sec n="04" label="Coaching">
        <LedgerRow
          k="Work with Vishal"
          v="→"
          tone="sm"
          onClick={() => navigate('/contact')}
          style={{ cursor: 'pointer' }}
        />
      </Sec>

      <Sec n="05" label="Session">
        <Action onClick={logout}>Sign out</Action>
      </Sec>

      <div className="foot">
        <span>Kaaya Fit</span>
        <span>Margin</span>
      </div>
    </Screen>
  );
}
