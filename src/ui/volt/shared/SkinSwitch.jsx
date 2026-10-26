import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useApp } from '../../../core/context/AppContext';
import { useDesignVersion } from '../../../core/context/DesignVersionContext';
import { markWelcomeSeen, useComparePill } from '../../../core/hooks/useDiscovery';
import { ModalPortal } from '../../v1/shared/SharedComponents';
import { VoltPill, VoltLabel } from '../primitives';
import { VoltSheet } from './VoltShared';

// ─── Skin discovery UI (V-8, plan §3) ─────────────────────────────────────────
// The welcome sheet, quick-switch sheet and compare pill introduce the
// two-look wardrobe. They can appear while either skin is active, so the
// Volt tokens are scoped inline (VoltScope) — volt.css defines the tokens
// only under [data-design='volt'], while the .v-* classes are global.

const VOLT_VARS = {
  dark: {
    '--v-canvas': '#0a0a09', '--v-panel': '#131311', '--v-ink': '#f4f5e9', '--v-dim': '#b9bfa8',
    '--v-volt': '#c9f158', '--v-volt-text': '#c9f158', '--v-cobalt': '#7d9bff',
    '--v-coral': '#ff5c38', '--v-coral-text': '#ff7a5c', '--v-success': '#7fe0a8', '--v-success-text': '#7fe0a8',
    '--v-edge': '#f4f5e9', '--v-edge-quiet': 'rgba(244, 245, 233, 0.55)',
    '--v-shadow': '#000000', '--v-shadow-hero': 'rgba(201, 241, 88, 0.9)', '--v-chamber': '#04060a',
    '--v-pill-bg': '#c9f158', '--v-pill-fg': '#141416',
  },
  light: {
    '--v-canvas': '#f7f4ed', '--v-panel': '#ffffff', '--v-ink': '#141416', '--v-dim': '#6e6a5e',
    '--v-volt': '#c9f158', '--v-volt-text': '#4c6b00', '--v-cobalt': '#2e4bff',
    '--v-coral': '#ff5c38', '--v-coral-text': '#c93a1c', '--v-success': '#1e9e57', '--v-success-text': '#147a41',
    '--v-edge': '#141416', '--v-edge-quiet': '#141416',
    '--v-shadow': '#141416', '--v-shadow-hero': '#141416', '--v-chamber': '#0b0e12',
    '--v-pill-bg': '#141416', '--v-pill-fg': '#c9f158',
  },
};

export function VoltScope({ children, style }) {
  const { theme } = useApp();
  const vars = theme === 'light' ? VOLT_VARS.light : VOLT_VARS.dark;
  return <div style={{ ...vars, color: 'var(--v-ink)', ...style }}>{children}</div>;
}

// ─── Mini Today previews (real user data where available) ────────────────────
export function SkinPreviewVolt({ firstName, streakDays, weightKg, selected }) {
  return (
    <div style={{
      background: 'var(--v-canvas)', border: `2.5px solid ${selected ? 'var(--v-volt-text)' : 'var(--v-edge)'}`,
      borderRadius: 16, padding: '12px 12px 13px', textAlign: 'left',
      boxShadow: selected ? '4px 4px 0 var(--v-shadow-hero)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--v-volt-text)' }}>TODAY</span>
        {selected && <span style={{ width: 17, height: 17, borderRadius: '50%', background: 'var(--v-volt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={11} color="#141416" strokeWidth={3.5} /></span>}
      </div>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 14.5, letterSpacing: '-0.01em', margin: '7px 0 9px', color: 'var(--v-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {firstName ? `Hey, ${firstName}` : 'Your Today'}
      </div>
      <div style={{ background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderRadius: 11, padding: '8px 10px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: '0.1em', color: 'var(--v-dim)' }}>READINESS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 19, color: 'var(--v-ink)', lineHeight: 1 }}>86</span>
          <span style={{ flex: 1, height: 6, borderRadius: 3, border: '1.5px solid var(--v-edge)', overflow: 'hidden', display: 'block' }}>
            <span style={{ display: 'block', height: '100%', width: '86%', background: 'var(--v-volt)' }} />
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {streakDays > 0 && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, background: 'var(--v-volt)', color: '#141416', borderRadius: 6, padding: '3px 6px' }}>{streakDays} DAY STREAK</span>}
        {weightKg > 0 && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, border: '1.5px solid var(--v-edge)', color: 'var(--v-ink)', borderRadius: 6, padding: '3px 6px' }}>{weightKg} KG</span>}
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 800, color: 'var(--v-ink)' }}>Kaaya Volt</div>
      <div style={{ fontSize: 11, color: 'var(--v-dim)' }}>The new look — blackboard &amp; volt</div>
    </div>
  );
}

export function SkinPreviewOriginal({ firstName, streakDays, weightKg, selected }) {
  return (
    <div style={{
      background: 'linear-gradient(160deg, #1B1B1E, #101012)', border: `2.5px solid ${selected ? '#F85F1B' : 'rgba(255,255,255,0.14)'}`,
      borderRadius: 16, padding: '12px 12px 13px', textAlign: 'left', color: '#F5F5F4',
      boxShadow: selected ? '4px 4px 0 rgba(248,95,27,0.55)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#FFB59B' }}>TODAY</span>
        {selected && <span style={{ width: 17, height: 17, borderRadius: '50%', background: '#F85F1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={11} color="#fff" strokeWidth={3.5} /></span>}
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em', margin: '7px 0 9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {firstName ? `Hey, ${firstName}` : 'Your Today'}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 11, padding: '8px 10px' }}>
        <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 8.5, letterSpacing: '0.1em', color: 'rgba(245,245,244,0.55)', fontWeight: 700 }}>READINESS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, lineHeight: 1 }}>86</span>
          <span style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', display: 'block' }}>
            <span style={{ display: 'block', height: '100%', width: '86%', background: 'linear-gradient(90deg, #F85F1B, #FFB59B)' }} />
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {streakDays > 0 && <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 8.5, fontWeight: 700, background: 'rgba(248,95,27,0.2)', color: '#FFB59B', borderRadius: 6, padding: '3px 6px' }}>{streakDays} DAY STREAK</span>}
        {weightKg > 0 && <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 8.5, fontWeight: 700, border: '1px solid rgba(255,255,255,0.16)', color: '#F5F5F4', borderRadius: 6, padding: '3px 6px' }}>{weightKg} KG</span>}
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 800 }}>Original Kaaya</div>
      <div style={{ fontSize: 11, color: 'rgba(245,245,244,0.55)' }}>The classic look — ember &amp; glass</div>
    </div>
  );
}

// ─── One-time welcome sheet ───────────────────────────────────────────────────
export function SkinWelcomeSheet({ onClose }) {
  const { user } = useApp();
  const { version, setVersion } = useDesignVersion();
  const [pick, setPick] = useState('volt');
  const firstName = user?.name?.split(' ')[0] || '';

  const done = (choice) => {
    if (choice) setVersion(choice);
    markWelcomeSeen();
    onClose();
  };

  return (
    <ModalPortal>
      <VoltScope>
        <VoltSheet onClose={() => done(null)}>
          <VoltLabel volt>New · Two Looks</VoltLabel>
          <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em', margin: '7px 0 6px' }}>Kaaya, your way</div>
          <p style={{ fontSize: 13.5, color: 'var(--v-dim)', lineHeight: 1.55, margin: '0 0 18px' }}>
            Kaaya Fit now has two looks. Same features, same data — only the style changes. Pick one to start; switch anytime in <strong style={{ color: 'var(--v-ink)' }}>Profile → Appearance</strong>, or long-press the bottom bar.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => setPick('volt')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-pressed={pick === 'volt'}>
              <SkinPreviewVolt firstName={firstName} selected={pick === 'volt'} />
            </button>
            <button onClick={() => setPick('v1')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-pressed={pick === 'v1'}>
              <SkinPreviewOriginal firstName={firstName} selected={pick === 'v1'} />
            </button>
          </div>

          <VoltPill style={{ width: '100%', marginTop: 18 }} onClick={() => done(pick)}>
            Start with {pick === 'volt' ? 'Volt' : 'Original'}
          </VoltPill>
          {version !== pick && (
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <button onClick={() => done(null)} style={{ background: 'none', border: 'none', color: 'var(--v-dim)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 10 }}>
                Keep my current look
              </button>
            </div>
          )}
        </VoltSheet>
      </VoltScope>
    </ModalPortal>
  );
}

// ─── Quick-switch sheet (long-press) ──────────────────────────────────────────
export function SkinQuickSwitch({ onClose }) {
  const { version, setVersion } = useDesignVersion();

  const row = (key, title, desc) => {
    const active = version === key;
    return (
      <button
        onClick={() => { setVersion(key); onClose(); }}
        className="v-press"
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
          padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
          border: `2.5px solid ${active ? 'var(--v-volt-text)' : 'var(--v-edge-quiet)'}`,
          background: 'var(--v-canvas)', color: 'var(--v-ink)', minHeight: 62,
        }}
        aria-pressed={active}
      >
        <span style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: key === 'volt' ? 'var(--v-volt)' : 'linear-gradient(135deg, #F85F1B, #FFB59B)',
          border: '2px solid var(--v-edge)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, color: key === 'volt' ? '#141416' : '#fff',
        }}>{key === 'volt' ? 'V' : 'O'}</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: 14.5, fontWeight: 800 }}>{title}</span>
          <span style={{ display: 'block', fontSize: 12, color: 'var(--v-dim)', marginTop: 1 }}>{desc}</span>
        </span>
        {active && <Check size={18} color="var(--v-volt-text)" strokeWidth={3} />}
      </button>
    );
  };

  return (
    <ModalPortal>
      <VoltScope>
        <VoltSheet onClose={onClose}>
          <VoltLabel volt>Quick Switch</VoltLabel>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em', margin: '7px 0 16px' }}>Switch look</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {row('volt', 'Kaaya Volt', 'The new look — blackboard & volt')}
            {row('v1', 'Original Kaaya', 'The classic look — ember & glass')}
          </div>
          <p style={{ fontSize: 12, color: 'var(--v-dim)', lineHeight: 1.5, margin: '14px 0 0' }}>
            Same features, same data — the switch is instant and you can flip back anytime.
          </p>
        </VoltSheet>
      </VoltScope>
    </ModalPortal>
  );
}

// ─── Compare pill (sessions 2 + 4, Today only) ────────────────────────────────
export function SkinComparePill() {
  const { visible, finish } = useComparePill();
  const { isVolt, setVersion } = useDesignVersion();

  if (!visible) return null;

  const other = isVolt ? 'v1' : 'volt';
  const otherName = isVolt ? 'Original' : 'Volt';

  const flip = () => {
    setVersion(other);
    finish();
  };

  if (isVolt) {
    return (
      <VoltScope style={{ position: 'fixed', left: 16, bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))', zIndex: 150 }}>
        <div className="v-pop" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 999, boxShadow: '4px 4px 0 var(--v-shadow)', padding: '5px 5px 5px 14px' }}>
          <button onClick={flip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--v-ink)', fontSize: 12.5, fontWeight: 800, padding: '6px 2px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F85F1B' }} />
            Try the {otherName} look
          </button>
          <button onClick={finish} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--v-dim)', padding: 7, display: 'flex' }}>
            <X size={13} />
          </button>
        </div>
      </VoltScope>
    );
  }

  return (
    <div style={{ position: 'fixed', left: 16, bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))', zIndex: 150 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(20,20,22,0.92)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 999, boxShadow: '0 10px 30px rgba(0,0,0,0.35)', padding: '5px 5px 5px 14px' }}>
        <button onClick={flip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F5F5F4', fontSize: 12.5, fontWeight: 700, fontFamily: "'Be Vietnam Pro', sans-serif", padding: '6px 2px', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9F158' }} />
          Try the {otherName} look
        </button>
        <button onClick={finish} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,244,0.6)', padding: 7, display: 'flex' }}>
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
