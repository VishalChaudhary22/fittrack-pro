import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Sun, Moon, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV, NAV_MOBILE_MAIN, NAV_MOBILE_MORE } from '../../data/constants';

// ─── DESKTOP SIDEBAR ──────────────────────────────────────────────────────────
export const Sidebar = () => {
  const { user, theme, toggleTheme } = useApp();
  const [sb, setSb] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isActive = (path) => path === '/' ? currentPath === '/' : currentPath.startsWith(path);

  return (
    <div className="ds" style={{ width: sb ? 220 : 54, background: 'var(--c1)', borderRight: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', transition: 'width .22s cubic-bezier(.4,0,.2,1)', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
      <div style={{ padding: '16px 12px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setSb(!sb)}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--og)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Dumbbell size={15} color="#fff" /></div>
        {sb && <div className="bb" style={{ fontSize: 16, letterSpacing: '2px', color: 'var(--o)', whiteSpace: 'nowrap' }}>FITTRACK PRO</div>}
      </div>
      {sb && <div style={{ padding: '11px 12px', borderBottom: '1px solid var(--bd)', display: 'flex', gap: 9, alignItems: 'center' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--og)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue'", color: '#fff', fontSize: 12, flexShrink: 0 }}>{user?.avatar}</div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize: 9, color: 'var(--t3)' }}>{user?.isAdmin ? '⚡ Admin' : 'Member'}</div>
        </div>
      </div>}
      <nav style={{ padding: '7px 5px', flex: 1, overflowY: 'auto' }}>
        {NAV.map(({ id, label, Icon, path }) => (
          <div key={id} className={`ni ${isActive(path) ? 'act' : ''}`} onClick={() => navigate(path)} title={!sb ? label : ''} style={{ justifyContent: sb ? 'flex-start' : 'center' }}>
            <Icon size={16} />{sb && <span>{label}</span>}
          </div>
        ))}
        <div className="sep" />
        {[
          { label: 'History', path: '/history', Icon: NAV_MOBILE_MORE.find(n => n.id === 'history').Icon },
          { label: 'Weight Log', path: '/weight-log', Icon: NAV_MOBILE_MORE.find(n => n.id === 'weightlog').Icon },
          { label: 'Measurements', path: '/measurements', Icon: NAV_MOBILE_MORE.find(n => n.id === 'measurements').Icon },
        ].map(({ label, path, Icon }) => (
          <div key={path} className={`ni ${isActive(path) ? 'act' : ''}`} onClick={() => navigate(path)} title={!sb ? label : ''} style={{ justifyContent: sb ? 'flex-start' : 'center' }}>
            <Icon size={16} />{sb && <span>{label}</span>}
          </div>
        ))}
      </nav>
      <div style={{ padding: '8px 5px', borderTop: '1px solid var(--bd)' }}>
        <div className="ni" onClick={toggleTheme} style={{ justifyContent: sb ? 'flex-start' : 'center' }}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {sb && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </div>
      </div>
      {sb && <div style={{ padding: '10px 14px', borderTop: '1px solid var(--bd)', fontSize: 9, color: 'var(--t3)' }}>FitTrack Pro v5.0</div>}
    </div>
  );
};

// ─── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
export const BottomNav = () => {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => path === '/' ? currentPath === '/' : currentPath.startsWith(path);

  const moreActive = NAV_MOBILE_MORE.some(n => isActive(n.path));

  return (
    <>
      <nav className="bn">
        {NAV_MOBILE_MAIN.map(({ id, label, Icon, path }) => (
          <button key={id} onClick={() => { navigate(path); setShowMore(false); }} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'none', border: 'none', cursor: 'pointer', padding: '5px 2px',
            color: isActive(path) ? 'var(--o)' : 'var(--t3)', transition: 'color .15s', minWidth: 0,
          }}>
            <Icon size={18} />
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.3px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{label}</span>
          </button>
        ))}
        <button onClick={() => setShowMore(!showMore)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          background: 'none', border: 'none', cursor: 'pointer', padding: '5px 2px',
          color: showMore || moreActive ? 'var(--o)' : 'var(--t3)', transition: 'color .15s', minWidth: 0,
        }}>
          <MoreHorizontal size={18} />
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.3px', textTransform: 'uppercase' }}>More</span>
        </button>
      </nav>

      {/* More sheet */}
      {showMore && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowMore(false)}>
          <div style={{
            position: 'fixed', bottom: 'calc(52px + env(safe-area-inset-bottom))', left: 8, right: 8,
            background: 'var(--c1)', border: '1px solid var(--bd)', borderRadius: 16, padding: '8px',
            boxShadow: '0 -8px 32px rgba(0,0,0,.5)', zIndex: 100,
          }} onClick={e => e.stopPropagation()}>
            {NAV_MOBILE_MORE.map(({ id, label, Icon, path }) => (
              <div key={id} className={`ni ${isActive(path) ? 'act' : ''}`}
                onClick={() => { navigate(path); setShowMore(false); }}>
                <Icon size={16} /><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

