import { useState, useEffect, useRef, useMemo } from 'react';
import { Trophy, Timer, X, Check, Play, Pause, Square, ArrowRightLeft, Clock, Trash2, Search, Plus, RefreshCcw, Flower2, AlertTriangle } from 'lucide-react';
import { beatsAllTimePR } from '../../../utils/exerciseHistory';
import { Portal } from '../../v1/shared/SharedComponents';
import { VoltConfirmDialog } from '../shared/VoltShared';
import BodyMapSVG from '../../v1/shared/BodyMapSVG';
import { gId, tod, fmt, formatTimeAgo } from '../../../utils/helpers';
import { calcAllMuscleXP } from '../../../data/muscleData';
import { syncUserXPToCache } from '../../../utils/xpCacheSync';
import { EXERCISE_LIBRARY } from '../../../data/exerciseLibrary';
import { useScrollRestoration } from '../../../core/hooks/useScrollRestoration';
import { useWorkoutSession } from '../../../core/hooks/useWorkoutSession';
import { clearPersistedSession, workoutPageCache } from '../../../core/services/workoutSession';
import { useSpringNumber, SPRING_PLAY } from '../../../core/motion/springs';
import { VoltBlock, VoltPill, VoltChip, Sticker, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Workout (V-4) ──────────────────────────────────────────────
// Same session machine as V1 (useWorkoutSession), Volt presentation.
// Sub-component LOGIC (yoga timers/breathing, swap alternatives, exercise
// pool filtering, rest-ring math) is carried over from the V1 page; the
// EXERCISE_ALTERNATIVES data table is copied verbatim from V1 (it lives in
// the frozen V1 page file, unexported). ConfirmDialog is V1's shared
// component until the Volt popup pack (V-7).

// ─── YOGA / BREATHWORK (Inline Session) ──────────────────────────────────────
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
  } catch { /* best effort */ }
};

function VoltYogaView({ day, onBack, onComplete }) {
  const [activeSession, setActiveSession] = useState(null);
  const [poseIndex, setPoseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle');
  const [breathTimer, setBreathTimer] = useState(0);
  const yogaTimerRef = useRef(null);
  const breathTimerRef = useRef(null);
  const completedNaturallyRef = useRef(false);

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

  const getDuration = (session, index) => {
    if (session?.durations?.[index]) return session.durations[index];
    return session?.durationPerPose || 30;
  };

  const startSession = (preset) => {
    completedNaturallyRef.current = false;
    setBreathPhase('idle');
    setActiveSession(preset);
    setPoseIndex(0);
    setTimeLeft(getDuration(preset, 0));
    setIsPlaying(true);
    playBeep(1100, 0.4);
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
        completedNaturallyRef.current = true;
        endSession();
        return prev;
      }
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const roundBtn = (bg, fg) => ({
    width: 64, height: 64, borderRadius: '50%', background: bg, color: fg,
    border: '2.5px solid var(--v-edge)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2 className="v-num" style={{ fontSize: 26, textTransform: 'uppercase', lineHeight: 1 }}>{day.name}</h2>
        <button type="button" className="v-chip v-press" onClick={onBack} style={{ cursor: 'pointer' }}>← Back to Days</button>
      </div>

      {activeSession ? (
        <VoltBlock hero style={{ padding: 32, textAlign: 'center' }}>
          <VoltLabel volt>{activeSession.name}</VoltLabel>
          {currentSanskrit && (
            <div style={{ fontSize: 13, color: 'var(--v-dim)', marginTop: 12, letterSpacing: '0.05em' }}>{currentSanskrit}</div>
          )}
          <h2 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '4px 0 6px' }}>{currentEnglish}</h2>
          <p style={{ color: 'var(--v-dim)', fontSize: 13, margin: '0 0 28px' }}>Pose {poseIndex + 1} of {activeSession.poses.length}</p>
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--v-dim)" strokeOpacity="0.3" strokeWidth="8" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--v-volt)" strokeWidth="8" strokeDasharray="565.48" strokeDashoffset={565.48 * (1 - Math.max(0, timeLeft) / currentPoseDuration)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="v-num" style={{ fontSize: '4rem', lineHeight: 1 }}>{timeLeft}</div>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button type="button" className="v-press" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause session' : 'Play session'} style={roundBtn('var(--v-volt)', '#141416')}>
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button type="button" className="v-press" onClick={() => { completedNaturallyRef.current = false; endSession(); }} aria-label="Stop session" style={roundBtn('var(--v-panel)', 'var(--v-ink)')}>
              <Square />
            </button>
          </div>
        </VoltBlock>
      ) : (
        <>
          {dayFlowPreset && (
            <VoltBlock hero>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 18, fontWeight: 900 }}><Flower2 size={18} style={{ verticalAlign: '-3px' }} /> Today&apos;s Yoga Flow</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--v-dim)' }}>{dayFlowPreset.poses.length} poses • {(totalFlowDuration / 60).toFixed(1)} min</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
                {day.exercises.slice(0, 5).map((ex, i) => {
                  const dur = dayFlowPreset.durations[i];
                  const mins = Math.floor(dur / 60);
                  const secs = dur % 60;
                  const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
                  return (
                    <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '2px solid var(--v-edge-quiet)', borderRadius: 10, fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{ex.name}{ex.sets > 1 ? ` × ${ex.sets}` : ''}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--v-dim)' }}>{timeStr}</span>
                    </div>
                  );
                })}
                {day.exercises.length > 5 && (
                  <div style={{ fontSize: 11.5, color: 'var(--v-dim)', paddingLeft: 4 }}>+{day.exercises.length - 5} more</div>
                )}
              </div>
              <VoltPill onClick={() => startSession(dayFlowPreset)} style={{ width: '100%' }}>Start Flow →</VoltPill>
            </VoltBlock>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            <VoltBlock quiet>
              <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 14 }}>Quick Sessions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {YOGA_PRESETS.map(p => (
                  <button key={p.id} type="button" className="v-press" onClick={() => startSession(p)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 12, color: 'var(--v-ink)', cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--v-dim)' }}>{(p.poses.length * p.durationPerPose / 60).toFixed(1)} min</span>
                  </button>
                ))}
              </div>
            </VoltBlock>
            <VoltBlock quiet style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 6 }}>Box Breathing</div>
              <p style={{ color: 'var(--v-dim)', fontSize: 13, margin: '0 0 22px' }}>4s Inhale, 4s Hold, 4s Exhale, 4s Hold</p>
              {breathPhase !== 'idle' ? (
                <div style={{ width: 150, height: 150, borderRadius: '50%', border: '3px solid var(--v-volt)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: breathPhase === 'inhale' ? 'rgba(201, 241, 88, 0.14)' : 'transparent', transition: 'background-color 2s ease' }}>
                  <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--v-volt-text)', fontWeight: 800 }}>{breathPhase.replace('_', ' ')}</div>
                  <div className="v-num" style={{ fontSize: 32, lineHeight: 1.1 }}>{breathTimer}</div>
                  <button type="button" onClick={() => setBreathPhase('idle')} aria-label="Stop breathing exercise" style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', display: 'flex' }}><Square size={16} /></button>
                </div>
              ) : (
                <VoltPill onClick={startBreathing}><RefreshCcw size={17} /> Start Session</VoltPill>
              )}
            </VoltBlock>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Swap alternatives (data table copied verbatim from the V1 page) ───────
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
  'Lateral Raises':                        ['Cable Lateral Raises', 'Machine Lateral Raise', 'Seated Dumbbell Lateral Raises'],
  'Cable Lateral Raises':                  ['Lateral Raises', 'Machine Lateral Raise', 'Seated Dumbbell Lateral Raises'],
  'Seated Dumbbell Lateral Raises':        ['Lateral Raises', 'Cable Lateral Raises', 'Machine Lateral Raise'],
  // SHOULDERS — Isolation (Rear delts)
  'Rear Delt Flyes':                       ['Face Pulls', 'Cable Reverse Fly', 'Band Pull-Apart'],
  'Face Pulls':                            ['Rear Delt Flyes', 'Cable Reverse Fly', 'Band Pull-Apart'],

  // ═══════════════════════════════════════════════════════════════════════
  // BICEPS — Isolation
  // ═══════════════════════════════════════════════════════════════════════
  'Biceps Cable Curls':                    ['Dumbbell Curls', 'EZ Bar Curls', 'Concentration Curls'],
  'Bicep Curls':                           ['Dumbbell Curls', 'EZ Bar Curls', 'Cable Curls'],
  'Barbell Curl':                          ['EZ Bar Curls', 'Dumbbell Curls', 'Cable Curls'],
  'Dumbbell Curls':                        ['Biceps Cable Curls', 'EZ Bar Curls', 'Barbell Curl'],
  'EZ Bar Curls':                          ['Barbell Curl', 'Dumbbell Curls', 'Cable Curls'],
  'Hammer Curls':                          ['Rope Hammer Curls', 'Cross-Body Hammer Curl', 'Reverse Curls'],
  'Incline Bench Bicep Curls':             ['Concentration Curls', 'Spider Curls', 'Preacher Curls'],
  'Preacher Curls':                        ['Spider Curls', 'Concentration Curls', 'Machine Preacher Curl'],
  'Concentration Curls':                   ['Preacher Curls', 'Spider Curls', 'Incline Bench Bicep Curls'],
  'Alternating Dumbbell Curl':             ['Dumbbell Curls', 'Cable Curls', 'EZ Bar Curls'],
  'Reverse Curls':                         ['Hammer Curls', 'Barbell Curl', 'EZ Bar Curls'],

  // ═══════════════════════════════════════════════════════════════════════
  // TRICEPS — Isolation
  // ═══════════════════════════════════════════════════════════════════════
  'Single Hand Tricep Pushdowns':          ['Tricep Rope Pushdowns', 'Straight Bar Pushdowns', 'V-Bar Pushdowns'],
  'Tricep Pushdowns':                      ['Tricep Rope Pushdowns', 'V-Bar Pushdowns', 'Straight Bar Pushdowns'],
  'Cable Triceps Pushdown':                ['Tricep Rope Pushdowns', 'V-Bar Pushdowns', 'Straight Bar Pushdowns'],
  'Single Hand Rope Pushdowns':            ['Tricep Rope Pushdowns', 'Straight Bar Pushdowns', 'V-Bar Pushdowns'],
  'Single Hand Overhead Tricep Extension': ['Overhead Tricep Extension (Cable)', 'Overhead Tricep Extension (Dumbbell)', 'Skull Crushers'],
  'Single Hand Overhead Cable Tricep Extension': ['Overhead Tricep Extension (Dumbbell)', 'Single Hand Overhead Tricep Extension', 'Skull Crushers'],
  'Overhead Tricep Extension':             ['Skull Crushers', 'Tricep Rope Pushdowns', 'Single Hand Overhead Tricep Extension'],
  'Skull Crushers':                        ['Overhead Tricep Extension', 'Close-Grip Bench Press', 'Tricep Dips'],
  'Tricep Dips (Chair)':                   ['Bench Dips', 'Diamond Push-ups', 'Tricep Rope Pushdowns'],

  // ═══════════════════════════════════════════════════════════════════════
  // QUADS — Compound (Squat pattern)
  // ═══════════════════════════════════════════════════════════════════════
  'Squats':                                ['Smith Machine Squats', 'Leg Press', 'Hack Squats', 'Pendulum Squats', 'Goblet Squats'],
  'Barbell Back Squat':                    ['Smith Machine Squats', 'Leg Press', 'Hack Squats', 'Pendulum Squats', 'Front Squats'],
  'Front Squats':                          ['Barbell Back Squat', 'Goblet Squats', 'Hack Squats'],
  'Hack Squats':                           ['Leg Press', 'Smith Machine Squats', 'Pendulum Squats', 'Front Squats'],
  'Leg Press':                             ['Squats', 'Hack Squats', 'Pendulum Squats', 'Smith Machine Squats'],
  'Pendulum Squats':                       ['Hack Squats', 'Leg Press', 'Smith Machine Squats'],
  'Goblet Squats':                         ['Front Squats', 'Bodyweight Squats', 'Leg Press'],
  'Bodyweight Squats':                     ['Goblet Squats', 'Jump Squats', 'Leg Press'],
  'Smith Machine Squats':                  ['Squats', 'Hack Squats', 'Pendulum Squats', 'Leg Press'],
  // QUADS — Unilateral
  'Walking Lunges':                        ['Bulgarian Split Squats', 'Step-Ups', 'Reverse Lunges'],
  'Walking Dumbbell Lunge':                ['Bulgarian Split Squats', 'Step-Ups', 'Reverse Lunges'],
  'Bulgarian Split Squats':                ['Walking Lunges', 'Step-Ups', 'Reverse Lunges'],
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
  'Seated Leg Curls':                      ['Lying Leg Curls', 'Leg Curls', 'Nordic Hamstring Curls'],
  'Lying Leg Curls':                       ['Seated Leg Curls', 'Leg Curls', 'Nordic Hamstring Curls'],

  // ═══════════════════════════════════════════════════════════════════════
  // GLUTES
  // ═══════════════════════════════════════════════════════════════════════
  'Barbell Hip Thrust':                    ['Glute Bridges', 'Cable Pull-Through', 'Single-Leg Hip Thrust'],
  'Glute Bridges':                         ['Barbell Hip Thrust', 'Cable Pull-Through', 'Single-Leg Glute Bridges'],
  'Single-Leg Glute Bridges':              ['Glute Bridges', 'Barbell Hip Thrust', 'Cable Pull-Through'],
  'Leg Abductor Machine':                  ['Banded Clamshells', 'Cable Hip Abduction', 'Side-Lying Leg Raise'],
  'Leg Adductor Machine':                  ['Copenhagen Plank', 'Sumo Squats', 'Cable Hip Adduction'],

  // ═══════════════════════════════════════════════════════════════════════
  // CALVES
  // ═══════════════════════════════════════════════════════════════════════
  'Standing Calf Raises':                  ['Seated Calf Raises', 'Smith Machine Calf Raise', 'Leg Press Calf Raise'],
  'Seated Calf Raises':                    ['Standing Calf Raises', 'Donkey Calf Raise', 'Leg Press Calf Raise'],

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

// ─── Rest timer (ring math identical to V1) ──────────────────────────────────
function VoltRestTimer({ secondsLeft, totalDuration, onSkip, onExtend }) {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const RING_SIZE = typeof window !== 'undefined' && window.innerWidth < 360 ? 180 : 220;
  const STROKE_W = 8;
  const RADIUS = (RING_SIZE - STROKE_W) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const [maxObserved, setMaxObserved] = useState(totalDuration || 90);

  // Adjust-during-render (React-endorsed pattern): the ring's high-water
  // mark rises whenever the timer is extended past what we've seen.
  if (secondsLeft > maxObserved) {
    setMaxObserved(secondsLeft);
  }

  const progress = maxObserved > 0 ? secondsLeft / maxObserved : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isLowTime = secondsLeft <= 10;

  return (
    <VoltBlock hero style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 28 }}>
      <VoltLabel volt>Rest Timer</VoltLabel>
      <div style={{ position: 'relative', flexShrink: 0, margin: '22px 0 26px' }}>
        <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none" stroke="var(--v-dim)" strokeOpacity="0.28" strokeWidth={STROKE_W} />
          <circle
            cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none"
            stroke={isLowTime ? 'var(--v-coral)' : 'var(--v-volt)'} strokeWidth={STROKE_W} strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="v-num" style={{ fontSize: 'clamp(3.2rem, 10vw, 3.8rem)', lineHeight: 1, color: isLowTime ? 'var(--v-coral-text)' : undefined }}>
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--v-volt-text)' }}>s</span>
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VoltPill ghost onClick={() => onExtend(30)}>+30s</VoltPill>
        <VoltPill onClick={onSkip}>Skip</VoltPill>
      </div>
    </VoltBlock>
  );
}

// ─── Swap modal (alternatives logic identical to V1) ─────────────────────────
function VoltSwapModal({ exerciseName, originalName, onSwap, onClose }) {
  const targetName = originalName || exerciseName;
  const libEntry = EXERCISE_LIBRARY.find(ex => ex.name === targetName);
  let alternatives = [];

  if (libEntry && libEntry.muscle) {
    const sameMuscleExercises = EXERCISE_LIBRARY.filter(ex => ex.muscle === libEntry.muscle);
    const allOptions = new Set();
    sameMuscleExercises.forEach(ex => {
      allOptions.add(ex.name);
      const alts = EXERCISE_ALTERNATIVES[ex.name] || [];
      alts.forEach(alt => allOptions.add(alt));
    });
    const baseAlternatives = EXERCISE_ALTERNATIVES[targetName] || [];
    baseAlternatives.forEach(alt => allOptions.add(alt));
    alternatives = Array.from(allOptions);
  } else {
    const baseAlternatives = EXERCISE_ALTERNATIVES[targetName] || [];
    alternatives = [...baseAlternatives];
  }

  const isSwapped = originalName && originalName !== exerciseName;
  if (isSwapped && !alternatives.includes(originalName)) {
    alternatives.unshift(originalName);
  }
  alternatives = alternatives.filter(a => a !== exerciseName);
  alternatives.sort((a, b) => a.localeCompare(b));

  const rowBtn = (isOriginal) => ({
    width: '100%', padding: '13px 16px', minHeight: 48, borderRadius: 12, cursor: 'pointer',
    border: isOriginal ? '2.5px solid var(--v-volt)' : '2px solid var(--v-edge-quiet)',
    background: 'var(--v-panel)', color: 'var(--v-ink)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    fontFamily: "'Archivo', sans-serif", fontSize: 14.5, fontWeight: 700, textAlign: 'left',
  });
  const tag = (color) => ({
    fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em', color, flexShrink: 0,
  });

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(4, 6, 10, 0.66)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        className="v-pop"
        style={{ width: '100%', maxWidth: 400, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 20, boxShadow: '5px 5px 0 var(--v-shadow)', padding: 22, maxHeight: '80vh', overflowY: 'auto', color: 'var(--v-ink)' }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label={`Swap ${exerciseName}`}
      >
        <VoltLabel volt>Swap Exercise</VoltLabel>
        <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.01em', margin: '6px 0 18px' }}>{exerciseName}</div>
        <button type="button" className="v-press" onClick={onClose} style={{ ...rowBtn(false), marginBottom: 16 }}>
          <span>Keep current</span>
          <span style={tag('var(--v-dim)')}>Current</span>
        </button>
        {alternatives.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '18px 12px', fontSize: 13, color: 'var(--v-dim)' }}>
            No swap options available for this exercise
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alternatives.map(alt => {
              const isOriginal = isSwapped && alt === originalName;
              return (
                <button key={alt} type="button" className="v-press" onClick={() => { onSwap(alt); onClose(); }} style={rowBtn(isOriginal)}>
                  <span>{alt}</span>
                  <span style={tag(isOriginal ? 'var(--v-success-text)' : 'var(--v-volt-text)')}>{isOriginal ? 'Original' : 'Swap'}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Add-exercise sheet (pool filtering identical to V1) ────────────────────
const MUSCLE_DISPLAY_ORDER = [
  'Chest', 'Back', 'Shoulders', 'Rear Delts', 'Legs', 'Quads', 'Hamstrings', 'Glutes', 'Calves',
  'Abductors', 'Adductors', 'Biceps', 'Triceps', 'Arms', 'Core', 'Full Body'
];

const getSortIndex = (muscle) => {
  const index = MUSCLE_DISPLAY_ORDER.indexOf(muscle);
  return index === -1 ? 999 : index;
};

function VoltPoolRow({ ex, onAdd, session }) {
  const alreadyAdded = session?.exs?.some(e =>
    e.name === ex.name || e._originalName === ex.name || e.originalName === ex.name
  );
  // One accent for every row, per the Volt theme (was: a colour per muscle group).
  const accent = 'var(--v-volt)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 14px', background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderLeft: `4px solid ${accent}`, borderRadius: 12, marginBottom: 8 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 3 }}>{ex.name}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--v-dim)', display: 'flex', gap: 8 }}>
          <span style={{ color: accent, fontWeight: 700 }}>{ex.muscle}</span>
          {ex.repsRange && <span>• {ex.repsRange}</span>}
        </div>
      </div>
      <button
        type="button"
        className={alreadyAdded ? undefined : 'v-press'}
        onClick={() => !alreadyAdded && onAdd(ex)}
        disabled={alreadyAdded}
        aria-label={alreadyAdded ? `${ex.name} already added` : `Add ${ex.name}`}
        style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          border: '2.5px solid var(--v-edge)', cursor: alreadyAdded ? 'default' : 'pointer',
          background: alreadyAdded ? 'transparent' : 'var(--v-volt)', color: alreadyAdded ? 'var(--v-dim)' : '#141416',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {alreadyAdded ? <Check size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={2.5} />}
      </button>
    </div>
  );
}

function VoltAddExerciseSheet({ show, onClose, onAdd, session, searchQuery, setSearchQuery, category, setCategory, exercisePool }) {
  if (!show) return null;

  const filteredPool = exercisePool.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = category === 'all' || ex.muscle === category;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', ...Array.from(new Set(exercisePool.map(ex => ex.muscle))).sort((a, b) => getSortIndex(a) - getSortIndex(b))];

  return (
    <Portal>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(4, 6, 10, 0.66)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        onClick={onClose}
      >
        <div
          className="v-sheet-up"
          style={{ background: 'var(--v-canvas)', color: 'var(--v-ink)', borderTop: '2.5px solid var(--v-edge)', borderRadius: '24px 24px 0 0', height: '88dvh', display: 'flex', flexDirection: 'column' }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="Add exercise"
        >
          <div style={{ padding: '14px 22px 0', flexShrink: 0 }}>
            <div style={{ width: 40, height: 4, background: 'var(--v-dim)', borderRadius: 2, margin: '0 auto 14px', opacity: 0.6 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Add Exercise</h2>
              <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'var(--v-panel)', border: '2px solid var(--v-edge)', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v-ink)', cursor: 'pointer' }}>
                <X size={19} />
              </button>
            </div>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--v-dim)' }} />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '13px 40px 13px 44px', background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 14, color: 'var(--v-ink)', fontSize: 15, fontFamily: "'Archivo', sans-serif", boxSizing: 'border-box' }}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 14, scrollbarWidth: 'none' }}>
              {categories.map(cat => {
                const isSel = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      whiteSpace: 'nowrap', padding: '8px 15px', borderRadius: 999, cursor: 'pointer',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                      border: '2px solid var(--v-edge)',
                      background: isSel ? 'var(--v-volt)' : 'var(--v-panel)', color: isSel ? '#141416' : 'var(--v-dim)',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px 22px' }}>
            {filteredPool.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--v-dim)', fontSize: 14 }}>No exercises found.</div>
            ) : (
              filteredPool.map(ex => (
                <VoltPoolRow key={ex.id || ex.name} ex={ex} session={session} onAdd={onAdd} />
              ))
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Done summary (XP count-up is the one SPRING_PLAY celebration) ───────────
function DoneSummary({ done, session, splits, user, onLogAnother, onViewMap }) {
  const sessionXP = calcAllMuscleXP([done], splits, user);
  const totalXP = Object.values(sessionXP).reduce((a, b) => a + b, 0);
  const totalSets = done.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalVol = done.exercises.reduce((acc, ex) => acc + ex.sets.reduce((sAcc, s) => sAcc + s.reps * s.weight, 0), 0);
  const animatedXP = useSpringNumber(totalXP, SPRING_PLAY, 0);

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
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <Trophy size={40} color="var(--v-volt-text)" style={{ marginBottom: 8 }} />
        <div className="v-num" style={{ fontSize: 32, textTransform: 'uppercase', lineHeight: 1 }}>Workout Complete!</div>
        <div style={{ color: 'var(--v-dim)', fontSize: 13.5, marginTop: 6 }}>Great job crushing your session today.</div>
      </div>

      <VoltBlock hero style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div>
            <div className="v-num" style={{ fontSize: 30, color: 'var(--v-volt-text)' }}>+{Math.round(animatedXP).toLocaleString()}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.12em', marginTop: 3 }}>XP GAINED</div>
          </div>
          <div>
            <div className="v-num" style={{ fontSize: 30 }}>{totalSets}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.12em', marginTop: 3 }}>SETS</div>
          </div>
          <div>
            <div className="v-num" style={{ fontSize: 30 }}>{Math.round(totalVol).toLocaleString()}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.12em', marginTop: 3 }}>KG VOL</div>
          </div>
        </div>
        <div style={{ maxWidth: 240, margin: '18px auto 0' }}>
          <BodyMapSVG muscleXP={sessionXP} primaryMuscles={sessionPrimaryMuscles} secondaryMuscles={sessionSecondaryMuscles} gender={user?.gender} />
        </div>
      </VoltBlock>

      {done._newPRs && done._newPRs.length > 0 && (
        <VoltBlock>
          <div style={{ marginBottom: 12 }}><Sticker tone="coral">New Personal Records</Sticker></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {done._newPRs.map((pr, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, border: '2px solid var(--v-edge-quiet)', padding: '11px 13px', borderRadius: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{pr.name}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--v-volt-text)', fontWeight: 900 }}>
                    {pr.isBodyweight ? `${pr.newReps} reps` : `${pr.newWeight}kg × ${pr.newReps}`}
                  </div>
                  {pr.oldWeight !== null && (
                    <div style={{ fontSize: 10.5, color: 'var(--v-dim)' }}>
                      Previous: {pr.oldWeight === 0 ? `${pr.oldReps} reps` : `${pr.oldWeight}kg`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </VoltBlock>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <VoltPill onClick={onLogAnother} style={{ flex: 1 }}>Log Another</VoltPill>
        <VoltPill ghost onClick={onViewMap} style={{ flex: 1 }}>View Map →</VoltPill>
      </div>
    </div>
  );
}

// ─── Shared Volt control styles ──────────────────────────────────────────────
const voltInputStyle = {
  width: '100%', minHeight: 46, background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)',
  textAlign: 'center', fontSize: 16.5, fontWeight: 800, padding: '8px 4px', borderRadius: 10,
  color: 'var(--v-ink)', fontFamily: "'Archivo', sans-serif", boxSizing: 'border-box',
};
const voltSelectStyle = {
  fontSize: 11.5, padding: '5px 8px', background: 'var(--v-panel)', border: '2px solid var(--v-edge)',
  borderRadius: 999, color: 'var(--v-ink)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, width: 'auto',
};

export default function WorkoutPage() {
  useScrollRestoration('/workout');
  const {
    user, splits, workoutLogs, setWorkoutLogs, addToast, nav, activeSplit,
    pastDate, setPastDate, session, setSession, done, setDone,
    persistedSession, setPersistedSession, confirmDiscard, setConfirmDiscard,
    swapTarget, setSwapTarget, showAddEx, setShowAddEx, addExSearch, setAddExSearch,
    addExCat, setAddExCat, confirmRemoveIdx, setConfirmRemoveIdx, prMap,
    restDuration, restActive, restSecondsLeft, restTimerPosition,
    confirmFinish, setConfirmFinish, wDays, finishBtnRef, showFAB,
    startTimeRef, elapsed, setElapsed, handleRestDurationChange,
    skipRestTimer, extendRestTimer, fmtElapsed, start, upd, addS, rmS, setV,
    addExercise, removeExercise, exercisePool, swapExercise, finish, doFinish,
  } = useWorkoutSession();
  const [nowTs] = useState(() => Date.now());

  if (done) {
    return (
      <DoneSummary
        done={done}
        session={session}
        splits={splits}
        user={user}
        onLogAnother={() => {
          setSession(null);
          setDone(null);
          setTimeout(() => window.scrollTo({ top: workoutPageCache.trackerScroll || 0, behavior: 'instant' }), 0);
        }}
        onViewMap={() => nav('/muscle-map')}
      />
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
        addToast('Yoga session logged!', 'success');
      };
      return (
        <VoltYogaView
          day={session.day}
          onBack={() => {
            setSession(null);
            setDone(null);
            setTimeout(() => window.scrollTo({ top: workoutPageCache.trackerScroll || 0, behavior: 'instant' }), 0);
          }}
          onComplete={handleYogaComplete}
        />
      );
    }

    const pct = Math.round((session.exs.flatMap(e => e.sets).filter(s => s.done).length / session.exs.flatMap(e => e.sets).length) * 100) || 0;

    return (
      <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Session header */}
        <VoltBlock quiet style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="v-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--v-volt)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Active Session · {session.day.name}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: 'var(--v-volt-text)' }}>{pct}% DONE</span>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Timer size={15} color="var(--v-dim)" />
              <select value={restDuration} onChange={e => handleRestDurationChange(parseInt(e.target.value))} style={voltSelectStyle} aria-label="Rest duration">
                {[30, 60, 90, 120, 180, 300].map(s => <option key={s} value={s}>{s < 60 ? `${s}s` : `${s / 60}m`}</option>)}
              </select>
            </span>
          </div>
          <div style={{ marginTop: 11 }}>
            <div style={{ height: 10, border: '2px solid var(--v-edge)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--v-volt)', transition: 'width 300ms cubic-bezier(0.23, 1, 0.32, 1)' }} />
            </div>
          </div>
        </VoltBlock>

        {/* Exercises */}
        {session.exs.map((ex, ei) => {
          const focusType = ex.repsRange === '1-5' ? 'Strength' : (ex.repsRange === '15-20' || ex.repsRange === '12+') ? 'Endurance' : 'Hypertrophy';
          const actionBtn = (danger) => ({
            minWidth: 52, minHeight: 48, padding: '6px 8px', borderRadius: 11, cursor: 'pointer',
            background: 'var(--v-panel)', color: danger ? 'var(--v-coral-text)' : 'var(--v-dim)',
            border: danger ? '2.5px solid var(--v-coral)' : '2px solid var(--v-edge-quiet)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0,
          });
          const actionLabel = { fontSize: 8.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" };

          return (
            <VoltBlock key={ex.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.12 }}>{ex.sv || ex.name}</h3>
                  {ex.variants && (
                    <select value={ex.sv || ex.variants[0]} onChange={e => setV(ei, e.target.value)} style={{ ...voltSelectStyle, marginTop: 8 }} aria-label={`Variant for ${ex.name}`}>
                      {ex.variants.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  )}
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '8px 0 0' }}>
                    {ex.muscle || 'Full Body'} • {focusType}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    type="button"
                    className="v-press"
                    onClick={() => setSwapTarget({ exerciseIndex: ei, name: ex.sv || ex.name, originalName: ex._originalName || ex.originalName || ex.name })}
                    aria-label={`Swap ${ex.name}`}
                    style={actionBtn(false)}
                  >
                    <ArrowRightLeft size={16} />
                    <span style={actionLabel}>Swap</span>
                  </button>
                  <button
                    type="button"
                    className="v-press"
                    onClick={() => {
                      if (confirmRemoveIdx === ei) removeExercise(ei);
                      else setConfirmRemoveIdx(ei);
                    }}
                    aria-label="Remove exercise"
                    style={actionBtn(confirmRemoveIdx === ei)}
                  >
                    <Trash2 size={16} />
                    <span style={actionLabel}>{confirmRemoveIdx === ei ? 'Confirm' : 'Delete'}</span>
                  </button>
                </div>
              </div>

              {/* Previous session reference (cross-split lookup, same as V1) */}
              {(() => {
                const exName = ex.sv || ex.name;
                const allNames = [exName, ...(ex.variants || [])];
                const sorted = [...workoutLogs]
                  .filter(l => l.userId === user.id)
                  .sort((a, b) => new Date(b.date) - new Date(a.date));
                let prevLog = null;
                let pe = null;
                for (const log of sorted) {
                  for (const logEx of (log.exercises || [])) {
                    if (allNames.some(n => n.toLowerCase() === logEx.name.toLowerCase())) {
                      prevLog = log;
                      pe = logEx;
                      break;
                    }
                  }
                  if (pe) break;
                }
                if (!pe?.sets?.length) return null;
                const displaySets = pe.sets.slice(0, 3);
                return (
                  <div style={{ padding: '7px 12px', marginBottom: 12, borderLeft: '3px solid var(--v-volt)', background: 'var(--v-canvas)', borderRadius: '0 10px 10px 0', fontSize: 11.5, display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: 'var(--v-dim)', fontWeight: 700 }}>PREV ({fmt(prevLog.date)}):</span>
                    {displaySets.map((s, i) => (
                      <span key={i}>{s.reps}r × {s.weight}kg{i < displaySets.length - 1 ? ',' : ''}</span>
                    ))}
                    {pe.sets.length > 3 && <span style={{ color: 'var(--v-dim)' }}>+{pe.sets.length - 3} more</span>}
                  </div>
                );
              })()}

              {/* Set grid header */}
              <div style={{ display: 'grid', gridTemplateColumns: '42px 1fr 1fr 100px', gap: 8, padding: '0 12px', marginBottom: 7 }}>
                {['SET', 'REPS', 'KG', 'DONE'].map((h, i) => (
                  <div key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--v-dim)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: i === 3 ? 'right' : i === 0 ? 'center' : 'left' }}>{h}</div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ex.sets.map((s, si) => {
                  const exName = ex.sv || ex.name;
                  const pr = prMap[exName] ?? null;
                  const isPR = s.done && beatsAllTimePR(pr, parseFloat(s.weight) || 0, parseFloat(s.reps) || 0);

                  return (
                    <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {restActive && restTimerPosition?.ei === ei && restTimerPosition?.si === si && (
                        <VoltRestTimer secondsLeft={restSecondsLeft} totalDuration={restDuration} onSkip={skipRestTimer} onExtend={extendRestTimer} />
                      )}
                      <div
                        style={{
                          display: 'grid', gridTemplateColumns: '42px 1fr 1fr 100px', gap: 8, alignItems: 'center',
                          padding: '10px 12px', borderRadius: 13,
                          border: isPR ? '2.5px solid var(--v-volt)' : '2px solid var(--v-edge-quiet)',
                          background: 'var(--v-panel)',
                          opacity: s.done && !isPR ? 0.68 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isPR ? (
                            <span style={{ background: 'var(--v-volt)', color: '#141416', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 6, transform: 'rotate(-3deg)', border: '1.5px solid var(--v-edge)' }} title="Personal Record">PR</span>
                          ) : (
                            <span className="v-num" style={{ fontSize: 15 }}>{si + 1}</span>
                          )}
                        </div>
                        <div>
                          <input type="number" placeholder={s.targetRep} value={s.reps} onChange={e => upd(ei, si, 'reps', e.target.value)} style={voltInputStyle} aria-label={`Set ${si + 1} reps`} />
                        </div>
                        <div>
                          <input type="number" step=".5" placeholder="--" value={s.weight} onChange={e => upd(ei, si, 'weight', e.target.value)} style={voltInputStyle} aria-label={`Set ${si + 1} weight in kg`} />
                        </div>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="v-press"
                            onClick={() => upd(ei, si, 'done', !s.done)}
                            aria-label={s.done ? `Set ${si + 1} done` : `Mark set ${si + 1} done`}
                            style={{
                              width: 48, height: 46, borderRadius: 11, cursor: 'pointer',
                              background: s.done ? 'var(--v-volt)' : 'var(--v-panel)',
                              color: s.done ? '#141416' : 'var(--v-dim)',
                              border: '2.5px solid var(--v-edge)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <Check size={19} strokeWidth={s.done ? 3.2 : 2} />
                          </button>
                          {ex.sets.length > 1 && (
                            <button type="button" onClick={() => rmS(ei, si)} aria-label="Remove set" style={{ width: 44, height: 46, background: 'transparent', border: 'none', borderRadius: 8, color: 'var(--v-dim)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove set"><X size={13} /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="v-press"
                onClick={() => addS(ei)}
                style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--v-volt-text)', padding: '6px 2px' }}
              >
                + ADD SET
              </button>
              {ex.notes && <div style={{ fontSize: 11.5, color: 'var(--v-dim)', marginTop: 6, fontStyle: 'italic' }}>{ex.notes}</div>}
            </VoltBlock>
          );
        })}

        {/* Add exercise */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="v-press"
            onClick={() => {
              setAddExSearch('');
              setAddExCat('all');
              setShowAddEx(true);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '14px 26px', borderRadius: 999, cursor: 'pointer',
              border: '2.5px dashed var(--v-edge)', background: 'var(--v-panel)', color: 'var(--v-volt-text)',
              fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
            }}
          >
            <Plus size={18} strokeWidth={3} />
            Add Exercise
          </button>
        </div>

        {/* Session notes */}
        {session.notes !== undefined && (
          <VoltBlock quiet>
            <VoltLabel>Session Notes</VoltLabel>
            <textarea
              rows={2}
              placeholder="PRs, form notes, how it felt..."
              value={session.notes}
              onChange={e => setSession(p => ({ ...p, notes: e.target.value }))}
              style={{ resize: 'vertical', width: '100%', background: 'var(--v-canvas)', padding: 12, borderRadius: 12, border: '2px solid var(--v-edge-quiet)', color: 'var(--v-ink)', fontSize: 13.5, fontFamily: "'Archivo', sans-serif", marginTop: 10, boxSizing: 'border-box' }}
            />
          </VoltBlock>
        )}

        {/* Finish / discard */}
        <section ref={finishBtnRef} style={{ paddingTop: 6, paddingBottom: 56 }}>
          <VoltPill onClick={finish} style={{ width: '100%', minHeight: 60, fontSize: 16.5 }}>Finish Workout</VoltPill>
          <button
            type="button"
            onClick={() => {
              clearPersistedSession();
              startTimeRef.current = null;
              setElapsed(0);
              setSession(null); skipRestTimer();
              setTimeout(() => window.scrollTo({ top: workoutPageCache.trackerScroll || 0, behavior: 'instant' }), 0);
            }}
            style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', padding: 12, cursor: 'pointer', fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--v-coral-text)' }}
          >
            Discard Workout
          </button>
        </section>

        {/* Floating live cluster */}
        <Portal>
          <div style={{ position: 'fixed', bottom: 88, left: 16, zIndex: 9998, display: showAddEx ? 'none' : 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            {showFAB && (
              <button
                type="button"
                className="v-press"
                onClick={finish}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--v-volt)', color: '#141416', padding: '10px 16px', borderRadius: 999, border: '2.5px solid var(--v-edge)', boxShadow: '3px 3px 0 var(--v-shadow)', cursor: 'pointer', fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 12.5 }}
              >
                <Check size={13} strokeWidth={3.2} /> Finish Workout
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--v-panel)', padding: '8px 14px', borderRadius: 999, border: '2px solid var(--v-edge)', boxShadow: '3px 3px 0 var(--v-shadow)' }}>
              <span className="v-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--v-volt)', flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', color: 'var(--v-dim)' }}>LIVE</span>
              <span className="v-num" style={{ fontSize: 13.5, color: 'var(--v-volt-text)' }}>{fmtElapsed(elapsed)}</span>
            </div>
          </div>
        </Portal>

        <VoltConfirmDialog
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
            <VoltSwapModal
              exerciseName={swapTarget.name}
              originalName={swapTarget.originalName}
              onSwap={(newName) => swapExercise(swapTarget.exerciseIndex, newName)}
              onClose={() => setSwapTarget(null)}
            />
          </Portal>
        )}

        <VoltAddExerciseSheet
          show={showAddEx}
          onClose={() => setShowAddEx(false)}
          onAdd={addExercise}
          session={session}
          searchQuery={addExSearch}
          setSearchQuery={setAddExSearch}
          category={addExCat}
          setCategory={setAddExCat}
          exercisePool={exercisePool}
        />
      </div>
    );
  }

  // ─── Setup branch: pick a day ──────────────────────────────────────────────
  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <VoltLabel volt>{activeSplit ? activeSplit.name : 'Workout Tracker'}</VoltLabel>
            <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Workout Tracker</h1>
          </div>
          {!session && (
            <input
              type="date"
              value={pastDate}
              max={tod()}
              onChange={e => setPastDate(e.target.value)}
              aria-label="Log for date"
              style={{ padding: '8px 10px', borderRadius: 10, border: '2px solid var(--v-edge)', background: 'var(--v-panel)', color: 'var(--v-ink)', fontSize: 12.5, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}
            />
          )}
        </div>
      </header>

      {!activeSplit ? (
        <VoltBlock style={{ textAlign: 'center', padding: 30 }}>
          <Trophy size={34} color="var(--v-dim)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 17, fontWeight: 900 }}>No Split Selected</div>
          <p style={{ color: 'var(--v-dim)', fontSize: 13.5, margin: '7px auto 16px', maxWidth: 280, lineHeight: 1.55 }}>Go to Splits to select a workout program first.</p>
          <VoltPill onClick={() => nav('/splits')}>Go to Splits</VoltPill>
        </VoltBlock>
      ) : (
        <>
          {persistedSession && !session && (() => {
            const exerciseCount = persistedSession.exs?.length || 0;
            const completedSets = persistedSession.exs?.flatMap(e => e.sets).filter(s => s.done).length || 0;
            const timeAgo = formatTimeAgo(persistedSession.startTime);
            const hoursAgo = Math.floor((nowTs - persistedSession.startTime) / 3600000);

            return (
              <VoltBlock hero className="v-rise">
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--v-coral-text)', textTransform: 'uppercase' }}>
                  <AlertTriangle size={12} style={{ verticalAlign: '-2px' }} /> Session from {hoursAgo}h ago
                </div>
                <div style={{ fontSize: 17.5, fontWeight: 900, marginTop: 8 }}>
                  {persistedSession.day?.name} • {activeSplit.name}
                </div>
                <div style={{ color: 'var(--v-dim)', fontSize: 13, marginTop: 4 }}>
                  Started {timeAgo} • {exerciseCount} exercises • {completedSets} sets done
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                  <VoltPill
                    onClick={() => {
                      setSession(persistedSession);
                      startTimeRef.current = persistedSession.startTime;
                      setPersistedSession(null);
                    }}
                    style={{ minHeight: 50 }}
                  >
                    Resume Session
                  </VoltPill>
                  <button
                    type="button"
                    onClick={() => setConfirmDiscard(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--v-coral-text)', cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace", minHeight: 44 }}
                  >
                    Discard
                  </button>
                </div>
                <VoltConfirmDialog
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
              </VoltBlock>
            );
          })()}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: 14 }}>
            {wDays.map(day => {
              const last = workoutLogs.filter(l => l.userId === user.id && l.dayId === day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
              return (
                <VoltBlock key={day.id} className="v-rise">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                    <VoltChip>{(day.subtype || day.type).toUpperCase()}</VoltChip>
                    {last && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)' }}>LAST {fmt(last.date).toUpperCase()}</span>}
                  </div>
                  <div style={{ fontSize: 20.5, fontWeight: 900, letterSpacing: '-0.01em', marginBottom: 11 }}>{day.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {day.exercises.slice(0, 4).map(ex => (
                      <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12.5, padding: '7px 10px', border: '2px solid var(--v-edge-quiet)', borderRadius: 9 }}>
                        <span style={{ fontWeight: 600 }}>{ex.name}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--v-dim)', flexShrink: 0 }}>{ex.sets}×{ex.repsRange}</span>
                      </div>
                    ))}
                  </div>
                  {day.exercises.length > 4 && (
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)', marginTop: 9 }}>+{day.exercises.length - 4} MORE</div>
                  )}
                  <VoltPill onClick={() => start(day)} style={{ width: '100%', marginTop: 13, minHeight: 50 }}>Start Session →</VoltPill>
                </VoltBlock>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
