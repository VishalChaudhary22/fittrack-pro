/**
 * MARGIN — structural primitives.
 *
 * Every page composes from these. The point is that the design language lives
 * in one place: if a Ledger row changes, it changes everywhere, and no page
 * gets to invent its own card.
 *
 * Ember discipline: <One> and <Action ember> are the only two components here
 * that emit the accent colour. If a screen needs a third, the screen is wrong.
 */
import { useNavigate, useLocation } from 'react-router-dom';

/* ─── SCREEN ─────────────────────────────────────────────────────────────── */
export const Screen = ({ kicker, right, children, className = '' }) => (
  <div className={`pg-in ${className}`} style={{ marginLeft: -22, marginRight: -22, position: 'relative', minHeight: '100vh' }}>
    <span className="margin-rule" aria-hidden="true" />
    <div className="head" style={{ paddingRight: 22 }}>
      <div className="head-l">
        <span className="kicker">{kicker}</span>
      </div>
      {right && <div className="head-r">{right}</div>}
    </div>
    {children}
  </div>
);

/* ─── SECTION ────────────────────────────────────────────────────────────── */
export const Sec = ({ n, label, right, children, style }) => (
  <section className="sec" style={style}>
    {n != null && <span className="sec-num">{n}</span>}
    <div className="sec-label">
      <span>{label}</span>
      {right && <span className="r">{right}</span>}
    </div>
    {children}
  </section>
);

/* ─── HERO NUMBER ────────────────────────────────────────────────────────── */
export const Hero = ({ value, unit, size = 'lg', style }) => {
  const cls = size === 'sm' ? 'hero hero-sm' : size === 'xs' ? 'hero hero-xs' : 'hero';
  return (
    <span className={cls} style={style}>
      {value}
      {unit && <span className="u">{unit}</span>}
    </span>
  );
};

/* ─── LEDGER ─────────────────────────────────────────────────────────────── */
export const LedgerRow = ({ k, v, sub, tone = '', dim, emberLead, onClick, style, children }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className="row"
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        borderTop: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        font: 'inherit',
        ...style,
      }}
    >
      <span className={`k${dim ? ' dim' : ''}`}>{k}</span>
      <span className={`lead${emberLead ? ' ember' : ''}`} />
      {children !== undefined ? (
        children
      ) : (
        <span className={`v${tone ? ` ${tone}` : ''}`}>
          {v}
          {sub && <span className="sub">{sub}</span>}
        </span>
      )}
    </Tag>
  );
};

/* ─── AMPLITUDE RULE ─────────────────────────────────────────────────────── */
export const Amp = ({ pct = 0, tone = '', cap = true, style }) => {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      className={`amp${tone ? ` ${tone}` : ''}${cap ? ' cap' : ''}`}
      style={{ '--fill': `${clamped}%`, ...style }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

/* ─── TICK PAPER ─────────────────────────────────────────────────────────── */
// values: array of 0..1 heights, or objects { h, kind: 'on'|'full'|'today'|'rest' }
export const Ticks = ({ values = [], height = 34, style }) => (
  <div className="ticks" style={{ height, ...style }} aria-hidden="true">
    {values.map((v, i) => {
      if (typeof v === 'number') {
        return <i key={i} style={{ height: `${Math.max(6, v * 100)}%` }} />;
      }
      return <i key={i} className={v.kind || ''} />;
    })}
  </div>
);

/* ─── THE ONE THING ──────────────────────────────────────────────────────── */
export const One = ({ title, sub, children }) => (
  <div className="one">
    <div className="t">{title}</div>
    {sub && <div className="s">{sub}</div>}
    {children}
  </div>
);

/* ─── MARGIN NOTE ────────────────────────────────────────────────────────── */
export const Note = ({ children }) => (
  <div className="note">
    <p>{children}</p>
  </div>
);

/* ─── ACTION ─────────────────────────────────────────────────────────────── */
export const Action = ({ children, onClick, ember, disabled, arrow = '→', style }) => (
  <button
    className={`act${ember ? ' ember' : ''}`}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    <span>{children}</span>
    <span className="arrow">{arrow}</span>
  </button>
);

/* ─── TEXT LINK ──────────────────────────────────────────────────────────── */
export const TLink = ({ children, onClick, ember, style }) => (
  <button className={`tlink${ember ? ' em' : ''}`} onClick={onClick} style={style}>
    {children}
  </button>
);

/* ─── STATUS WORD ────────────────────────────────────────────────────────── */
export const Word = ({ tone = 'idle', children }) => (
  <span className={`word ${tone}`}>{children}</span>
);

/* ─── BALANCE ROW (progress toward a goal) ───────────────────────────────── */
export const Balance = ({ label, current, target, unit, pct, ember, note }) => (
  <div style={{ marginTop: 14 }}>
    <div className="rowf between" style={{ marginBottom: 3 }}>
      <span className="kicker" style={{ color: 'var(--ash-dim)' }}>{label}</span>
      <span className="kicker" style={{ color: 'var(--bone)' }}>
        {current}{target ? ` / ${target}${unit || ''}` : ''}
      </span>
    </div>
    <Amp pct={pct ?? (target ? (current / target) * 100 : 0)} ember={ember} />
    {note && <p className="body-dim" style={{ marginTop: 6 }}>{note}</p>}
  </div>
);

/* ─── TAB BAR ────────────────────────────────────────────────────────────── */
const TAB_LABELS = { '/': 'Today', '/workout': 'Session', '/diet': 'Food', '/profile': 'Body', '/more': 'More' };

export const Tabs = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // secondary routes light up "More"
  const secondary = ['/more', '/splits', '/split-builder', '/progress', '/history',
    '/weight-log', '/measurements', '/muscle-map', '/contact', '/cycle'];
  const isMore = secondary.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const items = [
    { path: '/', label: TAB_LABELS['/'] },
    { path: '/workout', label: TAB_LABELS['/workout'] },
    { path: '/diet', label: TAB_LABELS['/diet'] },
    { path: '/profile', label: TAB_LABELS['/profile'] },
    { path: '/more', label: TAB_LABELS['/more'] },
  ];

  return (
    <nav className="tabs" aria-label="Primary">
      {items.map(({ path, label }) => {
        const active = path === '/more' ? isMore : pathname === path;
        return (
          <button
            key={path}
            className={active ? 'on' : ''}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
};
