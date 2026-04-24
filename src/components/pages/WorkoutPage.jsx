import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Timer, X, Check, Play, Pause, Square, ArrowRightLeft, Clock } from 'lucide-react';
import { getLastLiftedForExercise, getLastSessionSets, getAllTimePR, beatsAllTimePR } from '../../utils/exerciseHistory';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState, Portal, PulseIndicator, ConfirmDialog } from '../shared/SharedComponents';
import { gId, tod, fmt, formatTimeAgo } from '../../utils/helpers';
import BodyMapSVG from '../shared/BodyMapSVG';
import { calcAllMuscleXP } from '../../data/muscleData';
import { syncUserXPToCache } from '../../utils/xpCacheSync';
import { useScrollRestoration, clearScrollPosition } from '../../hooks/useScrollRestoration';

// ─── AUDIO & PERSISTENCE HELPERS ────────────────────────────────────────────────
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playRestCompleteChime() {
  try {
    const ctx = getAudioCtx();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch (e) {
    // silently fail
  }
}

function vibrateRestComplete() {
  if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
}

const ACTIVE_SESSION_KEY = 'fittrack_activeWorkoutSession';
const REST_TIMER_KEY = 'fittrack_activeRestTimer';
const REST_TIMER_POS_KEY = 'fittrack_activeRestTimerPos';
const SESSION_STALE_MS = 8 * 60 * 60 * 1000;
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function persistActiveSession(session) {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
      ...session,
      lastUpdated: Date.now(),
    }));
  } catch (e) {}
}

function clearPersistedSession() {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

function loadPersistedSession(currentUserId) {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.userId && parsed.userId !== currentUserId) return null;
    if (Date.now() - parsed.lastUpdated > SESSION_MAX_AGE_MS) {
      clearPersistedSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// Migration cleanup - run once on script load
sessionStorage.removeItem('fittrack_active_workout');
sessionStorage.removeItem('fittrack_session_start');

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
            <button onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause session" : "Play session"} style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={() => { completedNaturallyRef.current = false; endSession(); }} aria-label="Stop session" style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

// ─── COMPACT RING REST TIMER ──────────────────────────────────────────────────
const RestTimer = ({ secondsLeft, totalDuration, onSkip, onExtend }) => {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const RING_SIZE = window.innerWidth < 360 ? 180 : 220;
  const STROKE_W = 8;
  const RADIUS = (RING_SIZE - STROKE_W) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const total = totalDuration || 90;
  const maxTotal = Math.max(total, secondsLeft);
  const progress = maxTotal > 0 ? secondsLeft / maxTotal : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isLowTime = secondsLeft <= 10;

  return (
    <section style={{ marginBottom: 40, position: 'relative' }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, background: 'var(--surface-container-low)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '2px solid rgba(248, 95, 27, 0.2)' }}>
        <div style={{ position: 'absolute', top: -48, right: -48, width: 192, height: 192, background: 'rgba(248, 95, 27, 0.05)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
        <h2 className="label-md" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: 24 }}>Rest Timer</h2>

        {/* CENTER — SVG Ring Timer with Number */}
        <div style={{ position: 'relative', flexShrink: 0, marginBottom: 32 }}>
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            style={{
              transform: 'rotate(-90deg)',
              display: 'block',
              animation: isLowTime ? 'restTimerPulse 1s var(--ease-smooth) infinite' : 'none',
            }}
          >
            {/* Track ring — static grey background */}
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--surface-container-highest)"
              strokeWidth={STROKE_W}
            />
            {/* Progress ring — drains clockwise */}
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={isLowTime ? 'var(--primary)' : 'var(--primary-container)'}
              strokeWidth={STROKE_W}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>

          {/* Number + label centered over the SVG ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: isLowTime ? 'var(--primary)' : 'var(--on-surface)',
              transition: 'color 0.3s',
            }}>
              {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
              <span style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--primary)', letterSpacing: 0 }}>s</span>
            </span>
          </div>
        </div>

        {/* BOTTOM — +30s and Skip stacked horizontally */}
        <div style={{
          display: 'flex',
          gap: 16,
          zIndex: 1,
        }}>

          {/* +30s ghost pill */}
          <button
            onClick={() => onExtend(30)}
            style={{
              padding: '8px 24px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: 'var(--surface-container-highest)',
              color: 'var(--on-surface)',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'transform 0.1s var(--ease-smooth)',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.94)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            +30s
          </button>

          {/* Skip ember pill */}
          <button
            onClick={onSkip}
            style={{
              padding: '8px 32px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              color: '#fff',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              boxShadow: '0 10px 20px rgba(248,95,27,0.2)',
              transition: 'transform 0.1s var(--ease-smooth)',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.94)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Skip
          </button>
        </div>

      </div>
    </section>
  );
};

const EXERCISE_ALTERNATIVES = {
  // ═══════════════════════════════════════════════════════════════════════
  // CHEST — Horizontal Push (Compound)
  // ═══════════════════════════════════════════════════════════════════════
  'Smith Machine Incline Press':           ['Incline Barbell Bench Press', 'Incline Dumbbell Press', 'Low-to-High Cable Fly'],
  'Incline Smith Machine Press':           ['Incline Barbell Bench Press', 'Incline Dumbbell Press', 'Low-to-High Cable Fly'],
  'Flat Dumbbell Press':                   ['Flat Barbell Bench Press', 'Machine Chest Press', 'Dumbbell Floor Press'],
  'Flat Barbell Bench Press':              ['Flat Dumbbell Press', 'Machine Chest Press', 'Weighted Dips'],
  'Incline Dumbbell Press':                ['Smith Machine Incline Press', 'Incline Barbell Bench Press', 'Incline Machine Press'],
  'Incline Barbell Bench Press':           ['Incline Dumbbell Press', 'Smith Machine Incline Press', 'Low-to-High Cable Fly'],
  'Chest Machine Press':                   ['Flat Barbell Bench Press', 'Flat Dumbbell Press', 'Weighted Dips'],
  'Barbell Bench Press':                   ['Flat Dumbbell Press', 'Machine Chest Press', 'Weighted Dips'],
  // CHEST — Isolation
  'Cable Fly':                             ['Pec Deck Fly', 'Dumbbell Fly', 'Low-to-High Cable Fly'],
  'Pec Deck Fly':                          ['Cable Fly', 'Dumbbell Fly', 'Svend Press'],
  'Dumbbell Fly':                          ['Cable Fly', 'Pec Deck Fly', 'Low-to-High Cable Fly'],

  // ═══════════════════════════════════════════════════════════════════════
  // BACK — Vertical Pull
  // ═══════════════════════════════════════════════════════════════════════
  'Wide Grip Lat Pulldowns':               ['Close Grip Lat Pulldowns', 'Pull-ups', 'Straight-Arm Lat Pulldown'],
  'Close Grip Lat Pulldowns':              ['Wide Grip Lat Pulldowns', 'Chin-ups', 'Neutral Grip Lat Pulldown'],
  'Lat Pulldown':                          ['Pull-ups', 'Close Grip Lat Pulldowns', 'Wide Grip Lat Pulldowns'],
  'Pull-ups':                              ['Wide Grip Lat Pulldowns', 'Chin-ups', 'Assisted Pull-ups'],
  'Chin-ups':                              ['Close Grip Lat Pulldowns', 'Pull-ups', 'Neutral Grip Lat Pulldown'],
  'Chin-Up':                               ['Close Grip Lat Pulldowns', 'Pull-ups', 'Neutral Grip Lat Pulldown'],
  // BACK — Horizontal Pull (Compound)
  'Seated Horizontal Row':                 ['Seated Cable Row (Bar)', 'Dumbbell Row', 'Barbell Row'],
  'Seated Cable Row (Bar)':                ['Seated Horizontal Row', 'T-Bar Rows', 'Chest-Supported Row'],
  'Seated Cable Row':                      ['Seated Horizontal Row', 'T-Bar Rows', 'Chest-Supported Row'],
  'T-Bar Rows':                            ['Seated Cable Row (Bar)', 'Barbell Row', 'Chest-Supported Row'],
  'Barbell Row':                           ['T-Bar Rows', 'Dumbbell Row', 'Chest-Supported Row'],
  'Bent-Over Barbell Row':                 ['T-Bar Rows', 'Dumbbell Row', 'Chest-Supported Row'],
  'Chest-Supported Row':                   ['T-Bar Rows', 'Seated Cable Row (Bar)', 'Barbell Row'],
  'Dumbbell Row':                          ['Barbell Row', 'Seated Cable Row (Bar)', 'T-Bar Rows'],
  'One-Arm Dumbbell Row':                  ['Dumbbell Row', 'Chest-Supported Row', 'Seated Cable Row (Bar)'],
  'Horizontal Machine Row':                ['Seated Cable Row (Bar)', 'Dumbbell Row', 'T-Bar Rows'],
  'Wide Grip T-Bar Rows':                  ['T-Bar Rows', 'Barbell Row', 'Dumbbell Row'],
  // BACK — Compound (Deadlift patterns)
  'Deadlift':                              ['Conventional Deadlift', 'Trap Bar Deadlift', 'Block Pull'],
  'Conventional Deadlift':                 ['Trap Bar Deadlift', 'Block Pull', 'Sumo Deadlift'],
  // BACK — Isolation
  'Straight-Arm Lat Pulldown':             ['Dumbbell Pullover', 'Wide Grip Lat Pulldowns'],

  // ═══════════════════════════════════════════════════════════════════════
  // SHOULDERS — Compound (Overhead Press)
  // ═══════════════════════════════════════════════════════════════════════
  'Overhead Press':                        ['Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Arnold Press'],
  'Dumbbell Shoulder Press':               ['Overhead Press', 'Machine Shoulder Press', 'Arnold Press'],
  'Shoulder Press':                        ['Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Arnold Press'],
  'Machine Shoulder Press':                ['Dumbbell Shoulder Press', 'Overhead Press', 'Arnold Press'],
  'Standing Barbell Overhead Press':       ['Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Push Press'],
  // SHOULDERS — Isolation (Lateral)
  'Lateral Raises':                        ['Cable Lateral Raise', 'Machine Lateral Raise', 'Seated Dumbbell Lateral Raise'],
  'Cable Lateral Raise':                   ['Lateral Raises', 'Machine Lateral Raise', 'Seated Dumbbell Lateral Raise'],
  'Seated Dumbbell Lateral Raise':         ['Lateral Raises', 'Cable Lateral Raise', 'Machine Lateral Raise'],
  // SHOULDERS — Isolation (Rear delts)
  'Rear Delt Flyes':                       ['Face Pulls', 'Cable Reverse Fly', 'Band Pull-Apart'],
  'Face Pull':                             ['Rear Delt Flyes', 'Cable Reverse Fly', 'Band Pull-Apart'],
  'Face Pulls':                            ['Rear Delt Flyes', 'Cable Reverse Fly', 'Band Pull-Apart'],

  // ═══════════════════════════════════════════════════════════════════════
  // BICEPS — Isolation
  // ═══════════════════════════════════════════════════════════════════════
  'Biceps Cable Curls':                    ['Dumbbell Curls', 'EZ Bar Curls', 'Concentration Curls'],
  'Bicep Curls':                           ['Dumbbell Curls', 'EZ Bar Curls', 'Cable Curls'],
  'Barbell Curl':                          ['EZ Bar Curls', 'Dumbbell Curls', 'Cable Curls'],
  'Dumbbell Curls':                        ['Biceps Cable Curls', 'EZ Bar Curls', 'Barbell Curl'],
  'EZ Bar Curls':                          ['Barbell Curl', 'Dumbbell Curls', 'Cable Curls'],
  'EZ-Bar Curl':                           ['Barbell Curl', 'Dumbbell Curls', 'Cable Curls'],
  'Hammer Curls':                          ['Rope Hammer Curls', 'Cross-Body Hammer Curl', 'Reverse Curls'],
  'Hammer Curl':                           ['Rope Hammer Curls', 'Cross-Body Hammer Curl', 'Reverse Curls'],
  'Incline Bench Bicep Curls':             ['Concentration Curls', 'Spider Curls', 'Preacher Curls'],
  'Preacher Curls':                        ['Spider Curls', 'Concentration Curls', 'Machine Preacher Curl'],
  'Concentration Curls':                   ['Preacher Curls', 'Spider Curls', 'Incline Bench Bicep Curls'],
  'Alternating Dumbbell Curl':             ['Dumbbell Curls', 'Cable Curls', 'EZ Bar Curls'],

  // ═══════════════════════════════════════════════════════════════════════
  // TRICEPS — Isolation
  // ═══════════════════════════════════════════════════════════════════════
  'Single Hand Tricep Pushdowns':          ['Tricep Rope Pushdowns', 'Straight Bar Pushdowns', 'V-Bar Pushdowns'],
  'Tricep Pushdowns':                      ['Tricep Rope Pushdowns', 'V-Bar Pushdowns', 'Straight Bar Pushdowns'],
  'Cable Triceps Pushdown':                ['Tricep Rope Pushdowns', 'V-Bar Pushdowns', 'Straight Bar Pushdowns'],
  'Single Hand Rope Pushdowns':            ['Tricep Rope Pushdowns', 'Straight Bar Pushdowns', 'V-Bar Pushdowns'],
  'Single Hand Overhead Tricep Extension': ['Overhead Tricep Extension (Cable)', 'Overhead Tricep Extension (Dumbbell)', 'Skull Crushers'],
  'Single Hand Overhead Tricep Extensions':['Overhead Tricep Extension (Cable)', 'Overhead Tricep Extension (Dumbbell)', 'Skull Crushers'],
  'Single Hand Overhead Cable Tricep Extension': ['Overhead Tricep Extension (Dumbbell)', 'Single Hand Overhead Tricep Extension', 'Skull Crushers'],
  'Overhead Tricep Extension':             ['Skull Crushers', 'Tricep Rope Pushdowns', 'Single Hand Overhead Tricep Extension'],
  'Skull Crushers':                        ['Overhead Tricep Extension', 'Close-Grip Bench Press', 'Tricep Dips'],
  'Tricep Dips (Chair)':                   ['Bench Dips', 'Diamond Push-ups', 'Tricep Rope Pushdowns'],

  // ═══════════════════════════════════════════════════════════════════════
  // QUADS — Compound (Squat pattern)
  // ═══════════════════════════════════════════════════════════════════════
  'Squats':                                ['Smith Machine Squats', 'Leg Press', 'Hack Squats', 'Goblet Squats'],
  'Barbell Back Squat':                    ['Smith Machine Squats', 'Leg Press', 'Hack Squats', 'Front Squats'],
  'Front Squat':                           ['Barbell Back Squat', 'Goblet Squats', 'Hack Squats'],
  'Front Squats':                          ['Barbell Back Squat', 'Goblet Squats', 'Hack Squats'],
  'Hack Squat':                            ['Leg Press', 'Smith Machine Squats', 'Barbell Back Squat'],
  'Hack Squats':                           ['Leg Press', 'Smith Machine Squats', 'Front Squats'],
  'Leg Press':                             ['Squats', 'Hack Squats', 'Pendulum Squats', 'Smith Machine Squats'],
  'Pendulum Squats':                       ['Hack Squats', 'Leg Press', 'Smith Machine Squats'],
  'Goblet Squats':                         ['Front Squats', 'Bodyweight Squats', 'Leg Press'],
  'Bodyweight Squats':                     ['Goblet Squats', 'Jump Squats', 'Leg Press'],
  'Smith Machine Squats':                  ['Squats', 'Hack Squats', 'Leg Press'],
  // QUADS — Unilateral
  'Walking Lunges':                        ['Bulgarian Split Squats', 'Step-Ups', 'Reverse Lunges'],
  'Walking Dumbbell Lunge':                ['Bulgarian Split Squats', 'Step-Ups', 'Reverse Lunges'],
  'Bulgarian Split Squats':                ['Walking Lunges', 'Step-Ups', 'Reverse Lunges'],
  'Bulgarian Split Squat':                 ['Walking Lunges', 'Step-Ups', 'Reverse Lunges'],
  'Jump Squats':                           ['Bodyweight Squats', 'Box Jumps', 'Leg Press'],
  // QUADS — Isolation
  'Leg Extension':                         ['Sissy Squats', 'Wall Sits', 'Leg Press (narrow foot)'],

  // ═══════════════════════════════════════════════════════════════════════
  // HAMSTRINGS — Compound (Hinge pattern)
  // ═══════════════════════════════════════════════════════════════════════
  'Romanian Deadlift':                     ['Stiff-Leg Deadlift', 'Good Mornings', 'Seated Leg Curls'],
  'Stiff-Leg Deadlift':                    ['Romanian Deadlift', 'Good Mornings', 'Lying Leg Curls'],
  // HAMSTRINGS — Isolation
  'Leg Curls':                             ['Seated Leg Curls', 'Lying Leg Curls', 'Nordic Hamstring Curls'],
  'Leg Curl':                              ['Seated Leg Curls', 'Lying Leg Curls', 'Nordic Hamstring Curls'],
  'Seated Leg Curls':                      ['Lying Leg Curls', 'Leg Curls', 'Nordic Hamstring Curls'],
  'Lying Leg Curls':                       ['Seated Leg Curls', 'Leg Curls', 'Nordic Hamstring Curls'],

  // ═══════════════════════════════════════════════════════════════════════
  // GLUTES
  // ═══════════════════════════════════════════════════════════════════════
  'Barbell Hip Thrust':                    ['Glute Bridge', 'Cable Pull-Through', 'Single-Leg Hip Thrust'],
  'Glute Bridges':                         ['Barbell Hip Thrust', 'Cable Pull-Through', 'Single-Leg Glute Bridges'],
  'Single-Leg Glute Bridges':              ['Glute Bridges', 'Barbell Hip Thrust', 'Cable Pull-Through'],
  'Leg Abductor Machine':                  ['Banded Clamshells', 'Cable Hip Abduction', 'Side-Lying Leg Raise'],
  'Leg Adductor Machine':                  ['Copenhagen Plank', 'Sumo Squats', 'Cable Hip Adduction'],

  // ═══════════════════════════════════════════════════════════════════════
  // CALVES
  // ═══════════════════════════════════════════════════════════════════════
  'Standing Calf Raises':                  ['Seated Calf Raises', 'Smith Machine Calf Raise', 'Leg Press Calf Raise'],
  'Standing Calf Raise':                   ['Seated Calf Raise', 'Smith Machine Calf Raise', 'Leg Press Calf Raise'],
  'Seated Calf Raises':                    ['Standing Calf Raises', 'Donkey Calf Raise', 'Leg Press Calf Raise'],
  'Seated Calf Raise':                     ['Standing Calf Raise', 'Donkey Calf Raise', 'Leg Press Calf Raise'],

  // ═══════════════════════════════════════════════════════════════════════
  // ABS / CORE
  // ═══════════════════════════════════════════════════════════════════════
  'Plank':                                 ['Dead Bug', 'Hollow Body Hold', 'Ab Wheel Rollout'],
  'Hollow Body Hold':                      ['Plank', 'Dead Bug', 'Hanging Leg Raise'],
  'Mountain Climbers':                     ['Bicycle Crunches', 'V-Ups', 'High Knees'],
  'Burpees':                               ['Mountain Climbers', 'Jump Squats', 'Thrusters'],

  // ═══════════════════════════════════════════════════════════════════════
  // BODYWEIGHT / HOME
  // ═══════════════════════════════════════════════════════════════════════
  'Push-ups':                              ['Diamond Push-ups', 'Decline Push-ups', 'Wide Push-ups'],
  'Diamond Push-ups':                      ['Close-Grip Push-ups', 'Tricep Dips (Chair)', 'Pike Push-ups'],
  'Decline Push-ups':                      ['Push-ups', 'Pike Push-ups', 'Incline Push-ups'],
  'Pike Push-ups':                         ['Handstand Push-ups', 'Decline Push-ups', 'Overhead Press'],
  'Australian Pull-ups':                   ['Inverted Rows', 'Seated Cable Row (Bar)', 'Resistance Band Rows'],
};

function ExerciseSwapModal({ exerciseName, onSwap, onClose }) {
  const alternatives = EXERCISE_ALTERNATIVES[exerciseName] || [];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'var(--glass-bg-heavy, rgba(0,0,0,0.7))',
        backdropFilter: 'var(--glass-blur-sm, blur(8px))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          width: '100%', maxWidth: '400px',
          background: 'var(--surface-container-low)',
          borderRadius: '24px',
          padding: '24px',
          maxHeight: '80vh', overflowY: 'auto',
          animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: 'var(--shadow-ambient)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.15em',
          color: 'var(--on-surface-dim)', marginBottom: 6,
        }}>
          Swap Exercise
        </div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 16, fontWeight: 700,
          color: 'var(--primary)', marginBottom: 20,
          letterSpacing: '-0.02em',
        }}>
          {exerciseName}
        </div>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px 16px', minHeight: 44,
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'var(--surface-container-highest)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: 14, fontWeight: 600,
            color: 'var(--on-surface)', marginBottom: 10,
            transition: 'transform 0.1s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>Keep current</span>
          <span style={{
            fontSize: 9, color: 'var(--on-surface-dim)',
            textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700,
          }}>Current</span>
        </button>
        {alternatives.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '20px 16px',
            fontSize: 13, color: 'var(--on-surface-dim)',
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>
            No swap options available for this exercise
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alternatives.map(alt => (
              <button
                key={alt}
                onClick={() => { onSwap(alt); onClose(); }}
                style={{
                  width: '100%', padding: '14px 16px', minHeight: 44,
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'var(--surface-container)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 14, fontWeight: 600,
                  color: 'var(--on-surface)',
                  transition: 'background 0.15s, transform 0.1s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container-high)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--surface-container)'}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>{alt}</span>
                <span style={{
                  fontSize: 9, color: 'var(--primary)',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                }}>
                  Swap
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const workoutPageCache = { trackerScroll: 0 };

export default function WorkoutPage() {
  useScrollRestoration('/workout');
  const { user, splits, workoutLogs, setWorkoutLogs, addToast } = useApp();
  const nav = useNavigate();
  const activeSplit = splits.find(s => s.id === user.activeSplitId) || splits[0];
  const [pastDate, setPastDate] = useState(tod());
  // --- Session state: auto-resume from localStorage on mount ---
  const [session, setSession] = useState(() => {
    try {
      const saved = loadPersistedSession(user?.id);
      if (saved && (Date.now() - (saved.lastUpdated || saved.startTime)) < SESSION_STALE_MS) {
        return saved; // Fresh session — auto-resume
      }
    } catch {}
    return null;
  });
  const [done, setDone] = useState(null);

  // Resume card — only for stale sessions (8-24h)
  const [persistedSession, setPersistedSession] = useState(() => {
    try {
      const saved = loadPersistedSession(user?.id);
      if (saved && (Date.now() - (saved.lastUpdated || saved.startTime)) >= SESSION_STALE_MS) {
        return saved; // Stale — show resume card
      }
    } catch {}
    return null;
  });
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [swapTarget, setSwapTarget] = useState(null);

  const prMap = useMemo(() => {
    const map = {};
    for (const ex of session?.exs ?? []) {
      const name = ex.sv || ex.name;
      map[name] = getAllTimePR(workoutLogs, name);
    }
    return map;
  }, [session?.exs, workoutLogs]);

  // Timer State (Fix 3 & 5)
  const [restDuration, setRestDuration] = useState(() => {
    const saved = localStorage.getItem('fittrack_restTimerDuration');
    return saved ? parseInt(saved, 10) : 90;
  });
  const [restActive, setRestActive] = useState(false);
  const [restEndsAt, setRestEndsAt] = useState(null);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [restTimerPosition, setRestTimerPosition] = useState(null); // { ei, si }

  const [confirmFinish, setConfirmFinish] = useState(false);
  const wDays = activeSplit?.days.filter(d => d.type !== 'rest') || [];

  const finishBtnRef = useRef(null);
  const [showFAB, setShowFAB] = useState(true);

  const startTimeRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  // Recover startTime on auto-resume
  useEffect(() => {
    if (session && session.startTime && !startTimeRef.current) {
      startTimeRef.current = session.startTime;
    }
  }, [session]);

  // Persist active session (Fix 6)
  useEffect(() => {
    if (session && !done && !session.isYoga) {
      persistActiveSession({ ...session, userId: user.id });
    } else if (done) {
      clearPersistedSession();
    }
  }, [session, done, user]);

  // Read timer from localStorage on mount (Fix 3) — also restore position
  useEffect(() => {
    const saved = localStorage.getItem(REST_TIMER_KEY);
    if (saved) {
       const endsAt = parseInt(saved, 10);
       if (endsAt > Date.now()) {
          setRestEndsAt(endsAt);
          setRestActive(true);
          // Restore timer position
          try {
            const posRaw = localStorage.getItem(REST_TIMER_POS_KEY);
            if (posRaw) setRestTimerPosition(JSON.parse(posRaw));
          } catch {}
       } else {
          localStorage.removeItem(REST_TIMER_KEY);
          localStorage.removeItem(REST_TIMER_POS_KEY);
          playRestCompleteChime();
          vibrateRestComplete();
       }
    }
  }, []);

  // Tick rest timer (Fix 3)
  useEffect(() => {
    if (!restActive || !restEndsAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, restEndsAt - Date.now());
      setRestSecondsLeft(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(REST_TIMER_KEY);
        localStorage.removeItem(REST_TIMER_POS_KEY);
        setRestActive(false);
        setRestTimerPosition(null);
        playRestCompleteChime();
        vibrateRestComplete();
      }
    }, 250);
    return () => clearInterval(interval);
  }, [restActive, restEndsAt]);

  // Page visibility handler (Fix 3)
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const saved = localStorage.getItem(REST_TIMER_KEY);
        if (saved) {
          const endsAt = parseInt(saved, 10);
          if (endsAt <= Date.now()) {
            localStorage.removeItem(REST_TIMER_KEY);
            localStorage.removeItem(REST_TIMER_POS_KEY);
            setRestActive(false);
            setRestTimerPosition(null);
            playRestCompleteChime();
            vibrateRestComplete();
          } else {
            setRestEndsAt(endsAt);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  function handleRestDurationChange(newSeconds) {
    setRestDuration(newSeconds);
    localStorage.setItem('fittrack_restTimerDuration', String(newSeconds));
  }

  function skipRestTimer() {
    localStorage.removeItem(REST_TIMER_KEY);
    localStorage.removeItem(REST_TIMER_POS_KEY);
    setRestActive(false);
    setRestTimerPosition(null);
  }

  function extendRestTimer(extraSeconds) {
    setRestEndsAt(prev => {
      const newEnd = (prev || Date.now()) + extraSeconds * 1000;
      localStorage.setItem(REST_TIMER_KEY, String(newEnd));
      return newEnd;
    });
  }

  function doStartRestTimer(ei, si) {
    getAudioCtx(); // unlock audio on user gesture
    const endsAt = Date.now() + restDuration * 1000;
    localStorage.setItem(REST_TIMER_KEY, String(endsAt));
    localStorage.setItem(REST_TIMER_POS_KEY, JSON.stringify({ ei, si }));
    setRestEndsAt(endsAt);
    setRestSecondsLeft(restDuration);
    setRestActive(true);
    setRestTimerPosition({ ei, si });
  }

  // Unload Guard
  useEffect(() => {
    if (!session || done) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session, done]);

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
    workoutPageCache.trackerScroll = window.scrollY;
    if (day.type === 'yoga') {
      setSession({ day, isYoga: true });
      setDone(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const exs = day.exercises.map(ex => {
      const prev = workoutLogs.filter(l => l.userId === user.id && l.dayId === day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      let prevEx = null;
      if (prev) {
        prevEx = prev.exercises.find(e => e.name === ex.name || (ex.variants && ex.variants.includes(e.name)));
      }
      return {
        ...ex, sv: prevEx?.name || (ex.variants ? ex.variants[0] : null),
        sets: Array.from({ length: ex.sets || 3 }, (_, i) => {
          const pSet = prevEx?.sets[i];
          return { reps: '', weight: pSet ? String(pSet.weight) : '', done: false, targetRep: pSet ? String(pSet.reps) : (ex.repsRange || '8-12') };
        }),
      };
    });
    const timestamp = Date.now();
    startTimeRef.current = timestamp;
    setSession({ day, exs, notes: '', startTime: timestamp });
    setDone(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const upd = (ei, si, f, v) => setSession(p => {
    const e = [...p.exs]; const s = [...e[ei].sets];
    s[si] = { ...s[si], [f]: f === 'done' ? v : v };
    e[ei] = { ...e[ei], sets: s };
    // Auto-start timer when marking set done
    if (f === 'done' && v) doStartRestTimer(ei, si);
    return { ...p, exs: e };
  });

  const addS = ei => setSession(p => { const e = [...p.exs]; const ls = e[ei].sets[e[ei].sets.length - 1]; e[ei] = { ...e[ei], sets: [...e[ei].sets, { ...ls, done: false }] }; return { ...p, exs: e }; });
  const rmS = (ei, si) => setSession(p => { const e = [...p.exs]; e[ei] = { ...e[ei], sets: e[ei].sets.filter((_, i) => i !== si) }; return { ...p, exs: e }; });
  const setV = (ei, v) => setSession(p => { const e = [...p.exs]; e[ei] = { ...e[ei], sv: v }; return { ...p, exs: e }; });

  const swapExercise = (exerciseIndex, newName) => {
    const lastSession = getLastSessionSets(workoutLogs, newName);
    const history = lastSession ? { weight: lastSession.sets[lastSession.sets.length - 1].weight, reps: lastSession.sets[lastSession.sets.length - 1].reps, date: lastSession.date } : null;

    setSession(prev => ({
      ...prev,
      exs: prev.exs.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        return {
          ...ex,
          sv: newName,
          _swapHistory: history ?? null,
          sets: ex.sets.map((set, si) => {
            if (set.done) return set;
            // Map set-by-set: use matching index, fall back to last historical set
            const histSet = lastSession
              ? (lastSession.sets[si] ?? lastSession.sets[lastSession.sets.length - 1])
              : null;
            return {
              ...set,
              weight: histSet ? String(histSet.weight) : '',
              reps:   histSet ? String(histSet.reps)   : '',
            };
          }),
        };
      }),
    }));
  };

  const finish = () => {
    const undoneCount = session.exs.reduce((acc, ex) => acc + ex.sets.filter(s => !s.done).length, 0);
    if (undoneCount > 0) {
      setConfirmFinish(true);
      return;
    }
    doFinish();
  };

  const doFinish = () => {
    setConfirmFinish(false);
    clearPersistedSession();
    startTimeRef.current = null;
    clearScrollPosition('/history');
    setElapsed(0);
    const endTimestamp = new Date().getTime();
    const log = {
      id: gId(), userId: user.id, splitId: activeSplit.id, dayId: session.day.id, dayName: session.day.name, date: pastDate, notes: session.notes,
      durationMinutes: session.startTime ? Math.round((endTimestamp - session.startTime) / 60000) : null,
      exercises: session.exs.map(ex => ({
        name: ex.sv || ex.name,
        muscle: ex.muscle || null,
        primaryMuscle: ex.primaryMuscle || null,
        secondaryMuscles: ex.secondaryMuscles || [],
        sets: ex.sets.filter(s => s.done).map(s => ({ reps: parseFloat(s.reps) || 0, weight: parseFloat(s.weight) || 0 }))
      })).filter(ex => ex.sets.length > 0),
    };
    setWorkoutLogs(p => {
      const newLogs = [...p, log];
      syncUserXPToCache({ workoutLogs: newLogs, splits, user }).catch(console.warn);
      return newLogs;
    }); 
    setDone(log); skipRestTimer();
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
        const exItem = session?.exs?.find(e => (e.sv || e.name) === doneEx.name);
        return exItem?.primaryMuscle || exItem?.muscle?.toLowerCase();
      }).filter(Boolean)
    )];
    const sessionSecondaryMuscles = [...new Set(
      done.exercises.flatMap(doneEx => {
        const exItem = session?.exs?.find(e => (e.sv || e.name) === doneEx.name);
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
          <button className="btn-p" style={{ flex: 1, padding: '14px', fontSize: 14 }} onClick={() => { 
            setSession(null); 
            setDone(null); 
            setTimeout(() => window.scrollTo({ top: workoutPageCache.trackerScroll || 0, behavior: 'instant' }), 0); 
          }}>Log Another</button>
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
          date: pastDate, notes: '',
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
        setWorkoutLogs(p => {
          const newLogs = [...p, log];
          syncUserXPToCache({ workoutLogs: newLogs, splits, user }).catch(console.warn);
          return newLogs;
        });
        addToast('Yoga session logged! 🧘', 'success');
      };
      return <YogaSessionView day={session.day} onBack={() => { 
        setSession(null); 
        setDone(null); 
        setTimeout(() => window.scrollTo({ top: workoutPageCache.trackerScroll || 0, behavior: 'instant' }), 0); 
      }} onComplete={handleYogaComplete} />;
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
          <select value={restDuration} onChange={e => handleRestDurationChange(parseInt(e.target.value))} style={{ width: 'auto', fontSize: 11, padding: '2px 6px', background: 'var(--surface-container-highest)', border: 'none', borderRadius: 6, color: 'var(--on-surface)', letterSpacing: '0.05em' }}>
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--on-surface)', marginBottom: 4, flex: 1, lineHeight: 1.1 }}>
                      {ex.sv || ex.name}
                    </h3>
                    {!ex.variants && (
                      <button
                        onClick={() => setSwapTarget({ exerciseIndex: ei, name: ex.name })}
                        aria-label={`Swap ${ex.name}`}
                        style={{
                          background: 'var(--surface-container-highest)', border: '1px solid var(--surface-container)',
                          cursor: 'pointer', padding: '6px 10px', borderRadius: 10,
                          color: 'var(--on-surface-variant)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                          transition: 'all 0.2s', flexShrink: 0
                        }}
                        onMouseOver={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary-container)'; }}
                        onMouseOut={e => { e.currentTarget.style.color = 'var(--on-surface-variant)'; e.currentTarget.style.borderColor = 'var(--surface-container)'; }}
                      >
                        <ArrowRightLeft size={16} />
                        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Swap</span>
                      </button>
                    )}
                  </div>
                  {ex.variants && <select value={ex.sv || ex.variants[0]} onChange={e => setV(ei, e.target.value)} style={{ marginTop: 0, marginBottom: 4, fontSize: 11, padding: '2px 8px', width: 'auto', borderRadius: 6, background: 'var(--surface-container)', border: 'none' }}>{ex.variants.map(v => <option key={v} value={v}>{v}</option>)}</select>}
                  <p className="label-md" style={{ fontSize: 10, color: 'var(--on-surface-variant)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {ex.muscle || 'Full Body'} • {focusType}
                  </p>
                </div>
                <button aria-label="Exercise options" style={{ minWidth: 44, minHeight: 44, background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </button>
              </div>

              {/* Swapped Exercise Last Session Chip */}
              {ex._swapHistory && !ex.sets.every(s => s.done) && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  color: 'var(--on-surface-dim)',
                  background: 'var(--surface-container)',
                  borderRadius: 8,
                  padding: '3px 10px',
                  marginTop: 4,
                  marginBottom: 8,
                  fontFamily: 'Be Vietnam Pro, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                }}>
                  <Clock size={11} color="var(--on-surface-dim)" strokeWidth={2} />
                  {ex._swapHistory.weight > 0
                    ? `Last: ${ex._swapHistory.weight} kg x ${ex._swapHistory.reps} reps`
                    : `Last: ${ex._swapHistory.reps} reps (bodyweight)`
                  }
                  {' · '}
                  {new Date(ex._swapHistory.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              )}

              {/* Last Session Reference Row (UX-4.5) */}
              {(() => {
                const prevLog = workoutLogs.filter(l => l.userId === user.id && l.dayId === session.day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                const pe = prevLog?.exercises?.find(e => e.name === (ex.sv || ex.name));
                if (!pe?.sets?.length) return null;
                return (
                  <div style={{ padding: '6px 12px', marginBottom: 8, background: 'var(--surface-container)', borderRadius: 10, borderLeft: '2px solid var(--primary-container)', fontSize: 11, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                    <span style={{ color: 'var(--on-surface-dim)', fontWeight: 700, marginRight: 4 }}>PREV ({fmt(prevLog.date)}):</span>
                    {pe.sets.map((s, i) => (
                      <span key={i} style={{ color: 'var(--on-surface-variant)' }}>{s.reps}r × {s.weight}kg{i < pe.sets.length - 1 ? ',' : ''}</span>
                    ))}
                  </div>
                );
              })()}
              {/* Set Grid Headers */}
              <div className="set-row" style={{ padding: '0 12px', marginBottom: 8 }}>
                {['SET', 'REPS', 'KG', 'DONE'].map((h, i) => (
                  <div key={h} style={{ fontSize: 9, color: 'var(--outline)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: i === 3 ? 'right' : 'left' }}>{h}</div>
                ))}
              </div>

              {/* Set Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ex.sets.map((s, si) => {
                  const exName    = ex.sv || ex.name;
                  const pr        = prMap[exName] ?? null;
                  const isPR      = s.done && beatsAllTimePR(pr, parseFloat(s.weight) || 0, parseFloat(s.reps) || 0);



                  return (
                  <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {restActive && restTimerPosition?.ei === ei && restTimerPosition?.si === si && (
                      <RestTimer secondsLeft={restSecondsLeft} totalDuration={restDuration} onSkip={skipRestTimer} onExtend={extendRestTimer} />
                    )}
                    <div className={`set-row ${isPR ? 'is-pr' : ''}`} style={{ 
                      background: isPR ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                      padding: 12, borderRadius: 12, transition: 'all 0.2s', position: 'relative',
                      opacity: s.done ? (isPR ? 1 : 0.7) : 1, filter: s.done ? (isPR ? 'none' : 'grayscale(50%)') : 'none',
                      borderLeft: isPR ? '2.5px solid var(--primary-container)' : 'none'
                    }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container)'} onMouseLeave={e => e.currentTarget.style.background = isPR ? 'var(--surface-container-high)' : 'var(--surface-container-low)'}>
                    
                    <div style={{ fontSize: 14, color: 'var(--on-surface)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isPR ? (
                        <div className="pr-badge-pill" title="Personal Record">
                          PR
                        </div>
                      ) : (
                        si + 1
                      )}
                    </div>
                    
                    <div style={{ paddingRight: 8 }}>
                      <input type="number" placeholder={s.targetRep} value={s.reps} onChange={e => upd(ei, si, 'reps', e.target.value)} style={{ width: '100%', minHeight: 44, background: 'var(--surface-container-lowest)', border: 'none', borderBottom: '2px solid transparent', textAlign: 'center', fontSize: 16, fontWeight: 700, padding: '8px 4px', borderRadius: 8, color: 'var(--on-surface)', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderBottomColor = 'var(--primary-container)'} onBlur={e => e.target.style.borderBottomColor = 'transparent'} />
                    </div>
                    
                    <div style={{ paddingRight: 8 }}>
                      <input type="number" step=".5" placeholder="--" value={s.weight} onChange={e => upd(ei, si, 'weight', e.target.value)} style={{ width: '100%', minHeight: 44, background: 'var(--surface-container-lowest)', border: 'none', borderBottom: '2px solid transparent', textAlign: 'center', fontSize: 16, fontWeight: 700, padding: '8px 4px', borderRadius: 8, color: 'var(--on-surface)', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderBottomColor = 'var(--primary-container)'} onBlur={e => e.target.style.borderBottomColor = 'transparent'} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button onClick={() => upd(ei, si, 'done', !s.done)} style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: s.done ? 'var(--surface-container-highest)' : 'var(--surface-container-highest)',
                        color: s.done ? 'var(--primary)' : 'var(--on-surface-variant)',
                        border: 'none',
                        outline: s.done ? '1.5px solid var(--primary-container)' : '1.5px solid transparent',
                        outlineOffset: '-1.5px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .2s'
                      }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = s.done ? 'var(--primary)' : 'var(--on-surface-variant)'}>
                        <Check size={18} strokeWidth={s.done ? 3 : 2} />
                      </button>
                      {ex.sets.length > 1 && (
                        <button onClick={() => rmS(ei, si)} aria-label="Remove set" style={{ minWidth: 44, minHeight: 44, background: 'transparent', border: 'none', borderRadius: 8, color: 'var(--on-surface-dim)', cursor: 'pointer', padding: 0, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove set">✕</button>
                      )}
                    </div>

                  </div>
                  </div>
                  );
                })}
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
          clearPersistedSession();
          startTimeRef.current = null;
          setElapsed(0);
          setSession(null); skipRestTimer();
          setTimeout(() => window.scrollTo({ top: workoutPageCache.trackerScroll || 0, behavior: 'instant' }), 0);
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
      <ConfirmDialog
        open={confirmFinish}
        title="Unfinished Sets"
        message={`You have ${session?.exs?.reduce((acc, ex) => acc + ex.sets.filter(s => !s.done).length, 0) || 0} unchecked set(s). They will not be saved. Finish workout anyway?`}
        confirmLabel="Save Partial"
        cancelLabel="Keep Editing"
        danger={false}
        onConfirm={doFinish}
        onCancel={() => setConfirmFinish(false)}
      />
      {swapTarget && (
        <Portal>
          <ExerciseSwapModal
            exerciseName={swapTarget.name}
            onSwap={(newName) => swapExercise(swapTarget.exerciseIndex, newName)}
            onClose={() => setSwapTarget(null)}
          />
        </Portal>
      )}
    </div>
  );
  }


  return (
    <div className="pg-in">
      <PageHeader
        title="Workout Tracker"
        sub={activeSplit ? activeSplit.name : 'Select a split first'}
        action={
          !session && (
            <input
              type="date"
              value={pastDate}
              max={tod()}
              onChange={e => setPastDate(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: 'var(--surface-container-highest)', color: 'var(--on-surface)', fontSize: 12, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}
            />
          )
        }
      />
      {!activeSplit ? <EmptyState Icon={Trophy} title="No Split Selected" message="Go to Splits to select a workout program first" /> :
        <>
          {persistedSession && !session && (() => {
            const exerciseCount = persistedSession.exs?.length || 0;
            const completedSets = persistedSession.exs?.flatMap(e => e.sets).filter(s => s.done).length || 0;
            const timeAgo = formatTimeAgo(persistedSession.startTime);
            const hoursAgo = Math.floor((Date.now() - persistedSession.startTime) / 3600000);
            
            return (
              <div style={{ background: 'var(--surface-container-low)', borderLeft: '3px solid var(--primary-container)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 14 }}>⚠️</span>
                  <span className="label-md" style={{ color: 'var(--on-surface-variant)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {`SESSION FROM ${hoursAgo}H AGO`}
                  </span>
                </div>
                <div className="title-md" style={{ color: 'var(--on-surface)', marginBottom: 4 }}>
                  {persistedSession.day?.name} • {activeSplit.name}
                </div>
                <div className="body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 16 }}>
                  Started {timeAgo} • {exerciseCount} exercises • {completedSets} sets done
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button onClick={() => {
                    setSession(persistedSession);
                    startTimeRef.current = persistedSession.startTime;
                    setPersistedSession(null);
                  }} style={{ padding: '10px 20px', borderRadius: 999, background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', color: 'var(--on-primary-container)', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13, letterSpacing: '0.05em' }}>
                    RESUME SESSION
                  </button>
                  <button onClick={() => setConfirmDiscard(true)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Discard
                  </button>
                </div>
                <ConfirmDialog
                  open={confirmDiscard}
                  title="Discard Session?"
                  message={`This will permanently delete all ${completedSets} sets logged in this session.`}
                  confirmLabel="Discard"
                  cancelLabel="Cancel"
                  danger={true}
                  onConfirm={() => {
                    clearPersistedSession();
                    setPersistedSession(null);
                    setConfirmDiscard(false);
                  }}
                  onCancel={() => setConfirmDiscard(false)}
                />
              </div>
            );
          })()}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(265px,1fr))', gap: 10 }}>
          {wDays.map(day => {
            const last = workoutLogs.filter(l => l.userId === user.id && l.dayId === day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            return (
              <div key={day.id} className="card stripe" style={{ padding: 16, cursor: 'pointer', transition: 'all .2s var(--ease-smooth)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="tag" style={{ fontSize: 9, minWidth: 'fit-content' }}>{(day.subtype || day.type).toUpperCase()}</span>{last && <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>Last: {fmt(last.date)}</span>}</div>
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
        </>
      }

    </div>
  );
}
