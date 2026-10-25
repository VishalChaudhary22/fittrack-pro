import { Sparkles, Calendar } from 'lucide-react';
import { useCycle } from '../../../core/hooks/useCycle';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Cycle Tracker (V-6b) ──────────────────────────────────────
// Same logic core as V1 (useCycle), Volt presentation. The phase theme
// color stays — it is the phase's own language (from getCyclePhase).

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14.5,
  background: 'var(--v-canvas)', color: 'var(--v-ink)',
  border: '2px solid var(--v-edge-quiet)', outline: 'none', fontFamily: 'inherit',
};
const labelStyle = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
  letterSpacing: '0.14em', color: 'var(--v-dim)', marginBottom: 7, textTransform: 'uppercase',
};

export default function VoltCycleTrackerPage() {
  const {
    currentPhase, cycleLength, handleSave, setCycleLength, setStartDate, startDate,
  } = useCycle();

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <VoltLabel volt>Cycle Syncing — align workouts with your physiology</VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Cycle syncing</h1>
      </header>

      <VoltBlock>
        <VoltLabel volt>Settings</VoltLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, margin: '14px 0 16px' }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={labelStyle}>Last Period Start</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={labelStyle}>Cycle Length (Days)</label>
            <input type="number" value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value) || 28)} style={inputStyle} />
          </div>
        </div>
        <VoltPill onClick={handleSave}>Save Cycle Info</VoltPill>
      </VoltBlock>

      {currentPhase ? (
        <VoltBlock hero style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: currentPhase.theme, filter: 'blur(90px)', opacity: 0.22, pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: currentPhase.theme }}>
              <Calendar size={15} /> Day {currentPhase.currentDay}
            </div>
            <div className="v-num" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', lineHeight: 1.05, marginTop: 10, textTransform: 'uppercase' }}>{currentPhase.phase} Phase</div>
            <p style={{ color: 'var(--v-dim)', fontSize: 14, marginTop: 6 }}>Next period in ~{currentPhase.nextPeriodIn} days</p>
            <div style={{ marginTop: 20, padding: '15px 16px', borderRadius: 14, border: `2px solid ${currentPhase.theme}`, background: 'var(--v-canvas)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: currentPhase.theme, fontWeight: 800, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                <Sparkles size={15} /> Training Advice
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--v-ink)' }}>{currentPhase.advice}</p>
            </div>
          </div>
        </VoltBlock>
      ) : (
        <VoltBlock>
          <p style={{ textAlign: 'center', color: 'var(--v-dim)', fontSize: 14, padding: '18px 0', lineHeight: 1.6 }}>
            Enter your cycle details above to receive synced training advice.
          </p>
        </VoltBlock>
      )}
    </div>
  );
}
