import { useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../../core/context/AppContext';
import { clamp } from '../../../utils/helpers';
import { VoltPill } from '../primitives';

// ─── Volt popup pack (V-7) ────────────────────────────────────────────────────
// Volt twins of the V1 shared popups in ui/v1/shared/SharedComponents.jsx —
// same props and behavior, Volt presentation. V1 originals stay untouched for
// the Original Kaaya skin.

// ModalPortal is skin-neutral (scroll lock + body portal) — re-export V1's.
export { ModalPortal, Portal } from '../../v1/shared/SharedComponents';

// ─── Bottom sheet shell ───────────────────────────────────────────────────────
// Backdrop + panel that rises with the drawer curve (Emil). Sheets are the
// Volt default for pickers/forms; dialogs (confirm) stay centered.
export function VoltSheet({ onClose, children, maxHeight = '88dvh' }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,.62)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        className="v-sheet-up"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%', maxWidth: 480, maxHeight, overflowY: 'auto',
          background: 'var(--v-panel)', color: 'var(--v-ink)',
          borderTop: '2.5px solid var(--v-edge)', borderLeft: '2.5px solid var(--v-edge)', borderRight: '2.5px solid var(--v-edge)',
          borderRadius: '24px 24px 0 0', padding: '14px 20px calc(26px + env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 -6px 0 var(--v-shadow)',
        }}
      >
        <div aria-hidden="true" style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--v-edge)', opacity: .45, margin: '0 auto 16px' }} />
        {children}
      </div>
    </div>
  );
}

// ─── Centered dialog shell (confirms, chat) ───────────────────────────────────
export function VoltDialog({ onClose, children, maxWidth = 420 }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}
    >
      <div
        className="v-pop"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%', maxWidth, maxHeight: '88dvh', overflowY: 'auto',
          background: 'var(--v-panel)', color: 'var(--v-ink)',
          border: '2.5px solid var(--v-edge)', borderRadius: 22,
          padding: 22, boxShadow: '6px 6px 0 var(--v-shadow-hero)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Confirm dialog — same props as V1 ConfirmDialog ─────────────────────────
export const VoltConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) => {
  if (!open) return null;
  return createPortal(
    <VoltDialog onClose={onCancel} maxWidth={380}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: 'var(--v-dim)', marginBottom: 22, lineHeight: 1.55 }}>{message}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <VoltPill ghost style={{ flex: 1 }} onClick={onCancel}>{cancelLabel}</VoltPill>
          <VoltPill
            style={{ flex: 1, ...(danger ? { background: 'var(--v-coral)', color: '#fff' } : {}) }}
            onClick={onConfirm}
          >{confirmLabel}</VoltPill>
        </div>
      </div>
    </VoltDialog>,
    document.body
  );
};

// ─── Scroll picker — same props/logic as V1 ScrollPicker ─────────────────────
export const VoltScrollPicker = ({ value, onChange, items, unit = '', fmtVal = v => v }) => {
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
    <div className="v-picker-wrap">
      <div className="v-picker-fade-top" />
      <div className="v-picker-fade-bot" />
      <div className="v-picker-sel" />
      <div ref={ref} className="v-picker-scroll" onScroll={onScroll}>
        <div style={{ height: PAD }} />
        {items.map((item, i) => (
          <div key={i} className="v-picker-item" style={{
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700,
            fontSize: String(item) === String(value) ? 30 : 22,
            color: String(item) === String(value) ? 'var(--v-ink)' : 'var(--v-dim)',
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

// ─── Toasts — same props as V1 ToastContainer ────────────────────────────────
export const VoltToastContainer = ({ toasts, removeToast }) => (
  <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 10 }}>
    {toasts.map(t => {
      const tone = t.type === 'error'
        ? { bg: 'var(--v-coral)', fg: '#fff', icon: '✕' }
        : t.type === 'info'
          ? { bg: 'var(--v-cobalt)', fg: '#fff', icon: 'ℹ' }
          : { bg: 'var(--v-volt)', fg: '#141416', icon: '✓' };
      return (
        <div key={t.id} className="v-toast" style={{
          background: 'var(--v-panel)', color: 'var(--v-ink)',
          padding: '13px 16px', borderRadius: 14, fontSize: 13, fontWeight: 600,
          border: '2.5px solid var(--v-edge)', boxShadow: '4px 4px 0 var(--v-shadow)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
          minWidth: 240, maxWidth: 380, opacity: t.exiting ? 0 : 1, transition: 'opacity 200ms ease',
        }} onClick={() => removeToast(t.id)}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: tone.bg, color: tone.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{tone.icon}</span>
          <span>{t.message}</span>
        </div>
      );
    })}
  </div>
);

// ─── Theme toggle — same behavior as V1 ThemeTogglePill ─────────────────────
export const VoltThemeToggle = () => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  const w = 118;
  const h = 44;
  const pad = 4;
  const knobSize = h - pad * 2;
  const travel = w - knobSize - pad * 2;

  return (
    <div
      onClick={toggleTheme}
      role="switch"
      aria-checked={!isDark}
      aria-label="Toggle theme"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); } }}
      style={{
        width: w, height: h, borderRadius: h / 2,
        background: 'var(--v-panel)',
        border: '2.5px solid var(--v-edge)',
        position: 'relative', cursor: 'pointer', userSelect: 'none',
        display: 'flex', alignItems: 'center', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: isDark ? 'flex-end' : 'flex-start',
        padding: `0 ${isDark ? 12 : 14}px`, pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--v-ink)', letterSpacing: '0.08em' }}>
          {isDark ? 'NIGHT' : 'DAY'}
        </span>
      </div>
      <div style={{
        position: 'absolute', top: pad, left: pad, width: knobSize, height: knobSize,
        borderRadius: '50%', background: 'var(--v-volt)',
        border: '2px solid var(--v-edge)',
        transform: `translateX(${isDark ? 0 : travel}px)`,
        transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ position: 'relative', width: 20, height: 20 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: isDark ? 0 : 1, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#141416' }}>
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
          <div style={{ position: 'absolute', inset: 0, opacity: isDark ? 1 : 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#141416' }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
