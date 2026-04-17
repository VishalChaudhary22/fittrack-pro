import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingDown, TrendingUp } from 'lucide-react';
import BodyFatLogModal from './BodyFatLogModal';
import { ProgressOrb, ModalPortal } from './SharedComponents';
import { clamp, kgToLbs } from '../../utils/helpers';

export default function BodyFatRingCard() {
  const { user, bodyFatLog, healthLogs } = useApp();
  const [showModal, setShowModal] = useState(false);

  // Body Fat Derived state
  const userBFLog = useMemo(() => 
    bodyFatLog
      .filter(e => e.userId === user?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  , [bodyFatLog, user?.id]);

  const latestBF = userBFLog[0] || null;
  const previousBF = userBFLog[1] || null;
  const bfGoal = user?.bodyFatGoal || null;
  
  const startBF = userBFLog.length > 0 ? userBFLog[userBFLog.length - 1].percentage : null;

  const currentPct = latestBF ? latestBF.percentage : 0;
  
  // Progress calculation — ring fills as BF% drops toward goal
  // Example: start=22%, goal=15%, current=18.5% → (22-18.5)/(22-15) = 3.5/7 = 50%
  // If current >= start (no progress or regressed) → 0%
  // If current <= goal (reached/exceeded goal) → 100%
  let fillPercentage = 0;
  if (latestBF) {
     if (bfGoal && startBF && startBF !== bfGoal) {
        if (currentPct >= startBF) {
           fillPercentage = 0; // No progress or regressed past start
        } else if (currentPct <= bfGoal) {
           fillPercentage = 100; // Goal reached or exceeded
        } else {
           fillPercentage = ((startBF - currentPct) / (startBF - bfGoal)) * 100;
        }
     } else {
        const maxScale = user?.gender === 'female' ? 40 : 35;
        fillPercentage = Math.min(100, Math.max(0, (currentPct / maxScale) * 100));
     }
  }

  // Weight Goal Derived State
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  const allUserLogs = useMemo(() => [...healthLogs].filter(l => l.userId === user.id).sort((a, b) => new Date(a.date) - new Date(b.date)), [healthLogs, user.id]);
  const latestWeight = allUserLogs.length > 0 ? allUserLogs[allUserLogs.length - 1].weight : user.weight;
  
  const goalPct = useMemo(() => {
    if (!user.weightGoal || !user.weightGoalStart) return null;
    const total = Math.abs(user.weightGoalStart - user.weightGoal);
    const done = Math.abs(user.weightGoalStart - latestWeight);
    return clamp(Math.round(done / total * 100), 0, 100);
  }, [user, latestWeight]);

  // SVG parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Let the arc be 270 degrees (open at bottom)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * fillPercentage) / 100;
  
  const bfDelta = latestBF && previousBF ? +(latestBF.percentage - previousBF.percentage).toFixed(1) : null;
  
  // For monthly delta: compare latest BF% against the last log from the PREVIOUS month
  // This way, even a single new log this month shows the change vs last month's end state
  const prevMonthLastBF = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    // Find logs from before this month
    const priorLogs = userBFLog.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() < currentYear || (d.getFullYear() === currentYear && d.getMonth() < currentMonth);
    }); // userBFLog is already sorted newest-first
    return priorLogs[0] || null; // most recent log before this month
  }, [userBFLog]);

  const bfMonthDelta = prevMonthLastBF && latestBF
    ? +(latestBF.percentage - prevMonthLastBF.percentage).toFixed(1)
    : null;

  // Trend arrow: green = moving toward goal (down), red = moving away (up)
  const trendArrow = useMemo(() => {
    if (bfDelta === null || bfDelta === undefined) return null;
    const bfUp = bfDelta > 0;
    if (!bfGoal) {
      return { up: bfUp, color: 'var(--on-surface-dim)' };
    }
    // Goal: lose body fat. Down = good (green), Up = bad (red)
    return bfUp
      ? { up: true,  color: 'var(--error)' }
      : { up: false, color: 'var(--success)' };
  }, [bfDelta, bfGoal]);

  return (
    <>
      <div className="glass-card g2" style={{ padding: 24, borderRadius: 16, border: 'none', position: 'relative', overflow: 'hidden' }}>
        
        {/* Header Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>BODY COMPOSITION</div>
            <div className="headline-lg" style={{ color: 'var(--on-surface)', marginTop: 2, lineHeight: 1.1 }}>ANALYSIS</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {bfMonthDelta !== null && (
               <span style={{ background: 'var(--primary-container)', color: 'var(--on-primary)', borderRadius: 14, padding: '6px 12px', fontSize: 10, fontWeight: 700, position: 'relative', zIndex: 1, textAlign: 'center', lineHeight: 1.2 }}>
                 {bfMonthDelta > 0 ? '+' : ''}{bfMonthDelta}% THIS<br/>MONTH
               </span>
            )}
            <button className="btn-g" style={{ padding: '6px 12px', fontSize: 10, fontWeight: 700, borderRadius: 10 }} onClick={() => setShowModal(true)}>
              + LOG BF%
            </button>
          </div>
        </div>

        {latestBF ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1, marginBottom: 8 }}>
              
              {/* Ring Section */}
              <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(135deg)' }}>
                  {/* Background Track */}
                  <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="var(--surface-container-highest)" strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round"
                  />
                  {/* Fill Track */}
                  {fillPercentage > 0 && (
                    <circle
                      cx={size / 2} cy={size / 2} r={radius}
                      fill="none" stroke="var(--primary)" strokeWidth={strokeWidth}
                      strokeDasharray={`${arcLength} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                  )}
                </svg>

                {/* Inner Ring Text */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: -8 }}>
                  {bfGoal && startBF && startBF !== bfGoal ? (
                    <>
                       <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                         {Math.round(fillPercentage)}<span style={{ fontSize: 12 }}>%</span>
                       </div>
                       <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: '0.05em', marginTop: 2 }}>to goal</div>
                    </>
                  ) : (
                    <>
                       <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                         {currentPct.toFixed(1)}<span style={{ fontSize: 12 }}>%</span>
                       </div>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Right: Current + BF Goal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                 <div>
                   <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4 }}>CURRENT</div>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                     <span style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1 }}>
                       {currentPct.toFixed(1)}
                     </span>
                     <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>%</span>
                   </div>
                 </div>
                 {bfGoal && (
                   <div>
                     <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4 }}>BF GOAL</div>
                     <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                       <span style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
                         {bfGoal}
                       </span>
                       <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>%</span>
                     </div>
                   </div>
                 )}
              </div>
            </div>

            {/* Trend line with Previous BF% overlaid */}
            <div style={{ position: 'relative', height: 75, marginBottom: user.weightGoal ? 8 : 16, zIndex: 1 }}>
              <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.35 }}>
                <path d="M 0 75 Q 120 75, 180 40 T 300 20" fill="none" stroke="var(--primary-container)" strokeWidth="3" />
              </svg>
              {previousBF && (
                <div style={{ position: 'absolute', bottom: 12, left: 16, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.6 }}>
                  {trendArrow && (
                    trendArrow.up
                      ? <TrendingUp size={14} color={trendArrow.color} />
                      : <TrendingDown size={14} color={trendArrow.color} />
                  )}
                  <span style={{ fontFamily: "'Space Grotesk'", fontSize: 14, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: '-0.02em' }}>
                    PREVIOUS
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk'", fontSize: 18, fontWeight: 700, color: 'var(--on-surface-variant)' }}>
                    {previousBF.percentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
           <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--on-surface-dim)', fontSize: 14 }}>
               Log your first body fat reading
           </div>
        )}

        {/* Weight Goal Section */}
        {user.weightGoal && (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--surface-container-highest), transparent)',
              margin: '0 0 16px 0',
              opacity: 0.4,
            }} />
            
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <ProgressOrb progress={goalPct} size={70} label={`${goalPct}%`} subLabel="Done" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                   <div>
                     <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 2 }}>START</div>
                     <div style={{ fontFamily: "'Space Grotesk'", fontSize: 14, fontWeight: 700, color: 'var(--on-surface-variant)' }}>
                       {isImpWeight ? kgToLbs(user.weightGoalStart) : user.weightGoalStart} <span style={{ fontSize: 10, fontWeight: 500 }}>{isImpWeight ? 'lbs' : 'kg'}</span>
                     </div>
                   </div>
                   <div>
                     <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 2 }}>CURRENT</div>
                     <div style={{ fontFamily: "'Space Grotesk'", fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                       {isImpWeight ? kgToLbs(latestWeight) : latestWeight} <span style={{ fontSize: 10, fontWeight: 500 }}>{isImpWeight ? 'lbs' : 'kg'}</span>
                     </div>
                   </div>
                   <div>
                     <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 2 }}>GOAL</div>
                     <div style={{ fontFamily: "'Space Grotesk'", fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                       {isImpWeight ? kgToLbs(user.weightGoal) : user.weightGoal} <span style={{ fontSize: 10, fontWeight: 500 }}>{isImpWeight ? 'lbs' : 'kg'}</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ModalPortal>
          <BodyFatLogModal open={showModal} onClose={() => setShowModal(false)} />
        </ModalPortal>
      )}
    </>
  );
}
