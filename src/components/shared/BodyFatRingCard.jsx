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
  let goalProgress = 0;
  if (latestBF) {
     if (bfGoal && startBF && startBF !== bfGoal) {
        if (currentPct >= startBF) {
           goalProgress = 0; // No progress or regressed past start
        } else if (currentPct <= bfGoal) {
           goalProgress = 100; // Goal reached or exceeded
        } else {
           goalProgress = ((startBF - currentPct) / (startBF - bfGoal)) * 100;
        }
     } else {
        // No goal set — show BF% as a visual indicator on the ring
        const maxScale = user?.gender === 'female' ? 40 : 35;
        goalProgress = Math.min(100, Math.max(0, (currentPct / maxScale) * 100));
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
            {/* Monthly delta pill — always show if we have current BF data */}
            {latestBF && (
               <span style={{ background: 'var(--primary-container)', color: 'var(--on-primary)', borderRadius: 14, padding: '6px 12px', fontSize: 10, fontWeight: 700, position: 'relative', zIndex: 1, textAlign: 'center', lineHeight: 1.2 }}>
                 {bfMonthDelta !== null
                   ? <>{bfMonthDelta > 0 ? '+' : ''}{bfMonthDelta}% BF THIS<br/>MONTH</>
                   : <>—% BF THIS<br/>MONTH</>
                 }
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
              
              {/* BF Goal Ring — uses ProgressOrb for consistency */}
              <div style={{ flexShrink: 0 }}>
                <ProgressOrb
                  progress={clamp(Math.round(goalProgress), 0, 100)}
                  size={120}
                  label={bfGoal && startBF && startBF !== bfGoal
                    ? `${Math.round(goalProgress)}%`
                    : `${currentPct.toFixed(1)}%`
                  }
                  subLabel={bfGoal && startBF && startBF !== bfGoal ? 'to goal' : 'BF'}
                />
              </div>

              {/* Stats Right: Current + Trend + BF Goal */}
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

            {/* Trend line with Previous BF% — matches weight card layout */}
            <div style={{ position: 'relative', height: 75, marginBottom: user.weightGoal ? 8 : 16, zIndex: 1 }}>
              <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', opacity: 0.35, pointerEvents: 'none', zIndex: 0 }}>
                <path d="M 0 75 Q 120 75, 180 40 T 300 20" fill="none" stroke="var(--primary-container)" strokeWidth="3" />
              </svg>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 20, height: '100%', paddingTop: 16 }}>
                {/* Trend arrow */}
                {trendArrow && (
                  <div style={{ alignSelf: 'center', opacity: 0.9 }}>
                    {trendArrow.up
                      ? <TrendingUp size={22} color={trendArrow.color} />
                      : <TrendingDown size={22} color={trendArrow.color} />
                    }
                  </div>
                )}

                {/* Previous BF% — prominent like weight card's "PREVIOUS" section */}
                {previousBF && (
                  <div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4 }}>PREVIOUS</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--on-surface-variant)', opacity: 0.55, lineHeight: 1 }}>
                        {previousBF.percentage.toFixed(1)}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
           <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--on-surface-dim)', fontSize: 14 }}>
               Log your first body fat reading
           </div>
        )}

        {/* Weight Goal Section — enlarged to match BF% items sizing */}
        {user.weightGoal && (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--surface-container-highest), transparent)',
              margin: '0 0 16px 0',
              opacity: 0.4,
            }} />
            
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <ProgressOrb progress={goalPct} size={100} label={`${goalPct}%`} subLabel="Done" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                   <div>
                     <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4, fontWeight: 700 }}>START</div>
                     <div style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 700, color: 'var(--on-surface-variant)', lineHeight: 1.2 }}>
                       {isImpWeight ? kgToLbs(user.weightGoalStart) : user.weightGoalStart} <span style={{ fontSize: 11, fontWeight: 500 }}>{isImpWeight ? 'lbs' : 'kg'}</span>
                     </div>
                   </div>
                   <div>
                     <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4, fontWeight: 700 }}>CURRENT</div>
                     <div style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.2 }}>
                       {isImpWeight ? kgToLbs(latestWeight) : latestWeight} <span style={{ fontSize: 11, fontWeight: 500 }}>{isImpWeight ? 'lbs' : 'kg'}</span>
                     </div>
                   </div>
                   <div>
                     <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4, fontWeight: 700 }}>GOAL</div>
                     <div style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.2 }}>
                       {isImpWeight ? kgToLbs(user.weightGoal) : user.weightGoal} <span style={{ fontSize: 11, fontWeight: 500 }}>{isImpWeight ? 'lbs' : 'kg'}</span>
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
