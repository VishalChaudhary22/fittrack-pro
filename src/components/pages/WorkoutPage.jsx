import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Timer, X, Check, Play, Pause, Square, RefreshCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, Portal, PulseIndicator } from '../shared/SharedComponents';
import { gId, tod, fmt } from '../../utils/helpers';
import BodyMapSVG from '../shared/BodyMapSVG';
import { calcAllMuscleXP } from '../../data/muscleData';

// ─── YOGA / BREATHWORK (Inline Session) ────────────────────────────────────────
const YOGA_PRESETS = [
  { id: 'surya', name: 'Surya Namaskar', poses: ['Pranamasana', 'Hastauttanasana', 'Hasta Padasana', 'Ashwa Sanchalanasana', 'Dandasana', 'Ashtanga Namaskara', 'Bhujangasana', 'Adho Mukha Svanasana', 'Ashwa Sanchalanasana', 'Hasta Padasana', 'Hastauttanasana', 'Pranamasana'], durationPerPose: 15 },
  { id: 'wind_down', name: 'Evening Wind-Down', poses: ['Balasana (Child Pose)', 'Marjaryasana (Cat Pose)', 'Bitilasana (Cow Pose)', 'Viparita Karani (Legs-up-the-wall)', 'Savasana'], durationPerPose: 45 },
  { id: 'pre_workout', name: 'Pre-Workout Activation', poses: ['Downward Dog', 'High Lunge', 'Plank', 'Cobra', 'Child Pose'], durationPerPose: 30 }
];

const parseDuration = (repsRange, sets = 1) => {
  if (!repsRange) return 30 * sets;
  const lower = repsRange.toLowerCase();
  const numMatch = lower.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : 1;
  if (lower.includes('minute')) return num * 60 * sets;
  if (lower.includes('breath')) return num * 6 * sets;
  if (lower.includes('round'))  return 60 * sets;
  return 30 * sets;
};

const formatPoseName = (name) => {
  const match = name.match(/^(.+?)\s*\((.+?)\)$/);
  if (match) return { sanskrit: match[1].trim(), english: match[2].trim() };
  return { sanskrit: null, english: name };
};

const playBeep = (freq = 880, dur = 0.2) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.frequency.value = freq; g.gain.value = 0.3;
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch(e) {}
};

const YogaSessionView = ({ day, onBack, onComplete }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [poseIndex, setPoseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle');
  const [breathTimer, setBreathTimer] = useState(0);
  const yogaTimerRef = useRef(null);
  const breathTimerRef = useRef(null);
  const completedNaturallyRef = useRef(false);

  // Build dynamic "Today's Flow" from the day's actual exercises
  const dayFlowPreset = useMemo(() => {
    if (!day?.exercises?.length) return null;
    const poses = day.exercises.map(ex => ex.name);
    const durations = day.exercises.map(ex => parseDuration(ex.repsRange, ex.sets));
    return {
      id: 'day_flow',
      name: "Today's Yoga Flow",
      poses,
      durations,
      durationPerPose: 0,
    };
  }, [day]);

  // Get per-pose duration (supports both durations[] and flat durationPerPose)
  const getDuration = (session, index) => {
    if (session?.durations?.[index]) return session.durations[index];
    return session?.durationPerPose || 30;
  };

  const startSession = (preset) => {
    completedNaturallyRef.current = false;
    setBreathPhase('idle'); // stop breathing if running
    setActiveSession(preset);
    setPoseIndex(0);
    setTimeLeft(getDuration(preset, 0));
    setIsPlaying(true);
    playBeep(1100, 0.4);
  };

  const nextPose = () => {
    if (!activeSession) return;
    setPoseIndex(prev => {
      const next = prev + 1;
      if (next < activeSession.poses.length) {
        const dur = getDuration(activeSession, next);
        setTimeLeft(dur);
        playBeep(880, 0.2);
        return next;
      } else {
        // Completed all poses naturally
        completedNaturallyRef.current = true;
        endSession();
        return prev;
      }
    });
  };

  const endSession = () => {
    setIsPlaying(false);
    const wasComplete = completedNaturallyRef.current;
    const completedSession = activeSession;
    setActiveSession(null);
    playBeep(1100, 0.5);
    playBeep(1300, 0.5);
    if (wasComplete && onComplete && completedSession) {
      onComplete(completedSession);
    }
    completedNaturallyRef.current = false;
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      yogaTimerRef.current = setTimeout(() => setTimeLeft(p => p - 1), 1000);
      if (timeLeft === 3 || timeLeft === 2) playBeep(600, 0.1);
      if (timeLeft === 1) playBeep(800, 0.2);
    } else if (isPlaying && timeLeft === 0) {
      nextPose();
    }
    return () => clearTimeout(yogaTimerRef.current);
  }, [isPlaying, timeLeft, activeSession, poseIndex]);

  const startBreathing = () => {
    setBreathPhase('inhale'); setBreathTimer(4); playBeep(440, 0.3);
  };

  useEffect(() => {
    if (breathPhase !== 'idle' && breathTimer > 0) {
      breathTimerRef.current = setTimeout(() => setBreathTimer(p => p - 1), 1000);
    } else if (breathPhase !== 'idle' && breathTimer === 0) {
      const nextP = breathPhase === 'inhale' ? 'hold_in' : breathPhase === 'hold_in' ? 'exhale' : breathPhase === 'exhale' ? 'hold_out' : 'inhale';
      setBreathPhase(nextP); setBreathTimer(4); playBeep(nextP.includes('hold') ? 500 : 700, 0.2);
    }
    return () => clearTimeout(breathTimerRef.current);
  }, [breathPhase, breathTimer]);

  const currentPoseDuration = activeSession ? getDuration(activeSession, poseIndex) : 1;
  const totalFlowDuration = dayFlowPreset ? dayFlowPreset.durations.reduce((a, b) => a + b, 0) : 0;
  const { sanskrit: currentSanskrit, english: currentEnglish } = activeSession
    ? formatPoseName(activeSession.poses[poseIndex])
    : { sanskrit: null, english: '' };

  return (
    <div className="pg-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 className="headline-md" style={{ color: 'var(--on-surface)' }}>{day.name}</h2>
        <button onClick={onBack} style={{ padding: '8px 16px', borderRadius: 999, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface-variant)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>← Back to Days</button>
      </div>

      {activeSession ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', borderRadius: 24 }}>
          <div className="label-md" style={{ color: 'var(--primary)', marginBottom: 16 }}>{activeSession.name}</div>
          {currentSanskrit && (
            <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 4, letterSpacing: '0.05em' }}>{currentSanskrit}</div>
          )}
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'var(--on-surface)', marginBottom: 8 }}>{currentEnglish}</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>Pose {poseIndex + 1} of {activeSession.poses.length}</p>
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 40px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--surface-container)" strokeWidth="8" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="565.48" strokeDashoffset={565.48 * (1 - Math.max(0, timeLeft) / currentPoseDuration)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--on-surface)' }}>{timeLeft}</div>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={() => { completedNaturallyRef.current = false; endSession(); }} style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Square />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {/* Today's Yoga Flow — primary card from day.exercises */}
          {dayFlowPreset && (
            <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)', borderLeft: '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="headline-md" style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>🧘 Today's Yoga Flow</h3>
                <span style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>{dayFlowPreset.poses.length} poses • {(totalFlowDuration / 60).toFixed(1)} min</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {day.exercises.slice(0, 5).map((ex, i) => {
                  const dur = dayFlowPreset.durations[i];
                  const mins = Math.floor(dur / 60);
                  const secs = dur % 60;
                  const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
                  return (
                    <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--surface-container)', borderRadius: 10, fontSize: 13 }}>
                      <span style={{ color: 'var(--on-surface)' }}>{ex.name}{ex.sets > 1 ? ` × ${ex.sets}` : ''}</span>
                      <span style={{ color: 'var(--on-surface-variant)', fontVariantNumeric: 'tabular-nums' }}>{timeStr}</span>
                    </div>
                  );
                })}
                {day.exercises.length > 5 && (
                  <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', paddingLeft: 12 }}>+{day.exercises.length - 5} more</div>
                )}
              </div>
              <button onClick={() => startSession(dayFlowPreset)} className="btn-p" style={{ width: '100%', padding: '14px', fontSize: 14, borderRadius: 14 }}>
                Start Flow →
              </button>
            </div>
          )}

          {/* Quick Sessions + Box Breathing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)' }}>
              <h3 className="headline-md" style={{ marginBottom: 16, fontSize: 18 }}>Quick Sessions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {YOGA_PRESETS.map(p => (
                  <button key={p.id} onClick={() => startSession(p)} style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, color: 'var(--on-surface)', cursor: 'pointer' }} className="active:scale-95">
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                    <span style={{ color: 'var(--on-surface-variant)' }}>{(p.poses.length * p.durationPerPose / 60).toFixed(1)} min</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
               <h3 className="headline-md" style={{ marginBottom: 8, fontSize: 18 }}>Box Breathing</h3>
               <p style={{ color: 'var(--on-surface-variant)', fontSize: 13, marginBottom: 24 }}>4s Inhale, 4s Hold, 4s Exhale, 4s Hold</p>
               {breathPhase !== 'idle' ? (
                 <div style={{ width: 150, height: 150, borderRadius: '50%', border: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: breathPhase === 'inhale' ? 'rgba(255, 181, 155, 0.2)' : 'transparent', transition: 'all 2s ease' }}>
                    <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--primary)', fontWeight: 700 }}>{breathPhase.replace('_', ' ')}</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--on-surface)' }}>{breathTimer}</div>
                    <button onClick={() => setBreathPhase('idle')} style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer' }}><Square size={16} /></button>
                 </div>
               ) : (
                 <button onClick={startBreathing} style={{ padding: '16px 32px', borderRadius: 24, background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', color: 'var(--on-primary-container)', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RefreshCcw size={18} /> Start Session
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [showFAB, setShowFAB] = useState(true);

  const startTimeRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  // Recover startTime from sessionStorage on mount (survives Ctrl+R)
  useEffect(() => {
    const saved = sessionStorage.getItem('fittrack_session_start');
    if (saved && session) startTimeRef.current = parseInt(saved, 10);
  }, [session]);

  // Ticking interval — runs only when a non-yoga session is active
  useEffect(() => {
    if (!session || session.isYoga || done) return;
    if (!startTimeRef.current) {
      startTimeRef.current = session.startTime || Date.now();
    }
    const tick = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [session, done]);

  const fmtElapsed = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

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
    if (day.type === 'yoga') {
      setSession({ day, isYoga: true });
      setDone(null);
      return;
    }
    const exs = day.exercises.map(ex => {
      const prev = workoutLogs.filter(l => l.userId === user.id && l.dayId === day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      return {
        ...ex, sv: ex.variants ? ex.variants[0] : null,
        sets: Array.from({ length: ex.sets || 3 }, () => {
          return { reps: '', weight: '', done: false, targetRep: ex.repsRange || '8-12' };
        }),
      };
    });
    });
    const timestamp = Date.now();
    sessionStorage.setItem('fittrack_session_start', String(timestamp));
    startTimeRef.current = timestamp;
    setSession({ day, exs, notes: '', startTime: timestamp });
    setDone(null);
  };

  const upd = (ei, si, f, v) => setSession(p => {
    const e = [...p.exs]; const s = [...e[ei].sets];
    s[si] = { ...s[si], [f]: f === 'done' ? v : v };
    e[ei] = { ...e[ei], sets: s };
    // Auto-start timer when marking set done
    if (f === 'done' && v) setTimer({ active: true, ei, si });
    return { ...p, exs: e };
  });

  const addS = ei => setSession(p => { const e = [...p.exs]; const ls = e[ei].sets[e[ei].sets.length - 1]; e[ei] = { ...e[ei], sets: [...e[ei].sets, { ...ls, done: false }] }; return { ...p, exs: e }; });
  const rmS = (ei, si) => setSession(p => { const e = [...p.exs]; e[ei] = { ...e[ei], sets: e[ei].sets.filter((_, i) => i !== si) }; return { ...p, exs: e }; });
  const setV = (ei, v) => setSession(p => { const e = [...p.exs]; e[ei] = { ...e[ei], sv: v }; return { ...p, exs: e }; });

  const finish = () => {
    sessionStorage.removeItem('fittrack_session_start');
    startTimeRef.current = null;
    setElapsed(0);
    const endTimestamp = new Date().getTime();
    const log = {
      id: gId(), userId: user.id, splitId: activeSplit.id, dayId: session.day.id, dayName: session.day.name, date: tod(), notes: session.notes,
      durationMinutes: session.startTime ? Math.round((endTimestamp - session.startTime) / 60000) : null,
      exercises: session.exs.map(ex => ({
        name: ex.sv || ex.name,
        muscle: ex.muscle || null,
        primaryMuscle: ex.primaryMuscle || null,
        secondaryMuscles: ex.secondaryMuscles || [],
        sets: ex.sets.filter(s => s.done).map(s => ({ reps: parseFloat(s.reps) || 0, weight: parseFloat(s.weight) || 0 }))
      })).filter(ex => ex.sets.length > 0),
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
          <div style={{ maxWidth: 240, margin: '0 auto' }}>
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

  if (session) {
    if (session.isYoga) {
      const handleYogaComplete = (completedPreset) => {
        const log = {
          id: gId(), userId: user.id, splitId: activeSplit.id,
          dayId: session.day.id, dayName: session.day.name,
          date: tod(), notes: '',
          durationMinutes: Math.round(
            (completedPreset.durations
              ? completedPreset.durations.reduce((a, b) => a + b, 0)
              : completedPreset.poses.length * completedPreset.durationPerPose) / 60
          ),
          exercises: session.day.exercises.map(ex => ({
            name: ex.name,
            muscle: ex.muscle || null,
            primaryMuscle: ex.primaryMuscle || null,
            secondaryMuscles: ex.secondaryMuscles || [],
            sets: [{ reps: ex.sets || 1, weight: 0 }],
          })),
        };
        setWorkoutLogs(p => [...p, log]);
        addToast('Yoga session logged! 🧘', 'success');
      };
      return <YogaSessionView day={session.day} onBack={() => { setSession(null); setDone(null); }} onComplete={handleYogaComplete} />;
    }
    const pct = Math.round((session.exs.flatMap(e => e.sets).filter(s => s.done).length / session.exs.flatMap(e => e.sets).length) * 100) || 0;
    return (
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
      
      {/* Rest Timer (moved inline to sets) */}
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
                  <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {timer?.active && timer.ei === ei && timer.si === si && (
                      <RestTimer seconds={restSeconds} onDone={() => setTimer(null)} onCancel={() => setTimer(null)} />
                    )}
                    <div className="set-row" style={{ 
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
        <button onClick={() => {
          sessionStorage.removeItem('fittrack_session_start');
          startTimeRef.current = null;
          setElapsed(0);
          setSession(null); setTimer(null);
        }} style={{ width: '100%', marginTop: 14, background: 'none', border: 'none', padding: 12, cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--error)', opacity: 0.8, transition: 'opacity .2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.8}>
          Discard Workout
        </button>
      </section>

      {/* Floating Indicators */}
      <Portal>
        <div style={{ position: 'fixed', bottom: 88, right: 24, zIndex: 9998, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {showFAB && (
            <button 
              onClick={finish}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(248, 95, 27, 0.2)', boxShadow: 'var(--shadow-ambient)', cursor: 'pointer', width: 130 }}>
              <div style={{ display: 'flex', width: 8, height: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={10} color="var(--primary)" strokeWidth={3} />
              </div>
              <span className="label-md" style={{ color: 'var(--on-surface)', fontSize: 9, whiteSpace: 'nowrap' }}>Finish Workout</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(248, 95, 27, 0.2)', boxShadow: 'var(--shadow-ambient)', width: 130 }}>
            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8, flexShrink: 0 }}>
              <span style={{ animation: 'pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--primary-container)', opacity: 0.75 }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: 8, width: 8, background: 'var(--primary)' }}></span>
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', lineHeight: 1 }}>Live</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em', color: 'var(--primary)', lineHeight: 1 }}>{fmtElapsed(elapsed)}</span>
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
  }


  return (
    <div className="pg-in">
      <PageHeader title="Workout Tracker" sub={activeSplit ? activeSplit.name : 'Select a split first'} />
      {!activeSplit ? <EmptyState Icon={Trophy} title="No Split Selected" message="Go to Splits to select a workout program first" /> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(265px,1fr))', gap: 10 }}>
          {wDays.map(day => {
            const last = workoutLogs.filter(l => l.userId === user.id && l.dayId === day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
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
