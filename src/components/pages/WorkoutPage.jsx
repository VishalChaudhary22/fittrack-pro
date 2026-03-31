import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Timer, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, Portal, PulseIndicator } from '../shared/SharedComponents';
import { gId, tod, fmt } from '../../utils/helpers';
import BodyMapSVG from '../shared/BodyMapSVG';
import { calcAllMuscleXP } from '../../data/muscleData';

// ─── HERO REST TIMER (Inline Session) ─────────────────────────────────────────
const RestTimer = ({ seconds, onDone, onCancel }) => {
  const [left, setLeft] = useState(seconds);
  const intRef = useRef(null);

  useEffect(() => {
    intRef.current = setInterval(() => {
      setLeft(p => {
        if (p <= 1) {
          clearInterval(intRef.current);
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g); g.connect(ctx.destination);
            osc.frequency.value = 880; g.gain.value = 0.3;
            osc.start(); osc.stop(ctx.currentTime + 0.2);
            setTimeout(() => { const o2 = ctx.createOscillator(); const g2 = ctx.createGain(); o2.connect(g2); g2.connect(ctx.destination); o2.frequency.value = 1100; g2.gain.value = 0.3; o2.start(); o2.stop(ctx.currentTime + 0.3); }, 250);
          } catch (error) { /* no audio */ }
          onDone();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [seconds, onDone]);

  useEffect(() => { setLeft(seconds); }, [seconds]);

  const mins = Math.floor(left / 60);
  const secs = left % 60;

  return (
    <section style={{ marginBottom: 40, position: 'relative' }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, background: 'var(--surface-container-low)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '2px solid rgba(248, 95, 27, 0.2)' }}>
        <div style={{ position: 'absolute', top: -48, right: -48, width: 192, height: 192, background: 'rgba(248, 95, 27, 0.05)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
        <h2 className="label-md" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: 16 }}>Rest Timer</h2>
        <div className="headline-lg" style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', lineHeight: 1, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--on-surface)', position: 'relative' }}>
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          <span style={{ position: 'absolute', top: 16, right: -32, fontSize: '2rem', fontWeight: 300, color: 'var(--primary)', letterSpacing: 0 }}>s</span>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 32, zIndex: 1 }}>
          <button onClick={() => setLeft(p => p + 30)} style={{ padding: '8px 24px', borderRadius: 999, background: 'var(--surface-container-highest)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--on-surface)', border: 'none', cursor: 'pointer' }}>+30s</button>
          <button onClick={onCancel} style={{ padding: '8px 32px', borderRadius: 999, background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--on-primary-container)', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(248,95,27,0.2)' }}>Skip</button>
        </div>
      </div>
    </section>
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
  const [, setShowFAB] = useState(true);

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
      return {
        ...ex, sv: ex.variants ? ex.variants[0] : null,
        sets: Array.from({ length: ex.sets || 3 }, () => {
          return { reps: '', weight: '', done: false, targetRep: ex.repsRange || '8-12' };
        }),
      };
    });
    const timestamp = new Date().getTime();
    setSession({ day, exs, notes: '', startTime: timestamp }); setDone(null);
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
    const endTimestamp = new Date().getTime();
    const log = {
      id: gId(), userId: user.id, splitId: activeSplit.id, dayId: session.day.id, dayName: session.day.name, date: tod(), notes: session.notes,
      durationMinutes: session.startTime ? Math.round((endTimestamp - session.startTime) / 60000) : null,
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
          <Trophy size={42} color="var(--primary)" style={{ marginBottom: 10, filter: 'drop-shadow(var(--glow-primary))' }} />
          <div className="headline-lg" style={{ color: 'var(--primary)' }}>WORKOUT COMPLETE!</div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: 13, marginTop: 4 }}>Great job crushing your session today.</div>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 16, textAlign: 'center', background: 'var(--surface-container-low)', borderRadius: 16, border: 'none' }}>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20 }}>
            <div><div className="headline-lg" style={{ color: 'var(--primary)' }}>+{totalXP.toLocaleString()}</div><div style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', fontWeight: 700 }}>XP Gained</div></div>
            <div style={{ width: 1, background: 'var(--surface-container-highest)' }}></div>
            <div><div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{totalSets}</div><div style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Sets</div></div>
            <div style={{ width: 1, background: 'var(--surface-container-highest)' }}></div>
            <div><div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{Math.round(totalVol).toLocaleString()}</div><div style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Kg Vol</div></div>
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
      {/* Top Header Status */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, marginTop: 8 }}>
        <PulseIndicator color="var(--primary-container)" />
        <span className="label-md" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--on-surface-variant)' }}>
          Active Session: {session.day.name}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Timer size={16} color="var(--on-surface-dim)" />
          <select value={restSeconds} onChange={e => setRestSeconds(parseInt(e.target.value))} style={{ width: 'auto', fontSize: 11, padding: '2px 6px', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 6, color: 'var(--on-surface)', letterSpacing: '0.05em' }}>
            {[30, 60, 90, 120, 180, 300].map(s => <option key={s} value={s}>{s < 60 ? `${s}s` : `${s / 60}m`}</option>)}
          </select>
        </div>
      </div>
      
      {/* Rest Timer rendered inline */}
      {timer?.active && <RestTimer seconds={restSeconds} onDone={() => setTimer(null)} onCancel={() => setTimer(null)} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 16 }}>
        {session.exs.map((ex, ei) => {
          const focusType = ex.repsRange === '1-5' ? 'Strength' : (ex.repsRange === '15-20' || ex.repsRange === '12+') ? 'Endurance' : 'Hypertrophy';
          
          return (
            <div key={ex.id} className="exercise-block">
              {/* Exercise Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--on-surface)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {ex.sv || ex.name}
                  </h3>
                  {ex.variants && <select value={ex.sv || ex.variants[0]} onChange={e => setV(ei, e.target.value)} style={{ marginTop: 0, marginBottom: 4, fontSize: 11, padding: '2px 8px', width: 'auto', borderRadius: 6, background: 'var(--surface-container)', border: 'none' }}>{ex.variants.map(v => <option key={v} value={v}>{v}</option>)}</select>}
                  <p className="label-md" style={{ fontSize: 10, color: 'var(--on-surface-variant)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {ex.muscle || 'Full Body'} • {focusType}
                  </p>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </button>
              </div>

              {/* Set Grid Headers */}
              <div className="set-row" style={{ padding: '0 12px', marginBottom: 8 }}>
                {['SET', 'REPS', 'KG', 'DONE'].map((h, i) => (
                  <div key={h} style={{ fontSize: 9, color: 'var(--outline)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: i === 3 ? 'right' : 'left' }}>{h}</div>
                ))}
              </div>

              {/* Set Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ex.sets.map((s, si) => (
                  <div key={si} className="set-row" style={{ 
                    background: 'var(--surface-container-low)', padding: 12, borderRadius: 12, transition: 'all 0.2s', 
                    opacity: s.done ? 0.7 : 1, filter: s.done ? 'grayscale(50%)' : 'none' 
                  }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-container-low)'}>
                    
                    <div style={{ fontSize: 14, color: 'var(--on-surface)', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{si + 1}</div>
                    
                    <div style={{ paddingRight: 8 }}>
                      <input type="number" placeholder={s.targetRep} value={s.reps} onChange={e => upd(ei, si, 'reps', e.target.value)} style={{ width: '100%', background: 'var(--surface-container-lowest)', border: 'none', borderBottom: '2px solid transparent', textAlign: 'center', fontSize: 16, fontWeight: 700, padding: '8px 4px', borderRadius: 8, color: 'var(--on-surface)', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderBottomColor = 'var(--primary-container)'} onBlur={e => e.target.style.borderBottomColor = 'transparent'} />
                    </div>
                    
                    <div style={{ paddingRight: 8 }}>
                      <input type="number" step=".5" placeholder="--" value={s.weight} onChange={e => upd(ei, si, 'weight', e.target.value)} style={{ width: '100%', background: 'var(--surface-container-lowest)', border: 'none', borderBottom: '2px solid transparent', textAlign: 'center', fontSize: 16, fontWeight: 700, padding: '8px 4px', borderRadius: 8, color: 'var(--on-surface)', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderBottomColor = 'var(--primary-container)'} onBlur={e => e.target.style.borderBottomColor = 'transparent'} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button onClick={() => upd(ei, si, 'done', !s.done)} style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: s.done ? 'var(--surface-container-highest)' : 'var(--surface-container-highest)',
                        color: s.done ? 'var(--primary)' : 'var(--on-surface-variant)',
                        border: s.done ? '1px solid var(--primary-container)' : '1px solid transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .2s'
                      }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = s.done ? 'var(--primary)' : 'var(--on-surface-variant)'}>
                        <Check size={18} strokeWidth={s.done ? 3 : 2} />
                      </button>
                      {ex.sets.length > 1 && (
                        <button onClick={() => rmS(ei, si)} style={{ background: 'transparent', border: 'none', borderRadius: 8, color: 'var(--on-surface-dim)', cursor: 'pointer', padding: '6px 4px', fontSize: 10 }} title="Remove set">✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="add-set-btn" onClick={() => addS(ei)}>+ Add Set</button>
              {ex.notes && <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', marginTop: 8, fontStyle: 'italic', paddingLeft: 4 }}>{ex.notes}</div>}
            </div>
          );
        })}
      </div>
      {session.notes !== undefined && (
        <div className="card glass-card" style={{ marginTop: 32, padding: 16 }}>
          <label className="label-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 8, display: 'block' }}>Session Notes</label>
          <textarea rows={2} placeholder="PRs, form notes, how it felt..." value={session.notes} onChange={e => setSession(p => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical', width: '100%', background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12, border: 'none', color: 'var(--on-surface)', fontSize: 13 }} />
        </div>
      )}

      {/* Stacked Finish / Discard */}
      <section ref={finishBtnRef} style={{ paddingTop: 32, paddingBottom: 64 }}>
        <button onClick={finish} style={{ width: '100%', padding: '20px', fontSize: 18, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', color: 'var(--on-primary-container)', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(248,95,27,0.3)', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform='scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>
          Finish Workout
        </button>
        <button onClick={() => { setSession(null); setTimer(null); }} style={{ width: '100%', marginTop: 14, background: 'none', border: 'none', padding: 12, cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--error)', opacity: 0.8, transition: 'opacity .2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.8}>
          Discard Workout
        </button>
      </section>

      {/* Floating Live Indicator */}
      <Portal>
        <div style={{ position: 'fixed', bottom: 88, right: 24, zIndex: 9998, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(248, 95, 27, 0.2)', boxShadow: 'var(--shadow-ambient)' }}>
          <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
            <span style={{ animation: 'pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--primary-container)', opacity: 0.75 }}></span>
            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: 8, width: 8, background: 'var(--primary)' }}></span>
          </span>
          <span className="label-md" style={{ color: 'var(--on-surface)', fontSize: 9 }}>Live tracking</span>
        </div>
      </Portal>
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
              <div key={day.id} className="card stripe" style={{ padding: 16, cursor: 'pointer', transition: 'all .2s var(--ease-smooth)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="tag" style={{ fontSize: 9 }}>{day.type}</span>{last && <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>Last: {fmt(last.date)}</span>}</div>
                <div className="headline-md" style={{ color: 'var(--on-surface)', marginBottom: 8 }}>{day.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {day.exercises.slice(0, 4).map(ex => <div key={ex.id} className="tonal-break" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--on-surface-variant)', padding: '6px 8px', background: 'var(--surface-container-lowest)', borderRadius: 8 }}><span>{ex.name}</span><span style={{ color: 'var(--on-surface-dim)' }}>{ex.sets}×{ex.repsRange}</span></div>)}
                </div>
                {day.exercises.length > 4 && <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginTop: 8 }}>+{day.exercises.length - 4} more</div>}
                <button className="btn-p" style={{ width: '100%', marginTop: 12, padding: '10px' }} onClick={() => start(day)}>Start Session →</button>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
