import { useEffect, useRef, useState } from 'react';
import { QuestBlock, QuestChip, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';
import { FighterSprite, useFighter } from '../fighters';
import { questSound } from '../sound';
import { MUSCLE_LABELS } from '../../../utils/readinessUtils';

// ─── The readiness card — Quest's signature scene (plan §6.1) ────────────────
// Plays once per mount (~1.3s), tap anywhere skips to the end state:
//   boot    panel snaps in + a scanline sweep crosses the card
//   charge  12 segments light one by one in the red→ember→gold→volt ramp
//           while the score counts up in quantized steps (no smooth tween)
//   settle  the heart starts its 2-frame beat (grey + slow below 40;
//           a 4-star burst at 85+), the verdict types in with a block
//           cursor, and your fighter takes the stance the score earns.
// prefers-reduced-motion collapses the whole sequence to the final frame.
// Later score changes (logging a weight etc.) do NOT replay — they step
// straight to the new fill.

const SEGMENTS = 12;
const TICKS = 14;

const VERDICTS = {
  Optimal: 'BATTLE READY',
  Good: 'STEADY',
  Moderate: 'EASE IN',
  Low: 'RECHARGE NEEDED',
};

const STATUS_TONES = { optimal: 'volt', fatigued: 'gold', critical: 'ember' };

function rampVar(i) {
  const f = (i + 1) / SEGMENTS;
  if (f <= 0.25) return 'var(--q-red)';
  if (f <= 0.5) return 'var(--q-ember)';
  if (f <= 0.75) return 'var(--q-gold)';
  return 'var(--q-seg-volt)';
}

export default function ReadinessCard({ score, tier, hasCompletedReadiness, spotlightMuscles = [] }) {
  const { fighter } = useFighter();
  const value = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const verdict = VERDICTS[tier?.label] ?? 'STEADY';
  const targetLit = Math.round((value / 100) * SEGMENTS);

  const [lit, setLit] = useState(0);
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(0);
  const [settled, setSettled] = useState(false);
  const timersRef = useRef([]);
  const doneRef = useRef(false);

  const finish = () => {
    timersRef.current.forEach((t) => { clearInterval(t); clearTimeout(t); });
    timersRef.current = [];
    doneRef.current = true;
    setLit(targetLit);
    setShown(value);
    setTyped(verdict.length);
    setSettled(true);
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  // The boot sequence — mount only.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      finishRef.current();
      return undefined;
    }
    let tick = 0;
    let typeTimer = null;
    const chargeTimer = setTimeout(() => {
      const iv = setInterval(() => {
        tick += 1;
        setLit(Math.round(targetLit * (tick / TICKS)));
        setShown(Math.round(value * (tick / TICKS)));
        if (tick >= TICKS) {
          clearInterval(iv);
          doneRef.current = true;
          setSettled(true);
          questSound('xp');
          let c = 0;
          typeTimer = setInterval(() => {
            c += 1;
            setTyped(c);
            if (c >= verdict.length) clearInterval(typeTimer);
          }, 18);
          timersRef.current.push(typeTimer);
        }
      }, 55);
      timersRef.current.push(iv);
    }, 150);
    timersRef.current.push(chargeTimer);
    const stash = timersRef.current;
    return () => stash.forEach((t) => { clearInterval(t); clearTimeout(t); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Post-settle updates step straight to the new values (no replay).
  useEffect(() => {
    if (!doneRef.current) return;
    setLit(targetLit);
    setShown(value);
    setTyped(verdict.length);
  }, [value, verdict, targetLit]);

  const fighterState = value >= 85 ? 'flex' : value >= 55 ? 'idle' : 'sleepy';
  const lowHeart = value < 40;

  return (
    <QuestBlock
      className="q-boot"
      onClick={() => { if (!doneRef.current) finish(); }}
      style={{ overflow: 'hidden', cursor: settled ? 'default' : 'pointer' }}
      aria-label={`Overall readiness ${value} percent — ${verdict}`}
    >
      {!settled && <div className="q-sweep" />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <QuestLabel tone="volt">Overall Readiness</QuestLabel>
        <span className="q-meta" style={{ fontSize: 15 }}>
          {hasCompletedReadiness ? 'CHECK-IN LOGGED' : 'OBJECTIVE SCORE'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="q-ps" style={{ fontSize: 42, lineHeight: 1 }}>{shown}</span>
            <span className="q-ps" style={{ fontSize: 16, color: 'var(--q-volt-text)' }}>%</span>
          </div>

          <div className="q-segbar" style={{ marginTop: 12 }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Readiness charge">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <div key={i} className="q-seg" style={i < lit ? { background: rampVar(i) } : undefined} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, minHeight: 26 }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              {lowHeart ? (
                <PixelSprite name="heartMono" size={22} style={{ color: 'var(--q-dim)' }} className={settled ? 'q-heart q-heart--slow' : undefined} />
              ) : (
                <PixelSprite name="heart" size={22} className={settled ? 'q-heart' : undefined} />
              )}
              {settled && value >= 85 && [0, 1, 2, 3].map((i) => (
                <PixelSprite
                  key={i}
                  name="star"
                  size={11}
                  className="q-burst-star"
                  style={{
                    position: 'absolute',
                    left: [-10, 16, -4, 10][i],
                    top: [-8, -10, 12, 14][i],
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              ))}
            </span>
            <span className="q-ps" style={{ fontSize: 13 }}>
              {verdict.slice(0, typed)}
              <span
                className="q-blink"
                aria-hidden="true"
                style={{ display: 'inline-block', width: 9, height: 13, background: 'var(--q-ink)', marginLeft: 3, verticalAlign: '-2px' }}
              />
            </span>
          </div>

          {tier?.message && (
            <div className="q-meta" style={{ marginTop: 4 }}>{tier.message}</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 2 }}>
          <div style={{ position: 'relative' }} className={settled && fighterState !== 'sleepy' ? 'q-bob' : undefined}>
            <FighterSprite
              fighter={fighter}
              state={settled || doneRef.current ? fighterState : 'idle'}
              size={86}
            />
            {fighterState === 'sleepy' && settled && (
              <span className="q-rise-z" style={{ position: 'absolute', right: -8, top: -6 }}>
                <PixelSprite name="zzz" size={16} />
              </span>
            )}
          </div>
          <span className="q-meta" style={{ fontSize: 14, textTransform: 'uppercase' }}>{fighter}</span>
        </div>
      </div>

      <div style={{ borderTop: '3px solid var(--q-border)', marginTop: 14, paddingTop: 12 }}>
        {spotlightMuscles.length === 0 ? (
          <div className="q-meta">CLEAR A QUEST TO LIGHT UP YOUR MUSCLE MAP</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {spotlightMuscles.map((m) => (
              <QuestChip key={m.key} tone={STATUS_TONES[m.status]}>
                {(MUSCLE_LABELS[m.key] || m.key)} · {m.label}
              </QuestChip>
            ))}
          </div>
        )}
      </div>
    </QuestBlock>
  );
}
