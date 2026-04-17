import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingDown, TrendingUp } from 'lucide-react';
import BodyFatLogModal from './BodyFatLogModal';

export default function BodyFatRingCard() {
  const { user, bodyFatLog } = useApp();
  const [showModal, setShowModal] = useState(false);

  // Derived state
  const userBFLog = bodyFatLog
    .filter(e => e.userId === user?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const latestBF = userBFLog[0] || null;
  const previousBF = userBFLog[1] || null;
  const bfGoal = user?.bodyFatGoal || null;

  const currentPct = latestBF ? latestBF.percentage : 0;
  
  // Progress calculation: Let's assume an arbitrary scale from 0 to 40 for the ring (if relative to absolute scale),
  // but if goal exists, maybe calculate progress towards goal from a starting point?
  // User image shows a standard completion ring. We'll show an absolute scale of 0 to 40%.
  // If BF > 40, cap at 40 (so 100% full).
  const maxScale = user?.gender === 'female' ? 40 : 35;
  const fillPercentage = currentPct > 0 ? Math.min(100, Math.max(0, (currentPct / maxScale) * 100)) : 0;

  // SVG parameters
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Let the arc be 270 degrees (open at bottom)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * fillPercentage) / 100;
  
  const bfDelta = latestBF && previousBF ? +(latestBF.percentage - previousBF.percentage).toFixed(1) : null;

  return (
    <>
      <div className="glass-card" style={{ padding: 24, borderRadius: 20, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Ring section */}
        <div style={{ position: 'relative', width: size, height: size, marginBottom: 8 }}>
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

          {/* Inner Content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: -10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Body Fat
            </div>
            {latestBF ? (
              <>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                  {currentPct.toFixed(1)}<span style={{ fontSize: 16 }}>%</span>
                </div>
                {bfDelta !== null && (
                  <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: 'var(--surface-container-highest)', color: bfDelta < 0 ? '#51CF66' : bfDelta > 0 ? '#FF6B6B' : 'var(--on-surface-dim)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    {bfDelta < 0 ? <TrendingDown size={10} /> : bfDelta > 0 ? <TrendingUp size={10} /> : null}
                    {bfDelta > 0 ? '+' : ''}{bfDelta}%
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--on-surface-dim)' }}>—</div>
            )}
          </div>
        </div>

        {/* Text Details Below Ring */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', gap: 16, borderTop: '1px solid var(--surface-container-highest)', paddingTop: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
               <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} /> CURRENT BF%
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>{latestBF ? `${currentPct.toFixed(1)}%` : '—'}</div>
          </div>
          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
               <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'transparent', border: '1px solid var(--on-surface-variant)' }} /> GOAL BF%
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>{bfGoal ? `${bfGoal}%` : 'Not set'}</div>
          </div>
        </div>

        {/* Action Button */}
        <button className="btn-p" style={{ width: '100%', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 13 }} onClick={() => setShowModal(true)}>
          + LOG MEASUREMENT
        </button>
      </div>

      <BodyFatLogModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
