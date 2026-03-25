import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { clamp, O } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

// ─── PORTAL (renders children at document.body to avoid transform stacking) ──
export const Portal = ({ children }) => createPortal(children, document.body);
// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, unit, Icon, sub, trend, onClick, badge }) => (
  <div className="card" style={{ padding: '20px 18px', position: 'relative', overflow: 'hidden', cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}
    onClick={onClick}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = 'scale(1.015)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(232,84,13,.08)' }}>
        <Icon size={17} color="var(--o)" />
      </div>
      {badge && <span className="tag" style={{ fontSize: 9 }}>{badge}</span>}
      {onClick && !badge && <ChevronRight size={14} color="var(--t3)" />}
    </div>
    <div style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: 5 }}>{label}</div>
    <div className="bb" style={{ fontSize: 34, color: 'var(--tx)', lineHeight: 1 }}>
      {value}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--t2)', marginLeft: 4, fontFamily: "'DM Sans'" }}>{unit}</span>
    </div>
    {sub && <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 5 }}>{sub}</div>}
    {trend !== undefined && <div style={{ fontSize: 11, marginTop: 5, color: trend > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{trend > 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)} kg since last log</div>}
  </div>
);

// ─── THEME TOGGLE PILL (DAY/NIGHT) ──────────────────────────────────────────
export const ThemeTogglePill = () => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  const w = 108;
  const h = 36;
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
        padding: `0 ${isDark ? 12 : 14}px`,
        pointerEvents: 'none'
      }}>
        <span style={{
          fontSize: 9,
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
      <div className="bb pt" style={{ fontSize: 32, color: 'var(--tx)', lineHeight: 1 }}>{title}</div>
      <div className="abar" style={{ marginTop: 6 }} />
      {sub && <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: -4 }}>{sub}</div>}
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
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: String(item) === String(value) ? 32 : 22,
            color: String(item) === String(value) ? O : 'var(--t2)',
            letterSpacing: '1px',
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
  <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
    {toasts.map(t => (
      <div key={t.id} className={t.exiting ? 'toast-exit' : 'toast-enter'} style={{
        background: t.type === 'error' ? 'rgba(255,59,48,.92)' : t.type === 'info' ? 'rgba(26,26,30,.92)' : 'rgba(232,84,13,.92)',
        color: '#fff', padding: '14px 20px', borderRadius: 16, fontSize: 13, fontWeight: 600,
        boxShadow: '0 8px 32px rgba(0,0,0,.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: "'DM Sans', sans-serif", minWidth: 240, maxWidth: 380,
        border: `1px solid ${t.type === 'error' ? 'rgba(255,59,48,.3)' : t.type === 'info' ? 'rgba(255,255,255,.06)' : 'rgba(232,84,13,.3)'}`,
        backdropFilter: 'blur(16px)',
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
          <div className="bb" style={{ fontSize: 22, marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 20, lineHeight: 1.5 }}>{message}</div>
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
export const Skeleton = ({ width = '100%', height = 20, borderRadius = 8, style = {} }) => (
  <div className="skeleton-pulse" style={{ width, height, borderRadius, background: 'var(--c3)', ...style }} />
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
  <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed var(--bd2)', borderRadius: 22, background: 'var(--c1)', boxShadow: 'var(--shadow)' }}>
    <div style={{ width: 68, height: 68, borderRadius: 18, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 24px rgba(232,84,13,.08)' }}>
      <Icon size={28} color="var(--o)" />
    </div>
    <div className="bb" style={{ fontSize: 22, marginBottom: 8, color: 'var(--tx)' }}>{title}</div>
    <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: action ? 20 : 0, lineHeight: 1.6 }}>{message}</div>
    {action && <button className="btn-p" style={{ padding: '12px 24px' }} onClick={action}>{actionLabel}</button>}
  </div>
);
