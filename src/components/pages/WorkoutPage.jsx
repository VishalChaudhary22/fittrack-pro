import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Timer, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, Portal } from '../shared/SharedComponents';
import { gId, tod, fmt } from '../../utils/helpers';
import BodyMapSVG from '../shared/BodyMapSVG';
import { calcAllMuscleXP } from '../../data/muscleData';

// ─── REST TIMER ───────────────────────────────────────────────────────────────
const RestTimer = ({ seconds, onDone, onCancel }) => {
  const [left, setLeft] = useState(seconds);
  const intRef = useRef(null);

  useEffect(() => {
    intRef.current = setInterval(() => {
      setLeft(p => {
        if (p <= 1) {
          clearInterval(intRef.current);
          // Beep
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g); g.connect(ctx.destination);
            osc.frequency.value = 880; g.gain.value = 0.3;
            osc.start(); osc.stop(ctx.currentTime + 0.2);
            setTimeout(() => { const o2 = ctx.createOscillator(); const g2 = ctx.createGain(); o2.connect(g2); g2.connect(ctx.destination); o2.frequency.value = 1100; g2.gain.value = 0.3; o2.start(); o2.stop(ctx.currentTime + 0.3); }, 250);
          } catch (e) { /* no audio */ }
          onDone();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [seconds, onDone]);

  const pct = ((seconds - left) / seconds) * 100;
  const mins = Math.floor(left / 60);
  const secs = left % 60;

  return (
    <Portal>
    <div style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'var(--c1)', border: '1px solid var(--o)', borderRadius: 24, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 12px 48px rgba(232,84,13,.25)', minWidth: 260 }}>
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          <svg width={56} height={56} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={28} cy={28} r={24} fill="none" stroke="var(--c3)" strokeWidth={4} />
            <circle cx={28} cy={28} r={24} fill="none" stroke="var(--o)" strokeWidth={4} strokeDasharray={150.8} strokeDashoffset={150.8 * (1 - pct / 100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <Timer size={18} color="var(--o)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>Rest Timer</div>
          <div className="bb" style={{ fontSize: 32, color: 'var(--o)', letterSpacing: '1px' }}>{mins}:{secs.toString().padStart(2, '0')}</div>
        </div>
        <button onClick={onCancel} style={{ background: 'none', border: '1px solid var(--bd)', borderRadius: 10, padding: '8px', cursor: 'pointer', color: 'var(--t3)', marginLeft: 'auto' }}><X size={16} /></button>
      </div>
    </div>
    </Portal>
  );
};

export default function WorkoutPage() {
  const { user, splits, workoutLogs, setWorkoutLogs, addToast } = useApp();
  const nav = useNavigate();
  const activeSplit = splits.find(s => s.id === user.activeSplitId) || splits[0];
  const [session, setSession] = useState(null);
  const [done, setDone] = useState(null);
  const [timer, setTimer] = useState(null); // { active, seconds }
  const [restSeconds, setRestSeconds] = useState(90);
  const wDays = activeSplit?.days.filter(d => d.type !== 'rest') || [];

  const finishBtnRef = useRef(null);
  const [showFAB, setShowFAB] = useState(true);

  useEffect(() => {
    if (!finishBtnRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFAB(!entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(finishBtnRef.current);
    return () => observer.disconnect();
  }, [session]);

  const start = day => {
    const exs = day.exercises.map(ex => {
      const prev = workoutLogs.filter(l => (l.userId === user.id || l.userId === 'vishal') && l.dayId === day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      const pe = prev?.exercises?.find(e => e.name === ex.name);
      return {
        ...ex, sv: ex.variants ? ex.variants[0] : null,
        sets: Array.from({ length: ex.sets || 3 }, () => {
          return { reps: '', weight: '', done: false, targetRep: ex.repsRange || '8-12' };
        }),
      };
    });
    setSession({ day, exs, notes: '' }); setDone(null);
  };

  const upd = (ei, si, f, v) => setSession(p => {
    const e = [...p.exs]; const s = [...e[ei].sets];
    s[si] = { ...s[si], [f]: f === 'done' ? v : v };
    e[ei] = { ...e[ei], sets: s };
    // Auto-start timer when marking set done
    if (f === 'done' && v) setTimer({ active: true });
    return { ...p, exs: e };
  });

  const addS = ei => setSession(p => { const e = [...p.exs]; const ls = e[ei].sets[e[ei].sets.length - 1]; e[ei] = { ...e[ei], sets: [...e[ei].sets, { ...ls, done: false }] }; return { ...p, exs: e }; });
  const rmS = (ei, si) => setSession(p => { const e = [...p.exs]; e[ei] = { ...e[ei], sets: e[ei].sets.filter((_, i) => i !== si) }; return { ...p, exs: e }; });
  const setV = (ei, v) => setSession(p => { const e = [...p.exs]; e[ei] = { ...e[ei], sv: v }; return { ...p, exs: e }; });

  const finish = () => {
    const log = {
      id: gId(), userId: user.id, splitId: activeSplit.id, dayId: session.day.id, dayName: session.day.name, date: tod(), notes: session.notes,
      exercises: session.exs.map(ex => ({ name: ex.sv || ex.name, sets: ex.sets.filter(s => s.done).map(s => ({ reps: parseFloat(s.reps) || 0, weight: parseFloat(s.weight) || 0 })) })).filter(ex => ex.sets.length > 0),
    };
    setWorkoutLogs(p => [...p, log]); setDone(log); setTimer(null);
    addToast('Workout saved!', 'success');
  };

  if (done) {
    // Treat the single session as an array of logs to compute exactly what this session yielded
    const sessionXP = calcAllMuscleXP([done], splits, user);
    const totalXP = Object.values(sessionXP).reduce((a, b) => a + b, 0);
    const totalSets = done.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const totalVol = done.exercises.reduce((acc, ex) => acc + ex.sets.reduce((sAcc, s) => sAcc + s.reps * s.weight, 0), 0);

    const sessionPrimaryMuscles = [...new Set(
      done.exercises.map(doneEx => {
        const exItem = session.exs.find(e => (e.sv || e.name) === doneEx.name);
        return exItem?.primaryMuscle || exItem?.muscle?.toLowerCase();
      }).filter(Boolean)
    )];
    const sessionSecondaryMuscles = [...new Set(
      done.exercises.flatMap(doneEx => {
        const exItem = session.exs.find(e => (e.sv || e.name) === doneEx.name);
        return exItem?.secondaryMuscles || [];
      })
    )].filter(m => !sessionPrimaryMuscles.includes(m));

    return (
      <div className="pg-in" style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Trophy size={42} color="var(--o)" style={{ marginBottom: 10 }} />
          <div className="bb" style={{ fontSize: 28, color: 'var(--o)' }}>WORKOUT COMPLETE!</div>
          <div style={{ color: 'var(--t2)', fontSize: 13, marginTop: 4 }}>Great job crushing your session today.</div>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 16, textAlign: 'center', background: 'var(--c1)', borderRadius: 16, border: `1px solid var(--o2)` }}>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20 }}>
            <div><div className="bb" style={{ fontSize: 24, color: 'var(--o)' }}>+{totalXP.toLocaleString()}</div><div style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700 }}>XP Gained</div></div>
            <div style={{ width: 1, background: 'var(--bd)' }}></div>
            <div><div className="bb" style={{ fontSize: 24, color: 'var(--tx)' }}>{totalSets}</div><div style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700 }}>Sets</div></div>
            <div style={{ width: 1, background: 'var(--bd)' }}></div>
            <div><div className="bb" style={{ fontSize: 24, color: 'var(--tx)' }}>{Math.round(totalVol).toLocaleString()}</div><div style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700 }}>Kg Vol</div></div>
          </div>
          <div style={{ maxWidth: 160, margin: '0 auto' }}>
            <BodyMapSVG muscleXP={sessionXP} primaryMuscles={sessionPrimaryMuscles} secondaryMuscles={sessionSecondaryMuscles} gender={user?.gender} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-p" style={{ flex: 1, padding: '14px', fontSize: 14 }} onClick={() => { setSession(null); setDone(null); }}>Log Another</button>
          <button className="btn-g" style={{ flex: 1, padding: '14px', fontSize: 14 }} onClick={() => nav('/muscle-map')}>View Map →</button>
        </div>
      </div>
    );
  }

  if (session) return (
    <div className="pg-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button className="btn-g" onClick={() => { setSession(null); setTimer(null); }} style={{ fontSize: 13 }}>← Back</button>
        <div style={{ flex: 1 }}>
          <div className="bb" style={{ fontSize: 22 }}>{session.day.name}</div>
          <div style={{ fontSize: 12, color: 'var(--t2)' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase' }}>Rest:</span>
          <Timer size={20} color="var(--t3)" />
          <select value={restSeconds} onChange={e => setRestSeconds(parseInt(e.target.value))} style={{ width: 'auto', fontSize: 13, padding: '4px 8px', background: 'var(--c3)', border: '1px solid var(--bd)', borderRadius: 8, color: 'var(--t2)' }}>
            {[30, 60, 90, 120, 180, 300].map(s => <option key={s} value={s}>{s < 60 ? `${s}s` : `${s / 60}m`}</option>)}
          </select>
        </div>
      </div>
      {session.exs.map((ex, ei) => (
        <div key={ex.id} className="card" style={{ marginBottom: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div className="bb" style={{ fontSize: 16 }}>{ex.sv || ex.name}</div>
              {ex.variants && <select value={ex.sv || ex.variants[0]} onChange={e => setV(ei, e.target.value)} style={{ marginTop: 5, fontSize: 12, padding: '4px 10px', width: 'auto' }}>{ex.variants.map(v => <option key={v} value={v}>{v}</option>)}</select>}
              <div style={{ marginTop: 5, display: 'flex', gap: 5 }}>{ex.muscle && <span className="tag-d" style={{ fontSize: 9 }}>{ex.muscle}</span>}{ex.repsRange && <span style={{ fontSize: 10, color: 'var(--t3)' }}>Target: {ex.repsRange}</span>}</div>
            </div>
            <button className="btn-g" style={{ fontSize: 11, padding: '5px 9px' }} onClick={() => addS(ei)}>+ Set</button>
          </div>
          <div className="ex-r" style={{ marginBottom: 5 }}>{['SET', 'REPS', 'KG', 'DONE'].map(h => <div key={h} style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700 }}>{h}</div>)}</div>
          {ex.sets.map((s, si) => (
            <div key={si} className="ex-r" style={{ marginBottom: 5, opacity: s.done ? .6 : 1 }}>
              <div style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 700 }}>{si + 1}</div>
              <input type="number" placeholder={s.targetRep} value={s.reps} onChange={e => upd(ei, si, 'reps', e.target.value)} style={{ padding: '7px 8px', fontSize: 13 }} />
              <input type="number" step=".5" placeholder="kg" value={s.weight} onChange={e => upd(ei, si, 'weight', e.target.value)} style={{ padding: '7px 8px', fontSize: 13 }} />
              <div style={{ display: 'flex', gap: 3 }}>
                <button onClick={() => upd(ei, si, 'done', !s.done)} style={{
                  flex: 1,
                  height: 32, borderRadius: 6,
                  background: s.done ? 'var(--o)' : 'transparent',
                  border: `2px solid ${s.done ? 'var(--o)' : 'var(--bd2)'}`,
                  color: s.done ? '#fff' : 'var(--t3)',
                  cursor: 'pointer', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s'
                }}>
                  {s.done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : ''}
                </button>
                {ex.sets.length > 1 && (
                  <button onClick={() => rmS(ei, si)} style={{
                    background: 'transparent', border: '1px solid var(--bd)',
                    borderRadius: 8, color: 'var(--t3)', cursor: 'pointer',
                    padding: '7px 5px', fontSize: 10
                  }}>✕</button>
                )}
              </div>
            </div>
          ))}
          {ex.notes && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 5, fontStyle: 'italic' }}>{ex.notes}</div>}
        </div>
      ))}
      <div className="card" style={{ marginBottom: 10, padding: 14 }}><label>Session Notes</label><textarea rows={2} placeholder="PRs, form notes, how it felt..." value={session.notes} onChange={e => setSession(p => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} /></div>
      <button ref={finishBtnRef} className="btn-p" style={{ width: '100%', padding: '14px', fontSize: 16, borderRadius: 12 }} onClick={finish}>Finish Workout</button>

      {timer?.active && <RestTimer seconds={restSeconds} onDone={() => setTimer(null)} onCancel={() => setTimer(null)} />}

      {showFAB && session && (
        <Portal>
          <button
            className="btn-p"
            onClick={finish}
            style={{
              position: 'fixed',
              bottom: window.innerWidth <= 768 ? 80 : 24,
              right: 16,
              zIndex: 9999,
              padding: '12px 20px',
              fontSize: 14,
              borderRadius: 24,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 24px rgba(232,84,13,.5)',
              animation: 'fabIn .3s cubic-bezier(.4,0,.2,1)',
            }}
            aria-label="Finish workout session"
          >
            <Check size={15} /> Finish
          </button>
        </Portal>
      )}
    </div>
  );

  return (
    <div className="pg-in">
      <PageHeader title="Workout Tracker" sub={activeSplit ? activeSplit.name : 'Select a split first'} />
      {!activeSplit ? <EmptyState Icon={Trophy} title="No Split Selected" message="Go to Splits to select a workout program first" /> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(265px,1fr))', gap: 10 }}>
          {wDays.map(day => {
            const last = workoutLogs.filter(l => (l.userId === user.id || l.userId === 'vishal') && l.dayId === day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            return (
              <div key={day.id} className="card" style={{ padding: 16, cursor: 'pointer', transition: 'transform .2s,border-color .2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--o)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--bd)'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="tag-d" style={{ fontSize: 9 }}>{day.type}</span>{last && <span style={{ fontSize: 10, color: 'var(--t3)' }}>Last: {fmt(last.date)}</span>}</div>
                <div className="bb" style={{ fontSize: 16, marginBottom: 8 }}>{day.name}</div>
                {day.exercises.slice(0, 4).map(ex => <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', padding: '3px 0', borderBottom: '1px solid var(--bd)' }}><span>{ex.name}</span><span style={{ color: 'var(--t2)' }}>{ex.sets}×{ex.repsRange}</span></div>)}
                {day.exercises.length > 4 && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4 }}>+{day.exercises.length - 4} more</div>}
                <button className="btn-p" style={{ width: '100%', marginTop: 12, padding: '10px' }} onClick={() => start(day)}>Start Session →</button>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
