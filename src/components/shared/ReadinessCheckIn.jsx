import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calcReadinessScore, getTier } from '../../utils/readinessUtils';
import { tod } from '../../utils/helpers';

export default function ReadinessCheckIn({ objectiveScore, onClose }) {
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

  // Slide-up animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 320);
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

  // ── Question definitions ──────────────────────────────────────
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

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', zIndex: 1000,
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1001,
        background: 'var(--surface-container-low)',
        borderRadius: '24px 24px 0 0',
        padding: '24px 24px 40px',
        maxHeight: '80vh', overflowY: 'auto',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .32s cubic-bezier(.4,0,.2,1)',
      }}>
        {/* Drag handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'var(--surface-container-highest)',
          margin: '0 auto 24px',
        }} />

        {finalScore !== null ? (
          /* ── Score reveal ── */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '5rem', fontWeight: 800, lineHeight: 1,
              color: getTier(finalScore).color,
              marginBottom: 8,
            }}>
              {finalScore}
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.15em', color: 'var(--on-surface-variant)',
              marginBottom: 8,
            }}>
              Readiness Score
            </div>
            <div style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
              {getTier(finalScore).message}
            </div>
          </div>
        ) : (
          /* ── Questions ── */
          <>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: i <= step ? 20 : 8, height: 8, borderRadius: 4,
                  background: i <= step ? 'var(--primary-container)' : 'var(--surface-container-highest)',
                  transition: 'all .3s var(--ease-smooth)',
                }} />
              ))}
            </div>

            {/* Question */}
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '1.1rem',
              color: 'var(--on-surface)', marginBottom: 20, lineHeight: 1.3,
            }}>
              {q.label}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map(opt => (
                <button key={opt.value} onClick={() => answer(q.field, opt.value)}
                  style={{
                    padding: '14px 18px', borderRadius: 14, border: 'none',
                    background: answers[q.field] === opt.value
                      ? 'linear-gradient(135deg, #FFB59B, #F85F1B)'
                      : 'var(--surface-container-highest)',
                    color: answers[q.field] === opt.value ? '#fff' : 'var(--on-surface)',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all .18s var(--ease-smooth)',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Skip */}
            <button onClick={close} style={{
              display: 'block', margin: '20px auto 0',
              background: 'none', border: 'none',
              fontSize: 12, color: 'var(--on-surface-dim)',
              cursor: 'pointer', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Skip today
            </button>
          </>
        )}
      </div>
    </>
  );
}
