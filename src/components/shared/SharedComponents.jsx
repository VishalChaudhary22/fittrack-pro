import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { clamp, O } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

// ─── PULSE INDICATOR ──────────────────────────────────────────────────────────
export const PulseIndicator = ({ color = 'var(--primary)' }) => (
  <span style={{
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
    background: color, boxShadow: `0 0 12px ${color}`, animation: 'pulse 2s var(--ease-smooth) infinite',
    marginLeft: 6, verticalAlign: 'middle'
  }} />
);

// ─── GLASS TOOLTIP ────────────────────────────────────────────────────────────
export const GlassTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', padding: '10px 14px', borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-ambient)', color: 'var(--on-surface)' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: '4px 0 0 0', fontSize: 12, color: p.color || 'var(--primary)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── PROGRESS ORB ─────────────────────────────────────────────────────────────
export const ProgressOrb = ({ progress = 0, size = 120, label, subLabel }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const curr = clamp(progress, 0, 100);
  const circ = radius * 2 * Math.PI;
  const dashoffset = circ - ((curr / 100) * circ);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="orb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-container)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-container-high)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#orb-grad)" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 1s var(--ease-spring)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {label && <div className="headline-md" style={{ color: 'var(--on-surface)', lineHeight: 1 }}>{label}</div>}
        {subLabel && <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{subLabel}</div>}
      </div>
    </div>
  );
};

// ─── PORTAL (renders children at document.body to avoid transform stacking) ──
export const Portal = ({ children }) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalStyle; };
  }, []);
  return createPortal(children, document.body);
};
// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, unit, Icon, sub, trend, onClick, badge }) => (
  <div className="card" style={{ padding: '20px 18px', position: 'relative', overflow: 'hidden', cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}
    onClick={onClick}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = 'scale(1.015)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(232,84,13,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-primary)' }}>
        <Icon size={17} color="var(--primary)" />
      </div>
      {badge && <span className="tag" style={{ fontSize: 9 }}>{badge}</span>}
      {onClick && !badge && <ChevronRight size={14} color="var(--on-surface-dim)" />}
    </div>
    <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: 5 }}>{label}</div>
    <div className="display-lg" style={{ color: 'var(--on-surface)', lineHeight: 1 }}>
      {value}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4, fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: 'normal' }}>{unit}</span>
    </div>
    {sub && <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 5 }}>{sub}</div>}
    {trend !== undefined && <div style={{ fontSize: 11, marginTop: 5, color: trend > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{trend > 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)} kg since last log</div>}
  </div>
);

// ─── THEME TOGGLE PILL (DAY/NIGHT) ──────────────────────────────────────────
export const ThemeTogglePill = () => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  const w = 96;
  const h = 32;
  const pad = 3;
  const knobSize = h - pad * 2;
  const travel = w - knobSize - pad * 2;

  return (
    <div
      onClick={toggleTheme}
      role="switch"
      aria-checked={!isDark}
      aria-label="Toggle theme"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); }}}
      style={{
        width: w,
        height: h,
        borderRadius: h / 2,
        background: isDark ? '#111' : '#EFEFEF',
        boxShadow: isDark ? 'inset 0 1px 3px rgba(0,0,0,0.5)' : 'inset 0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background 0.4s ease',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
      }}
    >
      {/* Text Container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isDark ? 'flex-end' : 'flex-start',
        padding: `0 ${isDark ? 9 : 11}px`,
        pointerEvents: 'none'
      }}>
        <span style={{
          fontSize: 7,
          fontWeight: 800,
          color: isDark ? '#FFF' : '#000',
          letterSpacing: '0.5px'
        }}>
          {isDark ? 'NIGHT MODE' : 'DAY MODE'}
        </span>
      </div>

      {/* Sliding Knob */}
      <div style={{
        position: 'absolute',
        top: pad,
        left: pad,
        width: knobSize,
        height: knobSize,
        borderRadius: '50%',
        background: '#FFF',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transform: `translateX(${isDark ? 0 : travel}px)`,
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'relative', width: 16, height: 16 }}>
          <div style={{
            position: 'absolute', inset: 0,
            opacity: isDark ? 0 : 1, transition: 'opacity 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000' }}>
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            opacity: isDark ? 1 : 0, transition: 'opacity 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000' }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, sub, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
    <div>
      <div className="headline-lg pt" style={{ color: 'var(--on-surface)', lineHeight: 1.1 }}>{title}</div>
      <div style={{ width: 28, height: 3, background: 'var(--signature-gradient)', borderRadius: 3, marginTop: 6, marginBottom: 10 }} />
      {sub && <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: -4 }}>{sub}</div>}
    </div>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ThemeTogglePill />
      {action}
    </div>
  </div>
);

// ─── SCROLL PICKER ────────────────────────────────────────────────────────────
export const ScrollPicker = ({ value, onChange, items, unit = '', fmtVal = v => v }) => {
  const ref = useRef(null);
  const H = 48;
  const PAD = H * 2;

  const idx = useMemo(() => {
    const i = items.findIndex(it => String(it) === String(value));
    return i >= 0 ? i : 0;
  }, [value, items]);

  const inited = useRef(false);
  useEffect(() => {
    if (ref.current && !inited.current) {
      ref.current.scrollTop = idx * H;
      inited.current = true;
    }
  }, [idx]);

  const onScroll = useCallback(() => {
    if (!ref.current) return;
    const i = Math.round(ref.current.scrollTop / H);
    const c = clamp(i, 0, items.length - 1);
    if (items[c] !== value) onChange(items[c]);
  }, [items, onChange, value]);

  return (
    <div className="picker-wrap">
      <div className="picker-fade-top" />
      <div className="picker-fade-bot" />
      <div className="picker-sel" />
      <div ref={ref} className="picker-scroll" onScroll={onScroll}>
        <div style={{ height: PAD }} />
        {items.map((item, i) => (
          <div key={i} className="picker-item" style={{
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700,
            fontSize: String(item) === String(value) ? 32 : 22,
            color: String(item) === String(value) ? 'var(--primary)' : 'var(--on-surface-variant)',
            letterSpacing: '-0.5px',
          }} onClick={() => onChange(item)}>
            {fmtVal(item)}{unit ? ` ${unit}` : ''}
          </div>
        ))}
        <div style={{ height: PAD }} />
      </div>
    </div>
  );
};

// ─── TOAST CONTAINER ──────────────────────────────────────────────────────────
export const ToastContainer = ({ toasts, removeToast }) => (
  <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 'var(--z-toast)', display: 'flex', flexDirection: 'column', gap: 10 }}>
    {toasts.map(t => (
      <div key={t.id} className={t.exiting ? 'toast-exit' : 'toast-enter'} style={{
        background: t.type === 'error' ? 'rgba(255,59,48,.2)' : t.type === 'info' ? 'var(--surface-container-highest)' : 'rgba(248,95,27,.2)',
        color: 'var(--on-surface)', padding: '14px 20px', borderRadius: 16, fontSize: 13, fontWeight: 600,
        boxShadow: t.type === 'error' ? 'none' : 'var(--glow-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: "'Be Vietnam Pro', sans-serif", minWidth: 240, maxWidth: 380,
        border: `1px solid ${t.type === 'error' ? 'var(--error)' : t.type === 'info' ? 'var(--outline-variant)' : 'var(--primary-container)'}`,
        backdropFilter: 'var(--glass-blur)',
      }} onClick={() => removeToast(t.id)}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
        <span>{t.message}</span>
      </div>
    ))}
  </div>
);

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
export const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) => {
  if (!open) return null;
  return (
    <Portal>
      <div className="mo">
        <div className="md" style={{ maxWidth: 380, textAlign: 'center' }}>
          <div className="headline-md" style={{ marginBottom: 8, color: 'var(--on-surface)' }}>{title}</div>
          <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 20, lineHeight: 1.5 }}>{message}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-g" style={{ flex: 1, padding: '12px' }} onClick={onCancel}>Cancel</button>
            <button className={danger ? 'btn-danger' : 'btn-p'} style={{
              flex: 1, padding: '12px'
            }} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────
export const Skeleton = ({ width = '100%', height = 20, aspectRatio, borderRadius = 8, style = {} }) => (
  <div style={{
    width, height, aspectRatio, borderRadius,
    background: 'linear-gradient(90deg, var(--surface-container-low) 25%, var(--surface-container-high) 50%, var(--surface-container-low) 75%)',
    backgroundSize: '200%',
    animation: 'shimmer 2s var(--ease-smooth) infinite',
    ...style
  }} />
);

export const SkeletonCard = () => (
  <div className="card" style={{ padding: 18 }}>
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <Skeleton width={34} height={34} borderRadius={9} />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height={12} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={10} />
      </div>
    </div>
    <Skeleton height={28} style={{ marginBottom: 6 }} />
    <Skeleton width="50%" height={12} />
  </div>
);

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export const EmptyState = ({ Icon, title, message, action, actionLabel }) => (
  <div style={{ textAlign: 'center', padding: '60px 24px', border: 'none', borderRadius: 24, background: 'var(--surface-container-low)', boxShadow: 'none' }}>
    <div style={{ width: 68, height: 68, borderRadius: 18, background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--glow-primary)' }}>
      <Icon size={28} color="var(--primary)" />
    </div>
    <div className="headline-md" style={{ marginBottom: 8, color: 'var(--on-surface)' }}>{title}</div>
    <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: action ? 20 : 0, lineHeight: 1.6 }}>{message}</div>
    {action && <button className="btn-p" style={{ padding: '12px 24px' }} onClick={action}>{actionLabel}</button>}
  </div>
);
