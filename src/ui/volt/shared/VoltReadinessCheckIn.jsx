import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../core/context/AppContext';
import { calcReadinessScore, getTier } from '../../../utils/readinessUtils';
import { tod } from '../../../utils/helpers';
import { VoltLabel } from '../primitives';

// Volt twin of V1's ReadinessCheckIn — identical questions, scoring and
// logReadiness payload. Presentation: Volt bottom sheet on the drawer curve,
// with drag-to-dismiss on the handle (plan V-7: "drawer curve + drag").
export default function VoltReadinessCheckIn({ objectiveScore, onClose }) {
  const { user, logReadiness } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    sleepHours: null,
    energyLevel: null,
    sorenessLevel: null,
    stressLevel: null,
  });
  const [visible, setVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  // Drag-to-dismiss state
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 320);
  };

  const onDragStart = (e) => {
    drag.current = { y: e.clientY, dy: 0 };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onDragMove = (e) => {
    if (!drag.current) return;
    const dy = Math.max(0, e.clientY - drag.current.y);
    drag.current.dy = dy;
    setDragY(dy);
  };
  const onDragEnd = () => {
    if (!drag.current) return;
    const dy = drag.current.dy;
    drag.current = null;
    setDragging(false);
    if (dy > 110) { setDragY(0); close(); }
    else setDragY(0);
  };

  const answer = (field, value) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);

    if (step < 3) {
      setTimeout(() => setStep(s => s + 1), 220);
    } else {
      // Final step — compute and save
      const score = calcReadinessScore(updated, objectiveScore);
      setFinalScore(score);
      const today = tod();
      logReadiness({
        userId: user.id,
        date: today,
        ...updated,
        score,
        objectiveScore,
        checkInComplete: true,
      });
      setTimeout(close, 2200); // show score for 2.2s then close
    }
  };

  // ── Question definitions (identical to V1) ─────────────────────
  const questions = [
    {
      field: 'sleepHours',
      label: 'How much did you sleep last night?',
      options: [
        { label: '< 5h', value: 4.5 },
        { label: '5–6h', value: 5.5 },
        { label: '6–7h', value: 6.5 },
        { label: '7–8h', value: 7.5 },
        { label: '8–9h', value: 8.5 },
        { label: '9h+',  value: 9.5 },
      ],
    },
    {
      field: 'energyLevel',
      label: "How's your energy right now?",
      options: [
        { label: '😴 Drained', value: 1 },
        { label: '😪 Low',     value: 2 },
        { label: '😐 Okay',    value: 3 },
        { label: '💪 Good',    value: 4 },
        { label: '⚡ Peak',    value: 5 },
      ],
    },
    {
      field: 'sorenessLevel',
      label: 'Any muscle soreness today?',
      options: [
        { label: 'None — feeling fresh',          value: 'none' },
        { label: 'Mild — slight stiffness',       value: 'mild' },
        { label: 'Significant — clearly sore',   value: 'significant' },
      ],
    },
    {
      field: 'stressLevel',
      label: 'Mental stress level today?',
      options: [
        { label: '😌 Chill',    value: 'low' },
        { label: '😤 Some',     value: 'medium' },
        { label: '🥵 Stressed', value: 'high' },
      ],
    },
  ];

  const q = questions[step];
  const sheetY = !visible ? '100%' : `${dragY}px`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000 }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1001,
        background: 'var(--v-panel)', color: 'var(--v-ink)',
        borderTop: '2.5px solid var(--v-edge)',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -6px 0 var(--v-shadow)',
        padding: '12px 22px calc(38px + env(safe-area-inset-bottom, 0px))',
        maxWidth: 480, margin: '0 auto',
        maxHeight: '82vh', overflowY: 'auto',
        transform: `translateY(${sheetY})`,
        transition: dragging ? 'none' : 'transform .34s cubic-bezier(0.32, 0.72, 0, 1)',
        touchAction: 'pan-y',
      }}>
        {/* Drag handle — drag down to dismiss */}
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          style={{ padding: '4px 0 18px', cursor: 'grab', touchAction: 'none' }}
          aria-hidden="true"
        >
          <div style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--v-edge)', opacity: .45, margin: '0 auto' }} />
        </div>

        {finalScore !== null ? (
          /* ── Score reveal ── */
          <div style={{ textAlign: 'center', padding: '18px 0 8px' }}>
            <div className="v-num" style={{
              fontSize: '5rem', lineHeight: 1,
              color: getTier(finalScore).color,
              marginBottom: 10,
            }}>
              {finalScore}
            </div>
            <VoltLabel>Readiness Score</VoltLabel>
            <div style={{ fontSize: 14, color: 'var(--v-dim)', marginTop: 10 }}>
              {getTier(finalScore).message}
            </div>
          </div>
        ) : (
          /* ── Questions ── */
          <>
            {/* Progress segments */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 26 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  border: '1.5px solid var(--v-edge)',
                  background: i <= step ? 'var(--v-volt)' : 'transparent',
                  transition: 'background .3s ease',
                }} />
              ))}
            </div>

            <VoltLabel volt>Check-in · {step + 1} of 4</VoltLabel>
            {/* Question */}
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.01em', margin: '8px 0 20px', lineHeight: 1.3 }}>
              {q.label}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map(opt => {
                const selected = answers[q.field] === opt.value;
                return (
                  <button key={String(opt.value)} onClick={() => answer(q.field, opt.value)}
                    className="v-press"
                    style={{
                      padding: '15px 18px', borderRadius: 14,
                      border: '2.5px solid var(--v-edge)',
                      background: selected ? 'var(--v-volt)' : 'var(--v-canvas)',
                      color: selected ? '#141416' : 'var(--v-ink)',
                      fontSize: 14.5, fontWeight: 700, cursor: 'pointer',
                      textAlign: 'left', minHeight: 52,
                      transition: 'background .18s ease, color .18s ease',
                    }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Skip */}
            <button onClick={close} style={{
              display: 'block', margin: '22px auto 0',
              background: 'none', border: 'none',
              fontSize: 12, color: 'var(--v-dim)',
              cursor: 'pointer', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em', minHeight: 44,
            }}>
              Skip today
            </button>
          </>
        )}
      </div>
    </>
  );
}
