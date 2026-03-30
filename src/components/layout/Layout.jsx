import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Sun, Moon, MoreHorizontal, Zap } from 'lucide-react';
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
    <div className="ds" style={{ width: sb ? 230 : 54, background: 'var(--surface-container-low)', borderRight: 'none', display: 'flex', flexDirection: 'column', transition: 'width .22s var(--ease-spring)', flexShrink: 0, position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden', zIndex: 'var(--z-nav)' }}>
      <div style={{ padding: '24px 16px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setSb(!sb)}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--signature-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--glow-primary)' }}><Dumbbell size={18} color="var(--on-primary)" /></div>
        {sb && <div className="headline-md" style={{ color: 'var(--on-surface)', whiteSpace: 'nowrap' }}>FITTRACK</div>}
      </div>
      {sb && <div style={{ padding: '0 16px 16px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'var(--on-surface)', fontSize: 12, flexShrink: 0, overflow: 'hidden' }}>
          {user?.avatarUrl ? <img src={user.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.avatar}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: 4 }}>{user?.isAdmin ? <><Zap size={10} color="var(--primary)" /> Admin</> : 'Member'}</div>
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
      <div style={{ padding: '8px 8px', marginTop: 8 }}>
        <div className="ni" onClick={toggleTheme} style={{ justifyContent: sb ? 'flex-start' : 'center' }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {sb && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </div>
      </div>
      {sb && <div style={{ padding: '10px 20px 20px 20px', fontSize: 11, color: 'var(--on-surface-dim)' }}>FitTrack Pro v5.1</div>}
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
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px 2px',
            color: isActive(path) ? 'var(--primary)' : 'var(--on-surface-variant)', transition: 'color .15s var(--ease-smooth)', minWidth: 0,
          }}>
            <Icon size={20} />
            <span style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: '.3px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{label}</span>
          </button>
        ))}
        <button onClick={() => setShowMore(!showMore)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer', padding: '6px 2px',
          color: showMore || moreActive ? 'var(--primary)' : 'var(--on-surface-variant)', transition: 'color .15s var(--ease-smooth)', minWidth: 0,
        }}>
          <MoreHorizontal size={20} />
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.3px', textTransform: 'uppercase' }}>More</span>
        </button>
      </nav>

      {/* More sheet */}
      {showMore && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 'calc(var(--z-nav) - 1)' }} onClick={() => setShowMore(false)}>
          <div style={{
            position: 'fixed', bottom: 'calc(52px + env(safe-area-inset-bottom))', left: 8, right: 8,
            background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', border: 'none', borderRadius: 24, padding: '16px',
            boxShadow: 'var(--shadow-ambient)', zIndex: 'var(--z-nav)',
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

