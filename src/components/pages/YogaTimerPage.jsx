import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RefreshCcw, Bell } from 'lucide-react';
import { PageHeader } from '../shared/SharedComponents';

const YOGA_PRESETS = [
  { id: 'surya', name: 'Surya Namaskar', poses: ['Pranamasana', 'Hastauttanasana', 'Hasta Padasana', 'Ashwa Sanchalanasana', 'Dandasana', 'Ashtanga Namaskara', 'Bhujangasana', 'Adho Mukha Svanasana', 'Ashwa Sanchalanasana', 'Hasta Padasana', 'Hastauttanasana', 'Pranamasana'], durationPerPose: 15 },
  { id: 'wind_down', name: 'Evening Wind-Down', poses: ['Balasana (Child Pose)', 'Marjaryasana (Cat Pose)', 'Bitilasana (Cow Pose)', 'Viparita Karani (Legs-up-the-wall)', 'Savasana'], durationPerPose: 45 },
  { id: 'pre_workout', name: 'Pre-Workout Activation', poses: ['Downward Dog', 'High Lunge', 'Plank', 'Cobra', 'Child Pose'], durationPerPose: 30 }
];

export default function YogaTimerPage() {
  const [activeSession, setActiveSession] = useState(null);
  const [poseIndex, setPoseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Breathwork State
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [breathTimer, setBreathTimer] = useState(0);
  
  const timerRef = useRef(null);

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

  const startSession = (preset) => {
    setActiveSession(preset);
    setPoseIndex(0);
    setTimeLeft(preset.durationPerPose);
    setIsPlaying(true);
    playBeep(1100, 0.4);
  };

  const nextPose = () => {
    if (!activeSession) return;
    if (poseIndex < activeSession.poses.length - 1) {
      setPoseIndex(p => p + 1);
      setTimeLeft(activeSession.durationPerPose);
      playBeep(880, 0.2);
    } else {
      endSession();
    }
  };

  const endSession = () => {
    setIsPlaying(false);
    setActiveSession(null);
    playBeep(1100, 0.5);
    playBeep(1300, 0.5);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(p => p - 1), 1000);
      if (timeLeft === 3) playBeep(600, 0.1); 
      if (timeLeft === 2) playBeep(600, 0.1);
      if (timeLeft === 1) playBeep(800, 0.2);
    } else if (isPlaying && timeLeft === 0) {
      nextPose();
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, timeLeft, activeSession]);

  // Box Breathing
  const startBreathing = () => {
    let p = 'inhale';
    setBreathPhase(p);
    setBreathTimer(4);
    playBeep(440, 0.3);
  };

  useEffect(() => {
    if (breathPhase !== 'idle' && breathTimer > 0) {
      timerRef.current = setTimeout(() => setBreathTimer(p => p - 1), 1000);
    } else if (breathPhase !== 'idle' && breathTimer === 0) {
      const nextP = breathPhase === 'inhale' ? 'hold_in' : breathPhase === 'hold_in' ? 'exhale' : breathPhase === 'exhale' ? 'hold_out' : 'inhale';
      setBreathPhase(nextP);
      setBreathTimer(nextP.startsWith('hold') ? 4 : 4);
      playBeep(nextP.includes('hold') ? 500 : 700, 0.2);
    }
    return () => clearTimeout(timerRef.current);
  }, [breathPhase, breathTimer]);

  return (
    <div className="pg-in">
      <PageHeader title="Yoga & Breathwork" sub="Guided mindfulness and mobility" />
      
      {activeSession ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', borderRadius: 24 }}>
          <div className="label-md" style={{ color: 'var(--primary)', marginBottom: 16 }}>{activeSession.name}</div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--on-surface)', marginBottom: 8 }}>{activeSession.poses[poseIndex]}</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>Pose {poseIndex + 1} of {activeSession.poses.length}</p>
          
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 40px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--surface-container)" strokeWidth="8" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="565.48" strokeDashoffset={565.48 * (1 - timeLeft / activeSession.durationPerPose)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--on-surface)' }}>{timeLeft}</div>
          </div>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={endSession} style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Square />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)' }}>
              <h3 className="headline-md" style={{ marginBottom: 16, fontSize: 18 }}>Guided Flexibility</h3>
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
        </>
      )}
    </div>
  );
}
