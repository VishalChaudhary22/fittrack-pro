import { useState, useEffect, useRef, useMemo } from 'react';
import { beatsAllTimePR, getLastSessionSets, exerciseNamePool } from '../../../utils/exerciseHistory';
import { Portal } from '../../v1/shared/SharedComponents';
import PixelBodyMap from '../PixelBodyMap';
import { gId, tod, fmt, formatTimeAgo } from '../../../utils/helpers';
import { calcAllMuscleXP } from '../../../data/muscleData';
import { syncUserXPToCache } from '../../../utils/xpCacheSync';
import { EXERCISE_LIBRARY } from '../../../data/exerciseLibrary';
import { EXERCISE_ALTERNATIVES } from '../../../data/exerciseAlternatives';
import { canonicalExerciseName } from '../../../data/exerciseAliases';
import { useScrollRestoration } from '../../../core/hooks/useScrollRestoration';
import { useWorkoutSession } from '../../../core/hooks/useWorkoutSession';
import { clearPersistedSession, workoutPageCache } from '../../../core/services/workoutSession';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel, SegBar } from '../primitives';
import { questSound } from '../sound';
import PixelSprite from '../PixelSprite';
import { FighterSprite, useFighter } from '../fighters';
import { QuestConfirmDialog } from '../shared/QuestShared';

// ─── Kaaya Quest · Workout — the battle screen (Q-3, plan §7.2) ─────────────
// Same session machine as V1/Volt (useWorkoutSession), Quest presentation:
// the current exercise is the boss mob (your fighter faces it), sets are
// struck with HIT!, cleared encounters strike through, a battle log
// narrates the session's own events, and FINISH BATTLE pays out on the
// QUEST COMPLETE results screen — XP counted in hard steps, PRs as
// medals. Set XP is real: the same calcAllMuscleXP the results screen
// uses, run live over the sets cleared so far.

// ─── YOGA / BREATHWORK (logic carried from the V1/Volt views) ───────────────
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

function QuestYogaView({ day, onBack, onComplete }) {
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
    return { id: 'day_flow', name: "Today's Yoga Flow", poses, durations, durationPerPose: 0 };
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

  return (
    <div className="q-screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h1 className="q-ps" style={{ fontSize: 17, margin: 0, textTransform: 'uppercase', lineHeight: 1.4 }}>{day.name}</h1>
        <QuestBtn sm tone="ghost" onClick={onBack}>Back</QuestBtn>
      </div>

      {activeSession ? (
        <QuestBlock variant="panel2" style={{ textAlign: 'center', padding: 26 }}>
          <QuestLabel tone="volt">{activeSession.name}</QuestLabel>
          {currentSanskrit && <div className="q-meta" style={{ marginTop: 10 }}>{currentSanskrit}</div>}
          <div className="q-ps" style={{ fontSize: 19, lineHeight: 1.5, margin: '8px 0 4px' }}>{currentEnglish}</div>
          <div className="q-meta">POSE {poseIndex + 1} OF {activeSession.poses.length}</div>
          <div className="q-ps" style={{ fontSize: 46, margin: '18px 0 12px' }}>{timeLeft}</div>
          <SegBar value={1 - timeLeft / Math.max(1, currentPoseDuration)} tone="sky" segments={12} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22 }}>
            <QuestBtn onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</QuestBtn>
            <QuestBtn tone="ghost" onClick={() => { completedNaturallyRef.current = false; endSession(); }}>Stop</QuestBtn>
          </div>
        </QuestBlock>
      ) : (
        <>
          {dayFlowPreset && (
            <QuestBlock variant="panel2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span className="q-ps" style={{ fontSize: 13 }}>TODAY&apos;S YOGA FLOW</span>
                <span className="q-meta">{dayFlowPreset.poses.length} POSES · {(totalFlowDuration / 60).toFixed(1)} MIN</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0' }}>
                {day.exercises.slice(0, 5).map((ex, i) => {
                  const dur = dayFlowPreset.durations[i];
                  const mins = Math.floor(dur / 60);
                  const secs = dur % 60;
                  const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
                  return (
                    <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, background: 'var(--q-slot)', border: '3px solid var(--q-border)', padding: '8px 10px', fontSize: 18 }}>
                      <span>{ex.name}{ex.sets > 1 ? ` × ${ex.sets}` : ''}</span>
                      <span className="q-meta">{timeStr}</span>
                    </div>
                  );
                })}
                {day.exercises.length > 5 && <div className="q-meta">+{day.exercises.length - 5} MORE</div>}
              </div>
              <QuestBtn onClick={() => startSession(dayFlowPreset)} style={{ width: '100%' }}>Start Flow</QuestBtn>
            </QuestBlock>
          )}

          <QuestBlock>
            <QuestLabel>Quick Sessions</QuestLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {YOGA_PRESETS.map(p => (
                <button key={p.id} type="button" className="q-sheet-row" onClick={() => startSession(p)}>
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span className="q-meta">{(p.poses.length * p.durationPerPose / 60).toFixed(1)} MIN</span>
                </button>
              ))}
            </div>
          </QuestBlock>

          <QuestBlock flat style={{ textAlign: 'center' }}>
            <QuestLabel tone="sky">Box Breathing</QuestLabel>
            <p className="q-meta" style={{ margin: '8px 0 16px', fontSize: 18 }}>4s inhale · 4s hold · 4s exhale · 4s hold</p>
            {breathPhase !== 'idle' ? (
              <>
                <div className="q-ps" style={{ fontSize: 15, color: 'var(--q-sky)', textTransform: 'uppercase' }}>{breathPhase.replace('_', ' ')}</div>
                <div className="q-ps" style={{ fontSize: 40, margin: '8px 0 14px' }}>{breathTimer}</div>
                <QuestBtn sm tone="ghost" onClick={() => setBreathPhase('idle')}>Stop</QuestBtn>
              </>
            ) : (
              <QuestBtn onClick={startBreathing}>Start Session</QuestBtn>
            )}
          </QuestBlock>
        </>
      )}
    </div>
  );
}

// ─── Rest timer — the recharge bar ───────────────────────────────────────────
function QuestRestTimer({ secondsLeft, totalDuration, onSkip, onExtend }) {
  // The bar's total is the longest clock this rest has shown: the set
  // duration, raised whenever +30s pushes the remaining time above it.
  // Tracking totalDuration alone pinned the bar full after an extension
  // until the clock fell back under the original duration.
  const [maxObserved, setMaxObserved] = useState(totalDuration || 90);
  useEffect(() => {
    const peak = Math.max(totalDuration || 0, secondsLeft || 0);
    if (peak > maxObserved) setMaxObserved(peak);
  }, [totalDuration, secondsLeft, maxObserved]);
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  return (
    <QuestBlock variant="panel2" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <QuestLabel tone="sky">Recharging</QuestLabel>
        <span className="q-ps" style={{ fontSize: 20 }}>
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
      <SegBar value={maxObserved > 0 ? secondsLeft / maxObserved : 0} tone="sky" segments={12} style={{ margin: '12px 0 14px' }} />
      <div style={{ display: 'flex', gap: 10 }}>
        <QuestBtn sm tone="ghost" onClick={() => onExtend(30)}>+30s</QuestBtn>
        <QuestBtn sm onClick={onSkip}>Skip</QuestBtn>
      </div>
    </QuestBlock>
  );
}

// ─── Swap modal (alternatives logic identical to V1/Volt) ────────────────────
function QuestSwapModal({ exerciseName, originalName, onSwap, onClose }) {
  const targetName = originalName || exerciseName;
  const lookupName = canonicalExerciseName(targetName);
  const libEntry = EXERCISE_LIBRARY.find(ex => ex.name === lookupName);
  let alternatives = [];

  if (libEntry && libEntry.muscle) {
    const sameMuscleExercises = EXERCISE_LIBRARY.filter(ex => ex.muscle === libEntry.muscle);
    const allOptions = new Set();
    sameMuscleExercises.forEach(ex => {
      allOptions.add(ex.name);
      const alts = EXERCISE_ALTERNATIVES[ex.name] || [];
      alts.forEach(alt => allOptions.add(alt));
    });
    const baseAlternatives = EXERCISE_ALTERNATIVES[lookupName] || [];
    baseAlternatives.forEach(alt => allOptions.add(alt));
    alternatives = Array.from(allOptions);
  } else {
    const baseAlternatives = EXERCISE_ALTERNATIVES[lookupName] || [];
    alternatives = [...baseAlternatives];
  }

  const isSwapped = originalName && originalName !== exerciseName;
  if (isSwapped && !alternatives.includes(originalName)) {
    alternatives.unshift(originalName);
  }
  const seenCanon = new Set();
  alternatives = alternatives.filter(a => {
    if (a === exerciseName) return false;
    if (originalName && a === originalName) return true; // swap-back entry
    const c = canonicalExerciseName(a);
    if (c === canonicalExerciseName(exerciseName) || seenCanon.has(c)) return false;
    seenCanon.add(c);
    return true;
  });
  alternatives.sort((a, b) => a.localeCompare(b));

  return (
    <div className="q-sheet-wrap" onClick={onClose}>
      <div className="q-sheet" role="dialog" aria-label={`Swap ${exerciseName}`} onClick={e => e.stopPropagation()}>
        <QuestLabel tone="volt">Swap Fighter Move</QuestLabel>
        <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.5, margin: '8px 0 14px' }}>{exerciseName}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <button type="button" className="q-sheet-row" onClick={onClose}>
            <span style={{ flex: 1 }}>Keep current</span>
            <span className="q-meta">CURRENT</span>
          </button>
          {alternatives.length === 0 ? (
            <div className="q-meta" style={{ textAlign: 'center', padding: '14px 0', fontSize: 18 }}>
              No swap options available for this exercise
            </div>
          ) : alternatives.map(alt => {
            const isOriginal = isSwapped && alt === originalName;
            return (
              <button key={alt} type="button" className={`q-sheet-row${isOriginal ? ' q-sheet-row--active' : ''}`} onClick={() => { onSwap(alt); onClose(); }}>
                <span style={{ flex: 1 }}>{alt}</span>
                <span className="q-meta">{isOriginal ? 'ORIGINAL' : 'SWAP'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Add-exercise sheet (pool filtering identical to V1/Volt) ────────────────
const MUSCLE_DISPLAY_ORDER = [
  'Chest', 'Back', 'Shoulders', 'Rear Delts', 'Legs', 'Quads', 'Hamstrings', 'Glutes', 'Calves',
  'Abductors', 'Adductors', 'Biceps', 'Triceps', 'Arms', 'Core', 'Full Body'
];
const getSortIndex = (muscle) => {
  const index = MUSCLE_DISPLAY_ORDER.indexOf(muscle);
  return index === -1 ? 999 : index;
};

function QuestAddExerciseSheet({ show, onClose, onAdd, session, searchQuery, setSearchQuery, category, setCategory, exercisePool }) {
  if (!show) return null;

  const filteredPool = exercisePool.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = category === 'all' || ex.muscle === category;
    return matchesSearch && matchesCat;
  });
  const categories = ['all', ...Array.from(new Set(exercisePool.map(ex => ex.muscle))).sort((a, b) => getSortIndex(a) - getSortIndex(b))];

  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onClose}>
        <div
          className="q-sheet"
          role="dialog"
          aria-label="Add exercise"
          onClick={e => e.stopPropagation()}
          style={{ height: '88dvh', maxHeight: '88dvh', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span className="q-ps" style={{ fontSize: 15 }}>ADD MOVE</span>
            <button type="button" className="q-chip" onClick={onClose} style={{ cursor: 'pointer' }} aria-label="Close"><PixelSprite name="x" size={11} /></button>
          </div>
          <input
            type="text"
            className="q-slot-input"
            placeholder="Search moves..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ textAlign: 'left', marginTop: 14, paddingLeft: 12 }}
          />
          <div style={{ display: 'flex', overflowX: 'auto', gap: 8, padding: '12px 0 4px', scrollbarWidth: 'none', flexShrink: 0 }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`q-chip${category === cat ? ' q-chip--volt' : ''}`}
                onClick={() => setCategory(cat)}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', marginTop: 10 }}>
            {filteredPool.length === 0 ? (
              <div className="q-meta" style={{ textAlign: 'center', padding: '34px 0', fontSize: 19 }}>No moves found.</div>
            ) : filteredPool.map(ex => {
              const alreadyAdded = session?.exs?.some(e =>
                e.name === ex.name || e._originalName === ex.name || e.originalName === ex.name
              );
              return (
                <div key={ex.id || ex.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--q-panel2)', border: '3px solid var(--q-border)', padding: '10px 12px', marginBottom: 9 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 20, lineHeight: 1.25 }}>{ex.name}</div>
                    <div className="q-meta" style={{ fontSize: 15 }}>
                      <span style={{ color: 'var(--q-volt-text)' }}>{ex.muscle.toUpperCase()}</span>
                      {ex.repsRange ? ` · ${ex.repsRange}` : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="q-btn q-btn--sm"
                    onClick={() => !alreadyAdded && onAdd(ex)}
                    disabled={alreadyAdded}
                    aria-label={alreadyAdded ? `${ex.name} already added` : `Add ${ex.name}`}
                    style={alreadyAdded ? { opacity: 0.45, cursor: 'default' } : undefined}
                  >
                    {alreadyAdded ? <PixelSprite name="check" size={13} /> : <PixelSprite name="plus" size={13} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Results — QUEST COMPLETE (§7.2) ─────────────────────────────────────────
function useStepCount(target, ticks = 16, ms = 45) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return undefined;
    }
    let t = 0;
    const iv = setInterval(() => {
      t += 1;
      setVal(Math.round(target * (t / ticks)));
      if (t >= ticks) clearInterval(iv);
    }, ms);
    return () => clearInterval(iv);
  }, [target, ticks, ms]);
  return val;
}

function QuestResults({ done, splits, user, onLogAnother, onDone, onViewMap }) {
  useEffect(() => { questSound('levelup'); }, []);
  const sessionXP = calcAllMuscleXP([done], splits, user);
  const totalXP = Object.values(sessionXP).reduce((a, b) => a + b, 0);
  const totalSets = done.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalVol = done.exercises.reduce((acc, ex) => acc + ex.sets.reduce((sAcc, s) => sAcc + s.reps * s.weight, 0), 0);
  const shownXP = useStepCount(Math.round(totalXP));

  // The finished log carries each exercise's own muscle fields (doFinish
  // copies them off the session), so the summary map reads the log itself —
  // never the live session, whose exercises can belong to another day.
  const sessionPrimaryMuscles = [...new Set(
    done.exercises.map(ex => ex.primaryMuscle || ex.muscle?.toLowerCase()).filter(Boolean)
  )];
  const sessionSecondaryMuscles = [...new Set(
    done.exercises.flatMap(ex => ex.secondaryMuscles || [])
  )].filter(m => !sessionPrimaryMuscles.includes(m));
  // PixelBodyMap states: primaries get the pulsing 'today' volt, secondaries
  // the dimmer 'week' volt-dk — the 8-bit twin of the old primary/secondary
  // highlight split.
  const sessionStates = {};
  sessionSecondaryMuscles.forEach(m => { sessionStates[m] = 'week'; });
  sessionPrimaryMuscles.forEach(m => { sessionStates[m] = 'today'; });

  return (
    <div className="q-screen">
      <div style={{ textAlign: 'center', paddingTop: 6 }}>
        <PixelSprite name="trophy" size={46} style={{ margin: '0 auto' }} />
        <div className="q-ps" style={{ fontSize: 21, lineHeight: 1.5, marginTop: 10 }}>QUEST<br />COMPLETE</div>
        <p className="q-meta" style={{ margin: '8px 0 0', fontSize: 19 }}>Great job crushing your session today.</p>
      </div>

      <QuestBlock variant="panel2" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 84 }}>
            <div className="q-ps" style={{ fontSize: 21, color: 'var(--q-volt-text)' }}>+{shownXP.toLocaleString()}</div>
            <div className="q-meta" style={{ marginTop: 5 }}>XP GAINED</div>
          </div>
          <div style={{ minWidth: 70 }}>
            <div className="q-ps" style={{ fontSize: 21 }}>{totalSets}</div>
            <div className="q-meta" style={{ marginTop: 5 }}>SETS</div>
          </div>
          <div style={{ minWidth: 84 }}>
            <div className="q-ps" style={{ fontSize: 21 }}>{Math.round(totalVol).toLocaleString()}</div>
            <div className="q-meta" style={{ marginTop: 5 }}>KG VOL</div>
          </div>
        </div>
        <div style={{ maxWidth: 230, margin: '18px auto 0', border: '3px solid var(--q-border)', padding: 10 }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {['front', 'back'].map(side => (
              <div key={side} style={{ textAlign: 'center' }}>
                <div className="q-meta" style={{ fontSize: 14, letterSpacing: 2, marginBottom: 6 }}>{side.toUpperCase()}</div>
                <PixelBodyMap side={side} states={sessionStates} width={98} />
              </div>
            ))}
          </div>
        </div>
      </QuestBlock>

      {done._newPRs && done._newPRs.length > 0 && (
        <QuestBlock>
          <QuestLabel tone="gold">New Records</QuestLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
            {done._newPRs.map((pr, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'var(--q-panel2)', border: '3px solid var(--q-border)', padding: '10px 12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 19 }}>
                  <PixelSprite name="trophy" size={17} /> {pr.name}
                </span>
                <span style={{ textAlign: 'right' }}>
                  <span className="q-ps" style={{ fontSize: 12, color: 'var(--q-gold-text)' }}>
                    {pr.isBodyweight ? `${pr.newReps} REPS` : `${pr.newWeight}KG × ${pr.newReps}`}
                  </span>
                  {pr.oldWeight !== null && (
                    <span className="q-meta" style={{ display: 'block', fontSize: 15 }}>
                      was {pr.oldWeight === 0 ? `${pr.oldReps} reps` : `${pr.oldWeight}kg`}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </QuestBlock>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <QuestBtn onClick={onDone} style={{ width: '100%' }}>Done</QuestBtn>
        <div style={{ display: 'flex', gap: 10 }}>
          <QuestBtn tone="ghost" onClick={onLogAnother} style={{ flex: 1 }}>Log Another</QuestBtn>
          <QuestBtn tone="ghost" onClick={onViewMap} style={{ flex: 1 }}>Arena</QuestBtn>
        </div>
      </div>
    </div>
  );
}

// ─── The battle screen ───────────────────────────────────────────────────────
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
  const { fighter } = useFighter();

  // ── Battle log + XP floaters, derived from the session's own events ──
  const [logEntries, setLogEntries] = useState([]);
  const [floater, setFloater] = useState(null);
  const prevRef = useRef(null);
  const floaterTimer = useRef(null);

  const liveXP = useMemo(() => {
    if (!session || session.isYoga) return 0;
    const pseudo = {
      id: 'live', userId: user?.id, date: pastDate,
      exercises: session.exs.map(ex => ({
        name: ex.sv || ex.name,
        sets: ex.sets.filter(s => s.done).map(s => ({ reps: parseFloat(s.reps) || 0, weight: parseFloat(s.weight) || 0 })),
      })).filter(ex => ex.sets.length > 0),
    };
    if (pseudo.exercises.length === 0) return 0;
    const xpMap = calcAllMuscleXP([pseudo], splits, user);
    return Math.round(Object.values(xpMap).reduce((a, b) => a + b, 0));
  }, [session, splits, user, pastDate]);

  useEffect(() => {
    if (!session || session.isYoga) { prevRef.current = null; return; }
    const flags = new Map();
    const cleared = new Set();
    session.exs.forEach((ex, ei) => {
      let allDone = ex.sets.length > 0;
      ex.sets.forEach((s, si) => {
        flags.set(`${ei}-${si}`, !!s.done);
        if (!s.done) allDone = false;
      });
      if (allDone) cleared.add(ei);
    });
    const prev = prevRef.current;
    if (!prev || prev.startTime !== session.startTime) {
      setLogEntries([{ id: 'start', text: `BATTLE START — ${session.day.name.toUpperCase()}`, tone: 'volt' }]);
      prevRef.current = { startTime: session.startTime, flags, cleared, xp: liveXP };
      return;
    }
    const fresh = [];
    session.exs.forEach((ex, ei) => {
      const name = ex.sv || ex.name;
      ex.sets.forEach((s, si) => {
        const k = `${ei}-${si}`;
        if (flags.get(k) && !prev.flags.get(k)) {
          const w = parseFloat(s.weight) || 0;
          const r = parseFloat(s.reps) || 0;
          fresh.push({
            id: `${k}-${Date.now()}`,
            text: `SET CLEARED — ${name.toUpperCase()} ${w ? `${w}KG × ${r}` : `${r || s.targetRep || ''} REPS`}`,
          });
          const pr = prMap[name] ?? null;
          if (beatsAllTimePR(pr, w, r)) {
            fresh.push({ id: `pr-${k}-${Date.now()}`, text: `NEW PR — ${name.toUpperCase()} ${w ? `${w}KG × ${r}` : `${r} REPS`}!`, tone: 'gold' });
          }
          const delta = liveXP - prev.xp;
          if (delta > 0) {
            setFloater({ ei, si, xp: delta, key: Date.now() });
            clearTimeout(floaterTimer.current);
            floaterTimer.current = setTimeout(() => setFloater(null), 950);
          }
        }
      });
      if (cleared.has(ei) && !prev.cleared.has(ei)) {
        fresh.push({ id: `clr-${ei}-${Date.now()}`, text: `CLEARED — ${name.toUpperCase()}`, tone: 'volt' });
      }
    });
    if (fresh.length) setLogEntries(p => [...p, ...fresh].slice(-6));
    prevRef.current = { startTime: session.startTime, flags, cleared, xp: liveXP };
  }, [session, liveXP, prMap]);

  if (done) {
    return (
      <QuestResults
        done={done}
        splits={splits}
        user={user}
        onDone={() => { setSession(null); setDone(null); nav('/'); }}
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
        <QuestYogaView
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

    const allSets = session.exs.flatMap(e => e.sets);
    const pct = Math.round((allSets.filter(s => s.done).length / allSets.length) * 100) || 0;
    const bossEi = session.exs.findIndex(ex => ex.sets.some(s => !s.done));

    return (
      <div className="q-screen">
        {/* Battle header */}
        <QuestBlock flat style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="q-blink" style={{ width: 9, height: 9, background: 'var(--q-volt)', flexShrink: 0 }} />
            <span className="q-ps" style={{ fontSize: 11 }}>IN BATTLE · {session.day.name.toUpperCase()}</span>
            <span className="q-ps" style={{ fontSize: 11, color: 'var(--q-volt-text)', marginLeft: 'auto' }}>{pct}%</span>
            <span className="q-meta">{fmtElapsed(elapsed)}</span>
          </div>
          <SegBar value={pct / 100} segments={12} style={{ marginTop: 12 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12 }}>
            <span className="q-meta">REST TIMER</span>
            <select
              value={restDuration}
              onChange={e => handleRestDurationChange(parseInt(e.target.value))}
              aria-label="Rest duration"
              className="q-slot-input"
              style={{ width: 'auto', minHeight: 38, fontSize: 19, padding: '2px 8px' }}
            >
              {[30, 60, 90, 120, 180, 300].map(s => <option key={s} value={s}>{s < 60 ? `${s}s` : `${s / 60}m`}</option>)}
            </select>
            <span className="q-meta" style={{ marginLeft: 'auto' }}>SESSION XP <span style={{ color: 'var(--q-gold-text)' }}>+{liveXP}</span></span>
          </div>
        </QuestBlock>

        {/* Battle log */}
        {logEntries.length > 0 && (
          <QuestBlock flat style={{ padding: '12px 14px' }}>
            <QuestLabel>Battle Log</QuestLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8 }}>
              {logEntries.map(e => (
                <div key={e.id} style={{ fontSize: 18, lineHeight: 1.3, color: e.tone === 'gold' ? 'var(--q-gold-text)' : e.tone === 'volt' ? 'var(--q-volt-text)' : 'var(--q-ink)' }}>
                  {e.text}
                </div>
              ))}
            </div>
          </QuestBlock>
        )}

        {/* Encounters */}
        {session.exs.map((ex, ei) => {
          const focusType = ex.repsRange === '1-5' ? 'Strength' : (ex.repsRange === '15-20' || ex.repsRange === '12+') ? 'Endurance' : 'Hypertrophy';
          const cleared = ex.sets.length > 0 && ex.sets.every(s => s.done);
          const isBoss = ei === bossEi;

          return (
            <QuestBlock key={ex.id} variant={isBoss ? 'panel2' : undefined} style={cleared ? { opacity: 0.82 } : undefined}>
              {isBoss && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '3px solid var(--q-volt-dk)', padding: '8px 10px', marginBottom: 14 }}>
                  <FighterSprite fighter={fighter} state="flex" size={64} />
                  <div>
                    <QuestChip tone="gold">Current Boss</QuestChip>
                    <div className="q-meta" style={{ marginTop: 5 }}>Clear every set to advance</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="q-ps" style={{ fontSize: 15, lineHeight: 1.5, margin: 0, textTransform: 'uppercase' }}>
                    <span className={cleared ? 'q-struck' : undefined}>{ex.sv || ex.name}</span>
                  </h3>
                  {ex.variants && (
                    <select value={ex.sv || ex.variants[0]} onChange={e => setV(ei, e.target.value)} aria-label={`Variant for ${ex.name}`} className="q-slot-input" style={{ width: 'auto', minHeight: 38, fontSize: 19, padding: '2px 8px', marginTop: 9 }}>
                      {ex.variants.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  )}
                  <p className="q-meta" style={{ margin: '8px 0 0' }}>
                    {(ex.muscle || 'Full Body').toUpperCase()} · {focusType.toUpperCase()}
                    {cleared ? ' · ' : ''}
                    {cleared && <span style={{ color: 'var(--q-volt-text)' }}>CLEARED</span>}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <QuestBtn sm tone="ghost" onClick={() => setSwapTarget({ exerciseIndex: ei, name: ex.sv || ex.name, originalName: ex._originalName || ex.originalName || ex.name })}>Swap</QuestBtn>
                  <QuestBtn
                    sm
                    tone={confirmRemoveIdx === ei ? 'ember' : 'ghost'}
                    aria-label="Remove exercise"
                    onClick={() => { if (confirmRemoveIdx === ei) removeExercise(ei); else setConfirmRemoveIdx(ei); }}
                  >
                    {confirmRemoveIdx === ei ? 'Sure?' : 'Del'}
                  </QuestBtn>
                </div>
              </div>

              {/* Previous session reference (cross-split lookup, same as V1/Volt) */}
              {(() => {
                const prev = getLastSessionSets(workoutLogs.filter(l => l.userId === user.id), exerciseNamePool(ex));
                if (!prev?.sets?.length) return null;
                const displaySets = prev.sets.slice(0, 3);
                return (
                  <div style={{ background: 'var(--q-slot)', border: '3px solid var(--q-border)', padding: '7px 10px', margin: '13px 0 4px', fontSize: 17, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    <span className="q-meta">PREV ({fmt(prev.date).toUpperCase()}):</span>
                    {displaySets.map((s, i) => (
                      <span key={i}>{s.reps}r × {s.weight}kg{i < displaySets.length - 1 ? ',' : ''}</span>
                    ))}
                    {prev.sets.length > 3 && <span className="q-meta">+{prev.sets.length - 3} more</span>}
                  </div>
                );
              })()}

              {/* Set grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr 96px', gap: 8, padding: '0 2px', margin: '13px 0 7px' }}>
                {['SET', 'REPS', 'KG', ''].map((h, i) => (
                  <div key={i} className="q-meta" style={{ textAlign: i === 0 ? 'center' : 'left' }}>{h}</div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {ex.sets.map((s, si) => {
                  const exName = ex.sv || ex.name;
                  const pr = prMap[exName] ?? null;
                  const isPR = s.done && beatsAllTimePR(pr, parseFloat(s.weight) || 0, parseFloat(s.reps) || 0);
                  return (
                    <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {restActive && restTimerPosition?.ei === ei && restTimerPosition?.si === si && (
                        <QuestRestTimer secondsLeft={restSecondsLeft} totalDuration={restDuration} onSkip={skipRestTimer} onExtend={extendRestTimer} />
                      )}
                      <div
                        className={s.done ? 'q-stamp' : undefined}
                        style={{
                          position: 'relative',
                          display: 'grid', gridTemplateColumns: '36px 1fr 1fr 96px', gap: 8, alignItems: 'center',
                          background: isPR ? 'var(--q-panel2)' : 'var(--q-panel)',
                          border: `3px solid ${isPR ? 'var(--q-gold)' : 'var(--q-border)'}`,
                          padding: '8px',
                          opacity: s.done && !isPR ? 0.75 : 1,
                        }}
                      >
                        {floater && floater.ei === ei && floater.si === si && (
                          <span key={floater.key} className="q-floater q-ps" style={{ fontSize: 12, color: 'var(--q-gold-text)' }}>+{floater.xp} XP</span>
                        )}
                        {isPR && (
                          <span
                            title="Personal record"
                            style={{
                              position: 'absolute', top: -12, right: 12, zIndex: 2,
                              background: 'var(--q-gold)', color: '#201803',
                              border: '2.5px solid var(--q-border)',
                              fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                              padding: '4px 7px', letterSpacing: '0.04em',
                              transform: 'rotate(-2deg)', pointerEvents: 'none',
                            }}
                          >
                            NEW PR
                          </span>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                          <span className="q-ps" style={{ fontSize: 13 }}>{si + 1}</span>
                          {ex.sets.length > 1 && (
                            <button type="button" onClick={() => rmS(ei, si)} aria-label="Remove set" style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', display: 'flex' }}>
                              <PixelSprite name="x" size={9} />
                            </button>
                          )}
                        </div>
                        <input type="number" className="q-slot-input" placeholder={s.targetRep} value={s.reps} onChange={e => upd(ei, si, 'reps', e.target.value)} aria-label={`Set ${si + 1} reps`} />
                        <input type="number" step=".5" className="q-slot-input" placeholder="--" value={s.weight} onChange={e => upd(ei, si, 'weight', e.target.value)} aria-label={`Set ${si + 1} weight in kg`} />
                        <button
                          type="button"
                          className={s.done ? 'q-btn' : 'q-btn q-btn--ember'}
                          onClick={() => { if (!s.done) questSound('set'); upd(ei, si, 'done', !s.done); }}
                          aria-label={s.done ? `Set ${si + 1} done` : `Log set ${si + 1}`}
                          style={{ minHeight: 48, padding: '8px 4px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {s.done ? <PixelSprite name="check" size={16} /> : 'HIT!'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => addS(ei)}
                style={{ marginTop: 11, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'var(--q-volt-text)', padding: '6px 2px' }}
              >
                + ADD SET
              </button>
              {ex.notes && <div className="q-meta" style={{ marginTop: 5 }}>{ex.notes}</div>}
            </QuestBlock>
          );
        })}

        {/* Add exercise */}
        <button
          type="button"
          onClick={() => { setAddExSearch(''); setAddExCat('all'); setShowAddEx(true); }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            padding: '15px 20px', cursor: 'pointer', width: '100%',
            border: '3px dashed var(--q-dim)', background: 'var(--q-panel)', color: 'var(--q-volt-text)',
            fontFamily: "'Press Start 2P', monospace", fontSize: 12,
          }}
        >
          <PixelSprite name="plus" size={13} /> ADD MOVE
        </button>

        {/* Session notes */}
        {session.notes !== undefined && (
          <QuestBlock flat>
            <QuestLabel>Battle Notes</QuestLabel>
            <textarea
              rows={2}
              placeholder="PRs, form notes, how it felt..."
              value={session.notes}
              onChange={e => setSession(p => ({ ...p, notes: e.target.value }))}
              className="q-slot-input"
              style={{ resize: 'vertical', width: '100%', textAlign: 'left', marginTop: 10, padding: 10, fontSize: 19 }}
            />
          </QuestBlock>
        )}

        {/* Finish / discard */}
        <section ref={finishBtnRef} style={{ paddingTop: 4, paddingBottom: 52 }}>
          <QuestBtn tone="ember" onClick={finish} style={{ width: '100%' }}>Finish Battle</QuestBtn>
          <button
            type="button"
            onClick={() => {
              clearPersistedSession();
              startTimeRef.current = null;
              setElapsed(0);
              setSession(null); skipRestTimer();
              setTimeout(() => window.scrollTo({ top: workoutPageCache.trackerScroll || 0, behavior: 'instant' }), 0);
            }}
            style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', padding: 12, cursor: 'pointer', fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'var(--q-ember-text)' }}
          >
            ABANDON QUEST
          </button>
        </section>

        {/* Floating live cluster */}
        <Portal>
          <div style={{ position: 'fixed', bottom: 104, left: 12, zIndex: 90, display: showAddEx ? 'none' : 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            {showFAB && (
              <button type="button" className="q-btn q-btn--sm" onClick={finish}>
                <PixelSprite name="check" size={12} /> Finish
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--q-panel)', padding: '8px 12px', border: '3px solid var(--q-border)', boxShadow: '4px 4px 0 rgba(0,0,0,0.45)' }}>
              <span className="q-blink" style={{ width: 8, height: 8, background: 'var(--q-red)' }} />
              <span className="q-ps" style={{ fontSize: 9 }}>LIVE</span>
              <span className="q-ps" style={{ fontSize: 11, color: 'var(--q-volt-text)' }}>{fmtElapsed(elapsed)}</span>
            </div>
          </div>
        </Portal>

        <QuestConfirmDialog
          open={confirmFinish}
          title="Unfinished Sets"
          message={`You have ${session?.exs?.reduce((acc, ex) => acc + ex.sets.filter(s => !s.done).length, 0) || 0} unchecked set(s). They will not be saved. Finish the battle anyway?`}
          confirmLabel="Save Partial"
          cancelLabel="Keep Fighting"
          onConfirm={doFinish}
          onCancel={() => setConfirmFinish(false)}
        />
        {swapTarget && (
          <Portal>
            <QuestSwapModal
              exerciseName={swapTarget.name}
              originalName={swapTarget.originalName}
              onSwap={(newName) => swapExercise(swapTarget.exerciseIndex, newName)}
              onClose={() => setSwapTarget(null)}
            />
          </Portal>
        )}
        <QuestAddExerciseSheet
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

  // ─── Setup branch: select your battle ──────────────────────────────────────
  return (
    <div className="q-screen">
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <QuestLabel tone="volt">{activeSplit ? activeSplit.name : 'Workout Tracker'}</QuestLabel>
            <h1 className="q-ps" style={{ fontSize: 22, margin: '10px 0 0', textTransform: 'uppercase' }}>Workout</h1>
            <p className="q-meta" style={{ margin: '8px 0 0', fontSize: 18 }}>Select your battle</p>
          </div>
          {!session && (
            <input
              type="date"
              value={pastDate}
              max={tod()}
              onChange={e => setPastDate(e.target.value)}
              aria-label="Log for date"
              className="q-slot-input"
              style={{ width: 172, minHeight: 42, fontSize: 18, marginTop: 2 }}
            />
          )}
        </div>
      </header>

      {!activeSplit ? (
        <QuestBlock style={{ textAlign: 'center', padding: 28 }}>
          <PixelSprite name="trophy" size={34} />
          <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>NO QUEST<br />SELECTED</div>
          <p className="q-meta" style={{ margin: '9px auto 16px', maxWidth: 280, fontSize: 18 }}>
            Go to Splits to select a workout program first.
          </p>
          <QuestBtn onClick={() => nav('/splits')}>Go to Splits</QuestBtn>
        </QuestBlock>
      ) : (
        <>
          {persistedSession && !session && (() => {
            const exerciseCount = persistedSession.exs?.length || 0;
            const completedSets = persistedSession.exs?.flatMap(e => e.sets).filter(s => s.done).length || 0;
            const timeAgo = formatTimeAgo(persistedSession.startTime);
            const hoursAgo = Math.floor((nowTs - persistedSession.startTime) / 3600000);

            return (
              <QuestBlock variant="panel2">
                <QuestLabel tone="ember">Continue? · Session from {hoursAgo}h ago</QuestLabel>
                <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.5, marginTop: 10 }}>
                  {persistedSession.day?.name} · {activeSplit.name}
                </div>
                <div className="q-meta" style={{ marginTop: 6, fontSize: 18 }}>
                  Started {timeAgo} · {exerciseCount} exercises · {completedSets} sets done
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 15, flexWrap: 'wrap' }}>
                  <QuestBtn
                    onClick={() => {
                      setSession(persistedSession);
                      startTimeRef.current = persistedSession.startTime;
                      setPersistedSession(null);
                    }}
                  >
                    Resume Battle
                  </QuestBtn>
                  <QuestBtn tone="ghost" onClick={() => setConfirmDiscard(true)}>Discard</QuestBtn>
                </div>
                <QuestConfirmDialog
                  open={confirmDiscard}
                  title="Discard Session?"
                  message={`This will permanently delete all ${completedSets} sets logged in this session.`}
                  confirmLabel="Discard"
                  cancelLabel="Cancel"
                  danger
                  onConfirm={() => {
                    clearPersistedSession();
                    setPersistedSession(null);
                    setConfirmDiscard(false);
                  }}
                  onCancel={() => setConfirmDiscard(false)}
                />
              </QuestBlock>
            );
          })()}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: 16 }}>
            {wDays.map(day => {
              const last = workoutLogs.filter(l => l.userId === user.id && l.dayId === day.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
              return (
                <QuestBlock key={day.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <QuestChip>{(day.subtype || day.type).toUpperCase()}</QuestChip>
                    {last && <span className="q-meta" style={{ fontSize: 15 }}>LAST {fmt(last.date).toUpperCase()}</span>}
                  </div>
                  <div className="q-ps" style={{ fontSize: 15, lineHeight: 1.5, margin: '12px 0 11px', textTransform: 'uppercase' }}>{day.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {day.exercises.slice(0, 4).map(ex => (
                      <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, background: 'var(--q-slot)', border: '3px solid var(--q-border)', padding: '7px 10px', fontSize: 18 }}>
                        <span>{ex.name}</span>
                        <span className="q-meta" style={{ flexShrink: 0 }}>{ex.sets}×{ex.repsRange}</span>
                      </div>
                    ))}
                  </div>
                  {day.exercises.length > 4 && (
                    <div className="q-meta" style={{ marginTop: 9 }}>+{day.exercises.length - 4} MORE</div>
                  )}
                  <QuestBtn onClick={() => start(day)} style={{ width: '100%', marginTop: 14 }}>Enter Battle</QuestBtn>
                </QuestBlock>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
