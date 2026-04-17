import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingDown, TrendingUp } from 'lucide-react';
import BodyFatLogModal from './BodyFatLogModal';

export default function BodyFatRingCard() {
  const { user, bodyFatLog } = useApp();
  const [showModal, setShowModal] = useState(false);

  // Derived state
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
  
  // Progress calculation
  let fillPercentage = 0;
  if (latestBF) {
     if (bfGoal && startBF && startBF !== bfGoal) {
        // Goal completion mapping
        fillPercentage = Math.min(100, Math.max(0, ((startBF - currentPct) / (startBF - bfGoal)) * 100));
     } else {
        const maxScale = user?.gender === 'female' ? 40 : 35;
        fillPercentage = Math.min(100, Math.max(0, (currentPct / maxScale) * 100));
     }
  }

  // SVG parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Let the arc be 270 degrees (open at bottom)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * fillPercentage) / 100;
  
  const bfDelta = latestBF && previousBF ? +(latestBF.percentage - previousBF.percentage).toFixed(1) : null;
  
  const monthFirstBF = useMemo(() => {
    const now = new Date();
    const monthLogs = userBFLog.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort ascending by date
    return monthLogs[0] || null;
  }, [userBFLog]);

  const bfMonthDelta = monthFirstBF && latestBF
    ? +(latestBF.percentage - monthFirstBF.percentage).toFixed(1)
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
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>BODY FAT</div>
            <div className="headline-lg" style={{ color: 'var(--on-surface)', marginTop: 2, lineHeight: 1.1 }}>ANALYSIS</div>
          </div>
          {bfMonthDelta !== null && bfMonthDelta !== 0 && (
             <span style={{ background: 'var(--primary-container)', color: 'var(--on-primary)', borderRadius: 14, padding: '6px 12px', fontSize: 10, fontWeight: 700, position: 'relative', zIndex: 1, textAlign: 'center', lineHeight: 1.2 }}>
               {bfMonthDelta > 0 ? '+' : ''}{bfMonthDelta}% THIS<br/>MONTH
             </span>
          )}
        </div>
        
        <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 75, opacity: 0.35, pointerEvents: 'none', zIndex: 0 }}>
          <path d="M 0 75 Q 120 75, 180 40 T 300 20" fill="none" stroke="var(--primary-container)" strokeWidth="3" />
        </svg>

        {latestBF ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1, marginBottom: 24 }}>
            
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
                {currentPct > 0 && (
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

            {/* Stats Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div>
                   <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4 }}>CURRENT</div>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                     <span style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1 }}>
                       {currentPct.toFixed(1)}
                     </span>
                     <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>%</span>
                   </div>
                 </div>
                 
                 <div style={{ alignSelf: 'center', marginTop: 16, opacity: 0.9 }}>
                   {trendArrow && (
                     trendArrow.up
                       ? <TrendingUp size={22} color={trendArrow.color} />
                       : <TrendingDown size={22} color={trendArrow.color} />
                   )}
                 </div>
               </div>

               {previousBF && (
                 <div>
                   <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--on-surface-dim)', marginBottom: 4 }}>PREVIOUS</div>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                     <span style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 700, color: 'var(--on-surface-variant)', opacity: 0.55, lineHeight: 1 }}>
                       {previousBF.percentage.toFixed(1)}
                     </span>
                     <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>%</span>
                   </div>
                 </div>
               )}
            </div>
          </div>
        ) : (
           <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--on-surface-dim)', fontSize: 14 }}>
               Log your first body fat reading
           </div>
        )}

        {/* Footer info & Button */}
        {latestBF && bfGoal && (
           <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 16, textAlign: 'left', position: 'relative', zIndex: 1 }}>
              GOAL: <span style={{ color: 'var(--on-surface)' }}>{bfGoal}%</span>
           </div>
        )}
        
        <button className="btn-p" style={{ width: '100%', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 13, position: 'relative', zIndex: 1 }} onClick={() => setShowModal(true)}>
          + LOG MEASUREMENT
        </button>
      </div>

      <BodyFatLogModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
