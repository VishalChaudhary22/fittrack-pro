import { useCycle } from '../../../core/hooks/useCycle';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel, SegBar } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Cycle Tracker — pixel calendar (plan §7.5, Q-7) ──────────
// Same brain as V1/Volt (useCycle + getCyclePhase), Quest presentation:
// settings in slot inputs, the phase as a hero card, and the current cycle
// as a pixel calendar grid — one tile per day, coloured by phase using the
// same day boundaries getCyclePhase documents (5 / 13 / 14 scaled by
// cycleLength/28). Phase hues are Quest tokens, mapped per phase.

const PHASE_TONES = {
  Menstruation: { fill: 'var(--q-ember)', text: 'var(--q-ember-text)' },
  Follicular: { fill: 'var(--q-sky)', text: 'var(--q-sky)' },
  Ovulation: { fill: 'var(--q-volt)', text: 'var(--q-volt-text)' },
  Luteal: { fill: 'var(--q-violet)', text: 'var(--q-violet)' },
};

function phaseOfDay(day, cycleLength) {
  const ratio = cycleLength / 28;
  const menstrualEnd = Math.round(5 * ratio);
  const follicularEnd = Math.round(13 * ratio);
  const ovulationDay = Math.round(14 * ratio);
  if (day <= menstrualEnd) return 'Menstruation';
  if (day <= follicularEnd) return 'Follicular';
  if (day === ovulationDay || day === ovulationDay + 1) return 'Ovulation';
  return 'Luteal';
}

export default function CycleTrackerPage() {
  const {
    currentPhase, cycleLength, handleSave, setCycleLength, setStartDate, startDate,
  } = useCycle();

  const days = currentPhase ? Array.from({ length: cycleLength || 28 }, (_, i) => i + 1) : [];

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <QuestLabel tone="volt">Cycle Syncing — Align Workouts With Your Physiology</QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 'clamp(19px, 6vw, 30px)', lineHeight: 1.35, margin: '10px 0 0' }}>CYCLE SYNCING</h1>
      </header>

      <QuestBlock>
        <QuestLabel tone="volt">Settings</QuestLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, margin: '13px 0 15px' }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <QuestLabel>Last Period Start</QuestLabel>
            <input className="q-slot-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ marginTop: 6 }} aria-label="Last period start" />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <QuestLabel>Cycle Length (Days)</QuestLabel>
            <input className="q-slot-input" type="number" value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value) || 28)} style={{ marginTop: 6 }} aria-label="Cycle length in days" />
          </div>
        </div>
        <QuestBtn onClick={handleSave}>SAVE CYCLE INFO</QuestBtn>
      </QuestBlock>

      {currentPhase ? (<>
        <QuestBlock style={{ borderColor: PHASE_TONES[currentPhase.phase]?.fill }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PixelSprite name="moon" size={16} />
            <QuestLabel style={{ color: PHASE_TONES[currentPhase.phase]?.text }}>Day {currentPhase.currentDay}</QuestLabel>
          </div>
          <div className="q-ps" style={{ fontSize: 'clamp(17px, 6vw, 26px)', lineHeight: 1.4, marginTop: 10 }}>
            {currentPhase.phase.toUpperCase()} PHASE
          </div>
          <p style={{ color: 'var(--q-dim)', fontSize: 19, marginTop: 7 }}>Next period in ~{currentPhase.nextPeriodIn} days</p>
          <SegBar value={currentPhase.currentDay / (cycleLength || 28)} segments={14} style={{ marginTop: 14 }} label="Cycle progress" />
          <div style={{ marginTop: 16, padding: '13px 14px', border: `3px solid ${PHASE_TONES[currentPhase.phase]?.fill}`, background: 'var(--q-slot)' }}>
            <QuestLabel style={{ color: PHASE_TONES[currentPhase.phase]?.text }}>Training Advice</QuestLabel>
            <p style={{ fontSize: 19, lineHeight: 1.55, marginTop: 7 }}>{currentPhase.advice}</p>
          </div>
        </QuestBlock>

        <QuestBlock>
          <QuestLabel tone="volt">Cycle Map — {cycleLength} Days</QuestLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 13 }}>
            {days.map(d => {
              const ph = phaseOfDay(d, cycleLength || 28);
              const isToday = d === currentPhase.currentDay;
              return (
                <div
                  key={d}
                  title={`Day ${d} — ${ph}`}
                  style={{
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: PHASE_TONES[ph].fill, color: 'var(--q-btn-fg)',
                    border: isToday ? '3px solid var(--q-ink)' : '3px solid var(--q-border)',
                    boxShadow: isToday ? '0 0 0 2px var(--q-volt)' : 'none',
                    fontSize: 16, fontWeight: 700,
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 13 }}>
            {Object.entries(PHASE_TONES).map(([name, t]) => (
              <QuestChip key={name}>
                <span style={{ display: 'inline-block', width: 9, height: 9, background: t.fill, marginRight: 6, border: '2px solid var(--q-border)' }} />
                {name}
              </QuestChip>
            ))}
            <QuestChip tone="volt">▣ TODAY</QuestChip>
          </div>
        </QuestBlock>
      </>) : (
        <QuestBlock>
          <p style={{ textAlign: 'center', color: 'var(--q-dim)', fontSize: 19, padding: '18px 0', lineHeight: 1.55 }}>
            Enter your cycle details above to receive synced training advice.
          </p>
        </QuestBlock>
      )}
    </div>
  );
}
