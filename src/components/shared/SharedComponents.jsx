import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { clamp, O } from '../../utils/helpers';

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
    {trend !== undefined && <div style={{ fontSize: 11, marginTop: 5, color: trend > 0 ? '#FF6B6B' : '#51CF66', fontWeight: 600 }}>{trend > 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)} kg this week</div>}
  </div>
);

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, sub, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
    <div>
      <div className="bb pt" style={{ fontSize: 32, color: 'var(--tx)', lineHeight: 1 }}>{title}</div>
      <div className="abar" style={{ marginTop: 6 }} />
      {sub && <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: -4 }}>{sub}</div>}
    </div>
    {action}
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
            <button className={danger ? 'btn-p' : 'btn-p'} style={{
              flex: 1, padding: '12px',
              background: danger ? '#FF3B30' : 'var(--og)',
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
